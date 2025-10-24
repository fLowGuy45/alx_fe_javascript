// Initial quotes data
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Do one thing every day that scares you.", category: "Courage" },
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add one below!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small><em>— ${randomQuote.category}</em></small>
  `;
}

// ✅ Function required by the task: createAddQuoteForm()
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteForm");

  // Clear existing form content if any
  formContainer.innerHTML = "";

  // Create form elements dynamically
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

  // Append elements to form
  form.appendChild(inputText);
  form.appendChild(inputCategory);
  form.appendChild(addButton);
  formContainer.appendChild(form);

  // Handle form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addQuote();
    form.reset();
  });
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please fill out both fields.");
    return;
  }

  quotes.push({
    text: newQuoteText,
    category: newQuoteCategory,
  });

  quoteDisplay.innerHTML = `
    <p>"${newQuoteText}"</p>
    <small><em>— ${newQuoteCategory}</em></small>
  `;

  alert("New quote added successfully!");
}

// Initialize everything when the DOM loads
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm(); // ensure form is visible on page load
  newQuoteButton.addEventListener("click", showRandomQuote);
});
