
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;


let score1 = 0;
let score2 = 0;

let nitro1 = 100;
let nitro2 = 100;

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



let scoreP1 = document.getElementById('scP1');
let scoreP2 = document.getElementById('scP2');


// let nitroP1 = document.getElementById('nitro1');
// let nitroP2 = document.getElementById('nitro2');

// nitroP1.style.display = 'none';
// nitroP2.style.display = 'none';
// nitroP1.textContent = String(nitro1);
//         nitroP2.textContent = String(nitro2);
scoreP1.style.display = 'none';
scoreP2.style.display = 'none';


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


class GameManager {
    constructor(ctx) {


        this.gameState = GAMESTATE.MENU;
        this.car = new Car(car1img,nitro1);
        // this.car.rotation = Math.PI/2;
        this.car.position.x = 100;


        this.car2 = new Car(car2img,nitro2);
        this.car2.rotation = Math.PI;
        this.ball = new Ball(this);
        this.IH1 = new InputHandler(this);

        this.startReset = false;
        this.countdown = 0;
        this.calledOnce = false;
        this.std = new Stadium();
        this.gameObjects = [];
        this.particles = [];

    }

    reset() {

        this.resetToStart();
        this.gameState = GAMESTATE.MENU;
        mainMenu.style.display = 'flex';
        pauseMenu.style.display = 'none';
        this.startReset = false;
        this.countdown = 0;
        score1 = 0;
        score2 = 0;
        scoreP1.textContent = String(score1);
        scoreP2.textContent = String(score2);
        nitro1 = 100;
        nitro2 = 100;
        // nitroP1.textContent = String(nitro1);
        // nitroP2.textContent = String(nitro2);


    }
    resetToStart() {
        this.car = new Car(car1img,nitro1);
        this.car.position.x = 100;

        this.car2 = new Car(car2img,nitro2);
        this.car2.rotation = Math.PI;

        this.ball = new Ball(this);
        this.IH1.car = this.car;
        this.IH1.car2 = this.car2;
        this.gameObjects = [];
        this.particles = [];
        this.std = new Stadium();
        this.calledOnce = false;
        scoreP1.style.display = 'none';
        scoreP2.style.display = 'none';
        scoreP1.textContent = String(score1);
        scoreP2.textContent = String(score2);
        // nitroP1.style.display = 'none';
        // nitroP2.style.display = 'none';

    }
    start() {

        scoreP1.style.display = 'flex';
        scoreP2.style.display = 'flex';
        // nitroP1.style.display = 'flex';
        // nitroP2.style.display = 'flex';

        this.gameState = GAMESTATE.RUNNING;
        this.gameObjects = [this.car, this.car2, this.ball];


    }

    draw(ctx) {
        drawLine(ctx,0,500,this.car.nitro*3,500,"red");
        drawLine(ctx,800 - this.car2.nitro*3,500,800,500,"green");
        this.std.draw(ctx);
        this.gameObjects.forEach(object => {
            object.draw(ctx);
        });

        this.particles.forEach((object) => {

            object.draw(ctx);
        });

    }
    update(deltaTime) {

        // nitroP1.textContent = String(this.car.nitro);
        // nitroP2.textContent = String(this.car2.nitro);
        if (this.gameState === GAMESTATE.PAUSED || this.gameState === GAMESTATE.MENU) return;

        this.gameObjects.forEach(object => {

            object.update(deltaTime);
        });
        this.particles.forEach((object, index) => {
            if (object.alpha <= 0) {

                this.particles.splice(index, 1);
            }
            else {


                object.update(deltaTime);
            }


        });
        if (collisionHandlerBetweenCars(game.car, game.car2)) {
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
                this.start();
                this.startReset = false;
                this.countdown = 0
            }

        }

    }

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

function collisionHandlerBetweenCars(object1, object2) {
    return (projections_intersect(object1, object2) && projections_intersect(object2, object1));
}

