// Get websockets
function init() {
    sockets = [];
    var nativeWebSocket = window.WebSocket;
    window.WebSocket = function (...args) {
        const socket = new nativeWebSocket(...args);
        sockets.push(socket);
        return socket;
    };
    print(`Searching for websockets. You can now join the StarQuiz.`)
    checkSockets();
}

// Wait until user joins the StarQuiz
function checkSockets() {
    if (sockets.length === 0) {
        window.setTimeout(checkSockets, 100);
    } else {
        print("Game found. Starting to listen...")
        runGame(sockets[0])
    }
}



function runGame(ws) {
    ws.addEventListener('message', function (event) {
        console.log('2Message from server ', event.data);
    });
}

function print(str) {
    console.log(`%c${str}`, "color: red; font-family: sans-serif; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;");
}