// Settings
class lineWidth {
    constructor (width) {
        this.width = width;
        objects.push(this);
    }
    draw() {
        context.lineWidth = size(this.width);
    }
}

class color {
    constructor (color) {
        this.color = color;
        objects.push(this);
    }
    draw (){
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
    }
}

// Objects
class rect {
    constructor (x,y,width,height) {
        Object.assign(this,{x:x,y:y,width:width,height:height})
        this.hover = 0;
        objects.push(this);
    }
    draw(){
        context.fillRect(...goto(this.x,this.y),...size(this.width,this.height));
        
        if (this.collider != 1){
            return(0);
        }
        this.hover = 0;

        if (workspace.md != 1) {
            return(0);
        }
        if (!(gPos(mouse[0]).x > this.x && gPos(mouse[0]).x < this.x + this.width)){
            return(0);
        }
        if (gPos(mouse[1]).y > this.y && gPos(mouse[1]).y < this.y + this.height){
            this.hover = 1;
            over.push(this);
        }
    }
    outline(){
        const save = context.lineWidth
        context.lineWidth = size(5);
        context.strokeStyle='lime';
        context.beginPath();
            context.moveTo(...goto(this.x,this.y));
            context.lineTo(...goto(this.x + this.width, this.y));
            context.lineTo(...goto(this.x + this.width, this.y + this.height));
            context.lineTo(...goto(this.x, this.y + this.height));
            context.lineTo(...goto(this.x, this.y));
            context.stroke();
        context.closePath();
        context.lineWidth = size(save);
    }
    addCollider () {
        this.collider = 1;
    }
}

class line {
    constructor (x,y,x2,y2) {
        Object.assign(this,{x:x,y:y,x2:x2,y2:y2});
        objects.push(this);
    }
    draw(){
        context.beginPath();
            context.moveTo(...goto(this.x,this.y));
            context.lineTo(...goto(this.x2, this.y2));
            context.stroke();
        context.closePath();
    }
}

class curve {
    constructor(point1,point2,controler1,controler2){
        Object.assign(this,{point1:point1,point2:point2,controler1:controler1,controler2:controler2});
        objects.push(this);
        if (controler1 == 'mid' || controler1 == undefined) {
            this.controler1 = [(point1[0] + point2[0]) / 2,point1[1]]
        }
        if (controler2 == 'mid' || controler2 == undefined) {
            this.controler2 = [(point1[0] + point2[0]) / 2,point2[1]]
        }
    }
    draw(){
        context.beginPath();
            context.moveTo(...goto(...this.point1));
            context.bezierCurveTo(...goto(...this.controler1),...goto(...this.controler2),...goto(...this.point2));
            context.stroke();
        context.closePath();
    }
}


class arc {
    constructor(x,y,radius,fill){
        Object.assign(this,{x:x,y:y,radius:radius,fill,fill})
        objects.push(this);
    }
    draw(){
        context.beginPath();
            context.arc(...goto(this.x,this.y),size(this.radius),Math.PI * -arcAngle[1], Math.PI * -arcAngle[0]);
            this.fill == 1 && context.fill();
            context.stroke();
        context.closePath();
    }
}

class setArc {
    constructor(angle1,angle2){
        Object.assign(this,{angle1:angle1,angle2:angle2})
        objects.push(this);
    }
    draw(){
        arcAngle = [this.angle1,this.angle2];
        if (Math.abs(this.angle1) > 2) {
            this.angle1 = 2 * (this.angle1 / Math.abs(this.angle1));
        }
        if (Math.abs(this.angle2) > 2) {
            this.angle2 = 2 * (this.angle2 / Math.abs(this.angle2));
        }
    }
}