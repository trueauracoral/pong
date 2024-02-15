class Ball {
    constructor(pos, velocity, radius) {
        this.pos = pos;
        this.velocity = velocity;
        this.radius = radius;
        this.pos = pos;
    }

    update() {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
    };

    draw() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.pos.x, this.pos.y, this.radius, this.radius);
        //ctx.beginPath();
        //ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        //ctx.stroke();
    };
}

class Paddle {
    constructor(pos, velocity, width, height) {
        this.pos = pos;
        this.velocity = velocity;
        this.width = width;
        this.height = height;

        this.score = 0;

        this.isMovingUp = false;
        this.isMovingDown = false;
        
        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "w":
                    this.isMovingUp = true;
                    break;
                case "s":
                    this.isMovingDown = true;
                    break;
            }
        });

        window.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "w":
                    this.isMovingUp = false;
                    break;
                case "s":
                    this.isMovingDown = false;
                    break;
            }
        });
    }

    update() {
        if (this.isMovingUp) {
            this.pos.y -= this.velocity.y;
        }

        if (this.isMovingDown) {
            this.pos.y += this.velocity.y;
        }
    }

    draw() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
    

    getHalfWidth() {
        return this.width / 2;
    }

    getHalfHeight() {
        return this.height / 2;
    }

    getCenter() {
        return vec2(
            this.pos.x + this.getHalfWidth(),
            this.pos.y + this.getHalfHeight()
        )
    }
}

const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const halfWidth = canvas.width / 2;
const halfHeight = canvas.height / 2;

function startGame(players) {
    let startDiv = document.getElementById("start");
    let logo = document.getElementById("logo");
    logo.style.display = "none";
    startDiv.style.display = "none";
    game = document.getElementById("game");
    game.style.display="block";
    numberOfPlayers = players;
    gameLoop();
}

// https://jakesgordon.com/writing/javascript-game-foundations-sound/
function createAudio(src) {
    var audio = document.createElement('audio');
    audio.volume = 0.5;
    //audio.loop   = options.loop;
    audio.src = src;
    return audio;
}

var bounce = createAudio('./sound/bounce.wav');
var hit = createAudio('./sound/hit.wav');
var miss = createAudio('./sound/miss.wav');

function vec2(x, y) {
    return {x: x, y: y};
}

const ball = new Ball(vec2(200, 200), vec2(5, 5), 7);
const paddle1 = new Paddle(vec2(10, 50), vec2(7,7), 7, 35)
const paddle2 = new Paddle(vec2(canvas.width - 20, 30), vec2(5,5), 7, 35)

function ballCollitionWalls(ball) {
    if (ball.pos.y + ball.radius >= canvas.height) {
        ball.velocity.y *= -1;
        bounce.play();
    }
    
    //if (ball.pos.x + ball.radius >= canvas.width) {
    //    ball.velocity.x *= -1;
    //}
    
    if (ball.pos.y - ball.radius <= 0) {
        ball.velocity.y *= -1;
        bounce.play();
    }

    //if (ball.pos.x - ball.radius <= 0) {
    //    ball.velocity.x *= -1;
    //}
};

function respawnBall(ball) {
    ball.pos.x = halfWidth;
    ball.pos.y = halfHeight;

    ball.velocity.x = 5;
    ball.velocity.y = 5;

    setTimeout(function(){
        pause = true;
    }, 3000);
    ball.velocity.x *= -1;
    ball.velocity.y *= -1;
}

function increaseScore(ball, paddle1, paddle2) {
    if (ball.pos.x <= -ball.radius) {
        paddle2.score += 1;
        document.getElementById("player2Score").innerHTML = paddle2.score;
        miss.play();
        respawnBall(ball);
    }

    if (ball.pos.x >= canvas.width + ball.radius) {
        paddle1.score += 1;
        document.getElementById("player1Score").innerHTML = paddle1.score;
        miss.play();
        respawnBall(ball)
    }
};

function paddleCollisionWithEdges(paddle) {
    if (paddle.pos.y <= 0) {
        paddle.pos.y = 0;
    }

    if (paddle.pos.y + paddle.height >= canvas.height) {
        paddle.pos.y = canvas.height - paddle.height;
    }
}

function ballPaddleCollision(ball, paddle) {
    let dx = Math.abs(ball.pos.x - paddle.getCenter().x);
    let dy = Math.abs(ball.pos.y - paddle.getCenter().y);

    if (dx <= (ball.radius + paddle.getHalfWidth()) && dy <= (paddle.getHalfHeight() + ball.radius)) {
        if (dy <= paddle.getHalfHeight() && dx <= paddle.getHalfWidth()) {
            ball.velocity.y *= -1;

            if (ball.pos.y < paddle.pos.y) {
                ball.pos.y = paddle.pos.y - (paddle.getHalfHeight() + ball.radius);
            } else {
                ball.pos.y = paddle.pos.y + (paddle.getHalfHeight() + ball.radius);
            }

            ball.pos.x += paddle.velocity.x;
        }
        hit.play();
        ball.velocity.x *= -1;

        if (ball.velocity.x < 0) {
            ball.velocity.x -= 1;
        } else {
            ball.velocity.x += 1;
        }

        if (ball.velocity.y < 0) {
            ball.velocity.y -= 1;
        } else {
            ball.velocity.y += 1;
        }
        console.log(ball.velocity);
    }
}

function player2AI(ball, paddle) {
    if(ball.velocity.x > 0) {
        // I am giving the AI less reaction time. Still this AI code isn't very good at both winning or having error to help the player win against it
        //if (ball.pos.x > ((canvas.width / 2) + (canvas.width / 4))) {
        if (ball.pos.x > ((canvas.width / 2))) {
            if(ball.pos.y > paddle.pos.y) {
                paddle.pos.y += paddle.velocity.y;
                if (paddle.pos.y + paddle.height >= canvas.height) {
                    paddle.pos.y = canvas.height - paddle.height;
                }
            }
    
            if (ball.pos.y < paddle.pos.y) {
                paddle.pos.y -= paddle.velocity.y;
    
                if (paddle.posy <= 0) {
                    paddle.pos.y = 0;
                }
            }
        }
    }
}

function gameUpdate() {
    ball.update();
    paddle1.update();
    //paddle2.update();
    ballCollitionWalls(ball);
    paddleCollisionWithEdges(paddle1);

    if (numberOfPlayers === 1) {
        player2AI(ball, paddle2);
    } else if (numbersOfPlayers === 2) {
        paddle2.update();
    }
    ballPaddleCollision(ball, paddle1);
    ballPaddleCollision(ball, paddle2);

    increaseScore(ball, paddle1, paddle2);
}

function gameDraw() {
    ball.draw();
    paddle1.draw();
    paddle2.draw();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(halfWidth, 0);
    ctx.lineTo(halfWidth, canvas.height)
    ctx.stroke();

    window.requestAnimationFrame(gameLoop);
    
    gameUpdate();
    gameDraw()
    
}