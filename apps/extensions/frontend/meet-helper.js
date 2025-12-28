"use strict";
const toggleMeetingAssistant = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec)
        return;
    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log("Live Transcript Buffer:", transcript);
    };
    recognition.start();
};
