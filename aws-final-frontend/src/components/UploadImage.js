import React, { useState } from 'react';
import axios from 'axios';

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !email) {
      setMessage('Please select a file and enter your email.');
      return;
    }

    try {
      const filename = encodeURIComponent(file.name);
      const contentType = file.type;

      // Send POST request to API Gateway
      const response = await axios.post(
        'https://h43sje6zi4.execute-api.us-east-1.amazonaws.com/prod/newupload',
        { filename, contentType, email }
      );

      const { uploadURL } = response.data;
      console.log(uploadURL, response.data);
      // Upload the file to S3 using the pre-signed URL
      await axios.put(uploadURL, file, {
        headers: { 'Content-Type': file.type },
      });

      setMessage('Upload successful!');

    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Upload failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Upload Image</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <input
        type="file"
        className="block w-full p-2 mb-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
      >
        Upload
      </button>
      {message && (
        <p className={`mt-4 text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UploadImage;
