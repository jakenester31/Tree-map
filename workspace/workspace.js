//Setup workspace
var canvas = document.getElementById("workspace");
var context = canvas.getContext("2d");
var mp = [[0,0],[0,0]];
setInterval(draw,50);
//General Info
var workspace = {x:0,y:0,md:0,scale:1};
var mouse = {gx:0,gy:0,down:0};
var objects = [];

// Fixes the aspect ratio
new ResizeObserver(resize).observe(canvas);
function resize() {
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
    draw();
}

// Mouse events:

// mouse moving over canvas
canvas.addEventListener('mousemove',(event) => {
    // Get mouse positions
    mp.splice(0,1); //removes the old item
    mp.push([ //adds new items
        event.clientX - document.getElementById('sidebar').clientWidth, //mouse x
        event.clientY - document.getElementById('head').clientHeight //mouse y
    ]);
    if (mouse.down == 1){ // mouse down? move workspace
        workspace.x += (mp[1][0] - mp[0][0]);
        workspace.y += (mp[1][1] - mp[0][1]);
    }
    Object.assign(mouse,{gx:(mp[1][0] - workspace.x) / workspace.scale,gy:(mp[1][1]- workspace.y) / workspace.scale}); //assigns mouse info
});

// mouse down and up
canvas.addEventListener('mousedown', (event) => {
    mouse.down = 1;
});

addEventListener('mouseup', (event) => {
    mouse.down = 0;
});

//Scrolling
onwheel = (event) => {
    let old = workspace.scale;
    event.deltaY < 0 && (workspace.scale += workspace.scale / 10);
    event.deltaY > 0 && (workspace.scale -= workspace.scale / 10);
    workspace.scale < 0.1 && (workspace.scale = 0.1);
    workspace.scale > 7 && (workspace.scale = 7);
    workspace.x -= mouse.gx * (workspace.scale - old);
    workspace.y -= mouse.gy * (workspace.scale - old);
    resize();
};






// converts graph position to canvas position
function goto(x,y){
    return([workspace.x + x * workspace.scale, workspace.y + y * workspace.scale])
}

function size(w,h){
    return([w * workspace.scale, h * workspace.scale]);
}

// DIVORCE!!!!
function divorce (x){
    let string = JSON.stringify(x);
    let result = "";
    let bad = [",",'"',"{","}","[","]"];
    let ob = 0;
    for (var i = 0; i < string.length; i++){
        let char = string[i];
        if (bad.indexOf(char) == -1){
            result += char;
        } else if (bad.indexOf(char) == 0 || bad.indexOf(char) == 2) {
            if (bad.indexOf(char) == 2) {
                // result += "NEW_OBJECT";
                // result += Object.entries(x)[1][0] + "___123123123123123";
                if (ob > 2){
                    result += "<br>____" + Object.entries(x)[2][1][ob - 3].constructor.name + ":";
                }
                ob += 1;
            }
            result += "<br>";
        }
    }
    return(result);
}

// Draws the canvas
function draw () {
    document.getElementById('sidebar').innerHTML= divorce({mouse,workspace,objects}); // [DELETE ME] debug info
    // Reset canvas
    context.lineWidth=3 * workspace.scale;
    context.strokeStyle="black";
    context.clearRect(0,0,canvas.width,canvas.height); //Reset canvas
    for (var i = 0; i < objects.length; i++){
        objects[i].draw();
    }
    m.x2 = mouse.gx;
    m.y2 = mouse.gy;
}

class circle {
    constructor(x,y,radius,color){
        Object.assign(this,{x:x,y:y,radius:radius,color:color})
        objects.push(this);
    }
    draw(){
        context.strokeStyle=this.color;
        context.beginPath();
            context.arc(...goto(this.x,this.y),this.radius * workspace.scale,0,Math.PI * 2);
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
        context.lineWidth=this.width * workspace.scale;
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
        context.font= this.size * workspace.scale + "px Ariel";
        context.fillText(this.text,...goto(this.x,this.y),this.maxWidth);
    }
}



let c1 = new circle(450,450,50,"black");
let l1 = new line(200,0,0,200,"purple",5);
let rectangle = new rect(0,0,100,100,"red");
let txt1 = new text(0,300,"BALLER",100)
let m = new line(0,0,0,0,"black");