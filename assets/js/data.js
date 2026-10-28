/**
 * THE GENTLEMEN — Premium Barbershop Data Store
 * Unified mock data for services, barbers, business hours, and seed appointments.
 */

const GENTLEMEN_DATA = {
  business: {
    name: "THE GENTLEMEN",
    tagline: "Fine Barbering & Grooming Studio",
    established: "2021",
    address: {
      street: "14 El-Gezira Street, Zamalek",
      city: "Cairo",
      country: "Egypt",
      mapUrl: "https://maps.google.com/?q=Zamalek+Cairo"
    },
    contact: {
      phone: "+20 2 2736 8890",
      mobile: "+20 100 889 4433",
      email: "concierge@thegentlemenbarbers.com",
      instagram: "@thegentlemen.cairo"
    },
    hours: [
      { days: "Monday – Thursday", time: "10:00 AM – 10:00 PM", openHour: 10, closeHour: 22 },
      { days: "Friday", time: "01:00 PM – 11:00 PM", openHour: 13, closeHour: 23 },
      { days: "Saturday – Sunday", time: "10:00 AM – 11:00 PM", openHour: 10, closeHour: 23 }
    ]
  },

  services: [
    {
      id: "classic-haircut",
      name: "Classic Haircut",
      category: "hair",
      price: 250,
      currency: "EGP",
      duration: 30, // minutes
      image: "assets/images/service-haircut.webp",
      shortDesc: "Timeless precision shear work tailored to your face shape and personal style.",
      fullDesc: "A complete bespoke consultation followed by precision scissor and clipper work, invigorating scalp wash, neck shave with warm lather, and finish with premium styling pomade.",
      features: [
        "In-depth face shape consultation",
        "Precision scissor & clipper craft",
        "Straight razor clean neck shave",
        "Herbal scalp wash & styling finish"
      ],
      popular: false
    },
    {
      id: "skin-fade",
      name: "Skin Fade",
      category: "hair",
      price: 300,
      currency: "EGP",
      duration: 45,
      image: "assets/images/service-haircut.webp",
      shortDesc: "Flawless gradient transition from smooth skin to bespoke textured length on top.",
      fullDesc: "Meticulous fading technique using foil shaver and micro-adjusted clippers. Seamless blending tailored to your head silhouette, completed with razor edge lining and texture paste.",
      features: [
        "Custom fade height (Low, Mid, High, Drop)",
        "Foil shaver velvet skin finish",
        "Razor edge sharp perimeter lineup",
        "Matte clay or cream styling finish"
      ],
      popular: true
    },
    {
      id: "beard-trim",
      name: "Beard Trim",
      category: "beard",
      price: 150,
      currency: "EGP",
      duration: 20,
      image: "assets/images/service-beard.webp",
      shortDesc: "Sculpting, perimeter definition, and nourishing cedarwood oil hydration.",
      fullDesc: "Freehand clipper sculpting to complement jawline architecture, precision line-up with electric detailing, mustache styling, and warm organic beard butter conditioning.",
      features: [
        "Freehand jawline sculpting",
        "Mustache trimming & shaping",
        "Cheek and neck perimeter cleanup",
        "Organic beard balm & oil treatment"
      ],
      popular: false
    },
    {
      id: "hot-towel-shave",
      name: "Hot Towel Shave",
      category: "shave",
      price: 200,
      currency: "EGP",
      duration: 30,
      image: "assets/images/service-shave.webp",
      shortDesc: "Traditional straight-razor ceremony with eucalyptus steam and cold compress.",
      fullDesc: "The quintessential gentlemen's ritual. Begins with essential oil infused hot towels to open pores, rich badger brush warm lather, two-pass straight razor shave, and cooling alum stone finish.",
      features: [
        "Steamed eucalyptus hot towel compress",
        "Pre-shave botanical protective oil",
        "Double-pass Japanese steel straight razor",
        "Ice-cold towel & sandalwood aftershave balm"
      ],
      popular: false
    },
    {
      id: "haircut-beard",
      name: "Haircut & Beard",
      category: "packages",
      price: 400,
      currency: "EGP",
      duration: 60,
      image: "assets/images/gallery-01.webp",
      shortDesc: "Our signature duo: tailored haircut combined with complete beard architecture.",
      fullDesc: "Comprehensive head-to-neck grooming. Combines our signature precision haircut or fade with complete beard sculpting, hot lather neck cleanup, and custom styling.",
      features: [
        "Complete precision haircut or fade",
        "Full facial hair sculpting & line-up",
        "Hot towel neck shave",
        "Double shampoo & scalp massage"
      ],
      popular: true
    },
    {
      id: "premium-grooming-package",
      name: "Premium Grooming Package",
      category: "packages",
      price: 550,
      currency: "EGP",
      duration: 75,
      image: "assets/images/hero-barbershop.webp",
      shortDesc: "The ultimate 75-minute royal restorative experience for the discerning gentleman.",
      fullDesc: "The pinnacle of bespoke pampering. Includes haircut of choice, complete beard sculpt or hot towel shave, detoxifying volcanic clay face mask, scalp massage, and complimentary espresso.",
      features: [
        "Bespoke Haircut & styling session",
        "Straight razor shave OR beard sculpt",
        "Detoxifying volcanic facial treatment",
        "Extended botanical scalp massage",
        "Single malt bourbon or espresso"
      ],
      popular: true
    }
  ],

  barbers: [
    {
      id: "marcus-vance",
      name: "Marcus Vance",
      title: "Master Barber & Creative Director",
      experience: "12+ Years Experience",
      yearsNum: 12,
      image: "assets/images/barber-01.webp",
      rating: 4.98,
      reviewsCount: 640,
      specialty: "Classic Scissor Cuts & Bespoke Styling",
      bio: "Trained in Mayfair, London, Marcus brings classical English precision to contemporary men's silhouettes. Renowned for scissor-over-comb craftsmanship and architectural hair designs that grow out impeccably.",
      specialties: ["Classic Shear Work", "Executive Styling", "Scissor-over-Comb", "Texture Formulation"],
      schedule: {
        workingDays: [1, 2, 3, 4, 5, 6], // Mon - Sat (0 = Sun, 1 = Mon...)
        startHour: 10,
        endHour: 20
      }
    },
    {
      id: "julian-thorne",
      name: "Julian Thorne",
      title: "Senior Fade Specialist & Beard Artisan",
      experience: "8+ Years Experience",
      yearsNum: 8,
      image: "assets/images/barber-02.webp",
      rating: 4.96,
      reviewsCount: 512,
      specialty: "Precision Skin Fades & Geometric Beard Sculpting",
      bio: "Julian is a master of contrast and modern gradients. His razor-sharp tape-ups, seamless skin fades, and symmetrical beard architecture make him the go-to specialist for bold, sharp aesthetics.",
      specialties: ["Low/Mid/High Fades", "Beard Sculpting", "Razor Lining", "Hair Art & Geometry"],
      schedule: {
        workingDays: [0, 1, 2, 3, 4], // Sun - Thu
        startHour: 12,
        endHour: 22
      }
    },
    {
      id: "david-sterling",
      name: "David Sterling",
      title: "Traditional Shave Craftsman & Stylist",
      experience: "10+ Years Experience",
      yearsNum: 10,
      image: "assets/images/barber-03.webp",
      rating: 4.99,
      reviewsCount: 488,
      specialty: "Straight Razor Hot Towel Shaves & Executive Grooming",
      bio: "A true traditionalist, David embodies the vintage barbershop heritage. Specializing in hot lather straight-razor treatments and relaxed luxury grooming, he treats every shave as an unhurried, mindful ritual.",
      specialties: ["Hot Towel Shaves", "Facial Treatments", "Classic Pompadours", "Scalp Wellness"],
      schedule: {
        workingDays: [0, 2, 3, 4, 5, 6], // Sun, Tue - Sat
        startHour: 11,
        endHour: 21
      }
    }
  ],

  testimonials: [
    {
      id: "t1",
      author: "Tarek Mansour",
      role: "Managing Partner, Investment Capital",
      rating: 5,
      date: "October 14, 2026",
      text: "The Gentlemen sets a benchmark that rivals the finest barbershops in London or Milan. Marcus understands head anatomy like no one else. The hot espresso, vintage leather chairs, and meticulous scissor work make it an essential bi-weekly ritual.",
      service: "Haircut & Beard"
    },
    {
      id: "t2",
      author: "Dr. Sherif El-Wakil",
      role: "Aesthetic Surgeon",
      rating: 5,
      date: "October 20, 2026",
      text: "As someone who demands microscopic attention to detail, Julian's skin fade technique is unmatched. Crisp lines, unhurried service, and a relaxed private club atmosphere. Booking through their platform is seamless.",
      service: "Skin Fade"
    },
    {
      id: "t3",
      author: "Karim Abdel-Nasser",
      role: "Architectural Director",
      rating: 5,
      date: "September 29, 2026",
      text: "The Hot Towel Shave with David is pure therapy after an intense working week. The eucalyptus hot towels, straight razor precision, and sandalwood finish are worth every single pound. Truly a gentleman's sanctuary.",
      service: "Premium Grooming Package"
    }
  ],

  gallery: [
    { image: "assets/images/gallery-01.webp", title: "Beard Sculpt & Classic Cut", tag: "Signature Craft" },
    { image: "assets/images/gallery-02.webp", title: "Hot Towel Shave Ritual", tag: "Traditional Shave" },
    { image: "assets/images/gallery-03.webp", title: "Skin Fade & Edge Detailing", tag: "Precision Fade" },
    { image: "assets/images/about-interior.webp", title: "The Heritage Lounge & Bar", tag: "Atmosphere" },
    { image: "assets/images/hero-barbershop.webp", title: "Master Station & Tools", tag: "Studio Interior" }
  ],

  // Pre-seeded demo appointments to showcase occupied slots and active schedule calculations
  demoOccupiedSlots: [
    {
      barberId: "marcus-vance",
      dateOffsetDays: 0, // Today
      time: "11:00",
      duration: 45
    },
    {
      barberId: "marcus-vance",
      dateOffsetDays: 0,
      time: "14:30",
      duration: 60
    },
    {
      barberId: "marcus-vance",
      dateOffsetDays: 1, // Tomorrow
      time: "10:30",
      duration: 30
    },
    {
      barberId: "marcus-vance",
      dateOffsetDays: 1,
      time: "16:00",
      duration: 60
    },
    {
      barberId: "julian-thorne",
      dateOffsetDays: 0,
      time: "13:00",
      duration: 45
    },
    {
      barberId: "julian-thorne",
      dateOffsetDays: 0,
      time: "17:30",
      duration: 45
    },
    {
      barberId: "julian-thorne",
      dateOffsetDays: 1,
      time: "15:00",
      duration: 75
    },
    {
      barberId: "david-sterling",
      dateOffsetDays: 0,
      time: "12:00",
      duration: 30
    },
    {
      barberId: "david-sterling",
      dateOffsetDays: 0,
      time: "16:30",
      duration: 45
    },
    {
      barberId: "david-sterling",
      dateOffsetDays: 1,
      time: "14:00",
      duration: 60
    }
  ]
};

// Freeze object to avoid accidental mutations
if (typeof Object.freeze === 'function') {
  Object.freeze(GENTLEMEN_DATA);
}
