let dashboard = null;
let bionicActive = false;
let transcriptText = "";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'RECORDING_STATUS') {
        if (msg.status === 'active') { createDashboard(); }
        else { if (dashboard) dashboard.remove(); dashboard = null; }
    }
});

function createDashboard() {
    if (dashboard) return;
    dashboard = document.createElement('div');
    dashboard.className = "ff-dashboard"; 
    
    dashboard.style.cssText = `
        position: fixed; bottom: 80px; right: 20px;
        width: 450px; height: 550px; background: white;
        border: 2px solid #10a37f; border-radius: 12px;
        z-index: 2147483647; display: flex; flex-direction: column;
        resize: both; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;

    dashboard.innerHTML = `
        <div class="ff-header">
            <span>FocusFlow Meet Assistant</span>
            <label style="font-size:12px;"><input type="checkbox" id="meet-bionic"> Bionic</label>
        </div>
        <div class="ff-tabs">
            <button id="t-a" class="active">Live Feed</button>
            <button id="t-b">Smart Nuggets</button>
            <button id="t-c">Assistant</button>
        </div>
        <div id="ff-meet-body">
            <div id="v-a" class="view">Waiting for audio stream...</div>
            <div id="v-b" class="view" style="display:none;">
                <select id="nugget-format" style="margin-bottom:10px; width: 100%;">
                    <option value="bullets">Bullets</option>
                    <option value="para">Paragraph</option>
                    <option value="flowchart">Logic Steps</option>
                </select>
                <div id="nugget-content">Analyzing...</div>
            </div>
            <div id="v-c" class="view" style="display:none;">
                <div id="meet-chat-history" style="height:300px; overflow-y:auto; border-bottom:1px solid #eee; margin-bottom:10px;"></div>
                <input type="text" id="meet-chat-input" placeholder="Ask about the lecture..." style="width:100%; box-sizing:border-box; padding:8px;">
            </div>
        </div>
    `;
    document.body.appendChild(dashboard);
    setupDashboardActions();
}

function setupDashboardActions() {
    document.getElementById('meet-bionic').onchange = (e) => {
        bionicActive = e.target.checked;
        updateFeedUI();
    };

    const tabs = ['t-a', 't-b', 't-c'];
    tabs.forEach(id => {
        document.getElementById(id).onclick = () => {
            tabs.forEach(t => {
                document.getElementById(t).classList.remove('active');
                document.getElementById('v-' + t.split('-')[1]).style.display = 'none';
            });
            document.getElementById(id).classList.add('active');
            document.getElementById('v-' + id.split('-')[1]).style.display = 'block';
        };
    });

    setInterval(syncMeetData, 30000);
}

async function syncMeetData() {
    const format = document.getElementById('nugget-format')?.value || 'bullets';
    try {
        const res = await fetch(`http://localhost:3000/media/meeting-summary?format=${format}`);
        const data = await res.json();
        if (data.fullTranscript) transcriptText = data.fullTranscript;
        if (data.reply) {
            const nuggetBox = document.getElementById('nugget-content');
            nuggetBox.innerHTML = bionicActive ? applyBionic(data.reply) : data.reply;
        }
        updateFeedUI();
    } catch (e) { console.error("Meet Sync Failed", e); }
}

function updateFeedUI() {
    const feed = document.getElementById('v-a');
    if (feed) feed.innerHTML = bionicActive ? applyBionic(transcriptText) : transcriptText;
}

function applyBionic(text) {
    if (!text) return "";
    return text.split(/([\s\n]+)/).map(w => {
        if (w.trim().length < 2) return w;
        const m = Math.ceil(w.length / 2);
        return `<b>${w.slice(0, m)}</b>${w.slice(m)}`;
    }).join('').replace(/\n/g, '<br>');
}
// badge logic

// function showBadge() {
//     if (badge) return;
    
//     badge = document.createElement('div');
//     badge.innerText = "🔴 FocusFlow Listening";
//     badge.style.cssText = `
//         position: fixed; bottom: 80px; left: 20px;
//         background: #dc2626; color: white; padding: 12px 24px;
//         border-radius: 50px; font-family: sans-serif; font-weight: bold;
//         z-index: 10000; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
//         display: flex; align-items: center; gap: 10px;
//         animation: pulse 2s infinite; cursor: pointer;
//     `;
    
//     badge.onclick = () => {
//         chrome.runtime.sendMessage({ type: 'STOP_RECORDING' });
//         hideBadge();
//     };

//     document.body.appendChild(badge);
// }

// function hideBadge() {
//     if (badge) {
//         badge.remove();
//         badge = null;
//     }
// }

// const style = document.createElement('style');
// style.innerHTML = `
// @keyframes pulse {
//     0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
//     70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
//     100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
// }`;
// document.head.appendChild(style);