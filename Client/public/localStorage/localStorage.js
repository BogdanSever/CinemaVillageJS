// Example function to get the token from local storage
function getToken() {
  return localStorage.getItem('token');
}

// Example function to check if a user is logged in
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// Example function to get user information
function getUserInfo() {
  return {
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role')
  };
}

// Example usage
if (isLoggedIn()) {
  const userInfo = getUserInfo();
  console.log('User is logged in:', userInfo);
} else {
  console.log('User is not logged in');
}
