function showToast(message, type = "success") {
    // Create the toast element
    const toast = document.createElement("div");
    toast.className = "toast " + (type === "success" ? "toast-success" : "toast-error");
    toast.textContent = message;
  
    // Append to the body (or a dedicated container)
    document.body.appendChild(toast);
  
    // Trigger fade-out after 3 seconds
    setTimeout(() => {
      toast.classList.add("fade-out");
      // Remove toast after fade-out completes (500ms)
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 3000);
  }
  