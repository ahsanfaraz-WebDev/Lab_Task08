const express = require("express");
const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");

const app = express();
app.use(express.json());

// File path for events
const eventsFilePath = path.join(__dirname, "../data/events.json");

const readEvents = () => {
  const data = fs.readFileSync(eventsFilePath);
  return JSON.parse(data);
};

const writeEvents = (events) => {
  fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
};

const authenticateUser = (req, res, next) => {
  const { username, password } = req.body;

  // Hardcoded user for simplicity
  if (username === "admin" && password === "password") {
    req.user = { username };
    next();
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

app.post("/events", authenticateUser, (req, res) => {
  const { name, description, date, time, category, reminder } = req.body;
  const events = readEvents();

  const event = {
    id: events.length + 1,
    name,
    description,
    date,
    time,
    category: category || "General",
    reminder: reminder || false,
    user: req.user.username,
  };

  events.push(event);
  writeEvents(events);

  if (reminder) {
    const eventDateTime = new Date(`${date}T${time}`);
    const reminderDateTime = new Date(eventDateTime.getTime() - 15 * 60 * 1000);
    schedule.scheduleJob(reminderDateTime, () => {
      console.log(
        `Reminder: Event "${name}" is starting soon at ${time} on ${date}`
      );
    });
  }

  res.status(201).json(event);
});


app.get("/events", authenticateUser, (req, res) => {
  const { sortBy } = req.query; 
  let events = readEvents().filter((event) => event.user === req.user.username);

  if (sortBy === "date") {
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === "category") {
    events.sort((a, b) => a.category.localeCompare(b.category));
  } else if (sortBy === "reminder") {
    events.sort((a, b) => b.reminder - a.reminder);
  }

  res.json(events);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
