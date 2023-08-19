// Config ---------------------------------------------------------------------
gameWidth = 640;
gameHeight = 480;
gameScale = 1.0;

// Initialization -------------------------------------------------------------
canvas = document.createElement("canvas");
canvas.setAttribute("width", gameWidth);
canvas.setAttribute("height", gameHeight);
canvas.style.width = `${gameWidth * gameScale}px`;
canvas.style.height = `${gameHeight * gameScale}px`;
canvas.style.backgroundColor = "black";
canvas.style.imageRendering = "pixelated";
document.getElementById("game").appendChild(canvas);
ctx = this.canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Input (mouse/touch only!) --------------------------------------------------
touch = { x: 0, y: 0, up: false, down: false, hold: false}
canvas.addEventListener("mousedown", e => { touch.up = false, touch.down = true; touch.hold = true; }, false);
canvas.addEventListener("mouseup", e => { touch.up = true; touch.down = false; touch.hold = false }, false);
canvas.addEventListener("mousemove", e => { SetTouchPos(e); e.preventDefault(); }, false );
canvas.addEventListener("touchstart", e => { SetTouchPos(e.touches[0]); touch.up = false; touch.down = true; touch.hold = true; e.preventDefault(); }, false );
canvas.addEventListener("touchend", e => { touch.up = true; touch.down = false; touch.hold = false; e.preventDefault(); }, false );
canvas.addEventListener("touchcancel", e => { touch.up = true; touch.down = false; touch.hold = false; e.preventDefault(); }, false );
canvas.addEventListener("touchmove", e => { SetTouchPos(e.touches[0]); e.preventDefault(); }, false );
SetTouchPos = (e) => { touch.x = (e.pageX - canvas.offsetLeft) / gameScale; touch.y = (e.pageY - canvas.offsetTop) / gameScale; }

// Rendering ------------------------------------------------------------------
LoadSprite = (name) =>
{
    sprite = new Image();
    sprite.src = name;
    return sprite;
}

DrawSprite = (image, x, y, angle = 0.0, xScale = 1.0, yScale = 1.0) =>
{
    let w = image.width * xScale;
    let h = image.height * yScale;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI/180);
    ctx.scale(xScale < 0.0 ? -1.0 : 1.0, yScale < 0.0 ? -1.0 : 1.0);
    ctx.drawImage(image, -w*0.5, -h*0.5, w, h);
    ctx.restore();
}

DrawText = (text, x, y, fontSize = 12, fillStyle = "#FFF", angle = 0, fontName = "Arial", fontStyle = "", align = "left", baseline = "bottom") =>
{
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle * Math.PI/180);
    this.ctx.font = `${fontStyle} ${fontSize}px ${fontName}`;
    this.ctx.fillStyle = fillStyle;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = baseline;
    this.ctx.fillText(text, 0, 0);
    this.ctx.restore();
}

// Audio (ZzFX: https://github.com/KilledByAPixel/ZzFX) -----------------------
// ZzFXMicro - Zuper Zmall Zound Zynth - v1.2.0 by Frank Force ~ 880 bytes
zzfxV=.3    // volume
zzfx=       // play sound
(p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=
0,B=0,M=Math,R=44100,d=2*M.PI,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,g
=0,H=0,a=0,n=1,I=0,J=0,f=0,x,h)=>{e=R*e+9;m*=R;r*=R;t*=R;c*=R;y*=500*d/R**3;A*=d
/R;v*=d/R;z*=R;l=R*l|0;for(h=e+m+r+t+c|0;a<h;k[a++]=f)++J%(100*F|0)||(f=q?1<q?2<
q?3<q?M.sin((g%d)**3):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2)%2:1-4*M.abs(M.
round(g/d)-g/d):M.sin(g),f=(l?1-B+B*M.sin(d*a/l):1)*(0<f?1:-1)*M.abs(f)**D*zzfxV
*p*(a<e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/2+(c>a?0:
(a<h-c?1:(h-a)/c)*k[a-c|0]/2):f),x=(b+=u+=y)*M.cos(A*H++),g+=x-x*E*(1-1E9*(M.sin
(a)+1)%2),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n||=1);p=zzfxX.
createBuffer(1,h,R);p.getChannelData(0).set(k);b=zzfxX.createBufferSource();b.
buffer=p;b.connect(zzfxX.destination);b.start();return b};zzfxX=new AudioContext;

// Main loop + State management -----------------------------------------------
state = null;
nextState = null;
Enter = 0; Tick = 1; Exit = 2;
clearColor = "#000";
deltaTime = 0.0;
lastTime = 0.0;
GameLoop = () =>
{
    window.requestAnimationFrame(GameLoop);

    // Switch states?
    if (nextState != null)
    {
        if (state != null) { state(Exit); }
        state = nextState;
        nextState = null;
        if (state != null) { state(Enter); }
    }

    // Clear canvas
    ctx.rect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = clearColor;
    ctx.fill();

    // Run state
    if (state)
    {
        state(Tick);
    }

    // Clear per-frame input values
    touch.up = false;
    touch.down = false;

    if (lastTime > 0.0)
    {
        deltaTime = (performance.now() - lastTime) / 1000.0;
    }
    lastTime = performance.now();
}

// Start it up!
window.requestAnimationFrame(GameLoop);