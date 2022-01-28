

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const friction = 0.0005;

let canvas = document.getElementById("gameScreen");

let ctx = canvas.getContext("2d");
let startGame = document.getElementById("start");
let mainMenu = document.getElementById("main");
let settings = document.getElementById("settings");

let settingsMenu = document.getElementById("settingsMenu");
let returnToMenuButton2 = document.getElementById('goback2')

let pauseMenu = document.getElementById('pause');
let returnToMenuButton = document.getElementById('goback')
pauseMenu.style.display = 'none';
settingsMenu.style.display = 'none';

let car1img = document.getElementById("tank");
let car2img = document.getElementById("tank2");




const movementP1 =
{
    'w': 'up',
    's': 'down',
    'a': 'left',
    'd': 'right',
    'e': 'boost',
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
    RUNNING: 1,
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
        this.car = new Car(this, car1img);
        this.car2 = new Car(this, car2img);
        this.car2.position.x = 100;

        this.ball = new Ball(this);
        this.IH1 = new InputHandler(this);
        this.particle = new Particle(400, 300,)
        this.startReset = false;
        this.countdown = 0;

        this.calledOnce = false;

        this.gameObjects = [];

        this.particles = [];

    }

    reset() {
        this.gameState = GAMESTATE.MENU;
        mainMenu.style.display = 'flex';
        pauseMenu.style.display = 'none';
        this.car = new Car(this, car1img);
        this.car2 = new Car(this, car2img);
        this.car2.position.x = 100;
        this.ball = new Ball(this);
        this.IH1.car = this.car;
        this.IH1.car2 = this.car2;
        this.gameObjects = [];
        this.calledOnce = false;
        this.particles = [];

    }
    resetToStart() {
        this.car = new Car(this, car1img);
        this.car2 = new Car(this, car2img);
        this.car2.position.x = 100;
        this.ball = new Ball(this);
        this.IH1.car = this.car;
        this.IH1.car2 = this.car2;
        this.gameObjects = [];
        this.particles = [];
        this.calledOnce = false;
        game.start();
    }
    start() {
        // if(this.gameState !== MENU);
        this.gameState = GAMESTATE.RUNNING;
        this.gameObjects = [this.car, this.car2, this.ball];

    }

    draw(ctx) {

        this.gameObjects.forEach(object => {
            object.draw(ctx);
        });

        this.particles.forEach((object) => {

            object.draw(ctx);
        });

    }
    update(deltaTime) {
        if (this.gameState === GAMESTATE.PAUSED || this.gameState === GAMESTATE.MENU) return;

        this.gameObjects.forEach(object => {

            object.update(deltaTime);
        });
        this.particles.forEach((object, index) => {
            if (object.alpha <= 0) {
                console.log(index);

                this.particles.splice(index, 1);
            }
            else {
                // console.log(this.particles.length);

                object.update(deltaTime);
            }


        });
        if (collisionHandlerBetweenTanks(game.car, game.car2)) {
            this.car.disableInput = true;
            this.car2.disableInput = true;
            let carVx = this.car.velocity.x;
            let carVy = this.car.velocity.y;
            this.car.velocity.x = this.car2.velocity.x;
            this.car.velocity.y = this.car2.velocity.y;
            this.car2.velocity.x = carVx;
            this.car2.velocity.y = carVy;


        }
        if (this.startReset) {


            this.countdown += deltaTime;
            if (this.countdown > 3000) {
                this.resetToStart();
                this.startReset = false;
                this.countdown = 0
            }

        }

    }
    //f
    togglePause() {
        if (this.gameState == GAMESTATE.PAUSED) {
            pauseMenu.style.display = 'none';
            this.gameState = GAMESTATE.RUNNING;
        }
        else if (this.gameState == GAMESTATE.RUNNING) {
            pauseMenu.style.display = 'flex';
            this.gameState = GAMESTATE.PAUSED;
        }
    }
}

class InputHandler {
    constructor(game) {
        this.car = game.car;
        this.car2 = game.car2;
        document.addEventListener("keydown", (event) => {

            if (event.keyCode == 27) game.togglePause();


            this.car.input[movementP1[event.key]] = true;
            this.car2.input[movementP2[event.key]] = true;

        }
        );


        document.addEventListener("keyup", (event) => {
            this.car.input[movementP1[event.key]] = false;
            this.car2.input[movementP2[event.key]] = false;

        });

        settings.addEventListener('click', () => {


            mainMenu.style.display = 'none';

            settingsMenu.style.display = 'flex';
        });
        startGame.addEventListener('click', () => {

            game.start();
            mainMenu.style.display = 'none';
        });
        returnToMenuButton2.addEventListener('click', () => {

            mainMenu.style.display = 'flex';

            settingsMenu.style.display = 'none';

        });
        returnToMenuButton.addEventListener('click', () => {

            game.reset();

        });


    }
}



