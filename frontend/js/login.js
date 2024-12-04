const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("btn");

// Define the base URL for the backend API
const BASE_URL = "https://taskmanager-app-4eme.onrender.com";

btn.addEventListener("click", (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Get and trim user input values
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  // Basic validation
  if (!emailValue || !passwordValue) {
    alert("Please fill in all fields");
    return;
  }

  // Create the payload
  const loginData = {
    email: emailValue,
    password: passwordValue,
  };

  // Make a POST request to the login API endpoint
  fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
    credentials: "include",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      // Handle error response
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
      console.error("Error:", error);
      alert(`There was an error logging you in: ${error.message}`);
    });
});
