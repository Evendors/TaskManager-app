const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("btn");

// Define the base URL for the backend API
const BASE_URL = "https://taskmanager-app-4eme.onrender.com";

btn.addEventListener("click", (e) => {
  // Prevent default button functionality
  e.preventDefault();

  // Get user input values
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  // Basic validation
  if (!usernameValue || !emailValue || !passwordValue) {
    alert("Please fill in all fields");
    return;
  }

  // Create the payload
  const registerData = {
    username: usernameValue,
    email: emailValue,
    password: passwordValue,
  };

  // Make a POST request to the register API endpoint
  fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
    credentials: "include",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      // Handle error response
      return response.json().then((errorData) => {
        throw new Error(errorData.message || "Registration failed");
      });
    })
    .then((data) => {
      console.log("Registration successful:", data);
      alert("Registration successful!");
      // Redirect to the login page
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`There was an error registering you: ${error.message}`);
    });
});
