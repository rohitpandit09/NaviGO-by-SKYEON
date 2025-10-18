
// Default AI mode
let aiMode = 'translator'; // 'information' or 'translator'

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

// ---------------- TTS ----------------
function getTTSLangTag(langCode) {
    const map = {
        en: "en-US",
        hi: "hi-IN",
        ne: "ne-NP",
        
    };
    return map[langCode] || "en-US";
}

function speakText(text, lang = "hi") {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getTTSLangTag(lang);

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.lang.startsWith(lang));
    if (selectedVoice) utterance.voice = selectedVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

async function translateText(text, targetLang = "en", sourceLang = "auto") {
  if (!text) return "Please enter text to translate";

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );
    const data = await response.json();

    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    } else {
      return "Translation failed. Try again.";
    }
  } catch (error) {
    console.error("Translation Error:", error);
    return "Error: Could not connect to translation service.";
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
        aiResponse = await translateText(userText, targetLang, inputLang);
    } else if (aiMode === 'information') {
        try {
            aiResponse = await getAIInfoGPT(userText); // replace Gemini with GPT/OpenAI
            if (targetLang !== 'en') {
                aiResponse = await translateText(aiResponse, targetLang, "en");
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
let recognition = null;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.interimResults = false;

    const micBtn = document.getElementById('micBtn');
    micBtn.addEventListener('click', () => {
        const inputLang = document.getElementById('inputLangSelect').value || "en";
        recognition.lang = getTTSLangTag(inputLang);
        micBtn.disabled = true;
        recognition.start();
    });

    recognition.addEventListener('result', (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('messageInput').value = transcript;
    });

    recognition.addEventListener('end', () => {
        const micBtn = document.getElementById('micBtn');
        if (micBtn) micBtn.disabled = false;
        const inputEl = document.getElementById('messageInput');
        if (inputEl.value.trim()) sendUserMessage();
    });
}

// ---------------- AI Mode Buttons ----------------
document.getElementById("translatorBtn").addEventListener("click", () => setAIMode("translator"));
document.getElementById("infoBtn").addEventListener("click", () => setAIMode("information"));

// ---------------- AI Info via GPT/OpenAI (server recommended) ----------------
async function getAIInfoGPT(prompt) {
    try {
        const response = await fetch("http://localhost:5000/get-ai-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        return data.text || "No response from AI.";
    } catch (err) {
        console.error("AI Info Error:", err);
        return "Error fetching AI info.";
    }
}

// ---------------- Cleanup ----------------
window.addEventListener("beforeunload", () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
});
