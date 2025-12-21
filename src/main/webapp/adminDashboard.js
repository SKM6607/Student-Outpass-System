import {LOGGED_IN_STUDENT, Message, STATUS} from "./script.js"

loadAdminOutpasses()
function loadAdminOutpasses() {
    const container = document.getElementById("adminCards");
    if (!container) return;
    const msg = document.getElementById("message");
    if (msg) msg.innerHTML = "Loading outpass requests...";

    fetch("admin_dashboard",{method:'GET'})
        .then(res =>{
            console.log("Connected!!")
            return res.json()
        })
        .then(list => {
            console.log(list)
            container.innerHTML = "";
            if (!list || list.length === 0) {
                container.innerHTML = "<p>No outpass requests.</p>";
                if (msg) msg.innerHTML = "No requests found.";
                return;
            }

            if (msg) msg.innerHTML = ""; // clear

            list.forEach(item => {
                const card = document.createElement("div");
                card.className = "card " + ((item.status || "").toLowerCase());
                card.style.color = "#000";
                card.style.background = "#fff";
                card.style.border = "1px solid #ddd";
                card.style.padding = "12px";
                card.style.borderRadius = "8px";
                card.style.width = "320px";
                card.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)";
                card.innerHTML = `
                    <p><b>Req ID:</b> ${item.studentId}</p>
                    <h4>Student Name:${item.name}</h4>
                    <h5>Reason:${escapeHtml(item.reason)}</h5>
                    <p><b>From:</b> ${item.fromDate} &nbsp; <b>To:</b> ${item.toDate}</p>
                    <p><b>Status:</b> ${item.status || "Pending"}</p>
                    <div style="margin-top:8px; display:flex; gap:8px;">
                        <button class="btn-approve" data-id="${item.rId}">Approve</button>
                        <button class="btn-reject" data-id="${item.rId}">Reject</button>
                    </div>
                `;
                container.appendChild(card);
            });

            // attach click listeners (event delegation also possible)
            container.querySelectorAll(".btn-approve").forEach(b => {
                b.addEventListener("click", () => adminAction(b.dataset.id, "approve"));
            });
            container.querySelectorAll(".btn-reject").forEach(b => {
                b.addEventListener("click", () => adminAction(b.dataset.id, "reject"));
            });
        })
        .catch(_ => {
            console.log("Not connected to servlet!!")
            if (document.getElementById("message"))
                document.getElementById("message").innerHTML = "Unable to load requests.";
        });
}
window.loadAdminOutpasses=loadAdminOutpasses;
function adminAction(requestId, action) {
    const msg = document.getElementById("message");
    if (msg) msg.innerHTML = `${action === "approve" ? "Approving" : "Rejecting"} request ${requestId}...`;

    fetch("adminAction", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `requestId=${encodeURIComponent(requestId)}&action=${encodeURIComponent(action)}`
    })
        .then(res => res.text())
        .then(txt => {
            if (txt === "success") {
                if (msg) msg.innerHTML = "Action completed.";
                loadAdminOutpasses();
            } else {
                if (msg) msg.innerHTML = "Action failed: " + txt;
            }
        })
        .catch(e => {
            console.error(e);
            if (msg) msg.innerHTML = "Server error while performing action.";
        });
}
function escapeHtml(s) {
    if (!s) return "";
    return s.replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
}
function logoutAdmin() {
    localStorage.removeItem(LOGGED_IN_STUDENT);
    Message.showMessage("Logging you out...", STATUS.INFO);
    setTimeout(() => (window.location.href = "index.html"), 1000);
}
window.logoutAdmin=logoutAdmin