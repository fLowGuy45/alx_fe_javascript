// Array to hold quotes
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Do one thing every day that scares you.", category: "Courage" },
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Please add a new one!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small><em>— ${randomQuote.category}</em></small>
  `;
}

// ✅ Function to dynamically create a form for adding quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteForm");
  formContainer.innerHTML = ""; // Clear old content if any

  const form = document.createElement("form");
  form.id = "quoteForm";

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.required = true;

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.required = true;

  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.textContent = "Add Quote";

  // Append elements
  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addButton);
  formContainer.appendChild(form);

  // Handle submit event
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addQuote();
    form.reset();
  });
}

// Function to add a new quote to the array and update the display
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please fill in both fields!");
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

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();
  newQuoteButton.addEventListener("click", showRandomQuote);
});

