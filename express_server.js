const express = require("express");
const { name } = require("ejs");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const { savedUrls, authenticateUser, emptyInput, findUserByEmail, regUserId, generateRandomString } = require("./helperfunctions");
const app = express();
const PORT = 8080;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: ["Some way to encrypt the values", "Sugar smack sugar smack give me a smack and I'll smack ya back"]
}));

const users = {
  "userRandomID": {
    id: 'userRandomID',
    email: "user@example.com",
    password: "test1"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "test2"
  }
};

const urlDatabase = {
  b6UTxQ: {
    longURL:  "http://www.lighthouselabs.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "http://www.google.com",
    userID: "aJ48lW"
  }
};


let emailExists = false
let passwordExists = false


app.post("/login", (req, res) => {
  console.log("Attempting to login");
  const email = req.body.email;
  const password = req.body.password;
  const authenticatedUser = authenticateUser(email, password, users);
  console.log(authenticatedUser)
  if (authenticatedUser) {
    res.cookie("user_id", authenticatedUser.id)
    return res.redirect("/urls");
  }
  if (!emailExists) {
    return res.status(403).send("Email does not exist.");
  }
  if (!passwordExists) {
    return res.status(403).send("Password does match the email provided.");
  }
  return;
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];

  if (emptyInput(email, password) === true) {
    return res.status(400).send("Error: You need to provide both an email and password to register!");
  };

  const userExist = findUserByEmail(email, users);
  console.log('user exists:', userExist);
  if (userExist) {
    res.status(400).send('Sorry, that user already exists!');
    return;
  };

  const userId = regUserId(email, password, users);
  console.log(users);
  res.cookie("user_id", userId);
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: null
  };
  res.render('login', templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: null
  };
  res.render('register', templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"]
  const updatedShortUrl = savedUrls(userId, urlDatabase);
  if (!userId) {
    return res.status(403).redirect("/login")
  };
  const templateVars = {
    urls: updatedShortUrl,
    user: users[userId]
  };

  res.cookie("user_id", userId);
  res.render("urls_new", templateVars);
});


app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const updatedShortUrl = savedUrls(userId, urlDatabase);
  console.log(updatedShortUrl);
  const templateVars = {
    urls: updatedShortUrl,
    user: users[userId]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"];
  const shortURL = req.params.shortURL;
  const updatedShortUrl = savedUrls(userId, urlDatabase);
  const templateVars = {
    user: users[req.cookies['user_id']],
    urls: updatedShortUrl,
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL 
  }
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"]
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  if (!(longURL)) {
    res.status(200).send("URL does not exist :(");
    return;
  };
  res.cookie("user_id", userId);
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const userId = req.cookies["user_id"]
  if (!userId) {
    return res.status(403).redirect("/login")
  };
  const newShortURL = generateRandomString();
  let longUrl = req.body.longURL
  if (longUrl && !(longUrl.includes('http'))) {
    longUrl = `https://${longUrl}`
  };
  
  urlDatabase[newShortURL] = {};
  urlDatabase[newShortURL].longURL = longUrl;
  urlDatabase[newShortURL].userID = userId

  console.log("urlDatabase", urlDatabase);

  res.cookie("user_id", userId);
  res.redirect(`/urls/${newShortURL}`);
});

app.post("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"]
  urlDatabase[req.params.shortURL] = `https://${req.body.longURL}`;
  
  console.log("urlDatabase", urlDatabase);
  console.log(urlDatabase[req.params.shortURL]);

  res.cookie("user_id", userId);
  res.redirect("/urls");
});

// What if what they input an update that isn't a website?

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.get("/", (req, res) => {
  res.send("Hello! Add '/urls' to your address bar to continue to the tiny url app!");
});

app.listen(PORT, () => {
  console.log(`Brace yourself! Tinyapp listening on port ${PORT}!`);
});
