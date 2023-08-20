// Load assets
star = LoadSprite("Star.png");
square = LoadSprite("Square.png");
knight = LoadSprite("Knight.png");
sword = LoadSprite("Sword.png");
horse = LoadSprite("Horse.png");
castle = LoadSprite("Castle.png");

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
        this.dir = 1.0;
        this.angleBounce = 0;
        this.moveSpeed = 200.0 + Math.random()*100.0;
        this.angleSword = 45.0;
        this.angleSwordSwipeOffset = Math.random()*2.25;
        this.arrived = false;
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
            this.dir = (dx >= 0.0) ? 1.0 : -1.0;

            if (this.angleBounce == 0.0)
            {
                this.angleBounce = Math.random()*Math.PI*2.0;
            }
        }

        let xNew = this.x + (dx * this.moveSpeed * deltaTime);
        let yNew = this.y + (dy * this.moveSpeed * deltaTime);
        let dxNew = (this.xDest - xNew);
        let dyNew = (this.yDest - yNew);
        let dotArrived = (dx * dxNew) + (dy * dyNew);

        // Still moving?
        if (dotArrived > 0)
        {
            this.x = xNew;
            this.y = yNew;
            this.arrived = false;
            this.angleBounce += 24.0 * deltaTime;
            if (this.angleBounce > Math.PI)
            {
                this.angleBounce -= Math.PI*2.0;
            }
        }
        // Arrived
        else
        {
            this.x = this.xDest;
            this.y = this.yDest;
            this.arrived = true;
            this.angleBounce *= 0.90;
            this.angleSword = 90.0 - Math.abs(Math.sin(this.angleSwordSwipeOffset + performance.now()*0.03))*75.0;
        }
    }

    draw()
    {
        ctx.save();

        const scale = 4.0;
        const yBounceOffsetMax = 5.0;
        const rotBounceMax = 10.0;

        // Entire characer bounce pos/rot adjustments
        if (this.arrived)
        {
            let yBounceOffset = Math.abs(Math.sin(performance.now() * 0.01 + this.angleSwordSwipeOffset)) * yBounceOffsetMax * 0.75;
            ctx.translate(this.x, this.y - yBounceOffset);
        }
        else
        {
            let yBounceOffset = Math.abs(Math.sin(this.angleBounce)) * yBounceOffsetMax;
            ctx.translate(this.x, this.y - yBounceOffset);
            ctx.rotate((rotBounceMax * Math.cos(this.angleBounce + Math.PI/2)) * Math.PI/180);
        }

        // Sword sway pos/rot adjustments
        const swordSwayOffsetMax = 10.0;
        const swordSwayOffset = Math.abs(Math.sin(this.angleBounce + 30)) * swordSwayOffsetMax;
        ctx.save();
        ctx.translate(this.dir * (36 - swordSwayOffset), -(14 + swordSwayOffset));
        ctx.rotate(this.dir * this.angleSword * Math.PI/180);
        DrawSprite(sword, 0, -16, 0.0, scale*this.dir, scale);
        ctx.restore();

        // Head
        DrawSprite(knight, 0, -20, 0.0, scale*this.dir, scale);

        ctx.restore();
    }
}

const numKnights = 50;
const xSpawnMin = -400;
const xSpawnMax = -100;
const ySpawnMin = 48;
const ySpawnMax = 480;
entities = [];
for (let i = 0; i < numKnights; i++)
{
    let knight = new Knight(xSpawnMin + Math.random()*(xSpawnMax - xSpawnMin), ySpawnMin + Math.random()*(ySpawnMax - ySpawnMin));
    knight.xDest = 720.0 + Math.random()*50.0;
    entities.push(knight);
}
entities.sort((entity1, entity2) => entity1.y - entity2.y);

const numGroundSpots = 15;
groundSpots = [];
// for (let i = 0; i < numGroundSpots; i++)
// {
//     groundSpots.push({x:Math.random()*gameWidth, y:Math.random()*gameHeight, r:Math.random()*Math.PI*2, w:50 + Math.random()*150, h:40 + Math.random()*100});
// }

GameState = (reason) =>
{
    clearColor = "#6ab04c";

    groundSpots.forEach(groundSpot =>
    {
        ctx.save();
        ctx.translate(groundSpot.x, groundSpot.y);
        ctx.rotate(groundSpot.r);
        ctx.fillStyle = "#ffbe76";
        ctx.fillRect(0, 0, groundSpot.w, groundSpot.h);
        ctx.restore();
    });

    const xCastle = 820;
    const yCastle = 0;
    const yCastleStep = 64;
    const scale = 4.0;
    const numCastles = 8;
    for (let i = 0; i < numCastles; i++)
    {
        DrawSprite(castle, xCastle + (i % 2)*5, yCastle + i*yCastleStep, 0.0, scale, scale);
    }

    entities.forEach(entity =>
    {
        entity.tick();
        entity.draw();
    });
}

// Start initial state
nextState = GameState;