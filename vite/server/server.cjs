const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/ocr', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).send('No image uploaded');
    }

    const imagePath = file.path;
    const image = fs.readFileSync(imagePath); 
    const encodedImage = Buffer.from(image).toString('base64'); 
  
    const response = await axios.post('https://ocr.apigw.ntruss.com/v1/receipt', {
      images: [
        {
          format: 'jpg,jpeg', 
          name: 'receipt',
          data: encodedImage,
        },
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-OCR-SECRET': 'cHZmVlNMYVhsQ1lZT0NDUmJ6VlNCaGZoeXdwbWFHY1E=', 
      },
    });

    fs.unlinkSync(imagePath); 

    res.json(response.data); 
  } catch (error) {
    console.error('Error during OCR request:', error);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
