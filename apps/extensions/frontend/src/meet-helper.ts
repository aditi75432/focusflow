const toggleMeetingAssistant = () => {
  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRec) return;

  const recognition = new SpeechRec();
  recognition.continuous = true;
  recognition.onresult = (event: any) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    console.log("Live Transcript Buffer:", transcript);
  };
  recognition.start();
};