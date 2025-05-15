// General

const canvas = document.querySelector('#workspace');
const context = canvas.getContext("2d");
const workspace = {x:0,y:0,scale:1,md:0};
const objects = [];
var mouse = [0,0];
var target;

new ResizeObserver(resizeCanvas).observe(canvas);
function resizeCanvas() {
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
    draw();
}

// functions & event listeners

function goto(x,y){
    return([workspace.x + size(x), workspace.y + size(y)])
}

function size(...values){
    let result = [];
    for (var i = 0; i < values.length; i++){
        result.push(values[i] * workspace.scale);
    }
    result.length == 1 && (result = result[0]);
    return(result);
}

function gPos (input){
    const results = {x:0,y:0}
    results.x = ((input - workspace.x - canvas.parentNode.offsetLeft) / workspace.scale);
    results.y = ((input - workspace.y - canvas.parentNode.offsetTop) / workspace.scale);
    return(results);
}

canvas.addEventListener('mousedown', e =>{
    if (e.button !== 0){
        return(0);
    }
    const mousePos = [];
    while (mousePos.length < 2) {
        mousePos.push([e.clientX - canvas.parentNode.offsetLeft,e.clientY - canvas.parentNode.offsetTop])
    }
    mouse = [
        mousePos[1][0] + canvas.parentNode.offsetLeft,
        mousePos[1][1] + canvas.parentNode.offsetTop
    ];
    const move = function (e){
        // mousePos positions
        mousePos.splice(0,1);
        mousePos.push([e.clientX - canvas.parentNode.offsetLeft,e.clientY - canvas.parentNode.offsetTop])
        // mousePos bounding
        for (var i = 0; i < 2; i++){
            mousePos[1][i] < 0 && (mousePos[1][i] = 0);
        }
        mousePos[1][0] > canvas.clientWidth && (mousePos[1][0] = mousePos[0][0]);
        mousePos[1][1] > canvas.clientHeight && (mousePos[1][1] = mousePos[0][1]);
        // Record mouse as global
        mouse = [
            mousePos[1][0] + canvas.parentNode.offsetLeft,
            mousePos[1][1] + canvas.parentNode.offsetTop
        ];
        // reposition target
        if (target !== undefined){
            target.x += (mousePos[1][0] - mousePos[0][0]) / workspace.scale;
            target.y += (mousePos[1][1] - mousePos[0][1]) / workspace.scale;
            return(0);
        }
        // reposition workspace
        workspace.x += (mousePos[1][0] - mousePos[0][0]);
        workspace.y += (mousePos[1][1] - mousePos[0][1]);
    }

    const stop = function(){
        workspace.md = 0;
        target = undefined;
        console.log('Killed');
        removeEventListener('mousemove',move);
        removeEventListener('mouseup',stop);
    }

    target = undefined;
    hover = [];
    for (var i = 0; i < objects.length; i++){
        typeof objects[i]['checkHover'] !== 'undefined' && objects[i].checkHover();
    }
    if(hover.length >= 1) {
        target = hover[hover.length - 1];
        target.toFront();
    }
    
    addEventListener('mousemove', move);
    addEventListener('mouseup', stop);
    workspace.md = 1;
})

canvas.addEventListener('wheel', e=>{
    const old = workspace.scale;
    // which position?
    let mp = {};
    if (workspace.md == 1) {
        mp = {x:gPos(mouse[0]).x,y:gPos(mouse[1]).y};
    } else {
        mp = {x:gPos(e.clientX).x,y:gPos(e.clientY).y};
    }
    // new scale
    e.deltaY < 0 && (workspace.scale += workspace.scale / 10);
    e.deltaY > 0 && (workspace.scale -= workspace.scale / 10);
    // bound scale
    workspace.scale < 0.1 && (workspace.scale = 0.1);
    workspace.scale > 7 && (workspace.scale = 7);
    // offset workspace
    workspace.x -= mp.x * (workspace.scale - old);
    workspace.y -= mp.y * (workspace.scale - old);
});

var arcAngle = [0,2];
const dftSettings = {
    lineWidth:3,
    color:'skyblue'
};

const temp = {};

// Classes
new rect(-1,-1,1,1);
temp.test = new rect(0,0,100,100).addCollider();
temp.test.color = 'red';
delete temp.test;
new rect(100,100,100,100).addCollider();
new line(200,200,300,300);
new line(310,310,330,330)
new rect(300,200,1000,100);
new curve([200,0],[400,100]);
new arc(500,100,[50,90],'origin').color = 'red';
new arc(500,100,[50,90],'origin').setArc(1.5);

setInterval(draw, 20);
var hover = [];
function draw(){
    // setup
    context.clearRect(0,0,canvas.width,canvas.height);
    //draw objects
    for (var i = 0; i < objects.length; i++){
        objects[i].draw();
    }
}