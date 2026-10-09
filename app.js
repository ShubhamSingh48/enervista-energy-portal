document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorAlert = document.getElementById('error-alert');
    const submitBtn = document.getElementById('submit-btn');

    errorAlert.classList.add('hidden');
    submitBtn.innerText = 'Signing In...';

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save token and utility flag in memory/storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('utilityFlag', data.utilityFlag);

            // Switch to Dashboard
            loadDashboard();
        } else {
            errorAlert.innerText = data.error || 'Invalid login credentials';
            errorAlert.classList.remove('hidden');
        }
    } catch (err) {
        errorAlert.innerText = 'Server error. Make sure backend is running.';
        errorAlert.classList.remove('hidden');
    } finally {
        submitBtn.innerText = 'Sign In →';
    }
});

function loadDashboard() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');
    
    const utilityFlag = localStorage.getItem('utilityFlag');
    if (utilityFlag) {
        document.getElementById('utility-text').innerText = `⚡ Eco-Tier Update: ${utilityFlag}`;
    }
}

function logout() {
    localStorage.clear();
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
}

// Check if already logged in on page load
window.onload = function() {
    if (localStorage.getItem('token')) {
        loadDashboard();
    }
};