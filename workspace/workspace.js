// General
const canvas = document.querySelector('#workspace');
const context = canvas.getContext("2d");
const workspace = {x:0,y:0,scale:1};
var mouse = {};
const objects = [];
var target;
var tMembers;

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
    target = undefined;
    hover = [];
    for (var i = 0; i < objects.length; i++){
        typeof objects[i]['checkHover'] !== 'undefined' && objects[i].checkHover();
    }
    if(hover.length >= 1) {
        target = hover[hover.length - 1];
        tMembers = getGroupMembers(target);
        let indexes = [];
        for(var i = 0; i < tMembers.length; i++){
            indexes.push(objects.indexOf(tMembers[i]));
        }
        for(var i = 0; i < tMembers.length; i++){
            let smallest = Math.min(...indexes);
            let item = indexes.indexOf(smallest);
            tMembers[item].toFront();
            indexes[item] = Infinity;
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
        // reposition target
        if (target !== undefined){
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
        target = undefined;
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
    workspace.scale < 0.1 && (workspace.scale = 0.1);
    workspace.scale > 7 && (workspace.scale = 7);
    // reposition workspace
    let pos = mouse.x === undefined ? getMouse(e).pk : {x:mouse.x,y:mouse.y};
    workspace.x -= (pos.x - workspace.x) / old * (workspace.scale - old);
    workspace.y -= (pos.y - workspace.y) / old * (workspace.scale - old);
    canvasPos();
});

function getGroupMembers(obj){
    return(allGroups[obj.mainGrp] || [target]);
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
const dftSettings = {
    lineWidth:3,
    color:'skyblue'
};

const temp = {};
const groups = {};
const allGroups = {};
var gId = 0;

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

dftSettings.color = 'purple';
const r1 = new rect(50,250,100,100).addCollider();
r1.color = 'red';
const r2 = new rect(100,300,100,100).addCollider();
r2.color = 'blue';
const r3 = new rect(150,350,100,100).addCollider();

group('test',r1,r2);
group('test2',r2,r3);

setInterval(draw, 20);
var hover = [];
function draw(){
    // setup
    context.clearRect(-workspace.x / workspace.scale,-workspace.y / workspace.scale,canvas.clientWidth / workspace.scale,canvas.clientHeight / workspace.scale);
    //draw objects
    for (var i = 0; i < objects.length; i++){
        objects[i].draw();
    }
    if (typeof target !== 'undefined') {
        for (var i = 0; i < tMembers.length; i++){
            tMembers[i].outline();
        }
    }
}