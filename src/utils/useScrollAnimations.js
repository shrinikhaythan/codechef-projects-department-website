import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that implements all legacy scroll-triggered animations:
 * - Scroll-based fadeInUp on sections, cards, buttons, stat-items
 * - Parallax on gradient blobs
 * - Navbar shadow/blur on scroll
 * - Section title slide animations
 */
const useScrollAnimations = () => {
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        // ====== SCROLL ANIMATIONS ======
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements after a short delay to ensure DOM is ready
        const observeTimer = setTimeout(() => {
            const elements = document.querySelectorAll(
                '.section, .card, .btn, .stat-item'
            );
            elements.forEach((el) => scrollObserver.observe(el));
        }, 500);

        // ====== SECTION TITLE ANIMATION ======
        const titleObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'slideInUp 0.8s ease-out forwards';
                        titleObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        const titleTimer = setTimeout(() => {
            const titles = document.querySelectorAll('.section-title, .hero-title');
            titles.forEach((el) => titleObserver.observe(el));
        }, 500);

        // ====== PARALLAX ON SCROLL ======
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const blobs = document.querySelectorAll('.gradient-blob');
            blobs.forEach((blob, index) => {
                const yPos = scrolled * (0.5 + index * 0.2);
                blob.style.transform = `translateY(${yPos}px)`;
            });

            // Navbar shadow/blur enhancement
            const navbar = document.getElementById('navbar');
            if (navbar) {
                if (scrolled > 50) {
                    navbar.style.boxShadow = 'var(--shadow-lg)';
                    navbar.style.backdropFilter = 'blur(15px)';
                } else {
                    navbar.style.boxShadow = 'var(--shadow-sm)';
                    navbar.style.backdropFilter = 'blur(10px)';
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // ====== PAGE LOAD ANIMATION ======
        document.body.style.opacity = '1';
        const loadTimer = setTimeout(() => {
            const animElements = document.querySelectorAll('[data-animate]');
            animElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }, index * 100);
            });
        }, 100);

        return () => {
            clearTimeout(observeTimer);
            clearTimeout(titleTimer);
            clearTimeout(loadTimer);
            scrollObserver.disconnect();
            titleObserver.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
};

/**
 * Custom hook for auto-scrolling carousel behavior.
 * Attaches to a container ref. When items exceed threshold,
 * uses requestAnimationFrame to smoothly scroll at 1px/frame.
 * Pauses on hover.
 */
export const useCarouselAutoScroll = (shouldEnable = true) => {
    const containerRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const animId = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !shouldEnable) return;

        const scrollSpeed = 1;

        const performAutoScroll = () => {
            if (!isHovered && container.scrollWidth > container.clientWidth) {
                container.scrollLeft += scrollSpeed;
                // create infinite effect by resetting
                if (container.scrollLeft >= (container.scrollWidth - container.clientWidth) - 1) {
                    container.scrollLeft = 0;
                }
            }
            animId.current = requestAnimationFrame(performAutoScroll);
        };

        if (!isHovered) {
            animId.current = requestAnimationFrame(performAutoScroll);
        }

        return () => {
            if (animId.current) cancelAnimationFrame(animId.current);
        };
    }, [shouldEnable, isHovered]);

    return [containerRef, isHovered, setIsHovered];
};

export default useScrollAnimations;
