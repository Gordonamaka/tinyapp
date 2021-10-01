const { assert } = require('chai');

const { findUserByEmail } = require('../helperfunctions.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "test1"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "test2"
  }
};

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(user.id, expectedOutput);
  });

  it('should return undefined if null is passed to email inputbox', function () {
    const user = findUserByEmail(null, testUsers);
    const expectedOutput = undefined;
    assert.deepEqual(user, expectedOutput);
  });

  it('should return undefined with empty string', function () {
    const user = findUserByEmail("", testUsers);
    const expectedOutput = undefined;
    assert.deepEqual(user, expectedOutput);
  });

  it('should return undefined with email that doesnt exist in the users object', function () {
    const user = findUserByEmail("Imauser@anyemail.com", testUsers);
    const expectedOutput = undefined;
    assert.deepEqual(user, expectedOutput);
  });

  it('should return undefined if " " is passed to email input', function () {
    const user = findUserByEmail(" ", testUsers);
    const expectedOutput = undefined;
    assert.deepEqual(user, expectedOutput);
  });
});