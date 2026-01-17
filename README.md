# Website Traffic Tracker

A modern website traffic tracker that lets you add websites and track their user traffic in real-time using Node.js, Express, and Socket.io.

## Features

- Add websites by name and URL to track
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
- Open multiple browser tabs to see real-time Socket.io updates
- No database required
