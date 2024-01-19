const token = localStorage.getItem("token"); // Your token string

// Decode the base64-encoded payload of the token
const payload = JSON.parse(atob(token.split(".")[1]));

// Get the current timestamp
const currentTimestamp = Math.floor(Date.now() / 1000);

// Check if the token is expired
if (payload.exp && currentTimestamp >= payload.exp) {
  console.log("Token is expired.");
  localStorage.clear("token");
  window.location.href = "https://admin.sammak.store/index.html";
  // Handle logout or deny access
} else {
  console.log("Token is valid.");

  // Perform the logout action (invalidate the token on the server-side)
  // You might have a database of invalidated tokens or another mechanism
  // to keep track of logged-out users.
}

const logoutBtn = document.querySelector("#logout");
logoutBtn.addEventListener("click", () => {
  localStorage.clear("token");
  window.location.href = "https://admin.sammak.store/index.html";
});
