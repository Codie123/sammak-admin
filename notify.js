const socket = new WebSocket(
  "ws://https://developmentsamak-production-7c7b.up.railway.app/notify "
);
const stompClient = Stomp.over(socket);

socket.onopen = () => {
  stompClient.subscribe("/topic/orders", (message) => {
    // Handle the notification received from the server
    console.log("Notification:", message.body);

    updateUI(message.body);
  });
};

// Function to update UI based on the received notification
function updateUI(notification) {
  // Implement your UI update logic here
  // For example, you can display a notification to the user
  alert("New Notification: " + notification);
}

socket.onclose = (event) => {
  if (event.wasClean) {
    console.log(
      `Connection closed cleanly, code=${event.code}, reason=${event.reason}`
    );
  } else {
    console.error("Connection abruptly closed");
  }
};

socket.onerror = (error) => {
  console.error(`WebSocket Error: ${error}`);
};

// Close the connection when it's no longer needed
// e.g., when the user logs out or navigates away from the page
function closeConnection() {
  if (socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
}
