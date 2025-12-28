const applyBionic = () => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentNode as HTMLElement;
    if (['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA'].includes(parent.tagName)) continue;

    const words = node.nodeValue?.split(/\s+/) || [];
    const html = words.map(word => {
      const mid = Math.ceil(word.length / 2);
      return `<b style="font-weight:700; color:black;">${word.slice(0, mid)}</b>${word.slice(mid)}`;
    }).join(' ');

    const span = document.createElement('span');
    span.innerHTML = html;
    parent.replaceChild(span, node);
  }
};

const simplifyContent = async () => {
  const text = document.body.innerText.slice(0, 3000);
  try {
    const response = await fetch("http://localhost:4000/api/extension/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, mode: "SOCRATIC" })
    });
    const result = await response.json();
    
    let overlay = document.getElementById('ff-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'ff-overlay';
      document.body.appendChild(overlay);
    }
    overlay.innerText = `ADHD Insight: ${result.transformedContent}`;
  } catch (e) {
    console.error("FocusFlow Engine unreachable on port 4000.");
  }
};

/**
 * Capture live audio for meeting translation using Web Speech API
 */
const captureLiveMeet = () => {
  const SpeechRec = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
  if (!SpeechRec) return;

  const recognition = new SpeechRec();
  recognition.continuous = true;
  recognition.onresult = (event: any) => {
    const text = event.results[event.results.length - 1][0].transcript;
    console.log("Live Sync Transcript:", text);
  };
  recognition.start();
};

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "BIONIC") applyBionic();
  if (msg.action === "SIMPLIFY") simplifyContent();
  if (msg.action === "MEET") captureLiveMeet();
});