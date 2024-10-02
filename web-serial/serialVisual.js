var writer;
var reader;
var port;
var inputDone;
var writableStreamClosed;

// called when user clicks Serial Connect button
const serialConnect = async () => {
  // Prompt user to select any serial port.
  port = await navigator.serial.requestPort();

  // be sure to set the baudRate to match the ESP32 code
  await port.open({ baudRate: 115200 });

  // setup decoder to read messages from arduino
  let decoder = new TextDecoderStream();
  inputDone = port.readable.pipeTo(decoder.writable);
  inputStream = decoder.readable;
  reader = inputStream.getReader();
  handleSerial();

  // setup encoder to send messages to arduino
  const textEncoder = new TextEncoderStream();
  writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
  writer = textEncoder.writable.getWriter();
};

async function handleSerial() {
  while (true) {
    const { value, done } = await reader.read(); // value is a value received via Serial
    if (done) {
      reader.releaseLock();
      break;
    }
    if (value) {
      document.getElementById("content").style.visibility = "visible";
    }
    console.log(value);
    document.getElementById("value").innerHTML = value;
  }
}

const serialWrite = async () => {
  let message = document.getElementById("message").value;
  console.log("message: ", message);

  await writer.write(message);
};

const serialDisconnect = async() => {
  reader.cancel();
  await inputDone.catch(() => {});

  writer.close();
  await writableStreamClosed;
  await port.close();
  document.getElementById("content").style.visibility = "hidden";
}
