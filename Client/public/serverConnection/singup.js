document.getElementById('btnSubmitFormSignUp').addEventListener('click', async (event) => {
  event.preventDefault();

  const family_name = document.getElementById('lastNameInput').value;
  const given_name = document.getElementById('firstNameInput').value;
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  const repeatPassword = document.getElementById('repeatPasswordInput').value;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Check if fields are not empty
  if (family_name.trim() === '' || given_name.trim() === '' || email.trim() === '' || password.trim() === '' || repeatPassword.trim() === '') {
    alert('All fields must be filled out.');
    return;
  }

  // Check if passwords match
  if (password !== repeatPassword) {
    alert('Passwords do not match!');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/addUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ family_name, given_name, email, password, role: 'user' }) // Assuming 'user' as default role
    });

    const result = await response.json();
    if (response.ok) {
      alert('User added successfully!');

      // Saving the information in the local storage
      localStorage.setItem('email',email);
      localStorage.setItem('role', 'user');
      loggedIn = true;
      localStorage.setItem('loggedIn', loggedIn);
      localStorage.setItem('fullName', family_name + " " + given_name);

      // Redirect to specified URL
      window.location.href = 'http://127.0.0.1:5500/Client/public/';
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Error during signup:', error);
    alert('An error occurred during signup. Please try again later.');
  }
});
