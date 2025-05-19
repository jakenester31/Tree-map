// General
const cnv = document.querySelector('#workspace');
const cnt = cnv.getContext('2d')
const wks = {
    scale:1,
    x:0,
    y:0,
};
var mouse = {
    x:0,
    y:0
}

new ResizeObserver(resizeCanvas).observe(cnv);
function resizeCanvas() {
    cnv.height = cnv.clientHeight;
    cnv.width = cnv.height * (cnv.clientWidth / cnv.clientHeight);
    draw();
}

// Main

cnv.addEventListener('mousedown', e => {
    addEventListener('mousemove', move);
    addEventListener('mouseup', stop);
    let mp = [];
    while (mp.length < 2) {mp.push([e.clientX,e.clientY]);}
    function move(e) {
        mp.shift();
        mp.push([e.clientX,e.clientY]);
        Object.assign(mouse,{x:mp[1][0],y:mp[1][1]})
        wks.x += mp[1][0] - mp[0][0];
        wks.y += mp[1][1] - mp[0][1];
    }
    function stop() {
        removeEventListener('mousemove',move);
        removeEventListener('mouseup',stop);
        console.log('kill');
    }
})


cnv.addEventListener('wheel', e => {
    const dir = -e.deltaY / Math.abs(e.deltaY)
    const old = wks.scale;
    wks.scale+= dir * wks.scale / 10;
    wks.x -= (e.clientX - wks.x) / old * (wks.scale - old);
    wks.y -= (e.clientY - wks.y) / old * (wks.scale - old);
})


setInterval(draw,30);

function draw() {
    // Setup
    cnt.resetTransform();
    cnt.translate(wks.x,wks.y);
    cnt.scale(wks.scale,wks.scale);
    const doc = document.documentElement;
    cnt.clearRect(-wks.x / wks.scale,-wks.y / wks.scale,doc.clientWidth / wks.scale,doc.clientHeight / wks.scale);
    // draw
    cnt.fillRect(100,100,100,100);
}