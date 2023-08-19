// Load assets
star = LoadSprite("Star.png")
square = LoadSprite("Square.png")
knight = LoadSprite("Knight.png")
sword = LoadSprite("Sword.png")

// Example state
ExampleState = (reason) =>
{
    // Example: How to handle state enter/exit logic
    if (reason == Enter)
    {
        console.log("Entering 'Example' state");
    }
    else if (reason == Exit)
    {
        console.log("Exiting 'Example' state");
    }

    // Example: Log touch position while being held
    if (touch.hold)
    {
        console.log("Touch Pos: " + touch.x + ", " + touch.y);
    }

    // Example: Change background color depending on where a new touch is pressed
    if (touch.down)
    {
        clearColor = (touch.x < gameWidth*0.5) ? "#888" : "#000";
    }

    // Example: Play SFX on touch released
    if (touch.up)
    {
        zzfx(...[,,895,,.01,.4,4,4.18,.7,.5,,,,.7,,.7,,.92,.02]);
    }

    // Example: Ugly/pixelated rendering!
    DrawSprite(star, 100, 90, performance.now() * 0.1, 1.0, 1.0);
    DrawText("TK Demo!", 100, 45, 32, "#F80", Math.sin(performance.now() * -0.02)*3.0, "Arial", "Bold", "center", "center");
}

class Knight
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.xDest = x;
        this.yDest = y;
        this.dx = 1.0;
        this.a = 0;
    }

    tick()
    {
        if (touch.down)
        {
            this.xDest = touch.x;
            this.yDest = touch.y;
        }

        let dx = (this.xDest - this.x);
        let dy = (this.yDest - this.y);
        let len = Math.sqrt((dx * dx)+(dy * dy));
        if (len != 0.0)
        {
            dx /= len;
            dy /= len;
            this.dx = (dx >= 0.0) ? 1.0 : -1.0;
        }

        let speed = 300.0;
        let xNew = this.x + (dx * speed * deltaTime);
        let yNew = this.y + (dy * speed * deltaTime);
        let dxNew = (this.xDest - xNew);
        let dyNew = (this.yDest - yNew);
        let dot = (dx * dxNew) + (dy * dyNew);
        if (dot > 0)
        {
            this.x = xNew;
            this.y = yNew;
            this.a += 24.0 * deltaTime;
        }
        else
        {
            this.x = this.xDest;
            this.y = this.yDest;

            if (this.a > Math.PI)
            {
                this.a -= Math.PI*2.0;
            }
            else
            {
                this.a *= 0.90;
            }
        }
    }

    draw()
    {
        ctx.save();

        let scale = 6.0
        ctx.save();
        let yOffset = Math.abs(Math.sin(this.a)) * 5.0;
        ctx.translate(this.x, this.y - yOffset);
        ctx.rotate((10.0 * Math.cos(this.a + Math.PI/2)) * Math.PI/180);

        let xOffset = Math.abs(Math.sin(this.a + 30)) * 10.0;
        yOffset = Math.abs(Math.sin(this.a + 30)) * 10.0;
        ctx.save();
        ctx.translate(this.dx * (36 - xOffset), -14 - yOffset);
        ctx.rotate(this.dx * 45.0 * Math.PI/180);
        ctx.fillStyle = '#222';
        ctx.fillRect(-10,-44,20,56);
        ctx.fillRect(-16,-8,32,14);
        DrawSprite(sword, 0, -16, 0.0, scale*this.dx, scale);
        ctx.restore();

        scale = 4.0
        ctx.fillStyle = '#222';
        ctx.fillRect(-20,-40,40,40);
        DrawSprite(knight, 0, -20, 0.0, scale*this.dx, scale);

        ctx.restore();
    }
}

k = new Knight(64, 64);

GameState = (reason) =>
{
    clearColor = "#ccae62";

    k.tick();
    k.draw();
}

// Start initial state
nextState = GameState;