function projections_intersect(object1, object2) {
    let relative_angle = object2.rotation - object1.rotation;
    let angle1 = object1.rotation;
    let sep_x = object2.position.x - object1.position.x;
    let sep_y = object2.position.y - object1.position.y;
    let sep_width = sep_x * Math.cos(angle1) + sep_y * Math.sin(angle1);
    let sep_height = -sep_x * Math.sin(angle1) + sep_y * Math.cos(angle1);

    let w1 = object2.width * Math.cos(relative_angle) / 2 + object2.height * Math.sin(relative_angle) / 2;
    let w2 = object2.width * Math.cos(relative_angle) / 2 - object2.height * Math.sin(relative_angle) / 2;
    let h1 = object2.width * Math.sin(relative_angle) / 2 - object2.height * Math.cos(relative_angle) / 2;
    let h2 = object2.width * Math.sin(relative_angle) / 2 + object2.height * Math.cos(relative_angle) / 2;

    let w_max = Math.max(w1, -w1, w2, -w2);
    let w_min = Math.min(w1, -w1, w2, -w2);
    let projection_w = !((sep_width + w_min > object1.width / 2) || (sep_width + w_max < -object1.width / 2));

    let h_max = Math.max(h1, -h1, h2, -h2);
    let h_min = -h_max;
    let projection_h = !((sep_height + h_min > object1.height / 2) || (sep_height + h_max < -object1.height / 2));

    return (projection_h && projection_w);
}

function collisionHandlerBetweenTanks(object1, object2) {
    return (projections_intersect(object1, object2) && projections_intersect(object2, object1));
}

// to fix

function collisionHandler(ball, object) {
    let ball_x = ball.position.x + ball.size / 2;
    let ball_y = ball.position.y + ball.size / 2;
    let car_x = object.position.x;
    let car_y = object.position.y;
    let theta = object.rotation;

    let sep_along_width = (ball_x - car_x) * Math.cos(theta) + (ball_y - car_y) * Math.sin(theta);
    let sep_along_height = (ball_x - car_x) * Math.sin(theta) - (ball_y - car_y) * Math.cos(theta)

    let collision_on_width = false;
    let collision_on_height = false
    if (Math.abs(sep_along_height) < object.height / 2 + ball.size / 2 && Math.abs(sep_along_width) < object.width / 2 + ball.size / 2) {

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

        if
            (Math.abs(-Math.abs(sep_along_height) + object.height / 2 + ball.size / 2)
            < Math.abs(-Math.abs(sep_along_width) + object.width / 2 + ball.size / 2))
            return ('w');
        else return ('h');
    }


    else {
        return false;
    }
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

        object.velocity.x = -0.8 * object.velocity.x;
        object.velocity.y = 0.8 * object.velocity.y;
        object.position.x = GAME_WIDTH - width / 2;
        object.disableInput = true;
    }
    if (objectLeft < 0) {

        object.velocity.x = -0.8 * object.velocity.x;
        object.velocity.y = 0.8 * object.velocity.y;
        object.position.x = 0 + width / 2;
        object.disableInput = true;
    }
    if (objectBottom > GAME_HEIGHT) {
        object.position.y = GAME_HEIGHT - height / 2;
        object.velocity.x = 0.8 * object.velocity.x;
        object.velocity.y = -0.8 * object.velocity.y;
        object.disableInput = true;

    }
    if (objectTop < 0) {
        object.position.y = height / 2;
        object.velocity.x = 0.8 * object.velocity.x;
        object.velocity.y = -0.8 * object.velocity.y;

        object.disableInput = true;
    }

}
function collisionHandlerBetweenWallsBall(ball) {

    let ballLeft = ball.position.x;
    let ballRight = ball.position.x + ball.size;
    let ballTop = ball.position.y;
    let ballBottom = ball.position.y + ball.size;
    let r = String(Math.floor(Math.random() * 255));
    let g = String(Math.floor(Math.random() * 255));
    let b = String(Math.floor(Math.random() * 255));
    let str = "rgb("

    if (ballRight > GAME_WIDTH && !(ballTop >= 200 && ballBottom <= 400)) {
        ball.velocity.x = - 0.80 * ball.velocity.x;
        ball.position.x = GAME_WIDTH - ball.size;
    }
    if (ballLeft < 0 && !(ballTop >= 200 && ballBottom <= 400)) {
        ball.velocity.x = -  0.80 * ball.velocity.x;
        ball.position.x = 0;
    }
    if (ballBottom > GAME_HEIGHT) {
        ball.velocity.y = -  0.80 * ball.velocity.y;
        ball.position.y = GAME_HEIGHT - ball.size;
    }
    if (ballTop < 0) {
        ball.velocity.y = -  0.80 * ball.velocity.y;
        ball.position.y = 0;
    }
    if (ballRight > GAME_WIDTH && (ballTop >= 200 && ballBottom <= 400)) {
        if (!game.calledOnce) {


            for (let i = 0; i < 50; i++) {
                let r = String(Math.floor(Math.random() * 255));
                let g = String(Math.floor(Math.random() * 255));
                let b = String(Math.floor(Math.random() * 255));
                let str = "rgb("
                game.particles.push(new Particle(GAME_WIDTH - 100, 300, Math.random() * 2, str.concat(r, ",", g, ",", b, ")"), (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4));
                console.log("here");

            }

            game.calledOnce = true;
        }
        game.startReset = true;
        game.gameObjects.splice(2,1);

    }
    if (ballLeft < 0 && (ballTop >= 200 && ballBottom <= 400)) {
        if (!game.calledOnce) {
            for (let i = 0; i < 50; i++) {
                let r = String(Math.floor(Math.random()*255));
            let g = String(Math.floor(Math.random()*255));
             let b = String(Math.floor(Math.random()*255));
            let str = "rgb("
                game.particles.push(new Particle(100, 300, Math.random() * 2, str.concat(r, ",", g, ",", b, ")"), (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4));
                console.log("here");
            }
            game.calledOnce = true;

        }

        game.startReset = true;
        game.gameObjects.splice(2,1);
    }

}



class Particle {
    constructor(x, y, radius, colour, vX, vY) {



        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
        this.alpha = 1;
        this.vX = vX;
        this.vY = vY;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.restore();
    }



    update(deltaTime) {
        this.x += this.vX;
        this.y += this.vY;
        this.alpha -= 0.01;
        //    console.log(this.vX);
        //    console.log(this.vX);



    }


}



class Ball {


    constructor(game) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.game = game;

        this.size = 0.75 * 25;

        this.position
            =
        {
            x: 600,
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

        // ctx.drawImage(this.ball, this.position.x, this.position.y, this.size, this.size);
        ctx.beginPath();
        ctx.arc(this.position.x + this.size / 2, this.position.y + this.size / 2, this.size / 2, 0, 2 * Math.PI, true);

        ctx.fillStyle = "white";
        ctx.fill()
    }

    update(deltaTime) {
        this.speed = Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));


        if (collisionHandler(this, this.game.car)) {
            console.log("here");
            if (this.game.car.speed !== 0) {
                this.speed = 2 * this.game.car.speed;
                console.log("here again1");
                game.car.speed = 0;
                this.velocity.x = this.speed * Math.cos(this.game.car.rotation);
                this.velocity.y = this.speed * Math.sin(this.game.car.rotation);
            }
            else {
                this.velocity.x = - 0.80 * this.velocity.x;
                this.velocity.y = - 0.80 * this.velocity.y;
            }
        }

        if (collisionHandler(this, this.game.car2)) {

            if (this.game.car2.speed !== 0) {
                this.speed = 2 * this.game.car2.speed;

                game.car2.speed = 0;
                this.velocity.x = this.speed * Math.cos(this.game.car2.rotation);
                this.velocity.y = this.speed * Math.sin(this.game.car2.rotation);
            }
            else {
                this.velocity.x = - 0.80 * this.velocity.x;
                this.velocity.y = - 0.80 * this.velocity.y;
            }
        }

        collisionHandlerBetweenWallsBall(this);


        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;



    }



}



