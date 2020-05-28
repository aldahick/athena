let socket;

const createSocket = () => {
  const socket = io("http://localhost:8080");
  socket.on("athena.error", message => alert(message));
  return socket;
}

const waitSocketEvent = (eventName) => {
  return new Promise(resolve => {
    socket.on(eventName, data => {
      resolve(data);
    });
  });
};

$(document).ready(async () => {
  socket = createSocket();

  const helloPromise = waitSocketEvent("hello");
  socket.emit("hello", prompt("What's your name?"));
  alert(await helloPromise);
  socket.close();

  socket = createSocket();

  const authPromise = waitSocketEvent("athena.auth");
  socket.emit("athena.auth", prompt("Please enter a valid auth token"));
  await authPromise;
  alert("Authenticated");

  const rolesPromise = waitSocketEvent("roles");
  socket.emit("roles");
  alert(JSON.stringify(await rolesPromise));
  socket.close();
});
