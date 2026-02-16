// ============================================
// PASSWORD VALIDATION & STRENGTH CHECKER
// ============================================

class PasswordValidator {
    // Password strength requirements
    static REQUIREMENTS = {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
    };

    // Special characters allowed
    static SPECIAL_CHARS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    /**
     * Validate password and return strength details
     */
    static validatePassword(password) {
        const result = {
            isValid: true,
            strength: 'weak',
            score: 0,
            feedback: [],
            requirementsMet: {
                minLength: false,
                hasUppercase: false,
                hasLowercase: false,
                hasNumbers: false,
                hasSpecialChars: false
            }
        };

        if (password.length >= this.REQUIREMENTS.minLength) {
            result.requirementsMet.minLength = true;
            result.score += 20;
        } else {
            result.isValid = false;
            result.feedback.push(
                `✗ Password must be at least ${this.REQUIREMENTS.minLength} characters long`
            );
        }

        if (/[A-Z]/.test(password)) {
            result.requirementsMet.hasUppercase = true;
            result.score += 20;
        } else {
            result.isValid = false;
            result.feedback.push('✗ Add at least one uppercase letter (A-Z)');
        }

        if (/[a-z]/.test(password)) {
            result.requirementsMet.hasLowercase = true;
            result.score += 20;
        } else {
            result.isValid = false;
            result.feedback.push('✗ Add at least one lowercase letter (a-z)');
        }

        if (/[0-9]/.test(password)) {
            result.requirementsMet.hasNumbers = true;
            result.score += 20;
        } else {
            result.isValid = false;
            result.feedback.push('✗ Add at least one number (0-9)');
        }

        if (this.SPECIAL_CHARS.test(password)) {
            result.requirementsMet.hasSpecialChars = true;
            result.score += 20;
        } else {
            result.isValid = false;
            result.feedback.push(
                '✗ Add at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)'
            );
        }

        if (result.score >= 100) {
            result.strength = 'strong';
        } else if (result.score >= 80) {
            result.strength = 'good';
        } else if (result.score >= 60) {
            result.strength = 'fair';
        } else {
            result.strength = 'weak';
        }

        if (password.length >= 12) {
            result.score = Math.min(result.score + 10, 100);
            if (result.strength === 'fair') result.strength = 'good';
            if (result.strength === 'good' && result.score >= 95) result.strength = 'strong';
        }

        if (password.length >= 16) {
            result.score = 100;
            result.strength = 'strong';
        }

        return result;
    }

    static isStrongPassword(password) {
        const validation = this.validatePassword(password);
        return validation.isValid && validation.strength === 'strong';
    }

    static getStrengthClass(strength) {
        return `password-strength-${strength}`;
    }

    static getStrengthColor(strength) {
        const colors = {
            weak: '#ef4444',
            fair: '#f59e0b',
            good: '#eab308',
            strong: '#10b981'
        };
        return colors[strength] || '#9ca3af';
    }

    static getStrengthText(strength) {
        const texts = {
            weak: '🔴 Weak',
            fair: '🟠 Fair',
            good: '🟡 Good',
            strong: '🟢 Strong'
        };
        return texts[strength] || 'Unknown';
    }

    static getStrengthPercentage(strength) {
        const percentages = {
            weak: 25,
            fair: 50,
            good: 75,
            strong: 100
        };
        return percentages[strength] || 0;
    }

    static passwordsMatch(password, confirmPassword) {
        return password === confirmPassword && password.length > 0;
    }

    static generateStrongPassword() {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '!@#$%^&*()_+-=[]{};\':"|,.<>/?';

        const getRandomChar = (str) => str[Math.floor(Math.random() * str.length)];

        let password = '';
        password += getRandomChar(uppercase);
        password += getRandomChar(lowercase);
        password += getRandomChar(numbers);
        password += getRandomChar(special);

        const allChars = uppercase + lowercase + numbers + special;
        for (let i = 0; i < 8; i++) {
            password += getRandomChar(allChars);
        }

        return password
            .split('')
            .sort(() => Math.random() - 0.5)
            .join('');
    }
}

export default PasswordValidator;
