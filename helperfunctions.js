const bcrypt = require('bcryptjs');


// findUserbyemail
const findUserByEmail = (email, users) => {
  for (let userId in users) {
    const user = users[userId];
    if (email === user.email) {
      return user;
    };
  };
  return undefined;
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

//authenticateUser function
const authenticateUser = (email, password, users) => {
  const user = findUserByEmail(email, users);
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }
  console.log("Password is incorrect");
  return null;
};

// generate function
function generateRandomString() {
  const result = Math.random().toString(36).substring(2, 7)
  return result;
};

// savedUrls helper function
const savedUrls = function (id, urlData) {
  const updatedUrls = {};
  const keys = Object.keys(urlData);
  for (const key of keys) {
    if (urlData[key]['userID'] === id) {
      updatedUrls[key] = urlData[key];
    }
  }
  return updatedUrls;
};



module.exports = {

  generateRandomString,
  savedUrls,
  authenticateUser,
  findUserByEmail,
  regUserId

}
