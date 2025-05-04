const canvas = document.querySelector('#workspace');
const context = canvas.getContext("2d");
const workspace = {x:0,y:0,scale:1};
var test = [];

new ResizeObserver(resizeCanvas).observe(canvas);
function resizeCanvas() {
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
    draw();
}

setInterval(draw, 10);


function draw(){
    context.clearRect(0,0,canvas.width,canvas.height); //Reset canvas
    context.fillRect(...goto(0,0),...size(100,100));
    document.querySelector('#sidebar').innerHTML=test.join('<br>');
}


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
})

canvas.addEventListener('wheel', e=>{
    const old = workspace.scale;
    const mp = {x:gPos(e.clientX).x,y:gPos(e.clientY).y};
    e.deltaY < 0 && (workspace.scale += workspace.scale / 10);
    e.deltaY > 0 && (workspace.scale -= workspace.scale / 10);

    workspace.x -= mp.x * (workspace.scale - old);
    workspace.y -= mp.y * (workspace.scale - old);
});

function gPos (input){
    const results = {x:0,y:0}
    results.x = ((input - workspace.x - canvas.parentNode.offsetLeft) / workspace.scale);
    results.y = ((input - workspace.y - canvas.parentNode.offsetTop) / workspace.scale);
    return(results);
}