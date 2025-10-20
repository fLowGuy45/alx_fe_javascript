function createAddQuoteForm() {
  const container = document.getElementById("quoteFormContainer");
  container.innerHTML = ""; // Clear first

  const inputQuote = document.createElement("input");
  inputQuote.type = "text";
  inputQuote.id = "newQuoteText";
  inputQuote.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.textContent = "Add Quote";

  // ✅ Append elements dynamically using appendChild
  container.appendChild(inputQuote);
  container.appendChild(inputCategory);
  container.appendChild(addButton);

  // Attach event after adding to DOM
  addButton.addEventListener("click", addQuote);
}
