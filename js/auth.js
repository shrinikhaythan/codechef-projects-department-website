// ============================================
// AUTHENTICATION SYSTEM
// ============================================

class AuthManager {
  constructor() {
    this.loginModal = document.getElementById('loginModal');
    this.adminModal = document.getElementById('adminModal');
    this.loginForm = document.getElementById('loginForm');
    this.adminToggle = document.getElementById('loginBtn');
    this.closeLoginModal = document.getElementById('closeLoginModal');
    this.closeAdminModal = document.getElementById('closeAdminModal');
    this.adminLogout = document.getElementById('adminLogout');
    this.currentUser = null;
    this.admins = [
      {
        email: 'admin@codechef-projects.com',
        password: 'Admin@123'
      },
      {
        email: 'lead@codechef-projects.com',
        password: 'Lead@123'
      }
    ];

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkLoginStatus();
    this.updateAdminUI();
  }

  setupEventListeners() {
    // Login form submission
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Admin toggle button
    if (this.adminToggle) {
      this.adminToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAdminPanel();
      });
    }

    // Close login modal button
    if (this.closeLoginModal) {
      this.closeLoginModal.addEventListener('click', () => this.closeLogin());
    }

    // Close admin modal button
    if (this.closeAdminModal) {
      this.closeAdminModal.addEventListener('click', () => this.closeAdmin());
    }

    // Admin logout button
    if (this.adminLogout) {
      this.adminLogout.addEventListener('click', () => this.logout());
    }

    // Close modal on background click
    if (this.loginModal) {
      this.loginModal.addEventListener('click', (e) => {
        if (e.target === this.loginModal) {
          this.closeLogin();
        }
      });
    }

    if (this.adminModal) {
      this.adminModal.addEventListener('click', (e) => {
        if (e.target === this.adminModal) {
          this.closeAdmin();
        }
      });
    }

    // Admin tab switching
    document.querySelectorAll('.admin-tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => this.switchAdminTab(e));
    });
  }

  handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate credentials
    const admin = this.admins.find(
      (a) => a.email === email && a.password === password
    );

    if (admin) {
      // Successful login
      this.currentUser = {
        email: email,
        role: 'admin',
        loginTime: new Date()
      };

      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      // Show success notification
      this.showNotification('✓ Login successful! Welcome back.', 'success');

      // Reset form
      this.loginForm.reset();

      // Close login modal
      setTimeout(() => {
        this.closeLogin();
        
        // Open admin modal
        setTimeout(() => {
          this.openAdmin();
          this.updateAdminUI();
        }, 300);
      }, 500);

    } else {
      // Failed login
      this.showNotification('✗ Invalid email or password. Try again.', 'error');
      this.loginForm.reset();
    }
  }

  checkLoginStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        this.currentUser = JSON.parse(user);
      } catch (e) {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
      }
    }
  }

  openAdminPanel() {
    if (!this.currentUser) {
      // Open login modal
      this.openLogin();
    } else {
      // Open admin modal
      this.openAdmin();
    }
  }

  openLogin() {
    if (this.loginModal) {
      this.loginModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  closeLogin() {
    if (this.loginModal) {
      this.loginModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  openAdmin() {
    if (this.adminModal) {
      this.adminModal.classList.add('active');
      this.adminModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  closeAdmin() {
    if (this.adminModal) {
      this.adminModal.classList.remove('active');
      this.adminModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  logout() {
    // Clear user data
    localStorage.removeItem('currentUser');
    this.currentUser = null;

    // Close admin modal
    this.closeAdmin();

    // Show logout notification
    this.showNotification('✓ Logged out successfully!', 'success');

    // Optionally reset form
    if (this.loginForm) {
      this.loginForm.reset();
    }
  }

  switchAdminTab(e) {
    const tabName = e.target.dataset.tab;

    // Update active button
    document.querySelectorAll('.admin-tab-btn').forEach((btn) => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');

    // Update active content
    document.querySelectorAll('.admin-tab-content').forEach((content) => {
      content.classList.remove('active');
    });

    const activeContent = document.querySelector(
      `.admin-tab-content[data-tab="${tabName}"]`
    );
    if (activeContent) {
      activeContent.classList.add('active');
    }
  }

  updateAdminUI() {
    if (this.currentUser) {
      const userInfo = document.getElementById('adminUserInfo');
      if (userInfo) {
        userInfo.textContent = `👤 ${this.currentUser.email}`;
      }
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const bgColor = type === 'success' ? '#10b981' : 
                    type === 'error' ? '#ef4444' : 
                    '#3b82f6';

    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${bgColor};
      color: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10001;
      animation: slideInDown 0.4s ease-out;
      font-weight: 500;
      max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideInUp 0.4s ease-out forwards';
      setTimeout(() => {
        notification.remove();
      }, 400);
    }, 3000);
  }
}

// Initialize Auth Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AuthManager();
});