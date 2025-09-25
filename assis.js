// assis.js

// DOM Elements
const messagesContainer = document.getElementById("messagesContainer");
const messageInput = document.getElementById("messageInput");
const targetLangSelect = document.getElementById("targetLangSelect");
const typingIndicator = document.getElementById("typingIndicator");
const micBtn = document.getElementById("micBtn");

// Speech Recognition (for voice input)
let recognition;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    messageInput.value = transcript;
    sendUserMessage();
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);
  };
} else {
  alert("Your browser does not support Speech Recognition");
}

// Event for mic button
micBtn.addEventListener("click", () => {
  if (recognition) recognition.start();
});

// Add user message
function addMessage(text, sender = "user") {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`;

  messageDiv.innerHTML = `
    <div class="message-content">
      <div class="message-bubble ${sender}-bubble">
        <p>${text}</p>
        <span class="timestamp">${new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  `;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle Enter key press
function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendUserMessage();
  }
}

// Send user message
async function sendUserMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  messageInput.value = "";

  // Show typing
  typingIndicator.classList.remove("hidden");

  // Translate and get assistant reply
  const targetLang = targetLangSelect.value;
  const translatedText = await translateText(text, targetLang);

  setTimeout(() => {
    typingIndicator.classList.add("hidden");
    addMessage(translatedText, "assistant");
    speakText(translatedText, targetLang);
  }, 1200);
}

// Quick message shortcuts
function sendQuickMessage(msg) {
  messageInput.value = msg;
  sendUserMessage();
}

// Simple translation API (LibreTranslate demo)
async function translateText(text, targetLang) {
  try {
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: targetLang,
        format: "text"
      })
    });
    const data = await res.json();
    return data.translatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // fallback
  }
}

// Text-to-Speech
function speakText(text, lang) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    // Map language codes
    if (lang === "hi") utterance.lang = "hi-IN";
    else if (lang === "ne") utterance.lang = "ne-NP";
    else utterance.lang = "en-US";

    window.speechSynthesis.speak(utterance);
  }
}
