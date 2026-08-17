// server.js
// Simple Node.js + Express backend for the Lost & Found Portal
// Uses fs/promises to read and write data/items.json (no database needed)

const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = 3000;

// path to our "database" file
const DATA_FILE = path.join(__dirname, "data", "items.json");

// middleware
app.use(express.json()); // to read JSON from POST/PUT requests
app.use(express.static(path.join(__dirname, "public"))); // serve html pages
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));

// ---------- Helper functions (File Operations) ----------

// READ - read items.json and return array of items
async function readItems() {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

// WRITE - save updated items array back to items.json
async function writeItems(items) {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 4), "utf-8");
}

// ---------- API Routes ----------

// GET /api/items  -> read all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await readItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Could not read items file." });
  }
});

// GET /api/items/:id -> read one item
app.get("/api/items/:id", async (req, res) => {
  try {
    const items = await readItems();
    const item = items.find((i) => i.id == req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found." });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Could not read items file." });
  }
});

// POST /api/items -> create a new item
app.post("/api/items", async (req, res) => {
  try {
    const items = await readItems();

    // simple id generation: highest existing id + 1
    const newId =
      items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1001;

    const newItem = {
      id: newId,
      type: req.body.type,
      name: req.body.name,
      category: req.body.category,
      location: req.body.location,
      date: req.body.date,
      description: req.body.description,
      status: req.body.status || "Reported",
    };

    // basic validation
    if (!newItem.type || !newItem.name || !newItem.category) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    items.push(newItem);
    await writeItems(items);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Could not create item." });
  }
});

// PUT /api/items/:id -> update an existing item
app.put("/api/items/:id", async (req, res) => {
  try {
    const items = await readItems();
    const index = items.findIndex((i) => i.id == req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Item not found." });
    }

    // update only the fields that were sent
    items[index] = { ...items[index], ...req.body, id: items[index].id };

    await writeItems(items);
    res.json(items[index]);
  } catch (err) {
    res.status(500).json({ error: "Could not update item." });
  }
});

// DELETE /api/items/:id -> remove an item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const items = await readItems();
    const index = items.findIndex((i) => i.id == req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Item not found." });
    }

    const removed = items.splice(index, 1);
    await writeItems(items);
    res.json({ message: "Item deleted.", item: removed[0] });
  } catch (err) {
    res.status(500).json({ error: "Could not delete item." });
  }
});

// start server
app.listen(PORT, () => {
  console.log(`Lost & Found Portal server running at http://localhost:${PORT}`);
});
