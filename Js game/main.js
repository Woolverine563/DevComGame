

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const friction = 0.0005;
let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");
let startGame = document.getElementById("start");
let mainMenu = document.getElementById("main");
let pauseMenu = document.getElementById('pause');
pauseMenu.style.display = 'none';
const movement =
{
    'w': 'up',
    's': 'down',
    'a': 'left',
    'd': 'right',
    'b': 'boost',
}

const movementP2 =
{
    'i': 'up',
    'k': 'down',
    'j': 'left',
    'l': 'right',
    'o': 'boost'
}


const GAMESTATE =
{   
    PAUSED: 0,
    RUNNING :1,
    MENU: 2,
    GAME_OVER: 3
    
}

// class MainMenu
// {




// }

class GameManager {
    constructor(gameWidth, gameHeight, ctx) {
        
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameState = GAMESTATE.MENU;
        this.car = new Car(this);

        this.ball = new Ball(this);
        this.IH1 = new InputHandler(this.car, this);
        this.gameObjects = [];

    }


    start() {
        // if(this.gameState !== MENU);
        this.gameState = GAMESTATE.RUNNING;
        this.gameObjects = [this.car, this.ball];
        
    }

    draw(ctx) {
        // if(this.gameState === GAMESTATE.PAUSED)
        // {
        //     ctx.rect(0,0,this.gameWidth,this.gameHeight);
        //     ctx.fillStyle = "rgba(0,0,0,0.5)";
        //     ctx.fill();

        //     ctx.font = "30px Arial";
        //     ctx.fillStyle = "white";
        //     ctx.textAlign = "center";

        //     ctx.fillText("Paused", this.gameWidth/2,this.gameHeight/2);
        // }
        // if(this.gameState === GAMESTATE.MENU)
        // {   
        //     ctx.rect(0,0,this.gameWidth,this.gameHeight);
        //     ctx.fillStyle = "rgba(0,0,0)";
        //     ctx.fill();

        //     // ctx.fillStyle = "grey";
        //     // ctx.fillRect(this.gameWidth/2-100, this.gameHeight/2-100,150,50);
        //     // ctx.font = "30px Arial";
        //     // ctx.fillStyle = "white";
        //     // ctx.textAlign = "center";
            
            

        // }
        this.gameObjects.forEach(object => {
            object.draw(ctx);
        });
    }
    update(deltaTime) {
        if(this.gameState === GAMESTATE.PAUSED || this.gameState === GAMESTATE.MENU) return;

        this.gameObjects.forEach(object => {
            object.update(deltaTime);
        });
        
    }

    toogglePause()
    {
        if(this.gameState == GAMESTATE.PAUSED)
        {   
            pauseMenu.style.display = 'none';
            this.gameState = GAMESTATE.RUNNING;
        }
        else if(this.gameState == GAMESTATE.RUNNING)
        {   
            pauseMenu.style.display = 'flex';
            this.gameState = GAMESTATE.PAUSED;
        }
    }
}

class InputHandler {
    constructor(tank, game) {
        document.addEventListener("keydown", (event) => {
            
           if(event.keyCode == 27) game.toogglePause();
           

            tank.input[movement[event.key]] = true;
            
        }
        );


        document.addEventListener("keyup", (event) => {
            tank.input[movement[event.key]] = false;

        });

        startGame.addEventListener('click',() =>{
            console.log("lol");
            game.start();
            mainMenu.style.display = 'none';
        });
    }
}

// to fix

function collisionHandler(ball, object) {
    let ballLeft = ball.position.x;
    let ballRight = ball.position.x + ball.size;
    let ballTop = ball.position.y;

    let ballBottom = ball.position.y + ball.size;

    let width = object.width;
    let height = object.height;

    let objectLeft = object.position.x - object.width / 2;
    let objectRight = object.position.x + object.width - object.width / 2;
    let objectTop = object.position.y - object.height / 2;
    let objectBottom = object.position.y + object.height - object.height / 2;

    if (Math.abs(Math.cos(object.rotation)) < (1 - Math.abs(Math.cos(object.rotation)))) {
        objectLeft = object.position.x - object.height / 2;
        objectRight = object.position.x + object.height - object.height / 2;
        objectTop = object.position.y - object.width / 2;
        objectBottom = object.position.y + object.width - object.width / 2;

        width = object.height;
        height = object.width;
    }
    let collision = false;
    if(objectLeft< ballRight && objectRight> ballLeft && objectTop< ballBottom&& objectBottom>ballTop)
    {  

        // if(objectLeft+width/2> ballLeft + ball.size/2)
        // {
        //     ball.position.x = objectLeft -ball.size;
        // }
        // if(objectLeft+width/2<= ballLeft + ball.size/2)
        // {
        //     ball.position.x = objectRight;
        // }
        // if(objectTop+height/2 < ballTop + ball.size/2)
        // {
        //     ball.position.y = objectBottom;
        // }
        // if(objectTop+height/2 > ballTop + ball.size/2)
        // {
        //     ball.position.y = objectTop - ball.size;
        // }

        collision = true;
    }


    else{
        collision = false;
    }
    return collision;

}


