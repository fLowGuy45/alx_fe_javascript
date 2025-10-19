// Initialize quotes array from localStorage or default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// Fetch DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// === Step 1: Populate Categories ===
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    if (category === selectedCategory) option.selected = true;
    categoryFilter.appendChild(option);
  });
}

// === Step 2: Display Quotes ===
function displayQuotes() {
  quoteDisplay.innerHTML = "";
  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
  
  filteredQuotes.forEach(q => {
    const quoteElement = document.createElement("p");
    quoteElement.textContent = `"${q.text}" — [${q.category}]`;
    quoteDisplay.appendChild(quoteElement);
  });
}

// === Step 3: Filter Logic ===
function filterQuotes() {
  selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayQuotes();
}

// === Step 4: Add Quote + Update Categories ===
function addQuote(text, category) {
  const newQuote = { text, category };
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  displayQuotes();
}

// === Step 5: Server Sync Logic ===
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    // Simulate converting server data into quote format
    const serverQuotes = serverData.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict resolution: Server data takes precedence
  const combinedQuotes = [...serverQuotes, ...quotes];
  const uniqueQuotes = Array.from(new Map(combinedQuotes.map(item => [item.text, item])).values());

  quotes = uniqueQuotes;
  localStorage.setItem("quotes", JSON.stringify(quotes));
  alert("Quotes synced with server. Conflicts resolved using server data.");
  populateCategories();
  displayQuotes();

  // POST updated data to server simulation
  await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quotes)
  });
}

// === Periodic Sync ===
setInterval(syncQuotes, 20000); // Sync every 20 seconds

// Initialize on load
populateCategories();
displayQuotes();
