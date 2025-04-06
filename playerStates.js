import { Dust,Fire } from "./particles.js";

const states={
    SITTING:0,
    RUNNING:1,
    JUMPING:2,
    FALLING:3,
    ROLLING:4,
    DIVING:5,
    HIT:6
}


class State {
    constructor(state){
        this.state=state=state;
    }
}

export class Sitting extends State{
    constructor(player){
        super('SITTING');
        this.player=player;
    }
    enter(){
        this.player.frameX=0;
        this.player.frameY = 5; 
        this.player.maxFrame = 4;
        
   
      
    }
    handleInput(input){
         if(input.keys.includes('ArrowLeft') || input.keys.includes('ArrowRight') || input.keys.includes('ArrowUp')){
            this.player.setState(states.RUNNING,5);
         }else if(input.keys.includes('Shift')){
            this.player.setState(states.ROLLING,5);
         }
    }
}


export class Running extends State{
    constructor(player){
        super('RUNNING');
        this.player=player;
    }
    enter(){
        this.player.frameX=0;
        this.player.frameY=3;
        this.player.maxFrame=6;
    }
    handleInput(input){
        this.player.particles.unshift(
            new Dust(this.player.x + this.player.width * 0.5, this.player.y + this.player.height)
        );
        
         if(input.keys.includes('ArrowDown')){
            this.player.setState(states.SITTING,0);
         }else if(input.keys.includes('ArrowUp')){
            this.player.setState(states.JUMPING,5);
         }else if(input.keys.includes('Shift')){
            this.player.setState(states.ROLLING,5);
         }
    }
}

export class Jumping extends State {
    constructor(player) {
        super('JUMPING');
        this.player = player;
    }

    enter() {
        if(this.player.onGround()) this.player.vy -=25;
        this.player.frameX=0;
        this.player.maxFrame=6;
        this.player.frameY = 1;
       
    }

    handleInput(input) {
        if (this.player.vy > this.player.weight) {
            this.player.setState(states.FALLING,5); // 
        }else if(input.keys.includes('Shift')){
            this.player.setState(states.ROLLING,5);
         }
    }
}

export class Falling extends State {
    constructor(player) {
        super('FALLING');
        this.player = player;
    }

    enter() {
        this.player.frameX=0;
        this.player.frameY = 2;
        this.player.maxFrame=6;
       
    }
    handleInput(input) {
        if (this.player.onGround()) {
            this.player.setState(states.RUNNING,5); // 
        }
    }

    
}

export class Rolling extends State {
    constructor(player) {
        super('ROLLING');
        this.player = player;
    }

    enter() {
        this.player.frameX=0;
        this.player.frameY = 6;
        this.player.maxFrame=6;
       
    }
    handleInput(input) {
        this.player.particles.unshift(
            new Fire(this.player.x + this.player.width * 0.5, this.player.y + this.player.height*0.5)
        );
        if (!input.keys.includes('Shift') && this.player.onGround()) {
            this.player.setState(states.RUNNING,5); // 
        }else if (!input.keys.includes('Shift') && !this.player.onGround()) {
            this.player.setState(states.FALLING,5); // 
        }else if(input.keys.includes('Shift') && input.keys.includes('ArrowUp') && this.player.onGround()){
            this.player.vy=-25;
        }
    }
}