document.addEventListener("DOMContentLoaded", function () {
  // --- Logout Functionality ---
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Optionally clear stored user data for a true logout:
      // localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    });
  }

  // --- Update Welcome Message ---
  const welcomeMsg = document.getElementById("welcome-msg");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser && loggedInUser.username && welcomeMsg) {
    welcomeMsg.querySelector("span").textContent = loggedInUser.username;
  } else if (welcomeMsg) {
    welcomeMsg.querySelector("span").textContent = "Guest";
  }

  // --- Function to Update SMS Balance ---
  function updateSmsBalance() {
    let balance = localStorage.getItem("smsBalance");
    if (balance === null) {
      balance = 500; // default balance
      localStorage.setItem("smsBalance", balance);
    }
    const smsBalanceElement = document.getElementById("sms-balance");
    if (smsBalanceElement) {
      smsBalanceElement.textContent = balance;
    }
  }

  // --- Function to Update Recent Activity Section ---
  function updateActivitySection() {
    const activityLog = JSON.parse(localStorage.getItem("activityLog")) || [];
    const activityList = document.getElementById("activity-log");
    if (activityList) {
      activityList.innerHTML = "";
      if (activityLog.length === 0) {
        activityList.innerHTML = "<li>No recent activity yet.</li>";
      } else {
        activityLog.forEach(entry => {
          const activityItem = document.createElement("li");
          // Optionally, format the time using new Date(entry.time).toLocaleString()
          activityItem.innerHTML = `<strong>${entry.message}</strong> <small>(${entry.time})</small>`;
          activityList.appendChild(activityItem);
        });
      }
    }
  }

  // --- Initial Updates ---
  updateSmsBalance();
  updateActivitySection();

  // --- Optionally Refresh Data Periodically --- 
  // Uncomment the following block if you want periodic refresh:
  // setInterval(() => {
  //   updateSmsBalance();
  //   updateActivitySection();
  // }, 60000);
});
