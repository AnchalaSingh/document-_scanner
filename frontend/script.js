const API_BASE = "http://localhost:3000";

// ✅ Show Register Form
function showRegister() {
    document.getElementById("registerForm").style.display = "block";
}

// ✅ Register User
function register() {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.success ? "Registered! Please login." : data.error);
    });
}

// ✅ Login User
function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid Credentials");
        }
    });
}

// ✅ Load User Dashboard
function loadDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return window.location.href = "index.html";

    document.getElementById("username").textContent = user.username;

    fetch(`${API_BASE}/credits/${user.id}`)
    .then(res => res.json())
    .then(data => document.getElementById("credits").textContent = data.credits);

    fetch(`${API_BASE}/scan/${user.id}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("scanHistory").innerHTML = data.scans.map(scan => 
            `<li>${scan.document_name} - ${scan.scan_date}</li>`
        ).join("");
    });
}

// ✅ Request Credits
function requestCredits() {
    const user = JSON.parse(localStorage.getItem("user"));
    fetch(`${API_BASE}/credits/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
    })
    .then(res => res.json())
    .then(data => alert("Credit request sent."));
}

// ✅ Scan Document
function scanDocument() {
    const user = JSON.parse(localStorage.getItem("user"));
    const documentName = document.getElementById("documentName").value;

    fetch(`${API_BASE}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, documentName })
    })
    .then(res => res.json())
    .then(() => loadDashboard());
}

// ✅ Logout
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}
