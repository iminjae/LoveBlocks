import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

const ClovaOCR: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);
    

    try {
      const response = await axios.post('http://localhost:5001/api/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      setError(null); // Reset any previous error
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error: ${err.message}`);
        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
        }
      } else {
        setError('Unexpected error occurred');
        console.error('Unexpected error:', err);
      }
    }
  };

  return (
    <div>
      <h1>Clova OCR 영수증 인식</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleSubmit}>이미지 업로드 및 인식</button>

      {error && (
        <div style={{ color: 'red' }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div>
          <h2>인식 결과:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ClovaOCR;
