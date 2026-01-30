// Toggle between login and signup forms
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const goToSignup = document.getElementById('go-to-signup');
    const goToLogin = document.getElementById('go-to-login');
    
    // Show signup form
    goToSignup.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    });
    
    // Show login form
    goToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
    
    // Toggle password visibility
    const toggleLoginPassword = document.getElementById('toggle-login-password');
    const toggleSignupPassword = document.getElementById('toggle-signup-password');
    
    toggleLoginPassword.addEventListener('click', function() {
        const passwordInput = document.querySelector('#login-form input[type="password"]');
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    toggleSignupPassword.addEventListener('click', function() {
        const passwordInput = document.getElementById('signup-password');
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    // Form submission with basic validation
    const loginFormElement = document.querySelector('#login-form form');
    const signupFormElement = document.querySelector('#signup-form form');
    
    loginFormElement.addEventListener('submit', function(e) {
        // Add your login validation here
        console.log('Login form submitted');
        // e.preventDefault(); // Uncomment this to prevent actual submission for demo
    });
    
    signupFormElement.addEventListener('submit', function(e) {
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.querySelector('input[name="confirm-password"]').value;
        
        // Check if passwords match
        if (password !== confirmPassword) {
            e.preventDefault();
            alert('Passwords do not match!');
            return;
        }
        
        // Check password strength (basic)
        if (password.length < 8) {
            e.preventDefault();
            alert('Password must be at least 8 characters long!');
            return;
        }
        
        console.log('Signup form submitted');
        // e.preventDefault(); // Uncomment this to prevent actual submission for demo
    });
    
    // Add some interactive effects
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        // Remove focus effect
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
    
    // Simulate a game sequence in the title for visual effect
    const title = document.querySelector('.game-title h1');
    const originalText = title.textContent;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    let colorIndex = 0;
    
    // Optional: Animate title colors
    setInterval(() => {
        title.style.background = `linear-gradient(to right, ${colors[colorIndex]}, ${colors[(colorIndex + 1) % colors.length]}, ${colors[(colorIndex + 2) % colors.length]})`;
        title.style.webkitBackgroundClip = 'text';
        title.style.webkitTextFillColor = 'transparent';
        colorIndex = (colorIndex + 1) % colors.length;
    }, 3000);
});