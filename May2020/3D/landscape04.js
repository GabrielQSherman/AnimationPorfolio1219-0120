const pi = Math.PI; //shortcut because is gets used alot

//i like to create all my html elements in JS so this code can be run by simplying adding it in a script tag of an empty HTML file
let canvas = document.createElement('canvas');
    context = canvas.getContext('2d'),

    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,

    frames = 48, //keep count of how many render cycles have occured

    renderPaused = true, //user can toggle animation

    framesUp = true;

    mosPos = {
        x: width/2,
        y: height/2,
    },

    point = { //obj to keep track of points when roating sphere
        x: 0,
        y: 0,
        z: 0
    },

    landscapePoints = []; // array to contain sphere points before they are rendered

    //set styling 

    document.body.style = 'margin: 0px;';

    canvas.style = `display: block; position: static; top: 0px; left: 0px; cursor: default; margin:auto`

    //event listener for user input
    document.addEventListener('keydown', (evn) => {

        switch (evn.code) {
            case 'Space':
                renderPaused = !renderPaused;
            
                if (!renderPaused) { 
                    render()
                }

                break;
        
        }

    }, false)

    canvas.onmousemove = findObjectCoords;
    // canvas.onwheel = mouseWheelMoved;

    document.body.style.backgroundColor = 'black';

    document.body.appendChild(canvas);

    context.translate(0, 0)

    context.strokeStyle = 'deeppink';
    context.fillStyle = `indigo`;

    context.lineWidth = .8;
   
   //ANIMATION CYCLE

     createLandscape()
     render()

      function render() {

        //   console.log(frames);
          

        clearFullScreen() //clear the canvas of previous animation cycle

        createLandscape() //create all the positions in an array

        renderLandscape() //render lines and shapes based on positions

        frames+=10

        //user can toggle pausing of animation via 'spacebar'
        if (!renderPaused) {
            setTimeout(window.requestAnimationFrame, 0, render)
        }

      }

    function createLandscape() {

        let maxW = width/2,
            maxH = height + (frames / 1);

            xCount = 0;

            landscapePoints = [];

        for (let x = 0; x < maxW; x+=17) {

            landscapePoints.push([]);

            let yCount = 0;
            
            for (let y = 1; y < maxH*1.5; y*=(1+ maxH/7333)) {
                
                point = {
                    x: x*(1 +((y*4)/4444)*frames/100),
                    y: y,
                    z: Math.random()*(y/30)*(x/1000)
                };

                rotateY(Math.PI/2.7)

                landscapePoints[xCount][yCount] = point;

                yCount++

            }

            xCount++
            
        }

        // console.log(landscapePoints);

    }

    function renderLandscape() {


        //create background 
        context.beginPath()

        context.rect(0,height/2,width, height)

        context.fill()

        //create landscape with 3d points
        context.save()

        context.translate(width/2,height/2)

        for (let i = landscapePoints.length-2; i >= 0; i--) {
            
            for (let j = landscapePoints[i].length-2; j >= 0; j--) {

                let p = landscapePoints[i][j];

                    n1 = landscapePoints[i][j+1],
                    
                    n2 = landscapePoints[i+1][j],

                    n3 = landscapePoints[i+1][j+1],

                    light = p.y/5 < 70 ? p.y/5 : 70;


                    context.fillStyle = `hsl(${i*14+j},100%,${light}%)`;
                    context.strokeStyle = `hsl(${i*14+j},100%,${light}%)`;


                    context.beginPath()
                    context.moveTo(p.x, p.y)
                    context.lineTo(n1.x, n1.y)
                    context.lineTo(n3.x,n3.y)
                    context.lineTo(p.x, p.y)
                    context.stroke()
                    context.fill()


                    context.beginPath()
                    context.moveTo(p.x, p.y)
                    context.lineTo(n2.x, n2.y)
                    context.lineTo(n3.x,n3.y)
                    context.lineTo(p.x, p.y)
                    context.stroke()
                    context.fill()

                    context.beginPath()
                    context.moveTo(-p.x, p.y)
                    context.lineTo(-n1.x, n1.y)
                    context.lineTo(-n3.x,n3.y)
                    context.lineTo(-p.x, p.y)
                    context.stroke()
                    context.fill()

                    context.beginPath()
                    context.moveTo(-p.x, p.y)
                    context.lineTo(-n2.x, n2.y)
                    context.lineTo(-n3.x,n3.y)
                    context.lineTo(-p.x, p.y)
                    context.stroke()
                    context.fill()
                
            }
            
        }


        context.restore()

    }

    //FUNCTIONS ROTATE A GIVEN POINT ABOUT THE 0,0,0 AXIS
    function rotateY(radians) {

        let y = point.y;
        point.y = (y * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
        point.z = (y * Math.sin(radians)) + (point.z * Math.cos(radians));
    }
    function rotateX(radians) {
        
        let x = point.x;
        point.x = (x * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
        point.z = (x * Math.sin(radians)) + (point.z * Math.cos(radians));
    }
    function rotateZ(radians) {
        let x = point.x;
        point.x = (x * Math.cos(radians)) + (point.y * Math.sin(radians) * -1.0);
        point.y = (x * Math.sin(radians)) + (point.y * Math.cos(radians));
    }
    
    //function used to map numbers from int into a radian range
    function mapNumber (number, min1, max1, min2, max2) {
        return ((number - min1) * (max2 - min2) / (max1 - min1) + min2);
    };

    function clearFullScreen() {

        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
        
    }


    //event listener call back functions

    function mouseWheelMoved(evn) {
        
        let move = evn.deltaY * -7;

        radius = radius + move > 50 && radius + move < height/2 ? radius + move : radius;
        
    }

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

