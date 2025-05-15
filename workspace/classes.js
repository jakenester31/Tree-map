// Objects
class rect {
    constructor (x,y,width,height) {
        Object.assign(this,{x:x,y:y,width:width,height:height})
        this.hover = 0;
        this.color = dftSettings.color;
        objects.push(this);
    }
    draw(){
        setColor(this);
        context.fillRect(...goto(this.x,this.y),...size(this.width,this.height));
    }
    outline(){
        context.lineWidth = size(5);
        context.strokeStyle='lime';
        context.beginPath();
            context.moveTo(...goto(this.x,this.y));
            context.lineTo(...goto(this.x + this.width, this.y));
            context.lineTo(...goto(this.x + this.width, this.y + this.height));
            context.lineTo(...goto(this.x, this.y + this.height));
            context.lineTo(...goto(this.x, this.y));
            // size(this.lineWidth) > 0 && context.stroke();
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
        if (!(gPos(mouse[0]).x > this.x && gPos(mouse[0]).x < this.x + this.width)){
            return(0);
        }
        if (gPos(mouse[1]).y > this.y && gPos(mouse[1]).y < this.y + this.height){
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
        context.lineWidth = size(this.lineWidth);
        context.beginPath();
            context.moveTo(...goto(this.x,this.y));
            context.lineTo(...goto(this.x2, this.y2));
            size(this.lineWidth) > 0 && context.stroke();
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
        context.lineWidth = size(this.lineWidth);
        context.beginPath();
            context.moveTo(...goto(...this.point1));
            context.bezierCurveTo(...goto(...this.controller1),...goto(...this.controller2),...goto(...this.point2));
            size(this.lineWidth) > 0 && context.stroke();
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
        context.lineWidth = size(this.lineWidth);
        context.beginPath();
            context.ellipse(...goto(this.x,this.y),...size(...this.radius),0,Math.PI * -this.arcAngle[1], Math.PI * -this.arcAngle[0]);
            size(this.lineWidth) > 0 && context.stroke();
            if (this.fill == 'origin' || this.fill == 'fill') {
                this.fill == 'origin' && context.lineTo(...goto(this.x,this.y));
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