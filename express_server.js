const express = require("express");
const { name } = require("ejs");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
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
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// global flag to identify whether the email is wrong or password is wrong
let emailExists = false
let passwordExists = false

function generateRandomString() {
  const result = Math.random().toString(36).substring(2, 7)
  return result;
};
// user registation function
const regUserId = function (email, password, users) {
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email,
    password,
  };
  return userId
};
// User already exists function
const findUserByEmail = (email, users) => {
  for (let userId in users) {
    const user = users[userId];
    if (email === user.email) {
      return user;
    };
  };
  return null;
};

// no input helper function
const emptyInput = (email, password) => {
  if (!email || !password) {
    return true
  }
  return false;
};

// User authentication for login
const authenticateUser = (email, password, users) => {
  const user = findUserByEmail(email, users);
  if (!user) {
    emailExists = false;
  } else {
    emailExists = true;
  }
  if (user && user.password === password) {
    passwordExists = true;
    return user;
  } else {
    passwordExists = false;
  }
  console.log("Password is incorrect");
  return null
};


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
    return res.status(403).send("Email does not exist");
  }
  if (!passwordExists) {
    return res.status(403).send("Password does not exist");
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
  // user is null, get is what happens when you first enter the page
  const templateVars = {
    user: null
  };
  res.render('register', templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users
  };
  res.render("urls_new", templateVars);
});

// keep cookie user exists, redirect back to the login etc
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const templateVars = {
    urls: urlDatabase,
    user: users[userId]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = {
    user: users,
    shortURL: shortURL, //req.params.shortURL
    longURL: urlDatabase[shortURL] // ""
  }
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  if (!(longURL)) {
    res.status(200).send("URL does not exist :(");
    return;
  };
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  let longUrl = req.body.longURL
  if (longUrl && !(longUrl.includes('http'))) { 
    longUrl = `https://${longUrl}`
  };
  urlDatabase[newShortURL] = longUrl;
  res.redirect(`/urls/${newShortURL}`);
});


app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = `https://${req.body.longURL}`;
  console.log(urlDatabase[req.params.shortURL]);
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
