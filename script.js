//Array
let bookings = [
    { id: 1, name: "CST Staff Club", category: "In Campus", contact: "02210055", date: "2026-05-20", slot: "18:00 - 20:00" }
];

function init() {
    const form = document.getElementById('booking-form');
    const categorySelect = document.getElementById('user-category');

    if (form) {
        form.addEventListener('submit', handleSubmission);

        categorySelect.addEventListener('change', function() {
            const label = document.getElementById('contact-label');
            const input = document.getElementById('user-contact');
            
            if (this.value === "In Campus") {
                label.textContent = "Student Number:";
                input.placeholder = "e.g., 02230100";
            } else {
                label.textContent = "Phone Number:";
                input.placeholder = "e.g., 17XXXXXX";
            }
        });

        console.log("System Initialized");
    }
    
    renderBookings();
}

function handleSubmission(event) {
    event.preventDefault(); 
    
    const nameInput = document.getElementById('user-name');
    const dateInput = document.getElementById('booking-date');
    const slotInput = document.getElementById('time-slot');
    const categoryInput = document.getElementById('user-category');
    const contactInput = document.getElementById('user-contact');
    
    
    const isValid = validateForm(nameInput, dateInput, contactInput, slotInput);

    if (isValid) {
        const newBooking = {
            id: Date.now(),
            name: nameInput.value,
            category: categoryInput.value,
            contact: contactInput.value,
            date: dateInput.value,
            slot: slotInput.value
        };
        
        bookings.push(newBooking);
        
        nameInput.value = "";
        dateInput.value = "";
        contactInput.value = "";
        
        renderBookings();
    }
}

function validateForm(name, date, contact, slot) {
    let status = true;
    const nameError = document.getElementById('name-error');
    const dateError = document.getElementById('date-error');
    const contactError = document.getElementById('contact-error');
    
    nameError.textContent = "";
    dateError.textContent = "";
    contactError.textContent = "";

    // 1. Basic empty/length checks
    if (name.value.trim().length < 3) {
        nameError.textContent = "Full Name is required (min 3 chars).";
        status = false;
    }
    
    if (!date.value) {
        dateError.textContent = "Please select a date.";
        return false; 
    }

    // To CHECK FOR PREVIOUS DATES
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
    const selectedDate = new Date(date.value);

    if (selectedDate < today) {
        dateError.textContent = "You cannot book a date in the past.";
        status = false;
    }

    // CHECK FOR DATE/TIME CLASHES
    // By looking at the array to check slot are book/taken or not 
    const isTaken = bookings.some(b => b.date === date.value && b.slot === slot.value);
    
    if (isTaken) {
        dateError.textContent = "This time slot is already booked for this date.";
        status = false;
    }

    if (contact.value.trim() === "") {
        contactError.textContent = "Contact info is required.";
        status = false;
    }
    
    return status;
}

function renderBookings() {
    const container = document.getElementById('booking-list');
    if (!container) return;

    container.textContent = ""; 
    
    bookings.forEach(item => {
        const card = document.createElement('div');
        card.className = "booking-card";
        
        const title = document.createElement('h4');
        title.textContent = item.name;
        
        const typeBadge = document.createElement('small');
        typeBadge.textContent = item.category;
        typeBadge.style.color = "blue";

        const contactDetail = document.createElement('p');
        contactDetail.style.fontSize = "0.85rem";
        contactDetail.innerHTML = `<strong>Contact:</strong> ${item.contact}`;

        const details = document.createElement('p');
        details.textContent = `${item.date} | ${item.slot}`;
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = "Remove";
        cancelBtn.className = "cancel-btn";
        cancelBtn.onclick = () => {
            bookings = bookings.filter(b => b.id !== item.id);
            renderBookings();
        };
        
        card.appendChild(typeBadge);
        card.appendChild(title);
        card.appendChild(contactDetail);
        card.appendChild(details);
        card.appendChild(cancelBtn);
        container.appendChild(card);
    });
}

init();