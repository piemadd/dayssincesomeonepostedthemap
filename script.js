const counter = document.getElementById("counter");
const leaderBoardDom = document.getElementById('leaderboard');

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

  fetch('https://mapapithingy.piemadd.repl.co/')
    .then((res) => res.json())
    .then((data) => {
      //who needs react when you rewrite half of the dom?
      let tempInner = '<tr><th>Time Reported</th><th>Time Lasted</th>';
      data.leaderBoard.forEach((item) => {
        tempInner += `<tr>
          <td>${new Date(item.time).toLocaleDateString()}</td>
          <td>${timeString(item.value)}</td>
        </tr>`
      })

      tempInner += '</tr>';

      leaderBoardDom.innerHTML = tempInner;
    })
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

const timeString = ((distance) => {
  let _distance = distance;
  const _ms = 1
  const _second = 1000 * _ms;
  const _minute = _second * 60;
  const _hour = _minute * 60;
  const _day = _hour * 24;

  let days = Math.floor(_distance / _day);
  let hours = Math.floor((_distance % _day) / _hour);
  let minutes = Math.floor((_distance % _hour) / _minute);
  let seconds = Math.floor((_distance % _minute) / _second);
  let milliseconds = Math.floor((_distance % _second) / _ms);

  return `${days} Days, ${hours.toString().padStart(2, '0')} Hours, ${minutes.toString().padStart(2, '0')} Minutes, ${seconds.toString().padStart(2, '0')} Seconds, and ${milliseconds.toString().padStart(3, '0')} Milliseconds`;
})

async function updateCount() {
  const now = new Date();
  let distance = now.getTime() - lastClicked.getTime();

  counter.innerHTML = timeString(distance);

  await new Promise(resolve => setTimeout(updateCount, 1));
}

updateCount()