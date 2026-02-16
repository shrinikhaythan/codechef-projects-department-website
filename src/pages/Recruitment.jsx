import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ccLogo from '../assets/cc.svg';

const Recruitment = () => {
    const { user, openLogin } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [submitted, setSubmitted] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [bookingMsg, setBookingMsg] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        semester: '',
        role: '',
        skills: '',
        experience: '',
        portfolio: '',
        linkedin: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Store in localStorage
        let applications = JSON.parse(localStorage.getItem('applications')) || [];
        applications.push({
            ...formData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('applications', JSON.stringify(applications));

        setSubmitted(true);

        // Show success toast
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed; top: 100px; right: 20px; padding: 1rem 1.5rem;
            background: #10b981; color: white; border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 10000;
            animation: slideInDown 0.4s ease-out;
        `;
        successMsg.textContent = 'Application submitted successfully! We will contact you soon.';
        document.body.appendChild(successMsg);
        setTimeout(() => {
            successMsg.style.animation = 'slideInUp 0.4s ease-out forwards';
            setTimeout(() => successMsg.remove(), 400);
        }, 1500);

        // If interview slots are available, show booking UI
        const interviewSlots = JSON.parse(localStorage.getItem('interviewSlots')) || [];
        if (interviewSlots.length > 0) {
            setShowBooking(true);
        }
    };

    const handleConfirmBooking = () => {
        if (!selectedSlot) {
            setBookingMsg('Please select a slot.');
            return;
        }
        const [date, time] = selectedSlot.split('|');
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        if (bookings.find(b => b.email === formData.email && b.date === date && b.time === time)) {
            setBookingMsg('You already booked this slot.');
            return;
        }
        bookings.push({ email: formData.email, date, time, bookedAt: new Date().toISOString() });
        localStorage.setItem('bookings', JSON.stringify(bookings));
        setBookingMsg(`Booked: ${date} @ ${time}`);
        setTimeout(() => {
            // Reset for potentially another response or just stay there
            setSubmitted(true);
        }, 1500);
    };

    // Render Booking UI
    const renderBookingUI = () => {
        const interviewSlots = JSON.parse(localStorage.getItem('interviewSlots')) || [];
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

        return (
            <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '2rem' }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Book Interview Slot</h3>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.75rem 0' }}>Select a date and time for your interview from available slots.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto' }}>
                    {interviewSlots.map((s, idx) => {
                        const taken = bookings.find(b => b.date === s.date && b.time === s.time);
                        return (
                            <label key={idx} style={{
                                display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.4rem',
                                borderRadius: '6px', border: '1px solid var(--border-color)',
                                background: 'var(--bg-primary)', color: 'var(--text-primary)', justifyContent: 'space-between',
                                cursor: taken ? 'not-allowed' : 'pointer'
                            }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1 }}>
                                    <input
                                        type="radio"
                                        name="slotSel"
                                        value={`${s.date}|${s.time}`}
                                        disabled={!!taken}
                                        onChange={(e) => setSelectedSlot(e.target.value)}
                                        style={{ width: 'auto' }}
                                    />
                                    <div style={{ flex: 1 }}>{s.date} @ {s.time}</div>
                                </div>
                                <div style={{ minWidth: '120px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                    {taken ? 'Taken' : 'Available'}
                                </div>
                            </label>
                        );
                    })}
                </div>
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" onClick={handleConfirmBooking}>Confirm Booking</button>
                    <button className="btn btn-secondary" onClick={() => setShowBooking(false)}>Cancel</button>
                </div>
                {bookingMsg && <div style={{ marginTop: '0.5rem', color: bookingMsg.startsWith('Booked') ? 'var(--accent-success, #10b981)' : 'var(--text-secondary)' }}>{bookingMsg}</div>}
            </div>
        );
    };

    return (
        <div className="recruitment-page" style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 'var(--spacing-xl)' }}>
            {/* Minimal Navbar */}
            <nav className="navbar" id="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo" title="Back to Home">
                        <img src={ccLogo} alt="CodeChef Logo" className="logo-img" style={{ height: '60px', width: 'auto' }} loading="lazy" />
                        <span className="logo-text">Projects</span>
                    </Link>
                    <div className="nav-controls">
                        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode" aria-label="Theme Toggle">
                            <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ display: theme === 'dark' ? 'block' : 'none' }}>
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                            <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ display: theme === 'light' ? 'block' : 'none' }}>
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        </button>
                        <Link to="/" className="btn btn-secondary">← Back Home</Link>
                    </div>
                </div>
            </nav>

            {/* Main Content - Blurred if not logged in */}
            <div className={`recruitment-wrapper ${!user ? 'blurred-content' : ''}`} style={{
                maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem 3rem',
                filter: !user ? 'blur(8px)' : 'none',
                pointerEvents: !user ? 'none' : 'auto',
                transition: 'filter 0.3s ease'
            }}>
                <Link to="/" className="back-link" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600,
                    marginBottom: '2rem', transition: 'all 0.2s'
                }}>
                    <span>←</span> Back to Homepage
                </Link>

                <div className="recruitment-header" style={{ textAlign: 'center', marginBottom: '2rem', animation: 'fadeInUp 0.8s ease-out' }}>
                    <h1 style={{
                        fontSize: 'var(--font-size-4xl, 2.5rem)', background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text', marginBottom: '0.5rem'
                    }}>Join Our Team</h1>
                    <p style={{ fontSize: 'var(--font-size-lg, 1.125rem)', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        Be part of a passionate community building innovative solutions,
                        conducting research, and pushing the boundaries of technology
                    </p>
                </div>

                <div className="recruitment-container" style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start'
                }}>
                    {/* Left Panel */}
                    <div className="recruitment-info" style={{ animation: 'slideInLeft 0.8s ease-out' }}>
                        <h2 style={{ fontSize: 'var(--font-size-2xl, 1.5rem)', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Why Join Us?</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                            CodeChef Projects Department is a hub for innovation and collaboration.
                            We work on cutting-edge projects, explore emerging technologies, and create
                            impactful solutions that matter.
                        </p>

                        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>We're Looking For:</h3>
                        <ul className="requirements-list" style={{ listStyle: 'none', marginBottom: '1.5rem', padding: 0 }}>
                            {[
                                'Strong problem-solving and coding skills',
                                'Passion for learning new technologies',
                                'Collaborative team player mindset',
                                'Commitment to code quality and best practices',
                                'Initiative to take on challenging projects',
                                'Good communication and documentation skills'
                            ].map((item, i) => (
                                <li key={i} style={{ padding: '0.75rem 0', paddingLeft: '1.5rem', position: 'relative', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                                    <span style={{ position: 'absolute', left: 0, color: 'var(--accent-success, #10b981)', fontWeight: 700, fontSize: '1.125rem' }}>✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Available Roles:</h3>
                        <ul className="requirements-list" style={{ listStyle: 'none', padding: 0 }}>
                            {['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Game Developer', 'Researcher', 'UI/UX Designer'].map((role, i) => (
                                <li key={i} style={{ padding: '0.75rem 0', paddingLeft: '1.5rem', position: 'relative', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                                    <span style={{ position: 'absolute', left: 0, color: 'var(--accent-success, #10b981)', fontWeight: 700, fontSize: '1.125rem' }}>✓</span>
                                    {role}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Panel: Form or Success/Booking */}
                    <div className="recruitment-form-container">
                        {submitted ? (
                            <div style={{
                                background: 'var(--bg-secondary)', padding: '3rem', borderRadius: 'var(--radius-xl, 16px)',
                                border: '1px solid var(--border-color)', textAlign: 'center', animation: 'fadeIn 0.5s'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                                <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Application Submitted!</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Thank you for applying. We will review your application and get back to you soon.</p>

                                {showBooking && renderBookingUI()}

                                {!showBooking && (
                                    <button onClick={() => { setSubmitted(false); }} className="btn btn-secondary">
                                        Submit Another Response
                                    </button>
                                )}
                            </div>
                        ) : (
                            <form className="recruitment-form" onSubmit={handleSubmit} style={{
                                background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-xl, 16px)',
                                border: '1px solid var(--border-color)', animation: 'slideInRight 0.8s ease-out',
                                boxShadow: 'var(--shadow-lg, 0 10px 40px rgba(0,0,0,0.1))'
                            }}>
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>Full Name *</label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: '0.75rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-family)', fontSize: '0.875rem' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>Email *</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: '0.75rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-family)', fontSize: '0.875rem' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>Phone Number</label>
                                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210"
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: '0.75rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-family)', fontSize: '0.875rem' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label htmlFor="semester" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>Semester *</label>
                                    <select id="semester" name="semester" value={formData.semester} onChange={handleChange} required
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: '0.75rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-family)', fontSize: '0.875rem' }}>
                                        <option value="">-- Select Semester --</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                                            <option key={s} value={s}>{s === 1 ? '1st' : s === 2 ? '2nd' : s === 3 ? '3rd' : `${s}th`} Semester</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label htmlFor="role" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>Preferred Role *</label>
                                    <select id="role" name="role" value={formData.role} onChange={handleChange} required
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: '0.75rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-family)', fontSize: '0.875rem' }}>
                                        <option value="">-- Select Role --</option>
                                        <option value="frontend">Frontend Developer</option>
                                        <option value="backend">Backend Developer</option>
                                        <option value="fullstack">Full Stack Developer</option>
                                        <option value="gamedev">Game Developer</option>
                                        <option value="research">Researcher</option>
                                        <option value="designer">UI/UX Designer</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label htmlFor="skills" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>Key Skills (comma separated) *</label>
                                    <input type="text" id="skills" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python..." required
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: '0.75rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-family)', fontSize: '0.875rem' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label htmlFor="experience" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>Why should we select you? *</label>
                                    <textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="Tell us about your experience, projects, and why you want to join..." required rows={4}
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: '0.75rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-family)', fontSize: '0.875rem', resize: 'vertical', minHeight: '120px' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label htmlFor="portfolio" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>Portfolio / GitHub URL *</label>
                                    <input type="url" id="portfolio" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://github.com/yourprofile" required
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: '0.75rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-family)', fontSize: '0.875rem' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label htmlFor="linkedin" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>LinkedIn URL *</label>
                                    <input type="url" id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://www.linkedin.com/in/yourprofile" required
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: '0.75rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-family)', fontSize: '0.875rem' }} />
                                </div>
                                <div className="form-group">
                                    <input type="submit" value="Submit Application" style={{
                                        width: '100%', padding: '1rem', background: 'var(--gradient-primary)',
                                        color: 'white', fontWeight: 600, cursor: 'pointer', border: 'none',
                                        borderRadius: '0.75rem', fontSize: '1rem',
                                        boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
                                    }} />
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <div className="note-box" style={{
                    background: 'var(--accent-primary-light, rgba(255, 107, 53, 0.1))',
                    borderLeft: '4px solid var(--accent-primary)',
                    padding: '1.5rem', borderRadius: 'var(--radius-lg, 12px)',
                    color: 'var(--text-secondary)', marginTop: '2rem'
                }}>
                    <strong>📌 Important:</strong> All applications will be reviewed carefully.
                    Selected candidates will be notified within 5-7 business days for the interview round.
                </div>
            </div>

            {/* Login Required Overlay - Fixed Position on top of blurred content */}
            {!user && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 9999
                }}>
                    <div style={{
                        background: 'var(--bg-primary)', color: 'var(--text-primary)',
                        padding: '40px', borderRadius: '12px', textAlign: 'center',
                        maxWidth: '450px', width: '90%', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                        position: 'relative'
                    }}>
                        <h2 style={{ marginTop: 0, color: 'var(--accent-primary)', fontSize: '1.5rem' }}>🔐 Login Required</h2>
                        <p style={{ color: 'var(--text-secondary)', margin: '15px 0', fontSize: '1rem' }}>
                            You need to be logged in to view the recruitment form.
                        </p>
                        <button
                            onClick={openLogin}
                            style={{
                                display: 'inline-block', background: 'var(--accent-primary)', color: 'white',
                                padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                marginTop: '15px', fontWeight: 600, fontSize: '1rem'
                            }}
                        >
                            Go to Home & Login
                        </button>
                    </div>
                </div>
            )}

            {/* Responsive Styles */}
            <style>{`
                @media (max-width: 768px) {
                    .recruitment-container { grid-template-columns: 1fr !important; }
                    .recruitment-header h1 { font-size: var(--font-size-2xl, 1.5rem) !important; }
                }
            `}</style>
        </div>
    );
};

export default Recruitment;
