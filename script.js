function randomizeName() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randomStr = "";
    for (let i = 0; i < 6; i++) {
        randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('clientName').value = "user_" + randomStr;
}

function submitForm() {
    const name = document.getElementById('clientName').value;
    alert("Ulanyjy üstünlikli döredildi: " + name);
}
