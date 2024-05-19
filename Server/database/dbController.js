const poolPromise = require('./dbConfig');

// Test querry:
const getAllUsers = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM users');
    return result.recordset;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Function to add a user
const addUser = async (user) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('family_name', user.family_name)
      .input('given_name', user.given_name)
      .input('email', user.email)
      .input('password', user.password)
      .input('role', user.role)
      .query('INSERT INTO users (family_name, given_name, email, password, role) VALUES (@family_name, @given_name, @email, @password, @role)');
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Function to log in a user
const loginUser = async (email, password) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', email)
      .input('password', password)
      .query('SELECT * FROM users WHERE email = @email AND password = @password');
    return result.recordset[0];
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getAllUsers,
  addUser,
  loginUser
};
