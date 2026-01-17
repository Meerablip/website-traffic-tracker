const websiteNameInput = document.getElementById("websiteName");
const websiteUrlInput = document.getElementById("websiteUrl");
const addWebsiteBtn = document.getElementById("addWebsiteBtn");
const websitesListEl = document.getElementById("websitesList");
const datetimeEl = document.getElementById("datetime");
const inputErrorEl = document.getElementById("inputError");

// Update date and time
function formatDateTime(date) {
  return date.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true
  });
}

function updateDateTime() {
  const now = new Date();
  datetimeEl.textContent = formatDateTime(now);
}
updateDateTime();
setInterval(updateDateTime, 1000);

// Clear error message
function clearError() {
  inputErrorEl.textContent = "";
  inputErrorEl.classList.remove("show");
}

// Show error message
function showError(message) {
  inputErrorEl.textContent = message;
  inputErrorEl.classList.add("show");
}

// Validate URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Add website
addWebsiteBtn.addEventListener("click", async () => {
  const name = websiteNameInput.value.trim();
  const url = websiteUrlInput.value.trim();

  clearError();

  if (!name) {
    showError("Please enter a website name");
    return;
  }

  if (!url) {
    showError("Please enter a website URL");
    return;
  }

  if (!isValidUrl(url)) {
    showError("Please enter a valid URL (e.g., https://example.com)");
    return;
  }

  try {
    const response = await fetch("/api/add-website", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ websiteName: name, websiteUrl: url })
    });

    if (response.ok) {
      websiteNameInput.value = "";
      websiteUrlInput.value = "";
      clearError();
    } else {
      showError("Failed to add website");
    }
  } catch (error) {
    showError("Error adding website");
    console.error(error);
  }
});

// Remove website
async function removeWebsite(id) {
  try {
    await fetch(`/api/remove-website/${id}`, { method: "DELETE" });
  } catch (error) {
    console.error(error);
  }
}

// Update traffic
async function updateTraffic(id) {
  try {
    await fetch(`/api/update-traffic/${id}`, { method: "POST" });
  } catch (error) {
    console.error(error);
  }
}

// Render websites list
function renderWebsites(websites) {
  if (websites.length === 0) {
    websitesListEl.innerHTML = '<div class="empty-message">No websites tracked yet. Add one above to get started!</div>';
    return;
  }

  websitesListEl.innerHTML = websites.map(site => `
    <div class="website-card">
      <div class="website-details">
        <div class="website-name">${site.name}</div>
        <div class="website-url">${site.url}</div>
        <div class="website-meta">
          <span>Added: ${formatDateTime(new Date(site.timestamp))}</span>
          <span>Updated: ${formatDateTime(new Date(site.lastUpdated))}</span>
        </div>
      </div>
      <div class="website-actions">
        <div class="traffic-display">
          <div>${site.traffic}</div>
          <div class="traffic-label">Users</div>
        </div>
        <button class="refresh-btn" onclick="updateTraffic(${site.id})">Refresh</button>
        <button class="remove-btn" onclick="removeWebsite(${site.id})">Remove</button>
      </div>
    </div>
  `).join("");
}

// Socket.io connection
const socket = io();

socket.on("websitesUpdated", (websites) => {
  renderWebsites(websites);
});

socket.on("connect", () => {
  fetch("/api/websites")
    .then(res => res.json())
    .then(websites => renderWebsites(websites))
    .catch(err => console.error(err));
});

// Initial render
fetch("/api/websites")
  .then(res => res.json())
  .then(websites => renderWebsites(websites))
  .catch(err => console.error(err));