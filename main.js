var canvas;
var context;

var level = document.querySelector('#level span');
var levelCount = 1;

var imgFace = document.getElementById("face");

var x = 0;
var y = 0;

var dx = 0;
var dy = 0;

window.onload = function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    drawMaze(mazePath(levelCount));

    window.onkeydown = processKey;
};

function mazePath(levelCount) {
    return 'images/maze' + levelCount*5 + '.png';
}

function drawMaze(mazeFile) {
    var imgMaze = new Image();
    imgMaze.onload = function() {
        
        canvas.width = imgMaze.width;
        canvas.height = imgMaze.height;

        context.drawImage(imgMaze, 0,0);

        x = startPoint();
        y = 1;

        context.drawImage(imgFace, x, y);
        context.stroke();

    };
    imgMaze.src = mazeFile;
}

function startPoint() {
    var imgData = context.getImageData(0, 0, canvas.width, 2);
    var pixels = imgData.data;

    for (var i = 0, n = pixels.length; i < n; i += 4) {
        var red = pixels[i];
        var green = pixels[i+1];
        var blue = pixels[i+2];
        var alpha = pixels[i+3];

        if (red == 255 && green == 255 && blue == 255) {
            return i/4 + 1;
        }
    }
}

function processKey(e) {
    dx = 0;
    dy = 0;

    // up
    if (e.keyCode == 38) {
        dy = -1;
    }

    // down
    if (e.keyCode == 40) {
        dy = 1;
    }

    // left
    if (e.keyCode == 37) {
        dx = -1;
    }

    // right
    if (e.keyCode == 39) {
        dx = 1;
    }

    drawFrame(e.keyCode)
}

function checkForCollision(z) {
    var imgData = context.getImageData(x, y, z, z);
    var pixels = imgData.data;

    for (var i = 0, n = pixels.length; i < n; i += 4) {
        var red = pixels[i];
        var green = pixels[i+1];
        var blue = pixels[i+2];
        var alpha = pixels[i+3];

        if (red == 0 && green == 0 && blue == 0) {
            return true;
        }
    }

    return false;
}


function drawFrame(code) {
    if (dx != 0 || dy != 0) {
        context.beginPath();
        context.fillStyle = "#fcffa5";
        context.rect(x, y, 11, 11);
        context.fill();

        x += dx;
        y += dy;

        if ((code == 38 || code == 40) && checkForCollision(11)) {
            x -= dx;
            y -= dy;
            dx = 0;
            dy = 0;
        }

        if ((code == 37 || code == 39) && checkForCollision(11)) {
            x -= dx;
            y -= dy;
            dx = 0;
            dy = 0;
        }

        var imgFace = document.getElementById("face");
        context.drawImage(imgFace, x, y);

        if (y >= (canvas.height - 11)) {
            swal({
                title: "Level " + levelCount + " completed!",
                icon: "success",
                button: "Next level",
            });
            levelCount++;

            if(levelCount < 6) {
                level.innerHTML = levelCount;

                canvas = document.getElementById("canvas");
                context = canvas.getContext("2d");

                drawMaze(mazePath(levelCount));

                window.onkeydown = processKey;
            } else {
                 swal({
                    title: "You win!",
                });
            }

        }
    }

}
