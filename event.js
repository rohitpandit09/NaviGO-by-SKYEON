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

    // Attach event listeners to buttons
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

// ---------------- Add to Google Calendar (same tab) ----------------
function addEventToGoogleCalendar(event) {
    console.log("Processing this event for calendar:", event);

    const eventStart = new Date(event.date);

    if (isNaN(eventStart.getTime())) {
        alert("Sorry, the event's date is invalid.");
        console.error("Invalid date:", event.date);
        return;
    }
    
    if (event.time && typeof event.time === 'string') {
        const [hours, minutes] = event.time.split(':');
        if (hours !== undefined && minutes !== undefined) {
            eventStart.setHours(parseInt(hours, 10));
            eventStart.setMinutes(parseInt(minutes, 10));
            eventStart.setSeconds(0);
        }
    }

    const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000); // default 1 hour

    function formatGoogleDate(date) {
        return date.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, -1);
    }

    const googleStartDate = formatGoogleDate(eventStart);
    const googleEndDate = formatGoogleDate(eventEnd);

    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
    const calendarUrl = `${baseUrl}&text=${encodeURIComponent(event.name)}&dates=${googleStartDate}/${googleEndDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location || '')}`;
    
    console.log("Generated Calendar URL:", calendarUrl);

    // ✅ open in the same tab
    window.location.href = calendarUrl;
}




// ---------------- Attach Calendar Button Listeners ----------------
function attachAddToCalendarEvents() {
    document.querySelectorAll(".add-calendar-btn").forEach(btn => {
        btn.addEventListener("click", async e => {
            e.preventDefault();
            const event = JSON.parse(btn.getAttribute("data-event"));
            addEventToGoogleCalendar(event); // This will now work
        });
    });
}


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

// ---------------- Format Date for Display ----------------
function formatDate(dateInput) {
    let date;
    // Handle Firebase Timestamp objects
    if (dateInput && typeof dateInput.toDate === 'function') {
        date = dateInput.toDate();
    } else {
        date = new Date(dateInput);
    }
    // Check if the created date is valid
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

// ---------------- Create Event Card HTML ----------------
function createEventCard(event) {
    const isUpcoming = event.status === "upcoming";

    // Create a copy of the event to safely modify for the data attribute
    const eventDataForButton = { ...event };
    if (event.date && typeof event.date.toDate === 'function') {
        // Convert Firebase Timestamp to a standard ISO string, which is reliable
        eventDataForButton.date = event.date.toDate().toISOString();
    }
    // If event.date is already a string, we pass it as-is

    const card = document.createElement('div');
    card.className = `event-card`;

    card.innerHTML = `
        <h3 class="event-title">${event.name}</h3>
        <p class="event-date">📅 ${formatDate(event.date)}</p>
        <p class="event-time">⏰ ${event.time || "10:00"}</p>
        <p class="event-description">${event.description}</p>
        <div class="event-actions">
        <button class="button primary learn-more-btn" data-event='${JSON.stringify(eventDataForButton)}'>Learn More</button>
        ${isUpcoming ? `<button class="button outline add-calendar-btn" data-event='${JSON.stringify(eventDataForButton)}'>Add to Calendar</button>` : ''}
        </div>
    `;
    return card;
}

// ---------------- Render All Events ----------------
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

    attachLearnMoreEvents();
    attachAddToCalendarEvents();
}

// ---------------- Learn More Button Logic ----------------
function attachLearnMoreEvents() {
    document.querySelectorAll(".learn-more-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const event = JSON.parse(btn.getAttribute("data-event"));
            let alertContent = `📌 ${event.name}\n\n${event.details || event.description}`;
            if (event.location) alertContent += `\n\n📍 Location: ${event.location}`;
            alert(alertContent);
        });
    });
}

// ---------------- [CORRECTED FUNCTION] Add to Google Calendar ----------------
function addEventToGoogleCalendar(event) {
    console.log("Processing this event for calendar:", event);

    // Create a Date object from the event.date string.
    const eventStart = new Date(event.date);

    // --- CRITICAL FIX ---
    // Immediately check if the date is valid. If not, stop the function.
    if (isNaN(eventStart.getTime())) {
        alert("Sorry, the event's date is in an unrecognized format and a calendar link could not be created.");
        console.error("CRITICAL ERROR: Invalid date created from event.date value:", event.date);
        return; // Stop execution to prevent crash
    }
    
    // If a separate `time` field exists (e.g., "14:30"), apply it.
    if (event.time && typeof event.time === 'string') {
        const [hours, minutes] = event.time.split(':');
        if (hours !== undefined && minutes !== undefined) {
            eventStart.setHours(parseInt(hours, 10));
            eventStart.setMinutes(parseInt(minutes, 10));
            eventStart.setSeconds(0);
        }
    }
    
    // Assume a 1-hour duration for the event
    const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000);

    // Helper function to format the valid date for the Google Calendar URL
    function formatGoogleDate(date) {
        return date.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, -1);
    }

    const googleStartDate = formatGoogleDate(eventStart);
    const googleEndDate = formatGoogleDate(eventEnd);

    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
    const calendarUrl = `${baseUrl}&text=${encodeURIComponent(event.name)}&dates=${googleStartDate}/${googleEndDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location || '')}`;
    
    console.log("Generated Calendar URL:", calendarUrl);

    window.open(calendarUrl, '_blank');
}

// ---------------- Attach Calendar Button Listeners ----------------
function attachAddToCalendarEvents() {
    document.querySelectorAll(".add-calendar-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const event = JSON.parse(btn.getAttribute("data-event"));
            addEventToGoogleCalendar(event);
        });
    });
}

// ---------------- Initializer ----------------
document.addEventListener("DOMContentLoaded", () => {
    renderEvents();
});