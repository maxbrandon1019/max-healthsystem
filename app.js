async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Call your Netlify Function
    const response = await fetch('/.netlify/functions/auth', {
        method: 'POST',
        body: JSON.stringify({ email, password, action: 'login' })
    });

    const user = await response.json();

    if (user.id) {
        localStorage.setItem('user', JSON.stringify(user));
        showDashboard(user);
    } else {
        alert("Login failed");
    }
}

function showDashboard(user) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('user-display').innerText = `Hello, ${user.email}`;

    if (user.role === 'admin') {
        document.getElementById('admin-view').style.display = 'block';
        loadAdminData();
    } else {
        document.getElementById('user-view').style.display = 'block';
        loadUserData(user.id);
    }
}

function logout() {
    localStorage.removeItem('user');
    location.reload();
}