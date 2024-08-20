require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const FormData = require("form-data"); // form-data 패키지 가져오기

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer();

const PORT = 5000;
app.post("/proxy/clova-ocr", upload.single("file"), async (req, res) => {
  console.log("REQ ", req.body);
  console.log("FILE", req.file);
  try {
    const file = req.file;
    const message = req.body.message;

    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);
    formData.append("message", message);

    const response = await axios.post(
      "https://xxgd8dxe4a.apigw.ntruss.com/custom/v1/33611/92da9789e83aabebffca1dc20aed02fe7c9806fcc16a771660ce385ab927c322/document/receipt",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-OCR-SECRET": "S2ZPa2VNbWtvbFBGU1B2WmxLc1hDVldLZlJsZ05vREE=",
        },
        timeout: 5000,
      }
    );

    console.log(response.data);
    res.json(response.data);
  } catch (err) {
    console.error("Error making request to Clova OCR API:", err);
    res.status(err.response ? err.response.status : 500).json({
      message: "Failed to process OCR",
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
