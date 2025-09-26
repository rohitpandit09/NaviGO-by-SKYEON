// Expert data
const experts = [
  {
    id: 1,
    name: "Yangchen Dolkar",
    title: "Senior Buddhist Scholar",
    location: "Gangtok",
    specialties: ["Tibetan Buddhism", "Meditation", "Monastery History"],
    languages: ["English", "Tibetan", "Hindi"],
    rating: 4.9,
    reviews: 156,
    experience: "25 years",
    image: "/placeholder-expert1.jpg",
    description: "Former monk at Hemis Monastery with deep knowledge of Ladakhi Buddhist traditions and meditation practices.",
    price: "₹2,500/hour",
    availability: "Available",
    verified: true
  },
  {
    id: 2,
    name: "Pema Lhamu",
    title: "Local Cultural Guide",
    location: "Pelling",
    specialties: ["Local History", "Kanchenjunga Trails", "Sikkimese Culture"],
    languages: ["English", "Nepali", "Hindi"],
    rating: 4.7,
    reviews: 98,
    experience: "12 years",
    image: "/placeholder-expert2.jpg",
    description: "Experienced cultural guide from Pelling, specializing in monastery tours and local folklore.",
    price: "₹1,800/hour",
    availability: "Available",
    verified: true
  },
  {
    id: 3,
    name: "Karma Dorjee",
    title: "Eco-Trekking Expert",
    location: "Yuksom",
    specialties: ["Himalayan Treks", "Biodiversity", "Eco-tourism"],
    languages: ["English", "Hindi", "Nepali"],
    rating: 4.8,
    reviews: 120,
    experience: "15 years",
    image: "/placeholder-expert3.jpg",
    description: "Local trek leader with deep knowledge of Dzongri and Goecha La routes, emphasizing sustainable trekking.",
    price: "₹2,200/hour",
    availability: "Available",
    verified: true
  },
  {
    id: 4,
    name: "Deki Wangmo",
    title: "Handicraft & Culture Expert",
    location: "Namchi",
    specialties: ["Sikkimese Handicrafts", "Festivals", "Local Cuisine"],
    languages: ["English", "Nepali", "Bhutia"],
    rating: 4.6,
    reviews: 87,
    experience: "10 years",
    image: "/placeholder-expert4.jpg",
    description: "Specializes in showcasing authentic Sikkimese handicrafts, traditional food, and cultural festivals.",
    price: "₹1,500/hour",
    availability: "Busy",
    verified: true
  },
  {
    id: 5,
    name: "Dorjee Sherpa",
    title: "Mountain Guide",
    location: "Lachung",
    specialties: ["High-Altitude Trekking", "Local Wildlife", "Adventure Tourism"],
    languages: ["English", "Nepali", "Hindi"],
    rating: 5.0,
    reviews: 210,
    experience: "20 years",
    image: "/placeholder-expert5.jpg",
    description: "Veteran Sherpa guide from Lachung with extensive experience leading treks in North Sikkim and beyond.",
    price: "₹3,000/hour",
    availability: "Available",
    verified: true
  }
];


// State management
let filteredExperts = [...experts];

// DOM elements
const searchInput = document.getElementById('searchInput');
const specialtyFilter = document.getElementById('specialtyFilter');
const locationFilter = document.getElementById('locationFilter');
const expertsGrid = document.getElementById('expertsGrid');

// Helper functions
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('');
}

function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += `
            <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
        `;
    }
    
    return starsHTML;
}

