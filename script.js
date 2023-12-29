let mediaRecorder;
let recordedBlobs;
let countdown;
let stream; // To hold the media stream

document.getElementById('recordButton').addEventListener('click', toggleRecording);
document.getElementById('reloadButton').addEventListener('click', () => location.reload());

window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);

function checkOrientation() {
    if (window.innerWidth > window.innerHeight) {
        // Landscape mode
        document.getElementById('container').style.display = 'block';
        document.querySelector('.rotate-message').style.display = 'none';
    } else {
        // Portrait mode
        document.getElementById('container').style.display = 'none';
        document.querySelector('.rotate-message').textContent = 'Please rotate your screen';
        document.querySelector('.rotate-message').style.display = 'flex';
    }
}


async function toggleRecording() {
    const button = document.getElementById('recordButton');
    const videoElement = document.getElementById('video');

    if (button.textContent === 'Record') {
        if (!stream) {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        }
        videoElement.srcObject = stream;
        videoElement.muted = true; // Mute playback to prevent feedback
        startRecording(stream);
        button.textContent = 'Stop';
    } else {
        stopRecording();
        videoElement.muted = false; // Unmute playback after recording
        button.textContent = 'Record';
        pauseCamera();
    }
}


function pauseCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function startRecording(stream) {
    recordedBlobs = [];
    let options = { mimeType: 'video/webm;codecs=vp9' };
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    startTimer();
}

function stopRecording() {
    mediaRecorder.stop();
    clearInterval(countdown);
    document.getElementById('timer').textContent = '02:00';

    const videoBlob = new Blob(recordedBlobs, { type: 'video/webm' });
    const url = window.URL.createObjectURL(videoBlob);

    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = 'recorded_video.webm';
    downloadLink.style.display = 'block';
    downloadLink.addEventListener('click', () => {
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);
    });

    replaceVideoWithBox();
}

function replaceVideoWithBox() {
    const video = document.getElementById('video');
    const box = document.createElement('div');
    box.style.width = video.offsetWidth + 'px';
    box.style.height = video.offsetHeight + 'px';
    box.style.backgroundColor = 'black'; // Or any color you prefer
    video.replaceWith(box);
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
