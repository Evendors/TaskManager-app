const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("btn");

// Define the base URL for the API
const BASE_URL = "https://taskmanager-app-4eme.onrender.com";

btn.addEventListener("click", (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Get and trim user input
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  // Basic input validation
  if (!emailValue || !passwordValue) {
    alert("Please enter both email and password");
    return;
  }

  // Create the payload
  const loginData = {
    email: emailValue,
    password: passwordValue,
  };

  // Perform the login API request
  fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
    credentials: "include", // Include credentials for cross-origin requests if necessary
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      // Parse error message from response
      return response.json().then((errorData) => {
        throw new Error(errorData.message || "Login failed");
      });
    })
    .then((data) => {
      console.log("Login successful:", data);
      alert("Login successful!");
      // Redirect to the tasks page
      window.location.href = "task.html";
    })
    .catch((error) => {
      console.error("Error during login:", error);
      alert(`Login error: ${error.message}`);
    });
});
