'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import InfiniteScrollText from './InfiniteScroll';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        console.error('No file selected.');
        return;
      }

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
        <div className="container mx-auto flex justify-center items-center">
          <h1 className="text-xl font-bold">sena.ai</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-black py-20 flex justify-center items-center">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left">
            <div className="md:w-1/2 p-4">
              <motion.img
                src="https://cdn.dribbble.com/users/119773/screenshots/4226968/media/98182f9f4afd3cff228e47fe62cdbd5c.gif"
                alt="Hero Image"
                className="w-full max-w-lg mx-auto mb-8 md:mb-0 rounded-lg"
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
                  Upload Files
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-black-100 py-20">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-4">
              <h3 className="text-3xl font-bold mb-8 text-left">Key Features</h3>
              <ul className="space-y-4 text-left">
                <li className="p-4 bg-white shadow rounded-lg">
                  <strong>Easy File Upload:</strong> Simply upload your text files in various formats, and let our AI do the rest.
                </li>
                <li className="p-4 bg-white shadow rounded-lg">
                  <strong>Accurate Sentiment Analysis:</strong> Our advanced algorithms provide precise sentiment classification, identifying whether the text is positive, negative or neutral.
                </li>
                <li className="p-4 bg-white shadow rounded-lg">
                  <strong>Comprehensive Insights:</strong> Gain a deeper understanding of the emotional tone of your data with detailed reports and visualizations.
                </li>
                <li className="p-4 bg-white shadow rounded-lg">
                  <strong>Real-Time Processing:</strong> Get instant results, allowing you to make data-driven decisions quickly and efficiently.
                </li>
                <li className="p-4 bg-white shadow rounded-lg">
                  <strong>Customizable Options:</strong> Tailor the analysis to suit your specific needs with customizable settings and parameters.
                </li>
              </ul>
            </div>

            <div className="md:w-1/2 p-4">
              <motion.img
                src="https://miro.medium.com/v2/1*_JW1JaMpK_fVGld8pd1_JQ.gif"
                alt="Hero Image"
                className="w-full max-w-lg mx-auto mb-8 md:mb-0 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
              />
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-black-800 text-white p-4">
      <div>
        <InfiniteScrollText />
      </div>
        <div className="container mx-auto flex justify-center">
          <p>&copy; 2024 Raptors. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
