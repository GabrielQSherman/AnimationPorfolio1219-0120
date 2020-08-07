//this file uses the simplex noise algorithm from a library
// alert('CONTROLS\nPress S to toggle frame screen clear\nPress Space to ( Pause / Play ) animation\nUse O & L to toggle displaying of lines/dots\nUse Up and Down Arrow Keys to change speed of animation')
const Noise = toxi.math.noise.simplexNoise.noise,
      pi = Math.PI,
      sqrt = Math.sqrt,
      pow = Math.pow,
      limits = {
        sX: 20,
        eX: 60,
        sY: 3,
        eY: 41,
    };

let seed = Math.random()*10000,
    mosPos = {
        x: 1000,
        y: 1000,
    };
//VARS FOR CANVAS AND TIMING EVENTS
let canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      width = canvas.width = window.innerWidth,
      height = canvas.height = window.innerHeight,
      time = 0,
      timeMax = Infinity,
      timeForward = true,
      speed = .5,
      clearScreen = true,
      pauseAnimation = false,
      showLines = true,
      showDots = true,
      isInColor = true,
      blockSize = 24,
      colorMult = 1.7;

context.strokeStyle = 'white';
context.fillStyle = 'white';

context.lineWidth = 1;

canvas.style = `display: block;
                position: static;
                top: 0px;
                left: 0px;
                cursor: none;
                margin:auto;
                background-color: black`;

document.body.style = `margin: 0`;

document.body.appendChild(canvas)

//USER INPUT EVENT LISTENER
document.addEventListener('keydown', userInputEvent, false);
canvas.onmousemove = findObjectCoords;

//USER INPUT LOGIC
function userInputEvent(input) {
    switch (input.code) {
        case 'Space':
            pauseAnimation = !pauseAnimation;
            if (!pauseAnimation) {
                render()
            }
        break;
        case 'ArrowUp':
            speed = speed < 4 ? speed+.1 : 4;
        break;
        case "ArrowDown":
            speed = speed > .1 ? speed-.1 : .1;
        break;
        case 'ArrowLeft':
            colorMult = colorMult > .5 ? colorMult-.3 : .5;
        break;
        case "ArrowRight":
            colorMult = colorMult < 5 ? colorMult+=.1 : 5;
          break;
        case "KeyL":
            showLines = !showLines;
            if (!showDots && !showLines) showDots = true
        break;
        case "KeyO":
            showDots = !showDots;
            if (!showDots && !showLines) showLines = true
        break;
        case "KeyS":
            clearScreen = !clearScreen;
        break;
        case "KeyC":
            isInColor = !isInColor;
        break;
        }
        
}

//SET THE CANVAS ORIGIN TO THE MIDDLE OF THE WINDOW
    //   context.translate(width/2, height/2)   

//ANIMAITON CYCLE

        render()

        function render() {

        if (timeForward && time < timeMax) {
            time+=speed
        } else if (timeForward && time >= timeMax) {
            setTimeout(()=>{timeForward = false;}, 100)
        } else if (!timeForward && time > 1) {
            time-=speed
        } else if ( time <= 1){
            timeForward = true;
            time = 1.1
            seed = Math.random()  
        }

        if(clearScreen) clearFullScreen()

        createImg(time)
        // renderMouse()
        
        if (!pauseAnimation) {
            setTimeout(window.requestAnimationFrame, 10, render)
        }
      }

function createImg(s) { 

    const points = [];
    const timeNoise = Math.abs(Noise(s/1000 + seed, s/1000 + seed)*1.5);

        for (let x = limits.sX; x < limits.eX; x++) {

            points.push([]);
            
            for (let y = limits.sY; y < limits.eY; y++) {
                
                const
                noiseX = x/19+timeNoise + s/77, 
                noiseY = y/19+timeNoise + s/77,
                distance = sqrt( pow((x*blockSize)-(width/2), 2) +  pow((y*blockSize)-(height/2), 2) ),
                N1 = Noise(noiseX, noiseY+seed)*(3.6 -pow(distance,.77)/28),
                N2 = Noise(noiseY+seed,noiseX)*(3.6 -pow(distance,.77)/28),
                X = x*blockSize+ N1*20+N2*20,
                Y = y*blockSize+ N1*20-N2*20,
                noise = Math.abs(N1 + N2)/2 +( 1 * distance/7000),
                point = {x: X, y: Y, n: noise};

                points[x-limits.sX].push(point)
                        
            }
            
        }

        renderCanvasBG()
        renderPoints(points)
        // renderBorder()

}

function renderCanvasBG() {
    const backgroundColor =  `#111`

    context.fillStyle = backgroundColor;

    //limits.sX*blockSize, limits.sY*blockSize, limits.eX*blockSize, limits.eY*blockSize
    context.rect(
        limits.sX*blockSize, 
        limits.sY*blockSize, 
        limits.eX*blockSize-blockSize-limits.sX*blockSize, 
        limits.eY*blockSize-blockSize-limits.sY*blockSize
    );
    context.fill()
}

function renderBorder() {
    const borderColor = '#222';

    context.fillStyle = borderColor;

    //limits.sX*blockSize, limits.sY*blockSize, limits.eX*blockSize, limits.eY*blockSize
    context.rect(
        limits.sX*blockSize-blockSize, 
        limits.sY*blockSize-blockSize, 
        limits.eX*blockSize-blockSize-limits.sX*blockSize+blockSize*2, 
        blockSize
    );
    context.fill()

    context.rect(
        limits.sX*blockSize-blockSize, 
        limits.eY*blockSize-blockSize, 
        limits.eX*blockSize-blockSize-limits.sX*blockSize+blockSize*2, 
        blockSize
    );
    context.fill()

    context.rect(
        limits.sX*blockSize-blockSize, 
        limits.sY*blockSize-blockSize, 
        blockSize,
        limits.eY*blockSize-blockSize-limits.sY*blockSize+blockSize*2
    );
    context.fill()

    context.rect(
        limits.eX*blockSize-blockSize, 
        limits.sY*blockSize-blockSize, 
        blockSize,
        limits.eY*blockSize-blockSize-limits.sY*blockSize+blockSize*2
    );
    context.fill()

}

