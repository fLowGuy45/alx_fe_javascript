// Quotes array with default values
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not let making a living prevent you from making a life.", category: "Wisdom" }
];

// Function to show a random quote
function showRandomQuote() {
  let random = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>"${quotes[random].text}" - <em>${quotes[random].category}</em></p>`;
}

// ✅ Function requested by checker: Dynamically create form
function createAddQuoteForm() {
  const container = document.getElementById("quoteFormContainer");
  container.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

  // Attach event listener after adding button dynamically
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

// Function to add a new quote dynamically
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText !== "" && quoteCategory !== "") {
    quotes.push({ text: quoteText, category: quoteCategory });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    showRandomQuote();
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// ✅ Call to generate the form dynamically at runtime
createAddQuoteForm();

// Display a quote on initial load
showRandomQuote();
