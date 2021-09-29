const express = require("express");
const bodyParser = require("body-parser");
const { name } = require("ejs");
const app = express();
const PORT = 8080; 

app.use(bodyParser.urlencoded({extended: true}));
// change name? location, etc

app.set("view engine", "ejs");

function generateRandomString() {
  const result = Math.random().toString(36).substring(2,7)
  return result;
}

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = {
    shortURL: shortURL, 
    longURL: urlDatabase[shortURL]
  }
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]
  console.log("shortURL", shortURL)
  console.log("longURL", longURL)
  if (!(longURL)) {
    res.send("URL does not exist :(");
    return;
  };
  res.redirect(longURL);
});

/* Edge cases
What type of status code do our redirects have? What does this status code mean? 200
*/

// the longUrl is technically where you got the urldatabase for the short url, that being req.body.longURL
app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  let longUrl = req.body.longURL // setup for the conditional
    if (!(longUrl.includes('http'))) { //.includes tells you whether a value exists, even strings like http
      longUrl = `https://${longUrl}`
    };
  urlDatabase[newShortURL] = longUrl 
  console.log(urlDatabase);  // Log the POST request body to the console
  res.redirect(`/urls/${newShortURL}`); // Respond with the random string we generated 
});
// need a redirect to /urls:shortURL with the function generator to present the change. Did this by res.redirect the template literal of the variable which is the new shortURL, which is something that express is able to pick up on (Thank God) 
// Our new key value assigned is the shortURL

app.post("/urls/:shortURL/delete", (req, res) => {
  
  const shortURL = req.params.shortURL;
  delete urlDatabase.shortURL;
  console.log(urlDatabase);
  res.redirect("/urls");
})

app.get("/", (req, res) => {
  
  res.send("Hello! Add '/urls' to your address bar to continue to the tiny url app!");

});


app.listen(PORT, () => {

  console.log(`Brace yourself! Tinyapp listening on port ${PORT}!`);

});


/* let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
*/