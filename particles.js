class Particle{
    constructor(gameWidth,gameHeight){
        this.markedForDeletion=false;
    }
    update(){
        this.x -= this.speedX+ this.speed;
        this.y -= this.speed + this.speed;
        this.size *=0.95;
        if(this.size < 0.5 ) this.markedForDeletion = true;
    }
}


export class Dust extends Particle{
    constructor(x,y){
        super();
        this.size=Math.random() * 10+8;
        this.x=x;
        this.y=y;
        this.speed=1;
        this.speedX = Math.random() * 15;
        this.speedY = 0;
        this.color='white';
    }
    draw(context){
        context.beginPath();
        context.arc(this.x,this.y,this.size,0, Math.PI *2);
        context.fillStyle=this.color;
        context.fill();
    }

}

export class Splash extends Particle{
    
}


export class Fire extends Particle{
    
}