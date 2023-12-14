const { CHECKOUT_STATUS } = require('../utils/constants');

const checkoutBook = (req, res, books, checkouts) => {
    const userId = req.user.id;
    const bookId = parseInt(req.params.bookId);

    // Implement logic to checkout a book
    const book = books.find((b) => b.id === bookId);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
        return res.status(400).json({ message: 'No available copies of the book' });
    }

    const existingCheckout = checkouts.find((c) => c.userId === userId && c.bookId === bookId && c.status === CHECKOUT_STATUS.ISSUED);

    if (existingCheckout) {
        return res.status(400).json({ message: 'You have already checked out this book' });
    }

    const today = new Date();
    const returnDay = new Date(today);

    //Uncomment line number 29 and comment line number 30 to check CRON job. This will add return date as yesterday.
    //So that CRON job will pick this checkout as overdue and start adding late fine. You have to modify CRON job in app.js file as well.
    //returnDate.setDate(today.getDate() - 1);
    returnDay.setDate(today.getDate() + 2);

    const newCheckout = {
        id: checkouts.length + 1,
        userId,
        bookId,
        checkoutDate: today,
        returnDate: returnDay,
        status: CHECKOUT_STATUS.ISSUED,
    };

    checkouts.push(newCheckout);
    book.availableCopies--;

    res.json({ message: 'Book checked out successfully' });
};

const returnBook = (req, res, books, checkouts) => {
    const userId = req.user.id;
    const bookId = parseInt(req.params.bookId);

    // Implement logic to return a book
    const checkout = checkouts.find((c) => c.userId === userId && c.bookId === bookId && c.status === CHECKOUT_STATUS.ISSUED);

    if (!checkout) {
        return res.status(400).json({ message: 'You have not checked out this book' });
    }

    checkout.returnDate = new Date();
    checkout.status = CHECKOUT_STATUS.RETURNED;

    const book = books.find((b) => b.id === bookId);
    book.availableCopies++;

    res.json({ message: 'Book returned successfully' });
};

const incrementLateFineForOverdueBooks = async (checkouts, users) => {
    try {
        // Get overdue books
        console.log("Checkouts: ", checkouts);
        console.log("users: ", users);
        if (checkouts && checkouts.length > 0) {
            const overdueCheckouts = checkouts.filter((checkout) => {
                return checkout.status === CHECKOUT_STATUS.ISSUED && new Date(checkout.returnDate) < new Date();
            });

            // Increment late return fine for each overdue book
            overdueCheckouts.forEach((c) => {
                const user = users.find((u) => c.userId === u.id);
                //const userIndex = users.findIndex((b) => b.id === user);
                if (user) {
                    user.lateReturnFine = (user.lateReturnFine || 0) + 10;
                }
            });

        }
        console.log("Checkouts after JOB: ", checkouts);
        console.log("users after JOB: ", users);
        // users[bookIndex] = {
        //     ...books[bookIndex],
        //     title: title || books[bookIndex].title,
    } catch (error) {
        throw new Error(`Error updating late fines: ${error.message}`);
    }
};

// Helper function to save the updated books (replace this with your actual implementation)
const saveBooks = async (books) => {
    // Your implementation to save the updated books (e.g., update records in a database)
    // For simplicity, let's assume you have a function saveBooksToDatabase(books) to save the updated books
    await saveBooksToDatabase(books);
};


module.exports = { checkoutBook, returnBook, incrementLateFineForOverdueBooks };
