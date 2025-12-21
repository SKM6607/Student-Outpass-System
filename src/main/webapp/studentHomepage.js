import { LOGGED_IN_STUDENT } from "./script.js";

const profileBtn = document.getElementById("profileBtn");
const profileInitial = document.getElementById("profileInitial");

const studentData = JSON.parse(localStorage.getItem(LOGGED_IN_STUDENT));

if (!studentData) {
    window.location.href = "student_login.html";
}

// Set initial letter
profileInitial.textContent = studentData.name.charAt(0).toUpperCase();

// Navigate to profile page
profileBtn.addEventListener("click", () => {
    window.location.href = "student_profile.html";
});
