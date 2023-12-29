let mediaRecorder;
let recordedBlobs;
let countdown;

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
        document.querySelector('.rotate-message').style.display = 'block';
    }
}

async function toggleRecording() {
    const button = document.getElementById('recordButton');
    if (button.textContent === 'Record') {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById('video').srcObject = stream;
            startRecording(stream);
            button.textContent = 'Stop';
        } catch (error) {
            console.error('Error accessing media devices:', error);
            alert('Could not access the camera and microphone.');
        }
    } else {
        stopRecording();
        button.textContent = 'Record';
    }
}

// ... Rest of the existing functions (handleDataAvailable, startRecording, stopRecording, startTimer)
