// ================================
// Navigation (keep + improve a bit)
// ================================
const reportBtn = document.getElementById("reportbutton");
const findBtn = document.getElementById("findbutton");

if (reportBtn) {
    reportBtn.addEventListener("click", () => {
        window.location.href = "report.php";
    });
}

if (findBtn) {
    findBtn.addEventListener("click", () => {
        window.location.href = "find.php";
    });
}

// ================================
// Dynamic stats loading
// ================================
const statsContainer = document.querySelector(".stats-bar");

async function loadStats() {
    if (!statsContainer) return;

    // Optional: show loading state
    statsContainer.style.opacity = "0.6";
    statsContainer.style.pointerEvents = "none";

    try {
        // Change this URL to your actual endpoint
        // Example: "api/stats.php" or "dashboard-stats.json"
        const response = await fetch("api/get_stats.php", {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Expected shape (you define this in backend):
        // {
        //   foundToday: 12,
        //   returned: 45,
        //   pending: 7
        // }

        updateStat(".stat-lost-today", data.lostToday ?? "—");
        updateStat(".stat-returned", data.returned ?? "—");
        updateStat(".stat-pending", data.pending ?? "—");

    } catch (err) {
        console.error("Failed to load stats:", err);
        // Optional: show fallback or error message
        statsContainer.innerHTML += '<p style="color:#ffcccc; text-align:center; margin-top:1rem;">Stats temporarily unavailable</p>';
    } finally {
        statsContainer.style.opacity = "1";
        statsContainer.style.pointerEvents = "auto";
    }
}

function updateStat(selector, value) {
    const el = document.querySelector(selector);
    if (el) {
        el.textContent = value;
    }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadStats();

    // Optional: refresh stats every 2–5 minutes
    // setInterval(loadStats, 120000); // 2 minutes
});

// ================================
// Optional: subtle entrance animation for cards
// (if you want something extra without CSS changes)
// ================================
const cards = document.querySelectorAll(".option-card");

cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";

    setTimeout(() => {
        card.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
    }, 300 + index * 200);
});