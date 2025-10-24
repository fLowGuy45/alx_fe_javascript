// ----- Storage Keys -----
const STORAGE_KEY = "dynamicQuoteGenerator.quotes";
const SESSION_LAST_VIEWED_KEY = "dynamicQuoteGenerator.lastViewedIndex";

// ----- Default quotes -----
const DEFAULT_QUOTES = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Do one thing every day that scares you.", category: "Courage" },
];

// ----- DOM Elements -----
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const exportJsonButton = document.getElementById("exportJson");
const importFileInput = document.getElementById("importFile");
const lastViewedDiv = document.getElementById("lastViewed");

// ----- In-memory quotes -----
let quotes = [];

// ----- Persistence Helpers -----
function saveQuotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error("Failed to save quotes:", err);
  }
}

function loadQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      quotes = [...DEFAULT_QUOTES];
      saveQuotes();
    } else {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        quotes = parsed.filter(q => q && typeof q.text === "string" && typeof q.category === "string");
      } else {
        quotes = [...DEFAULT_QUOTES];
      }
    }
  } catch (err) {
    console.error("Error loading quotes:", err);
    quotes = [...DEFAULT_QUOTES];
  }
}

// ----- Session Storage for Last Viewed -----
function saveLastViewedIndex(index) {
  try {
    sessionStorage.setItem(SESSION_LAST_VIEWED_KEY, String(index));
  } catch (err) {
    console.error("Failed to save last viewed index:", err);
  }
}

function loadLastViewedIndex() {
  try {
    const val = sessionStorage.getItem(SESSION_LAST_VIEWED_KEY);
    if (val === null) return null;
    const idx = parseInt(val, 10);
    return Number.isNaN(idx) ? null : idx;
  } catch {
    return null;
  }
}

// ----- Utility: HTML Escaping -----
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ----- Quote Rendering -----
function renderQuoteByIndex(index) {
  if (!quotes || quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add one below!";
    lastViewedDiv.textContent = "";
    return;
  }

  const clampedIndex = Math.max(0, Math.min(index, quotes.length - 1));
  const q = quotes[clampedIndex];

  quoteDisplay.innerHTML = `
    <p>"${escapeHtml(q.text)}"</p>
    <small><em>— ${escapeHtml(q.category)}</em></small>
  `;
  lastViewedDiv.textContent = `Last viewed (this session): #${clampedIndex + 1} — ${q.category}`;
  saveLastViewedIndex(clampedIndex);
}

// ----- Random Quote -----
function showRandomQuote() {
  if (!quotes || quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Please add one!";
    lastViewedDiv.textContent = "";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  renderQuoteByIndex(randomIndex);
}

// ----- Add Quote Form -----
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteForm");
  if (!formContainer) return;

  formContainer.innerHTML = ""; // Clear existing form

  const form = document.createElement("form");
  form.id = "quoteForm";

  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";
  inputText.required = true;

  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";
  inputCategory.required = true;

  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.textContent = "Add Quote";

  form.appendChild(inputText);
  form.appendChild(inputCategory);
  form.appendChild(addButton);
  formContainer.appendChild(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addQuote();
    form.reset();
  });
}

// ----- Add Quote -----
function addQuote() {
  const newQuoteTextEl = document.getElementById("newQuoteText");
  const newQuoteCategoryEl = document.getElementById("newQuoteCategory");

  if (!newQuoteTextEl || !newQuoteCategoryEl) {
    alert("Form inputs not found.");
    return;
  }

  const newQuoteText = newQuoteTextEl.value.trim();
  const newQuoteCategory = newQuoteCategoryEl.value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please fill out both fields.");
    return;
  }

  const newObj = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newObj);
  saveQuotes();
  renderQuoteByIndex(quotes.length - 1);
  alert("New quote added and saved locally!");
}

// ----- JSON Export -----
function exportToJsonFile() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const filename = `quotes-export-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Failed to export quotes.");
  }
}

// ----- JSON Import -----
function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    alert("No file selected.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (loadEvent) {
    try {
      const parsed = JSON.parse(loadEvent.target.result);
      if (!Array.isArray(parsed)) {
        alert("Invalid JSON format: expected an array of quote objects.");
        return;
      }

      const valid = parsed.filter(item => item && typeof item.text === "string" && typeof item.category === "string");
      if (valid.length === 0) {
        alert("No valid quotes found in the file.");
        return;
      }

      quotes.push(...valid);
      saveQuotes();
      alert(`Imported ${valid.length} quotes successfully!`);
    } catch (err) {
      console.error("Import failed:", err);
      alert("Failed to parse JSON file. Make sure it’s a valid array of quote objects.");
    } finally {
      event.target.value = "";
    }
  };

  reader.onerror = () => {
    alert("Failed to read the file.");
    event.target.value = "";
  };

  reader.readAsText(file);
}

// ----- Initialization -----
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  createAddQuoteForm();

  if (newQuoteButton) newQuoteButton.addEventListener("click", showRandomQuote);
  if (exportJsonButton) exportJsonButton.addEventListener("click", exportToJsonFile);
  if (importFileInput) importFileInput.addEventListener("change", importFromJsonFile);

  const lastIdx = loadLastViewedIndex();
  if (lastIdx !== null && quotes.length > 0 && lastIdx >= 0 && lastIdx < quotes.length) {
    renderQuoteByIndex(lastIdx);
  } else {
    showRandomQuote(); // optional: show random on first load
  }
});
