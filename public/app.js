console.log('hello world');
var socket = io(); 
let canvas;
let windowWidth = 0;
let windowHeight = 0;
let colors = ['red','blue','green','white','pink','orange','yellow'];

let circleSize = 20;
let mySounds = [];
let loginRunning = true;
let availableInstruments;
let availableColors;
let userObject;

function loginProtocol() {
  let beginLogin = true;
  socket.emit("beginLogin", beginLogin);
  socket.on('login', (serverObject) => {
    console.log(serverObject);
    availableInstruments = serverObject.availableInstruments;
    console.log(availableInstruments);
    availableColors = serverObject.availableColors;
    console.log(availableColors);
    for (i = 0; i < availableColors.length; i++) {
      let colorButton = document.createElement('button');
      colorButton.id = availableColors[i];
      colorButton.innerHTML = availableColors[i];
      colorButton.style.border = "none";
      colorButton.style.borderRadius = "100%";
      colorButton.style.backgroundColor = availableColors[i];
      document.getElementById('buttonDisplay').appendChild(colorButton);
      colorButton.addEventListener('click', ()=> {
        console.log("clicked on button: " + colorButton.id);
        let instrument = random(availableInstruments);
        userObject = {
          "color" : colorButton.id,
          "instrument" : instrument,
          "x": 0,
          "y": 0
        };
        socket.emit('colorPicked', userObject);
        document.getElementById('loginDiv').style.display = "none";
        loginRunning = false;
      });
    }
  });
 
}

function preload(){
  soundFormats('mp3');
  for (let i = 0; i<colors.length; i++){
    mySounds.push(loadSound('data/'+i));
  }
  
}

function setup() {
  console.log(mySounds);
  windowWidth = document.getElementById('CanvasDiv').offsetWidth;
  windowHeight = document.getElementById('CanvasDiv').offsetHeight;
  console.log(windowWidth, windowHeight);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('CanvasDiv');
  background(0);
  setupGrid();
  loginProtocol();
  socket.on('newClick',(newObject)=>{
   otherClicked(newObject);
  });
}

function otherClicked(otherObject){
  if(!loginRunning){
   
    let volume = map(mouseX,0,width,0,1);
    pitch = map(mouseY,0,height,4,0)
    let otherColor = otherObject.color;
    let otherInstrument = otherObject.instrument;
    fill(otherColor);
    ellipse(otherObject.x,otherObject.y,circleSize,circleSize);
    mySounds[otherInstrument].play(0,pitch,volume);

  }
}

function setupGrid() {
  strokeWeight(3);
  line(windowWidth*0.1, windowHeight*0.1, windowWidth*0.1, windowHeight*0.9);
  line(windowWidth*0.1, windowHeight*0.9, windowWidth*0.9, windowHeight*0.9);
  text('Volume', windowWidth/3, windowHeight*0.95, 2*windowWidth/3, windowHeight);
  for (let i = 0; i < 10; i++) {
    stroke(255, 100);
    line(i*windowWidth/10, windowHeight*0.92, i*windowWidth/10, windowHeight*0.88);
    line(windowWidth*0.08, i*windowHeight/10, windowWidth*0.12, i*windowHeight/10);
  }
  for (let i = 0; i < 10; i++) {
    stroke(255, 60);
    line(i*windowWidth/10, windowHeight*0.9, i*windowWidth/10, 0);
    line(windowWidth*0.1, i*windowHeight/10, windowWidth, i*windowHeight/10);
  }
}

function mouseClicked(){
  if(!loginRunning){
    console.log('mouseclicked');
    let volume = map(mouseX,0,width,0,1);
     pitch = map(mouseY,0,height,4,0)
    let myColor = userObject.color;
    let myInstrument = userObject.instrument;
    fill(myColor);
    ellipse(mouseX,mouseY,circleSize,circleSize);
    mySounds[myInstrument].play(0,pitch,volume);
    userObject.x = mouseX;
    userObject.y = mouseY;
    socket.emit("aClick",userObject);

  }
  
  
}

function windowResized() {
  windowWidth = document.getElementById('CanvasDiv').offsetWidth;
  windowHeight = document.getElementById('CanvasDiv').offsetHeight;
  console.log(windowWidth, windowHeight);
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  setupGrid();
}