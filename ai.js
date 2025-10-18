// -----------------------------
// Integrated AI Translator + Info JS
// (LibreTranslate replaces Google Translate)
// -----------------------------

// Default AI mode
let aiMode = 'translator'; // 'information' or 'translator'

// ----- NOTE -----
// Your old Google Translate API key is commented out (expired / unsafe to keep).
// const API_KEY = "AIzaSyDhvxW4O__nOOufqcsWkqoD2RF8YFxqL68";
// -----------------

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
            <div class="message-bubble ${sender}-bubble">${escapeHtml(message)}</div>
        </div>`;
    container.innerHTML += html;
    container.scrollTop = container.scrollHeight;
}

// small helper to avoid raw HTML injection in messages
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// ---------------- TTS ----------------//
// maps short lang codes (en, hi, mr, ne, etc.) to SpeechSynthesis language tags
function getTTSLangTag(langCode) {
    const map = {
        en: "en-US",
        hi: "hi-IN",
        ne: "ne-NP",
        mr: "mr-IN",
        es: "es-ES",
        fr: "fr-FR",
        de: "de-DE",
        pt: "pt-PT",
        ru: "ru-RU",
        ar: "ar-SA",
        it: "it-IT"
        // add more mappings if you use more languages
    };
    return map[langCode] || (langCode + "-" + langCode.toUpperCase()) || "en-US";
}

function speakText(text, lang = "hi") {
    // ensure Web Speech API supported
    if (!("speechSynthesis" in window)) {
        console.warn("TTS not supported in this browser.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const ttsLangTag = getTTSLangTag(lang);
    utterance.lang = ttsLangTag;

    // pick the best matching voice (if available)
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.lang && v.lang.startsWith(ttsLangTag.split("-")[0]));
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    try {
        window.speechSynthesis.cancel(); // cancel any previous speech
        window.speechSynthesis.speak(utterance);
    } catch (err) {
        console.warn("TTS speak failed:", err);
    }
}

// ---------------- Translate (Hugging Face) ----------------
async function translateText(text, targetLang, sourceLang = "auto") {
    if (!text || !targetLang) return "No text or target language specified";

    // Map language pairs to Hugging Face models
    const langPairMap = {
        "en-hi": "Helsinki-NLP/opus-mt-en-hi",
        "hi-en": "Helsinki-NLP/opus-mt-hi-en",
        "en-ne": "Helsinki-NLP/opus-mt-en-ne",
        "ne-en": "Helsinki-NLP/opus-mt-ne-en",
        "hi-ne": "Helsinki-NLP/opus-mt-hi-ne",
        "ne-hi": "Helsinki-NLP/opus-mt-ne-hi",
        "en-en": null,
        "hi-hi": null,
        "ne-ne": null
    };

    // Normalize sourceLang
    if (sourceLang === "auto") {
        // default to English if auto-detect (optional: you could implement detection)
        sourceLang = "en";
    }

    const pairKey = `${sourceLang}-${targetLang}`;
    const modelName = langPairMap[pairKey];

    if (!modelName) return text; // same language, no translation needed

    const apiKey = "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"; // Replace with your Hugging Face API key
    const endpoint = `https://api-inference.huggingface.co/models/${modelName}`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: text })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Hugging Face Translation Error:", errText);
            return `Translation Error: ${response.status}`;
        }

        const data = await response.json();
        // Hugging Face returns [{ translation_text: "translated text" }]
        return data[0].translation_text || "Translation Error: empty response";
    } catch (err) {
        console.error("Hugging Face Fetch Error:", err);
        return "Translation Error: could not contact Hugging Face API";
    }
}



// ---------------- Handle User Message ----------------
async function sendUserMessage() {
    const inputEl = document.getElementById('messageInput');
    const userText = inputEl.value.trim();
    if (!userText) return;

    const inputLang = document.getElementById('inputLangSelect').value || "auto";
    const targetLang = document.getElementById('targetLangSelect').value || "en";

    addMessageToChat(`[${inputLang}]: ${userText}`, 'user');

    let aiResponse = '';
    if (aiMode === 'translator') {
        // Use LibreTranslate
        aiResponse = await translateText(userText, targetLang, inputLang === "auto" ? "auto" : inputLang);

    } else if (aiMode === 'information') {
        try {
            // Use Gemini AI for Info Mode (kept as-is)
            aiResponse = await getAIInfoGemini(userText);

            // Translate Gemini response if targetLang ≠ English (or not the original language)
            if (targetLang && targetLang !== 'en') {
                aiResponse = await translateText(aiResponse, targetLang, "en");
            }
        } catch (err) {
            console.error(err);
            aiResponse = "Sorry, I couldn't fetch info at the moment.";
        }
    }

    addMessageToChat(`[${targetLang}]: ${aiResponse}`, 'assistant');

    // TTS expects short code like 'hi' or 'en' — pass targetLang
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
let recognition = null;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.interimResults = false;
}

const micBtn = document.getElementById('micBtn');
if (micBtn && recognition) {
    micBtn.addEventListener('click', () => {
        const inputLang = document.getElementById('inputLangSelect').value || "en";

        // Set recognition language
        if (inputLang === 'hi') recognition.lang = 'hi-IN';
        else if (inputLang === 'ne') recognition.lang = 'ne-NP';
        else if (inputLang === 'mr') recognition.lang = 'mr-IN';
        else recognition.lang = 'en-US';

        micBtn.disabled = true;
        try {
            recognition.start();
        } catch (err) {
            console.warn("Speech recognition start failed:", err);
            micBtn.disabled = false;
        }
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
} else {
    if (micBtn) micBtn.disabled = true; // not supported
}

// ---------------- AI Mode Buttons ----------------
document.getElementById("translatorBtn").addEventListener("click", () => setAIMode("translator"));
document.getElementById("infoBtn").addEventListener("click", () => setAIMode("information"));

// --------------------Fetching the monastery (unchanged) ----------------
async function fetchMonasteries() {
    // This expects you have a firestore `db` configured elsewhere in your app
    if (typeof db === "undefined" || !db.collection) {
        console.warn("Firestore 'db' not available for fetchMonasteries()");
        return [];
    }
    const snapshot = await db.collection("monasteries").get();
    const monasteries = [];
    snapshot.forEach(doc => monasteries.push(doc.data()));
    return monasteries;
}

// ----------------------AI info via Gemini (unchanged) ------------------------
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
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
});
