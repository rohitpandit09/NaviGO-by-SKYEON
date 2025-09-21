const events = [
    {
        id: 1,
        name: "Hemis Festival",
        location: "Hemis Monastery, Ladakh", 
        date: "2024-07-12",
        time: "09:00 AM",
        description: "Annual celebration of Guru Padmasambhava with masked dances and traditional music.",
        highlights: ["Cham Dance", "Traditional Music", "Ceremonial Costumes"],
        status: "upcoming"
    },
    {
        id: 2,
        name: "Losar New Year",
        location: "Multiple Monasteries",
        date: "2024-02-25", 
        time: "06:00 AM",
        description: "Tibetan New Year celebrations with prayers, feasts, and community gatherings.",
        highlights: ["Prayer Ceremonies", "Traditional Food", "Community Feast"],
        status: "past"
    },
    {
        id: 3,
        name: "Dosmoche Festival",
        location: "Diskit Monastery",
        date: "2024-03-15",
        time: "10:30 AM", 
        description: "Victory of good over evil celebrated with ritualistic ceremonies and dances.",
        highlights: ["Ritual Dances", "Butter Sculptures", "Sacred Masks"],
        status: "past"
    },
    {
        id: 4,
        name: "Thiksey Gustor",
        location: "Thiksey Monastery",
        date: "2024-11-18",
        time: "08:00 AM",
        description: "Two-day festival featuring traditional Ladakhi culture and Buddhist teachings.",
        highlights: ["Cultural Programs", "Monastic Debates", "Art Exhibition"],
        status: "upcoming"
    },
    {
        id: 5,
        name: "Matho Nagrang",
        location: "Matho Monastery", 
        date: "2024-03-08",
        time: "11:00 AM",
        description: "Mystical festival where oracles predict the future through sacred dances.",
        highlights: ["Oracle Predictions", "Sacred Dances", "Spiritual Ceremonies"],
        status: "past"
    },
    {
        id: 6,
        name: "Spituk Gustor",
        location: "Spituk Monastery",
        date: "2024-12-05", 
        time: "09:30 AM",
        description: "Winter festival celebrating the victory of good over evil with elaborate ceremonies.",
        highlights: ["Victory Ceremonies", "Masked Dances", "Traditional Offerings"],
        status: "upcoming"
    }
];

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Generate event card
function createEventCard(event) {
    const isUpcoming = event.status === "upcoming";
    
    const card = document.createElement('div');
    card.className = `card ${isUpcoming ? '' : 'past-event'}`;
    
    const highlightsBadges = event.highlights.map(highlight => 
        `<div class="badge outline">${highlight}</div>`
    ).join('');
    
    const actionButtons = isUpcoming ? `
        <div class="event-actions">
            <button class="button outline" onclick="handleReminder('${event.name}')">
                <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                Remind Me
            </button>
            <button class="button primary" onclick="handleAddToCalendar('${event.name}', '${event.date}', '${event.time}')">
                <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                    <path d="M3 10h18"></path>
                </svg>
                Add to Calendar
            </button>
        </div>
    ` : '';
    
    card.innerHTML = `
        <div class="card-header">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div style="flex: 1;">
                    <div class="card-title" style="color: ${isUpcoming ? '#fbbf24' : '#94a3b8'};">
                        ${event.name}
                    </div>
                    <div class="card-description">
                        <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${event.location}
                    </div>
                </div>
                <div class="badge ${isUpcoming ? 'primary' : 'secondary'}">
                    ${isUpcoming ? 'Upcoming' : 'Past'}
                </div>
            </div>
        </div>
        
        <div class="card-content">
            <div class="event-meta">
                <div class="event-meta-item">
                    <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${formatDate(event.date)}
                </div>
                <div class="event-meta-item">
                    <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    ${event.time}
                </div>
            </div>
            
            <p style="font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem; color: #cbd5e1;">${event.description}</p>
            
            <div class="event-highlights">
                <p class="event-highlights-title">Highlights:</p>
                <div class="highlights-list">
                    ${highlightsBadges}
                </div>
            </div>
            
            ${actionButtons}
        </div>
    `;
    
    return card;
}

// Handle reminder functionality
function handleReminder(eventName) {
    alert(`Reminder set for ${eventName}! You'll be notified before the event.`);
    // In a real application, this would integrate with a notification system
}

// Handle add to calendar functionality
function handleAddToCalendar(eventName, eventDate, eventTime) {
    // Create a simple calendar event string
    const eventDateTime = new Date(`${eventDate} ${eventTime}`);
    const eventString = `Event: ${eventName}\nDate: ${eventDateTime.toLocaleDateString()}\nTime: ${eventDateTime.toLocaleTimeString()}`;
    
    // In a real application, this would integrate with calendar APIs
    if (navigator.share) {
        navigator.share({
            title: eventName,
            text: eventString,
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        const textArea = document.createElement('textarea');
        textArea.value = eventString;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Event details copied to clipboard!');
    }
}

// Generate events sections
function generateEvents() {
    const currentDate = new Date();
    
    // Filter events based on current date
    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= currentDate;
    });
    
    const pastEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate < currentDate;
    });
    
    // Generate upcoming events
    const upcomingContainer = document.getElementById('upcoming-events');
    upcomingContainer.innerHTML = '';
    
    if (upcomingEvents.length > 0) {
        upcomingEvents.forEach(event => {
            upcomingContainer.appendChild(createEventCard(event));
        });
    } else {
        upcomingContainer.innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem; grid-column: 1/-1;">
                <div class="card-content">
                    <svg style="width: 4rem; height: 4rem; color: #94a3b8; margin: 0 auto 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <p style="font-size: 1.125rem; color: #94a3b8; margin-bottom: 0.5rem;">No upcoming events scheduled at this time.</p>
                    <p style="font-size: 0.875rem; color: #64748b;">Check back soon for new festival announcements.</p>
                </div>
            </div>
        `;
    }
    
    // Generate past events
    const pastContainer = document.getElementById('past-events');
    pastContainer.innerHTML = '';
    
    if (pastEvents.length > 0) {
        pastEvents.forEach(event => {
            pastContainer.appendChild(createEventCard(event));
        });
    } else {
        pastContainer.innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem; grid-column: 1/-1;">
                <div class="card-content">
                    <p style="font-size: 1.125rem; color: #94a3b8;">No past events to display.</p>
                </div>
            </div>
        `;
    }
}

// Add smooth scroll behavior for better UX
function addSmoothScrolling() {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    generateEvents();
    addSmoothScrolling();
    
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards for animation
    setTimeout(() => {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }, 100);
});