function collisionHandlerBetweenWallsTank(object) {
    let objectLeft = object.position.x - object.width / 2;
    let objectRight = object.position.x + object.width - object.width / 2;
    let objectTop = object.position.y - object.height / 2;
    let objectBottom = object.position.y + object.height - object.height / 2;

    let objectLeft90 = object.position.x - object.height / 2;
    let objectRight90 = object.position.x + object.height - object.height / 2;
    let objectTop90 = object.position.y - object.width / 2;
    let objectBottom90 = object.position.y + object.width - object.width / 2;
     
    let width = object.width;
    let height = object.height;

    
    if (Math.abs(Math.cos(object.rotation)) < (1 - Math.abs(Math.cos(object.rotation)))) {
        objectLeft = objectLeft90;
        objectRight = objectRight90;
        objectTop = objectTop90;
        objectBottom = objectBottom90;
        width = object.height;
        height = object.width
        
    }
    
        if (objectRight > GAME_WIDTH) {
            object.speed = 0;
            object.velocity.x = -object.velocity.x;
            object.velocity.y = object.velocity.y;
            object.position.x = GAME_WIDTH - width / 2;
            object.disableInput = true;
        }
        if (objectLeft < 0) {
            object.speed = 0;
            object.velocity.x = -object.velocity.x;
            object.velocity.y = object.velocity.y;
            object.position.x = 0 + width / 2;
            object.disableInput = true;
        }
        if (objectBottom > GAME_HEIGHT) {
            object.position.y = GAME_HEIGHT - height / 2;
            object.velocity.x = object.velocity.x;
            object.velocity.y = -object.velocity.y;
            object.disableInput = true;
            object.speed = 0
        }
        if (objectTop < 0) {
            object.position.y = height / 2;
            object.velocity.x = object.velocity.x;
            object.velocity.y = -object.velocity.y;
            object.speed = 0;
            object.disableInput = true;
        }
    
}
function collisionHandlerBetweenWallsBall(ball) {

    let ballLeft = ball.position.x;
    let ballRight = ball.position.x + ball.size;
    let ballTop = ball.position.y;
    let ballBottom = ball.position.y + ball.size;

    if (ballRight > GAME_WIDTH) {
        ball.velocity.x = - 0.80*ball.velocity.x;
        ball.position.x = GAME_WIDTH - ball.size;
    }
    if (ballLeft < 0) {
        ball.velocity.x = -  0.80*ball.velocity.x;
        ball.position.x = 0;
    }
    if (ballBottom > GAME_HEIGHT) {
        ball.velocity.y = -  0.80*ball.velocity.y;
        ball.position.y = GAME_HEIGHT - ball.size;
    }
    if (ballTop < 0) {
        ball.velocity.y = -  0.80*ball.velocity.y;
        ball.position.y = 0;
    }

}



// class Projectile
// {
//     constructor(tank)
//     {   

//         this.projectile = document.getElementById("projectile");

//         this.width = 10;
//         this.height = 10;
//         this.speed = 5;
//         this.velocity= 
//         {
//             x: this.speed*Math.cos(tank.rotation),
//             y:this.speed*Math.sin(tank.rotation)
//         }

//         this.position =
//         {
//             x: tank.position.x,
//             y: tank.position.y,
//         }
//     }

//         draw(ctx)
//         {
//             ctx.drawImage(this.projectile,this.position.x, this.position.y,this.width,this.height);

//         }

//         updateInitialPosition()
//         {

//         }

//         update(deltaTime)
//         {
//             this.position.x += this.velocity.x;
//             this.position.y += this.velocity.y;

//             // console.log(tank.rotation);
//         }


// }



class Ball {


