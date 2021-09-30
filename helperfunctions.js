// findUserbyemail
const findUserByEmail = (email, users) => {
  for (let userId in users) {
    const user = users[userId];
    if (email === user.email) {
      return user;
    };
  };
  return null;
};
// user registation
const regUserId = function (email, password, users) {
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email,
    password,
  };
  return userId
};
// no input helper function
const emptyInput = function (email, password) {
  // const email = req.body["email"];
  // const password = req.body["password"];
  if (email || password === '') {
    res.status(400).send('Sorry, user must fill in their email & password to register');
    return
  };
};
// User authentication
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

// generate function
function generateRandomString() {
  const result = Math.random().toString(36).substring(2, 7)
  return result;
};

// savedUrls helper function
const savedUrls = function(id, urlData) {
  const updatedUrls = {};
  const keys = Object.keys(urlData);
  for (const key of keys) {
    if (urlData[key]['userID'] === id) {
      updatedUrls[key] = urlData[key];
    }
  }
  return updatedUrls;
};



module. exports = {

  generateRandomString,
  savedUrls,
  authenticateUser,
  emptyInput,
  findUserByEmail,
  regUserId

}