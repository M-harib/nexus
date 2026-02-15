const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'audio file required' });

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing ELEVENLABS_API_KEY' });

    // ElevenLabs “Create transcript” (batch STT)
    const form = new FormData();
    form.append('model_id', 'scribe_v2');

    // default to audio/wav if mimetype missing
    const mime = req.file.mimetype && req.file.mimetype !== 'application/octet-stream'
      ? req.file.mimetype
      : 'audio/wav';

    const blob = new Blob([req.file.buffer], { type: mime });
    form.append('file', blob, req.file.originalname || 'audio.wav');

    const resp = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: { 'xi-api-key': apiKey },
      body: form
    });

    const raw = await resp.text();

    if (!resp.ok) {
      return res.status(resp.status).json({ error: raw || `ElevenLabs error ${resp.status}` });
    }

    return res.json({ data: JSON.parse(raw) });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
