// findUserbyemail
const findUserByEmail = function (email, users) {
  for (let userId in users) {
    const userId = user[id];
      if ("email" === user.email) {
        return user;
      };
  };
  return false;
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
  const email = req.body["email"];
  const password = req.body["password"];
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



module. exports = {

  authenticateUser,
  emptyInput,
  findUserByEmail,
  regUserId

}