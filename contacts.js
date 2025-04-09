document.addEventListener("DOMContentLoaded", function () {
  /*********************
   * Data Initialization
   *********************/
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  
  // Save contacts to localStorage
  function saveContacts() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }
  
  /*********************
   * Helper Functions
   *********************/
  
  // Display status messages beneath the add contact form
  function displayStatus(message, type) {
    const statusEl = document.getElementById("statusMessage");
    statusEl.textContent = message;
    statusEl.className = "status-message " + type; // Will be "success" or "error"
    setTimeout(() => {
      statusEl.textContent = "";
      statusEl.className = "status-message";
    }, 3000);
  }
  
  // Validate phone number: Must start with "07" and be 10 digits in total
  function isValidPhone(phone) {
    const phoneRegex = /^(07[0-9]{8})$/;
    return phoneRegex.test(phone);
  }
  
  /*********************
   * Display Contacts
   *********************/
  function displayContacts() {
    const tbody = document.querySelector("#contactsTable tbody");
    const searchFilter = document.getElementById("searchInput").value.trim().toLowerCase();
    const sortCriterion = document.getElementById("sortSelect").value;
    
    // Filter contacts by search input
    let filteredContacts = contacts.filter(contact => {
      return (
        contact.name.toLowerCase().includes(searchFilter) ||
        contact.phone.includes(searchFilter)
      );
    });
    
    // Sort contacts based on the selected sort criterion
    if (sortCriterion === "name") {
      filteredContacts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortCriterion === "date") {
      filteredContacts.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    }
    
    // Clear table
    tbody.innerHTML = "";
    if (filteredContacts.length === 0) {
      tbody.innerHTML = "<tr><td colspan='4'>No contacts found.</td></tr>";
      return;
    }
    
    // Build table rows
    filteredContacts.forEach((contact, i) => {
      // Use the actual index in the contacts array to edit/delete later.
      const index = contacts.indexOf(contact);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${contact.name}</td>
        <td>${contact.phone}</td>
        <td>${contact.group || "N/A"}</td>
        <td>
          <button class="edit-btn" data-index="${index}"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  /*********************
   * Event Listeners
   *********************/
  
  // Add Contact Form Submission
  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("number").value.trim();
    const group = document.getElementById("groupSelect").value;
    
    // Validate required fields
    if (!name || !phone) {
      displayStatus("Please fill in all fields.", "error");
      return;
    }
    // Validate phone number format
    if (!isValidPhone(phone)) {
      displayStatus("Invalid phone number. Must start with '07' and contain 10 digits.", "error");
      return;
    }
    
    // Create new contact object and add timestamp
    const newContact = {
      name,
      phone,
      group,
      dateAdded: new Date().toISOString()
    };
    contacts.push(newContact);
    saveContacts();
    contactForm.reset();
    displayStatus("Contact added successfully.", "success");
    displayContacts();
  });
  
  // Edit / Delete Contact from Contacts Table
  document.querySelector("#contactsTable tbody").addEventListener("click", function (e) {
    if (e.target.closest(".delete-btn")) {
      const index = e.target.closest(".delete-btn").dataset.index;
      if (confirm("Are you sure you want to delete this contact?")) {
        contacts.splice(index, 1);
        saveContacts();
        displayStatus("Contact deleted.", "success");
        displayContacts();
      }
    }
    if (e.target.closest(".edit-btn")) {
      const index = e.target.closest(".edit-btn").dataset.index;
      const contact = contacts[index];
      const newName = prompt("Edit contact name:", contact.name);
      const newPhone = prompt("Edit contact phone:", contact.phone);
      const newGroup = prompt("Edit contact group:", contact.group || "");
      if (newName !== null && newPhone !== null) {
        if (!isValidPhone(newPhone.trim())) {
          displayStatus("Invalid phone number for update.", "error");
          return;
        }
        contacts[index].name = newName.trim();
        contacts[index].phone = newPhone.trim();
        contacts[index].group = newGroup.trim();
        saveContacts();
        displayStatus("Contact updated.", "success");
        displayContacts();
      }
    }
  });
  
  // Search Functionality
  document.getElementById("searchInput").addEventListener("input", displayContacts);
  
  // Sort Dropdown Functionality
  document.getElementById("sortSelect").addEventListener("change", function () {
    displayContacts();
    displayStatus("Contacts sorted.", "success");
  });
  
  // Initial Display of Contacts on Page Load
  displayContacts();
});
