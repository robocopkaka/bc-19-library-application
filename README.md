# Library Application

## Introduction

* The application allows you search for books.
* It gives users the ability to borrow books
  + Non - authenticated users will be redirected to the login page.
* Only an admin can add, edit, or delete books.
* Admin can also make a book unavailable
* Users can signup/ login with the following
  + Local signup/ login
  + Facebook
  + Twitter
  + Google

## Dependencies
### Back End Dependencies
The app depends on a number of NodeJS modules
* bcrypt-nodejs - used to hash user passwords before storing them in the database
* body-pary - used to access json objects
* connect-flash - used for displaying flash messages
* dotenv - used for managing enviroment variables
* express- a light - weight web framework built on top of NodeJS
* express-session - used for keeping track of user sessions
* passport - an unobstrusive middleware used for user authentication
* passport-facebook - used to allow users signup/ login through Facebook
* passport-twitter - used to allow users signup/ login through Twitter
* passport-google-oauth - used to allow users signup/ login through Google
* passport-local - used to allow users signup/ login normally

## Front End Dependencies
Bootstrap - a framework used for developing user interfaces

### Installation
* Navigate to a directory of choice on terminal.
* Clone this repository on that directory.
* Navigate into the directory
* Install back end dependencies using:
> npm install
* Run using
> npm run dev
* Go to localhost:/3000 on your browser	