// ===== BOOKING JAVASCRIPT FILE =====
// HostelHub - Booking functionality

class BookingSystem {
    constructor() {
        this.hostels = [];
        this.filteredHostels = [];
        this.selectedHostel = null;
        this.init();
    }

    init() {
        this.loadHostels();
        this.setupEventListeners();
        this.setupModal();
    }

    loadHostels() {
        this.hostels = [
            {
                id: 1,
                name: "University Hall 1",
                location: "On Campus",
                rating: 4.8,
                reviews: 120,
                image: "image/uenr.Hall1.jpg",
                amenities: ["wifi", "study_desk", "shared_bathroom"],
                description: "On-campus accommodation with 4-person rooms. Perfect for academic focus.",
                roomTypes: ["4-person"],
                pricing: {
                    "4-person": 3000
                }
            },
            {
                id: 2,
                name: "University Hall 2",
                location: "On Campus",
                rating: 4.6,
                reviews: 89,
                image: "image/hall2.jpg",
                amenities: ["wifi", "study_desk", "shared_bathroom"],
                description: "On-campus residence with flexible room options and excellent study facilities.",
                roomTypes: ["4-person", "2-person"],
                pricing: {
                    "4-person": 3500,
                    "2-person": 4000
                }
            },
            {
                id: 3,
                name: "Credit Union Hostel",
                location: "Off Campus",
                rating: 4.9,
                reviews: 156,
                image: "image/credit.webp",
                amenities: ["wifi", "study_desk", "shared_bathroom"],
                description: "Off-campus hostel with flexible room options: 2 or 3-person rooms.",
                roomTypes: ["3-person", "2-person"],
                pricing: {
                    "3-person": 2800,
                    "2-person": 3000
                }
            }
        ];
        
        this.filteredHostels = [...this.hostels];
        this.renderHostels();
    }

