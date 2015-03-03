var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();


var song = document.getElementById("music");
var bufferLengthLength;

song.addEventListener("canplay", function() {
    var source = audioCtx.createMediaElementSource(song);
    //source.connect(audioCtx.destination);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 32;
    bufferLength = analyser.frequencyBinCount;
    // var gain = audioCtx.createGain();
    // var biquad = audioCtx.createBiquadFilter();
    // analyser.connect(biquad);
    // biquad.type = "normal";
    // biquad.detune.value = 0;
    // biquad.frequency.exponentialRampToValueAtTime = (24000, 5);
    // biquad.connect(gain);
    // gain.gain.exponentialRampToValueAtTime(10, 5);
    // console.log(biquad);
    //gain.connect(audioCtx.destination);
    song.play();
    update();
});


function update() {
  requestAnimationFrame(update);

      var dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    console.log(dataArray);




}
