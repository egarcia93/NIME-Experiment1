let availColors = ['red','blue','green','white','pink','orange','yellow'];
let availInstruments = [0,1,2,3,4,5,6];

let express = require('express');
let app = express();
app.use('/', express.static('public'));

let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 440;
server.listen(port, () => {
    console.log('Server listening at port: ' + port);
});

let io = require('socket.io')(server);

// Listen for Individual Connection
io.sockets.on('connection', function(socket) {
    console.log('New client: ' + socket.id);
    let socketObject = [socket.id];
    // console.log(serverObject);
    socket.on("beginLogin", (beginLogin) => {
        console.log(beginLogin);
        let serverObject = {
            "availableColors" : availColors,
            "availableInstruments" : availInstruments,
        };
        io.emit('login', serverObject);
    });
    
    socket.on('colorPicked', (userObject) => {
    //    console.log(userObject);
       socketObject.push(userObject);
    //    console.log(socketObject);
       for (i = 0; i < availColors.length; i++) {
           if (userObject.color == availColors[i]) {
               availColors.splice(i, 1);
            //    console.log(availColors);
           }
           if (userObject.instrument == availInstruments[i]) {
            availInstruments.splice(i, 1);
            // console.log(availInstruments);
        }
       }
       io.emit('newClick',userObject);
    });
    socket.on('aClick', (userObject) => {
        //    console.log(userObject);
  
           io.emit('newClick',userObject);
        });

    socket.on('disconnect', () => {
        console.log('Client disconnected: ' + socket.id);
        try {
        availInstruments.push(socketObject[1].instrument);
        // console.log(availInstruments);
        availColors.push(socketObject[1].color);
        // console.log(availColors);
        } catch {
            console.log('no object available');
        }
    });
});