    setupEventListeners() {
        const searchForm = document.querySelector('.booking-search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }

        const sortSelect = document.getElementById('sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.sortHostels();
            });
        }
    }

    setupModal() {
        const modal = document.getElementById('booking-modal');
        const closeBtn = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-booking');
        const bookingForm = document.getElementById('booking-form');
        const roomTypeSelect = document.getElementById('room-type');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleBooking();
            });
        }

        if (roomTypeSelect) {
            roomTypeSelect.addEventListener('change', () => {
                this.updateBookingSummary();
            });
        }

        const academicYearSelect = document.getElementById('academic-year');
        if (academicYearSelect) {
            academicYearSelect.addEventListener('change', () => {
                this.updateBookingSummary();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }
    }

    handleSearch() {
        const destination = document.getElementById('destination').value;
        if (!destination.trim()) {
            this.showError('Please enter a destination');
            return;
        }
        this.applyFilters();
        document.querySelector('.hostels-list').scrollIntoView({ behavior: 'smooth' });
    }

    applyFilters() {
        const priceMin = document.getElementById('price-min').value;
        const priceMax = document.getElementById('price-max').value;

        this.filteredHostels = this.hostels.filter(hostel => {
            return hostel.price >= priceMin && hostel.price <= priceMax;
        });

        this.renderHostels();
    }

    sortHostels() {
        const sortBy = document.getElementById('sort').value;

        this.filteredHostels.sort((a, b) => {
            switch (sortBy) {
                case 'price-low': return a.price - b.price;
                case 'price-high': return b.price - a.price;
                case 'rating': return b.rating - a.rating;
                default: return 0;
            }
        });

        this.renderHostels();
    }

    renderHostels() {
        const container = document.getElementById('hostels-container');
        if (!container) return;

        container.innerHTML = this.filteredHostels.map(hostel => 
            this.createHostelCard(hostel)
        ).join('');

        this.addBookButtonListeners();
    }

    createHostelCard(hostel) {
        const stars = this.createStars(hostel.rating);
        const amenities = hostel.amenities.map(amenity => 
            `<span class="amenity-tag">${this.getAmenityLabel(amenity)}</span>`
        ).join('');

        // Get the lowest price for display
        const prices = Object.values(hostel.pricing);
        const lowestPrice = Math.min(...prices);

        return `
            <div class="hostel-card" data-hostel-id="${hostel.id}">
                <div class="hostel-image">
                    <img src="${hostel.image}" alt="${hostel.name}">
                    <div class="hostel-badge">Available</div>
                </div>
                <div class="hostel-content">
                    <h3>${hostel.name}</h3>
                    <p class="hostel-location">
                        <i class="fas fa-map-marker-alt"></i> ${hostel.location}
                    </p>
                    <div class="hostel-rating">
                        <div class="stars">${stars}</div>
                        <span class="rating-text">${hostel.rating} (${hostel.reviews} reviews)</span>
                    </div>
                    <p class="hostel-description">${hostel.description}</p>
                    <div class="hostel-amenities">${amenities}</div>
                    <div class="hostel-price">
                        <span class="price">GHS ${lowestPrice.toLocaleString()}</span>
                        <span class="per-night">per academic year</span>
                    </div>
                    <button class="btn btn-primary book-btn" data-hostel-id="${hostel.id}">
                        Book Now
                    </button>
                </div>
            </div>
        `;
    }

    createStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (hasHalfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        return stars;
    }

    getAmenityLabel(amenity) {
        const labels = {
            wifi: 'Free WiFi',
            breakfast: 'Free Breakfast',
            kitchen: 'Kitchen',
            laundry: 'Laundry'
        };
        return labels[amenity] || amenity;
    }

    addBookButtonListeners() {
        document.querySelectorAll('.book-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const hostelId = parseInt(e.target.dataset.hostelId);
                this.openBookingModal(hostelId);
            });
        });
    }

    openBookingModal(hostelId) {
        const hostel = this.hostels.find(h => h.id === hostelId);
        if (!hostel) return;

        this.selectedHostel = hostel;
        const modal = document.getElementById('booking-modal');

        document.getElementById('modal-hostel-image').src = hostel.image;
        document.getElementById('modal-hostel-name').textContent = hostel.name;
        document.getElementById('modal-hostel-location').textContent = hostel.location;
        document.getElementById('modal-hostel-rating').innerHTML = this.createStars(hostel.rating);

        // Update room type options based on hostel
        const roomTypeSelect = document.getElementById('room-type');
        roomTypeSelect.innerHTML = '<option value="">Select Room Type</option>';
        hostel.roomTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            const price = hostel.pricing[type];
            option.textContent = `${type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} - GHS ${price.toLocaleString()}`;
            roomTypeSelect.appendChild(option);
        });

        // Reset booking summary
        document.getElementById('summary-room-type').textContent = '-';
        document.getElementById('summary-price').textContent = '-';
        document.getElementById('summary-total').textContent = '-';
        document.getElementById('summary-duration').textContent = '-';

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('booking-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.selectedHostel = null;
    }

    updateBookingSummary() {
        if (!this.selectedHostel) return;
        
        const roomTypeSelect = document.getElementById('room-type');
        const academicYearSelect = document.getElementById('academic-year');
        const selectedRoomType = roomTypeSelect.value;
        const selectedAcademicYear = academicYearSelect.value;
        
        if (selectedRoomType) {
            const price = this.selectedHostel.pricing[selectedRoomType];
            document.getElementById('summary-room-type').textContent = selectedRoomType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            document.getElementById('summary-price').textContent = `GHS ${price.toLocaleString()}`;
            document.getElementById('summary-total').textContent = `GHS ${price.toLocaleString()}`;
        } else {
            document.getElementById('summary-room-type').textContent = '-';
            document.getElementById('summary-price').textContent = '-';
            document.getElementById('summary-total').textContent = '-';
        }
        
        if (selectedAcademicYear) {
            document.getElementById('summary-duration').textContent = selectedAcademicYear.replace('-', '/');
        } else {
            document.getElementById('summary-duration').textContent = '-';
        }
    }

    handleBooking() {
        const formData = new FormData(document.getElementById('booking-form'));
        const bookingData = {
            guestName: formData.get('guest-name'),
            guestEmail: formData.get('guest-email'),
            guestPhone: formData.get('guest-phone'),
            indexNumber: formData.get('index-number'),
            roomType: formData.get('room-type'),
            academicYear: formData.get('academic-year')
        };

        if (!this.validateBooking(bookingData)) return;

        this.submitBooking(bookingData);
    }

    validateBooking(bookingData) {
        const requiredFields = ['guestName', 'guestEmail', 'guestPhone', 'indexNumber', 'roomType', 'academicYear'];
        
        for (const field of requiredFields) {
            if (!bookingData[field]) {
                this.showError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }

        // Validate index number format (should be alphanumeric)
        const indexNumberRegex = /^[A-Za-z0-9]+$/;
        if (!indexNumberRegex.test(bookingData.indexNumber)) {
            this.showError('Index number should contain only letters and numbers');
            return false;
        }

        return true;
    }

    submitBooking(bookingData) {
        const submitBtn = document.querySelector('#booking-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            this.showSuccessMessage('Booking confirmed! You will receive a confirmation email shortly.');
            this.closeModal();
            document.getElementById('booking-form').reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showError(message) {
        this.showMessage(message, 'var(--danger-color)');
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'var(--success-color)');
    }

    showMessage(message, color) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${color};
            color: white;
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize booking system
document.addEventListener('DOMContentLoaded', () => {
    new BookingSystem();
}); 