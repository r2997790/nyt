let mediaRecorder;
let recordedBlobs;
let countdown;
let stream = null; // To hold the media stream

document.getElementById('recordButton').addEventListener('click', toggleRecording);
document.getElementById('reloadButton').addEventListener('click', reloadPage);
document.getElementById('uploadButton').addEventListener('click', uploadVideo);

window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);

function reloadPage() {
    location.reload();
}

function checkOrientation() {
    if (window.innerWidth > window.innerHeight) {
        // Landscape mode
        document.getElementById('container').style.display = 'block';
        document.querySelector('.rotate-message').style.display = 'none';
    } else {
        // Portrait mode
        document.getElementById('container').style.display = 'none';
        document.querySelector('.rotate-message').style.display = 'flex';
    }
}

async function toggleRecording() {
    const button = document.getElementById('recordButton');

    if (!mediaRecorder || button.textContent === 'Record') {
        if (!stream) {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById('video').srcObject = stream;
        }

        recordedBlobs = [];
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();

        button.textContent = 'Stop';
        startTimer();
    } else {
        mediaRecorder.stop();
        mediaRecorder = null;
        button.textContent = 'Record';
        stopTimer();
    }
}

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function startTimer() {
    let time = 120; // 2 minutes in seconds
    countdown = setInterval(() => {
        let minutes = parseInt(time / 60, 
