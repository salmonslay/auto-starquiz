// Get websockets
function init() {
    getJSON('https://raw.githubusercontent.com/LiterallyFabian/StarQuizSolver/master/app/answers.json',
        function (err, data) {
            if (err !== null) {
                alert('Something went wrong: ' + err);
            } else {
                answers = data;

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
        }
    )
};

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

// grab json without jquery
var getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};