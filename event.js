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
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// ---------------- Create Event Card ----------------
function createEventCard(event) {
  const isUpcoming = event.status === "upcoming";

  const card = document.createElement('div');
  card.className = `card ${isUpcoming ? '' : 'past-event'}`;

  card.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">${event.name}</h3>
      <p class="card-description">${event.location}</p>
    </div>
    <div class="card-content">
      <div class="event-meta">
        <div class="event-meta-item">📅 ${formatDate(event.date)}</div>
        <div class="event-meta-item">⏰ ${event.time}</div>
      </div>
      <p class="monastery-description">${event.description}</p>

      ${event.highlights ? `
      <div class="event-highlights">
        <p class="event-highlights-title">Highlights:</p>
      </div>` : ''}

      <div class="event-actions">
        <a href="#" class="button primary">Learn More</a>
        ${isUpcoming ? `<a href="#" class="button outline" onclick="addToCalendar('${event.name}', '${event.description}', '${event.location}', '${event.date}', '${event.time}')">Add to Calendar</a>` : ''}

      </div>
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
}


// ---------------- Add to Google Calendar ----------------
function addToCalendar(name, description, location, date, time) {
  try {
    // Convert event date + time to proper format
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // +2 hrs default

    // Build Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(name)}&dates=${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

    // Open in new tab
    window.open(googleCalendarUrl, "_blank");
  } catch (error) {
    console.error("Error adding to Google Calendar:", error);
  }
}

function formatGoogleDate(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}


// ---------------- Initialize ----------------
document.addEventListener("DOMContentLoaded", renderEvents);
