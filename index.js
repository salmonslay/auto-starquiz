// Get websockets
function init() {

    // Download answers
    getJSON('https://raw.githubusercontent.com/LiterallyFabian/auto-starquiz/master/answers.json',
        function (err, data) {
            if (err !== null) {
                alert('Something went wrong: ' + err);
            } else {
                // Save answer data
                answers = data;

                // Start waiting for sockets
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
        console.log('Message from MSP: ', event.data);
        let match = /42.+quiz:chal.+QUIZ_.+Q(\d{0,3})_QUESTION/gm.exec(event.data);

        // this is a question if my beautiful regex matches
        if (match != null) {
            let id = match[1];
            let ans = answers[id];
            let ansDelay = parseInt(getRandomArbitrary(3000, 8000));
            print(`Answering in ${ansDelay}ms.`)

            setTimeout(function () {
                print("Answered!")
                ws.send(`42["quiz:answer",{"answer":${ans+1}}]`)
            }, ansDelay);
        }
    });
}

// print message that is easier to read
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

// get random number easily lol
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
