// ==========================================
// Power Cut & Water Supply Alert System
// script.js
// ==========================================

// Welcome message
console.log("Power Cut & Water Supply Alert System Loaded Successfully!");

// Show alert when page loads
window.onload = function () {
    console.log("Website Loaded");
};

// ===============================
// Navigation Active Button
// ===============================

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {
    link.addEventListener("click", function () {
        navLinks.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
    });
});

// ===============================
// Smooth Scroll
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }

    });

});

// ===============================
// Button Click Effect
// ===============================

const buttons = document.querySelectorAll("button");

buttons.forEach(button => {

    button.addEventListener("click", function () {

        this.style.transform = "scale(0.95)";

        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 150);

    });

});

// ===============================
// Register User
// ===============================

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

        try {

            const response = await fetch("http://localhost:8081/users/register", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(user)

            });

            if (response.ok) {

                document.getElementById("message").innerHTML =
                    "✅ Registration Successful!";

                registerForm.reset();

            } else {

                document.getElementById("message").innerHTML =
                    "❌ Registration Failed!";

            }

        } catch (error) {

            document.getElementById("message").innerHTML =
                "❌ Server Connection Error!";

        }

    });

}

// ===============================
// Login User
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const user = {

            email: document.getElementById("email").value,
            password: document.getElementById("password").value

        };

        try {

            const response = await fetch("http://localhost:8081/users/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(user)

            });

            const data = await response.json();

            if (data && data.id) {

                document.getElementById("message").innerHTML =
                    "✅ Login Successful!";

                setTimeout(() => {

                    window.location.href = "dashboard.html";

                }, 1000);

            } else {

                document.getElementById("message").innerHTML =
                    "❌ Invalid Email or Password";

            }

        } catch (error) {

            document.getElementById("message").innerHTML =
                "❌ Server Connection Error";

        }

    });

}

// ===============================
// Complaint Form
// ===============================

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

            const response = await fetch("http://localhost:8081/complaints/add", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(complaint)

            });

          if (response.ok) {

    alert("✅ Complaint Submitted Successfully!");

    complaintForm.reset();

    // Automatically go to Alerts page
    setTimeout(() => {
        window.location.href = "alerts.html";
    }, 1000);

} else {

    alert("❌ Failed to Submit Complaint!");

}

        } catch (error) {

            alert("❌ Server Connection Error!");

            console.log(error);

        }

    });

}

// ===============================
// Load Complaints in Admin Page
// ===============================

const complaintTable = document.getElementById("complaintTable");

if (complaintTable) {

    fetch("http://localhost:8081/complaints/all")

        .then(response => response.json())

        .then(data => {

            complaintTable.innerHTML = "";

            // Statistics
            let totalReports = data.length;
            let powerReports = 0;
            let waterReports = 0;
            let resolvedReports = 0;
            let pendingReports = 0;

            data.forEach(complaint => {

                if (complaint.issueType === "Power Cut") {
                    powerReports++;
                }

                if (complaint.issueType === "Water Supply") {
                    waterReports++;
                }

                if (complaint.status === "Resolved") {
                    resolvedReports++;
                }

                if (complaint.status === "Pending") {
                    pendingReports++;
                }

                complaintTable.innerHTML += `
<tr>
    <td>${complaint.id}</td>
    <td>${complaint.area}</td>
    <td>${complaint.issueType}</td>
    <td>${complaint.description}</td>
    <td>${complaint.status}</td>

    <td>
        <button onclick="updateStatus(${complaint.id})">
            Update Status
        </button>

        <button onclick="deleteComplaint(${complaint.id})">
            Delete
        </button>
    </td>
</tr>
`;
            });

            // Update Statistics
            document.getElementById("totalReports").innerText = totalReports;
            document.getElementById("powerReports").innerText = powerReports;
            document.getElementById("waterReports").innerText = waterReports;
            document.getElementById("resolvedReports").innerText = resolvedReports;
            document.getElementById("pendingReports").innerText = pendingReports;

        })

        .catch(error => {

            console.log(error);

            complaintTable.innerHTML =
                "<tr><td colspan='6'>No Complaint Found</td></tr>";

        });

}

// ===============================
// Update Status
// ===============================

function updateStatus(id) {

    const newStatus = prompt(
        "Enter Status:\nPending\nIn Progress\nResolved"
    );

    if (!newStatus) {
        return;
    }

   fetch(`http://localhost:8081/complaints/status/${id}?status=${encodeURIComponent(newStatus)}`, {
        method: "PUT"
    })

    .then(response => response.json())

    .then(data => {

        alert("✅ Status Updated Successfully!");

        location.reload();

    })

    .catch(error => {

        console.log(error);

        alert("❌ Failed to Update Status!");

    });

}

// ===============================
// Delete Complaint
// ===============================

function deleteComplaint(id) {

    if (!confirm("Are you sure you want to delete this complaint?")) {
        return;
    }

    fetch(`http://localhost:8081/complaints/delete/${id}`, {

        method: "DELETE"

    })

    .then(() => {

        alert("Complaint Deleted Successfully!");

        location.reload();

    })

    .catch(error => {

        console.log(error);

        alert("Failed to Delete Complaint!");

    });

}