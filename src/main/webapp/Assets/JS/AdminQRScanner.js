const qrReader = new Html5Qrcode("qr-reader");

const outpassDetailsDiv = document.getElementById("outpassDetails");

const opIdEl = document.getElementById("opId");
const regNoEl = document.getElementById("regNo");
const studentNameEl = document.getElementById("studentName");
const reasonEl = document.getElementById("reason");
const fromDateEl = document.getElementById("fromDate");
const toDateEl = document.getElementById("toDate");
const statusEl = document.getElementById("status");

const closeBtn = document.getElementById("closeOutpassBtn");

let currentOutpassId = null;

/**
 * QR success callback
 * QR CODE SHOULD CONTAIN: outpassId (recommended)
 */
function onScanSuccess(decodedText) {
    qrReader.stop();

    currentOutpassId = decodedText.trim();

    fetch(`getOutpassDetails?outpassId=${currentOutpassId}`)
        .then(res => res.json())
        .then(data => {
            if (!data || data.error) {
                alert("Invalid or already closed outpass");
                return;
            }

            opIdEl.textContent = data.outpassId;
            regNoEl.textContent = data.registerNo;
            studentNameEl.textContent = data.studentName;
            reasonEl.textContent = data.reason;
            fromDateEl.textContent = data.fromDate;
            toDateEl.textContent = data.toDate;
            statusEl.textContent = data.status;

            outpassDetailsDiv.classList.remove("hidden");
        })
        .catch(err => {
            console.error(err);
            alert("Failed to fetch outpass details");
        });
}

/**
 * Start camera
 */
Html5Qrcode.getCameras().then(cameras => {
    if (cameras && cameras.length) {
        qrReader.start(
            cameras[0].id,
            { fps: 10, qrbox: 250 },
            onScanSuccess
        );
    }
});

/**
 * Close outpass
 */
closeBtn.addEventListener("click", () => {
    if (!currentOutpassId) return;

    if (!confirm("Confirm closing this outpass?")) return;

    fetch("closeOutpass", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `outpassId=${currentOutpassId}`
    })
        .then(res => res.text())
        .then(result => {
            if (result === "SUCCESS") {
                alert("Outpass closed successfully");
                location.reload();
            } else {
                alert("Failed to close outpass");
            }
        });
});