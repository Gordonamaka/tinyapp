const express = require("express");
const bodyParser = require("body-parser");
const { name } = require("ejs");
const app = express();
const PORT = 8080; 

app.use(bodyParser.urlencoded({extended: true}));
// change name? location, etc

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  const result = Math.random().toString(36).substring(2,7)
  return result;
}


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

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
  let longUrl = req.body.longURL 
    if (!(longUrl.includes('http'))) { //.includes tells you whether a value exists, even strings like http
      longUrl = `https://${longUrl}`
    };
  urlDatabase[newShortURL] = longUrl 
  console.log(urlDatabase);  // Log the POST request body to the console
  res.redirect(`/urls/${newShortURL}`); // Respond with the random string we generated 
});



app.post("/urls/:shortURL/delete", (req, res) => {

  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// the shortURL direction for the edit button in Urls_show.ejs
app.post("/urls/:shortURL", (req, res) => {
  // replace the longurl that already exists urldatabase.longUrl = req.body
  urlDatabase[req.params.shortURL] = `https://${req.body.longURL}`;
  console.log(urlDatabase[req.params.shortURL]);
  res.redirect("/urls");
});
// What if what they want to update isn't a website.

app.get("/", (req, res) => {
  
  res.send("Hello! Add '/urls' to your address bar to continue to the tiny url app!");

});


app.listen(PORT, () => {

  console.log(`Brace yourself! Tinyapp listening on port ${PORT}!`);

});
