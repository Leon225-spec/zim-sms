document.addEventListener("DOMContentLoaded", function () {
  // Back to Dashboard functionality
  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "dashboard.html"; // Navigate back to dashboard
  });

  // Load contacts from localStorage for selection
  function loadContacts() {
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    const contactsList = document.getElementById("contacts-list");
    contactsList.innerHTML = "";
    if (contacts.length === 0) {
      contactsList.innerHTML = "<li>No contacts available.</li>";
    } else {
      contacts.forEach(contact => {
        const li = document.createElement("li");
        li.innerHTML = `<button class="contact-btn" data-phone="${contact.phone}">
                          <i class="fas fa-user"></i> ${contact.name}
                        </button>`;
        contactsList.appendChild(li);
      });
    }
  }
  
  loadContacts();

  // When a contact button is clicked, auto-fill the recipient number field and highlight selection
  const contactsList = document.getElementById("contacts-list");
  contactsList.addEventListener("click", function (e) {
    const btn = e.target.closest("button.contact-btn");
    if (btn) {
      const phone = btn.getAttribute("data-phone");
      document.getElementById("recipient-number").value = phone;
      // Remove active class from all and then add to clicked button
      contactsList.querySelectorAll(".contact-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    }
  });

  // Trim spaces from the recipient number input live
  document.getElementById("recipient-number").addEventListener("input", function () {
    this.value = this.value.replace(/\s/g, '');
  });

  // Character counter for SMS message
  const smsMessage = document.getElementById("sms-message");
  const charCount = document.getElementById("char-count");
  
  function updateCharCount() {
    const remaining = 160 - smsMessage.value.length;
    charCount.textContent = `${remaining} characters remaining`;
    charCount.style.color = remaining < 0 ? "red" : "#666";
  }
  
  smsMessage.addEventListener("input", updateCharCount);
  updateCharCount();

  // Handle SMS form submission
  const smsForm = document.getElementById("send-sms-form");
  const statusMessage = document.getElementById("status-message");
  const sendBtn = smsForm.querySelector("button[type='submit']");

  smsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    statusMessage.innerHTML = "";

    const phone = document.getElementById("recipient-number").value.trim();
    const message = smsMessage.value.trim();

    // Basic validation
    if (phone === "" || message === "") {
      statusMessage.innerHTML = `<div class="sms-error">⚠️ Please fill out both fields.</div>`;
      return;
    }
    if (!/^(07[0-9]{8})$/.test(phone)) {
      statusMessage.innerHTML = `<div class="sms-error">📵 Invalid phone number format. Must be 10 digits and start with 07.</div>`;
      return;
    }
    if (message.length > 160) {
      statusMessage.innerHTML = `<div class="sms-error">✂️ Your message exceeds 160 characters.</div>`;
      return;
    }

    // Disable button and show loading feedback
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    statusMessage.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending SMS...`;
    statusMessage.style.color = "#1E90FF";

    setTimeout(() => {
      // Log activity in localStorage (for recent activity on dashboard)
      const activityLog = JSON.parse(localStorage.getItem("activityLog")) || [];
      activityLog.push({ 
        message: "SMS sent to " + phone, 
        time: new Date().toLocaleString() 
      });
      if (activityLog.length > 5) {
        activityLog.shift();
      }
      localStorage.setItem("activityLog", JSON.stringify(activityLog));

      // Show success feedback
      statusMessage.innerHTML = `<i class="fas fa-check-circle"></i> Message sent successfully!`;
      statusMessage.style.color = "green";

      // Reset form and character counter
      smsForm.reset();
      updateCharCount();

      // Reset send button
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send SMS';

      // Remove active class from selected contact buttons
      contactsList.querySelectorAll(".contact-btn").forEach(b => b.classList.remove("active"));
    }, 2000);
  });
});
