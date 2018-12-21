var express = require('express')
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

let gpio;
try {
    gpio = require('rpi-gpio')
    let gpiop = gpio.promise;
    gpiop.setup(5, gpio.DIR_OUT)
    gpiop.setup(13, gpio.DIR_OUT)
    gpiop.setup(11, gpio.DIR_OUT)
    gpiop.setup(3, gpio.DIR_OUT)
    .then(() => {
        stopAll();
    });
} catch(ex) {
    console.log("cannot register rpi-gpio module on this computer")
}




const COMMANDS = {
    "left": 11,
    "right": 13,
    "up": 5,
    "down": 3
}


app.use(express.static('public'));

const stopAll = () => {
    console.log("inside stopAll");
    [11, 13, 5, 3].forEach(pin => gpio.write(pin, false));
};



const on = (command) => {
    pinNumber = COMMANDS[command];
    try {
        gpio.write(pinNumber, true);
    } catch(ex) {
        console.log("cannot execute command on this computer");
    }
}

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('gamepad_command', (command) => {
        console.log('message: ' + command);
        
        if(command === 'stopAll') {
            stopAll();
        } else {
            on(command);
        }

    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        stopAll();
    });

});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

