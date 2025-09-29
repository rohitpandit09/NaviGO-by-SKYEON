// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCQIWsrk8-w3zCAp5n3EzdVKnTaU8Pe8CQ",
  authDomain: "database-603c8.firebaseapp.com",
  projectId: "database-603c8",
  storageBucket: "database-603c8.firebasestorage.app",
  messagingSenderId: "125241237179",
  appId: "1:125241237179:web:72625856b2a733b7cb139e",
  measurementId: "G-LZSSMT5PTL"
};

// 🔹 Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ---------------- Fetch Events ----------------
async function fetchEvents() {
  try {
    const snapshot = await db.collection("events").get();
    const events = [];
    snapshot.forEach(doc => events.push({ id: doc.id, ...doc.data() }));
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// ---------------- Format Date ----------------
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

// ---------------- Create Event Card ----------------
function createEventCard(event) {
  const isUpcoming = event.status === "upcoming";

  const card = document.createElement('div');
  card.className = `event-card`;

  card.innerHTML = `
    <h3 class="event-title">${event.name}</h3>
    <p class="event-date">📅 ${formatDate(event.date)}</p>
    <p class="event-time">⏰ ${event.time || "10:00"}</p>
    <p class="event-description">${event.description}</p>
    <div class="event-actions">
      <button class="button primary learn-more-btn" data-event='${JSON.stringify(event)}'>Learn More</button>
      ${isUpcoming ? `<button class="button outline add-calendar-btn" data-event='${JSON.stringify(event)}'>Add to Calendar</button>` : ''}
    </div>
  `;
  return card;
}

// ---------------- Render Events ----------------
async function renderEvents() {
  const events = await fetchEvents();
  const upcomingContainer = document.getElementById('upcoming-events');
  const pastContainer = document.getElementById('past-events');

  upcomingContainer.innerHTML = "";
  pastContainer.innerHTML = "";

  if (events.length === 0) {
    upcomingContainer.innerHTML = "<p>No events available.</p>";
    return;
  }

  events.forEach(event => {
    const card = createEventCard(event);
    if (event.status === "upcoming") {
      upcomingContainer.appendChild(card);
    } else {
      pastContainer.appendChild(card);
    }
  });

  // Attach event buttons
  attachLearnMoreEvents();
  attachAddToCalendarEvents();
}

// ---------------- Simple Alert for Learn More ----------------
// ---------------- Dynamic Alert for Learn More ----------------
function attachLearnMoreEvents() {
  document.querySelectorAll(".learn-more-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const event = JSON.parse(btn.getAttribute("data-event"));

      // Use Firebase data dynamically
      let alertContent = `📌 ${event.name}\n\n`;

      if(event.details) {
        // If you have a 'details' field in your DB for full description
        alertContent += event.details;
      } else {
        // Fallback to description if details field not present
        alertContent += event.description;
      }

      if(event.location) {
        alertContent += `\n\n📍 Location: ${event.location}`;
      }

      if(event.cuisines){
        alertContent += `\n🍽 Cuisines : ${event.cuisines}` ;
      }

      if(event.dresscode){
        alertContent += `\n👗 DressCode : ${event.dresscode}`;
      }

      if(event.CE){
        alertContent += `\n🏯 Cultural-Exhibitions : ${event.CE}`;
      }

      alert(alertContent);
    });
  });
}


function addToCalendar(event) {
  const time = event.time || "10:00";

  // Build start & end date/time
  const start = new Date(`${event.date}T${time}:00`);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2 hours

  // Format Google Calendar datetime (YYYYMMDDTHHMMSSZ)
  const formatGoogleDate = dt =>
    dt.toISOString().replace(/-|:|\.\d+/g, "");

  const startStr = formatGoogleDate(start);
  const endStr = formatGoogleDate(end);

  // Build the Google Calendar URL
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
              `&text=${encodeURIComponent(event.name)}` +
              `&dates=${startStr}/${endStr}` +
              `&details=${encodeURIComponent(event.description || "")}` +
              `&location=${encodeURIComponent(event.location || "")}` +
              `&sf=true&output=xml`;

  // Open in new tab
  window.open(url, "_blank");
}

// ---------------- Google Calendar Setup ----------------
const CLIENT_ID = "61723859045-d7bu0vb6c13cp7phftnp98abcj24tpe9.apps.googleusercontent.com"; // from Google Cloud
const API_KEY = "AIzaSyCNvBvb9jGwAVxg2JrYF5ruIV7bI6Bv_es"; // from Google Cloud
const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

// Load GAPI client
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: [DISCOVERY_DOC],
    scope: SCOPES
  }).then(() => {
    console.log("GAPI client ready");
  }).catch(err => console.error("GAPI init error:", err));
}

gapi.load("client:auth2", initClient);

// Sign in
function ensureSignIn() {
  return gapi.auth2.getAuthInstance().signIn();
}

// ---------------- Add Event with API ----------------
async function addEventToGoogleCalendar(event) {
  try {
    await ensureSignIn();

    const time = event.time || "10:00";
    const start = new Date(`${event.date}T${time}:00`);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const gEvent = {
      summary: event.name,
      description: event.description || "",
      location: event.location || "",
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() }
    };

    const response = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: gEvent
    });

    alert("✅ Event added: " + response.result.htmlLink);
  } catch (err) {
    console.error("Google Calendar API error:", err);
    alert("❌ Failed to add event: " + (err.result?.error?.message || err.message));
  }
}


// ---------------- Pre-defined Hemis Festival Event ----------------

function addHemisFestivalToCalendar(preDefinedButtonId) {
  const btn = document.getElementById(preDefinedButtonId);
  if (!btn) return;

  const hemisFestival = {
    name: "Hemis Festival",
    description: "The Hemis Festival is a vibrant two-day celebration in Ladakh, held in honor of Guru Padmasambhava. Monks perform Cham dances wearing colorful masks and costumes, with music, rituals, and local traditions.",
    location: "Hemis Monastery, Ladakh, India",
    date: "2025-07-10", // YYYY-MM-DD format
    time: "10:00"       // 24-hour HH:mm format
  };

  btn.addEventListener("click", () => {
    // Create a proper UTC datetime
    const [year, month, day] = hemisFestival.date.split("-").map(Number);
    const [hour, minute] = hemisFestival.time.split(":").map(Number);
    const start = new Date(Date.UTC(year, month - 1, day, hour, minute));
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours

    const formatGoogleDate = dt => dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
                `&text=${encodeURIComponent(hemisFestival.name)}` +
                `&dates=${formatGoogleDate(start)}/${formatGoogleDate(end)}` +
                `&details=${encodeURIComponent(hemisFestival.description)}` +
                `&location=${encodeURIComponent(hemisFestival.location)}` +
                `&sf=true&output=xml`;

    // Open Google Calendar in a new tab
    window.open(url, "_blank");
  });
}


// ---------------- Initialize ----------------
document.addEventListener("DOMContentLoaded", () => {
  renderEvents();
  // Pass the ID of your static “Add to Calendar” button for Hemis Festival
  addHemisFestivalToCalendar("addHemisBtn");
});

function attachAddToCalendarEvents() {
  document.querySelectorAll(".add-calendar-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const event = JSON.parse(btn.getAttribute("data-event"));
      addEventToGoogleCalendar(event); // ✅ Use API instead of URL
    });
  });
}
