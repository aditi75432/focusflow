/**
 * Synchronizes with popup.html button IDs: bionicToggle, simplifyPage, meetAssistant
 */
document.getElementById('bionicToggle')?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) chrome.tabs.sendMessage(tab.id, { action: "BIONIC" });
});

document.getElementById('simplifyPage')?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) chrome.tabs.sendMessage(tab.id, { action: "SIMPLIFY" });
});

document.getElementById('meetAssistant')?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) chrome.tabs.sendMessage(tab.id, { action: "MEET" });
});