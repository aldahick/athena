$(document).ready(() => {
  const socket = io("http://localhost:8080");
  socket.on("hello", d => alert(d));
  socket.emit("hello", prompt("What's your name?"));
});
