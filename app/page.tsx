'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Home() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
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
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Sena - Sentimental Analysis</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-black py-20 flex justify-center items-center">
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
                Gain Insights with Our Powerful AI-Driven Sentiment Analysis Tool
              </h2>
              <p className="text-xl mb-8">
                Discover the hidden sentiments behind your text data effortlessly. Our cutting-edge AI-driven Sentiment Analysis Tool is designed to help you understand the emotions and opinions within your documents, social media posts, customer reviews, and more.
              </p>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full mb-4 p-2 border border-blue-300 rounded"
                />
                <button
                  onClick={handleUpload}
                  disabled={!file}
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                  Upload Image
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-black-100 py-20">
          <div className="container mx-auto text-left">
            <h3 className="text-3xl font-bold mb-8">Key Features</h3>
            <ul className="text-lg mb-8">
              <li className="mb-4"><strong>Easy File Upload:</strong> Simply upload your text files in various formats, and let our AI do the rest.</li>
              <li className="mb-4"><strong>Accurate Sentiment Analysis:</strong> Our advanced algorithms provide precise sentiment classification, identifying whether the text is positive, negative, or neutral.</li>
              <li className="mb-4"><strong>Comprehensive Insights:</strong> Gain a deeper understanding of the emotional tone of your data with detailed reports and visualizations.</li>
              <li className="mb-4"><strong>Real-Time Processing:</strong> Get instant results, allowing you to make data-driven decisions quickly and efficiently.</li>
              <li className="mb-4"><strong>Customizable Options:</strong> Tailor the analysis to suit your specific needs with customizable settings and parameters.</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black-800 text-white p-4">
        <div className="container mx-auto flex justify-center">
          <p>&copy; 2024 Raptors. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
