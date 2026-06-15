async function send() {

    let input = document.getElementById("msg");
    let msg = input.value;

    if (msg === "") return;

    let box = document.getElementById("messages");

    box.innerHTML += `<div class="user">👤 ${msg}</div>`;
    input.value = "";

    let res = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ message: msg })
    });

    let data = await res.json();

    // ✅ FIX: markdown formatting
    let formatted = marked.parse(data.reply);

    box.innerHTML += `<div class="bot">🤖 ${formatted}</div>`;

    box.scrollTop = box.scrollHeight;
}