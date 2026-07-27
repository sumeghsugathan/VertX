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

// Web3Forms Access Key for Instant Email Notifications to info@vertxenergies.com
const WEB3FORMS_ACCESS_KEY = "6d1b68e8-a4ee-4b75-b3f7-ab923edcc461";

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

    // Tariff rates per unit: ₹7.2/unit for residential, ₹9.0/unit for commercial
    const tariffRate = currentType === 'residential' ? 7.2 : 9.0;
    const unitsPerKwBimonthly = 240;

    // 1. Recommended System Capacity in kW (minimum 1 kW)
    const bimonthlyUnitsRequired = bimonthlyBill / tariffRate;
    let kw = Math.round(bimonthlyUnitsRequired / unitsPerKwBimonthly);
    if (kw < 1) kw = 1;

    // 2. Generation & Roof Specs
    const generationUnitsBimonthly = kw * unitsPerKwBimonthly;
    const estimatedRoofArea = kw * 90; // ~90 sq.ft per kW

    // 3. PM Surya Ghar Subsidy Grant (Residential Only: ₹30k for 1kW, ₹60k for 2kW, ₹78k flat cap for 3kW+)
    let subsidyVal = 0;
    if (currentType === 'residential') {
      if (kw === 1) {
        subsidyVal = 30000;
      } else if (kw === 2) {
        subsidyVal = 60000;
      } else {
        subsidyVal = 78000; // Flat cap for 3 kW and above
      }
    }

    // 4. Monthly & 25-Year Lifetime Bill Savings (~90% bill reduction)
    const monthlyBillAmount = bimonthlyBill / 2;
    const monthlySavingsVal = Math.round(monthlyBillAmount * 0.90);
    const annualSavingsVal = monthlySavingsVal * 12;
    const totalSavings25YrVal = annualSavingsVal * 25;

    // Update DOM Outputs
    if (recommendedKw) recommendedKw.textContent = kw;
    if (recommendedSub) recommendedSub.textContent = `Ideal for your ₹${bimonthlyBill.toLocaleString('en-IN')} (2-month) power bill`;
    if (btnKwText) btnKwText.textContent = `${kw} kW ${currentType === 'residential' ? 'Home' : 'Commercial'} System`;

    const monthlyUnitsEl = document.getElementById('monthlyUnits');
    const roofAreaEl = document.getElementById('roofArea');
    const monthlySavingsEl = document.getElementById('monthlySavings');
    const totalSavings25YrEl = document.getElementById('totalSavings25Yr');
    const subsidyRowEl = document.getElementById('subsidyRow');
    const subsidyValEl = document.getElementById('subsidyVal');

    if (monthlyUnitsEl) monthlyUnitsEl.textContent = `${generationUnitsBimonthly.toLocaleString('en-IN')} Units / 2 mos`;
    if (roofAreaEl) roofAreaEl.textContent = `${estimatedRoofArea.toLocaleString('en-IN')} sq. ft.`;
    if (monthlySavingsEl) monthlySavingsEl.textContent = `₹ ${monthlySavingsVal.toLocaleString('en-IN')} / mo`;
    if (totalSavings25YrEl) totalSavings25YrEl.textContent = `₹ ${totalSavings25YrVal.toLocaleString('en-IN')}`;

    if (currentType === 'residential') {
      if (subsidyRowEl) subsidyRowEl.style.display = 'flex';
      if (subsidyValEl) subsidyValEl.textContent = `Up to ₹ ${subsidyVal.toLocaleString('en-IN')} Direct Grant`;
    } else {
      if (subsidyRowEl) subsidyRowEl.style.display = 'none';
    }
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

  // FAQ ACCORDION INTERACTION LOGIC
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        // Close all other FAQ accordion items
        faqItems.forEach(i => i.classList.remove('active'));
        // Toggle current item
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

  // Contact Form Handling - Save to Database + Instant Email Notification
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

      // 1. Save Lead Data to Firebase Firestore Database
      const leadData = {
        name: name,
        phone: phone,
        email: email,
        propertyType: propertyType,
        message: message,
        createdAt: new Date().toISOString(),
        source: 'VertX Website Form (vertxenergies.com)',
        status: 'New'
      };

      if (db) {
        db.collection('quote_requests').add(leadData)
          .then((docRef) => {
            console.log('Lead record saved to Firestore DB with ID:', docRef.id);
          })
          .catch((error) => {
            console.error('Firestore save error:', error);
          });
      }

      // 2. Send Instant Email Notification to info@vertxenergies.com
      const emailPayload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `☀️ New Solar Lead: ${name} (${propertyType}) - vertxenergies.com`,
        from_name: "VertX Website",
        name: name,
        phone: phone,
        email: email,
        property_type: propertyType,
        message: message
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      })
      .then(response => response.json())
      .then(result => {
        console.log('Email notification status:', result);
      })
      .catch(err => {
        console.error('Email notification error:', err);
      });

      // Display on-page success alert
      if (successAlert) {
        successAlert.innerHTML = '✅ <strong>Thank you!</strong> Your quote request has been submitted successfully. Our team will contact you shortly.';
        successAlert.style.display = 'block';
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

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

  // SYSTEM TYPE TOGGLE CONTROLLER (HYBRID VS ON-GRID)
  const toggleHybridBtn = document.getElementById('toggleHybridBtn');
  const toggleOngridBtn = document.getElementById('toggleOngridBtn');
  const hybridSystemView = document.getElementById('hybridSystemView');
  const ongridSystemView = document.getElementById('ongridSystemView');

  if (toggleHybridBtn && toggleOngridBtn) {
    toggleHybridBtn.addEventListener('click', () => {
      toggleHybridBtn.classList.add('active');
      toggleOngridBtn.classList.remove('active');
      if (hybridSystemView) hybridSystemView.style.display = 'block';
      if (ongridSystemView) ongridSystemView.style.display = 'none';
    });

    toggleOngridBtn.addEventListener('click', () => {
      toggleOngridBtn.classList.add('active');
      toggleHybridBtn.classList.remove('active');
      if (hybridSystemView) hybridSystemView.style.display = 'none';
      if (ongridSystemView) ongridSystemView.style.display = 'block';
    });
  }

  // SIMPLE AUTOMATIC LOOPING HYBRID ANIMATION BANNER (NON-CLICKABLE)
  const autoIcon = document.getElementById('autoIcon');
  const autoTag = document.getElementById('autoTag');
  const autoTitle = document.getElementById('autoTitle');
  const autoSub = document.getElementById('autoSub');

  const dot1 = document.getElementById('dot1');
  const dot2 = document.getElementById('dot2');
  const dot3 = document.getElementById('dot3');

  const hybridPhases = [
    {
      icon: "☀️",
      tag: "DAYTIME PHASE",
      title: "Solar Powering Home & Charging Li-Ion Battery",
      sub: "Free sunlight runs household loads while storing excess energy into your Li-Ion battery storage."
    },
    {
      icon: "🌙",
      tag: "NIGHTTIME PHASE",
      title: "Stored Li-Ion Battery Energy Powering Your Home",
      sub: "During night hours, your home draws zero-cost electricity directly from the stored Li-Ion battery."
    },
    {
      icon: "⚡",
      tag: "GRID POWER OUTAGE BACKUP",
      title: "Li-Ion Battery Supplies 100% Instant Backup",
      sub: "When KSEB grid load shedding occurs, your Li-Ion battery takes over in under 10ms with zero blackouts."
    }
  ];

  let currentPhaseIndex = 0;

  function updateAutoHybridBanner() {
    const phase = hybridPhases[currentPhaseIndex];
    if (autoIcon) autoIcon.textContent = phase.icon;
    if (autoTag) autoTag.textContent = phase.tag;
    if (autoTitle) autoTitle.textContent = phase.title;
    if (autoSub) autoSub.textContent = phase.sub;

    [dot1, dot2, dot3].forEach((dot, idx) => {
      if (dot) {
        if (idx === currentPhaseIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      }
    });

    currentPhaseIndex = (currentPhaseIndex + 1) % hybridPhases.length;
  }

  // Run automatically every 3.5 seconds
  if (autoIcon) {
    updateAutoHybridBanner();
    setInterval(updateAutoHybridBanner, 3500);
  }
});
