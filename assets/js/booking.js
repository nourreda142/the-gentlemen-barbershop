/**
 * THE GENTLEMEN — Booking Engine
 * Comprehensive multi-step booking wizard with calendar, schedule collision detection,
 * duration fitting, and localStorage persistence.
 */

const GentlemenBooking = (() => {
  // Wizard State
  const state = {
    currentStep: 1,
    selectedService: null,
    selectedBarber: null, // null, barber object, or { id: 'any', name: 'Any Available Barber' }
    selectedDate: null, // YYYY-MM-DD
    selectedTime: null, // "14:30"
    customer: {
      name: '',
      email: '',
      phone: '',
      notes: ''
    },
    reschedulingBookingId: null,
    calendarMonth: new Date().getMonth(),
    calendarYear: new Date().getFullYear()
  };

  // DOM Elements cache
  let dom = {};

  function initDOM() {
    dom = {
      stepperItems: document.querySelectorAll('.step-progress-item'),
      stepPanes: document.querySelectorAll('.booking-step-pane'),
      btnBack: document.getElementById('booking-btn-back'),
      btnNext: document.getElementById('booking-btn-next'),
      summaryCard: document.getElementById('booking-summary-sidebar'),
      confirmationPane: document.getElementById('booking-confirmation-pane'),
      wizardCard: document.getElementById('booking-wizard-card')
    };
  }

  // Helper: Format Time string "14:30" to "02:30 PM"
  function formatTime12h(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
  }

  // Helper: Format Date string "2026-10-30" to "Friday, Oct 30, 2026"
  function formatDateFriendly(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Calculate end time string given start time and duration minutes
  function calculateEndTime(startTimeStr, durationMinutes) {
    const [h, m] = startTimeStr.split(':').map(Number);
    const totalMins = h * 60 + m + durationMinutes;
    const endH = Math.floor(totalMins / 60);
    const endM = totalMins % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }

  // Parse URL Parameters (service, barber, reschedule)
  function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const barberParam = urlParams.get('barber');
    const rescheduleParam = urlParams.get('reschedule');

    if (rescheduleParam) {
      const existing = GENTLEMEN_STORAGE.getBookingById(rescheduleParam);
      if (existing) {
        state.reschedulingBookingId = existing.id;
        state.selectedService = GENTLEMEN_DATA.services.find(s => s.id === existing.serviceId) || null;
        if (existing.barberId === 'any') {
          state.selectedBarber = { id: 'any', name: 'Any Available Barber' };
        } else {
          state.selectedBarber = GENTLEMEN_DATA.barbers.find(b => b.id === existing.barberId) || null;
        }
        state.customer = { ...existing.customer };
        
        // Show banner notification
        const banner = document.getElementById('reschedule-alert-banner');
        if (banner) {
          banner.classList.remove('d-none');
          const refTarget = document.getElementById('reschedule-ref-id');
          if (refTarget) refTarget.textContent = existing.id;
        }
      }
    } else {
      if (serviceParam) {
        const matchedService = GENTLEMEN_DATA.services.find(s => s.id === serviceParam);
        if (matchedService) {
          state.selectedService = matchedService;
        }
      }
      if (barberParam) {
        const matchedBarber = GENTLEMEN_DATA.barbers.find(b => b.id === barberParam);
        if (matchedBarber) {
          state.selectedBarber = matchedBarber;
        }
      }
    }
  }

  // ==========================================
  // STEP 1: SERVICE SELECTION
  // ==========================================
  function renderServicesStep() {
    const container = document.getElementById('services-grid-container');
    if (!container) return;

    const filterPills = document.querySelectorAll('.service-filter-btn');
    let currentFilter = 'all';

    function buildCards(filter) {
      const filtered = GENTLEMEN_DATA.services.filter(s => filter === 'all' || s.category === filter);

      container.innerHTML = filtered.map(service => {
        const isSelected = state.selectedService && state.selectedService.id === service.id;
        return `
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="service-selection-card h-100 ${isSelected ? 'selected' : ''}" data-service-id="${service.id}">
              <div class="service-card-img-wrapper position-relative">
                <img src="${service.image}" alt="${service.name}" loading="lazy" class="service-card-img">
                <div class="service-card-tag">${service.duration} mins</div>
                ${service.popular ? '<div class="service-popular-badge"><i class="bi bi-star-fill me-1"></i> Popular</div>' : ''}
              </div>
              <div class="service-card-body p-3 p-xl-4 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h4 class="font-playfair fs-5 text-ivory mb-0">${service.name}</h4>
                    <span class="service-card-price">${service.price} <small class="currency">EGP</small></span>
                  </div>
                  <p class="service-card-desc text-muted-ivory small mb-3">${service.shortDesc}</p>
                </div>
                <div class="d-flex align-items-center justify-content-between pt-2 border-top border-dark-subtle">
                  <span class="selection-indicator">
                    <i class="bi ${isSelected ? 'bi-check-circle-fill text-gold' : 'bi-circle text-muted'} me-2"></i>
                    <span class="small ${isSelected ? 'text-gold fw-bold' : 'text-muted'}">${isSelected ? 'Selected' : 'Select Service'}</span>
                  </span>
                  <span class="badge bg-espresso-subtle text-bronze border border-bronze-subtle">${service.category.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Attach card click handlers
      container.querySelectorAll('.service-selection-card').forEach(card => {
        card.addEventListener('click', () => {
          const serviceId = card.getAttribute('data-service-id');
          state.selectedService = GENTLEMEN_DATA.services.find(s => s.id === serviceId);
          // Re-render selection highlight
          renderServicesStep();
          updateSummary();
          updateNavigationButtons();
        });
      });
    }

    // Filter pill events
    filterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.getAttribute('data-filter');
        buildCards(currentFilter);
      });
    });

    buildCards(currentFilter);
  }

  // ==========================================
  // STEP 2: BARBER SELECTION
  // ==========================================
  function renderBarbersStep() {
    const container = document.getElementById('barbers-grid-container');
    if (!container) return;

    // Any available barber option + 3 specific master barbers
    const anySelected = state.selectedBarber && state.selectedBarber.id === 'any';

    let html = `
      <div class="col-12 mb-4">
        <div class="barber-selection-card any-barber-card ${anySelected ? 'selected' : ''}" data-barber-id="any">
          <div class="d-flex align-items-center p-3 p-md-4">
            <div class="barber-avatar-box me-3 me-md-4 flex-shrink-0">
              <i class="bi bi-stars fs-1 text-gold"></i>
            </div>
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-center flex-wrap">
                <h4 class="font-playfair fs-5 text-ivory mb-1">Any Available Master Barber</h4>
                <span class="badge bg-gold-subtle text-gold px-2 py-1">Maximum Time Flexibility</span>
              </div>
              <p class="text-muted-ivory small mb-0">Select this option to see the earliest available slots across all our craftsmen. A master barber will be designated upon arrival.</p>
            </div>
            <div class="ms-3 flex-shrink-0">
              <i class="bi ${anySelected ? 'bi-check-circle-fill text-gold fs-4' : 'bi-circle text-muted fs-4'}"></i>
            </div>
          </div>
        </div>
      </div>
    `;

    html += GENTLEMEN_DATA.barbers.map(barber => {
      const isSelected = state.selectedBarber && state.selectedBarber.id === barber.id;
      return `
        <div class="col-md-4 mb-4">
          <div class="barber-selection-card h-100 ${isSelected ? 'selected' : ''}" data-barber-id="${barber.id}">
            <div class="barber-card-img-wrapper position-relative">
              <img src="${barber.image}" alt="${barber.name}" loading="lazy" class="barber-card-img">
              <div class="barber-card-rating">
                <i class="bi bi-star-fill text-gold me-1"></i> ${barber.rating} <small>(${barber.reviewsCount})</small>
              </div>
            </div>
            <div class="barber-card-body p-3 p-xl-4 d-flex flex-column justify-content-between">
              <div>
                <h4 class="font-playfair fs-5 text-ivory mb-1">${barber.name}</h4>
                <div class="text-bronze small mb-2 fw-semibold">${barber.title}</div>
                <p class="text-muted-ivory small mb-3">${barber.bio.substring(0, 115)}...</p>
                <div class="mb-3">
                  <span class="small text-muted d-block mb-1">Signature Specialty:</span>
                  <span class="badge bg-dark-espresso text-ivory border border-bronze-subtle small">${barber.specialty}</span>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between pt-2 border-top border-dark-subtle">
                <span class="selection-indicator">
                  <i class="bi ${isSelected ? 'bi-check-circle-fill text-gold' : 'bi-circle text-muted'} me-2"></i>
                  <span class="small ${isSelected ? 'text-gold fw-bold' : 'text-muted'}">${isSelected ? 'Selected' : 'Select Barber'}</span>
                </span>
                <span class="small text-muted">${barber.experience}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;

    // Attach click events
    container.querySelectorAll('.barber-selection-card').forEach(card => {
      card.addEventListener('click', () => {
        const barberId = card.getAttribute('data-barber-id');
        if (barberId === 'any') {
          state.selectedBarber = { id: 'any', name: 'Any Available Master Barber', title: 'First Available Craftsman', image: 'assets/images/about-interior.webp' };
        } else {
          state.selectedBarber = GENTLEMEN_DATA.barbers.find(b => b.id === barberId);
        }
        renderBarbersStep();
        updateSummary();
        updateNavigationButtons();
      });
    });
  }

  // ==========================================
  // STEP 3: INTERACTIVE CALENDAR
  // ==========================================
  function renderCalendarStep() {
    const calendarDaysGrid = document.getElementById('calendar-days-grid');
    const monthYearTitle = document.getElementById('calendar-month-year');
    const btnPrevMonth = document.getElementById('calendar-prev-month');
    const btnNextMonth = document.getElementById('calendar-next-month');
    if (!calendarDaysGrid || !monthYearTitle) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year = state.calendarYear;
    const month = state.calendarMonth;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    monthYearTitle.textContent = `${monthNames[month]} ${year}`;

    // Disable prev button if viewing current month or earlier
    const isCurrentMonthOrPast = (year < today.getFullYear()) || (year === today.getFullYear() && month <= today.getMonth());
    btnPrevMonth.disabled = isCurrentMonthOrPast;
    btnPrevMonth.classList.toggle('opacity-50', isCurrentMonthOrPast);

    // First day of month and total days
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    let gridHtml = '';

    // Empty lead cells
    for (let i = 0; i < firstDayIndex; i++) {
      gridHtml += '<div class="calendar-day empty"></div>';
    }

    // Days in current month
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      cellDate.setHours(0, 0, 0, 0);

      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = cellDate < today;
      const isToday = cellDate.getTime() === today.getTime();
      const isSelected = state.selectedDate === dateStr;

      // Check if chosen barber works on this day of week
      const dayOfWeek = cellDate.getDay();
      let isOffDuty = false;
      if (state.selectedBarber && state.selectedBarber.id !== 'any' && state.selectedBarber.schedule) {
        if (!state.selectedBarber.schedule.workingDays.includes(dayOfWeek)) {
          isOffDuty = true;
        }
      }

      let classes = ['calendar-day'];
      if (isPast) classes.push('disabled');
      if (isOffDuty && !isPast) classes.push('off-duty');
      if (isToday) classes.push('is-today');
      if (isSelected) classes.push('is-selected');

      const tooltip = isOffDuty ? `${state.selectedBarber.name} is off on this day` : (isPast ? 'Past date' : '');

      gridHtml += `
        <button type="button" 
                class="${classes.join(' ')}" 
                data-date="${dateStr}"
                ${(isPast || isOffDuty) ? 'disabled' : ''}
                title="${tooltip}">
          <span class="day-number">${day}</span>
          ${isToday ? '<span class="today-dot"></span>' : ''}
          ${isOffDuty && !isPast ? '<span class="off-badge">Off</span>' : ''}
        </button>
      `;
    }

    calendarDaysGrid.innerHTML = gridHtml;

    // Attach click events on enabled days
    calendarDaysGrid.querySelectorAll('.calendar-day:not(.disabled):not(.off-duty)').forEach(dayBtn => {
      dayBtn.addEventListener('click', () => {
        state.selectedDate = dayBtn.getAttribute('data-date');
        // Reset selected time when date changes
        state.selectedTime = null;
        renderCalendarStep();
        updateSummary();
        updateNavigationButtons();
      });
    });

    // Month navigation listeners (bound once)
    btnPrevMonth.onclick = () => {
      if (state.calendarMonth === 0) {
        state.calendarMonth = 11;
        state.calendarYear -= 1;
      } else {
        state.calendarMonth -= 1;
      }
      renderCalendarStep();
    };

    btnNextMonth.onclick = () => {
      if (state.calendarMonth === 11) {
        state.calendarMonth = 0;
        state.calendarYear += 1;
      } else {
        state.calendarMonth += 1;
      }
      renderCalendarStep();
    };
  }

  // ==========================================
  // STEP 4: TIME SLOT GENERATION & COLLISION DETECTION
  // ==========================================
  function generateTimeSlots() {
    const slotsContainer = document.getElementById('time-slots-container');
    const selectedDateBanner = document.getElementById('selected-date-slot-heading');
    if (!slotsContainer) return;

    if (!state.selectedDate) {
      slotsContainer.innerHTML = `
        <div class="col-12 text-center py-5 text-muted">
          <i class="bi bi-calendar-event fs-1 text-bronze mb-3 d-block"></i>
          <p>Please select an appointment date in Step 3 first.</p>
        </div>
      `;
      return;
    }

    if (selectedDateBanner) {
      selectedDateBanner.textContent = formatDateFriendly(state.selectedDate);
    }

    const duration = state.selectedService ? state.selectedService.duration : 30;
    const targetDate = new Date(`${state.selectedDate}T00:00:00`);
    const dayOfWeek = targetDate.getDay();

    // Determine target barbers to check
    let eligibleBarbers = [];
    if (state.selectedBarber && state.selectedBarber.id !== 'any') {
      if (state.selectedBarber.schedule && state.selectedBarber.schedule.workingDays.includes(dayOfWeek)) {
        eligibleBarbers = [state.selectedBarber];
      }
    } else {
      eligibleBarbers = GENTLEMEN_DATA.barbers.filter(b => b.schedule.workingDays.includes(dayOfWeek));
    }

    if (eligibleBarbers.length === 0) {
      slotsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-clock-history fs-1 text-bronze mb-3 d-block"></i>
          <h5 class="text-ivory font-playfair">No Working Hours On This Date</h5>
          <p class="text-muted-ivory small">The selected barber is taking a rest day. Please choose another date or select "Any Available Barber".</p>
        </div>
      `;
      return;
    }

    // Determine overall operating window for the day
    let earliestStart = Math.min(...eligibleBarbers.map(b => b.schedule.startHour));
    let latestEnd = Math.max(...eligibleBarbers.map(b => b.schedule.endHour));

    // Get all existing bookings to check collisions
    const savedBookings = GENTLEMEN_STORAGE.getBookings().filter(b => {
      // Ignore cancelled appointments
      if (b.status === 'cancelled') return false;
      // If rescheduling, don't conflict with self
      if (state.reschedulingBookingId && b.id === state.reschedulingBookingId) return false;
      return b.date === state.selectedDate;
    });

    // Also include demo occupied slots
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDiff = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));
    
    const demoOccupied = GENTLEMEN_DATA.demoOccupiedSlots.filter(s => s.dateOffsetDays === dayDiff);

    // Helper: test if barber is free for [startMin, startMin + duration]
    function isBarberFreeForSlot(barber, startMin) {
      const endMin = startMin + duration;
      const bStartMin = barber.schedule.startHour * 60;
      const bEndMin = barber.schedule.endHour * 60;

      // Within shift
      if (startMin < bStartMin || endMin > bEndMin) return false;

      // Check saved bookings for this barber
      const hasSavedConflict = savedBookings.some(b => {
        if (b.barberId !== 'any' && b.barberId !== barber.id) return false;
        const [bh, bm] = b.time.split(':').map(Number);
        const bStart = bh * 60 + bm;
        const bEnd = bStart + (b.duration || 30);
        return (startMin < bEnd && endMin > bStart);
      });
      if (hasSavedConflict) return false;

      // Check demo occupied slots
      const hasDemoConflict = demoOccupied.some(d => {
        if (d.barberId !== barber.id) return false;
        const [dh, dm] = d.time.split(':').map(Number);
        const dStart = dh * 60 + dm;
        const dEnd = dStart + d.duration;
        return (startMin < dEnd && endMin > dStart);
      });
      if (hasDemoConflict) return false;

      return true;
    }

    // Check if slot is in the past for today
    const now = new Date();
    const isToday = targetDate.toDateString() === now.toDateString();
    const currentMinsNow = now.getHours() * 60 + now.getMinutes() + 15; // 15 min buffer

    // Generate candidate 30-minute intervals
    const morningSlots = [];
    const afternoonSlots = [];
    const eveningSlots = [];

    for (let hour = earliestStart; hour < latestEnd; hour++) {
      for (let min of [0, 30]) {
        const slotMin = hour * 60 + min;
        const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

        // Past check if booking for today
        if (isToday && slotMin < currentMinsNow) {
          continue;
        }

        // Check availability across eligible barbers
        const availableBarbers = eligibleBarbers.filter(b => isBarberFreeForSlot(b, slotMin));
        const isAvailable = availableBarbers.length > 0;

        const slotData = {
          time: timeStr,
          isAvailable,
          availableCount: availableBarbers.length,
          period: hour < 12 ? 'morning' : (hour < 17 ? 'afternoon' : 'evening')
        };

        if (slotData.period === 'morning') morningSlots.push(slotData);
        else if (slotData.period === 'afternoon') afternoonSlots.push(slotData);
        else eveningSlots.push(slotData);
      }
    }

    function renderSlotGroup(title, icon, slots) {
      if (!slots.length) return '';
      return `
        <div class="time-slot-group mb-4">
          <div class="slot-group-header d-flex align-items-center mb-3">
            <i class="bi ${icon} text-bronze me-2"></i>
            <h5 class="font-playfair fs-6 text-ivory mb-0">${title}</h5>
            <span class="badge bg-dark-espresso text-muted ms-2">${slots.filter(s => s.isAvailable).length} slots</span>
          </div>
          <div class="row g-2">
            ${slots.map(slot => {
              const isSelected = state.selectedTime === slot.time;
              return `
                <div class="col-4 col-sm-3 col-md-2">
                  <button type="button" 
                          class="time-slot-btn w-100 ${isSelected ? 'selected' : ''} ${!slot.isAvailable ? 'disabled' : ''}" 
                          data-time="${slot.time}"
                          ${!slot.isAvailable ? 'disabled' : ''}
                          title="${slot.isAvailable ? `${slot.availableCount} craftsman available` : 'Slot already booked'}">
                    <span class="time-label">${formatTime12h(slot.time)}</span>
                    <span class="slot-subtext small">${slot.isAvailable ? 'Available' : 'Booked'}</span>
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    const totalAvailable = [...morningSlots, ...afternoonSlots, ...eveningSlots].filter(s => s.isAvailable).length;

    if (totalAvailable === 0) {
      slotsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-calendar-x fs-1 text-bronze mb-3 d-block"></i>
          <h5 class="text-ivory font-playfair">Fully Booked on this Date</h5>
          <p class="text-muted-ivory small">All time slots on ${formatDateFriendly(state.selectedDate)} are currently occupied. Please select an adjacent day.</p>
        </div>
      `;
      return;
    }

    slotsContainer.innerHTML = `
      ${renderSlotGroup('Morning', 'bi-sunrise', morningSlots)}
      ${renderSlotGroup('Afternoon', 'bi-sun', afternoonSlots)}
      ${renderSlotGroup('Evening', 'bi-moon-stars', eveningSlots)}
    `;

    // Attach click events on available slots
    slotsContainer.querySelectorAll('.time-slot-btn:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedTime = btn.getAttribute('data-time');
        generateTimeSlots();
        updateSummary();
        updateNavigationButtons();
      });
    });
  }

  // ==========================================
  // STEP 5: CUSTOMER DETAILS VALIDATION
  // ==========================================
  function setupCustomerFormListeners() {
    const inputName = document.getElementById('cust-name');
    const inputEmail = document.getElementById('cust-email');
    const inputPhone = document.getElementById('cust-phone');
    const inputNotes = document.getElementById('cust-notes');

    if (!inputName || !inputEmail || !inputPhone) return;

    // Fill existing values if any
    if (state.customer.name) inputName.value = state.customer.name;
    if (state.customer.email) inputEmail.value = state.customer.email;
    if (state.customer.phone) inputPhone.value = state.customer.phone;
    if (state.customer.notes && inputNotes) inputNotes.value = state.customer.notes;

    const feedbackName = document.getElementById('cust-name-feedback');
    const feedbackEmail = document.getElementById('cust-email-feedback');
    const feedbackPhone = document.getElementById('cust-phone-feedback');

    inputName.addEventListener('input', () => {
      state.customer.name = inputName.value;
      const res = GENTLEMEN_VALIDATION.validateName(state.customer.name);
      GENTLEMEN_VALIDATION.applyFieldFeedback(inputName, feedbackName, res);
      updateNavigationButtons();
    });

    inputEmail.addEventListener('input', () => {
      state.customer.email = inputEmail.value;
      const res = GENTLEMEN_VALIDATION.validateEmail(state.customer.email);
      GENTLEMEN_VALIDATION.applyFieldFeedback(inputEmail, feedbackEmail, res);
      updateNavigationButtons();
    });

    inputPhone.addEventListener('input', () => {
      state.customer.phone = inputPhone.value;
      const res = GENTLEMEN_VALIDATION.validatePhone(state.customer.phone);
      GENTLEMEN_VALIDATION.applyFieldFeedback(inputPhone, feedbackPhone, res);
      updateNavigationButtons();
    });

    if (inputNotes) {
      inputNotes.addEventListener('input', () => {
        state.customer.notes = inputNotes.value;
      });
    }
  }

  function validateStep5() {
    const nameRes = GENTLEMEN_VALIDATION.validateName(state.customer.name);
    const emailRes = GENTLEMEN_VALIDATION.validateEmail(state.customer.email);
    const phoneRes = GENTLEMEN_VALIDATION.validatePhone(state.customer.phone);

    const inputName = document.getElementById('cust-name');
    const inputEmail = document.getElementById('cust-email');
    const inputPhone = document.getElementById('cust-phone');

    GENTLEMEN_VALIDATION.applyFieldFeedback(inputName, document.getElementById('cust-name-feedback'), nameRes);
    GENTLEMEN_VALIDATION.applyFieldFeedback(inputEmail, document.getElementById('cust-email-feedback'), emailRes);
    GENTLEMEN_VALIDATION.applyFieldFeedback(inputPhone, document.getElementById('cust-phone-feedback'), phoneRes);

    return nameRes.isValid && emailRes.isValid && phoneRes.isValid;
  }

  // ==========================================
  // STEP 6: REVIEW & CONFIRM
  // ==========================================
  function renderReviewStep() {
    const reviewService = document.getElementById('review-service-name');
    const reviewDuration = document.getElementById('review-service-duration');
    const reviewPrice = document.getElementById('review-service-price');
    const reviewBarber = document.getElementById('review-barber-name');
    const reviewBarberTitle = document.getElementById('review-barber-title');
    const reviewBarberImg = document.getElementById('review-barber-img');
    const reviewDateTime = document.getElementById('review-datetime');
    const reviewCustomerName = document.getElementById('review-customer-name');
    const reviewCustomerEmail = document.getElementById('review-customer-email');
    const reviewCustomerPhone = document.getElementById('review-customer-phone');
    const reviewCustomerNotes = document.getElementById('review-customer-notes');

    if (!reviewService) return;

    if (state.selectedService) {
      reviewService.textContent = state.selectedService.name;
      reviewDuration.textContent = `${state.selectedService.duration} minutes`;
      reviewPrice.textContent = `${state.selectedService.price} EGP`;
    }

    if (state.selectedBarber) {
      reviewBarber.textContent = state.selectedBarber.name;
      reviewBarberTitle.textContent = state.selectedBarber.title || 'Master Barber';
      if (reviewBarberImg && state.selectedBarber.image) {
        reviewBarberImg.src = state.selectedBarber.image;
        reviewBarberImg.alt = state.selectedBarber.name;
      }
    }

    if (state.selectedDate && state.selectedTime && state.selectedService) {
      const endTime = calculateEndTime(state.selectedTime, state.selectedService.duration);
      reviewDateTime.textContent = `${formatDateFriendly(state.selectedDate)} • ${formatTime12h(state.selectedTime)} – ${formatTime12h(endTime)}`;
    }

    if (reviewCustomerName) reviewCustomerName.textContent = state.customer.name || '—';
    if (reviewCustomerEmail) reviewCustomerEmail.textContent = state.customer.email || '—';
    if (reviewCustomerPhone) reviewCustomerPhone.textContent = state.customer.phone || '—';
    if (reviewCustomerNotes) {
      reviewCustomerNotes.textContent = state.customer.notes || 'None provided.';
    }
  }

  // ==========================================
  // CONFIRMATION & CALENDAR ICS EXPORT
  // ==========================================
  function generateIcsCalendar(booking) {
    const [y, m, d] = booking.date.split('-').map(Number);
    const [sh, sm] = booking.time.split(':').map(Number);
    const [eh, em] = booking.endTime.split(':').map(Number);

    const pad = (n) => String(n).padStart(2, '0');
    const startIso = `${y}${pad(m)}${pad(d)}T${pad(sh)}${pad(sm)}00`;
    const endIso = `${y}${pad(m)}${pad(d)}T${pad(eh)}${pad(em)}00`;

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//THE GENTLEMEN//Appointment Booking//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${booking.id}@thegentlemenbarbers.com`,
      `DTSTAMP:${startIso}Z`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:THE GENTLEMEN — ${booking.serviceName} with ${booking.barberName}`,
      `DESCRIPTION:Appointment Reference: ${booking.id}\\nService: ${booking.serviceName} (${booking.duration} min)\\nBarber: ${booking.barberName}\\nClient: ${booking.customer.name}\\nLocation: 14 El-Gezira St, Zamalek, Cairo`,
      'LOCATION:14 El-Gezira Street, Zamalek, Cairo, Egypt',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  function downloadIcsFile(booking) {
    const icsContent = generateIcsCalendar(booking);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${booking.id}-the-gentlemen.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleFinalConfirmation() {
    const btnSubmit = document.getElementById('booking-btn-submit');
    if (!btnSubmit) return;

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Securing Reservation...`;

    // Simulated short delay for luxury commercial feel
    await new Promise(r => setTimeout(r, 900));

    try {
      // Determine final barber if 'any' was selected
      let assignedBarber = state.selectedBarber;
      if (assignedBarber.id === 'any') {
        const targetDate = new Date(`${state.selectedDate}T00:00:00`);
        const dayOfWeek = targetDate.getDay();
        const availableOnDay = GENTLEMEN_DATA.barbers.filter(b => b.schedule.workingDays.includes(dayOfWeek));
        assignedBarber = availableOnDay[0] || GENTLEMEN_DATA.barbers[0];
      }

      const endTime = calculateEndTime(state.selectedTime, state.selectedService.duration);

      const bookingRecord = {
        id: state.reschedulingBookingId || undefined,
        serviceId: state.selectedService.id,
        serviceName: state.selectedService.name,
        servicePrice: state.selectedService.price,
        currency: state.selectedService.currency || 'EGP',
        duration: state.selectedService.duration,
        barberId: assignedBarber.id,
        barberName: assignedBarber.name,
        barberTitle: assignedBarber.title,
        barberImage: assignedBarber.image,
        date: state.selectedDate,
        time: state.selectedTime,
        endTime: endTime,
        customer: {
          name: state.customer.name.trim(),
          email: state.customer.email.trim(),
          phone: state.customer.phone.trim(),
          notes: (state.customer.notes || '').trim()
        },
        status: 'confirmed'
      };

      const saved = GENTLEMEN_STORAGE.saveBooking(bookingRecord);

      // Render Confirmation Pane
      dom.wizardCard.classList.add('d-none');
      if (dom.summaryCard) dom.summaryCard.classList.add('d-none');
      dom.confirmationPane.classList.remove('d-none');

      document.getElementById('conf-ref-id').textContent = saved.id;
      document.getElementById('conf-service').textContent = saved.serviceName;
      document.getElementById('conf-barber').textContent = saved.barberName;
      document.getElementById('conf-datetime').textContent = `${formatDateFriendly(saved.date)} at ${formatTime12h(saved.time)}`;
      document.getElementById('conf-price').textContent = `${saved.servicePrice} EGP`;
      document.getElementById('conf-customer-name').textContent = saved.customer.name;
      document.getElementById('conf-customer-contact').textContent = `${saved.customer.email} • ${saved.customer.phone}`;

      // Calendar button
      const btnCalendar = document.getElementById('btn-download-calendar');
      if (btnCalendar) {
        btnCalendar.onclick = () => downloadIcsFile(saved);
      }

      GentlemenUI.showToast({
        title: 'Appointment Confirmed',
        message: `Reservation ${saved.id} successfully saved to local browser records!`,
        type: 'success',
        duration: 5000
      });

      // Scroll smoothly to top of confirmation pane
      window.scrollTo({ top: dom.confirmationPane.offsetTop - 80, behavior: 'smooth' });

    } catch (err) {
      console.error('Booking submission error:', err);
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `Confirm Reservation <i class="bi bi-arrow-right ms-2"></i>`;
      GentlemenUI.showToast({
        title: 'Booking Error',
        message: err.message || 'Unable to store booking in browser memory. Please check your browser settings.',
        type: 'error'
      });
    }
  }

  // ==========================================
  // WIZARD NAVIGATION & SUMMARY SYNC
  // ==========================================
  function canProceedFromStep(step) {
    switch (step) {
      case 1:
        return state.selectedService !== null;
      case 2:
        return state.selectedBarber !== null;
      case 3:
        return state.selectedDate !== null;
      case 4:
        return state.selectedTime !== null;
      case 5:
        return GENTLEMEN_VALIDATION.validateName(state.customer.name).isValid &&
               GENTLEMEN_VALIDATION.validateEmail(state.customer.email).isValid &&
               GENTLEMEN_VALIDATION.validatePhone(state.customer.phone).isValid;
      default:
        return true;
    }
  }

  function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > 6) return;

    // Save and validate if leaving step 5
    if (state.currentStep === 5 && stepNumber > 5) {
      if (!validateStep5()) {
        GentlemenUI.showToast({
          title: 'Missing Required Fields',
          message: 'Please complete all customer details accurately before proceeding.',
          type: 'warning'
        });
        return;
      }
    }

    state.currentStep = stepNumber;

    // Toggle panes
    dom.stepPanes.forEach(pane => {
      const paneStep = parseInt(pane.getAttribute('data-step'), 10);
      pane.classList.toggle('active', paneStep === state.currentStep);
    });

    // Update Stepper Indicators
    dom.stepperItems.forEach(item => {
      const itemStep = parseInt(item.getAttribute('data-step'), 10);
      item.classList.toggle('active', itemStep === state.currentStep);
      item.classList.toggle('completed', itemStep < state.currentStep);
    });

    // Step-specific renders
    if (state.currentStep === 1) renderServicesStep();
    if (state.currentStep === 2) renderBarbersStep();
    if (state.currentStep === 3) renderCalendarStep();
    if (state.currentStep === 4) generateTimeSlots();
    if (state.currentStep === 6) renderReviewStep();

    updateSummary();
    updateNavigationButtons();

    // Scroll to top of wizard on step change
    if (dom.wizardCard) {
      const topOffset = dom.wizardCard.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  }

  function updateNavigationButtons() {
    if (!dom.btnBack || !dom.btnNext) return;

    // Back button visibility
    dom.btnBack.style.visibility = state.currentStep > 1 ? 'visible' : 'hidden';

    // Next vs Confirm button
    if (state.currentStep === 6) {
      dom.btnNext.classList.add('d-none');
    } else {
      dom.btnNext.classList.remove('d-none');
      const canProceed = canProceedFromStep(state.currentStep);
      dom.btnNext.disabled = !canProceed;
      dom.btnNext.classList.toggle('opacity-50', !canProceed);
    }
  }

  function updateSummary() {
    const summaryService = document.getElementById('sum-service-name');
    const summaryDuration = document.getElementById('sum-service-duration');
    const summaryPrice = document.getElementById('sum-service-price');
    const summaryBarber = document.getElementById('sum-barber-name');
    const summaryBarberImg = document.getElementById('sum-barber-img');
    const summaryDate = document.getElementById('sum-date');
    const summaryTime = document.getElementById('sum-time');

    if (summaryService) {
      summaryService.textContent = state.selectedService ? state.selectedService.name : 'Not selected';
    }
    if (summaryDuration) {
      summaryDuration.textContent = state.selectedService ? `${state.selectedService.duration} mins` : '—';
    }
    if (summaryPrice) {
      summaryPrice.textContent = state.selectedService ? `${state.selectedService.price} EGP` : '0 EGP';
    }
    if (summaryBarber) {
      summaryBarber.textContent = state.selectedBarber ? state.selectedBarber.name : 'Not selected';
    }
    if (summaryBarberImg && state.selectedBarber) {
      summaryBarberImg.src = state.selectedBarber.image || 'assets/images/about-interior.webp';
      summaryBarberImg.classList.remove('d-none');
    }
    if (summaryDate) {
      summaryDate.textContent = state.selectedDate ? formatDateFriendly(state.selectedDate) : 'Not selected';
    }
    if (summaryTime) {
      summaryTime.textContent = state.selectedTime ? formatTime12h(state.selectedTime) : 'Not selected';
    }
  }

  function setupEventListeners() {
    if (dom.btnBack) {
      dom.btnBack.addEventListener('click', () => {
        goToStep(state.currentStep - 1);
      });
    }

    if (dom.btnNext) {
      dom.btnNext.addEventListener('click', () => {
        if (canProceedFromStep(state.currentStep)) {
          goToStep(state.currentStep + 1);
        }
      });
    }

    // Step indicator click jumps to previously completed steps
    dom.stepperItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetStep = parseInt(item.getAttribute('data-step'), 10);
        // Only allow clicking back to already visited/valid steps
        if (targetStep < state.currentStep) {
          goToStep(targetStep);
        }
      });
    });

    const btnSubmit = document.getElementById('booking-btn-submit');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', handleFinalConfirmation);
    }
  }

  function init() {
    initDOM();
    handleUrlParams();
    setupCustomerFormListeners();
    setupEventListeners();

    // Start on step 1 (or step 2/3 if service was preselected via URL)
    let initialStep = 1;
    if (state.reschedulingBookingId) {
      initialStep = 3; // Jump directly to date/time selection when rescheduling!
    } else if (state.selectedService && state.selectedBarber) {
      initialStep = 3;
    } else if (state.selectedService) {
      initialStep = 2;
    }

    goToStep(initialStep);
  }

  return {
    init,
    getState: () => state
  };
})();

// Initialize booking wizard on DOM ready if wizard container exists
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('booking-wizard-card')) {
    GentlemenBooking.init();
  }
});
