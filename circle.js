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
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
var innerSpheres = 2;
var distanceBetween = 2;
var startingSize = 200;
var outerSpheres = 1;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

            geometry = new THREE.Geometry();


                for ( i = 0; i < 1500; i ++ ) {

                    var vertex1 = new THREE.Vector3();
                    vertex1.x = Math.random() * 2 - 1;
                    vertex1.y = Math.random() * 2 - 1;
                    vertex1.z = Math.random() * 2 - 1;
                    vertex1.normalize();
                    vertex1.multiplyScalar(startingSize);

                    vertex2 = vertex1.clone();
                    vertex2.multiplyScalar( Math.random() * .05 + 1 );

                    geometry.vertices.push( vertex1 );
                    geometry.vertices.push( vertex2 );

                }

                //loop to create inner spheres

                var oldLength = geometry.vertices.length;
                for(var i = 0; i < oldLength * (innerSpheres - 1); i+=2) {
                    var vertex1 = geometry.vertices[i].clone();
                    vertex1.multiplyScalar(distanceBetween);
                    vertex2 = geometry.vertices[i+1].clone();
                    vertex2.multiplyScalar(distanceBetween);
                    geometry.vertices.push(vertex1);
                    geometry.vertices.push(vertex2);
                }

                var newSize = geometry.vertices.length;

                var outerGeometry = new THREE.Geometry();

                // loop to create outer spheres

                for(var i = 0; i < oldLength * outerSpheres; i+=2) {
                    var vertex1 = geometry.vertices[newSize - i - 1].clone();
                    vertex1.multiplyScalar(distanceBetween * (Math.max(1 + distanceBetween * Math.floor(i / 1500))));
                    vertex2 = geometry.vertices[newSize - i - 2].clone();
                    vertex2.multiplyScalar(distanceBetween * (Math.max(1 + distanceBetween * Math.floor(i / 1500))));
                    outerGeometry.vertices.push(vertex1);
                    outerGeometry.vertices.push(vertex2);
                }

        var material = new THREE.LineBasicMaterial( { color: getRandomColor()} );
        var innerSphereLine = new THREE.Line( geometry, material, THREE.LinePieces );
        var outerSphereLine = new THREE.Line( outerGeometry, new THREE.LineBasicMaterial({color: 0xFFFFFF}), THREE.LinePieces);
        scene.add( innerSphereLine );
        scene.add(outerSphereLine);

       

camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 1000;
camera.lookAt({x : 0, y : 0, z : 0});

var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

var counter = 0;


function render() {
    //Get frequency data (Still don't know what "frequency" really means in terms of an integer)
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    var sumFreq= 0;

    for(var i = 0; i < dataArray.length; i++) {
        sumFreq += dataArray[i];
    }

    var averageFreq = sumFreq / dataArray.length;

    var sphereScale = averageFreq / 128;



    camera.position.y += ( - mouseY + 5 - camera.position.y ) * .05;
                camera.lookAt( scene.position );
    camera.position.x += ( - mouseX + 5 - camera.position.x ) * .05;
                camera.lookAt( scene.position );

    //console.log(mouseY);

    requestAnimationFrame( render );

    counter++;

    var vertices = innerSphereLine.geometry.vertices;
    innerSphereLine.scale.x = innerSphereLine.scale.y = innerSphereLine.scale.z = sphereScale;   





    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);



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

function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

