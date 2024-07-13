'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import InfiniteScrollText from './InfiniteScroll';

export default function Home() {
  const [inputType, setInputType] = useState('file');
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        console.error('No File Selected.');
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

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  const handleTextSubmit = async () => {
    try {
      if (!textInput) {
        console.error('No Text Input.');
        return;
      }

      const response = await axios.post('/api/analyze', { text: textInput });

      console.log('Text analysis result:', response.data);
    } catch (error) {
      console.error('Error analyzing text:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black-800 text-white p-6  ">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">sena.ai</h1>
          <div>
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="text-red-500 font-bold mr-4"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                window.open('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1', '_blank');
              }}
            >
              Do Not Press
            </a>
          </div>
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
              <h2 className="text-4xl font-bold mb-14">
                Gain Insights with Our Powerful AI-Driven Sentiment Analysis Tool
              </h2>
              <p className="text-xl mb-10">
                Our cutting-edge AI-driven Sentiment Analysis Tool is designed to help you understand the sentiment, emotions, and PG-rated content within your URLs, text, documents, images, videos, and more.
              </p>
              <div className="bg-black-100 p-6 rounded-lg shadow-lg mb-8">
                <div className="flex justify-center mb-4">
                  <button
                    className={`px-4 py-2 rounded-r rounded-l ${inputType === 'file' ? 'bg-blue-500 text-white' : 'bg-white-200'}`}
                    onClick={() => setInputType('file')}
                  >
                    Upload File
                  </button>
                  <button
                    className={`px-4 py-2 rounded-r rounded -l ${inputType === 'text' ? 'bg-blue-500 text-white' : 'bg-white-200'}`}
                    onClick={() => setInputType('text')}
                  >
                    Enter URL/Text
                  </button>
                </div>
                {inputType === 'file' ? (
                  <div>
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
                      Upload File
                    </button>
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={textInput}
                      onChange={handleTextInputChange}
                      placeholder="Enter URL or Text"
                      className="block bg-black text-white w-full mb-4 p-2 border border-blue-300 rounded"
                      rows={4}
                    ></textarea>
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput}
                      className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    >
                      Enter URL/Text
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-black-100 py-10">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-4">
              <h3 className="text-3xl font-bold mb-8 text-left text-white">Key Features</h3>
              <ul className="space-y-4 text-left">
                <li className="p-4 bg-white shadow rounded-lg text-black">
                  <strong>Easy File Upload:</strong> Simply upload your text files in various formats, and let our AI do the rest.
                </li>
                <li className="p-4 bg-white shadow rounded-lg text-black">
                  <strong>Accurate Sentiment Analysis:</strong> Our advanced algorithms provide precise sentiment classification, identifying whether the text is positive, negative or neutral.
                </li>
                <li className="p-4 bg-white shadow rounded-lg text-black">
                  <strong>Comprehensive Insights:</strong> Gain a deeper understanding of the emotional tone of your data with detailed reports and visualizations.
                </li>
                <li className="p-4 bg-white shadow rounded-lg text-black">
                  <strong>Real-Time Processing:</strong> Get instant results, allowing you to make data-driven decisions quickly and efficiently.
                </li>
                <li className="p-4 bg-white shadow rounded-lg text-black">
                  <strong>Customizable Options:</strong> Tailor the analysis to suit your specific needs with customizable settings and parameters.
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 p-6">
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
      <footer className="bg-black-800 text-white p-6">
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
