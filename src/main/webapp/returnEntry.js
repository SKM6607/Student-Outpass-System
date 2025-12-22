import { LOGGED_IN_STUDENT, Message, STATUS } from "./script.js";

const showMessage = Message.showMessage;

const student = JSON.parse(localStorage.getItem(LOGGED_IN_STUDENT));

if (!student) {
    window.location.href = "student_login.html";
}

// Auto-fill registered number
document.getElementById("registeredNumber").value = student.registeredNumber;

document.getElementById("returnEntryForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const returnDate = document.getElementById("returnDate").value;
    const returnTime = document.getElementById("returnTime").value;
    const remarks = document.getElementById("remarks").value || "";

    if (!returnDate || !returnTime) {
        showMessage("Please fill all required fields", STATUS.ERROR);
        return;
    }

    const returnDay = new Date(returnDate)
        .toLocaleDateString("en-US", { weekday: "long" });

    showMessage("Submitting return entry...", STATUS.INFO);

    fetch("returnEntry", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:
            `regNo=${encodeURIComponent(student.registeredNumber)}` +
            `&returnDate=${encodeURIComponent(returnDate)}` +
            `&returnDay=${encodeURIComponent(returnDay)}` +
            `&returnTime=${encodeURIComponent(returnTime)}` +
            `&remarks=${encodeURIComponent(remarks)}`
    })
        .then(res => res.text())
        .then(data => {
            if (data === "success") {
                showMessage("Return entry recorded successfully", STATUS.SUCCESS);
                setTimeout(() => {
                    window.location.href = "student_homepage.html";
                }, 1500);
            } else {
                showMessage(data || "Failed to submit return entry", STATUS.ERROR);
            }
        })
        .catch(() =>
            showMessage("Server error. Please try again.", STATUS.ERROR)
        );
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
