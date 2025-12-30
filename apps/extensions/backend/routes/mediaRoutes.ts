import express from 'express';
import multer from 'multer';
import fs from 'fs';
import Groq from 'groq-sdk';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const getGroqClient = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

let meetingTranscript = "";

// Handles incoming audio segments from Google Meet
router.post('/process-audio', upload.single('audio'), async (req: any, res: any) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No audio" });
        const groq = getGroqClient();
        const newPath = req.file.path + '.webm';
        fs.renameSync(req.file.path, newPath);
        
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(newPath),
            model: "whisper-large-v3-turbo",
            response_format: "json",
        });
        
        fs.unlinkSync(newPath);
        const text = transcription.text.trim();
        if (text) meetingTranscript += " " + text;
        
        res.json({ text: text, fullTranscript: meetingTranscript });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// PHASE 1: SMART NUGGETS (For Meet Assistant Tab B)
router.get('/meeting-summary', async (req: any, res: any) => {
    const { format } = req.query; // 'bullets', 'para', or 'flowchart'
    
    if (meetingTranscript.trim().length < 50) {
        return res.json({ reply: "Listening for lecture content...", fullTranscript: meetingTranscript });
    }

    try {
        const groq = getGroqClient();
        const recentSnippet = meetingTranscript.slice(-4000);

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { 
                    role: "system", 
                    content: `You are an ADHD study coach. Create a ${format || 'bulleted'} summary of this lecture segment. 
                    Use bolding for keywords. If 'flowchart' is requested, use a step-by-step logic list. 
                    Avoid long walls of text.` 
                },
                { role: "user", content: `Transcript: ${recentSnippet}` }
            ]
        });

        res.json({ 
            reply: response.choices[0]?.message?.content, 
            fullTranscript: meetingTranscript 
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;