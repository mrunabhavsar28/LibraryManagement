// app.js

const { ROLES } = require('./utils/constants');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const authenticateToken = require('./middlewares/authenticationMiddleware');
const authorizeAdmin = require('./middlewares/authorizationMiddleware');
const cron = require('node-cron');
const { incrementLateFineForOverdueBooks } = require('./controllers/checkoutController');

const app = express();

app.use(bodyParser.json());

const users = [{ id: 1, name: "Mrunalini Bhavsar", email: "mrunabhavsar28@gmail.com", password: "Qwerty@987", role: ROLES.ADMIN }];
const books = [];
const checkouts = [];

app.use('/library', authRoutes(users, config));
app.use('/library', authenticateToken, bookRoutes(books, checkouts, authorizeAdmin));
app.use('/library', authenticateToken, checkoutRoutes(books, checkouts));

//Change CRON pattern to '*/1 * * * *' to start scheduler every 1 minute
//Visit Line 27 from checkoutController.js for more modifications to test
// runs job every 24 hours at 00:00 of every day
cron.schedule('0 0 * * *', async () => {
    try {
        await incrementLateFineForOverdueBooks(checkouts, users);
        console.log('Late fines updated successfully.');
    } catch (error) {
        console.error('Error updating late fines:', error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
