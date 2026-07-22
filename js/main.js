/* VertX Energies and Electrical Systems - Interactive JavaScript */
document.addEventListener('DOMContentLoaded', () => {
  // SOLAR SIZING & SAVINGS CALCULATOR LOGIC
  const monthlyBillInput = document.getElementById('monthlyBillInput');
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
    if (!monthlyBillInput) return;

    const billVal = parseInt(monthlyBillInput.value, 10);
    
    // Display formatted bill
    if (billDisplay) {
      billDisplay.textContent = `₹ ${billVal.toLocaleString('en-IN')} / mo`;
    }

    // Tariff rates: ₹7.5/unit for residential, ₹9.0/unit for commercial
    const tariffRate = currentType === 'residential' ? 7.5 : 9.0;

    // 1 kW generates approx 120 units (kWh) per month
    const unitsPerKwMonth = 120;

    // Calculate required monthly units
    const monthlyUnitsRequired = billVal / tariffRate;

    // Recommended System Capacity in kW (minimum 1 kW)
    let kw = Math.round(monthlyUnitsRequired / unitsPerKwMonth);
    if (kw < 1) kw = 1;

    // Monthly Generation & Roof Area
    const generationUnits = kw * unitsPerKwMonth;
    const estimatedRoofArea = kw * 90; // ~90 sq.ft per kW

    // Annual Savings (approx 90% of electricity bill saved per year)
    const yearlySavings = Math.round(billVal * 12 * 0.90);

    // Update DOM outputs
    if (recommendedKw) recommendedKw.textContent = kw;
    if (recommendedSub) recommendedSub.textContent = `Ideal for your ₹${billVal.toLocaleString('en-IN')} monthly power bill`;
    if (monthlyUnits) monthlyUnits.textContent = `${generationUnits.toLocaleString('en-IN')} Units / mo`;
    if (roofArea) roofArea.textContent = `${estimatedRoofArea.toLocaleString('en-IN')} sq. ft.`;
    if (annualSavings) annualSavings.textContent = `₹ ${yearlySavings.toLocaleString('en-IN')} / yr`;
    if (btnKwText) btnKwText.textContent = `${kw} kW ${currentType === 'residential' ? 'Home' : 'Commercial'} System`;
  }

  // Event listener for monthly bill slider
  if (monthlyBillInput) {
    monthlyBillInput.addEventListener('input', calculateSolar);
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
      const billVal = monthlyBillInput ? parseInt(monthlyBillInput.value, 10).toLocaleString('en-IN') : '4,000';
      
      const propertySelect = document.getElementById('propertyType');
      const messageTextarea = document.getElementById('message');

      if (propertySelect) {
        propertySelect.value = currentType === 'residential' ? 'Residential' : 'Commercial';
      }

      if (messageTextarea) {
        messageTextarea.value = `I used your Solar Calculator and would like a quote for a ${kwVal} kW ${currentType === 'residential' ? 'Residential' : 'Commercial'} Solar System. (Average monthly bill: ₹${billVal})`;
      }

      // Smooth scroll to Contact Form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Contact Form Handling with Direct WhatsApp Submission
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
        successAlert.innerHTML = '✅ <strong>Thank you!</strong> Opening WhatsApp to send your quote request...';
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
