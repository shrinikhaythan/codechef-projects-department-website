import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Hero = () => {
    // Typing animation state
    const [displayedLines, setDisplayedLines] = useState([
        [{ char: 'c', color: '#ec2395' }, { char: 'o', color: '#ec2395' }, { char: 'n', color: '#ec2395' }, { char: 's', color: '#ec2395' }, { char: 't', color: '#ec2395' }, { char: ' ', color: '#ffffff' }, { char: 'P', color: '#45d9fa' }, { char: 'r', color: '#45d9fa' }, { char: 'o', color: '#45d9fa' }, { char: 'j', color: '#45d9fa' }, { char: 'e', color: '#45d9fa' }, { char: 'c', color: '#45d9fa' }, { char: 't', color: '#45d9fa' }, { char: 's', color: '#45d9fa' }, { char: ' ', color: '#ffffff' }, { char: '=', color: '#ec2395' }, { char: ' ', color: '#ffffff' }, { char: '{', color: '#ec2395' }],
    ]);
    const [typingActive, setTypingActive] = useState(true);
    const codeRef = useRef(null);

    const [content, setContent] = useState({
        heroTitle: 'Projects Department',
        heroSubtitle: 'Building real-world applications, research-driven solutions, and collaborative software systems'
    });

    // Load content from localStorage (Admin edits)
    useEffect(() => {
        const storedContent = JSON.parse(localStorage.getItem('contentData')) || {};
        if (storedContent.heroTitle || storedContent.heroSubtitle) {
            setContent(prev => ({
                ...prev,
                heroTitle: storedContent.heroTitle || prev.heroTitle,
                heroSubtitle: storedContent.heroSubtitle || prev.heroSubtitle
            }));
        }
    }, []);

    const codeLines = [
        "  innovation: 'limitless',",
        "  collaboration: 'essential',",
        "  impact: 'global'",
        "};"
    ];

    const tokenizeLine = useCallback((line) => {
        const tokens = [];
        let current = '';
        let inString = false;
        let stringChar = '';

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if ((char === '"' || char === "'") && !inString) {
                if (current) tokens.push({ text: current, color: getColor(current) });
                current = char;
                inString = true;
                stringChar = char;
            } else if (char === stringChar && inString) {
                current += char;
                tokens.push({ text: current, color: '#ffa500' });
                current = '';
                inString = false;
            } else if (inString) {
                current += char;
            } else if (/[\s:{}[\]=,;]/.test(char)) {
                if (current) tokens.push({ text: current, color: getColor(current) });
                tokens.push({ text: char, color: '#8c00ff' });
                current = '';
            } else {
                current += char;
            }
        }
        if (current) tokens.push({ text: current, color: getColor(current) });
        return tokens;
    }, []);

    useEffect(() => {
        let mounted = true;

        const typeLoop = async () => {
            await new Promise(r => setTimeout(r, 1000)); // Initial delay

            // We start with the first line already 'typed'
            const baseLines = [
                [{ char: 'c', color: '#ec2395' }, { char: 'o', color: '#ec2395' }, { char: 'n', color: '#ec2395' }, { char: 's', color: '#ec2395' }, { char: 't', color: '#ec2395' }, { char: ' ', color: '#ffffff' }, { char: 'P', color: '#45d9fa' }, { char: 'r', color: '#45d9fa' }, { char: 'o', color: '#45d9fa' }, { char: 'j', color: '#45d9fa' }, { char: 'e', color: '#45d9fa' }, { char: 'c', color: '#45d9fa' }, { char: 't', color: '#45d9fa' }, { char: 's', color: '#45d9fa' }, { char: ' ', color: '#ffffff' }, { char: '=', color: '#ec2395' }, { char: ' ', color: '#ffffff' }, { char: '{', color: '#ec2395' }]
            ];

            while (mounted) {
                // Reset to just the first line
                setDisplayedLines([...baseLines]);
                await new Promise(r => setTimeout(r, 500));

                let currentLines = [...baseLines];

                for (let i = 0; i < codeLines.length; i++) {
                    const line = codeLines[i];
                    const tokens = tokenizeLine(line);
                    let lineChars = [];

                    // Add empty line for current typing
                    currentLines.push([]);
                    setDisplayedLines([...currentLines]);

                    for (const token of tokens) {
                        for (const char of token.text) {
                            if (!mounted) return;
                            lineChars.push({ char, color: token.color });

                            // Update the last line with new char
                            const updatedLines = [...currentLines];
                            updatedLines[updatedLines.length - 1] = [...lineChars];
                            setDisplayedLines(updatedLines);

                            // Random typing speed
                            await new Promise(r => setTimeout(r, 30 + Math.random() * 50));
                        }
                    }

                    // Line finished
                    currentLines = [...currentLines];
                    currentLines[currentLines.length - 1] = lineChars; // Ensure final state
                    await new Promise(r => setTimeout(r, 400)); // Pause at end of line
                }

                // Wait before restarting
                await new Promise(r => setTimeout(r, 3000));
            }
        };

        typeLoop();
        return () => { mounted = false; };
    }, [tokenizeLine]);

    const { user, openLogin } = useAuth();
    const navigate = useNavigate();
    const [showLoginHint, setShowLoginHint] = useState(false);

    // Parallax Animation for Gradient Blobs
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const blobs = document.querySelectorAll('.gradient-blob');
            blobs.forEach((blob, index) => {
                const yPos = scrolled * (0.5 + index * 0.2);
                blob.style.transform = `translateY(${yPos}px)`;
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleJoinClick = (e) => {
        e.preventDefault();
        if (user) {
            navigate('/recruitment');
        } else {
            setShowLoginHint(true);
        }
    };

    return (
        <section className="hero" id="home">
            <div className="hero-background">
                <div className="gradient-blob blob-1"></div>
                <div className="gradient-blob blob-2"></div>
                <div className="gradient-blob blob-3"></div>
            </div>

            <div className="hero-content">
                <div className="hero-text">
                    <h1 className="hero-title">
                        <span className="text-animate word-1">Welcome to</span>
                        <span className="text-animate word-2 highlight">{content.heroTitle}</span>
                    </h1>
                    <p className="hero-subtitle">
                        {content.heroSubtitle}
                    </p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">Members</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">20+</span>
                            <span className="stat-label">Projects</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">10+</span>
                            <span className="stat-label">Research Papers</span>
                        </div>
                    </div>
                    <div className="hero-buttons">
                        <a href="/recruitment" onClick={handleJoinClick} className="btn btn-primary btn-lg">Join Our Team</a>
                        <a href="#projects" className="btn btn-secondary btn-lg">Explore Projects</a>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="code-card animate-float" ref={codeRef}>
                        <pre className="code-output">
                            {displayedLines.map((line, lineIdx) => (
                                <span key={lineIdx}>
                                    {line.map((ch, charIdx) => (
                                        <span key={charIdx} style={{ color: ch.color }}>{ch.char}</span>
                                    ))}
                                    {lineIdx < displayedLines.length - 1 && '\n'}
                                </span>
                            ))}
                            <span className="typing-cursor">▍</span>
                        </pre>
                    </div>
                </div>
            </div>

            <div className="scroll-indicator">
                <span>Scroll to explore</span>
                <div className="mouse-scroll">
                    <div className="scroll-wheel"></div>
                </div>
            </div>

            {/* Login Required Modal for Recruitment */}
            {showLoginHint && (
                <div className="modal-overlay" onClick={() => setShowLoginHint(false)} style={{
                    display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 2000,
                    justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                        background: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '16px',
                        width: '90%', maxWidth: '400px', textAlign: 'center', position: 'relative',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        animation: 'modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <button onClick={() => setShowLoginHint(false)} style={{
                            position: 'absolute', top: '15px', right: '15px', background: 'transparent',
                            border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)'
                        }}>&times;</button>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Login Required</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            You must be logged in to access the recruitment application process.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button className="btn btn-primary btn-block" onClick={() => { setShowLoginHint(false); openLogin(); }}>
                                Login Now
                            </button>
                            <button className="btn btn-secondary btn-block" onClick={() => setShowLoginHint(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

function getColor(token) {
    if (/^const|let|var$/.test(token)) return '#ec2395';
    if (/^[A-Z]/.test(token)) return '#45d9fa';
    if (/^[a-z_]/.test(token)) return '#00ff88';
    if (/^['"]/.test(token)) return '#ffa500';
    return '#ffffff';
}

export default Hero;
