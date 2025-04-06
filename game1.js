/** @type {HTMLCanvasElement} */
/** @type {CanvasRenderingContext2D} */



import {Sitting,Running,Jumping,Falling,Rolling} from './playerStates.js';
import {flyingEnemy,groundEnemy,climbingEnemy} from './enemy.js';
import { Dust,Fire } from './particles.js';

window.addEventListener('load',function(){
    const canvas=this.document.getElementById("canvas1");
    const ctx=canvas.getContext('2d');
    canvas.width=800;
    canvas.height=680;
    let enemies=[];
    let score = { value: 0 };
    let highScore=0;
    let gameOver=false;


    class InputHandler{
        constructor(){
            this.keys=[];
            window.addEventListener('keydown',e=>{
                 if ((e.key === "ArrowDown" || 
                    e.key==="ArrowUp" || 
                    e.key==="ArrowLeft" || 
                    e.key==="ArrowRight" ||
                    e.key==="Shift"
                )
                    
                    && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
                console.log(e.key,this.keys);
            });
            window.addEventListener('keyup',e=>{
                 if (e.key === "ArrowDown" ||
                    e.key==="ArrowUp" || 
                    e.key==="ArrowLeft" || 
                    e.key==="ArrowRight" ||
                    e.key==="Shift"
                  ) {
                this.keys.splice(this.keys.indexOf(e.key),1);
            }
                console.log(e.key,this.keys);
            });
        }
    }
    
    
    
    class Player{
        constructor(gameWidth,gameHeight){
            this.gameWidth=gameWidth;
            this.gameHeight=gameHeight-20;
            this.width=100;
            this.height=91.3;
            this.x=0;
            this.y=this.gameHeight-this.height;
            this.image=document.getElementById('playerImage');
            this.frameX=0;
            this.frameY=0;
            this.speed=0;
            this.vy=0;
            this.weight=1;
            this.maxFrame=5;
            this.maxParticles=100;
            this.fps=50;
            this.frameTimer=0;
            this.farmeInterval=1000/this.fps;
            this.states=[new Sitting(this),new Running(this),new Jumping(this),new Falling(this),new Rolling(this)];
            this.currentState=this.states[0];
            this.currentState.enter();
            this.particles = [new Dust(this.x,this.y),new Fire(this.x,this.y)];
        }
        draw(context){
            this.particles.forEach(particles=>{
                particles.draw(context);
            })
            // context.fillStyle="white";
            // context.fillRect(this.x,this.y,this.width,this.height);
            context.beginPath();
            // context.arc(this.x+this.width/2,this.y+this.height/2,this.width/2,0,Math.PI*2);
            // context.stroke();
            // context.strokeRect(this.x,this.y,this.width,this.height);
            // context.strokeStyle="white";
            context.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width,this.height,this.x,this.y,this.width,this.height);

        }
        update(input,deltaTime,enemies){
            this.currentState.handleInput(input);
            enemies.forEach(enemy=>{
                const dx = (enemy.x + enemy.width / 2) - (this.x + this.width / 2);
                const dy = (enemy.y + enemy.height / 2) - (this.y + this. height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
    
                const playerRadius = this.width / 2 * 0.7;
                const enemyRadius = enemy.width / 2 * 0.7;
    
                if (distance < playerRadius +enemyRadius) {
                     gameOver = true;                
                }

            });
            if(this.frameTimer > this.farmeInterval){
                if(this.frameX >= this.maxFrame) this.frameX=0;
                else this.frameX++;
                this.frameTimer=0;
            }else{
                this.frameTimer+=deltaTime;
            }
            
            if(input.keys.indexOf("ArrowRight") >- 1){
                this.speed=5;
            }else if(input.keys.indexOf("ArrowLeft") >- 1){
                this.speed=-5;
            }else if(input.keys.indexOf("ArrowUp") >- 1 && this.onGround()){
                this.vy=-25;
            }
            else{
                this.speed=0;
            }
            this.x+=this.speed;
            this.y+=this.vy;
            if(this.x<0) this.x=0;
            else if(this.x >this.gameWidth- this.width) this.x=this.gameWidth- this.width;
            if(!this.onGround()){
                this.vy+=this.weight;
                this.maxFrame=6;
            }
            if(this.y> this.gameHeight-this.height){
                this.y=this.gameHeight-this.height
            }

            this.particles.forEach((particle,index)=>{
                particle.update();
                if(particle.markedForDeletion){
                    this.particles.splice(index,1);
                }
            });
            if(this.particles.length>this.maxParticles){
                this.particles=this.particles.slice(0,this.maxParticles);
            }
            
            
        }
        onGround(){
            return this.y >= this.gameHeight - this.height;
        }
        setState(state,speed){
            this.currentState=this.states[state];
            this.currentState.enter();
            this.speed=speed;
            background.speed = speed;
        }
    }

    class Background{
        constructor(gameWidth,gameHeight){
            this.gameWidth=gameWidth;
            this.gameHeight=gameHeight;
            this.image=document.getElementById("backgroundImage");
            this.width=2400;
            this.height=720;
            this.x=0;
            this.y=0;
            this.speed=0;
            this.enemies=[];
            
        }
        draw(context){
            context.drawImage(this.image,this.x,this.y,this.width,this.height);
            context.drawImage(this.image,this.x+this.width-this.speed-1,this.y,this.width,this.height);
            this.enemies.forEach(enemy=>{
                enemy.draw(context);
            })
        }
        update(deltaTime){
            this.x-=this.speed;
            if(this.x<0-this.width){
                this.x=0;
            }
            if(this.enemyTimer>this.enemyInterval){
                this.addEnemy();
                this.enemyTimer=0;
            }else{
                this.enemyTimer+=deltaTime;
            }
            this.enemies.forEach(enemy=>{
                enemy.update(deltaTime);
            })

        }
        
    }

    
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
        update(deltaTime){
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

    const input=new InputHandler();
    const background=new Background(canvas.width,canvas.height);
    const player=new Player(canvas.width,canvas.height);
    const enemy=new Enemy(canvas.width,canvas.height);

    let lastTime=0;
    let enemyTimer=0;
    let enemyInterval=1000;
    let randomEnemyInterval=Math.random()*1000+500;
    
    
    // enemies.push(new Enemy(canvas.width,canvas.height));
    function handleEnemies(deltaTime){
        if(enemyTimer> enemyInterval+randomEnemyInterval){
            const randomSpawn = Math.random();
            if(randomSpawn < 0.3){
                enemies.push(new Enemy(canvas.width, canvas.height)); 
            }else if(randomSpawn > 0.3 && randomSpawn < 0.4){
                enemies.push(new flyingEnemy(canvas.width, canvas.height));
            } else if(randomSpawn > 0.4 && randomSpawn < 0.7){
                enemies.push(new groundEnemy(canvas.width, canvas.height));
            }
            else {
                enemies.push(new climbingEnemy(canvas.width, canvas.height)); 
            }
            randomEnemyInterval=Math.random()*1000+500;
            enemyTimer=0;
        }else{
            enemyTimer+=deltaTime;
        }
        enemies.forEach(enemy=>{
            enemy.draw(ctx);
            enemy.update(deltaTime,score);
        });
        enemies=enemies.filter(enemy=>!enemy.markedForDeletion);
    }
    
    function displayStatusText(context){
        context.fillStyle="white";
        context.font="30px helvetica";
        context.textAlign="left";
        context.fillText("Score: " + score.value, 50, 50);
        if(score.value>=highScore) highScore=score.value;
        if(gameOver){
            context.fillStyle="white";
            context.textAlign="center";
            context.fillText("Game Over Your Score: "+score.value,canvas.width/2,canvas.height/2-100);
            context.fillText("Highest Score: "+highScore,canvas.width/2,canvas.height/2-70);
           
        }
    }

    function restart(){
        score = { value: 0 };
        enemies=[];
        gameOver=false;
        player.x=0;
        player.y=canvas.height-player.height;
        animate(0);
    }

    this.window.addEventListener('keydown',(e)=>{
        if(gameOver && e.key==="Enter"){
            restart();
        }
    })
    
    function animate(timeStamp){
        const deltaTime= timeStamp - lastTime;
        lastTime=timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height)
        background.draw(ctx);
        background.update();
        player.draw(ctx);
        player.update(input,deltaTime,enemies);
        handleEnemies(deltaTime);
        displayStatusText(ctx);
        if(!gameOver) {
            requestAnimationFrame(animate);
        }else{
            window.addEventListener('click', () => {
                if (gameOver) {
                    restart();
                }
            });
        }
    
    }
    animate(0);

});


