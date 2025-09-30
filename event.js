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

// ---------------- Learn More ----------------
function attachLearnMoreEvents() {
  document.querySelectorAll(".learn-more-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const event = JSON.parse(btn.getAttribute("data-event"));

      let alertContent = `📌 ${event.name}\n\n`;

      if (event.details) {
        alertContent += event.details;
      } else {
        alertContent += event.description;
      }

      if (event.location) {
        alertContent += `\n\n📍 Location: ${event.location}`;
      }
      if (event.cuisines) {
        alertContent += `\n🍽 Cuisines : ${event.cuisines}`;
      }
      if (event.dresscode) {
        alertContent += `\n👗 DressCode : ${event.dresscode}`;
      }
      if (event.CE) {
        alertContent += `\n🏯 Cultural-Exhibitions : ${event.CE}`;
      }

      alert(alertContent);
    });
  });
}

// ---------------- ICS FILE DOWNLOAD ----------------
function downloadICS(event) {
  const start = new Date(`${event.date}T${event.time || "10:00"}:00`);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const formatDate = d => d.toISOString().replace(/-|:|\.\d+/g, "").split(".")[0] + "Z";

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.name}
DESCRIPTION:${event.details || event.description || ""}
LOCATION:${event.location || ""}
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.name}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------- Attach Calendar Button ----------------
async function addEventToGoogleCalendar(event) {
  try {
    console.log("🟢 Adding event to calendar:", event);

    await ensureSignIn();
    console.log("✅ User signed in");

    // 🟢 Normalize date
    let startDate;
    if (event.date && event.date.toDate) {
      startDate = event.date.toDate();
    } else {
      startDate = new Date(event.date + "T" + (event.time || "10:00") + ":00");
    }
    console.log("📅 Start Date:", startDate);

    if (isNaN(startDate.getTime())) {
      throw new Error("Invalid event date format: " + event.date);
    }

    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    console.log("⏰ End Date:", endDate);

    const gEvent = {
      summary: event.name,
      description: event.details || event.description || "",
      location: event.location || "",
      start: { dateTime: startDate.toISOString(), timeZone: "Asia/Kolkata" },
      end: { dateTime: endDate.toISOString(), timeZone: "Asia/Kolkata" }
    };

    console.log("📤 Sending Event:", gEvent);

    const response = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: gEvent
    });

    console.log("✅ Google API Response:", response);
    alert("✅ Event added to Google Calendar: " + response.result.htmlLink);

  } catch (err) {
    console.error("❌ Google Calendar API error:", err);
    alert("❌ Failed to add event: " + (err.result?.error?.message || err.message));
  }
}


// ---------------- Initialize ----------------
document.addEventListener("DOMContentLoaded", () => {
  renderEvents();
});
