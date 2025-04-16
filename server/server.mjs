// server.mjs
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import mongoose from 'mongoose';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const outputDir = path.join(__dirname, 'public');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
app.use(express.static(outputDir));

// MongoDB setup
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aiartdb';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// Schema
const artSchema = new mongoose.Schema({
  prompt: String,
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Art = mongoose.model('Art', artSchema);

// Hugging Face API setup
const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

const HF_API_KEY = process.env.HF_API_KEY;

async function generateImageFromHuggingFace(prompt) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: prompt })
  });

  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    const errText = await response.text();
    if (contentType && contentType.includes('application/json')) {
      const errJson = JSON.parse(errText);
      if (errJson.error && errJson.error.includes('loading')) {
        throw new Error("Model is still loading. Please wait a few seconds and try again.");
      }
    }
    throw new Error(`Hugging Face API error: ${errText}`);
  }

  if (!contentType || !contentType.includes('image')) {
    const errText = await response.text();
    throw new Error(`Unexpected response: ${errText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// POST /api/generate
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const imageBuffer = await generateImageFromHuggingFace(prompt);
    const filename = `generated_${Date.now()}.png`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, imageBuffer);

    const imageUrl = `http://localhost:${process.env.PORT || 5000}/${filename}`;
    const newArt = new Art({ prompt, imageUrl });
    await newArt.save();

    res.json({ imageUrl });
  } catch (err) {
    console.error('❌ Error generating image:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const artworks = await Art.find().sort({ createdAt: -1 });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
