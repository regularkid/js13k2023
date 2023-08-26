// Load assets
knight = LoadSprite("sprites/knight.png");
sword = LoadSprite("sprites/sword.png");
castle = LoadSprite("sprites/castle.png");

StateMove = 0; StateAttack = 1; StateDeath = 2;
class Knight
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.xDest = x;
        this.yDest = y;
        this.dir = 1.0;
        this.angleBounce = Math.random()*Math.PI*2.0;
        this.moveSpeed = 200.0 + Math.random()*100.0;
        this.angleSword = 45.0;
        this.angleSwordSwipeOffset = Math.random()*2.25;
        this.state = StateMove;
        this.xDeathVel = 0.0;
        this.yDeathVel = 0.0;
        this.yDeathStart = 0;
        this.xDeathVelStart = -250.0 - Math.random()*250.0;
        this.yDeathVelStart = -600.0 - Math.random()*250.0;
        this.yDeathGravity = 1750.0;
        this.xDeathVelFriction = 0.35 + Math.random()*0.3;
        this.yDeathVelFriction = 0.35 + Math.random()*0.3;
        this.angleDeath = 0.0;
        this.angleDeathSpeed = 2.0 + Math.random()*5.0;
        this.deathFlashTime = 0.0;
        this.isVisible = true;
        this.isDeathBouncing = true;
        this.dps = 0.1;
    }

    tick()
    {
        if (this.state == StateMove)
        {
            let dx = (this.xDest - this.x);
            let dy = (this.yDest - this.y);
            let len = Math.sqrt((dx * dx)+(dy * dy));
            if (len != 0.0)
            {
                dx /= len;
                dy /= len;
                this.dir = (dx >= 0.0) ? 1.0 : -1.0;
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
                this.state = StateAttack;
            }
        }
        else if (this.state == StateAttack)
        {
            this.angleBounce *= 0.90;
            this.angleSword = 90.0 - Math.abs(Math.sin(this.angleSwordSwipeOffset + performance.now()*0.03))*75.0;
        }
        else if (this.state == StateDeath)
        {
            if (this.isDeathBouncing)
            {
                this.x += this.xDeathVel * deltaTime;
                this.y += this.yDeathVel * deltaTime;
                this.yDeathVel += this.yDeathGravity * deltaTime;
                if (this.y > this.yDeathStart)
                {
                    this.y = this.yDeathStart;
                    this.xDeathVel *= this.xDeathVelFriction;
                    this.yDeathVel *= -this.yDeathVelFriction;
                    this.isDeathBouncing = Math.abs(this.xDeathVel) > 10.0;
                }

                this.angleDeath -= deltaTime * this.angleDeathSpeed;
                if (this.angleDeath < -Math.PI)
                {
                    this.angleDeath = -Math.PI;
                }
            }
            else
            {
                this.deathFlashTime += deltaTime;

                const flashDelay = 0.5;
                if (this.deathFlashTime > flashDelay)
                {
                    const maxFlashTime = 1.0;

                    let curFlashTime = this.deathFlashTime - flashDelay;
                    if (curFlashTime < maxFlashTime)
                    {
                        let mod = curFlashTime % 0.1;
                        this.isVisible = mod > 0.05;
                    }
                    else
                    {
                        this.isVisible = false;
                    }
                }
            }
        }
    }

    draw()
    {
        if (!this.isVisible)
        {
            return;
        }

        ctx.save();

        const scale = 4.0;
        const yBounceOffsetMax = 5.0;
        const rotBounceMax = 10.0;

        // Entire characer bounce pos/rot adjustments
        if (this.state == StateMove)
        {
            let yBounceOffset = Math.abs(Math.sin(this.angleBounce)) * yBounceOffsetMax;
            ctx.translate(this.x, this.y - yBounceOffset);
            ctx.rotate((rotBounceMax * Math.cos(this.angleBounce + Math.PI/2)) * Math.PI/180);
        }
        else if (this.state == StateAttack)
        {
            let yBounceOffset = Math.abs(Math.sin(performance.now() * 0.01 + this.angleSwordSwipeOffset)) * yBounceOffsetMax * 0.75;
            ctx.translate(this.x, this.y - yBounceOffset);
        }
        else if (this.state == StateDeath)
        {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angleDeath);
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

    hit()
    {
        if (this.state != StateDeath)
        {

            this.state = StateDeath;
            this.xDeathVel = this.xDeathVelStart;
            this.yDeathVel = this.yDeathVelStart;
            this.yDeathStart = this.y;
        }
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

castleHealth = 100;
castleHealthEased = 100;
castleHealthEasedDelay = 0.0;
dpsTickTime = 0.0;

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

    if (touch.down)
    {
        let closestIdx = -1;
        let closestDistSq = Number.MAX_VALUE;
        for (let i = 0; i < entities.length; i++)
        {
            let dx = touch.x - entities[i].x;
            let dy = touch.y - entities[i].y;
            let distSq = (dx*dx)+(dy*dy);
            if (distSq < closestDistSq)
            {
                closestDistSq = distSq;
                closestIdx = i;
            }
        }

        const maxHitDistSq = 100*100;
        if (closestIdx != -1 && closestDistSq < maxHitDistSq)
        {
            entities[closestIdx].hit();
        }
    }

    entities.forEach(entity =>
    {
        entity.tick();
        entity.draw();
    });

    dpsTickTime += deltaTime;
    if (castleHealth > 0.0 && dpsTickTime >= 1.0)
    {
        dpsTickTime = 0.0;
        castleHealthEasedDelay = 0.5;

        totalDamage = 0;
        entities.forEach(entity =>
        {
            if (entity.state == StateAttack)
            {
                totalDamage += entity.dps;
            }
        });

        castleHealth -= totalDamage;
        if (castleHealth < 0.0)
        {
            castleHealth = 0.0;
        }
    }

    // Health bar
    const healthBarHeight = 70;
    ctx.fillStyle = "#222";
    ctx.fillRect(0, gameHeight - healthBarHeight, gameWidth, healthBarHeight);

    const healthBarOutlineSize = 10;
    const healthBarFillHeight = healthBarHeight - (healthBarOutlineSize * 2.0);

    // White eased fill
    castleHealthEasedDelay -= deltaTime;
    if (castleHealthEasedDelay <= 0.0)
    {
        castleHealthEased += (castleHealth - castleHealthEased)*0.15;
    }
    let healthBarFillEasedPct = castleHealthEased / 100.0
    let healthBarFillEasedWidth = healthBarFillEasedPct * (gameWidth - (healthBarOutlineSize * 2.0));
    ctx.fillStyle = "#ecf0f1";
    ctx.fillRect(healthBarOutlineSize, gameHeight - (healthBarHeight - healthBarOutlineSize), healthBarFillEasedWidth, healthBarFillHeight);

    // Red fill
    let healthBarFillPct = castleHealth / 100.0
    let healthBarFillWidth = healthBarFillPct * (gameWidth - (healthBarOutlineSize * 2.0));
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(healthBarOutlineSize, gameHeight - (healthBarHeight - healthBarOutlineSize), healthBarFillWidth, healthBarFillHeight);
}

// Start initial state
nextState = GameState;