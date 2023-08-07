// Constants
const sw = 80;
const sy = 50;

// Global init
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d", {alpha: false});
var framebuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
var framebuffer32Bit = new Uint32Array(framebuffer.data.buffer);
var touch = {x:0, y:0, active:false}

// Input
function SetTouchPos(event)
{
    touch.x = (event.pageX - canvas.offsetLeft) / 2.0; // Screen scale factor = 2 (see index.html)
    touch.y = (event.pageY - canvas.offsetTop) / 2.0;
}
canvas.addEventListener("mousedown", e => { touch.active = true }, false);
canvas.addEventListener("mouseup", e => { touch.active = false }, false);
canvas.addEventListener("mousemove", e => { SetTouchPos(e); e.preventDefault(); }, false );
canvas.addEventListener("touchstart", e => { SetTouchPos(e.touches[0]); touch.active = true; e.preventDefault(); }, false );
canvas.addEventListener("touchend", e => { touch.active = false; e.preventDefault(); }, false );
canvas.addEventListener("touchcancel", e => { touch.active = false; e.preventDefault(); }, false );
canvas.addEventListener("touchmove", e => { SetTouchPos(e.touches[0]); e.preventDefault(); }, false );

// Game setup
function Init()
{
    for (let y = 0; y < sy; y++)
    {
        let p = (y * sw);
        for (x = 0; x < sw; x++)
        {
            let r = Math.random() * 255;
            let g = Math.random() * 255;
            let b = Math.random() * 255;
            let c = 0xFF000000 | (b << 16) | (g << 8) | r;
            framebuffer32Bit[p] = c;
            p++;
        }
    }
}

// Fixed step loop
function GameLoop()
{
    ctx.putImageData(framebuffer, 0, 0);
    window.requestAnimationFrame(GameLoop);
}

// Kick everything off!
Init();
window.requestAnimationFrame(GameLoop);