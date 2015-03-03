var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();

console.log(analyser);

var song = document.getElementById("music");
var bufferLength;

song.addEventListener("canplay", function() {
    var source = audioCtx.createMediaElementSource(song);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    //This changes a few things, hard to describe. A higher count makes the sphere smaller and "smoother"
    analyser.fftSize = 1024;
    bufferLength = analyser.frequencyBinCount;
    song.play();
});

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var cubes = new Array();
for(var i = 0; i < 10; i++) {
    var row = new Array();
    for(var j = 0; j < 10; j++) {
        var hexCode = "rgb(" + i*25 + ", " + j*25 + ", " + Math.round(i*j * 2.5) + ")" ;
        console.log(hexCode);
        var geometry = new THREE.BoxGeometry( 1, 1, 1 + i + j);
        var material = new THREE.MeshBasicMaterial( { color: hexCode ,  wireframe: false} );
        var cube = new THREE.Mesh( geometry, material );
        cube.position.x = i;
        cube.position.y = j;
        row.push(cube);
        scene.add( cube );
    }
    cubes.push(row)
}

camera.position.z = 10;
camera.position.x = -2;
camera.position.y = -2;

var center = { x: 10, y : 10, z : 0}

var direction = new Array();


var counter = -120;

var origins = new Array();
for(var i = 0; i < 10; i++) {
    var originsRow = new Array();
    for(var j = 0; j < 10; j++) {
        console.log(cubes);
        originsRow.push({
            Xpos : cubes[i][j].position.x,
            Ypos : cubes[i][j].position.y
        })
    }
    origins.push(originsRow);
}

var expand = 1;

function render() {
    requestAnimationFrame( render );
    camera.lookAt(center)

    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    var sumFreq= 0;

    for(var i = 0; i < dataArray.length; i++) {
        sumFreq += dataArray[i];
    }

    var averageFreq = sumFreq / dataArray.length;

    var sphereScale = averageFreq / 64;

    expand = sphereScale;



        for(var i = 0; i < 10; i++) {
            var currRow = cubes[i];
            for(var j = 0; j < 10; j++) {
                var cube = currRow[j];
                cube.position.y = oneOrNegativeOne() * origins[i][j].Xpos * expand;
                cube.position.x = oneOrNegativeOne() * origins[i][j].Ypos * expand;
            }
        }

        var circle = 1;

        if(camera.position.z <30) {
            camera.position.z += .1;
        } else {
            camera.position.x += Math.sin(Math.PI / circle);
            camera.position.y += Math.sin(Math.PI / circle);
            camera.position.z += Math.sin(Math.PI / circle);
            console.log(camera.position.x + " X " + camera.position.y + " Y " + camera.position.z);
            circle++;
        }



    renderer.render( scene, camera );


}

render();

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function oneOrNegativeOne() {
    var rand = Math.random();
    if(rand < .5) {
        return -1;
    } else {
        return 1;
    }
}