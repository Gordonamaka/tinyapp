const express = require("express");
const app = express();
const PORT = 8080; // default port 8080


app.set("view engine", "ejs");
// added in descriptors in the urldatabase to distingush them in the tinyurl form. works fine
const urlDatabase = {
  "b2xLHLVn2": "http://www.lighthouselabs.ca",
  "9smGOOGLE5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  
  const templateVars = { urls: urlDatabase };

  res.render("urls_index", templateVars);
});



app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});