# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product
Check Docs file for screenshots of the web application.

!["Urls page before login"](https://github.com/Gordonamaka/tinyapp/blob/master/docs/urls-page-before-login.png?raw=true)

!["Urls creation page"](https://github.com/Gordonamaka/tinyapp/blob/master/docs/create-tinyURL-page.png?raw=true)

!["Urls edit page"](https://github.com/Gordonamaka/tinyapp/blob/master/docs/short-url-edit-page.png?raw=true)

!["Urls page after login with newly created urls"](https://github.com/Gordonamaka/tinyapp/blob/master/docs/urls-page-with-new-short-urls.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Run Npm start to run the app locally, which includes:
  - Package imports (const express = require("express");)
  - Local imports (const { getUserByEmail } = require('./helpers');) (The rest of the imports exist in helperfunctions.js, all labelled). 
  - Constants (const PORT = 8080;)
  - Middlewares (app.set("view engine", "ejs");)
