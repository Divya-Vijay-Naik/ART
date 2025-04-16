// textToImage.mjs
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// For __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateImage = async (prompt) => {
  const HF_API_TOKEN = process.env.HUGGINGFACE_API_KEY;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          Accept: 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    const imageBuffer = Buffer.from(response.data, 'binary');
    const fileName = `generated_${Date.now()}.png`;
    const filePath = path.join(__dirname, 'public', fileName);

    fs.writeFileSync(filePath, imageBuffer);
    return `/` + fileName;
  } catch (err) {
    console.error('❌ Hugging Face Error:', err.response?.data || err.message);
    throw new Error('Failed to generate image using Hugging Face API');
  }
};

export default generateImage;
