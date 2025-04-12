//Setup workspace
var context = workspace.getContext("2d");
var mp = [[0,0],[0,0]];
setInterval(draw,5);
//General
var Workspace = {x:0,y:0,md:0,scale:1};
var mouse = {x:0,y:0,ox:0,oy:0,gx:0,gy:0};

// Fixes the aspect ratio
new ResizeObserver(resize).observe(workspace);
function resize() {
    workspace.height = workspace.clientHeight * Workspace.scale;
    workspace.width = workspace.height * (workspace.clientWidth / workspace.clientHeight);
    draw();
}

// When the mouse is moving over workspace
workspace.addEventListener('mousemove',(event) => {
    // Get mouse positions
    mp.splice(0,1); //removes the old old item
    mp.push([
        event.clientX - document.getElementById('sidebar').clientWidth,
        event.clientY - document.getElementById('head').clientHeight
    ]);
    // TEST SCRIPT, [DELETE ME]
    mouse.gx= mouse.x * Workspace.scale - Workspace.x;
    mouse.gy= mouse.y * Workspace.scale - Workspace.y;
    mouse = {ox:mp[0][0],oy:mp[0][1],x:mp[1][0],y:mp[1][1],gx:mouse.gx,gy:mouse.gy};

    // Reposition workspace
    if (Workspace.md == 1){
        Workspace.x += (mouse.x - mouse.ox) * Workspace.scale;
        Workspace.y += (mouse.y - mouse.oy) * Workspace.scale;
    }
});

// mouse down and up
workspace.addEventListener('mousedown', (event) => {
    Workspace.md = 1;
});

addEventListener('mouseup', (event) => {
    Workspace.md = 0;
});


//Scrolling
onwheel = (event) => {
    let oldscale = Workspace.scale;
    event.deltaY < 0 && (Workspace.scale -= Workspace.scale / 10);
    event.deltaY > 0 && (Workspace.scale += Workspace.scale / 10);
    Workspace.x += mouse.x * (Workspace.scale - oldscale);
    Workspace.y += mouse.y * (Workspace.scale - oldscale);
    resize();
};



function draw () {
    context.clearRect(0,0,workspace.width,workspace.height);
    context.fillRect(Workspace.x,Workspace.y,100,100);
    // 0,0 to mouse
    context.beginPath();
        context.moveTo(...goto(0,0));
        context.lineTo(mouse.x * Workspace.scale, mouse.y * Workspace.scale);
    context.stroke();
    // 0,0 to 200,100
    context.beginPath();
        context.moveTo(...goto(0,0));
        context.lineTo(200 + Workspace.x,100 + Workspace.y);
    context.stroke();
}

function goto(x,y){
    return([Workspace.x + x, Workspace.y + y])
}
