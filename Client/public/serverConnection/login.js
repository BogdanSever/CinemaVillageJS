let loggedIn=false;

document.getElementById('btnSubmitFormLogIn').addEventListener('click', async (event) => {
  event.preventDefault();

  const email = document.getElementById('emailInputLogin').value;
  const password = document.getElementById('passwordInputLogin').value;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Check if fields are not empty
  if (email.trim() === '' || password.trim() === '') {
    alert('Email and password fields cannot be empty.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/loginUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (response.ok) {
      
      console.log(joinButton);
      console.log(profileButton);
      // Saving the information in the local storage
      localStorage.setItem('token', result.token);
      localStorage.setItem('email', result.email);
      localStorage.setItem('role', result.role);
      loggedIn=true;
      localStorage.setItem('loggedIn',loggedIn);

      // Redirect to specified URL
      window.open(window.location.href,"_self");
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred during login. Please try again later.');
  }

});




