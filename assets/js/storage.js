/**
 * THE GENTLEMEN — Storage Layer
 * Robust client-side localStorage management for demo appointments.
 */

const GENTLEMEN_STORAGE = (() => {
  const STORAGE_KEY = 'the_gentlemen_bookings_v2';
  const SEED_KEY = 'the_gentlemen_seeded_v2';

  // Helper to format ISO date strings into YYYY-MM-DD
  function toDateString(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Safe wrapper for localStorage access
  function safeGet(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.warn('[GentlemenStorage] LocalStorage read failed:', err);
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('[GentlemenStorage] LocalStorage write failed:', err);
      return false;
    }
  }

  // Generate unique booking reference: TG-XXXXXX (e.g. TG-849201)
  function generateReference() {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `TG-${randomDigits}`;
  }

  // Initialize seed demo bookings if user has never visited
  function seedDefaultBookings() {
    const alreadySeeded = safeGet(SEED_KEY);
    const existing = safeGet(STORAGE_KEY);

    if (alreadySeeded && existing && existing.length > 0) {
      return;
    }

    const today = new Date();
    
    // An upcoming appointment 2 days from now
    const upcomingDate = new Date();
    upcomingDate.setDate(today.getDate() + 2);

    // A past appointment 5 days ago
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 5);

    const defaultBookings = [
      {
        id: 'TG-782914',
        serviceId: 'haircut-beard',
        serviceName: 'Haircut & Beard',
        servicePrice: 400,
        currency: 'EGP',
        duration: 60,
        barberId: 'marcus-vance',
        barberName: 'Marcus Vance',
        barberTitle: 'Master Barber & Creative Director',
        barberImage: 'assets/images/barber-01.webp',
        date: toDateString(upcomingDate),
        time: '15:00',
        endTime: '16:00',
        customer: {
          name: 'Nour El-Din Reda',
          email: 'nour.reda@example.com',
          phone: '+20 100 123 4567',
          notes: 'Prefer medium taper on the neckline and natural mustache shape.'
        },
        status: 'confirmed', // confirmed | completed | cancelled
        createdAt: new Date(today.getTime() - 86400000).toISOString()
      },
      {
        id: 'TG-512039',
        serviceId: 'hot-towel-shave',
        serviceName: 'Hot Towel Shave',
        servicePrice: 200,
        currency: 'EGP',
        duration: 30,
        barberId: 'david-sterling',
        barberName: 'David Sterling',
        barberTitle: 'Traditional Shave Craftsman & Stylist',
        barberImage: 'assets/images/barber-03.webp',
        date: toDateString(pastDate),
        time: '16:30',
        endTime: '17:00',
        customer: {
          name: 'Nour El-Din Reda',
          email: 'nour.reda@example.com',
          phone: '+20 100 123 4567',
          notes: 'Sensitive skin around the lower neck.'
        },
        status: 'completed',
        createdAt: new Date(pastDate.getTime() - 172800000).toISOString()
      }
    ];

    safeSet(STORAGE_KEY, defaultBookings);
    safeSet(SEED_KEY, true);
  }

  return {
    init() {
      seedDefaultBookings();
    },

    getBookings() {
      const bookings = safeGet(STORAGE_KEY);
      if (!Array.isArray(bookings)) {
        return [];
      }
      // Sort: upcoming first, by date and time
      return bookings.sort((a, b) => {
        const dtA = new Date(`${a.date}T${a.time}`);
        const dtB = new Date(`${b.date}T${b.time}`);
        return dtB - dtA;
      });
    },

    getBookingById(id) {
      if (!id) return null;
      const bookings = this.getBookings();
      return bookings.find(b => b.id.toUpperCase() === id.toUpperCase()) || null;
    },

    saveBooking(bookingData) {
      const bookings = this.getBookings();
      const ref = bookingData.id || generateReference();
      
      const newBooking = {
        ...bookingData,
        id: ref,
        status: bookingData.status || 'confirmed',
        createdAt: bookingData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Check if update or new
      const existingIdx = bookings.findIndex(b => b.id === ref);
      if (existingIdx !== -1) {
        bookings[existingIdx] = newBooking;
      } else {
        bookings.unshift(newBooking);
      }

      const success = safeSet(STORAGE_KEY, bookings);
      if (!success) {
        throw new Error('Unable to write to localStorage. Please check browser privacy/storage settings.');
      }
      return newBooking;
    },

    cancelBooking(id) {
      const bookings = this.getBookings();
      const target = bookings.find(b => b.id === id);
      if (!target) return false;

      target.status = 'cancelled';
      target.updatedAt = new Date().toISOString();
      return safeSet(STORAGE_KEY, bookings);
    },

    deleteBooking(id) {
      const bookings = this.getBookings().filter(b => b.id !== id);
      return safeSet(STORAGE_KEY, bookings);
    },

    resetToDemo() {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SEED_KEY);
        seedDefaultBookings();
        return true;
      } catch (err) {
        console.error('Reset failed:', err);
        return false;
      }
    },

    clearAll() {
      safeSet(STORAGE_KEY, []);
      return true;
    }
  };
})();

// Auto-initialize seed data when script loads
if (typeof window !== 'undefined') {
  GENTLEMEN_STORAGE.init();
}
