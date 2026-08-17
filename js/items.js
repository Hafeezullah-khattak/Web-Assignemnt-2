// items.js
// Logic for items.html: load all items, then search/filter/sort them.

let allItems = []; // holds the full list fetched from the server

async function loadItemsPage() {
  allItems = await getItems(); // from app.js (uses fetch + async/await)
  populateCategoryFilter();
  renderItems(allItems);
}

// fills the category dropdown based on categories found in the data
function populateCategoryFilter() {
  const categorySelect = document.getElementById("filter-category");
  if (!categorySelect) return;

  const categories = [...new Set(allItems.map((i) => i.category))].sort();

  categorySelect.innerHTML =
    `<option value="All">All Categories</option>` +
    categories.map((c) => `<option value="${c}">${c}</option>`).join("");
}

// renders a list of items into the grid
function renderItems(items) {
  const grid = document.getElementById("items-grid");
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = `<p>No items match your search/filters.</p>`;
    return;
  }

  grid.innerHTML = items.map(createItemCardHTML).join("");
}

// reads all filter/search/sort controls and re-renders the grid
function applyFiltersAndSearch() {
  const searchText = document.getElementById("search-box").value.toLowerCase();
  const typeFilter = document.getElementById("filter-type").value;
  const categoryFilter = document.getElementById("filter-category").value;
  const statusFilter = document.getElementById("filter-status").value;
  const sortBy = document.getElementById("sort-by").value;

  let result = allItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText);

    const matchesType = typeFilter === "All" || item.type === typeFilter;
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  // sorting
  if (sortBy === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "date-newest") {
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === "date-oldest") {
    result.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  renderItems(result);
}

document.addEventListener("DOMContentLoaded", () => {
  // only run this on the items page
  if (!document.getElementById("items-grid")) return;

  loadItemsPage();

  // update results dynamically without page refresh
  document.getElementById("search-box").addEventListener("input", applyFiltersAndSearch);
  document.getElementById("filter-type").addEventListener("change", applyFiltersAndSearch);
  document.getElementById("filter-category").addEventListener("change", applyFiltersAndSearch);
  document.getElementById("filter-status").addEventListener("change", applyFiltersAndSearch);
  document.getElementById("sort-by").addEventListener("change", applyFiltersAndSearch);
});
