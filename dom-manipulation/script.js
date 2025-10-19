// --- Data and storage keys ---
const LOCAL_KEY = 'dq_quotes_v1';
const SESSION_KEY_LAST_INDEX = 'dq_last_viewed_index';

// default quotes (used if localStorage empty)
const defaultQuotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Do or do not. There is no try.", author: "Yoda" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" }
];

let quotes = [];
let currentIndex = 0; // index of currently viewed quote

// --- Storage helpers ---
function saveQuotes() {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error('Failed to save quotes to localStorage:', err);
  }
}

function loadQuotes() {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) {
    quotes = [...defaultQuotes];
    saveQuotes();
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      quotes = parsed
        .filter(q => q && typeof q.text === 'string')
        .map(q => ({ text: q.text, author: q.author || '' }));
    } else {
      console.warn('Saved data not array; resetting to defaults');
      quotes = [...defaultQuotes];
      saveQuotes();
    }
  } catch (err) {
    console.error('Error parsing saved quotes; resetting to defaults', err);
    quotes = [...defaultQuotes];
    saveQuotes();
  }
}

// --- UI rendering ---
function renderQuotes() {
  const container = document.getElementById('quotesContainer');
  container.innerHTML = '';
  quotes.forEach((q, i) => {
    const el = document.createElement('div');
    el.className = 'quote';
    el.innerHTML = `<strong>#${i + 1}</strong> <em>${q.author ? '— ' + escapeHtml(q.author) : ''}</em><p>${escapeHtml(q.text)}</p>`;
    el.addEventListener('click', () => {
      showQuote(i);
    });
    container.appendChild(el);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Quote actions ---
function addQuote(text, author) {
  if (!text || !text.trim()) {
    alert('Quote text cannot be empty');
    return;
  }
  quotes.push({ text: text.trim(), author: (author || '').trim() });
  saveQuotes();
  renderQuotes();
  currentIndex = quotes.length - 1;
  sessionStorage.setItem(SESSION_KEY_LAST_INDEX, String(currentIndex));
  showQuote(currentIndex);
}

function showQuote(index) {
  if (index < 0 || index >= quotes.length) return;
  currentIndex = index;
  sessionStorage.setItem(SESSION_KEY_LAST_INDEX, String(currentIndex));
  const q = quotes[index];
  alert(`Quote #${index + 1}\n${q.text}\n${q.author ? '— ' + q.author : ''}`);
}

function showRandomQuote() {
  if (quotes.length === 0) return alert('No quotes available');
  const i = Math.floor(Math.random() * quotes.length);
  showQuote(i);
}

function showNext() {
  if (quotes.length === 0) return;
  const next = (currentIndex + 1) % quotes.length;
  showQuote(next);
}

function showPrev() {
  if (quotes.length === 0) return;
  const prev = (currentIndex - 1 + quotes.length) % quotes.length;
  showQuote(prev);
}

function clearLocalStorage() {
  if (!confirm('Clear all saved quotes from local storage?')) return;
  localStorage.removeItem(LOCAL_KEY);
  quotes = [...defaultQuotes];
  saveQuotes();
  renderQuotes();
  alert('Storage cleared and defaults restored.');
}

// --- Import / Export JSON ---
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  a.href = url;
  a.download = `quotes-${ts}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) {
        alert('Imported JSON must be an array of quote objects');
        return;
      }
      const sanitized = imported
        .filter(q => q && typeof q.text === 'string')
        .map(q => ({ text: q.text.trim(), author: q.author ? String(q.author).trim() : '' }));
      if (sanitized.length === 0) {
        alert('No valid quotes found in import file');
        return;
      }
      const existingSet = new Set(quotes.map(q => q.text + '||' + q.author));
      let added = 0;
      sanitized.forEach(sq => {
        const key = sq.text + '||' + sq.author;
        if (!existingSet.has(key)) {
          quotes.push(sq);
          existingSet.add(key);
          added++;
        }
      });
      saveQuotes();
      renderQuotes();
      alert(`Imported ${sanitized.length} quotes (${added} new).`);
    } catch (err) {
      console.error('Failed to import JSON', err);
      alert('Failed to import JSON file: ' + err.message);
    }
  };
    currentIndex = Math.min(Math.max(Number(last), 0), Math.max(quotes.length - 1, 0));
  } else {
  renderQuotes();
    const author = document.getElementById('quoteAuthor').value;
    addQuote(text, author);
    document.getElementById('quoteText').value = '';
    document.getElementById('quoteAuthor').value = '';
  });

  document.getElementById('showRandom').addEventListener('click', showRandomQuote);
  document.getElementById('nextQuote').addEventListener('click', showNext);
  document.getElementById('prevQuote').addEventListener('click', showPrev);
  document.getElementById('clearStorage').addEventListener('click', clearLocalStorage);
  document.getElementById('exportJson').addEventListener('click', exportToJson);

  console.log('Restored last viewed quote index:', currentIndex);
});

  document.getElementById('addBtn').addEventListener('click', () => {
    const text = document.getElementById('quoteText').value;
    currentIndex = 0;
  }

  reader.readAsText(file);
  event.target.value = '';
  if (last !== null && !isNaN(Number(last))) {
}

  const last = sessionStorage.getItem(SESSION_KEY_LAST_INDEX);
// --- Initialization & event wiring ---
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();