function collisionHandler(ball, object) {
    let ball_x = ball.position.x + ball.size / 2;
    let ball_y = ball.position.y + ball.size / 2;
    let car_x = object.position.x;
    let car_y = object.position.y;
    let theta = object.rotation;

    let sep_along_width = (ball_x - car_x) * Math.cos(theta) + (ball_y - car_y) * Math.sin(theta);
    let sep_along_height = (ball_x - car_x) * Math.sin(theta) - (ball_y - car_y) * Math.cos(theta);

    let gap_h = Math.abs(sep_along_height) - object.height / 2 - ball.size / 2 - 2;
    let gap_w = Math.abs(sep_along_width) - object.width / 2 - ball.size / 2 - 2;


    if (gap_h <= 0 && gap_w <= 0) {

        if (Math.abs(gap_h) <= Math.abs(gap_w)) { //collides with width
            let theta = object.rotation;
            let displaceAlongHeight = sep_along_height * (Math.abs(gap_h) + 2) / Math.abs(sep_along_height);

            let v1x = ball.velocity.x;
            let v2x = object.velocity.x;
            let v1y = ball.velocity.y;
            let v2y = object.velocity.y;

            let v1_normal = - v1x * Math.sin(theta) + v1y * Math.cos(theta);
            let v2_normal = - v2x * Math.sin(theta) + v2y * Math.cos(theta);
            let v2_parallel = v2y * Math.sin(theta) + v2x * Math.cos(theta);
            let v1_parallel = v1y * Math.sin(theta) + v1x * Math.cos(theta);
            let copy = v1_normal;
            v1_normal = 2 * v2_normal - v1_normal;
            v2_normal = (copy - v2_normal) * 0.2;


            ball.velocity.x = - v1_normal * Math.sin(theta) + v1_parallel * Math.cos(theta);
            ball.velocity.y = v1_normal * Math.cos(theta) + v1_parallel * Math.sin(theta);

            ball.speed = Math.sqrt(Math.pow(ball.velocity.x, 2) + Math.pow(ball.velocity.y, 2));
            if (ball.speed > ball.maxSpeed) {
                ball.velocity.x = ball.velocity.x / ball.speed * ball.maxSpeed;
                ball.velocity.y = ball.velocity.y / ball.speed * ball.maxSpeed;
            }
            object.velocity.x = - v2_normal * Math.sin(theta) + v2_parallel * Math.cos(theta);
            object.velocity.y = v2_normal * Math.cos(theta) + v2_parallel * Math.sin(theta);

            object.disableInput = true;
        }
        else {
            let theta = object.rotation;
            let displaceAlongWidth = sep_along_width * (Math.abs(gap_w) + 2) / Math.abs(sep_along_width);
            //ball.position.x += displaceAlongWidth * Math.cos(theta);
            //ball.position.y += displaceAlongWidth * Math.sin(theta);


            let v1x = ball.velocity.x;
            let v2x = object.velocity.x;
            let v1y = ball.velocity.y;
            let v2y = object.velocity.y;
            let v1_normal = v1x * Math.cos(theta) + v1y * Math.sin(theta);
            let v2_normal = v2x * Math.cos(theta) + v2y * Math.sin(theta);
            let v2_parallel = v2y * Math.cos(theta) - v2x * Math.sin(theta);
            let v1_parallel = v1y * Math.cos(theta) - v1x * Math.sin(theta);
            let copy = v1_normal;
            v1_normal = 2 * v2_normal - v1_normal;
            v2_normal = (copy - v2_normal) * 0.2;
            ball.velocity.x = v1_normal * Math.cos(theta) - v1_parallel * Math.sin(theta);
            ball.velocity.y = v1_normal * Math.sin(theta) + v1_parallel * Math.cos(theta);

            ball.speed = Math.sqrt(Math.pow(ball.velocity.x, 2) + Math.pow(ball.velocity.y, 2));
            if (ball.speed > ball.maxSpeed) {
                ball.velocity.x = ball.velocity.x / ball.speed * ball.maxSpeed;
                ball.velocity.y = ball.velocity.y / ball.speed * ball.maxSpeed;
            }
            object.velocity.x = v2_normal * Math.cos(theta) - v2_parallel * Math.sin(theta);
            object.velocity.y = v2_normal * Math.sin(theta) + v2_parallel * Math.cos(theta);

            object.disableInput = true;
        }

    }



}


