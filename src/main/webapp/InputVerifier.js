export class InputVerifier {
    static verifyRegistration(nameDOM, registeredNumberDOM, emailDOM, passwordDOM, callback = null, ...args) {
        if (!callback) {
            callback = alert
        }
        const name = document.getElementById(nameDOM).value.trim();
        const registeredNumber = document.getElementById(registeredNumberDOM).value.trim();
        const [email, password] = this.#verifyEmailAndPassword(emailDOM, passwordDOM, callback, ...args);
        console.log([name, registeredNumber, email, password])
        if (!registeredNumber.includes("RA")) {
            callback("Please enter a valid Register Number!", ...args);
            return null;
        }
        if (!this.#nameVerifier(name)) {
            callback("Name Field must contain only characters!", ...args);
            return null;
        }
        return [registeredNumber,name, email, password];
    }

    static #nameVerifier(name) {
        return /^[A-Za-z ]+$/.test(name);
    }

    static #verifyEmailAndPassword(emailDOM, passwordDOM, callback, ...args) {
        const email = document.getElementById(emailDOM).value.trim();
        const password = document.getElementById(passwordDOM).value.trim();
        if (!email.endsWith("@srmist.edu.in")) {
            callback("Please use your SRM email ID!", ...args);
            return null;
        }
        if (password.length < 8) {
            callback("Please set a strong password!", ...args);
            return null;
        }
        return [email, password];
    }
    static verifyLogin(emailDOM, passwordDOM, callback = null, ...args) {
        if (!callback) callback = alert
        return this.#verifyEmailAndPassword(emailDOM, passwordDOM, callback, ...args);
    }
}