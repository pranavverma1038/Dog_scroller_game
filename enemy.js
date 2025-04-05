class Enemy{
    constructor(gameWidth,gameHeight){
        this.gameWidth=gameWidth;
        this.gameHeight=gameHeight;
        this.image=document.getElementById("enemyImage");
        this.width=160;
        this.height=119;
        this.x = this.gameWidth;  
        this.y = this.gameHeight-this.height;
        this.frameX=0;
        this.maxFrame=5;
        this.fps=20;
        this.frameTimer=0;
        this.farmeInterval=1000/this.fps;
        this.speed=8;
        this.markedForDeletion=false;
    }
    draw(context){
        // context.strokeRect(this.x,this.y,this.width,this.height);
        // context.strokeStyle="white";
        // context.beginPath();
        // context.arc(this.x+this.width/2,this.y+this.height/2,this.width/2,0,Math.PI*2);
        // context.stroke();
        context.drawImage(this.image,this.frameX*this.width,0,this.width,this.height,this.x,this.y,this.width,this.height);
    }
    update(deltaTime,score){
        if(this.frameTimer > this.farmeInterval){
            if(this.frameX >= this.maxFrame) this.frameX=0;
            else this.frameX++;
            this.frameTimer=0;
        }else{
            this.frameTimer+=deltaTime;
        }
        
        this.x -= this.speed;
        if(this.x < 0 - this.width){
            this.markedForDeletion=true;
            score.value++;
        }
        
    }

}

export class flyingEnemy extends Enemy{
        constructor(gameWidth, gameHeight){
            super(gameWidth, gameHeight);
            
            this.width=60;
            this.height=44;
            this.x=gameWidth;
            this.y=Math.random() * (gameHeight*0.5);
            this.speed=10;
            this.maxFrame=5;
            this.image=document.getElementById('enemy_fly');
            this.angle=0;
            this.va=Math.random()*0.1+0.1;

        }
        update(deltaTime,score){
            super.update(deltaTime,score);
            this.angle+=this.va;
            this.y+=Math.sin(this.angle);
             
           
        }
}

export class groundEnemy extends Enemy{
    constructor(gameWidth, gameHeight){
        super(gameWidth, gameHeight);
        
        this.width=60;
        this.height=87;
        this.x=gameWidth;
        this.y=gameHeight-this.height-20;
        this.speed=5;
        this.speedX=0;
        this.speedY=0;
        this.maxFrame=1;
        this.image=document.getElementById('enemy_plant');
        
    }
    update(deltaTime,score){
        super.update(deltaTime,score);
        
    }
    
   

}

export class climbingEnemy extends Enemy{
    constructor(gameWidth, gameHeight){
        super(gameWidth, gameHeight);
        
        this.width=120;
        this.height=144;
        this.x=gameWidth;
        this.y=Math.random() * (gameHeight*0.5);
        this.speed=5;
        this.speedX=0;
        this.speedY=Math.random()> 0.5 ?1 : -1;
        this.maxFrame=5;
        this.image=document.getElementById('enemy_spider');
        
    }
    update(deltaTime,score){
        super.update(deltaTime,score);
        this.y += this.speedY;

        
        if (this.y < 0 || this.y > this.gameHeight - this.height) {
            this.speedY *= -1;
        }
        
    }
    draw(context){
        super.draw(context);
        context.beginPath();
        context.moveTo(this.x+this.width/2,0);
        context.lineTo(this.x+this.width/2,this.y+50);
        context.stroke();
    }
}

