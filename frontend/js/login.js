const email = document.getElementById('email');
const password = document.getElementById('password');
const btn = document.getElementById('btn');

btn.addEventListener('click', (e) => {
  e.preventDefault();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  // Create the payload
  const loginData = {
    email: emailValue,
    password: passwordValue,
  };

  fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
    credentials: 'include',
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Login failed');
    })
    .then((data) => {
      console.log('Login successful:', data);
      alert('Login successful');
      window.location.href = 'task.html';
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error logging you in.');
    });
});