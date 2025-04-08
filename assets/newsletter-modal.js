if (!customElements.get('newsletter-modal')) {
  class NewsletterModal extends HTMLElement {
    constructor() {
      super();
      this.closeButton = this.querySelector('.newsletter-modal__close-button');
      this.overlay = this.querySelector('.modal-overlay');
      this.delay = parseInt(this.dataset.delaySeconds || 5) * 1000;
      this.showOncePerSession = this.dataset.showOncePerSession === 'true';
      this.cookieName = 'newsletter_popup_seen';
      this.isOpen = false;

      // Direct binding for close button
      if (this.closeButton) {
        this.closeButton.addEventListener('click', () => {
          this.close();
        });
      }

      // Direct binding for overlay
      if (this.overlay) {
        this.overlay.addEventListener('click', () => {
          this.close();
        });
      }

      // Initialize the modal timing
      if (this.dataset.autoShow === 'true') {
        this.initModal();
      }

      // Handle form submission
      const form = this.querySelector('form');
      if (form) {
        form.addEventListener('submit', () => {
          this.setCookie();
        });
      }
    }

    connectedCallback() {
      // Handle ESC key to close modal
      document.addEventListener('keyup', (evt) => {
        if (evt.code === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Make sure the close button has a listener
      // This fixes cases where the button might not be available in constructor
      if (!this.closeButton) {
        this.closeButton = this.querySelector('.newsletter-modal__close-button');
        if (this.closeButton) {
          this.closeButton.addEventListener('click', () => {
            this.close();
          });
        }
      }
    }

    initModal() {
      // Check if the modal has been shown this session
      if (this.showOncePerSession && this.getCookie()) {
        return;
      }

      // Set timeout to show modal after delay
      setTimeout(() => {
        this.open();
      }, this.delay);
    }

    open() {
      if (this.isOpen) return;

      this.setAttribute('open', '');

      // Lock body scroll
      document.documentElement.classList.add('overflow-hidden');
      document.body.classList.add('overflow-hidden');

      // Track that the modal is open
      this.isOpen = true;
    }

    close() {
      if (!this.isOpen) return;

      this.removeAttribute('open');

      // Unlock body scroll
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');

      // Set cookie to track that user has seen the popup
      if (this.showOncePerSession) {
        this.setCookie();
      }

      // Track that the modal is closed
      this.isOpen = false;
    }

    getCookie() {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${this.cookieName}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }

    setCookie() {
      // Set cookie to expire at end of session
      document.cookie = `${this.cookieName}=1; path=/`;
    }
  }

  customElements.define('newsletter-modal', NewsletterModal);
}
