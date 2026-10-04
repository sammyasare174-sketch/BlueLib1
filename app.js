/* BlueLib Catalogue - app.js
   Student: YOUR NAME HERE (ID: YOUR ID HERE)

   AI DISCLOSURE: This code was written with help from Claude (an AI tool by
   Anthropic). I have read it and understand how each part works.
   Documentation used: MDN Web Docs (DOM, Array.filter, addEventListener). */


/* ===== 1. DATA =====
   The books are stored in an array. Each book is an object.
   Later, this will come from the BlueLib API instead. */
const books = [
  { id: 1, title: "Introduction to Algorithms", author: "Thomas Cormen", category: "IT", copies: 4 },
  { id: 2, title: "Clean Code", author: "Robert Martin", category: "IT", copies: 3 },
  { id: 3, title: "Principles of Management", author: "Peter Drucker", category: "Business", copies: 5 },
  { id: 4, title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", copies: 2 },
  { id: 5, title: "The Story of Art", author: "Ernest Gombrich", category: "Arts", copies: 1 },
  { id: 6, title: "Things Fall Apart", author: "James Brown", category: "Arts", copies: 6 }
];

// Used to give each new book its own number
let nextId = 7;


/* ===== 2. GET THE HTML ELEMENTS WE NEED =====
   We find each element once, then reuse it below. */
const bookList = document.getElementById("book-list");
const emptyMessage = document.getElementById("empty-message");
const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filter-category");
const addForm = document.getElementById("add-form");
const formMessage = document.getElementById("form-message");


/* ===== 3. SHOW THE BOOKS =====
   showBooks() clears the grid and draws a card for every book that
   matches the current search text AND the selected category. */
function showBooks() {
  // Read what the user typed and which category is selected
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedCategory = filterCategory.value;

  // Keep only the books that match both the title search and the category
  const filteredBooks = books.filter(function (book) {
    const titleMatches = book.title.toLowerCase().includes(searchText);
    const categoryMatches = selectedCategory === "All" || book.category === selectedCategory;
    return titleMatches && categoryMatches;
  });

  // Clear the old cards before drawing new ones
  bookList.innerHTML = "";

  // If nothing matches, show the "No books found" message
  if (filteredBooks.length === 0) {
    emptyMessage.classList.remove("hidden");
  } else {
    emptyMessage.classList.add("hidden");
  }

  // Make one card for each book
  filteredBooks.forEach(function (book) {
    bookList.appendChild(createCard(book));
  });
}


/* createCard() builds the HTML for ONE book card and returns it. */
function createCard(book) {
  const card = document.createElement("article");
  card.className = "book-card";

  // Title
  const title = document.createElement("h3");
  title.textContent = book.title;

  // Author, category and copies
  const author = document.createElement("p");
  author.textContent = "Author: " + book.author;

  const category = document.createElement("p");
  category.textContent = "Category: " + book.category;

  const copies = document.createElement("p");

  // Borrow button
  const borrowButton = document.createElement("button");

  if (book.copies > 0) {
    copies.textContent = "Copies available: " + book.copies;
    borrowButton.textContent = "Borrow";
  } else {
    // No copies left: show "Out of stock" and disable the button
    copies.textContent = "Out of stock";
    copies.className = "out-of-stock";
    borrowButton.textContent = "Out of stock";
    borrowButton.disabled = true;
  }

  // When Borrow is clicked, run borrowBook() for THIS book
  borrowButton.addEventListener("click", function () {
    borrowBook(book.id);
  });

  // Put all the pieces inside the card
  card.appendChild(title);
  card.appendChild(author);
  card.appendChild(category);
  card.appendChild(copies);
  card.appendChild(borrowButton);

  return card;
}


/* ===== 4. BORROW A BOOK =====
   Finds the book by its id, reduces copies by 1, then redraws the cards. */
function borrowBook(bookId) {
  const book = books.find(function (b) {
    return b.id === bookId;
  });

  if (book && book.copies > 0) {
    book.copies = book.copies - 1;
  }

  showBooks();
}


/* ===== 5. ADD A NEW BOOK =====
   Runs when the form is submitted. It checks the inputs first. */
addForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stops the page from reloading

  // Read the values from the form
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const category = document.getElementById("category").value;
  const copiesText = document.getElementById("copies").value.trim();

  // VALIDATION: all fields must be filled
  if (title === "" || author === "" || category === "" || copiesText === "") {
    showMessage("Please fill in all the fields.", "error");
    return; // stop here, do not add the book
  }

  // VALIDATION: copies must be a whole number that is 0 or more
  // The pattern /^\d+$/ means "digits only" (no minus sign, no decimal point)
  if (!/^\d+$/.test(copiesText)) {
    showMessage("Copies must be a whole number of 0 or more.", "error");
    return;
  }

  // Everything is valid, so add the new book to the array
  books.push({
    id: nextId,
    title: title,
    author: author,
    category: category,
    copies: Number(copiesText) // convert the text "5" into the number 5
  });
  nextId = nextId + 1;

  // Show the updated list, clear the form and tell the user it worked
  showBooks();
  addForm.reset();
  showMessage("Book added successfully!", "success");
});


/* showMessage() shows a message under the form.
   type is "error" (red) or "success" (green). */
function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = type;
}


/* ===== 6. LIVE SEARCH AND FILTER =====
   "input" fires on every keystroke; "change" fires when the dropdown changes.
   Both just redraw the cards using the new search and category. */
searchInput.addEventListener("input", showBooks);
filterCategory.addEventListener("change", showBooks);


/* ===== 7. START THE PAGE =====
   Draw the cards once when the page first loads. */
showBooks();
