// Base routing domain context matching backend operational specs
const API_BASE = 'http://localhost:3000/api';

document.addEventListener("DOMContentLoaded", () => {
    init();
});

function init() {
    const form = document.getElementById('booking-form');
    const categorySelect = document.getElementById('user-category');

    if (form) {
        form.addEventListener('submit', handleSubmission);

        // Dynamically shift context rules based on category changes
        categorySelect.addEventListener('change', function() {
            const label = document.getElementById('contact-label');
            const input = document.getElementById('user-contact');
            clearErrors();
            
            if (this.value === "In Campus") {
                label.textContent = "Student/Staff ID Number:";
                input.placeholder = "e.g., 02230100";
            } else {
                label.textContent = "Phone Number:";
                input.placeholder = "e.g., 17XXXXXX";
            }
        });
    }
    
    // Load fresh records directly out of server operations
    loadFormSlots();
    fetchBookings();
}

// GET Requirement - Populate drop-down structural nodes from database entities
async function loadFormSlots() {
    try {
        const response = await fetch(`${API_BASE}/slots`);
        const result = await response.json();
        
        if (result.success) {
            const slotSelect = document.getElementById('time-slot');
            slotSelect.innerHTML = ""; // Wipe visual placeholders
            
            result.data.forEach(slot => {
                const opt = document.createElement('option');
                opt.value = slot.id; // Database Primary Key identification attribute
                opt.textContent = slot.display_name;
                slotSelect.appendChild(opt);
            });
        }
    } catch (err) {
        console.error("Critical failure fetching structural operational time blocks:", err);
    }
}

// GET Requirement - Download full calendar schedule register state values
async function fetchBookings() {
    try {
        const response = await fetch(`${API_BASE}/bookings`);
        const result = await response.json();
        if (result.success) {
            renderBookings(result.data);
        }
    } catch (err) {
        console.error("Network communication loss attempting server fetch operations:", err);
    }
}

// Local UI generation mapping from the server context payload variables
function renderBookings(bookingList) {
    const container = document.getElementById('booking-list');
    if (!container) return;

    container.innerHTML = ""; // Reset collection container node references
    
    if (bookingList.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">No active ground reservations scheduled.</p>`;
        return;
    }

    bookingList.forEach(item => {
        const card = document.createElement('div');
        card.className = "booking-card";
        
        const typeBadge = document.createElement('small');
        typeBadge.textContent = item.category;
        
        const title = document.createElement('h4');
        title.textContent = item.name;

        const contactDetail = document.createElement('p');
        contactDetail.innerHTML = `<strong>ID/Contact:</strong> ${item.contact}`;

        const details = document.createElement('p');
        // Render slot_name derived automatically through SQL JOIN controller configurations
        details.innerHTML = `<strong>Schedule:</strong> ${item.date} <br> 🕒 ${item.slot_name}`;
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = "Cancel Reservation";
        cancelBtn.className = "cancel-btn";
        cancelBtn.onclick = async () => {
            if (confirm(`Cancel ground scheduling reserved for "${item.name}"?`)) {
                await deleteBookingFromServer(item.id);
            }
        };
        
        card.appendChild(typeBadge);
        card.appendChild(title);
        card.appendChild(contactDetail);
        card.appendChild(details);
        card.appendChild(cancelBtn);
        
        container.appendChild(card);
    });
}

// POST Requirement - Client validation pipeline routing payloads to backend
async function handleSubmission(event) {
    event.preventDefault(); 
    clearErrors();

    const nameInput = document.getElementById('user-name');
    const categoryInput = document.getElementById('user-category');
    const contactInput = document.getElementById('user-contact');
    const dateInput = document.getElementById('booking-date');
    const slotInput = document.getElementById('time-slot');

    let isValid = true;

    // Strict Frontend Validation Sequence
    if (!nameInput.value.trim()) {
        showError('name-error', 'Name or Club Title field cannot be blank.');
        isValid = false;
    }
    if (!contactInput.value.trim()) {
        showError('contact-error', 'Contact details are required for confirmation tracking.');
        isValid = false;
    }
    if (!dateInput.value) {
        showError('date-error', 'Please select a valid schedule target date.');
        isValid = false;
    }
    if (!slotInput.value) {
        showError('slot-error', 'An operational time slot index selection is required.');
        isValid = false;
    }

    if (!isValid) return;

    const payload = {
        name: nameInput.value.trim(),
        category: categoryInput.value,
        contact: contactInput.value.trim(),
        date: dateInput.value,
        slot_id: parseInt(slotInput.value)
    };

    try {
        const response = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            alert("Ground reservation successfully processed and locked into ledger!");
            document.getElementById('booking-form').reset();
            
            // Re-trigger defaults switch label configuration styles
            document.getElementById('contact-label').textContent = "Student/Staff ID Number:";
            document.getElementById('user-contact').placeholder = "e.g., 02230100";
            
            fetchBookings(); // Force full dynamic operational view refresh tracking state
        } else {
            alert(`Reservation Blocked: ${result.message}`);
        }
    } catch (err) {
        alert("Fatal error pushing payload details directly to cloud processes.");
    }
}

// DELETE Requirement - Safely extract selected row identities out of backend storage
async function deleteBookingFromServer(id) {
    try {
        const response = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            fetchBookings(); // Instantly pull updated table datasets
        } else {
            alert(result.message);
        }
    } catch (err) {
        console.error("Operational crash executing selected row extraction logic:", err);
    }
}

function showError(elementId, message) {
    const target = document.getElementById(elementId);
    if (target) target.textContent = message;
}

function clearErrors() {
    const errorSpans = document.querySelectorAll('.error-message');
    errorSpans.forEach(span => span.textContent = "");
}