function createExpertCard(expert) {
    const initials = getInitials(expert.name);
    const starRating = createStarRating(expert.rating);
    const availabilityClass = expert.availability === 'Available' ? 'available' : 'busy';
    
    return `
        <div class="expert-card" data-expert-id="${expert.id}">
            <div class="expert-header">
                <div class="expert-info">
                    <div class="expert-avatar-container">
                        <div class="expert-avatar-fallback">
                            ${initials}
                        </div>
                        ${expert.verified ? `
                            <div class="verified-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="m9 12 2 2 4-4"/>
                                    <path d="M21 12c.552 0 1.005-.449.95-.998a10.002 10.002 0 0 0-19.9 0c-.055.549.398.998.95.998h18z"/>
                                </svg>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="expert-details">
                        <h3 class="expert-name">${expert.name}</h3>
                        <p class="expert-title">${expert.title}</p>
                        
                        <div class="expert-rating">
                            <div class="rating-stars">
                                ${starRating}
                                <span class="rating-text">${expert.rating}</span>
                                <span class="reviews-count">(${expert.reviews})</span>
                            </div>
                            <div class="availability-badge ${availabilityClass}">
                                ${expert.availability}
                            </div>
                        </div>
                        
                        <div class="expert-location">
                            <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            ${expert.location}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="expert-content">
                <p class="expert-description">${expert.description}</p>
                
                <div class="specialties-section">
                    <h4>Specialties:</h4>
                    <div class="specialties-list">
                        ${expert.specialties.map(specialty => 
                            `<span class="specialty-badge">${specialty}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="expert-meta">
                    <div class="meta-item">
                        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                        <span>${expert.languages.length} languages</span>
                    </div>
                    <div class="meta-item">
                        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="m22 21-3-3m0 0-3-3m3 3 3-3m-3 3-3 3"/>
                        </svg>
                        <span>${expert.experience} exp</span>
                    </div>
                </div>
                
                <div class="expert-footer">
                    <span class="expert-price">${expert.price}</span>
                    <div class="expert-actions">
                        <button class="btn btn-outline" onclick="chatWithExpert(${expert.id})">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            Chat
                        </button>
                        <button 
                            class="btn btn-primary" 
                            onclick="bookExpert(${expert.id})"
                            ${expert.availability === 'Busy' ? 'disabled' : ''}
                        >
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            Book
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderExperts() {
    if (filteredExperts.length === 0) {
        expertsGrid.innerHTML = `
            <div class="no-results">
                <h3>No experts found</h3>
                <p>Try adjusting your search criteria or filters</p>
            </div>
        `;
        return;
    }
    
    expertsGrid.innerHTML = filteredExperts
        .map(expert => createExpertCard(expert))
        .join('');
}

function filterExperts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedSpecialty = specialtyFilter.value.toLowerCase();
    const selectedLocation = locationFilter.value.toLowerCase();
    
    filteredExperts = experts.filter(expert => {
        const matchesSearch = !searchTerm || 
            expert.name.toLowerCase().includes(searchTerm) ||
            expert.title.toLowerCase().includes(searchTerm) ||
            expert.description.toLowerCase().includes(searchTerm) ||
            expert.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm));
        
        const matchesSpecialty = !selectedSpecialty ||
            expert.specialties.some(specialty => 
                specialty.toLowerCase().includes(selectedSpecialty)
            );
        
        const matchesLocation = !selectedLocation ||
            expert.location.toLowerCase().includes(selectedLocation);
        
        return matchesSearch && matchesSpecialty && matchesLocation;
    });
    
    renderExperts();
}

// Event handlers
function chatWithExpert(expertId) {
    const expert = experts.find(e => e.id === expertId);
    if (expert) {
        alert(`Starting chat with ${expert.name}...`);
        // In a real application, this would open a chat interface
    }
}

function bookExpert(expertId) {
    const expert = experts.find(e => e.id === expertId);
    if (expert && expert.availability === 'Available') {
        alert(`Booking session with ${expert.name}...`);
        // In a real application, this would open a booking form
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initial render
    renderExperts();
    
    // Search and filter events
    searchInput.addEventListener('input', filterExperts);
    specialtyFilter.addEventListener('change', filterExperts);
    locationFilter.addEventListener('change', filterExperts);
    
    // Add some interactive feedback
    document.querySelectorAll('.expert-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Additional utility functions
function clearFilters() {
    searchInput.value = '';
    specialtyFilter.value = '';
    locationFilter.value = '';
    filteredExperts = [...experts];
    renderExperts();
}

// Simulate loading state
function showLoading() {
    expertsGrid.innerHTML = '<div class="loading">Loading experts...</div>';
}

// Export functions for potential external use
window.expertsApp = {
    experts,
    filteredExperts,
    renderExperts,
    filterExperts,
    clearFilters,
    chatWithExpert,
    bookExpert
};