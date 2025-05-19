// Functions
function group(name,...objs){
    // var setup
    groups[name] = objs;
    let mnGroups = [];
    let indexes = [];
    let target;
    let adding = [];

    // setup new group
    target = gId;
    gId++;
    allGroups[target] = [];

    // Search for all related groups
    for(let item of objs){
        adding.push(item);
        if(typeof item.mainGrp !== 'undefined'){
            mnGroups.push(allGroups[item.mainGrp]);
            indexes.push(item.mainGrp);
        }
    }

    // Get related group members and delete old groups
    for (var i = 0; i < mnGroups.length; i++){
        for(var x = 0; x < mnGroups[i].length; x++){
            adding.push(mnGroups[i][x]);
        }
        console.log(mnGroups[i]);
        delete allGroups[indexes[i]];
    }

    // Add all members to new group
    for(var i = 0; i < adding.length; i++){
        if(allGroups[target].indexOf(adding[i]) > -1){
            return(0);
        }
        allGroups[target].push(adding[i]);
        adding[i].mainGrp = target;
    }
}

// Base Objects
class rect {
    constructor (x,y,width,height) {
        Object.assign(this,{x:x,y:y,width:width,height:height})
        this.hover = 0;
        this.color = dftSettings.color;
        objects.push(this);
    }
    draw(){
        setColor(this);
        context.fillRect(this.x,this.y,this.width,this.height);
    }
    outline(){
        let sz = Math.min(this.width,this.height) / 40;
        context.lineWidth = sz * 2;
        context.strokeStyle='lime';
        context.beginPath();
            context.moveTo(this.x + sz,this.y + sz);
            context.lineTo(this.x + this.width - sz, this.y + sz);
            context.lineTo(this.x + this.width - sz, this.y + this.height - sz);
            context.lineTo(this.x + sz, this.y + this.height - sz);
            context.lineTo(this.x + sz, this.y);
            context.lineWidth > 0 && context.stroke();
        context.closePath();
    }
    addCollider (){
        this.collider = 1;
        return(this);
    }
    toFront (){
        objects.splice(objects.indexOf(this),1);
        objects.push(this);
    }
    checkHover (){
        if (this.collider !== 1){
            return(0);
        }

        this.hover = 0;
        if (!(gPos(mouse.x).x > this.x && gPos(mouse.x).x < this.x + this.width)){
            console.log('bad x');
            return(0);
        }
        if (gPos(mouse.y).y > this.y && gPos(mouse.y).y < this.y + this.height){
            this.hover = 1;
            hover.push(this);
        }
    }
}

class line {
    constructor (x,y,x2,y2) {
        Object.assign(this,{x:x,y:y,x2:x2,y2:y2});
        this.lineWidth = dftSettings.lineWidth;
        this.color = dftSettings.color;
        objects.push(this);
    }
    draw(){
        setColor(this);
        context.lineWidth = this.lineWidth;
        context.beginPath();
            context.moveTo(this.x,this.y);
            context.lineTo(this.x2, this.y2);
            this.lineWidth > 0 && context.stroke();
        context.closePath();
    }
}

class curve {
    constructor(point1,point2,controller1,controller2){
        Object.assign(this,{point1:point1,point2:point2,controller1:controller1,controller2:controller2});
        this.lineWidth = dftSettings.lineWidth;
        this.color = dftSettings.color;
        objects.push(this);
        if (controller1 == 'mid' || controller1 == undefined) {
            this.controller1 = [(point1[0] + point2[0]) / 2,point1[1]]
        }
        if (controller2 == 'mid' || controller2 == undefined) {
            this.controller2 = [(point1[0] + point2[0]) / 2,point2[1]]
        }
    }
    draw(){
        setColor(this);
        context.lineWidth = this.lineWidth;
        context.beginPath();
            context.moveTo(...this.point1);
            context.bezierCurveTo(...this.controller1,...this.controller2,...this.point2);
            this.lineWidth > 0 && context.stroke();
        context.closePath();
    }
}


class arc {
    constructor(x,y,radius,fill){
        Object.assign(this,{x:x,y:y,fill:fill || 0})
        this.lineWidth = dftSettings.lineWidth;
        this.color = dftSettings.color;
        this.arcAngle = [0,2];
        this.radius = [radius,radius];
        if (typeof radius == 'object'){
            this.radius = [...radius];
        }
        objects.push(this);
    }
    draw(){
        setColor(this);
        context.lineWidth = this.lineWidth;
        context.beginPath();
            context.ellipse(this.x,this.y,...this.radius,0,Math.PI * -this.arcAngle[1], Math.PI * -this.arcAngle[0]);
            this.lineWidth > 0 && context.stroke();
            if (this.fill == 'origin' || this.fill == 'fill') {
                this.fill == 'origin' && context.lineTo(this.x,this.y);
                context.fill();
            }
        context.closePath();
    }
    setArc(a = 0,b = 0){
        this.arcAngle = [a,b];
        if (Math.abs(a) > 2) {
            a = 2 * (a / Math.abs(a));
        }
        if (Math.abs(b) > 2) {
            b = 2 * (b / Math.abs(b));
        }
    }
}

function setColor(obj){
    context.strokeStyle = obj.color;
    context.fillStyle = obj.color;
}