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
