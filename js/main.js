/* VertX Energies and Electrical Systems - Interactive JavaScript */

// VertX Live Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7v-xkc9Q-1GlFBkOyDsefiQ6kyq_djPo",
  authDomain: "vertx-energies.firebaseapp.com",
  projectId: "vertx-energies",
  storageBucket: "vertx-energies.firebasestorage.app",
  messagingSenderId: "743655920046",
  appId: "1:743655920046:web:4b8e079c8e3bc37451f83f",
  measurementId: "G-6BTMNY4CGG"
};

// Initialize Firebase & Firestore Client
let db = null;
try {
  if (typeof firebase !== 'undefined' && firebaseConfig.projectId) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    console.log('VertX Live Firebase Firestore connected successfully.');
  }
} catch (err) {
  console.warn('Firebase initialization status:', err.message);
}

document.addEventListener('DOMContentLoaded', () => {
  // SOLAR SIZING & SAVINGS CALCULATOR LOGIC (Bimonthly KSEB / Utility Tariff Standard)
  const bimonthlyBillInput = document.getElementById('monthlyBillInput');
  const billDisplay = document.getElementById('billDisplay');
  const recommendedKw = document.getElementById('recommendedKw');
  const recommendedSub = document.getElementById('recommendedSub');
  const monthlyUnits = document.getElementById('monthlyUnits');
  const roofArea = document.getElementById('roofArea');
  const annualSavings = document.getElementById('annualSavings');
  const btnKwText = document.getElementById('btnKwText');
  const calcQuoteBtn = document.getElementById('calcQuoteBtn');
  const typeBtns = document.querySelectorAll('.calc-type-btn');

  let currentType = 'residential'; // 'residential' or 'commercial'

  function calculateSolar() {
    if (!bimonthlyBillInput) return;

    const bimonthlyBill = parseInt(bimonthlyBillInput.value, 10);
    
    // Display formatted 2-month bill
    if (billDisplay) {
      billDisplay.textContent = `₹ ${bimonthlyBill.toLocaleString('en-IN')} / 2 mos`;
    }

    // Tariff rates per unit: ₹7.2/unit for residential (bimonthly slab avg), ₹9.0/unit for commercial
    const tariffRate = currentType === 'residential' ? 7.2 : 9.0;

    // 1 kW generates approx 240 units (kWh) per 2-month billing cycle (120 units/month)
    const unitsPerKwBimonthly = 240;

    // Calculate required units per 2-month cycle
    const bimonthlyUnitsRequired = bimonthlyBill / tariffRate;

    // Recommended System Capacity in kW (minimum 1 kW)
    let kw = Math.round(bimonthlyUnitsRequired / unitsPerKwBimonthly);
    if (kw < 1) kw = 1;

    // Bimonthly Generation & Roof Area
    const generationUnitsBimonthly = kw * unitsPerKwBimonthly;
    const estimatedRoofArea = kw * 90; // ~90 sq.ft per kW

    // Annual Savings (6 bimonthly billing cycles per year, ~90% savings)
    const yearlySavings = Math.round(bimonthlyBill * 6 * 0.90);

    // Update DOM outputs
    if (recommendedKw) recommendedKw.textContent = kw;
    if (recommendedSub) recommendedSub.textContent = `Ideal for your ₹${bimonthlyBill.toLocaleString('en-IN')} (2-month) power bill`;
    if (monthlyUnits) monthlyUnits.textContent = `${generationUnitsBimonthly.toLocaleString('en-IN')} Units / 2 mos`;
    if (roofArea) roofArea.textContent = `${estimatedRoofArea.toLocaleString('en-IN')} sq. ft.`;
    if (annualSavings) annualSavings.textContent = `₹ ${yearlySavings.toLocaleString('en-IN')} / yr`;
    if (btnKwText) btnKwText.textContent = `${kw} kW ${currentType === 'residential' ? 'Home' : 'Commercial'} System`;
  }

  // Event listener for bimonthly bill slider
  if (bimonthlyBillInput) {
    bimonthlyBillInput.addEventListener('input', calculateSolar);
  }

  // Event listeners for Property Type buttons
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.getAttribute('data-type');
      calculateSolar();
    });
  });

  // Initial calculation run
  calculateSolar();

  // Pre-fill Quote Form when clicking Calculator CTA
  if (calcQuoteBtn) {
    calcQuoteBtn.addEventListener('click', () => {
      const kwVal = recommendedKw ? recommendedKw.textContent : '3';
      const billVal = bimonthlyBillInput ? parseInt(bimonthlyBillInput.value, 10).toLocaleString('en-IN') : '5,000';
      
      const propertySelect = document.getElementById('propertyType');
      const messageTextarea = document.getElementById('message');

      if (propertySelect) {
        propertySelect.value = currentType === 'residential' ? 'Residential' : 'Commercial';
      }

      if (messageTextarea) {
        messageTextarea.value = `I used your Solar Calculator and would like a quote for a ${kwVal} kW ${currentType === 'residential' ? 'Residential' : 'Commercial'} Solar System. (2-Month electricity bill: ₹${billVal})`;
      }

      // Smooth scroll to Contact Form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Contact Form Handling with Live Database Storage + WhatsApp Submission
  const quoteForm = document.getElementById('quoteForm');
  const successAlert = document.getElementById('formSuccessAlert');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const propertyType = document.getElementById('propertyType').value;
      const message = document.getElementById('message').value.trim();

      // Lead object for database
      const leadData = {
        name: name,
        phone: phone,
        email: email,
        propertyType: propertyType,
        message: message,
        createdAt: new Date().toISOString(),
        source: 'VertX Website Form',
        status: 'New'
      };

      // Store in Firebase Firestore collection 'quote_requests'
      if (db) {
        db.collection('quote_requests').add(leadData)
          .then((docRef) => {
            console.log('Lead record saved to Firestore DB with ID:', docRef.id);
          })
          .catch((error) => {
            console.error('Firestore save error:', error);
          });
      }

      // Construct formatted WhatsApp message
      const formattedMessage = 
`☀️ *New Solar Quote Request - VertX Energies*

👤 *Name:* ${name}
📞 *Phone:* ${phone}
✉️ *Email:* ${email}
🏠 *Property Type:* ${propertyType}
💬 *Details:* ${message ? message : 'No additional details provided.'}`;

      // Encode for WhatsApp URL
      const whatsappNumber = '919496395506'; // WhatsApp Target Number
      const encodedText = encodeURIComponent(formattedMessage);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

      // Show success alert on page
      if (successAlert) {
        successAlert.innerHTML = '✅ <strong>Thank you!</strong> Your quote request has been recorded. Opening WhatsApp...';
        successAlert.style.display = 'block';
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Open WhatsApp chat in a new tab / app window
      window.open(whatsappUrl, '_blank');

      // Reset form fields
      quoteForm.reset();

      // Auto-hide alert after 8 seconds
      setTimeout(() => {
        if (successAlert) {
          successAlert.style.display = 'none';
        }
      }, 8000);
    });
  }

  // Smooth Scroll for links with hashes
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});
