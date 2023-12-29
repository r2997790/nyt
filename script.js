let mediaRecorder;
let recordedBlobs;
let countdown;

document.getElementById('recordButton').addEventListener('click', toggleRecording);
document.getElementById('reloadButton').addEventListener('click', () => location.reload());

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
}

async function toggleRecording() {
    const button = document.getElementById('recordButton');
    if (button.textContent === 'Record') {
        button.textContent = 'Stop';
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById('video').srcObject = stream;
        startRecording(stream);
    } else {
        button.textContent = 'Record';
        stopRecording();
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
