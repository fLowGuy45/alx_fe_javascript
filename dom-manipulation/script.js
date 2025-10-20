// ----- Initial Quotes Array -----
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You miss 100% of the shots you don't take.", category: "Sports" }
];

let selectedCategory = "all";

// ----- DOM Elements -----
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuote");

// ----- Load Quotes from Local Storage -----
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) quotes = JSON.parse(storedQuotes);

  const storedCategory = localStorage.getItem("selectedCategory");
  if (storedCategory) selectedCategory = storedCategory;

  populateCategories();
  filterQuotes();
}

// ----- Save Quotes to Local Storage -----
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
  localStorage.setItem("selectedCategory", selectedCategory);
}

// ----- Show Random Quote -----
function showRandomQuote() {
  const filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
  if (filtered.length === 0) return quoteDisplay.innerHTML = "<p>No quotes available in this category.</p>";
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `<p class="quote">${random.text} <strong>[${random.category}]</strong></p>`;
}

// ----- Add New Quote -----
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Please enter both quote and category.");

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ----- Populate Categories -----
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selectedCategory) option.selected = true;
    categoryFilter.appendChild(option);
  });
}

// ----- Filter Quotes -----
function filterQuotes() {
  selectedCategory = categoryFilter.value;
  saveQuotes();
  showRandomQuote();
}

// ----- JSON Export -----
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ----- JSON Import -----
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ----- Simulated Server Sync -----
async function fetchQuotesFromServer() {
  // Simulated server data (replace with real API if needed)
  const serverQuotes = [
    { text: "Server quote example", category: "Server" }
  ];
  serverQuotes.forEach(sq => {
    if (!quotes.some(q => q.text === sq.text && q.category === sq.category)) {
      quotes.push(sq);
    }
  });
  saveQuotes();
  populateCategories();
  filterQuotes();
  console.log("Data synced with server.");
}

// ----- Periodic Server Sync -----
setInterval(fetchQuotesFromServer, 30000); // Every 30 seconds

// ----- Event Listeners -----
newQuoteBtn.addEventListener("click", showRandomQuote);

// ----- Initialize -----
loadQuotes();
