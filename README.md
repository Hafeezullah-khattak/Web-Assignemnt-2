# Lost & Found Portal

A simple Lost & Found Portal built for **Assignment 02 – Web Technologies (CS 311 / CS 224)**,
Department of Computer Science, UET Peshawar.

## Tech Stack
- HTML5, CSS3, vanilla JavaScript (frontend)
- Node.js + Express (backend)
- `items.json` as the data store (no database)

## Features
- **Home** – portal intro, live statistics, recently reported items
- **Items** – view all items with search (name/description), filters (type, category, status), and sorting (name, date), all updating without a page refresh
- **Add Item** – form to create a new lost/found record
- **Edit Item** – the same form pre-filled, reached via the "Edit" button on a card
- **Details** – full information for a single item
- **About** – portal info, rules, and contact
- Full CRUD via a REST API backed by the file system (`fs/promises`)
- Demonstrates callbacks, Promises, async/await, the Fetch API, and basic error handling (see comments in `js/app.js`)

## Folder Structure
```
lost-found-portal/
├── public/            # HTML pages
├── css/style.css       # styling
├── js/                 # app.js, items.js, form.js
├── data/items.json     # data store
├── server.js            # Express server + REST API
├── package.json
└── README.md
```

## API Endpoints
| Method | Endpoint          | Purpose            |
|--------|-------------------|---------------------|
| GET    | /api/items        | Get all items       |
| GET    | /api/items/:id    | Get one item        |
| POST   | /api/items        | Create an item      |
| PUT    | /api/items/:id    | Update an item      |
| DELETE | /api/items/:id    | Delete an item      |

## How to Run Locally
```bash
npm install
npm start
```
Then open **http://localhost:3000** in your browser.

## Deployment (Vercel)
This is a standard Express app, so it can be deployed to Vercel using a
`vercel.json` that routes all requests to `server.js`, or by using Vercel's
Node.js server support. Push the project to GitHub first, then import the
repo into Vercel.

## Author
_Name, Registration Number, and Section to be filled in by the student on the PDF report title page (as required by the assignment)._
