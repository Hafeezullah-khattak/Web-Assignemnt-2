// app.js
// Shared code used across pages: navbar, footer, and helper functions.

// ---------- Navbar / Footer (kept simple - just repeated HTML) ----------

function loadNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  nav.innerHTML = `
    <div class="logo">Lost & Found Portal</div>
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="items.html">Items</a></li>
      <li><a href="form.html">Add Item</a></li>
      <li><a href="about.html">About</a></li>
    </ul>
  `;
}

function loadFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;
  footer.innerHTML = `<p>UET Peshawar - Web Technologies (CS 311 / CS 224) - Assignment 02</p>`;
}

// ---------- Fetch helper (demonstrates async/await + error handling) ----------

async function getItems() {
  // async/await example
  try {
    const response = await fetch("/api/items");
    if (!response.ok) {
      throw new Error("Failed to load items from server.");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return []; // fail gracefully, return empty list
  }
}

// ---------- Callback example ----------
// A small callback-based helper: runs `callback` once items are ready.
function getItemsWithCallback(callback) {
  fetch("/api/items")
    .then((res) => res.json())
    .then((data) => callback(null, data)) // callback(error, result)
    .catch((err) => callback(err, null));
}

// ---------- Promise example ----------
// Wraps a small delay in a Promise (used for a "loading" message on the home page).
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------- Home page: statistics + recent items ----------

async function loadHomePageData() {
  const items = await getItems(); // async/await in action

  const totalItems = items.length;
  const lostCount = items.filter((i) => i.type === "Lost").length;
  const foundCount = items.filter((i) => i.type === "Found").length;
  const returnedCount = items.filter((i) => i.status === "Returned").length;

  const totalEl = document.getElementById("stat-total");
  const lostEl = document.getElementById("stat-lost");
  const foundEl = document.getElementById("stat-found");
  const returnedEl = document.getElementById("stat-returned");

  if (totalEl) totalEl.textContent = totalItems;
  if (lostEl) lostEl.textContent = lostCount;
  if (foundEl) foundEl.textContent = foundCount;
  if (returnedEl) returnedEl.textContent = returnedCount;

  // show the 4 most recent items (sorted by date, newest first)
  const recentContainer = document.getElementById("recent-items");
  if (recentContainer) {
    const recent = [...items]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);

    recentContainer.innerHTML = recent.map(createItemCardHTML).join("");
  }
}

// ---------- Shared function to build an item card (used by home + items page) ----------

function createItemCardHTML(item) {
  const typeClass = item.type.toLowerCase(); // "lost" or "found"
  return `
    <div class="item-card ${typeClass}">
      <span class="badge ${typeClass}">${item.type}</span>
      <h3>${item.name}</h3>
      <p><strong>Category:</strong> ${item.category}</p>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><strong>Date:</strong> ${item.date}</p>
      <p class="status"><strong>Status:</strong> ${item.status}</p>
      <div class="card-actions">
        <a class="btn btn-view" href="details.html?id=${item.id}">View</a>
        <a class="btn btn-edit" href="form.html?id=${item.id}">Edit</a>
        <button class="btn btn-delete" onclick="deleteItem(${item.id})">Delete</button>
      </div>
    </div>
  `;
}

// ---------- Delete item (used from item cards on any page) ----------

async function deleteItem(id) {
  const confirmed = confirm("Are you sure you want to delete this item?");
  if (!confirmed) return;

  try {
    const response = await fetch(`/api/items/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Delete failed.");
    }
    // reload the current page's item list after deleting
    if (typeof loadItemsPage === "function") {
      loadItemsPage();
    } else {
      location.reload();
    }
  } catch (err) {
    alert("Could not delete the item. Please try again.");
    console.error(err);
  }
}

// run on every page load
document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  loadFooter();
});
