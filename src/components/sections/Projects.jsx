import { useState, useEffect, useRef } from 'react';
import { projects as initialProjects } from '../../data/initialData';

const Projects = () => {
    const [projectsData, setProjectsData] = useState([]);
    const [filter, setFilter] = useState('all');
    const containerRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        // Load projects from localStorage logic matching legacy main.js
        const storedProjects = JSON.parse(localStorage.getItem('appProjects')) || [];
        if (storedProjects.length > 0) {
            setProjectsData(storedProjects);
        } else {
            setProjectsData(initialProjects);
        }
    }, []);

    const filteredProjects = projectsData.filter(
        (p) => filter === 'all' || p.status.toLowerCase() === filter
    );

    // Determine if we should use carousel mode (legacy behavior: > 3 items)
    const useCarousel = filteredProjects.length > 3;

    // Triple the items for infinite scroll illusion if carousel is active
    const displayProjects = useCarousel
        ? [...filteredProjects, ...filteredProjects, ...filteredProjects]
        : filteredProjects;

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !useCarousel) return;

        let animationId;
        const scrollSpeed = 1; // 1px per frame matches legacy

        const performAutoScroll = () => {
            if (!isHovering && container.scrollWidth > container.clientWidth) {
                container.scrollLeft += scrollSpeed;
                const maxScroll = container.scrollWidth - container.clientWidth;
                if (container.scrollLeft >= maxScroll - 1) {
                    container.scrollLeft = 0;
                }
            }
            animationId = requestAnimationFrame(performAutoScroll);
        };

        animationId = requestAnimationFrame(performAutoScroll);
        return () => cancelAnimationFrame(animationId);
    }, [useCarousel, isHovering, filter, projectsData]);

    return (
        <section className="section" id="projects">
            <div className="section-header">
                <h2 className="section-title">Our Projects</h2>
                <p className="section-subtitle">Real-world solutions built by our team</p>
            </div>

            <div className="tabs-container project-filters">
                {['all', 'ongoing', 'completed'].map((status) => (
                    <button
                        key={status}
                        className={`filter-btn ${filter === status ? 'active' : ''}`}
                        onClick={() => setFilter(status)}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            <div
                className={`projects-grid ${useCarousel ? 'carousel-mode' : ''}`}
                id="projectDisplay"
                ref={containerRef}
                style={useCarousel ? { gap: '1.5rem' } : { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {displayProjects.map((project, idx) => (
                    <div
                        className="card project-card"
                        key={`${project.id}-${idx}`}
                        style={{
                            animation: `fadeInUp 0.6s ease-out forwards`,
                            animationDelay: `${idx * 0.05}s`,
                            opacity: 0,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Matches main.js createProjectCard structure visually */}
                        <h3>{project.title}</h3>
                        <div>
                            <span className={`project-status status-${project.status}`} style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                marginBottom: '1rem',
                                background: project.status === 'ongoing' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                color: project.status === 'ongoing' ? '#10b981' : '#6366f1'
                            }}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>
                        </div>
                        <p style={{ flex: 1 }}>{project.description}</p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                            {project.technologies && project.technologies.map((tech, i) => (
                                <span key={i} style={{
                                    display: 'inline-block', padding: '0.25rem 0.75rem',
                                    background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                                    borderRadius: '9999px', fontSize: '0.75rem', border: '1px solid var(--border-color)'
                                }}>{tech}</span>
                            ))}
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            <strong>Contributors:</strong> {Array.isArray(project.contributors) ? project.contributors.join(', ') : project.contributors}
                        </p>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                <span>GitHub</span>
                            </a>
                            {project.demo && (
                                <a
                                    href={project.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 17L17 7M17 7H7M17 7V17"></path></svg>
                                    <span>Demo</span>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;
