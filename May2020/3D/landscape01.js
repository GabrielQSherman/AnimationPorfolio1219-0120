const pi = Math.PI; //shortcut because is gets used alot

//i like to create all my html elements in JS so this code can be run by simplying adding it in a script tag of an empty HTML file
let canvas = document.createElement('canvas');
    context = canvas.getContext('2d'),

    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,

    frames = 0, //keep count of how many render cycles have occured

    renderPaused = true, //user can toggle animation

    mosPos = {
        x: 1000,
        y: 1000,
    },

    point = { //obj to keep track of points when roating sphere
        x: 0,
        y: 0,
        z: 0
    },

    landscapePoints = []; // array to contain sphere points before they are rendered

    //set styling 

    document.body.style = 'cursor: none; margin: 0px;';

    canvas.style = `display: block; position: static; top: 0px; left: 0px; cursor: none; margin:auto`

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
    canvas.onwheel = mouseWheelMoved;

    document.body.style.backgroundColor = 'black';

    document.body.appendChild(canvas);

    context.translate(0, 0)

    context.strokeStyle = 'white';

    context.lineWidth = .8;
   
   //ANIMATION CYCLE

     createLandscape()
     render()

      function render() {

        // console.log(frames);

        clearFullScreen() //clear the canvas of previous animation cycle

        // createLandscape() //render the landscape

        renderLandscape()

        // context.rotate(.01)

        //counts how many frames have occured
        frames++

        //user can toggle pausing of animation via 'spacebar'
        if (!renderPaused) {
            setTimeout(window.requestAnimationFrame, 0, render)
        }

      }

    function createLandscape() {

        let reso = 100,

            maxW = width,
            maxH = height,

            iCount = 0;

            landscapePoints = [];

        for (let i = 0; i <= maxW; i+= reso) {
            
            let lat = i,

                jCount = 0;

            landscapePoints.push([])

            for (let j = reso; j <= maxH*2; j+= reso) {
                
                let lon = j;

                x = lat * (1 + lon/1000);
                y = lon * (.7+ lon/1000);
                // x = mapNumber(i, 0, reso, 0, maxW);
                // y = mapNumber(j, 0, reso, 0, maxH);


                z = 0//Math.random() * 10;

                point = {
                    x: x,
                    y: y,
                    z: z
                }

                rotateY(Math.PI/2.3)

                landscapePoints[iCount].push(point)

                jCount++
                
            }

            iCount++
            
        }

    }

    function renderLandscape() {

        modPoints()

        for (let i = 0; i < landscapePoints.length; i++) {
            
            for (let j = 0; j < landscapePoints[i].length; j++) {

                let p = landscapePoints[i][j];

                // console.log(p);

                    let 
                        n1 = landscapePoints[i][j+1] ? landscapePoints[i][j+1] : landscapePoints[i][0],
                        
                        n2 = landscapePoints[i+1] ? landscapePoints[i+1][j] : landscapePoints[i][j],

                        n3 = landscapePoints[i+1] && landscapePoints[i+1][j+1] ? landscapePoints[i+1][j+1] : landscapePoints[i][0];

                    if (n3 == landscapePoints[i][0] && landscapePoints[i+1]) {
                        n3 = landscapePoints[i+1][0]
                    }


                    context.beginPath()
                    context.moveTo(p.x, p.y)
                    context.lineTo(n1.x, n1.y)
                    context.lineTo(n3.x,n3.y)
                    context.lineTo(n2.x, n2.y)
                    context.lineTo(p.x, p.y)
                    context.stroke()
                
            
                // context.beginPath()
                // context.arc(p.x, p.y, 1, 0, Math.PI*2)
                // context.stroke()
                
            }
            
        }
    }

    function modPoints() {
        for (let i = 0; i < landscapePoints.length; i++) {
            
          for (let j = 0; j < landscapePoints[i].length; j++) {

              landscapePoints[i][j].y += .3;

          }
        }


        
    }

    function rotateY(radians) {
        let y = point.y,
            z = point.z;
        point.y = (y * Math.cos(radians)) + (z * Math.sin(radians) * -1.0);
        point.z = (y * Math.sin(radians)) + (z * Math.cos(radians));
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