function renderMouse() {

    const originX = mosPos.x;
    const originY = mosPos.y;

    const noise1 = (Noise(seed+time/100, seed+time/100));
    const noise2 = (Noise(seed+0.4140+time/100, seed+0.4140+time /100));

    context.fillStyle = 'yellow';                  
    context.beginPath()
    context.arc(originX+(noise2)*12.7, originY+(noise1)*12.7, 1.5, 0, pi*2)
    context.fill()

    const noise3 = (Noise(seed+333+time/100, seed+333+time/100));
    const noise4 = (Noise(seed+0.41400+time/100, seed+0.41400+time /100));

    context.fillStyle = 'magenta';                  
    context.beginPath()
    context.arc(originX+(noise3)*12.7, originY+(noise4)*12.7, 1.5, 0, pi*2)
    context.fill()

    const noise5 = (Noise(seed+777+time/100, seed+777+time/100));
    const noise6 = (Noise(seed+510+time/100, seed+510+time /100));

    context.fillStyle = 'aqua';                  
    context.beginPath()
    context.arc(originX+(noise5)*12.7, originY+(noise6)*12.7, 1.5, 0, pi*2)
    context.fill()

}

function renderPoints(arr) {

    // const t = Math.ceil(time/20)
    const saturation = isInColor ? 100 : 0;

    for (let i = 0; i < arr.length; i++) {

        for (let j = 0; j < arr[i].length; j++) {
            
            const p = arr[i][j],
            pColor = calcColor(p.n)

            if (showLines) {
                const px = 
                    arr[i+1] != undefined 
                    ? arr[i+1][j]   
                    : false;
                const py = 
                    arr[i][j+1] != undefined 
                    ? arr[i][j+1]   
                    : false;
                const pxy = 
                    arr[i+1] != undefined 
                    && arr[i+1][j+1] != undefined 
                    ? arr[i+1][j+1] 
                    : false;
                const pm = 
                    px
                    && py
                    && pxy
                    ? {
                        n: (p.n + pxy.n + px.n + py.n)/4,
                        x: p.x + blockSize/2,
                        y: p.y + blockSize/2
                    }
                    : false;

                if (pm && py) {
                    const
                    pColor = calcColor((pm.n+p.n+py.n)/3);
        
                    context.fillStyle = pColor;                  
                    context.beginPath()
                    context.moveTo(p.x, p.y)
                    context.lineTo(py.x,py.y)
                    context.lineTo(pm.x,pm.y)
                    context.lineTo(p.x, p.y)
                    context.fill()

                }

                if (pm && px) {
                    const 
                    pColor = calcColor((pm.n+p.n+px.n)/3);
        
                    context.fillStyle = pColor;                  
                    context.beginPath()
                    context.moveTo(p.x, p.y)
                    context.lineTo(px.x,px.y)
                    context.lineTo(pm.x,pm.y)
                    context.lineTo(p.x, p.y)
                    context.fill()

                }

                if (pm && pxy && px) {
                    const 
                    pColor = calcColor((pm.n+px.n+pxy.n)/3);
        
                    context.fillStyle = pColor;                  
                    context.beginPath()
                    context.moveTo(px.x, px.y)
                    context.lineTo(pxy.x,pxy.y)
                    context.lineTo(pm.x,pm.y)
                    context.lineTo(px.x, px.y)
                    context.fill()

                }

                if (pm && pxy && py) {
                    const 
                    pColor = calcColor((pm.n+py.n+pxy.n)/3);
        
                    context.fillStyle = pColor;                  
                    context.beginPath()
                    context.moveTo(py.x, py.y)
                    context.lineTo(pxy.x,pxy.y)
                    context.lineTo(pm.x,pm.y)
                    context.lineTo(py.x, py.y)
                    context.fill()

                }
                if (pm && showDots) {
                    const 
                    pColor = calcColor(pm.n);
        
                    context.fillStyle = pColor;                  
                    context.beginPath()
                    context.arc(pm.x, pm.y, 5, 0, pi*2)
                    context.fill()
                }

            }

            if (showDots) {
                context.fillStyle = pColor;                  
                context.beginPath()
                context.arc(p.x, p.y, 5, 0, pi*2)
                context.fill()
            }


        }
    }

}

function calcColor(n) {
    const light = (100*n) < 90 ? (100*n) : 90,
          sat = n*100,
          color = (n * 360 * colorMult) + time*3;
    return `hsl(${color}, ${sat}%, ${light}%)`
}

function clearFullScreen() {

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    
}

function mapNumber (number, min1, max1, min2, max2) {
    return ((number - min1) * (max2 - min2) / (max1 - min1) + min2);
};


function findObjectCoords(mouseEvent) {

    let obj = canvas,
        obj_left = 0,
        obj_top = 0,
        xpos,
        ypos;

while (obj.offsetParent)
{
    obj_left += obj.offsetLeft;
    obj_top += obj.offsetTop;
    obj = obj.offsetParent;
}
if (mouseEvent)
{
    xpos = mouseEvent.pageX;
    ypos = mouseEvent.pageY;
}

xpos -= obj_left;
ypos -= obj_top;

mosPos.x = xpos
mosPos.y = ypos

}