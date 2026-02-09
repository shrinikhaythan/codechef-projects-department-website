// ============================================
// ADMIN PANEL MANAGEMENT
// ============================================

class AdminPanel {
  constructor() {
    this.adminTabs = document.querySelectorAll('.admin-tab-btn');
    this.adminTabContents = document.querySelectorAll('.admin-tab-content');
    this.addMemberForm = document.getElementById('addMemberForm');
    this.editContentForm = document.getElementById('editContentForm');
    this.addProjectForm = document.getElementById('addProjectForm');
    this.membersList = document.getElementById('membersList');
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadMembers();
  }

  setupEventListeners() {
    // Tab switching
    this.adminTabs.forEach((tab) => {
      tab.addEventListener('click', (e) => this.switchTab(e));
    });

    // Form submissions
    if (this.addMemberForm) {
      this.addMemberForm.addEventListener('submit', (e) =>
        this.handleAddMember(e)
      );
    }

    if (this.editContentForm) {
      this.editContentForm.addEventListener('submit', (e) =>
        this.handleEditContent(e)
      );
    }

    if (this.addProjectForm) {
      this.addProjectForm.addEventListener('submit', (e) =>
        this.handleAddProject(e)
      );
    }
  }

  switchTab(e) {
    const tabName = e.target.dataset.tab;

    // Remove active class from all tabs
    this.adminTabs.forEach((tab) => tab.classList.remove('active'));
    e.target.classList.add('active');

    // Remove active class from all contents
    this.adminTabContents.forEach((content) => {
      content.classList.remove('active');
    });

    // Add active class to selected content
    const activeContent = document.querySelector(
      `.admin-tab-content[data-tab="${tabName}"]`
    );
    if (activeContent) {
      activeContent.classList.add('active');
    }
  }

  handleAddMember(e) {
    e.preventDefault();

    const formData = new FormData(this.addMemberForm);
    const member = {
      id: Date.now(),
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      group: formData.get('group'),
      tenure: formData.get('tenure'),
      linkedin: formData.get('linkedin') || '#',
      github: formData.get('github') || '#',
      photo: formData.get('photo') || 'https://via.placeholder.com/140/FF6B35/ffffff?text=' + formData.get('name').charAt(0)
    };

    // Get existing members from localStorage
    let members = JSON.parse(localStorage.getItem('appMembers')) || {};

    if (!members[member.tenure]) {
      members[member.tenure] = {};
    }

    if (!members[member.tenure][member.group]) {
      members[member.tenure][member.group] = [];
    }

    members[member.tenure][member.group].push(member);
    localStorage.setItem('appMembers', JSON.stringify(members));

    this.showNotification(`✓ ${member.name} added successfully!`, 'success');
    this.addMemberForm.reset();
    this.loadMembers();
  }

  handleEditContent(e) {
    e.preventDefault();

    const formData = new FormData(this.editContentForm);
    const content = {
      section: formData.get('section'),
      content: formData.get('content')
    };

    let contentData = JSON.parse(localStorage.getItem('contentData')) || {};
    contentData[content.section] = content.content;
    localStorage.setItem('contentData', JSON.stringify(contentData));

    this.showNotification('✓ Content updated successfully!', 'success');
    this.editContentForm.reset();
  }

  handleAddProject(e) {
    e.preventDefault();

    const formData = new FormData(this.addProjectForm);
    const project = {
      id: Date.now(),
      title: formData.get('title'),
      description: formData.get('description'),
      technologies: formData.get('technologies')
        .split(',')
        .map((t) => t.trim()),
      github: formData.get('github'),
      demo: formData.get('demo') || '#',
      status: formData.get('status'),
      contributors: ['Admin']
    };

    let projects = JSON.parse(localStorage.getItem('appProjects')) || [];
    projects.push(project);
    localStorage.setItem('appProjects', JSON.stringify(projects));

    this.showNotification(
      `✓ Project "${project.title}" added successfully!`,
      'success'
    );
    this.addProjectForm.reset();
  }

  loadMembers() {
    const members = JSON.parse(localStorage.getItem('appMembers')) || {};
    let html = '';

    for (const tenure in members) {
      for (const group in members[tenure]) {
        members[tenure][group].forEach((member) => {
          html += `
            <div class="member-item">
              <div>
                <strong>${member.name}</strong>
                <p style="color: var(--text-secondary); margin: 0.25rem 0; font-size: 0.875rem;">
                  ${member.role} • ${group} • ${member.tenure}
                </p>
              </div>
              <button class="btn btn-danger" onclick="adminPanel.deleteMember(${member.id}, '${member.tenure}', '${group}')">
                Remove
              </button>
            </div>
          `;
        });
      }
    }

    if (html) {
      this.membersList.innerHTML = html;
    } else {
      this.membersList.innerHTML =
        '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No members added yet.</p>';
    }
  }

  deleteMember(id, tenure, group) {
    const members = JSON.parse(localStorage.getItem('appMembers')) || {};

    if (members[tenure] && members[tenure][group]) {
      members[tenure][group] = members[tenure][group].filter(
        (m) => m.id !== id
      );

      // Clean up empty objects
      if (members[tenure][group].length === 0) {
        delete members[tenure][group];
      }
      if (Object.keys(members[tenure]).length === 0) {
        delete members[tenure];
      }
    }

    localStorage.setItem('appMembers', JSON.stringify(members));
    this.showNotification('✓ Member removed successfully!', 'success');
    this.loadMembers();
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

    setTimeout(() => {
      notification.style.animation = 'slideInUp 0.4s ease-out forwards';
      setTimeout(() => notification.remove(), 400);
    }, 3000);
  }
}

let adminPanel;

document.addEventListener('DOMContentLoaded', () => {
  adminPanel = new AdminPanel();
});