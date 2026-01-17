# Website Traffic Tracker

A modern website traffic tracker that lets you add websites and track their fake user traffic in real-time using Node.js, Express, and Socket.io.

## Features

- Add websites by name and URL to track
- Generate random traffic counts (100-5000 users) for each website
- View all tracked websites in a beautiful card layout
- Refresh traffic count for any website with a button click
- Remove websites from tracking list
- Real-time updates across all connected clients via Socket.io
- Current date and time displayed at top (updates every second)
- Full responsive design
- No database needed - in-memory storage

## File Structure

```
project-folder/
├── server.js
├── package.json
└── public/
    ├── index.html
    ├── style.css
    └── script.js
```

## Installation and Setup

### Step 1: Create Project Folder
Create a new folder called `website-traffic-tracker`

### Step 2: Add Files
- Copy `server.js` and `package.json` to the root folder
- Create a `public` subfolder
- Copy `index.html`, `style.css`, and `script.js` into the `public` folder

### Step 3: Install Dependencies

**On Windows:**
1. Open File Explorer and go to your project folder
2. Right-click on empty space and select "Open in Terminal"
3. Type: `npm install`

**On Mac/Linux:**
1. Open Terminal
2. Navigate to your project: `cd /path/to/website-traffic-tracker`
3. Type: `npm install`

### Step 4: Start the Server

Type in terminal:
```
npm start
```

You should see: `Server running on http://localhost:3000`

### Step 5: Use the App

Open your browser and go to: `http://localhost:3000`

## How It Works

1. Enter a website name (e.g., "Google")
2. Enter a website URL (e.g., "https://google.com")
3. Click "Add Website"
4. Website appears in the list with random traffic count
5. Click "Refresh" to generate new random traffic
6. Click "Remove" to delete from tracking
7. All changes update in real-time across all browser tabs

## Technologies

- Backend: Node.js, Express, Socket.io
- Frontend: HTML, CSS, JavaScript
- Storage: In-memory (data resets on server restart)

## Notes

- Traffic numbers are randomly generated between 100-5000
- Data is not persisted (clears when server restarts)
- Open multiple browser tabs to see real-time Socket.io updates
- No database required