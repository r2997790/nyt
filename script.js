let mediaRecorder;
let recordedBlobs;
let countdown;

document.getElementById('recordButton').addEventListener('click', toggleRecording);
document.getElementById('reloadButton').addEventListener('click', () => location.reload());

window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);

function checkOrientation() {
    if (isMobileDevice()) {
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
}

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// ... Rest of your existing functions
