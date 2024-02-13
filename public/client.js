var socket = io('http://localhost:3001');

function sendMessage() {
    var message = document.getElementById('messageInput').value;
    socket.emit('message', message);
    document.getElementById('messageInput').value = ''; // clear the input
}

socket.on('message', function(message) {
    var messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += '<p>' + message + '</p>';
});
