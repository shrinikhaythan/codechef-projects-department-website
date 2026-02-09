// An animation and cursor trigger functionality script

// Function to change cursor style
function setCursorStyle(style) {
    document.body.style.cursor = style;
}

// Animation trigger function
function triggerAnimation(element, animationClass) {
    // Add the animation class to the element
    element.classList.add(animationClass);

    // Remove the animation class after animation ends to allow retriggering
    element.addEventListener('animationend', function() {
        element.classList.remove(animationClass);
    }, { once: true });
}

// Example usage:
// setCursorStyle('pointer'); // Changes cursor to pointer on hover
// triggerAnimation(document.getElementById('myElement'), 'fadeIn'); // Triggers fadeIn animation
