const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; 

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


function generateRandomString(length) {

  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
/*generates a random string of 6 charcters console.log(generateRandomString(6)); 
*/
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls/new", (req, res) => {
  
  res.render("urls_new");

});

app.get("/urls", (req, res) => {
  
  const templateVars = { urls: urlDatabase };

  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {

  const templateVars = {
    
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL
  
  };

  res.render("urls_show", templateVars);

});

app.post("/urls", (req, res) => {
  
  console.log(req.body);  // Log the POST request body to the console
  
  res.send("Ok");         // Respond with 'Ok' (we will replace this)

});


app.get("/", (req, res) => {
  
  res.send("Hello! Add '/urls' to your address bar to continue to the tiny url app!");

});


app.listen(PORT, () => {

  console.log(`Brace yourself! Tinyapp listening on port ${PORT}!`);

});