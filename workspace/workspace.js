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
    document.getElementById("sidebar").innerHTML= mp.join("<br>") + 
    "<br>" + '/' + document.getElementById("sidebar").clientHeight + '/' + "<br>" + 
    JSON.stringify(Workspace) + "<br>" +
    Workspace.scale;

    mouse = {ox:mp[0][0],oy:mp[0][1],x:mp[1][0],y:mp[1][1],gx:mouse.x * Workspace.scale,gy:mouse.y * Workspace.scale};

    // Reposition workspace
    if (Workspace.md == 1){
        Workspace.x += (mouse.x - mouse.ox);
        Workspace.y += (mouse.y - mouse.oy);
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
    Workspace.x += mouse.gx;
    Workspace.y += mouse.gy;
    mouse.gx= mouse.x * Workspace.scale;
    mouse.gy= mouse.y * Workspace.scale;
    resize();
};



function draw () {
    context.clearRect(0,0,workspace.width,workspace.height);
    context.fillRect(Workspace.x,Workspace.y,100,100);
    context.fillRect(mouse.gx,mouse.gy,10,10);
    context.beginPath();
        context.moveTo(...goto(0,0));
        context.lineTo(mouse.x, mouse.y);
    context.stroke();
}

function goto(x,y){
    return([Workspace.x + x * Workspace.scale, Workspace.y + y * Workspace.scale])
}