class Car {

    constructor(game, carImg) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.input = {

            up: false,
            down: false,
            left: false,
            right: false,
            boost: false,
        }



        this.disableInput = false;
        this.disableInputDuration = 0;



        this.width = 0.75 * 50;

        this.height = 0.75 * 25;


        this.angularSpeed = 0.05;

        this.car = carImg;
        this.position =
        {
            x: 700,
            y: 300
        }
        this.rotation = 0;
        this.maxSpeed = 2;
        this.speed = 0;


        this.velocity =
        {
            x: 0,
            y: 0
        }
        this.boostTime = 0;


    }



    updateVelocity() {
        if (!this.disableInput) {
            if (this.input.up == true && !this.input.boost) {


                this.speed = this.maxSpeed;



            }
            else if (this.input.boost) {
                if (this.boostTime < 1000) {
                    this.speed = this.maxSpeed * 3;
                }
                else {
                    this.speed = this.maxSpeed;
                }


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
    reverseVelocities() {
        this.velocity.x = - 0.8 * this.velocity.x;
        this.velocity.y = - 0.8 * this.velocity.y;
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
        ctx.drawImage(this.car, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    update(deltaTime) {
        if (this.disableInput) {
            this.disableInputDuration += deltaTime;
        }
        if (this.disableInputDuration > 300) {
            this.disableInputDuration = 0;
            this.disableInput = false;
        }

        if (this.input.boost && this.boostTime < 1000) {
            this.boostTime += deltaTime;

        }
        if (this.boostTime > 0 && !this.input.boost) {
            this.boostTime -= deltaTime;
        }
        this.updateVelocity();

        this.determineRotation();
        collisionHandlerBetweenWallsTank(this);





        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;





    }


}

game = new GameManager(GAME_WIDTH, GAME_HEIGHT, ctx);



let lastTime = 0;


function gameLoop(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    // ctx.fillStyle ='rbga(0,0,0,0.1)';
    // ctx.fillRect(0,0,800,600);
    game.update(deltaTime);
    game.draw(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);