    constructor(game) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.game = game;
        this.mass = 10;
        this.size = 0.75*25;
        this.friction = 0.0001;
        this.position
            =
        {
            x: 300,
            y: 300,
        };
        this.ball = document.getElementById("projectile");
        this.speed = 0;
        this.velocity =
        {
            x: 0,
            y: 0
        };


    }

    draw(ctx) {

        ctx.drawImage(this.ball, this.position.x, this.position.y, this.size, this.size);
    }

    update(deltaTime) {
        this.speed = Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
        
        
        if (collisionHandler(this, this.game.car)) {
            if (this.game.car.speed !== 0) {
                this.speed = 2 * this.game.car.speed;

                game.car.speed = 0;
                this.velocity.x = this.speed * Math.cos(this.game.car.rotation);
                this.velocity.y = this.speed * Math.sin(this.game.car.rotation);
            }
            else {
                this.velocity.x = - 0.80*this.velocity.x;
                this.velocity.y = - 0.80*this.velocity.y;
            }
        }

        collisionHandlerBetweenWallsBall(this);
        
            
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

        

    }



}

class Car {

    constructor(game) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.input = {

            up: false,
            down: false,
            left: false,
            right: false,
            boost: false,
        }

        // this.a = new Vector2(0, 0);
        // this.b = new Vector2(0, 0);
        // this.c = new Vector2(0, 0);
        // this.d = new Vector2(0, 0);
        // this.vertices =
        //     [
        //         this.a, this.b, this.c, this.d

        //     ];

       this.disableInput = false;
        this.disableInputDuration =0;

        this.mass = 5;
        this.hasFired = false;

        this.width = 0.75*50;

        this.height = 0.75*25;

        // this.angle = Math.atan2(this.height,this.width);    
        // this.halfDiag = Math.sqrt(Math.pow(this.width/2,2)+Math.pow(this.height/2,2));

        this.angularSpeed = 0.05;

        this.tank = document.getElementById("tank");
        this.position =
        {
            x: 400,
            y: 300
        }
        this.rotation = 0;
        this.maxSpeed = 2;
        this.speed = 0;

        this.maxAcc = 0.01;
        this.currentAcc = 0;
        this.acceleration =
        {
            x: 0,
            y: 0
        };
        this.velocity =
        {
            x: 0,
            y: 0
        }
        this.boostTime = 0;
        

    }

    // updateVertices()
    // {
    //     this.vertices[1].x =this.halfDiag*Math.cos(this.rotation-this.angle);
    //     this.vertices[2].x = this.halfDiag*Math.cos(this.rotation+ this.angle);
    // }

    updateVelocity() {
        if(!this.disableInput)
        {
        if (this.input.up == true &&!this.input.boost) {
            
            
            this.speed = this.maxSpeed;
                
            
            
        }
        else if(this.input.boost &&this.boostTime<3000 )
        {
            this.speed = this.maxSpeed*3;
            
        }
        else if (this.input.down == true) {
            
            this.speed = -this.maxSpeed;
            
        }
        else if (this.input.up == false && this.input.down == false) {
            this.speed = 0;
        }
        this.velocity.x = this.speed * Math.cos(this.rotation);
        this.velocity.y = this.speed * Math.sin(this.rotation);
        }
    }

    determineRotation() {
        if (this.input.left) {
            if (this.input.down) {
                this.rotation += this.angularSpeed;

            }
            else if (this.input.up || this.input.boost) {
                this.rotation -= this.angularSpeed;
            }
        }
        else if (this.input.right) {
            if (this.input.down || this.input.boost) {
                this.rotation -= this.angularSpeed;

            }
            else if (this.input.up) {
                this.rotation += this.angularSpeed;
            }
        }
    }



    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(tank, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    update(deltaTime) {
        if(this.disableInput)
        {  
            this.disableInputDuration += deltaTime;
        }
        if(this.disableInputDuration > 300)
        {   console.log(this.disableInputDuration);
            this.disableInputDuration =0;
            this.disableInput = false;
        }
        if(this.input.boost)
        {
            this.boostTime += deltaTime;
            console.log(this.boostTime);
        }
        if(this.boostTime>0 && !this.input.boost)
        {
            this.boostTime -= deltaTime;
        }
        this.updateVelocity();
        this.determineRotation();



        // if(this.speed<this.maxSpeed){
        // this.speed += this.currentAcc;
        // this.velocity.x += this.acceleration.x;
        // this.velocity.y += this.acceleration.y;
        // }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // console.log(this.speed* Math.cos(this.rotation));
        // console.log(this.speed* Math.sin(this.rotation));

        collisionHandlerBetweenWallsTank(this);
       
    }


}

game = new GameManager(GAME_WIDTH, GAME_HEIGHT, ctx);



let lastTime = 0;


function gameLoop(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    game.update(deltaTime);
    game.draw(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);