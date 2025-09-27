// Default AI mode
let aiMode = 'translator'; // 'information' or 'translator'

// Cloud Translate API Key
const API_KEY = "AIzaSyAgs5otityHxR__8LF1HctnXqC7xBcDBFc";



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
function speakText(text, lang = "hi-IN") {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; // Default Hindi

    // Try to pick the matching voice
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.lang === lang);

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        console.warn(lang + " voice not found, using default.");
    }

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




// ---------------- Handle User Message ----------------
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
        // Use Google Translate API
        aiResponse = await translateText(userText, targetLang);

    } else if (aiMode === 'information') {
        try {
            // Use Gemini AI for Info Mode
            aiResponse = await getAIInfoGemini(userText);

            // Translate Gemini response if targetLang ≠ English
            if (targetLang !== 'en') {
                aiResponse = await translateText(aiResponse, targetLang);
            }
        } catch (err) {
            console.error(err);
            aiResponse = "Sorry, I couldn't fetch info at the moment.";
        }
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


// ---------------- AI Info via Gemini ----------------
const GEMINI_API_KEY = "AIzaSyBS0UYUMkYtkdrQzJ2II0kpSF-weNmIVxE";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function getAIInfoGemini(prompt) {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    if (!response.ok) throw new Error("Failed to fetch AI info");

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

window.addEventListener("beforeunload", () => {
    window.speechSynthesis.cancel();
});
