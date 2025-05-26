// General
const canvas = document.querySelector('#workspace');
const context = canvas.getContext("2d");
const workspace = {x:0,y:0,scale:1};
const settings = {
    scrollIn:7,
    scrollOut:0.1
}
var mouse = {};
const objects = [];
var tMembers;
const groups = {};
const allGroups = {};
var gId = 0;

new ResizeObserver(resizeCanvas).observe(canvas);
function resizeCanvas() {
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
    canvasPos();
    draw();
}

// functions & event listeners
canvas.addEventListener('mousedown', e =>{
    if (e.button !== 0){
        return(0);
    }
    addEventListener('mousemove', move);
    addEventListener('mouseup', stop);
    // mouse position
    let mp = [];
    while (mp.length < 2) {mp.push(getMouse(e).ar);}
    mouse = getMouse(e).pk;
    // targets
    hover = [];
    for (var i = 0; i < objects.length; i++){
        typeof objects[i]['checkHover'] !== 'undefined' && objects[i].checkHover();
    }
    if(hover.length >= 1) {
        // Order them
        let input = getGroupMembers(hover[hover.length - 1]);
        let indexes = [];
        let result = [];
        for(var i = 0; i < input.length; i++){
            indexes.push(objects.indexOf(input[i]));
        }
        for(var i = 0; i < input.length; i++){
            let smallest = Math.min(...indexes);
            let item = indexes.indexOf(smallest);
            result.push(input[item]);
            indexes[item] = Infinity;
        }
        // set and bring to front
        tMembers = result;
        for(var i = 0; i < tMembers.length; i++){
            tMembers[i].toFront();
        }
    }

    function move(e) {
        // mouse positions
        mp.splice(0,1);
        mp.push(getMouse(e).ar)
        // mouse bounding
        for (var i = 0; i < 2; i++){
            const dim = canvas['client' + ['Width','Height'][i]];
            mp[1][i] < 0 && (mp[1][i] = 0);
            mp[1][i] > dim && (mp[1][i] = dim);
        }
        // Record mouse as global
        mouse = {
            x:mp[1][0],
            y:mp[1][1]
        };
        // reposition targets
        if (tMembers !== undefined){
            for(var i = 0; i < tMembers.length; i++){
                tMembers[i].x += (mp[1][0] - mp[0][0]) / workspace.scale;
                tMembers[i].y += (mp[1][1] - mp[0][1]) / workspace.scale;
            }
            return(0);
        }
        // reposition workspace
        workspace.x += mp[1][0] - mp[0][0];
        workspace.y += mp[1][1] - mp[0][1];
        canvasPos();
    }

    function stop() {
        tMembers = undefined;
        mouse = {};
        removeEventListener('mousemove',move);
        removeEventListener('mouseup',stop);
    }
})

canvas.addEventListener('wheel', e=>{
    const dir = -e.deltaY / Math.abs(e.deltaY)
    // old/new scales
    const old = workspace.scale; 
    workspace.scale += dir * workspace.scale / 10;
    // bound scale
    workspace.scale < settings.scrollOut && (workspace.scale = settings.scrollOut);
    workspace.scale > settings.scrollIn && (workspace.scale = settings.scrollIn);
    // reposition workspace
    let pos = mouse.x === undefined ? getMouse(e).pk : {x:mouse.x,y:mouse.y};
    workspace.x -= (pos.x - workspace.x) / old * (workspace.scale - old);
    workspace.y -= (pos.y - workspace.y) / old * (workspace.scale - old);
    canvasPos();
});

function getGroupMembers(obj){
    return(allGroups[obj.mainGrp] || [obj]);
}

function canvasPos() {
    context.resetTransform();
    context.translate(workspace.x,workspace.y);
    context.scale(workspace.scale,workspace.scale);
}

function getMouse(e){
    const val = {x:e.clientX - canvas.parentNode.offsetLeft, y:e.clientY - canvas.parentNode.offsetTop};
    return({ar:[val.x,val.y],pk:{x:val.x, y:val.y}})
}

function gPos (input){
    const results = {x:0,y:0}
    results.x = ((input - workspace.x) / workspace.scale);
    results.y = ((input - workspace.y) / workspace.scale);
    return(results);
}

var arcAngle = [0,2];
const drawSettings = {
    lineWidth:3,
    color:'skyblue'
};

const temp = {};


// Classes
temp.test = new rect(0,0,100,100).addCollider();
temp.test.color = 'red';
delete temp.test;
new rect(100,100,100,100).addCollider();
new line(200,200,300,300);
new line(310,310,330,330)
new rect(300,200,1000,500).addCollider();
new curve([200,0],[400,100]);
new arc(500,100,[50,90],'origin').color = 'red';
new arc(500,100,[50,90],'origin').setArc(1.5);

drawSettings.color = 'purple';
const r1 = new rect(50,250,100,100).addCollider();
r1.color = 'red';
const r2 = new rect(100,300,100,100).addCollider();
r2.color = 'blue';
const r3 = new rect(50,350,100,100).addCollider();

group('test',r1,r2);
group('test2',r2,r3);

setInterval(draw, 20);
var hover = [];
function draw(){
    // setup
    context.clearRect(-workspace.x / workspace.scale,-workspace.y / workspace.scale,canvas.clientWidth / workspace.scale,canvas.clientHeight / workspace.scale);
    hover = [];
    //draw objects
    for (var i = 0; i < objects.length; i++){
        objects[i].draw();
        typeof objects[i]['checkHover'] !== 'undefined' && (objects[i].checkHover());
    }
    document.documentElement.style.cursor = '';
    if (hover.length > 0){
        document.documentElement.style.cursor = 'grabbing';
    }
}

function ranInt(a,b) {
    let min = Math.min(a,b);
    let max = Math.max(a,b);
    if (min == max){
        return(min);
    }
    if (Array.from(arguments).indexOf(undefined) > 0) {
        return(1 - Array.from(arguments).indexOf(undefined)); // only works if 2 arguments are provided
    }
    return(Math.round(Math.random() * (max - min) + min));
}
temp.ar = [];
for(var a = 0; a < 100; a++) {
    for(var b = 0; b < 100; b++) {
        temp.ar.push(new rect(100 + 200 * b,a*200+ 1000,100,100).addCollider());
        temp.ar.push(new rect(200 + 200 * b,a*200+ 1100,100,100).addCollider());
    }
}
group('mega',...temp.ar);