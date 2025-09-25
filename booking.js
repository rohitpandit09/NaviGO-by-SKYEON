class BookingSystem {
    constructor() {
        this.bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        this.selectedOption = null;
        
        this.initializeElements();
        this.bindEvents();
        this.setupMockData();
        this.updateBookingHistory();
    }

    initializeElements() {
        // Navigation
        this.bookingTab = document.getElementById('bookingTab');
        this.historyTab = document.getElementById('historyTab');
        this.bookingSection = document.getElementById('bookingSection');
        this.historySection = document.getElementById('historySection');
        
        // Booking form elements
        this.bookingForm = document.getElementById('bookingForm');
        this.bookingType = document.getElementById('bookingType');
        this.destination = document.getElementById('destination');
        this.travelDate = document.getElementById('travelDate');
        this.travelers = document.getElementById('travelers');
        
        // Results and booking
        this.optionsContainer = document.getElementById('optionsContainer');
        this.optionsList = document.getElementById('optionsList');
        this.bookingDetails = document.getElementById('bookingDetails');
        this.selectedOptionDiv = document.getElementById('selectedOption');
        this.confirmBookingBtn = document.getElementById('confirmBooking');
        
        // History
        this.bookingHistory = document.getElementById('bookingHistory');
    }

    bindEvents() {
        // Navigation
        this.bookingTab.addEventListener('click', (e) => this.switchTab(e, 'booking'));
        this.historyTab.addEventListener('click', (e) => this.switchTab(e, 'history'));
        
        // Form submission
        this.bookingForm.addEventListener('submit', (e) => this.searchOptions(e));
        
        // Booking confirmation
        this.confirmBookingBtn.addEventListener('click', () => this.confirmBooking());
        
        // Set minimum date to today
        this.travelDate.min = new Date().toISOString().split('T')[0];
    }

    setupMockData() {
        this.mockData = {
            flight: [
                {
                    id: 'FL001',
                    provider: 'SkyWings Airlines',
                    departure: '10:30 AM',
                    arrival: '2:45 PM',
                    duration: '4h 15m',
                    price: 299,
                    stops: 'Non-stop',
                    aircraft: 'Boeing 737'
                },
                {
                    id: 'FL002',
                    provider: 'CloudJet Airways',
                    departure: '6:15 AM',
                    arrival: '11:30 AM',
                    duration: '5h 15m',
                    price: 199,
                    stops: '1 Stop',
                    aircraft: 'Airbus A320'
                },
                {
                    id: 'FL003',
                    provider: 'Eagle Express',
                    departure: '8:00 PM',
                    arrival: '11:20 PM',
                    duration: '3h 20m',
                    price: 399,
                    stops: 'Non-stop',
                    aircraft: 'Boeing 787'
                }
            ],
            train: [
                {
                    id: 'TR001',
                    provider: 'Express Rail',
                    departure: '7:00 AM',
                    arrival: '3:30 PM',
                    duration: '8h 30m',
                    price: 89,
                    class: 'First Class',
                    amenities: 'WiFi, Meals'
                },
                {
                    id: 'TR002',
                    provider: 'Metro Connect',
                    departure: '2:15 PM',
                    arrival: '9:45 PM',
                    duration: '7h 30m',
                    price: 65,
                    class: 'Standard',
                    amenities: 'WiFi'
                }
            ],
            bus: [
                {
                    id: 'BS001',
                    provider: 'Comfort Lines',
                    departure: '9:00 AM',
                    arrival: '7:30 PM',
                    duration: '10h 30m',
                    price: 45,
                    type: 'AC Sleeper',
                    amenities: 'WiFi, Charging'
                },
                {
                    id: 'BS002',
                    provider: 'Highway Express',
                    departure: '11:30 PM',
                    arrival: '8:00 AM',
                    duration: '8h 30m',
                    price: 35,
                    type: 'Semi-sleeper',
                    amenities: 'Charging'
                }
            ],
            cab: [
                {
                    id: 'CB001',
                    provider: 'RideNow',
                    type: 'Sedan',
                    duration: '2h 45m',
                    price: 120,
                    rating: '4.8',
                    features: 'AC, GPS'
                },
                {
                    id: 'CB002',
                    provider: 'QuickCabs',
                    type: 'SUV',
                    duration: '2h 30m',
                    price: 180,
                    rating: '4.9',
                    features: 'AC, GPS, WiFi'
                }
            ],
            hotel: [
                {
                    id: 'HT001',
                    provider: 'Grand Palace Hotel',
                    type: 'Deluxe Room',
                    checkIn: '3:00 PM',
                    checkOut: '11:00 AM',
                    price: 150,
                    rating: '4.5',
                    amenities: 'Pool, Spa, Gym'
                },
                {
                    id: 'HT002',
                    provider: 'Budget Stay Inn',
                    type: 'Standard Room',
                    checkIn: '2:00 PM',
                    checkOut: '12:00 PM',
                    price: 80,
                    rating: '4.2',
                    amenities: 'WiFi, Breakfast'
                },
                {
                    id: 'HT003',
                    provider: 'Luxury Suites',
                    type: 'Executive Suite',
                    checkIn: '4:00 PM',
                    checkOut: '11:00 AM',
                    price: 300,
                    rating: '4.8',
                    amenities: 'Pool, Spa, Concierge'
                }
            ]
        };
    }

    switchTab(e, tab) {
        e.preventDefault();
        
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Show/hide sections
        if (tab === 'booking') {
            this.bookingSection.classList.remove('hidden');
            this.historySection.classList.add('hidden');
        } else {
            this.bookingSection.classList.add('hidden');
            this.historySection.classList.remove('hidden');
            this.updateBookingHistory();
        }
    }

    searchOptions(e) {
        e.preventDefault();
        
        const formData = {
            type: this.bookingType.value,
            destination: this.destination.value,
            date: this.travelDate.value,
            travelers: parseInt(this.travelers.value)
        };
        
        if (!formData.type || !formData.destination || !formData.date) {
            alert('Please fill in all required fields');
            return;
        }
        
        this.displayOptions(formData);
    }

    displayOptions(searchData) {
        const options = this.mockData[searchData.type] || [];
        
        this.optionsContainer.classList.remove('hidden');
        this.bookingDetails.classList.add('hidden');
        
        if (options.length === 0) {
            this.optionsList.innerHTML = `
                <div class="empty-state">
                    <p>No options available for ${searchData.type} to ${searchData.destination}</p>
                </div>
            `;
            return;
        }
        
        this.optionsList.innerHTML = options.map(option => 
            this.createOptionCard(option, searchData)
        ).join('');
        
        // Bind click events to option cards
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', () => this.selectOption(card));
        });
    }

    createOptionCard(option, searchData) {
        const totalPrice = option.price * searchData.travelers;
        
        let detailsHTML = '';
        
        switch (searchData.type) {
            case 'flight':
                detailsHTML = `
                    <div class="option-detail">🛫 ${option.departure}</div>
                    <div class="option-detail">🛬 ${option.arrival}</div>
                    <div class="option-detail">⏱️ ${option.duration}</div>
                    <div class="option-detail">✈️ ${option.aircraft}</div>
                    <div class="option-detail">🎯 ${option.stops}</div>
                `;
                break;
            case 'train':
                detailsHTML = `
                    <div class="option-detail">🚂 ${option.departure}</div>
                    <div class="option-detail">🏁 ${option.arrival}</div>
                    <div class="option-detail">⏱️ ${option.duration}</div>
                    <div class="option-detail">🎫 ${option.class}</div>
                    <div class="option-detail">🛜 ${option.amenities}</div>
                `;
                break;
            case 'bus':
                detailsHTML = `
                    <div class="option-detail">🚌 ${option.departure}</div>
                    <div class="option-detail">🏁 ${option.arrival}</div>
                    <div class="option-detail">⏱️ ${option.duration}</div>
                    <div class="option-detail">🛏️ ${option.type}</div>
                    <div class="option-detail">🛜 ${option.amenities}</div>
                `;
                break;
            case 'cab':
                detailsHTML = `
                    <div class="option-detail">🚗 ${option.type}</div>
                    <div class="option-detail">⏱️ ${option.duration}</div>
                    <div class="option-detail">⭐ ${option.rating}/5</div>
                    <div class="option-detail">🛜 ${option.features}</div>
                `;
                break;
            case 'hotel':
                detailsHTML = `
                    <div class="option-detail">🏨 ${option.type}</div>
                    <div class="option-detail">📥 Check-in: ${option.checkIn}</div>
                    <div class="option-detail">📤 Check-out: ${option.checkOut}</div>
                    <div class="option-detail">⭐ ${option.rating}/5</div>
                    <div class="option-detail">🎯 ${option.amenities}</div>
                `;
                break;
        }
        
        return `
            <div class="option-card" data-option='${JSON.stringify({...option, searchData})}'>
                <div class="option-header">
                    <h4 class="option-title">${option.provider}</h4>
                    <div class="option-price">$${totalPrice}</div>
                </div>
                <div class="option-details">
                    ${detailsHTML}
                </div>
            </div>
        `;
    }

    selectOption(cardElement) {
        // Remove previous selection
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Select current option
        cardElement.classList.add('selected');
        
        // Store selected option data
        this.selectedOption = JSON.parse(cardElement.dataset.option);
        
        // Show booking details
        this.showBookingDetails();
    }

    showBookingDetails() {
        if (!this.selectedOption) return;
        
        const option = this.selectedOption;
        const searchData = option.searchData;
        const totalPrice = option.price * searchData.travelers;
        
        this.selectedOptionDiv.innerHTML = `
            <div class="booking-summary">
                <h4>${option.provider}</h4>
                <div class="summary-grid">
                    <div><strong>Type:</strong> ${searchData.type.charAt(0).toUpperCase() + searchData.type.slice(1)}</div>
                    <div><strong>Destination:</strong> ${searchData.destination}</div>
                    <div><strong>Date:</strong> ${new Date(searchData.date).toLocaleDateString()}</div>
                    <div><strong>Travelers:</strong> ${searchData.travelers}</div>
                    <div><strong>Price per person:</strong> $${option.price}</div>
                    <div><strong>Total Price:</strong> $${totalPrice}</div>
                </div>
            </div>
        `;
        
        // Add summary grid styles
        if (!document.getElementById('summaryStyles')) {
            const style = document.createElement('style');
            style.id = 'summaryStyles';
            style.textContent = `
                .booking-summary h4 {
                    color: #333;
                    margin-bottom: 15px;
                    font-size: 1.3rem;
                }
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                .summary-grid div {
                    padding: 8px 0;
                    border-bottom: 1px solid #e9ecef;
                }
            `;
            document.head.appendChild(style);
        }
        
        this.bookingDetails.classList.remove('hidden');
    }

    confirmBooking() {
        if (!this.selectedOption) return;
        
        const booking = {
            id: 'BK' + Date.now().toString().substr(-8),
            ...this.selectedOption,
            bookedAt: new Date().toISOString(),
            status: 'confirmed'
        };
        
        // Save to localStorage
        this.bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(this.bookings));
        
        // Show success message
        alert(`Booking confirmed! Your booking ID is: ${booking.id}`);
        
        // Reset form and hide sections
        this.bookingForm.reset();
        this.optionsContainer.classList.add('hidden');
        this.bookingDetails.classList.add('hidden');
        this.selectedOption = null;
        
        // Update minimum date
        this.travelDate.min = new Date().toISOString().split('T')[0];
    }

    updateBookingHistory() {
        if (this.bookings.length === 0) {
            this.bookingHistory.innerHTML = `
                <div class="empty-state">
                    <p>📅 No bookings yet</p>
                    <p>Start planning your next adventure!</p>
                </div>
            `;
            return;
        }
        
        // Sort bookings by date (newest first)
        const sortedBookings = [...this.bookings].sort((a, b) => 
            new Date(b.bookedAt) - new Date(a.bookedAt)
        );
        
        this.bookingHistory.innerHTML = sortedBookings.map(booking => 
            this.createHistoryCard(booking)
        ).join('');
        
        // Bind cancel buttons
        document.querySelectorAll('.cancel-booking').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookingId = e.target.dataset.bookingId;
                this.cancelBooking(bookingId);
            });
        });
    }

    createHistoryCard(booking) {
        const searchData = booking.searchData;
        const totalPrice = booking.price * searchData.travelers;
        const bookingDate = new Date(booking.bookedAt).toLocaleDateString();
        
        return `
            <div class="history-card">
                <div class="history-info">
                    <h4>${booking.provider}</h4>
                    <p><span class="booking-id">${booking.id}</span></p>
                    <p><strong>Type:</strong> ${searchData.type.charAt(0).toUpperCase() + searchData.type.slice(1)}</p>
                    <p><strong>Destination:</strong> ${searchData.destination}</p>
                    <p><strong>Date:</strong> ${new Date(searchData.date).toLocaleDateString()}</p>
                    <p><strong>Travelers:</strong> ${searchData.travelers}</p>
                    <p><strong>Total:</strong> $${totalPrice}</p>
                    <p><strong>Booked:</strong> ${bookingDate}</p>
                    <span class="status ${booking.status === 'confirmed' ? 'status-confirmed' : 'status-cancelled'}">
                        ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                </div>
                <div class="history-actions">
                    ${booking.status === 'confirmed' ? 
                        `<button class="btn btn-danger cancel-booking" data-booking-id="${booking.id}">Cancel</button>` : 
                        '<span style="color: #666;">Cancelled</span>'
                    }
                    <button class="btn btn-info" onclick="alert('Feature coming soon!')">View Details</button>
                </div>
            </div>
        `;
    }

    cancelBooking(bookingId) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
            if (bookingIndex !== -1) {
                this.bookings[bookingIndex].status = 'cancelled';
                localStorage.setItem('bookings', JSON.stringify(this.bookings));
                this.updateBookingHistory();
                alert('Booking cancelled successfully');
            }
        }
    }
}

// Initialize the booking system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BookingSystem();
});