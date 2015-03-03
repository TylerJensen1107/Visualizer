
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

//Now set up threejs
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 1000 );


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


       

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;
camera.lookAt({x : 0, y : 0, z : 0});

var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

var counter = 0;

var oldVector = new THREE.Vector3(0,0,0);

var counterMax = 100;
console.log(scene);

var xRotate = .01;
var zRotate = 0;
var yRotate = 0;
var DIFF_CONSTANT = .05;
var TIGHTNESS = 1;
var DELETE = true;

var colors = new Array();

var nextChild = 0;

for(var i = 0; i < 3; i++) {
    colors.push(getRandomColor());
}

function render() {
    //Get frequency data (Still don't know what "frequency" really means in terms of an integer)


    // camera.position.y += ( - mouseY + 5 - camera.position.y ) * .05;
    //             camera.lookAt( scene.position );
    // camera.position.x += ( - mouseX + 5 - camera.position.x ) * .05;
    //             camera.lookAt( scene.position );

    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    var sumFreq= 0;

    for(var i = 0; i < dataArray.length; i++) {
        sumFreq += dataArray[i];
    }

    var averageFreq = sumFreq / dataArray.length;

    var sphereScale = averageFreq / 32;


    requestAnimationFrame( render );

    if(counter >= counterMax) {
        counter = counter % counterMax + DIFF_CONSTANT;
        oldVector = new THREE.Vector3(0,0,0);
    } else {

        var geometry = new THREE.Geometry();
        var vector1 = oldVector;
        var vector2 = vector1.clone();
        vector2.x = (vector2.x + Math.sin(counter) / TIGHTNESS) * counter / counterMax;
        vector2.y = (vector2.y + Math.cos(counter) / TIGHTNESS) * counter / counterMax;
        oldVector = vector2;
        geometry.vertices.push(vector1);
        geometry.vertices.push(vector2);
        var material = new THREE.LineBasicMaterial({color : colors[Math.floor(Math.random() * 3)] });
        var newCube = new THREE.Line(geometry, material);


        scene.add(newCube);
        scene.rotation.z += zRotate;
        scene.rotation.x += xRotate;
        scene.rotation.y += yRotate;
        scene.scale.x = sphereScale;
        scene.scale.y = sphereScale;
        counter++;
    }

    if(DELETE) {
     if(counter >= (counterMax / 2)) {
        scene.remove(scene.children[nextChild]);
        nextChild++;
    }
    }



    renderer.render( scene, camera );


}

render();

function getRandomColor() {
    var letters = '0123CDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 8)];
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

function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

