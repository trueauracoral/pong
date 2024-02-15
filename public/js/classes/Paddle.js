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