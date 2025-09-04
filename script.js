// Keep all book objects here:
const myLibrary = [];

/* ---------- Constructor ---------- */
// Use crypto.randomUUID() if available for stable unique IDs; fallback otherwise.
function Book(title, author, pages, read = false) {
  this.id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : generateUUIDFallback();
  this.title = title;
  this.author = author;
  this.pages = Number(pages) || 0;
  this.read = Boolean(read);
}

// Prototype method to toggle read status
Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

/* ---------- Library functions ---------- */
// addBookToLibrary: create a Book from args and push to myLibrary
function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
  renderLibrary(); // re-render after change
  return book;
}

// Remove a book by id
function removeBookById(id) {
  const index = myLibrary.findIndex(b => b.id === id);
  if (index === -1) return false;
  myLibrary.splice(index, 1);
  renderLibrary();
  return true;
}

// Toggle read state and re-render
function toggleBookReadById(id) {
  const book = myLibrary.find(b => b.id === id);
  if (!book) return false;
  book.toggleRead();
  renderLibrary();
  return true;
}

/* ---------- Rendering ---------- */
const libraryContainer = document.getElementById('library');

function renderLibrary() {
  // Clear existing
  libraryContainer.innerHTML = '';

  // Show a card for each book
  myLibrary.forEach(book => {
    const card = document.createElement('article');
    card.className = 'book-card';
    // connect DOM to object using data-id
    card.dataset.id = book.id;

    // Title
    const h3 = document.createElement('h3');
    h3.textContent = book.title;
    card.appendChild(h3);

    // Details (author, pages, read)
    const pAuthor = document.createElement('p');
    pAuthor.textContent = `Author: ${book.author}`;
    card.appendChild(pAuthor);

    const pPages = document.createElement('p');
    pPages.textContent = `${book.pages} pages`;
    card.appendChild(pPages);

    const pRead = document.createElement('p');
    pRead.textContent = `Read: ${book.read ? 'Yes' : 'No'}`;
    card.appendChild(pRead);

    // Buttons
    const row = document.createElement('div');
    row.className = 'card-row';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn';
    toggleBtn.textContent = book.read ? 'Mark unread' : 'Mark read';
    toggleBtn.addEventListener('click', () => toggleBookReadById(book.id));
    row.appendChild(toggleBtn);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-secondary';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => removeBookById(book.id));
    row.appendChild(removeBtn);

    card.appendChild(row);
    libraryContainer.appendChild(card);
  });

  // optional: empty state message
  if (myLibrary.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No books yet — click "New Book" to add one.';
    libraryContainer.appendChild(empty);
  }
}

/* ---------- Helpers & UI ---------- */
function generateUUIDFallback() {
  // simple fallback if crypto.randomUUID not available
  return 'id-' + Math.random().toString(36).slice(2, 9) + '-' + Date.now().toString(36);
}

// Dialog + form handling
const newBookBtn = document.getElementById('newBookBtn');
const bookDialog = document.getElementById('bookDialog');
const bookForm = document.getElementById('bookForm');
const cancelBtn = document.getElementById('cancelBtn');

// open the dialog
newBookBtn.addEventListener('click', () => {
  if (typeof bookDialog.showModal === 'function') {
    bookDialog.showModal();
  } else {
    // fallback: make it visible if <dialog> is not supported
    bookDialog.setAttribute('open', 'open');
  }
});

// cancel button closes dialog
cancelBtn.addEventListener('click', () => {
  if (typeof bookDialog.close === 'function') bookDialog.close();
  else bookDialog.removeAttribute('open');
});

// Important: prevent the default submit action (which tries to send to a server)
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const form = e.target;
  const title = form.title.value.trim();
  const author = form.author.value.trim();
  const pages = parseInt(form.pages.value, 10) || 0;
  const read = form.read.checked;

  // Basic validation (HTML required attributes already help)
  if (!title || !author) return;

  addBookToLibrary(title, author, pages, read);

  form.reset();

  if (typeof bookDialog.close === 'function') bookDialog.close();
  else bookDialog.removeAttribute('open');
});

/* ---------- Add a couple of sample books for testing ---------- */
addBookToLibrary('1984', 'George Orwell', 328, true);
addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 310, false);
