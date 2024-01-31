const socket = new WebSocket(
  "ws://https://developmentsamak-production-7c7b.up.railway.app/notify "
);
const stompClient = Stomp.over(socket);

socket.onopen = () => {
  stompClient.subscribe("/topic/orders", (message) => {
    // Handle the notification received from the server
    console.log("Notification:", message.body);
  });
};
