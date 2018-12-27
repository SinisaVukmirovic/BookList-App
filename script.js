//  Book Class: Repesents a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


//  METHODS

// The static keyword defines a static method for a class. Static methods aren't called on instances of the class. Instead, they're called on the class itself. These are often utility functions, such as functions to create or clone objects.

//  UI Class: Handle UI tasks
class UI {
    static displayBooks() {
        //  pretending the this arr is in local storage
        // const StoredBooks = [
        //     {
        //         title: 'First book',
        //         author: 'John Doe',
        //         isbn: '3434434'
        //     },
        //     {
        //         title: 'Second book',
        //         author: 'Janne Doe',
        //         isbn: '45545'
        //     },
        // ];

        // const books = StoredBooks;

        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book));
    }

    //  creating add book to list method
    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        //  creating a html element, a table row, for inserting a book in list
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        //  appending the created table row to the list
        list.appendChild(row);
    }

    //  delete book function
    static deleteBook(el) {
        //  checking if the element has a "delete" class
        if (el.classList.contains('delete')) {
            //  deleting the parent element, 
            // need to call it 2 times since we want to delete the tr element
            el.parentElement.parentElement.remove();
        }
    }

    //  show alert function
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className} text-center`;
        //  adding the text of the alert message
        div.appendChild(document.createTextNode(message));
        //  creating the container for the alert
        //  and inserting is in the container and before the form
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //  remove the alert message after 3 secs
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }


    //  function for clearng form fields after adding 
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}


//  Store Class: Handles storage (local storage)
class Store {
    static getBooks() {
        let books;
        //  checking if there is something in local storage
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        //  reseting the local storage without removed book
        localStorage.setItem('books', JSON.stringify(books));
    }
}


//  EVENTS

//  Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);



//  Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //  preventing default, actual submit event
    e.preventDefault();
    //  getting values from the form
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //  validate feedback alerts if the form fields are empty
    if (title ===  '' || author === '' || isbn === '') {
        UI.showAlert('Please, fill in all the fields', 'danger');
    }
    else {
        //  Instantiate book after getting the values
        const book = new Book(title, author, isbn);

        //  Add book to list (UI)
        UI.addBookToList(book);

        //  add books to local storage
        Store.addBook(book);
        
        //  alert message for successful added book
        UI.showAlert('Book added', 'success');

        //  Clear fields after adding
        UI.clearFields();
    }

});

//  Event: Remove a book
//  for targeting the delete btn we need "Event Propagation"
//  targeting the list for click event and getting the target of the click
document.querySelector('#book-list').addEventListener('click', (e) => {

    //  remove book from the list (from the UI)
    UI.deleteBook(e.target);

    //  remove book from the local storage
    //  to remove a book we use ISBN number and to target it
    //  we parget the parent of the targeted delete btn and its sibling
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);


    //  alert message for successful added book
    UI.showAlert('Book removed', 'warning');
});