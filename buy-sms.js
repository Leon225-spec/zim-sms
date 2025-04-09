document.addEventListener('DOMContentLoaded', () => {
  const buyButtons = document.querySelectorAll('.buy-btn');
  const toast = document.getElementById('toast');

  buyButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Disable the button and show spinning icon
      button.disabled = true;
      // Change the inner HTML to show a spinner
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

      const credits = button.dataset.credits;
      const price = button.dataset.price;
      
      simulatePurchase(credits, price, button);
    });
  });

  function simulatePurchase(credits, price, button) {
    // Fake asynchronous process to simulate payment
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;  // 80% chance of success
      if (isSuccess) {
        showToast(`Successfully purchased ${credits} SMS credits for $${price}.`, 'success');
      } else {
        showToast(`Payment failed for ${credits} SMS credits. Please try again.`, 'error');
      }
      // Re-enable button and restore original text
      button.disabled = false;
      button.innerHTML = '<i class="fas fa-shopping-cart"></i> Buy Now';
    }, 1500);
  }

  function showToast(message, type) {
    toast.textContent = message;
    // Apply the appropriate class (toast-success or toast-error)
    toast.className = 'toast show ' + (type === 'success' ? 'toast-success' : 'toast-error');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
  
  // Logout functionality (if present)
  const logoutBtn = document.getElementById("logout-btn");
  if(logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  }
});
