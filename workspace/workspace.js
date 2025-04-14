//Setup workspace
const canvas = document.getElementById("workspace");
const context = canvas.getContext("2d");
var mp = [[0,0],[0,0]];
setInterval(draw,50);
//General Info
var workspace = {x:0,y:0,md:0,scale:1};
var mouse = {gx:0,gy:0,down:0};
var objects = [];
var colliders = [];
var touch = [];

//Fixes the aspect ratio
new ResizeObserver(resizeCanvas).observe(canvas);
function resizeCanvas() {
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
    draw();
}

//Mouse events:
var holding;
//mouse moving over canvas
addEventListener('mousemove',(event) => {
    // Get mouse positions:
    mp.splice(0,1); //removes the old item
    mp.push([ //adds new items
        event.clientX - document.getElementById('sidebar').clientWidth, //mouse x
        event.clientY - document.getElementById('head').clientHeight //mouse y
    ]);
    if (mouse.down == 1){ //mouse down?
        if (canvas.matches(':not(:hover)')) {  //mouse not over canvas?
            for (var x = 0; x < 2; x++){ //loop x
                for (var y = 0; y < 2; y++){ //loop y
                    mp[x][y] < 0 && (mp[x][y] = 0); //mouse off the top or left?
                    y/0 == Infinity && mp[x][y] > canvas.clientHeight && (mp[x][y] = canvas.clientHeight); //mouse off the bottom
                    y/0 != Infinity && mp[x][y] > canvas.clientWidth && (mp[x][y] = canvas.clientWidth); //mouse off the right
                }
            }
        }
        // move workspace
        if (!(holding > -1)){
            workspace.x += (mp[1][0] - mp[0][0]);
            workspace.y += (mp[1][1] - mp[0][1]);
        } else { //move object
            colliders[holding].x += (mp[1][0] - mp[0][0]) / workspace.scale;
            colliders[holding].y += (mp[1][1] - mp[0][1]) / workspace.scale;
        }
    }
    Object.assign(mouse,{gx:(mp[1][0] - workspace.x) / workspace.scale,gy:(mp[1][1]- workspace.y) / workspace.scale}); //assigns mouse info
});

// mouse down and up
canvas.addEventListener('mousedown', (event) => {
    mouse.down = 1;
    if (canvas.matches(':hover')) {
        holding = touch[touch.length - 1];
    }
});

addEventListener('mouseup', (event) => {
    mouse.down = 0;
    holding = -1;
});

//Scrolling
onwheel = (event) => {
    let old = workspace.scale; 
    // Sets the sclae
    event.deltaY < 0 && (workspace.scale += workspace.scale / 10);
    event.deltaY > 0 && (workspace.scale -= workspace.scale / 10);
    // Bounds the scale
    workspace.scale < 0.1 && (workspace.scale = 0.1);
    workspace.scale > 7 && (workspace.scale = 7);
    // repositions the graph
    workspace.x -= mouse.gx * (workspace.scale - old);
    workspace.y -= mouse.gy * (workspace.scale - old);
};


// converts graph position to canvas position
function goto(x,y){
    return([workspace.x + size(x)[0], workspace.y + size(y)[0]])
}

function size(...values){
    let result = [];
    for (var i = 0; i < values.length; i++){
        result.push(values[i] * workspace.scale);
    }
    return(result);
}

class circle {
    constructor(x,y,radius,color){
        Object.assign(this,{x:x,y:y,radius:radius,color:color})
        objects.push(this);
    }
    draw(){
        context.strokeStyle=this.color;
        context.beginPath();
            context.arc(...goto(this.x,this.y),size(this.radius),0,Math.PI * 2);
        context.closePath;
        context.stroke();
    }
}

class line {
    constructor(x,y,x2,y2,color,width){
        Object.assign(this,{x:x,y:y,x2:x2,y2:y2,color:color,width:width})
        objects.push(this);
    }
    draw(){
        context.strokeStyle=this.color;
        context.lineWidth=size(this.width);
        context.beginPath();
            context.moveTo(...goto(this.x,this.y));
            context.lineTo(...goto(this.x2, this.y2));
        context.closePath();
        context.stroke();
    }
}

class rect {
    constructor(x,y,width,height,color){
        Object.assign(this,{x:x,y:y,width:width,height:height,color:color})
        objects.push(this);
    }
    draw(){
    context.fillStyle = this.color;
    context.fillRect(...goto(this.x,this.y),...size(this.width,this.height));
    }
}

class text {
    constructor(x,y,txt,size,maxWidth){
        Object.assign(this,{x:x,y:y,text:txt,size:size,maxWidth:maxWidth});
        objects.push(this);
    }
    draw(){
        context.font= size(this.size) + "px Ariel";
        context.fillText(this.text,...goto(this.x,this.y),this.maxWidth);
    }
}

function collision(obj,debug) {
    let object = {};
    object.left = obj.x;
    object.top = obj.y;
    if (obj.constructor.name == "rect") {
        object.left = obj.x;
        object.top = obj.y;
        object.right = obj.x + obj.width;
        object.bottom = obj.y + obj.height;
    } else if (obj.constructor.name == "circle") {
        object.left = obj.x - obj.radius;
        object.top = obj.y - obj.radius;
        object.right = obj.x + obj.radius;
        object.bottom = obj.y + obj.radius;
    }

    if (debug == true) { //debug view
        context.lineWidth=size(4);
        context.strokeStyle="lightgreen";
        context.beginPath();
            context.moveTo(...goto(object.right,object.top));
            context.lineTo(...goto(object.right,object.bottom));
            context.lineTo(...goto(object.left,object.bottom));
            context.lineTo(...goto(object.left,object.top));
            context.moveTo(...goto(object.right,object.top));
        context.closePath();
        context.stroke();
    }

    if (mouse.gx > object.left && mouse.gx < object.right) {
        if (mouse.gy > object.top && mouse.gy < object.bottom){
            // Circle check
            if (obj.constructor.name == "circle"){
                let dist = Math.sqrt((mouse.gx - obj.x)**2 + (mouse.gy - obj.y)**2);
                if (dist < obj.radius){
                    return(true);
                } else {
                    return(false);
                }
            }
        return(true);
        }
    }
    return(false);
}

var c1 = new circle(450,450,50,"black");
var l1 = new line(200,0,0,200,"purple",5);
var rectangle = new rect(0,0,100,100,"red");
var rectangle2 = new rect(100,100,100,100,"green");
var txt1 = new text(0,-100,"Hello World",100)
colliders.push(rectangle);
colliders.push(rectangle2);
colliders.push(c1);

console.log(colliders.indexOf(c1))
// Draws the canvas
function draw () {
    document.getElementById('sidebar').innerHTML= holding; // [DELETE ME] debug info
    // Reset canvas
    context.lineWidth=size(3);
    context.strokeStyle="black";
    context.clearRect(0,0,canvas.width,canvas.height); //Reset canvas
    for (var i = 0; i < objects.length; i++){
        objects[i].draw();
    }
    // check collisions
    touch = [];
     for (var i = 0; i < colliders.length; i++){
         if (collision(colliders[i],false)){
             touch.push(i);
         }
     }
}