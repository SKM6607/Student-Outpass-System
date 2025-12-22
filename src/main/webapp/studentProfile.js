import { LOGGED_IN_STUDENT } from "./script.js";

const student = JSON.parse(localStorage.getItem(LOGGED_IN_STUDENT));

if (!student) {
    window.location.href = "student_login.html";
}

const studentDetailsDiv = document.getElementById("studentDetails");

let studentMobile = "";
let parentMobile = "";

/* ------------------ STUDENT DETAILS ------------------ */
fetch(`studentDetails`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `registeredNumber=${encodeURIComponent(student.registeredNumber)}`
})
    .then(res => res.text())
    .then(data => {
        const details = data.split('|');

        if (data.startsWith("success")) {
            studentMobile = details[1];
            parentMobile = details[2];
        } else {
            console.error(details[1]);
        }
    })
    .finally(() => {
        studentDetailsDiv.innerHTML = `
            <p><strong>Name:</strong> ${student.name}</p>
            <p><strong>Register Number:</strong> ${student.registeredNumber}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Student Mobile Number:</strong> ${studentMobile}</p>
            <p><strong>Parent Mobile Number:</strong> ${parentMobile}</p>
        `;
    });

/* ------------------ OUTPASS HISTORY ------------------ */
fetch(`student_outpasses?registeredNumber=${encodeURIComponent(student.registeredNumber)}`)
    .then(res => res.json())
    .then(data => {

        document.getElementById("outpassContainer").innerHTML = `
            <table class="outpass-table">
                <thead>
                    <tr>
                        <th>Reason</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Actual Returned Date</th>
                        <th>Approval Status</th>
                        <th>Outpass State</th>
                    </tr>
                </thead>
                <tbody id="historyTable"></tbody>
            </table>
        `;

        const historyTable = document.getElementById("historyTable");

        if (!data || data.length === 0) {
            historyTable.innerHTML = `
                <tr>
                    <td colspan="6" class="no-data">No records found</td>
                </tr>
            `;
            return;
        }

        data.forEach(o => {

            const approvalClass =
                o.status === "APPROVED" ? "status-approved" :
                    o.status === "PENDING" ? "status-pending" :
                        "status-rejected";

            const outpassStateClass =
                o.outpass_state === "OPEN" ? "status-pending" : "status-approved";

            historyTable.innerHTML += `
                <tr>
                    <td>${o.reason}</td>
                    <td>${o.from_date}</td>
                    <td>${o.to_date}</td>
                    <td>${o.actual_return_date ?? "-"}</td>
                    <td class="${approvalClass}">${o.status}</td>
                    <td class="${outpassStateClass}">${o.outpass_state}</td>
                </tr>
            `;
        });
    })
    .catch(err => {
        console.error("Error loading outpass history:", err);
    });

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.querySelector(".logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {

            // Clear all stored login/session data
            localStorage.clear();
            sessionStorage.clear();

            // Redirect to homepage / login page
            window.location.href = "index.html";
            // OR use: "student_login.html" if that is your entry page
        });
    }
});
