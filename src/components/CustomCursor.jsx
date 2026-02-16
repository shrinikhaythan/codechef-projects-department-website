import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ x: 0, y: 0 });
    const dotPos = useRef({ x: 0, y: 0 });
    const animFrame = useRef(null);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!isDesktop) return;

        const speed = 0.2;
        const dotSpeed = 0.2;

        const handleMouseMove = (e) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;
            // Sync dot immediately for precision
            dotPos.current.x = mousePos.current.x;
            dotPos.current.y = mousePos.current.y;
        };

        const handleMouseLeave = () => {
            if (cursorRef.current) cursorRef.current.style.opacity = '0';
            if (dotRef.current) dotRef.current.style.opacity = '0';
        };

        const handleMouseEnter = () => {
            if (cursorRef.current) cursorRef.current.style.opacity = '1';
            if (dotRef.current) dotRef.current.style.opacity = '1';
        };

        const handleMouseDown = () => {
            if (cursorRef.current) cursorRef.current.classList.add('clicking');
            if (dotRef.current) dotRef.current.classList.add('clicking');
        };

        const handleMouseUp = () => {
            if (cursorRef.current) cursorRef.current.classList.remove('clicking');
            if (dotRef.current) dotRef.current.classList.remove('clicking');
        };

        const handleMouseOver = (e) => {
            const interactiveSelectors = 'a, button, input[type="button"], input[type="submit"], .btn, [role="button"], .clickable';
            if (e.target.closest(interactiveSelectors)) {
                if (cursorRef.current) cursorRef.current.classList.add('hover');
                if (dotRef.current) dotRef.current.classList.add('hover');
            }
        };

        const handleMouseOut = (e) => {
            const interactiveSelectors = 'a, button, input[type="button"], input[type="submit"], .btn, [role="button"], .clickable';
            if (e.target.closest(interactiveSelectors)) {
                if (cursorRef.current) cursorRef.current.classList.remove('hover');
                if (dotRef.current) dotRef.current.classList.remove('hover');
            }
        };

        // Click ripple effect
        const handleClick = (e) => {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
        position: fixed;
        pointer-events: none;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 10px;
        height: 10px;
        background: var(--accent-primary);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: ripple 0.6s ease-out forwards;
        z-index: 9998;
      `;
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        };

        const animate = () => {
            cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * speed;
            cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * speed;

            dotPos.current.x += (mousePos.current.x - dotPos.current.x) * dotSpeed;
            dotPos.current.y += (mousePos.current.y - dotPos.current.y) * dotSpeed;

            if (cursorRef.current) {
                cursorRef.current.style.left = cursorPos.current.x + 'px';
                cursorRef.current.style.top = cursorPos.current.y + 'px';
            }

            if (dotRef.current) {
                dotRef.current.style.left = dotPos.current.x + 'px';
                dotRef.current.style.top = dotPos.current.y + 'px';
            }

            animFrame.current = requestAnimationFrame(animate);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('click', handleClick);

        animFrame.current = requestAnimationFrame(animate);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
            document.removeEventListener('click', handleClick);
            if (animFrame.current) cancelAnimationFrame(animFrame.current);
        };
    }, [isDesktop]);

    if (!isDesktop) return null;

    return (
        <>
            <div ref={cursorRef} className="cursor">
                <div className="cursor-arrow"></div>
            </div>
            <div ref={dotRef} className="cursor-dot"></div>
        </>
    );
};

export default CustomCursor;
