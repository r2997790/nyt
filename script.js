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

    if (!stream || button.textContent === 'Record') {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById('video').srcObject = stream;

        recordedBlobs = [];
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
        startTimer();

        button.textContent = 'Stop';
    } else {
        mediaRecorder.stop();
        button.textContent = 'Record';
        stopTimer();
        replaceVideoWithBlackRectangle();
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
        let minutes = parseInt(time / 60, 10);
        let seconds = parseInt(time % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('timer').textContent = minutes + ":" + seconds;

        if (--time < 0) {
            toggleRecording();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(countdown);
    document.getElementById('timer').textContent = '02:00';
    document.getElementById('uploadButton').style.display = 'block'; // Show the upload button
}

function replaceVideoWithBlackRectangle() {
    const video = document.getElementById('video');
    video.style.backgroundColor = 'black';
    video.srcObject = null;
    stream.getTracks().forEach(track => track.stop());
    stream = null;
}

function uploadVideo() {
    const videoBlob = new Blob(recordedBlobs, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('video', videoBlob, 'recorded_video.webm');

    fetch('https://www.inlineeducation.com/ul/', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Upload failed');
        }
    }).then(data => {
        alert('Upload successful: ' + data);
    }).catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    });
}
