class rect {
    constructor (x,y,width,height) {
        Object.assign(this,{x:x,y:y,width:width,height:height})
        objects.push(this);
    }
    draw(){
        context.fillRect(...goto(this.x,this.y),...size(this.width,this.height));
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
        context.closePath();
        context.stroke();
    }
}

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
