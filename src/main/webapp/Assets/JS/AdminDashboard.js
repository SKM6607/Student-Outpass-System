import {CONTEXT_PATH, STATUS_CODES} from "./Utility.js";
loadAdminOutpasses()
let selectedStudent = null;
document.getElementById('search-button').addEventListener('click', (e) => {
    e.preventDefault();
    filterStudentOutpasses(document.getElementById('searchOutpass').value)
})

function filterStudentOutpasses(studentID) {
    selectedStudent = studentID;
}

function loadAdminOutpasses() {
    const container = document.getElementById("adminCards");
    if (!container) return;
    const msg = document.getElementById("message");
    if (msg) msg.innerHTML = "Loading outpass requests...";

    fetch(`${CONTEXT_PATH}/studentOutpasses`,{
        method:"POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body:"registeredNumber=*",
    })
        .then(res => res.json())
        .then(list => {

            container.innerHTML = "";
            container.style.display = "block";

            if (!list || list.length === 0) {
                container.innerHTML = "<p>No outpass requests.</p>";
                return;
            }

            const grouped = {};

            list.forEach(item => {
                if (!grouped[item.studentId]) grouped[item.studentId] = [];
                grouped[item.studentId].push(item);
            });

            Object.keys(grouped).forEach(studentId => {

                const outpasses = grouped[studentId];
                const {name, studentMobileNumber, parentMobileNumber} = outpasses[0];

                const wrapper = document.createElement("div");
                wrapper.className = "student-wrapper";

                const header = document.createElement("div");
                header.className = "student-header";
                header.innerHTML = `
        <div class="student-info">
          <b>ID:</b> ${studentId}<br>
          <b>Name:</b> ${name}<br>
          <b>Student:</b> +91 ${studentMobileNumber}<br>
          <b>Parent:</b> +91 ${parentMobileNumber}
        </div>
        <div>▼</div>
      `;

                const grid = document.createElement("div");
                grid.className = "outpass-grid";

                header.onclick = () => {
                    grid.style.display = grid.style.display === "grid" ? "none" : "grid";
                };

                outpasses.forEach(item => {
                    const card = document.createElement("div");
                    card.className = `outpass-card status-${(item.status || "pending").toLowerCase()}`;

                    card.innerHTML = `
          <p><b>Request ID:</b> ${item.requestId}</p>
          <h4>Reason: ${escapeHtml(item.reason)}</h4>
          <p><b>Type:</b> ${item.type_of_outpass || "-"}</p>
          <p><b>From:</b> ${item.expected_leaving_date} ${item.expected_leaving_time}</p>
          <p><b>To:</b> ${item.expected_return_date}</p>
          <p><b>Status:</b> ${item.status}</p>

          <div class="action-buttons">
            <button class="btn-approve-open" data-id="${item.requestId}">Approve & Open</button>
            <button class="btn-reject" data-id="${item.requestId}">Reject</button>
            <button class="btn-approve-close" data-id="${item.requestId}">Approve & Close</button>
          </div>
        `;
                    grid.appendChild(card);
                });

                wrapper.appendChild(header);
                wrapper.appendChild(grid);
                container.appendChild(wrapper);
            });
        }).catch(_ => {
        console.log("Not connected to servlet!!")
        if (document.getElementById("message"))
            document.getElementById("message").innerHTML = "Unable to load requests.";
    });
    container.querySelectorAll(".btn-approve-open").forEach(b => {
        b.addEventListener("click", () => adminAction(b.dataset.id, STATUS_CODES.APPROVED_AND_OPEN));
    });
    container.querySelectorAll(".btn-reject").forEach(b => {
        b.addEventListener("click", () => adminAction(b.dataset.id, STATUS_CODES.REJECTED));
    });
    container.querySelectorAll(".btn-approve-close").forEach(b => {
        b.addEventListener("click", () => adminAction(b.dataset.id, STATUS_CODES.APPROVED_AND_CLOSED));
    });
}

window.loadAdminOutpasses = loadAdminOutpasses;

function adminAction(requestId, action) {
    const msg = document.getElementById("message");
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