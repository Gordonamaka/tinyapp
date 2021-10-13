// Package Imports
const express = require("express");
const { name } = require("ejs");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
//Local Imports
const { savedUrls, authenticateUser, findUserByEmail, regUserId, generateRandomString } = require("./helperfunctions");
//Constants
const app = express();
const PORT = 8080;
const password = "test1";
const hashedPassword = bcrypt.hashSync(password, 10);
const users = {
  "userRandomID": {
    id: 'userRandomID',
    email: "user@example.com",
    password: hashedPassword
  }
};
const urlDatabase = {
  b6UTxQ: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "http://www.google.com",
    userID: "aJ48lW"
  }
};
//Middlewares
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["Some way to encrypt the values", "Sugar smack sugar smack give me a smack and I'll smack ya back"]
}));

// .post for login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const authenticatedUser = authenticateUser(email, password, users);
 
  if (authenticatedUser && bcrypt.compareSync(password, authenticatedUser.password)) {
    req.session.user_id = authenticatedUser.id;
    return res.redirect("/urls");
  }

  return res.status(403).send("Email or password is incorrect!");
});

// .post for logout
app.post("/logout", (req, res) => {
  req.session = null;

  res.redirect("/urls");
});

// .post for register
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  if (email === ""|| password === "") {
    return res.status(400).send("Error: You need to provide both an email and password to register!");
  };
 
  // UserExists checks if the email exists
  const userExist = findUserByEmail(email, users);
  
  if (userExist) {
    res.status(400).send('Sorry, that user already exists!');
    return;
  };

  // regUserId is the createUserFunction
  const userId = regUserId(email, hashedPassword, users);

  req.session.user_id = userId;
  res.redirect("/urls");
});

// .get for user login
app.get("/login", (req, res) => {
  const userId = req.session.user_id;
    
  if (userId) {
    return res.redirect("/urls")
  };

  const templateVars = {
  user: null
  };
  
  res.render('login', templateVars);
});

// .get for register page
app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  
  if (userId) {
    return res.redirect("/urls")
  };

  const templateVars = {
    user: null
  };
  
  res.render('register', templateVars);
});

// .get for new url submission page
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const updatedShortUrl = savedUrls(userId, urlDatabase);
  
  // if not logged in, return to login page
  if (!userId) {
    return res.status(403).redirect("/login");
  };

  const templateVars = {
    urls: updatedShortUrl,
    user: users[userId]
  };

  req.session.user_id = userId;
  res.render("urls_new", templateVars);
});

// .get for our primary urls page(index)
app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  const updatedShortUrl = savedUrls(userId, urlDatabase);
  const templateVars = {
    urls: updatedShortUrl,
    user: users[userId]
  };

  res.render("urls_index", templateVars);
});

// .get for our shortURL creation page
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;
  // adding readability to limit redundancy*
  const urlObject = urlDatabase[shortURL];
  const urlExists = !!urlObject;

  // saves updatedShortUrls within the savedUrls function to our database
  const updatedShortUrl = savedUrls(userId, urlDatabase);
  
  // if URL exists security bug, double !! turns it into a boolean
  if (!urlExists) {
    return res.status(400).send("The URL you requested does not exist.");
  };

  const templateVars = {
    user: users[req.session.user_id],
    urls: updatedShortUrl,
    shortURL: shortURL,
    longURL: urlObject.longURL
  };

  // fixed security hole that allowed non-users to access urls
  if (!userId) {
    return res.status(403).redirect("/login");
  };
  
  // security with touching urls that do not belong to the user
  if (userId !== urlObject.userID) {
    return res.status(403).send("You did not create this URL, hence you do not have access to this URL.");
  };


  res.render("urls_show", templateVars);
});

// .get for when we use our shorturls
app.get("/u/:shortURL", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;

  if (!urlDatabase[shortURL]) {
    return res.status(200).send("URL does not exist :(");
  };

  const longURL = urlDatabase[shortURL].longURL;

  if (!(longURL)) {
    return res.status(200).send("URL does not exist :(");
  };

  req.session.user_id = userId;
  res.redirect(longURL);
});

// .post & logic for creating shorturls
app.post("/urls", (req, res) => {
  const userId = req.session.user_id;
  
  if (!userId) {
    return res.status(403).redirect("/login");
  };

  const newShortURL = generateRandomString();

  let longUrl = req.body.longURL;

  if (longUrl && !(longUrl.includes('http'))) {
    longUrl = `https://${longUrl}`
  };

  urlDatabase[newShortURL] = {};
  urlDatabase[newShortURL].longURL = longUrl;
  urlDatabase[newShortURL].userID = userId;

  req.session.user_id = userId;
  res.redirect(`/urls/${newShortURL}`);
});

// .post for "edit" button route
app.post("/urls/:shortURL", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;

  // cannot edit urls if not the user of said url
  if (urlDatabase[shortURL].userID !== userId) {
    return res.send("Sorry, you dont have permission to edit another user's url! That's rude!");
  };

  //consistent with new url creation, both need https
  let longUrl = req.body.longURL;

  if (longUrl && !(longUrl.includes('http'))) {
    longUrl = `https://${longUrl}`
  };

  urlDatabase[req.params.shortURL] = { longURL: `https://${req.body.longURL}`, userID: userId };

  req.session.user_id = userId;
  res.redirect("/urls");
});

// .post for our delete button
app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;

  // cannot delete urls if not the user of said url
  if (urlDatabase[shortURL].userID !== userId) {
    return res.send("Sorry, you dont have permission to delete another user's url! That's rude!");
  };

  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// redirects to /urls if logged in, otherwise redirects to login.
app.get("/", (req, res) => {
  const userId = req.session.user_id;

  if (userId) {
    res.redirect("/urls")
  } else if (!userId) {
    res.redirect("/login")
  };

});

app.listen(PORT, () => {
  console.log(`Brace yourself! Tinyapp listening on port ${PORT}!`);
});
