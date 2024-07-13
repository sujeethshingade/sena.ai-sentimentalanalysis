import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <section className="relative bg-white py-20 flex justify-center items-center">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="md:w-1/2 p-4">
          <motion.img
            src="/path-to-your-image.png"
            alt="Hero Image"
            className="w-full max-w-md mx-auto mb-8 md:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />
        </div>
        <div className="md:w-1/2 p-4">
          <h2 className="text-4xl font-bold mb-4">
            Upload Your Files and Gain Insights with Our Powerful AI-Driven Sentiment Analysis Tool
          </h2>
          <p className="text-xl mb-8">
            Discover the hidden sentiments behind your text data effortlessly. Our cutting-edge AI-driven Sentiment Analysis Tool is designed to help you understand the emotions and opinions within your documents, social media posts, customer reviews, and more.
          </p>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="block w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <button 
              onClick={handleUpload} 
              disabled={!file}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Upload Image
            </button>
            <p className="text-sm text-gray-500 mt-2">or drop a file, paste image or <a href="#" className="text-blue-500 underline">URL</a></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
