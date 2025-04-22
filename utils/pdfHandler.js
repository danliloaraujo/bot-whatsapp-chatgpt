const axios = require('axios');
const pdfParse = require('pdf-parse');

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

async function baixarPDF(mediaId) {
  try {
    const { data: mediaData } = await axios.get(
      `${WHATSAPP_API_URL}/${mediaId}`,
      { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
    );

    const { data: fileBuffer } = await axios.get(mediaData.url, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      responseType: 'arraybuffer'
    });

    const parsed = await pdfParse(fileBuffer);
    return parsed.text.trim();
  } catch (err) {
    console.error('❌ Erro ao baixar ou processar PDF:', err.message);
    return null;
  }
}

module.exports = { baixarPDF };
