const express = require("express");
const { name } = require("ejs");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const app = express();
const PORT = 8080; 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: ["Some way to encrypt the values", "Sugar smack sugar smack give me a smack and I'll smack ya back"]
  // password phrase is better
}))

const user = {
  randomUser: { // Is this necessary?
    id: 'a1b2c3d4',
    email: "lolol@randomexample.com",
    password: "Ilovecake"
  },
};
/*
const user2 = {
  name: "",
  email: "",
  password: ""
};

const userDatabase = {
  "" =
}
*/

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  const result = Math.random().toString(36).substring(2,7)
  return result;
}
/*
const authenticateUser = (userDB, email, password) => {
  if (userDB[email]) {
    if (userDB[email].password === password){
      //email and password math the DB
      return {user:userDB[email], error: null};
    }
    // Bad password
    return {user:null, error: "Incorrect password"};
  }
  // Bad email
  return { user: null, error: "Incorrect email"}
}
*/
app.post("/login", (req, res) => {
  const user = req.body.username;
 /* 
  const email = req.body.email; 
  const password = req.body.email;

  if(users[username]) {
    if(users[email].password === password) {
      return res.send("Successfully logged in")
    }
    console.log("password or username is incorrect")
    res.redirect("/urls")
  }
  console.log("Wrong email, password, or username")
  return res.redirect("/urls")
  */ 
  // const result = authenticateUser(userDB, email, password)
  // if (result.error)) {
  // console.log(result.error)
  //return res.redirect('/urls')
  //  }
  res.cookie("username", req.body.username);
  //req.session.username
  res.redirect("/urls");
})


app.post("/logout", (req, res) => {
  const user = req.body.username;
  res.clearCookie("username");
  res.redirect("/urls");
})


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
 
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase, 
    user: {username: req.cookies["username"]} 
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { // check again
    username: req.cookies["username"],
    shortURL: shortURL, //req.params.shortURL
    longURL: urlDatabase[shortURL] // ""
  }
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  if (!(longURL)) {
    res.send("URL does not exist :(");
    return;
  };
  res.redirect(longURL);
});

/* Edge cases
What type of status code do our redirects have? What does this status code mean? 200
*/

app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  let longUrl = req.body.longURL 
    if (longUrl && !(longUrl.includes('http'))) { //.includes tells you whether a value exists, even strings like http
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
