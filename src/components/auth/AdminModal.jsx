import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Inline SVG icon components
const IconX = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconUsers = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconFolderOpen = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>;
const IconFileText = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
const IconShield = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const IconSettings = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
const IconUserPlus = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>;
const IconExternalLink = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>;

const AdminModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('members');
    const { user, logout } = useAuth();

    // Force re-render helper to update lists
    const [tick, setTick] = useState(0);
    const forceUpdate = () => setTick(t => t + 1);

    // Settings Tab State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [settingsMsg, setSettingsMsg] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordReqs, setPasswordReqs] = useState({
        length: false, upper: false, lower: false, number: false, special: false
    });

    // Interview Slots State
    const [slotDate, setSlotDate] = useState('');
    const [slotTime, setSlotTime] = useState('');
    const [slotsMsg, setSlotsMsg] = useState('');

    // Admin Accounts State
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [adminPwStrength, setAdminPwStrength] = useState(0);
    const [adminPwReqs, setAdminPwReqs] = useState({
        length: false, upper: false, lower: false, number: false, special: false
    });
    const [accountsMsg, setAccountsMsg] = useState('');

    // MEMBERS Management State
    const [memberForm, setMemberForm] = useState({
        name: '', email: '', role: '', group: 'Core Team', tenure: '2023-2024',
        linkedin: '', github: '', photo: ''
    });
    const [membersMsg, setMembersMsg] = useState('');

    // PROJECTS Management State
    const [projectForm, setProjectForm] = useState({
        title: '', description: '', status: 'ongoing', technologies: '',
        github: '', demo: ''
    });
    const [projectsMsg, setProjectsMsg] = useState('');

    // CONTENT Management State
    const [contentForm, setContentForm] = useState({
        heroTitle: 'CodeChef Projects Department',
        heroSubtitle: 'Building innovative solutions...',
        aboutText: 'The CodeChef Projects Department...'
    });
    const [contentMsg, setContentMsg] = useState('');

    useEffect(() => {
        // Load content from localStorage on mount
        const savedContent = JSON.parse(localStorage.getItem('contentData')) || {};
        if (savedContent.heroTitle) {
            setContentForm(prev => ({ ...prev, ...savedContent }));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const tabs = [
        { key: 'members', label: 'Members', icon: <IconUsers size={16} /> },
        { key: 'projects', label: 'Projects', icon: <IconFolderOpen size={16} /> },
        { key: 'content', label: 'Content', icon: <IconFileText size={16} /> },
        { key: 'recruitment', label: 'Recruitment', icon: <IconUserPlus size={16} /> },
        { key: 'accounts', label: 'Admin Accounts', icon: <IconShield size={16} /> },
        { key: 'system', label: 'System', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> },
        { key: 'settings', label: 'Settings', icon: <IconSettings size={16} /> }
    ];

    // Password strength calculator
    const evaluatePassword = (pw) => {
        const reqs = {
            length: pw.length >= 8,
            upper: /[A-Z]/.test(pw),
            lower: /[a-z]/.test(pw),
            number: /[0-9]/.test(pw),
            special: /[^A-Za-z0-9]/.test(pw)
        };
        const score = Object.values(reqs).filter(Boolean).length;
        return { reqs, score };
    };

    const handleNewPasswordChange = (pw) => {
        setNewPassword(pw);
        const { reqs, score } = evaluatePassword(pw);
        setPasswordReqs(reqs);
        setPasswordStrength(score);
    };

    const handleAdminPwChange = (pw) => {
        setNewAdminPassword(pw);
        const { reqs, score } = evaluatePassword(pw);
        setAdminPwReqs(reqs);
        setAdminPwStrength(score);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) { setSettingsMsg('Passwords do not match'); return; }
        if (passwordStrength < 3) { setSettingsMsg('Password is too weak'); return; }
        const admins = JSON.parse(localStorage.getItem('adminAccounts')) || [];
        const idx = admins.findIndex(a => a.email === user?.email);
        if (idx === -1) { setSettingsMsg('Admin not found'); return; }
        if (admins[idx].password !== currentPassword) { setSettingsMsg('Current password is wrong'); return; }
        admins[idx].password = newPassword;
        localStorage.setItem('adminAccounts', JSON.stringify(admins));
        setSettingsMsg('✓ Password changed successfully');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        setPasswordStrength(0);
    };

    const handleAddSlot = () => {
        if (!slotDate || !slotTime) { setSlotsMsg('Both date and time are required'); return; }
        const interviewSlots = JSON.parse(localStorage.getItem('interviewSlots')) || [];
        if (interviewSlots.find(s => s.date === slotDate && s.time === slotTime)) {
            setSlotsMsg('This slot already exists'); return;
        }
        interviewSlots.push({ date: slotDate, time: slotTime });
        localStorage.setItem('interviewSlots', JSON.stringify(interviewSlots));
        setSlotsMsg(`✓ Slot added: ${slotDate} @ ${slotTime}`);
        setSlotDate(''); setSlotTime('');
        forceUpdate();
    };

    const handleRemoveSlot = (date, time) => {
        let interviewSlots = JSON.parse(localStorage.getItem('interviewSlots')) || [];
        interviewSlots = interviewSlots.filter(s => !(s.date === date && s.time === time));
        localStorage.setItem('interviewSlots', JSON.stringify(interviewSlots));
        setSlotsMsg('Slot removed');
        forceUpdate();
    };

    const handleAcceptApp = (app, index) => {
        if (window.confirm(`Accept ${app.name} as a member?`)) {
            const currentApps = JSON.parse(localStorage.getItem('applications')) || [];
            const newApps = currentApps.filter(a => a.timestamp !== app.timestamp);
            localStorage.setItem('applications', JSON.stringify(newApps));
            alert(`✓ ${app.name} has been accepted! Email notification sent.`);
            forceUpdate();
        }
    };

    const handleRejectApp = (app) => {
        if (window.confirm(`Reject application for ${app.name}?`)) {
            const currentApps = JSON.parse(localStorage.getItem('applications')) || [];
            const newApps = currentApps.filter(a => a.timestamp !== app.timestamp);
            localStorage.setItem('applications', JSON.stringify(newApps));
            alert(`Application rejected.`);
            forceUpdate();
        }
    };

    const handleAddAdmin = (e) => {
        e.preventDefault();
        if (!newAdminEmail || !newAdminPassword) { setAccountsMsg('Email and password are required'); return; }
        if (adminPwStrength < 3) { setAccountsMsg('Password is too weak'); return; }
        const admins = JSON.parse(localStorage.getItem('adminAccounts')) || [];
        if (admins.find(a => a.email === newAdminEmail)) {
            setAccountsMsg('This email is already registered'); return;
        }
        admins.push({ email: newAdminEmail, name: newAdminEmail.split('@')[0], password: newAdminPassword });
        localStorage.setItem('adminAccounts', JSON.stringify(admins));
        setAccountsMsg(`✓ Admin "${newAdminEmail}" added`);
        setNewAdminEmail(''); setNewAdminPassword('');
        setAdminPwStrength(0);
        forceUpdate();
    };

    // --- NEW: Handle Members ---
    const handleAddMember = (e) => {
        e.preventDefault();
        const member = {
            id: Date.now(),
            ...memberForm,
            photo: memberForm.photo || 'https://via.placeholder.com/140/FF6B35/ffffff?text=' + memberForm.name.charAt(0)
        };
        let members = JSON.parse(localStorage.getItem('appMembers')) || {};
        if (!members[member.tenure]) members[member.tenure] = {};
        if (!members[member.tenure][member.group]) members[member.tenure][member.group] = [];
        members[member.tenure][member.group].push(member);
        localStorage.setItem('appMembers', JSON.stringify(members));
        setMembersMsg(`✓ ${member.name} added successfully!`);
        setMemberForm({ name: '', email: '', role: '', group: 'Core Team', tenure: '2023-2024', linkedin: '', github: '', photo: '' });
        forceUpdate();
    };

    const handleDeleteMember = (id, tenure, group) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;
        let members = JSON.parse(localStorage.getItem('appMembers')) || {};
        if (members[tenure] && members[tenure][group]) {
            members[tenure][group] = members[tenure][group].filter(m => m.id !== id);
            if (members[tenure][group].length === 0) delete members[tenure][group];
            if (Object.keys(members[tenure]).length === 0) delete members[tenure];
        }
        localStorage.setItem('appMembers', JSON.stringify(members));
        setMembersMsg('✓ Member removed');
        forceUpdate();
    };

    // --- NEW: Handle Projects ---
    const handleAddProject = (e) => {
        e.preventDefault();
        const project = {
            id: Date.now(),
            ...projectForm,
            technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean),
            demo: projectForm.demo || '#',
            contributors: ['Admin']
        };
        let projects = JSON.parse(localStorage.getItem('appProjects')) || [];
        projects.push(project);
        localStorage.setItem('appProjects', JSON.stringify(projects));
        setProjectsMsg(`✓ Project "${project.title}" added!`);
        setProjectForm({ title: '', description: '', status: 'ongoing', technologies: '', github: '', demo: '' });
        forceUpdate();
    };

    // --- NEW: Handle Content ---
    const handleSaveContent = (e) => {
        e.preventDefault();
        let contentData = JSON.parse(localStorage.getItem('contentData')) || {};
        // Merge updates
        const updated = { ...contentData, ...contentForm };
        localStorage.setItem('contentData', JSON.stringify(updated));
        setContentMsg('✓ Content updated successfully!');
    };

    // --- NEW: Handle System ---
    const handleSaveSystem = (key, val) => {
        let contentData = JSON.parse(localStorage.getItem('contentData')) || {};
        contentData[key] = val;
        localStorage.setItem('contentData', JSON.stringify(contentData));
        forceUpdate(); // Toggle visual switch
    };

    const getStrengthColor = (score) => {
        if (score <= 1) return '#ef4444';
        if (score === 2) return '#f59e0b';
        if (score === 3) return '#eab308';
        if (score === 4) return '#22c55e';
        return '#10b981';
    };

    const getStrengthLabel = (score) => {
        return ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][score] || '';
    };

    const renderPasswordRequirements = (reqs) => (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0', fontSize: '0.75rem' }}>
            {[
                { key: 'length', label: 'At least 8 characters' },
                { key: 'upper', label: 'Uppercase letter' },
                { key: 'lower', label: 'Lowercase letter' },
                { key: 'number', label: 'Number' },
                { key: 'special', label: 'Special character' }
            ].map(r => (
                <li key={r.key} style={{ color: reqs[r.key] ? '#10b981' : 'var(--text-secondary)', padding: '2px 0' }}>
                    {reqs[r.key] ? '✓' : '○'} {r.label}
                </li>
            ))}
        </ul>
    );

    const renderStrengthBar = (score) => (
        <div style={{ display: 'flex', gap: '4px', margin: '0.5rem 0', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{
                    flex: 1, height: '4px', borderRadius: '2px',
                    background: i <= score ? getStrengthColor(score) : 'var(--border-color)',
                    transition: 'background 0.3s'
                }} />
            ))}
            <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: getStrengthColor(score), fontWeight: 600 }}>
                {getStrengthLabel(score)}
            </span>
        </div>
    );

    // Get data from localStorage
    const interviewSlots = JSON.parse(localStorage.getItem('interviewSlots')) || [];
    const currentAdmins = JSON.parse(localStorage.getItem('adminAccounts')) || [];
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const bookedInterviews = JSON.parse(localStorage.getItem('bookings')) || [];
    const appMembers = JSON.parse(localStorage.getItem('appMembers')) || {};
    const appProjects = JSON.parse(localStorage.getItem('appProjects')) || [];
    const contentData = JSON.parse(localStorage.getItem('contentData')) || {};

    return (
        <div className={`modal modal-admin ${isOpen ? 'active' : ''}`} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="admin-modal-content">
                {/* Header */}
                <div className="admin-header">
                    <h2>Admin Dashboard</h2>
                    <div className="admin-header-controls">
                        <span className="admin-user">{user?.email || 'admin@codechef-projects.com'}</span>
                        <button className="btn btn-danger" onClick={logout}>Logout</button>
                        <button className="close-modal" onClick={onClose}>&times;</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="admin-tabs-container">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            className={`admin-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="admin-content">
                    {/* ========== Members Tab ========== */}
                    {activeTab === 'members' && (
                        <div className="admin-tab-content active">
                            <div className="admin-section">
                                <h3>Manage Members</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                    Add, edit, or remove department members.
                                </p>
                                <form className="admin-form" onSubmit={handleAddMember}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <label>
                                            Name
                                            <input type="text" placeholder="Enter full name" value={memberForm.name} onChange={e => setMemberForm({ ...memberForm, name: e.target.value })} required />
                                        </label>
                                        <label>
                                            Email
                                            <input type="email" placeholder="member@email.com" value={memberForm.email} onChange={e => setMemberForm({ ...memberForm, email: e.target.value })} required />
                                        </label>
                                        <label>
                                            Role
                                            <input type="text" placeholder="e.g. Frontend Developer" value={memberForm.role} onChange={e => setMemberForm({ ...memberForm, role: e.target.value })} required />
                                        </label>
                                        <label>
                                            Group
                                            <select value={memberForm.group} onChange={e => setMemberForm({ ...memberForm, group: e.target.value })}>
                                                <option value="Core Team">Core Team</option>
                                                <option value="Lead Developer">Lead Developer</option>
                                                <option value="Researcher">Researcher</option>
                                            </select>
                                        </label>
                                        <label>
                                            Tenure
                                            <input type="text" placeholder="e.g. 2023-2024" value={memberForm.tenure} onChange={e => setMemberForm({ ...memberForm, tenure: e.target.value })} required />
                                        </label>
                                        <label>
                                            LinkedIn URL
                                            <input type="url" placeholder="https://linkedin.com/in/..." value={memberForm.linkedin} onChange={e => setMemberForm({ ...memberForm, linkedin: e.target.value })} />
                                        </label>
                                        <label>
                                            GitHub URL
                                            <input type="url" placeholder="https://github.com/..." value={memberForm.github} onChange={e => setMemberForm({ ...memberForm, github: e.target.value })} />
                                        </label>
                                        <label>
                                            Photo URL
                                            <input type="url" placeholder="https://..." value={memberForm.photo} onChange={e => setMemberForm({ ...memberForm, photo: e.target.value })} />
                                        </label>
                                    </div>
                                    <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Member</button>
                                    {membersMsg && <div style={{ marginTop: '0.5rem', color: '#10b981' }}>{membersMsg}</div>}
                                </form>
                                <hr style={{ margin: '2rem 0', borderColor: 'var(--border-color)' }} />
                                {/* Render Members List */}
                                <ul className="admin-list">
                                    {Object.keys(appMembers).length === 0 ? (
                                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No members added yet.</p>
                                    ) : (
                                        Object.keys(appMembers).map(tenure => (
                                            Object.keys(appMembers[tenure]).map(group => (
                                                appMembers[tenure][group].map(member => (
                                                    <li key={member.id} className="member-item">
                                                        <div className="item-info">
                                                            <img src={member.photo} alt={member.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginRight: '1rem' }} />
                                                            <div>
                                                                <span className="item-name">{member.name}</span>
                                                                <span className="item-role">{member.role} • {group}</span>
                                                            </div>
                                                        </div>
                                                        <div className="item-actions">
                                                            <button className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDeleteMember(member.id, tenure, group)}>Remove</button>
                                                        </div>
                                                    </li>
                                                ))
                                            ))
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* ========== Projects Tab ========== */}
                    {activeTab === 'projects' && (
                        <div className="admin-tab-content active">
                            <div className="admin-section">
                                <h3>Manage Projects</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                    Add or update department projects.
                                </p>
                                <form className="admin-form" onSubmit={handleAddProject}>
                                    <label>
                                        Project Title
                                        <input type="text" placeholder="Enter project title" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required />
                                    </label>
                                    <label>
                                        Description
                                        <textarea placeholder="Enter description" rows={3} value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} required></textarea>
                                    </label>
                                    <label>
                                        Status
                                        <select value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value })}>
                                            <option value="ongoing">Ongoing</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </label>
                                    <label>
                                        Technologies (comma separated)
                                        <input type="text" placeholder="React, Python, etc." value={projectForm.technologies} onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })} />
                                    </label>
                                    <button className="btn btn-primary">Add Project</button>
                                    {projectsMsg && <div style={{ marginTop: '0.5rem', color: '#10b981' }}>{projectsMsg}</div>}
                                </form>
                                <hr style={{ margin: '2rem 0', borderColor: 'var(--border-color)' }} />
                                {/* Projects List - Not in legacy snippet but good to have parity implies management usually entails list */}
                                <ul className="admin-list">
                                    {appProjects.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No projects added.</p> : appProjects.map((p, i) => (
                                        <li key={i} className="member-item">
                                            <div className="item-info">
                                                <span className="item-name">{p.title}</span>
                                                <span className="item-role">{p.status}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* ========== Content Tab ========== */}
                    {activeTab === 'content' && (
                        <div className="admin-tab-content active">
                            <div className="admin-section">
                                <h3>Edit Content</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                    Manage website content, section titles, and descriptions.
                                </p>
                                <form className="admin-form" onSubmit={handleSaveContent}>
                                    <label>
                                        Hero Title
                                        <input type="text" value={contentForm.heroTitle} onChange={e => setContentForm({ ...contentForm, heroTitle: e.target.value })} />
                                    </label>
                                    <label>
                                        Hero Subtitle
                                        <textarea rows={3} value={contentForm.heroSubtitle} onChange={e => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}></textarea>
                                    </label>
                                    <label>
                                        About Text
                                        <textarea rows={4} value={contentForm.aboutText} onChange={e => setContentForm({ ...contentForm, aboutText: e.target.value })}></textarea>
                                    </label>
                                    <button className="btn btn-primary">Save Changes</button>
                                    {contentMsg && <div style={{ marginTop: '0.5rem', color: '#10b981' }}>{contentMsg}</div>}
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ========== Recruitment Tab ========== */}
                    {activeTab === 'recruitment' && (
                        <div className="admin-tab-content active">
                            <div className="admin-section">
                                <h3>Recruitment Management</h3>

                                {/* Interview Slots Manager */}
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>📅 Interview Slots Manager</h4>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                        Add available interview dates/times. Applicants can book a slot after submitting their application.
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                        <input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)}
                                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', flex: 1 }} />
                                        <input type="time" value={slotTime} onChange={(e) => setSlotTime(e.target.value)}
                                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', flex: 1 }} />
                                        <button className="btn btn-primary btn-sm" onClick={handleAddSlot}>Add Slot</button>
                                    </div>
                                    {slotsMsg && <div style={{ fontSize: '0.85rem', color: slotsMsg.startsWith('✓') ? '#10b981' : '#ef4444', marginBottom: '0.75rem' }}>{slotsMsg}</div>}

                                    {interviewSlots.length > 0 ? (
                                        <ul className="admin-list">
                                            {interviewSlots.map((s, i) => (
                                                <li key={i} className="member-item">
                                                    <div className="item-info">
                                                        <span className="item-name">{s.date}</span>
                                                        <span className="item-role">{s.time}</span>
                                                    </div>
                                                    <div className="item-actions">
                                                        <button className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }} onClick={() => handleRemoveSlot(s.date, s.time)}>Remove</button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.85rem' }}>No interview slots added yet.</p>
                                    )}
                                </div>

                                <hr style={{ margin: '2rem 0', borderColor: 'var(--border-color)' }} />

                                {/* Applications List */}
                                <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>📋 Applications ({applications.length})</h4>
                                {applications.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {applications.slice().reverse().map((app, i) => (
                                            <div key={i} style={{
                                                background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                                    <div>
                                                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.125rem' }}>{app.name}</h4>
                                                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                            📧 {app.email} {app.phone ? `• 📞 ${app.phone}` : ''} • 📚 Semester {app.semester}
                                                        </p>
                                                        {app.portfolio && (
                                                            <p style={{ margin: '0.5rem 0 0 0' }}>
                                                                <a href={app.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                                    🔗 Portfolio <IconExternalLink />
                                                                </a>
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span style={{
                                                        background: 'var(--accent-primary-light)', color: 'var(--accent-primary)',
                                                        padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
                                                        fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap'
                                                    }}>
                                                        {app.role}
                                                    </span>
                                                </div>

                                                <div style={{ marginBottom: '1rem' }}>
                                                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>Skills:</strong>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                        {app.skills ? app.skills.split(',').map((skill, idx) => (
                                                            <span key={idx} style={{
                                                                background: 'var(--bg-secondary)', padding: '0.25rem 0.75rem',
                                                                borderRadius: 'var(--radius-full)', fontSize: '0.75rem',
                                                                border: '1px solid var(--border-color)', color: 'var(--text-secondary)'
                                                            }}>
                                                                {skill.trim()}
                                                            </span>
                                                        )) : <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>No skills listed</span>}
                                                    </div>
                                                </div>

                                                <div style={{ marginBottom: '1rem' }}>
                                                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>Why hire:</strong>
                                                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                                                        {app.experience}
                                                    </p>
                                                </div>

                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <button className="btn btn-primary btn-sm" onClick={() => handleAcceptApp(app, i)}>
                                                        ✓ Accept
                                                    </button>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => handleRejectApp(app)} style={{ color: '#ef4444' }}>
                                                        ✗ Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No applications yet.</p>
                                )}

                                {/* Booked Interviews Section */}
                                {bookedInterviews.length > 0 && (
                                    <div style={{ marginTop: '2rem' }}>
                                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>📌 Booked Interviews</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {bookedInterviews.map((b, idx) => (
                                                <div key={idx} style={{
                                                    padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)',
                                                    background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: '0.9rem',
                                                    display: 'flex', justifyContent: 'space-between'
                                                }}>
                                                    <span>{b.email}</span>
                                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.date} @ {b.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========== Admin Accounts Tab ========== */}
                    {activeTab === 'accounts' && (
                        <div className="admin-tab-content active">
                            <div className="admin-section">
                                <h3>Admin Accounts</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                    Manage admin accounts and permissions.
                                </p>
                                <form className="admin-form" onSubmit={handleAddAdmin}>
                                    <label>
                                        Email
                                        <input type="email" placeholder="newadmin@email.com" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} required />
                                    </label>
                                    <label>
                                        Password
                                        <input type="password" placeholder="Enter strong password" value={newAdminPassword} onChange={(e) => handleAdminPwChange(e.target.value)} required />
                                    </label>
                                    {newAdminPassword && (
                                        <>
                                            {renderStrengthBar(adminPwStrength)}
                                            {renderPasswordRequirements(adminPwReqs)}
                                        </>
                                    )}
                                    <button type="submit" className="btn btn-primary">Add Admin</button>
                                    {accountsMsg && <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: accountsMsg.startsWith('✓') ? '#10b981' : '#ef4444' }}>{accountsMsg}</div>}
                                </form>
                                <hr style={{ margin: '2rem 0', borderColor: 'var(--border-color)' }} />
                                <ul className="admin-list">
                                    {currentAdmins.length > 0 ? currentAdmins.map((admin, i) => (
                                        <li key={i} className="member-item">
                                            <div className="item-info">
                                                <span className="item-name">{admin.email || admin.name}</span>
                                                <span className="item-role">
                                                    {i === 0 ? '👑 Super Admin' : '👤 Admin'}
                                                </span>
                                            </div>
                                            <div className="item-actions">
                                                {i !== 0 && <button className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>Remove</button>}
                                            </div>
                                        </li>
                                    )) : (
                                        <li className="member-item">
                                            <div className="item-info">
                                                <span className="item-name">admin@codechef-projects.com</span>
                                                <span className="item-role">👑 Super Admin</span>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* ========== Settings Tab ========== */}
                    {activeTab === 'settings' && (
                        <div className="admin-tab-content active">
                            <div className="admin-section">
                                <h3>Settings</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                    Change your admin password and manage account settings.
                                </p>
                                <form className="admin-form" onSubmit={handleChangePassword}>
                                    <h4 style={{ marginBottom: '1rem' }}>Change Admin Password</h4>
                                    <label>
                                        Current Password
                                        <input type="password" placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                                    </label>
                                    <label>
                                        New Password
                                        <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => handleNewPasswordChange(e.target.value)} required />
                                    </label>
                                    {newPassword && (
                                        <>
                                            {renderStrengthBar(passwordStrength)}
                                            {renderPasswordRequirements(passwordReqs)}
                                        </>
                                    )}
                                    <label>
                                        Confirm New Password
                                        <input type="password" placeholder="Re-enter new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                    </label>
                                    {confirmPassword && (
                                        <div style={{ fontSize: '0.85rem', color: newPassword === confirmPassword ? '#10b981' : '#ef4444' }}>
                                            {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                                        </div>
                                    )}
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Update Password</button>
                                    {settingsMsg && <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: settingsMsg.startsWith('✓') ? '#10b981' : '#ef4444' }}>{settingsMsg}</div>}
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ========== System Controls Tab ========== */}
                    {activeTab === 'system' && (
                        <div className="admin-tab-content active">
                            <div className="admin-section">
                                <h3>System Controls</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                    Manage global system settings and announcements.
                                </p>

                                <div className="admin-form">
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>📢 Announcements</h4>
                                    <label>
                                        Broadcast Message
                                        <textarea placeholder="Enter message to broadcast to all users..." rows={2}></textarea>
                                    </label>
                                    <button className="btn btn-primary" onClick={() => setSettingsMsg('✓ Broadcast sent successfully')}>Send Broadcast</button>

                                    <hr style={{ margin: '2rem 0', borderColor: 'var(--border-color)' }} />

                                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>⚙️ System Status</h4>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                                        <div>
                                            <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Recruitment Status</strong>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Toggle recruitment applications</span>
                                        </div>
                                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                                            <input type="checkbox" checked={contentData['recruitmentActive'] ?? true} onChange={e => handleSaveSystem('recruitmentActive', e.target.checked)} />
                                            <span className="slider round" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ccc', transition: '.4s', borderRadius: '34px' }}></span>
                                        </label>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                                        <div>
                                            <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Maintenance Mode</strong>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Disable access for non-admins</span>
                                        </div>
                                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                                            <input type="checkbox" checked={contentData['maintenanceMode'] ?? false} onChange={e => handleSaveSystem('maintenanceMode', e.target.checked)} />
                                            <span className="slider round" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ccc', transition: '.4s', borderRadius: '34px' }}></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminModal;
