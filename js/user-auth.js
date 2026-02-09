// ============================================
// USER AUTHENTICATION SYSTEM
// ============================================

class UserAuth {
  constructor() {
    this.userLoginModal = document.getElementById('userLoginModal');
    this.userSignupModal = document.getElementById('userSignupModal');
    this.userLoginForm = document.getElementById('userLoginForm');
    this.userSignupForm = document.getElementById('userSignupForm');
    this.userLoginBtn = document.getElementById('userLoginBtn');
    this.userLogoutBtn = document.getElementById('userLogoutBtn');
    this.toggleSignupLink = document.getElementById('toggleSignup');
    this.toggleLoginLink = document.getElementById('toggleLogin');
    this.currentUser = null;

    // ENSURE MODALS ARE HIDDEN ON LOAD
    if (this.userLoginModal) {
      this.userLoginModal.style.display = 'none';
    }
    if (this.userSignupModal) {
      this.userSignupModal.style.display = 'none';
    }
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkUserLoginStatus();
    this.updateUserUI();
  }

  setupEventListeners() {
    if (this.userLoginForm) {
      this.userLoginForm.addEventListener('submit', (e) => this.handleUserLogin(e));
    }

    if (this.userSignupForm) {
      this.userSignupForm.addEventListener('submit', (e) => this.handleUserSignup(e));
    }

    if (this.userLoginBtn) {
      this.userLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openUserLogin();
      });
    }

    if (this.userLogoutBtn) {
      this.userLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logoutUser();
      });
    }

    if (this.toggleSignupLink) {
      this.toggleSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchToSignup();
      });
    }

    if (this.toggleLoginLink) {
      this.toggleLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchToLogin();
      });
    }

    if (this.userLoginModal) {
      this.userLoginModal.addEventListener('click', (e) => {
        if (e.target === this.userLoginModal) {
          this.closeUserLogin();
        }
      });
    }

    if (this.userSignupModal) {
      this.userSignupModal.addEventListener('click', (e) => {
        if (e.target === this.userSignupModal) {
          this.closeUserSignup();
        }
      });
    }
  }

  handleUserLogin(e) {
    e.preventDefault();

    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(
      (u) => u.email === email && this.verifyPassword(password, u.password)
    );

    if (user) {
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'user',
        loginTime: new Date()
      };

      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      this.showNotification(`✓ Welcome back, ${user.name}!`, 'success');
      this.userLoginForm.reset();
      this.closeUserLogin();
      this.updateUserUI();

    } else {
      this.showNotification('✗ Invalid email or password.', 'error');
      this.userLoginForm.reset();
    }
  }

  handleUserSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      this.showNotification('✗ Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6) {
      this.showNotification('✗ Password must be at least 6 characters.', 'error');
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.email === email)) {
      this.showNotification('✗ Email already registered.', 'error');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: this.hashPassword(password),
      registrationDate: new Date(),
      role: 'user'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    this.showNotification('✓ Account created! You can now login.', 'success');
    this.userSignupForm.reset();
    
    setTimeout(() => {
      this.switchToLogin();
    }, 1000);
  }

  checkUserLoginStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        // Only restore if it's a user login, not admin
        if (parsed.role === 'user') {
          this.currentUser = parsed;
        }
      } catch (e) {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
      }
    }
  }

  openUserLogin() {
    if (this.userLoginModal) {
      this.userLoginModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  closeUserLogin() {
    if (this.userLoginModal) {
      this.userLoginModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  closeUserSignup() {
    if (this.userSignupModal) {
      this.userSignupModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  switchToSignup() {
    this.closeUserLogin();
    setTimeout(() => {
      if (this.userSignupModal) {
        this.userSignupModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }, 300);
  }

  switchToLogin() {
    this.closeUserSignup();
    setTimeout(() => {
      this.openUserLogin();
    }, 300);
  }

  logoutUser() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.showNotification('✓ Logged out successfully!', 'success');
    this.updateUserUI();
  }

  updateUserUI() {
    const userLoginBtn = document.getElementById('userLoginBtn');
    const userLogoutBtn = document.getElementById('userLogoutBtn');
    const userProfile = document.getElementById('userProfile');

    if (this.currentUser && this.currentUser.role === 'user') {
      if (userLoginBtn) userLoginBtn.style.display = 'none';
      if (userLogoutBtn) userLogoutBtn.style.display = 'inline-block';
      if (userProfile) {
        userProfile.innerHTML = `${this.currentUser.name}`;
      }
    } else {
      if (userLoginBtn) userLoginBtn.style.display = 'inline-block';
      if (userLogoutBtn) userLogoutBtn.style.display = 'none';
      if (userProfile) {
        userProfile.innerHTML = '';
      }
    }
  }

  hashPassword(password) {
    return btoa(password);
  }

  verifyPassword(password, hash) {
    return btoa(password) === hash;
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';

    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${bgColor};
      color: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      animation: slideInDown 0.4s ease-out;
      font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new UserAuth();
});