function collisionHandlerBetweenWallsCar(object) {
    let theta = object.rotation;
    let x1 = object.width / 2 * Math.cos(theta) + object.height / 2 * Math.sin(theta);
    let x2 = object.width / 2 * Math.cos(theta) - object.height / 2 * Math.sin(theta);
    let y1 = object.width / 2 * Math.sin(theta) + object.height / 2 * Math.cos(theta);
    let y2 = object.width / 2 * Math.sin(theta) - object.height / 2 * Math.cos(theta);

    let top = object.position.y + Math.min(y1, y2, -y1, -y2);
    let bottom = object.position.y + Math.max(y1, y2, -y1, -y2);
    let right = object.position.x + Math.max(x1, x2, -x1, -x2);
    let left = object.position.x + Math.min(x1, x2, -x1, -x2);

    if (left < 0 || right > GAME_WIDTH) {
        object.disableInput = true;
        object.velocity.x = - object.velocity.x;
        if (left < 0) object.position.x -= 2 * left;
        else object.position.x -= 2 * (right - GAME_WIDTH);

    }

    if (top < 0 || bottom > GAME_HEIGHT) {
        object.disableInput = true;
        object.velocity.y = - object.velocity.y;
        if (top < 0) object.position.y -= 2 * top;
        else object.position.y -= 2 * (bottom - GAME_HEIGHT);
    }
}



function collisionHandlerBetweenWallsBall(ball) {

    let ballLeft = ball.position.x;
    let ballRight = ball.position.x + ball.size;
    let ballTop = ball.position.y;
    let ballBottom = ball.position.y + ball.size;


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


            for (let i = 0; i < 100; i++) {
                let r = String(Math.floor(Math.random() * 255));
                let g = String(Math.floor(Math.random() * 255));
                let b = String(Math.floor(Math.random() * 255));
                let str = "rgb("
                game.particles.push(new Particle(GAME_WIDTH - 100, GAME_HEIGHT / 2, Math.random() * 2, str.concat(r, ",", g, ",", b, ")"), (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4));

            }
            score1++;
            scoreP1.textContent = 'GOAL!!!';

            game.calledOnce = true;
        }
        game.startReset = true;
        game.gameObjects.splice(2, 1);
    }
    if (ballLeft < 0 && (ballTop >= 200 && ballBottom <= 400)) {
        if (!game.calledOnce) {
            for (let i = 0; i < 100; i++) {
                let r = String(Math.floor(Math.random() * 255));
                let g = String(Math.floor(Math.random() * 255));
                let b = String(Math.floor(Math.random() * 255));
                let str = "rgb("
                game.particles.push(new Particle(100, GAME_HEIGHT / 2, Math.random() * 2, str.concat(r, ",", g, ",", b, ")"), (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4));

            }
            score2++;
            scoreP2.textContent =  'GOAL!!!';
            game.calledOnce = true;

        }
        game.startReset = true;
        game.gameObjects.splice(2, 1);
    }

}
function drawLine(ctx, startX, startY, endX, endY,colour) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}
function drawCircle(ctx) {
    ctx.strokeStyle = 'rgb(255,131,0)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(400, 300, 50, 0, Math.PI * 2, true);

    ctx.stroke();
}


class Stadium {

    constructor() {
        this.gameWidth = GAME_WIDTH;
        this.gameHeight = GAME_HEIGHT;


    }

