document.addEventListener('DOMContentLoaded', function () {
  // ========= FAQ Toggle =========
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      answer.classList.toggle('active');
    });
  });

  // ========= Hamburger Menu Toggle =========
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove('active');
    }
  });

  // ========= Message Helper =========
  // Displays a global message within a form.
  const showFormMessage = (form, message, type = "error") => {
    let messageElement = form.querySelector('.form-message');
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.classList.add('form-message');
      form.appendChild(messageElement);
    }
    messageElement.textContent = message;
    messageElement.className = 'form-message ' + type;
  };

  // ========= Error Helpers =========
  const showError = (el, msg) => {
    el.textContent = msg;
    el.style.display = 'block';
  };

  const clearErrors = (els) => {
    els.forEach((el) => {
      el.textContent = '';
      el.style.display = 'none';
    });
  };

  // ========= Form Validation =========
  const validateForm = (form, fields) => {
    let valid = true;
    const errorElements = [];
    const errors = [];

    // Clear previous error messages for each field.
    fields.forEach(({ name }) => {
      const errorElement = document.getElementById(`${name}-error`);
      if (errorElement) {
        clearErrors([errorElement]);
      }
    });

    fields.forEach(({ name, label, required, regex, match }) => {
      const input = form.querySelector(`[name="${name}"]`);
      const errorElement = document.getElementById(`${name}-error`);
      const value = input.value.trim();

      if (required && !value) {
        errors.push(`${label} is required.`);
        errorElements.push(errorElement);
        valid = false;
      } else if (regex && !regex.test(value)) {
        errors.push(`${label} is invalid.`);
        errorElements.push(errorElement);
        valid = false;
      } else if (match) {
        const otherValue = form.querySelector(`[name="${match}"]`).value.trim();
        if (value !== otherValue) {
          errors.push(`${label} does not match.`);
          errorElements.push(errorElement);
          valid = false;
        }
      }
    });

    if (!valid) {
      errors.forEach((error, i) => {
        showError(errorElements[i], error);
      });
    }
    return valid;
  };

  // ========= Local Storage Helpers =========
  const saveUser = (user) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.find((u) => u.email === user.email);
    if (userExists) {
      return { success: false, message: "User with this email already exists." };
    }
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true };
  };

  const authenticateUser = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.email === email && u.password === password);
    return user || null;
  };

  // ========= Form Submit Handler =========
  const handleFormSubmit = (form, fields, type) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear any global form messages.
      const formMsg = form.querySelector('.form-message');
      if (formMsg) {
        formMsg.textContent = '';
      }

      if (validateForm(form, fields)) {
        if (type === 'signup') {
          // Gather data for sign-up.
          const username = form.querySelector('input[name="username"]').value.trim();
          const email = form.querySelector('input[name="email"]').value.trim();
          const password = form.querySelector('input[name="password"]').value.trim();
          const user = { username, email, password };

          const saveResult = saveUser(user);
          if (saveResult.success) {
            // Save the logged in user info upon successful signup.
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            showFormMessage(form, "Account created successfully!", "success");
            form.reset();
            // Redirect to the dashboard after a short delay.
            setTimeout(() => {
              window.location.href = 'dashboard.html';
            }, 1000);
          } else {
            showFormMessage(form, saveResult.message, "error");
          }
        } else if (type === 'login') {
          // Gather data for login.
          const email = form.querySelector('input[name="email"]').value.trim();
          const password = form.querySelector('input[name="password"]').value.trim();
          const user = authenticateUser(email, password);
          if (user) {
            // Save logged in user info.
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            showFormMessage(form, `Welcome, ${user.username}!`, "success");
            form.reset();
            // Redirect to the dashboard after a short delay.
            setTimeout(() => {
              window.location.href = 'dashboard.html';
            }, 1000);
          } else {
            showFormMessage(form, "Incorrect email or password.", "error");
          }
        }
      } else {
        showFormMessage(form, "Please fix the errors in the form.", "error");
      }
    });
  };

  // ========= Field Definitions =========
  const signUpFields = [
    { name: 'username', label: 'Username', required: true },
    { name: 'email', label: 'Email', required: true, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { name: 'password', label: 'Password', required: true, regex: /.{6,}/ },
    { name: 'confirm-password', label: 'Confirm Password', required: true, match: 'password' }
  ];
  const loginFields = [
    { name: 'email', label: 'Email', required: true, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { name: 'password', label: 'Password', required: true, regex: /.{6,}/ }
  ];

  // ========= Get Form Elements =========
  const signUpFormElement = document.querySelector('#signup-form form');
  const loginFormElement = document.querySelector('#login-form form');

  // ========= Initialize Form Handlers =========
  if (signUpFormElement) {
    handleFormSubmit(signUpFormElement, signUpFields, 'signup');
  }
  if (loginFormElement) {
    handleFormSubmit(loginFormElement, loginFields, 'login');
  }
});
