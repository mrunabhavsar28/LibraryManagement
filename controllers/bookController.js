const { paginateResults } = require('../utils/pagination');
const getBooks = (books) => (req, res) => {
    const { page = 1, pageSize = 10, filterProperty, filterValue } = req.query;
    let filteredBooks = [...books];
    if (filterProperty && filterValue) {
        filteredBooks = filteredBooks.filter((b) => {
            const propertyValue = b[filterProperty];

            if (!isNaN(propertyValue) && !isNaN(filterValue)) {
                return Number(propertyValue) === Number(filterValue);
            }

            // Case-insensitive comparison for string properties
            if (typeof propertyValue === 'string' && typeof filterValue === 'string') {
                return propertyValue.toLowerCase().includes(filterValue.toLowerCase());
            }

            // Regular comparison for non-string properties
            return propertyValue === filterValue;
        });
    }

    // Paginate the filtered results
    const paginatedResults = paginateResults(page, pageSize, filteredBooks);

    res.json(paginatedResults);
};

const getBookById = (books) => (req, res) => {
    const bookId = parseInt(req.params.bookId);

    // Implement logic to fetch a book by ID
    const book = books.find((b) => b.id === bookId);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
};

const addBook = (req, res, books) => {
    const { title, author, genre, publishedDate, totalCopies } = req.body;

    // Check if the request body contains an array of books
    if (Array.isArray(req.body)) {
        // Bulk book addition
        const newBooks = req.body.map((book, index) => ({
            id: books.length + index + 1,
            title: book.title,
            author: book.author,
            genre: book.genre,
            publishedDate: book.publishedDate,
            availableCopies: book.totalCopies,
            totalCopies: book.totalCopies,
        }));

        books.push(...newBooks);

        res.json({ message: `${newBooks.length} books added successfully` });
    } else {
        // Single book addition
        const newBook = {
            id: books.length + 1,
            title,
            author,
            genre,
            publishedDate,
            availableCopies: totalCopies,
            totalCopies,
        };

        books.push(newBook);

        res.json({ message: 'Book added successfully' });
    }
};

const updateBook = (req, res, books) => {
    const bookId = parseInt(req.params.bookId);

    // Implement logic to update a book
    const bookIndex = books.findIndex((b) => b.id === bookId);
    const book = books.find((b) => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found' });
    }

    const { title, author, genre, publishedDate, totalCopies } = req.body;
    const availableCopies = Number(book.availableCopies) + (Number(totalCopies) - Number(book.totalCopies));
    books[bookIndex] = {
        ...books[bookIndex],
        title,
        author,
        genre,
        publishedDate,
        totalCopies,
        availableCopies,
    };

    res.json({ message: 'Book updated successfully' });
};

const partialUpdateBook = (req, res, books) => {
    const bookId = parseInt(req.params.bookId);

    // Implement logic to partially update a book
    const bookIndex = books.findIndex((b) => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found' });
    }

    const { title, author, genre, publishedDate, totalCopies } = req.body;
    books[bookIndex] = {
        ...books[bookIndex],
        title: title || books[bookIndex].title,
        author: author || books[bookIndex].author,
        genre: genre || books[bookIndex].genre,
        publishedDate: publishedDate || books[bookIndex].publishedDate,
        totalCopies: totalCopies || books[bookIndex].totalCopies,
    };

    res.json({ message: 'Book updated successfully' });
};

module.exports = { getBooks, getBookById, addBook, updateBook, partialUpdateBook };
