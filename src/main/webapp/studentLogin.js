import { LOGGED_IN_STUDENT, Message, STATUS } from "./script.js";
import { InputVerifier } from "./InputVerifier.js";

const showMessage = Message.showMessage;
const rootWebsiteURL="SRMHostelOutpass_war_exploded"
function loginStudent(email, password) {
    showMessage("Logging in, please wait...");

    fetch(`/${rootWebsiteURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
        .then((res) =>  res.text())
        .then((data) => {

            console.log(data)
            if (data.startsWith("success")) {
                const parts = data.split("|");

                const student = {
                    name: parts[1],
                    registeredNumber: parts[2],
                    email
                };

                localStorage.setItem(LOGGED_IN_STUDENT, JSON.stringify(student));

                showMessage("Login successful. Choose an action below.", STATUS.SUCCESS);

                window.location.pathname=`${rootWebsiteURL}/student_homepage.html`

            } else {
                showMessage(
                    "Invalid credentials. Please check your email or password.",
                    STATUS.ERROR
                );
            }
        })
        .catch(() => {
                let i=0;
                const ID = setInterval(() => {
                    if(i===3)clearInterval(ID)
                        showMessage("Unable to reach the server. Please try again.", STATUS.ERROR)
                    i++;
                }, 1500);

            }
        );
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const result = InputVerifier.verifyLogin(
        "email",
        "password",
        showMessage,
        STATUS.ERROR
    );
    if (result instanceof Array) {
        loginStudent(...result);
    }
});
