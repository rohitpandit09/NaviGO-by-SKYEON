// Default AI mode
let aiMode = 'translator'; // 'information' or 'translator'

// Cloud Translate API Key
const API_KEY = "AIzaSyAgs5otityHxR__8LF1HctnXqC7xBcDBFc";

// OpenAI API Key
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"; // <-- put your key here

// ---------------- Mode Switching ----------------
function setAIMode(mode) {
    aiMode = mode;
    const modeText = mode === "translator"
        ? "🈂️ Translator Mode Activated"
        : "💡 AI Info Mode Activated";

    addMessageToChat(modeText, "assistant");

    // Highlight active button
    document.getElementById("translatorBtn").classList.remove("active");
    document.getElementById("infoBtn").classList.remove("active");

    if (mode === "translator") {
        document.getElementById("translatorBtn").classList.add("active");
    } else {
        document.getElementById("infoBtn").classList.add("active");
    }
}

// ---------------Send Button-----------------
document.getElementById("sendBtn").addEventListener("click", sendUserMessage);

// ---------------- Chat UI ----------------
function addMessageToChat(message, sender) {
    const container = document.getElementById("messagesContainer");
    const html = `
        <div class="message ${sender}-message">
            <div class="message-bubble ${sender}-bubble">${message}</div>
        </div>`;
    container.innerHTML += html;
    container.scrollTop = container.scrollHeight;
}

// ---------------- TTS ----------------//
function speakText(text, lang) {
    let langCode = 'en-US'; // default

    if (lang === 'hi') langCode = 'hi-IN';
    else if (lang === 'ne') langCode = 'ne-NP';
    else if (lang === 'mr') langCode = 'mr-IN';
    else langCode = 'en-US';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    window.speechSynthesis.speak(utterance);
}

// ---------------- Translate ----------------
async function translateText(text, targetLang) {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, target: targetLang }),
    });

    const data = await response.json();
    if (data.error) return `Translation Error: ${data.error.message}`;
    return data.data.translations[0].translatedText;
}

// ---------------- AI Info via OpenAI ----------------
async function getAIInfo(question, targetLang) {
    const monasteriesData = await fetchMonasteries();

    const systemPrompt = `
You are a knowledgeable assistant about monasteries in Sikkim.
Here is the monastery data: ${JSON.stringify(monasteriesData)}
Answer the user's question using ONLY this data.
`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: question }
                ],
                max_tokens: 300
            })
        });

        const data = await response.json();
        let aiResponse = data.choices[0].message.content;

        if (targetLang !== 'en') aiResponse = await translateText(aiResponse, targetLang);
        return aiResponse;

    } catch (err) {
        console.error(err);
        return "Sorry, I couldn't fetch the answer from AI.";
    }
}


// ---------------- Handle User Message ----------------
async function sendUserMessage() {
    const inputEl = document.getElementById('messageInput');
    const userText = inputEl.value.trim();
    if (!userText) return;

    const inputLang = document.getElementById('inputLangSelect').value;
    const targetLang = document.getElementById('targetLangSelect').value;

    addMessageToChat(`[${inputLang}]: ${userText}`, 'user');

    let aiResponse = '';
    if (aiMode === 'translator') {
        aiResponse = await translateText(userText, targetLang);
    } else {
        aiResponse = await getAIInfo(userText, targetLang);
    }

    addMessageToChat(`[${targetLang}]: ${aiResponse}`, 'assistant');
    speakText(aiResponse, targetLang);

    inputEl.value = '';
}

// ---------------- Quick Messages ----------------
function sendQuickMessage(msg) {
    document.getElementById('messageInput').value = msg;
    sendUserMessage();
}

// ---------------- Enter Key ----------------
document.getElementById("messageInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();  
        sendUserMessage();
    }
});

// ---------------- Voice Recognition ----------------
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false;

const micBtn = document.getElementById('micBtn');
micBtn.addEventListener('click', () => {
    const inputLang = document.getElementById('inputLangSelect').value;

    // Set recognition language
    if (inputLang === 'hi') recognition.lang = 'hi-IN';
    else if (inputLang === 'ne') recognition.lang = 'ne-NP';
    else if (inputLang === 'mr') recognition.lang = 'mr-IN';
    else recognition.lang = 'en-US';

    micBtn.disabled = true;
    recognition.start();
});

recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('messageInput').value = transcript;
});

recognition.addEventListener('end', () => {
    micBtn.disabled = false;
    const inputEl = document.getElementById('messageInput');
    if (inputEl.value.trim()) sendUserMessage();
});

// ---------------- AI Mode Buttons ----------------
document.getElementById("translatorBtn").addEventListener("click", () => setAIMode("translator"));
document.getElementById("infoBtn").addEventListener("click", () => setAIMode("information"));

// --------------------Fetching the monastary 





// ----------------------AI info------------------------

async function fetchMonasteries() {
    const snapshot = await db.collection("monasteries").get();
    const monasteries = [];
    snapshot.forEach(doc => monasteries.push(doc.data()));
    return monasteries;
}
