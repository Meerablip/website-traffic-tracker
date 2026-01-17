// server.js
const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Store tracked websites with fake user counts
let trackedWebsites = [];

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Generate random traffic count for a website (realistic numbers with K, M, B)
function generateRandomTraffic() {
  const ranges = [
    { min: 100, max: 999, suffix: '' },           // 100-999
    { min: 1000, max: 9999, suffix: 'K' },        // 1K-9.9K
    { min: 10000, max: 99999, suffix: 'K' },      // 10K-99K
    { min: 100000, max: 999999, suffix: 'K' },    // 100K-999K
    { min: 1000000, max: 9999999, suffix: 'M' },  // 1M-9.9M
    { min: 10000000, max: 99999999, suffix: 'M' },// 10M-99M
    { min: 100000000, max: 999999999, suffix: 'M' },// 100M-999M
    { min: 1000000000, max: 9999999999, suffix: 'B' } // 1B-9.9B
  ];
  
  // Randomly choose a range
  const range = ranges[Math.floor(Math.random() * ranges.length)];
  const randomNum = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  
  return randomNum;
}

// Format number with K, M, B suffix
function formatTraffic(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

// Add a new website to track
app.post("/api/add-website", (req, res) => {
  const { websiteName, websiteUrl } = req.body;
  
  if (!websiteName || !websiteUrl) {
    return res.status(400).json({ error: "Website name and URL are required" });
  }
  
  const trafficNum = generateRandomTraffic();
  
  const newWebsite = {
    id: Date.now(),
    name: websiteName,
    url: websiteUrl,
    trafficRaw: trafficNum,
    traffic: formatTraffic(trafficNum),
    timestamp: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
  
  trackedWebsites.unshift(newWebsite);
  
  // Broadcast to all clients
  io.emit("websitesUpdated", trackedWebsites);
  
  res.json({ success: true, website: newWebsite });
});

// Get all tracked websites
app.get("/api/websites", (req, res) => {
  res.json(trackedWebsites);
});

// Remove a website
app.delete("/api/remove-website/:id", (req, res) => {
  const id = parseInt(req.params.id);
  trackedWebsites = trackedWebsites.filter(w => w.id !== id);
  
  io.emit("websitesUpdated", trackedWebsites);
  
  res.json({ success: true });
});

// Update traffic for a website
app.post("/api/update-traffic/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const website = trackedWebsites.find(w => w.id === id);
  
  if (!website) {
    return res.status(404).json({ error: "Website not found" });
  }
  
  website.trafficRaw = generateRandomTraffic();
  website.traffic = formatTraffic(website.trafficRaw);
  website.lastUpdated = new Date().toISOString();
  
  io.emit("websitesUpdated", trackedWebsites);
  
  res.json({ success: true, website });
});

io.on("connection", (socket) => {
  socket.emit("websitesUpdated", trackedWebsites);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});