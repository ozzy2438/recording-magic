type ToastType = 'success' | 'error' | 'info';

class Toast {
  private createToast(message: string, type: ToastType) {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
      document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `
      px-4 py-2 rounded-lg shadow-lg text-white
      transform transition-all duration-300 ease-in-out
      ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'}
    `;
    toast.textContent = message;

    // Add toast to container
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });

    // Remove after delay
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        container.removeChild(toast);
        if (container.children.length === 0) {
          document.body.removeChild(container);
        }
      }, 300);
    }, 3000);
  }

  success(message: string) {
    this.createToast(message, 'success');
  }

  error(message: string) {
    this.createToast(message, 'error');
  }

  info(message: string) {
    this.createToast(message, 'info');
  }
}

export const toast = new Toast();