let recording = false;
let mediaStream = null;

chrome.runtime.onMessage.addListener(async (msg) => {
    if (msg.type === 'INIT_STREAM') {
        startRecording(msg.streamId);
    } else if (msg.type === 'STOP_RECORDING') {
        stopRecording();
    }
});

async function startRecording(streamId) {
    if (recording) return;

    // 1. Capture the Tab's Audio
    mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
            mandatory: {
                chromeMediaSource: 'tab',
                chromeMediaSourceId: streamId
            }
        },
        video: false
    });

    // 2. Audio Context (Crucial to keep sound playing for you)
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(mediaStream);
    source.connect(audioCtx.destination);

    recording = true;
    console.log("FocusFlow: Recording Loop Started");

    // 3. Start the "Stop-Start" Loop
    recordSegment();
}

function recordSegment() {
    if (!recording || !mediaStream) return;

    // Create a NEW recorder for this 10-second segment
    // This ensures every chunk has a valid WebM header
    const recorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm' });
    const chunks = [];

    recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
        // Once stopped, combine chunks into a blob and upload
        if (chunks.length > 0) {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            await sendAudioToBackend(blob);
        }
        // Immediately start the next segment if we are still "active"
        if (recording) {
            recordSegment(); 
        }
    };

    // Start recording
    recorder.start();

    // Force stop after 10 seconds (triggering onstop and upload)
    setTimeout(() => {
        if (recorder.state !== 'inactive') recorder.stop();
    }, 10000); 
}

function stopRecording() {
    recording = false;
    
    // Stop the actual stream to remove the blue "Sharing" banner
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    console.log("FocusFlow: Recording Stopped");
}


async function sendAudioToBackend(audioBlob) {
    if (audioBlob.size < 1000) return; 

    const formData = new FormData();
    formData.append('audio', audioBlob, `chunk_${Date.now()}.webm`);

    try {
        // Change: Added /media/ prefix
        await fetch('http://localhost:3000/media/process-audio', {
            method: 'POST',
            body: formData
        });
        console.log("FocusFlow: Audio chunk sent to media router");
    } catch (err) {
        console.error("FocusFlow: Media Upload Error", err);
    }
}