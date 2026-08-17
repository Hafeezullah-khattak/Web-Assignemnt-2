// form.js
// Handles form.html - used for BOTH adding a new item and editing an existing one.
// If the URL has ?id=1001, we load that item and switch the form into "edit" mode.

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("item-form");
  if (!form) return; // not on the form page

  const params = new URLSearchParams(window.location.search);
  const editId = params.get("id");
  const heading = document.getElementById("form-heading");
  const messageBox = document.getElementById("form-message");

  // If editing, pre-fill the form with the existing item's data
  if (editId) {
    heading.textContent = "Edit Item";
    try {
      const response = await fetch(`/api/items/${editId}`);
      if (!response.ok) throw new Error("Item not found.");
      const item = await response.json();

      form.type.value = item.type;
      form.name.value = item.name;
      form.category.value = item.category;
      form.location.value = item.location;
      form.date.value = item.date;
      form.description.value = item.description;
      form.status.value = item.status;
    } catch (err) {
      messageBox.textContent = "Could not load item for editing.";
      messageBox.className = "message error";
    }
  }

  // handle submit (works for both create and update)
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop normal page reload

    const itemData = {
      type: form.type.value,
      name: form.name.value.trim(),
      category: form.category.value.trim(),
      location: form.location.value.trim(),
      date: form.date.value,
      description: form.description.value.trim(),
      status: form.status.value,
    };

    // basic validation
    if (!itemData.name || !itemData.category || !itemData.location) {
      messageBox.textContent = "Please fill in all required fields.";
      messageBox.className = "message error";
      return;
    }

    try {
      let response;
      if (editId) {
        // UPDATE existing item
        response = await fetch(`/api/items/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });
      } else {
        // CREATE new item
        response = await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });
      }

      if (!response.ok) {
        throw new Error("Server rejected the request.");
      }

      messageBox.textContent = editId
        ? "Item updated successfully!"
        : "Item added successfully!";
      messageBox.className = "message success";

      // redirect back to items page after a short pause
      setTimeout(() => {
        window.location.href = "items.html";
      }, 1000);
    } catch (err) {
      messageBox.textContent = "Something went wrong. Please try again.";
      messageBox.className = "message error";
      console.error(err);
    }
  });
});
