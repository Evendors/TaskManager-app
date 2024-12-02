const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("btn");

btn.addEventListener("click", (e) => {
  // Prevent default button functionality
  e.preventDefault();

  // Get user input values
  const usernameValue = username.value;
  const emailValue = email.value;
  const passwordValue = password.value;

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
  fetch("http://localhost:3000/api/auth/register", {
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
      return response.json().then((errorData) => {
        throw new Error(errorData.message || "Registration failed");
      });
    })
    .then((data) => {
      console.log("Registration successful:", data);
      alert("Registration successful");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`There was an error registering you in: ${error.message}`);
    });
});
