// General
const canvas = document.querySelector('#workspace');
const context = canvas.getContext("2d");
const workspace = {x:0,y:0,scale:1};
const objects = [];

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
    const mouse = [[e.clientX,e.clientY],[e.clientX,e.clientY]];
    const move = function (e){
        mouse.splice(0,1);
        mouse.push([e.clientX,e.clientY])
    
        workspace.x += (mouse[1][0] - mouse[0][0]);
        workspace.y += (mouse[1][1] - mouse[0][1]);
    }
    const stop = function(){
        removeEventListener('mousemove',move);
        removeEventListener('mouseup',stop);
        console.log('killed');
    }

    addEventListener('mousemove', move)
    addEventListener('mouseup', stop)
    console.log('born');
})

canvas.addEventListener('wheel', e=>{
    const old = workspace.scale;
    const mp = {x:gPos(e.clientX).x,y:gPos(e.clientY).y};

    e.deltaY < 0 && (workspace.scale += workspace.scale / 10);
    e.deltaY > 0 && (workspace.scale -= workspace.scale / 10);

    workspace.scale < 0.1 && (workspace.scale = 0.1);
    workspace.scale > 7 && (workspace.scale = 7);

    workspace.x -= mp.x * (workspace.scale - old);
    workspace.y -= mp.y * (workspace.scale - old);
});

// Classes

new rect(-1,-1,1,1);
new color('red');
new rect(0,0,100,100);
new rect(100,100,100,100);
new lineWidth(7);
new color('skyblue');
new line(200,200,300,300);
new rect(300,200,1000,100);

setInterval(draw, 20);


function draw(){
    // setup
    context.lineWidth = size(3);
    context.strokeStyle='black';
    context.fillStyle = 'black';
    context.clearRect(0,0,canvas.width,canvas.height);
    //draw objects
    for (var i = 0; i < objects.length; i++){
        objects[i].draw();
    }

    // document.querySelector('#sidebar').innerHTML=test.join('<br>');
}