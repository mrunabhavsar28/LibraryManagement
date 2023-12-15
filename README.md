# LibraryManagement
# Author : Mrunalini Bhavsar
# Email : mrunabhavsar28@gmail.com

Steps to run Project Locally:
1. Clone repository using command: git clone https://github.com/mrunabhavsar28/LibraryManagement.git 
2. Go to project folder and run below commands: 
    a. npm install
    b. node app.js

Functionality:

** Public Endpoint **
1. User has to Sign Up for the library providing basic info as below:
POST : http://localhost:3000/library/signUp
Body : {
    "name" : "Mruna B.",
    "email" : "mrunubhavsar28@gmail.com",
    "password" : "Qwerty@123"
}

Email and password should be in correct format as there are validations which will throw error in SignUp Api Response.
Password should have atleast one uppercase letter, one lowercase letter, one special character, one digit and length should be minimum 8.

User will get access token in the output of sign up API which he has to use while calling all the APIs from library in header like below:

{"key":"Authorization","value":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAyNTc4NDM0fQ.xrMvrAaJYdTBGKQ8dCAtEFAIC3qaxwygMEse8kWNj7I","description":"","type":"text","enabled":true}


2. User can Sign In to library if he has already registerd using Sign Up API like below:
POST: http://localhost:3000/library/signIn
Body: {
    "email" : "mrunubhavsar28@gmail.com",
    "password" : "Qwerty@123"
}

User will get access token in the output of sign up API which he has to use while calling all the APIs from library in header like below:

{"key":"Authorization","value":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAyNTc4NDM0fQ.xrMvrAaJYdTBGKQ8dCAtEFAIC3qaxwygMEse8kWNj7I","description":"","type":"text","enabled":true}

** Admin can add, update books in library (Only Admin User can have this feature - Implemented Authorization and Authentication)**
** Make sure to add access token for Admin in header as above **
** We have added below user as Admin by default **
** email: mrunabhavsar28@gmail.com **
** password: Qwerty@987 **

3. Admin can add single or multiple books(array) in library as below:
POST: http://localhost:3000/library/book
Body: [
    {
        "title": "The Monk who sold his Ferrari 1",
        "author": "Robin Sharma 1",
        "genre": "Literature 1",
        "publishedDate": "Sep 2023",
        "totalCopies": 25
    },
    {
        "title": "The Monk who sold his Ferrari 2",
        "author": "Robin Sharma 2",
        "genre": "Literature 2",
        "publishedDate": "Oct 2023",
        "totalCopies": 22
    }]

    OR 


    {
        "title": "The Monk who sold his Ferrari 1",
        "author": "Robin Sharma 1",
        "genre": "Literature 1",
        "publishedDate": "Sep 2023",
        "totalCopies": 25
    }
You can see how many books got added in response.

4. Admin can update entire book using below API:
PUT: http://localhost:3000/library/book/1 (1 is book ID)
Body: {
    "title": "The Monk who sold his Ferrari",
    "author": "Robin Sharma",
    "genre": "Literature",
    "publishedDate": "Nov 2023",
    "totalCopies": 50
}
Book with added ID will get updated along with available copies.
eg. available copied previously were 24 and total copies were 25, then after updating total copies to 50, available copies should be 49.

5. Admin can update specific properties of book using PATCH API as below:
PATCH: http://localhost:3000/library/book/1 (1 is book ID)
Body: {
    "publishedDate": "DEC 2023"
}
Book with added ID will get updated for specific property.


** Private Endpoints (Only accessible to user who has signed up or signed in using above APIs - Implemented authntication check on input access token using JWT) **

6. User can query all the available books in GET /library/books
GET http://localhost:3000/library/books
** By default page number is 1 and page size is 10. You will get next page number and page size to be added in query params for next result set.
** You can put query params page number, page size as per your choice to get desired pagination.
** You can put filterProperty and filterValue as per your choice. eg. filterProperty: author, filterProperty: Robin Sharma
Response: {
    "next": {
        "page": 2,
        "pageSize": 10
    },
    "results": [
        {
            "id": 1,
            "title": "The Monk who sold his Ferrari",
            "author": "Robin Sharma",
            "genre": "Literature",
            "publishedDate": "Nov 2023",
            "availableCopies": 49,
            "totalCopies": 50
        },
        {
            "id": 2,
            "title": "The Monk who sold his Ferrari 2",
            "author": "Robin Sharma 2",
            "genre": "Literature 2",
            "publishedDate": "Oct 2023",
            "availableCopies": 22,
            "totalCopies": 22
        }
    ]
}

7. User can get book details by book id as below:
GET http://localhost:3000/library/books/1 (1 is book Id)
Response: {
            "id": 1,
            "title": "The Monk who sold his Ferrari",
            "author": "Robin Sharma",
            "genre": "Literature",
            "publishedDate": "Nov 2023",
            "availableCopies": 49,
            "totalCopies": 50
        }

8. User can checkout book from library using book Id which will be stored in checkout table.
Checkout date is current date. Return date of book is 2 days after checkout date.
POST http://localhost:3000/library/checkout/1 (1 is book ID)
Response: {
    "message": "Book checked out successfully"
}

9. User can return book from library using book id.
POST http://localhost:3000/library/checkout/return-book/1
Response: {
    "message": "Book returned successfully"
}

10. CRON Job to update late fine:
By default, CRON job is set to run every 24 hours on 00:00.
It will check if return date of any bbok has passed, and add 10 as late fine for each day to user.
To Check CRON job working, we need below changes:

    a. Visit line number 32 from app.js and Change CRON pattern to '*/1 * * * *' to start scheduler every 1 minute
    b. Visit Line 30 from checkoutController.js and change it to returnDate.setDate(today.getDate() - 1) to mark return date as yesterday so that the checkout is picked up by scheduler for adding late fine.