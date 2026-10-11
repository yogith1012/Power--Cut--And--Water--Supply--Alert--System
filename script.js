// ==========================================
 // Power Cut & Water Supply Alert System
 // script.js
 // ==========================================

const API_BASE_URL = "https://poweralert-backend.onrender.com";

console.log("Power Cut & Water Supply Alert System Loaded Successfully!");

window.onload = function () {
    console.log("Website Loaded");
};

// Navigation Active Button
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {
    link.addEventListener("click", function () {
        navLinks.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// Button Click Effect
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", function () {
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 150);
    });
});

// Register User
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const user = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            password: document.getElementById("password").value
        };

        const message = document.getElementById("message");

        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                if (message) message.textContent = "Registration Successful!";
                registerForm.reset();
            } else {
                if (message) message.textContent = "Registration Failed!";
            }
        } catch (error) {
            console.error("Registration error:", error);
            if (message) message.textContent = "Server Connection Error!";
        }
    });
}

// Login User
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const user = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        const message = document.getElementById("message");

        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            });

            const data = await response.json().catch(() => null);

            if (response.ok && data && data.id) {
                if (message) message.textContent = "Login Successful!";

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);
            } else {
                if (message) message.textContent = "Invalid Email or Password";
            }
        } catch (error) {
            console.error("Login error:", error);
            if (message) message.textContent = "Server Connection Error!";
        }
    });
}

// Complaint Form
const complaintForm = document.getElementById("complaintForm");

if (complaintForm) {
    complaintForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const complaint = {
            userName: document.getElementById("userName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            area: document.getElementById("area").value,
            issueType: document.getElementById("issueType").value,
            priority: document.getElementById("priority").value,
            description: document.getElementById("description").value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/complaints/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(complaint)
            });

            if (response.ok) {
                alert("Complaint Submitted Successfully!");
                complaintForm.reset();

                setTimeout(() => {
                    window.location.href = "alerts.html";
                }, 1000);
            } else {
                const errorText = await response.text();
                console.error("Complaint submission failed:", errorText);
                alert("Failed to Submit Complaint. Please check the form and try again.");
            }
        } catch (error) {
            console.error("Complaint error:", error);
            alert("Server Connection Error!");
        }
    });
}

// Load Complaints in Admin Page
const complaintTable = document.getElementById("complaintTable");

if (complaintTable) {
    fetch(`${API_BASE_URL}/complaints/all`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            complaintTable.innerHTML = "";

            let totalReports = data.length;
            let powerReports = 0;
            let waterReports = 0;
            let resolvedReports = 0;
            let pendingReports = 0;

            data.forEach(complaint => {
                if (complaint.issueType === "Power Cut") powerReports++;
                if (complaint.issueType === "Water Supply") waterReports++;
                if (complaint.status === "Resolved") resolvedReports++;
                if (complaint.status === "Pending") pendingReports++;

                complaintTable.innerHTML += `
                    <tr>
                        <td>${complaint.id ?? ""}</td>
                        <td>${complaint.area ?? ""}</td>
                        <td>${complaint.issueType ?? ""}</td>
                        <td>${complaint.description ?? ""}</td>
                        <td>${complaint.status ?? ""}</td>
                        <td>
                            <button onclick="updateStatus(${complaint.id})">Update Status</button>
                            <button onclick="deleteComplaint(${complaint.id})">Delete</button>
                        </td>
                    </tr>`;
            });

            const setText = (id, value) => {
                const element = document.getElementById(id);
                if (element) element.innerText = value;
            };

            setText("totalReports", totalReports);
            setText("powerReports", powerReports);
            setText("waterReports", waterReports);
            setText("resolvedReports", resolvedReports);
            setText("pendingReports", pendingReports);
        })
        .catch(error => {
            console.error("Loading complaints failed:", error);
            complaintTable.innerHTML =
                "<tr><td colspan='6'>Unable to load complaints. Please try again.</td></tr>";
        });
}

// Update Status
async function updateStatus(id) {
    const newStatus = prompt("Enter Status:\nPending\nIn Progress\nResolved");

    if (!newStatus) return;

    try {
        const response = await fetch(
            `${API_BASE_URL}/complaints/status/${id}?status=${encodeURIComponent(newStatus)}`,
            { method: "PUT" }
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        alert("Status Updated Successfully!");
        location.reload();
    } catch (error) {
        console.error("Status update failed:", error);
        alert("Failed to Update Status!");
    }
}

// Delete Complaint
async function deleteComplaint(id) {
    if (!confirm("Are you sure you want to delete this complaint?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/complaints/delete/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        alert("Complaint Deleted Successfully!");
        location.reload();
    } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to Delete Complaint!");
    }
}
