import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      icon: '👁️',
      title: 'Smart Analysis',
      description: 'Our AI analyzes your image to identify brightness, contrast, and quality issues automatically'
    },
    {
      icon: '🧠',
      title: 'AI Decision Making',
      description: 'Advanced algorithms determine the optimal enhancement strategy for each unique image'
    },
    {
      icon: '✨',
      title: 'Multiple Options',
      description: 'Get three different enhancement versions to choose the perfect one for your needs'
    },
    {
      icon: '☀️',
      title: 'Brightness Optimization',
      description: 'Intelligently adjusts lighting to bring out details without overexposure'
    },
    {
      icon: '🎨',
      title: 'Dynamic Contrast',
      description: 'Enhances contrast to make your images more vibrant and appealing'
    },
    {
      icon: '🎯',
      title: 'Smart Generation',
      description: 'Automatically generates titles and descriptions for your enhanced images'
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <h2>How Our AI System Works</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 