import React from 'react';

const FeaturesSection = () => (
  <section className="bg-gray-100 py-20">
    <div className="container mx-auto text-center">
      <h3 className="text-3xl font-bold mb-8">Key Features</h3>
      <ul className="text-lg mb-8">
        <li className="mb-4"><strong>Easy File Upload:</strong> Simply upload your text files in various formats, including .txt, .csv, and .json, and let our AI do the rest.</li>
        <li className="mb-4"><strong>Accurate Sentiment Analysis:</strong> Our advanced algorithms provide precise sentiment classification, identifying whether the text is positive, negative, or neutral.</li>
        <li className="mb-4"><strong>Comprehensive Insights:</strong> Gain a deeper understanding of the emotional tone of your data with detailed reports and visualizations.</li>
        <li className="mb-4"><strong>Real-Time Processing:</strong> Get instant results, allowing you to make data-driven decisions quickly and efficiently.</li>
        <li className="mb-4"><strong>Customizable Options:</strong> Tailor the analysis to suit your specific needs with customizable settings and parameters.</li>
      </ul>
    </div>
  </section>
);

export default FeaturesSection;
