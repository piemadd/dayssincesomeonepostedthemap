const counter = document.getElementById("counter");

let socket = new WebSocket("wss://mapapithingy.piemadd.repl.co");

let lastClicked = new Date('01 Apr 2022 12:49:12 UTC');

socket.onopen = function(e) {
    console.log("websocket opened");
};

socket.onmessage = function(event) {
    lastClicked = new Date(Number(event.data));
    console.log(typeof event.data)
    console.log(lastClicked)
    
    console.log(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.error('[close] Connection died');
    }
};

socket.onerror = function(error) {
    console.error(`[error] ${error.message}`);
};

function pressedDaButton() {
    lastClicked = new Date();
    socket.send(new Date().getDate());
}

async function updateCount() {
    const now = new Date();

    const _ms = 1
    const _second = 1000 * _ms;
    const _minute = _second * 60;
    const _hour = _minute * 60;
    const _day = _hour * 24;

    let distance = now.getTime() - lastClicked.getTime();

	let days = Math.floor(distance / _day);
	let hours = Math.floor((distance % _day) / _hour);
	let minutes = Math.floor((distance % _hour) / _minute);
	let seconds = Math.floor((distance % _minute) / _second);
    let milliseconds = Math.floor((distance % _second) / _ms);

    counter.innerHTML = `${days} Days, ${hours.toString().padStart(2, '0')} Hours, ${minutes.toString().padStart(2, '0')} Minutes, ${seconds.toString().padStart(2, '0')} Seconds, and ${milliseconds.toString().padStart(3, '0')} Milliseconds`

    await new Promise(resolve => setTimeout(updateCount, 1));
}

updateCount()