const fs = require("fs");
const path = require("path");

// File path for events
const eventsFilePath = path.join(__dirname, "data/events.json");



// Test cases
console.log("Running Event Planner Tests...\n");

let testPassed = true;

// Test 1: Authenticate a valid user
console.log("Test 1: Authenticate a valid user");
const user = authenticateUser("admin", "password");
if (user && user.username === "admin") {
  console.log("✓ Test 1 Passed: Valid user authenticated");
} else {
  console.log("✗ Test 1 Failed: Invalid user authentication");
  testPassed = false;
}

const invalidUser = authenticateUser("wronguser", "wrongpass");
if (!invalidUser) {
  console.log("✓ Test 1 Passed: Invalid credentials rejected");
} else {
  console.log("✗ Test 1 Failed: Invalid credentials accepted");
  testPassed = false;
}

// Test 2: Create an event and save it to events.json
console.log("\nTest 2: Create an event and save it to events.json");
fs.writeFileSync(eventsFilePath, JSON.stringify([])); // Clear events file
const events = readEvents();
if (events.length === 0) {
  const newEvent = {
    id: 1,
    name: "Test Event",
    description: "Test Description",
    date: "2025-03-12",
    time: "10:00",
    category: "Meetings",
    reminder: true,
    user: "admin",
  };
  events.push(newEvent);
  writeEvents(events);

  const updatedEvents = readEvents();
  if (updatedEvents.length === 1 && updatedEvents[0].name === "Test Event") {
    console.log("✓ Test 2 Passed: Event created and saved successfully");
  } else {
    console.log("✗ Test 2 Failed: Event not saved correctly");
    testPassed = false;
  }
} else {
  console.log("✗ Test 2 Failed: Unable to clear events file");
  testPassed = false;
}

// Test 3: Filter events by user
console.log("\nTest 3: Filter events by user");
const testEvents = [
  { id: 1, name: "Event 1", user: "admin" },
  { id: 2, name: "Event 2", user: "user2" },
];
writeEvents(testEvents);
const userEvents = readEvents().filter((event) => event.user === "admin");
if (userEvents.length === 1 && userEvents[0].name === "Event 1") {
  console.log("✓ Test 3 Passed: Events filtered by user correctly");
} else {
  console.log("✗ Test 3 Failed: Events not filtered correctly");
  testPassed = false;
}

// Test 4: Sort events by date
console.log("\nTest 4: Sort events by date");
const sortEvents = [
  { id: 1, name: "Event 1", date: "2025-03-15", user: "admin" },
  { id: 2, name: "Event 2", date: "2025-03-12", user: "admin" },
];
writeEvents(sortEvents);
let sortedEvents = readEvents().filter((event) => event.user === "admin");
sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
if (
  sortedEvents[0].date === "2025-03-12" &&
  sortedEvents[1].date === "2025-03-15"
) {
  console.log("✓ Test 4 Passed: Events sorted by date correctly");
} else {
  console.log("✗ Test 4 Failed: Events not sorted correctly");
  testPassed = false;
}

// Final result
console.log("\nTest Summary");
if (testPassed) {
  console.log("✓ All tests passed!");
} else {
  console.log("✗ Some tests failed. Please check the logs above.");
}