    draw(ctx) {
        let colour = 'rgb(255,131,0)';
        drawLine(ctx, 0, 200, 100, 200,colour);
        drawLine(ctx, 0, 400, 100, 400,colour);

        drawLine(ctx, 100, 400, 100, 200,colour);

        drawLine(ctx, 800, 200, 700, 200,colour);

        drawLine(ctx, 800, 400, 700, 400,colour);

    drawLine(ctx, 700, 400, 700, 200,colour);

        drawLine(ctx, 400, 600, 400, 350,colour);
        drawLine(ctx, 400, 250, 400, 0,colour);
        // this.drawLine(ctx,0,0,1600,0);
        drawCircle(ctx);

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
        this.alpha -= 0.005;

    }


}

class Ball {


    constructor(game) {
        this.game = game;

        this.size = 0.75 * 25;

        this.position
            =
        {
            x: GAME_WIDTH / 2 - this.size / 2,
            y: GAME_HEIGHT / 2 - this.size / 2,
        };
        this.maxSpeed = 10;
        // this.position
        //     =
        // {
        //     x: 600,
        //     y: 300,
        // };

        this.speed = 0;
        this.velocity =
        {
            x: 0,
            y: 0
        };


    }

    draw(ctx) {

        ctx.beginPath();
        ctx.arc(this.position.x + this.size / 2, this.position.y + this.size / 2, this.size / 2, 0, 2 * Math.PI, true);

        ctx.fillStyle = "white";
        ctx.fill()
    }

    update(deltaTime) {
        
        this.speed = Math.sqrt(Math.pow(this.velocity.x,2)+Math.pow(this.velocity.y,2));
        collisionHandler(this, this.game.car);
        collisionHandler(this, this.game.car2);
        collisionHandlerBetweenWallsBall(this);

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        console.log(this.speed);
    }



}

class Car {

    constructor(carImg,nitro) {

        this.nitro = nitro;
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


        this.angularSpeed = 0.035/8;

        this.car = carImg;
        this.position =
        {
            x: 700,
            y: 300
        }
        this.rotation = 0;
        this.maxSpeed = 0.2;
        this.speed = 0;


        this.velocity =
        {
            x: 0,
            y: 0
        }
        


    }



    updateVelocity(deltaTime) {
        if (!this.disableInput) {
            if (this.input.up == true && !this.input.boost) {


                this.speed = this.maxSpeed*deltaTime;



            }
            else if (this.input.boost) {
                if (this.nitro > 0) {
                    this.speed = this.maxSpeed*deltaTime * 3;
                }
                else {
                    this.speed = this.maxSpeed*deltaTime;
                }


            }
            else if (this.input.down == true) {

                this.speed = -this.maxSpeed*deltaTime;

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
    determineRotation(deltaTime) {
        // if (!this.disableInput) {
        if (this.input.left) {
            if (this.input.down) {
                this.rotation += this.angularSpeed*deltaTime;

            }
            else if (this.input.up || this.input.boost) {
                this.rotation -= this.angularSpeed*deltaTime;
            }
        }
        else if (this.input.right) {
            if (this.input.down || this.input.boost) {
                this.rotation -= this.angularSpeed*deltaTime;

            }
            else if (this.input.up) {
                this.rotation += this.angularSpeed*deltaTime;
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

        if (this.input.boost && this.nitro > 0) {
            
            this.nitro -= 1;
            
        }
        if (this.nitro < 100 && !this.input.boost) {
            
            this.nitro += 1
        }
        this.updateVelocity(deltaTime);

        this.determineRotation(deltaTime);
        collisionHandlerBetweenWallsCar(this);




        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;





    }


}

game = new GameManager(ctx);

let autoResetTime = 0;

let lastTime = 0;


function gameLoop(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    if (score1 == 5 || score2 == 5) {
        autoResetTime += deltaTime;
        if (score1 == 5) {
            scoreP1.textContent = "Player 1 Wins!";

        }
        else if (score2 == 5) {
            scoreP2.textContent = "Player 2 Wins!";

        }
        game.car.disableInput = true;
        game.car2.disableInput = true;
        if (autoResetTime > 1000) {
            game.reset();
            autoResetTime = 0;
            console.log("called");
        }
    }
    game.update(deltaTime);
    game.draw(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);