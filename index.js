// Get websockets 
function init(lang) {

    // get the localization data
    get(`https://msp2-static.mspcdns.com/translations/multiplayergames/quiz/${lang}/localization_data.txt`, 'text',
        function (err, data) {
            if (err !== null) {
                alert('Something went wrong: ' + err);
            } else {
                // Save the localization data 
                localization = {};


                data.split("\r").forEach(d => {
                    if (d.includes("ANSWER")) {
                        // get the question ID
                        let match = /Q(\d{0,4})_ANSWER(\d)=(.+)/g.exec(d);
                        let questionID = match[1];
                        let answerIndex = match[2];
                        let answerText = match[3];

                        // save the answer
                        if (!localization.hasOwnProperty(questionID)) {
                            localization[questionID] = {};
                        }

                        // -1 because the other answer array is 0-indexed
                        localization[questionID][answerIndex - 1] = answerText;
                    }
                })

                print("Answers saved.")
            }
        }
    )

    // Download answers 
    get('https://raw.githubusercontent.com/LiterallyFabian/auto-starquiz/master/answers.json', 'json',
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

        // this is a question if my beautiful regex matches the message
        if (match != null) {
            // Print the answer to the question
            let id = match[1];
            let ans = answers[id];
            print(`Answer: ${localization[id][ans]}`);
        }
    });
}

// print message that is easier to read 
function print(str) {
    console.log(`%c${str}`, "color: red; font-family: sans-serif; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;");
}

// grab data without jquery
var get = function (url, responseType, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = responseType;
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