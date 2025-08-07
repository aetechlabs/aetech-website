'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import SocialMediaGenerator from '@/components/SocialMediaGenerator';

interface FlierData {
  title: string;
  subtitle: string;
  eventType: 'Bootcamp' | 'Workshop' | 'Webinar' | 'Conference' | 'Custom';
  date: string;
  time: string;
  duration: string;
  location: string;
  description: string;
  features: string[];
  contactInfo: string;
  registrationLink: string;
  price: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  template: 'modern' | 'classic' | 'minimal' | 'bold';
}

const defaultFlierData: FlierData = {
  title: 'AETech Coding Bootcamp',
  subtitle: 'Learn to Code with Industry Experts',
  eventType: 'Bootcamp',
  date: new Date().toISOString().split('T')[0],
  time: '9:00 AM',
  duration: '8 weeks',
  location: 'AETech Research Labs, Lagos',
  description: 'Join our comprehensive coding bootcamp and transform your career with hands-on training in modern web development technologies.',
  features: [
    'Expert-led instruction',
    'Hands-on projects',
    'Career support',
    'Certificate upon completion'
  ],
  contactInfo: '+2347044400347',
  registrationLink: 'www.aetechresearchlabs.com',
  price: '₦150,000',
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff',
  accentColor: '#ef4444',
  template: 'modern'
};

export default function AnnouncementFlierGenerator() {
  const [activeTab, setActiveTab] = useState<'flier' | 'social'>('flier');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Marketing Materials Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Create professional fliers and social media posts for events and announcements
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('flier')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'flier'
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              📄 Event Fliers
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'social'
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              📱 Social Media Posts
            </button>
          </nav>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'flier' ? <FlierGenerator /> : <SocialMediaGenerator />}
        </motion.div>
      </div>
    </div>
  );
}

// Original Flier Generator Component
function FlierGenerator() {
  const [flierData, setFlierData] = useState<FlierData>(defaultFlierData);
  const [isGenerating, setIsGenerating] = useState(false);
  const flierRef = useRef<HTMLDivElement>(null);

  const updateFlierData = (field: keyof FlierData, value: any) => {
    setFlierData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = () => {
    setFlierData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFlierData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    setFlierData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const downloadFlier = async () => {
    if (!flierRef.current) return;

    setIsGenerating(true);
    try {
      // Wait a moment for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(flierRef.current, {
        useCORS: true,
        allowTaint: false,
        logging: false,
        height: 600,
        width: 400
      });

      const link = document.createElement('a');
      link.download = `${flierData.title.replace(/\s+/g, '-').toLowerCase()}-flier.png`;
      link.href = canvas.toDataURL('image/png', 0.95);
      link.click();
    } catch (error) {
      console.error('Error generating flier:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error generating flier: ${errorMessage}. Please try again.`);
    }
    setIsGenerating(false);
  };

  const getTemplateStyles = () => {
    switch (flierData.template) {
      case 'minimal':
        return {
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)',
          color: '#212529',
          accent: '#007bff'
        };
      case 'classic':
        return {
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
          color: '#ffffff',
          accent: '#fbbf24'
        };
      case 'bold':
        return {
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
          color: '#ffffff',
          accent: '#fbbf24'
        };
      default: // modern
        return {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)',
          color: '#ffffff',
          accent: '#ef4444'
        };
    }
  };

  const templateStyles = getTemplateStyles();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Announcement Flier Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Create professional announcement fliers for events and download as PNG
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              Flier Configuration
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Template
                </label>
                <select
                  value={flierData.template}
                  onChange={(e) => updateFlierData('template', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="modern">Modern Dark</option>
                  <option value="classic">Classic Blue</option>
                  <option value="minimal">Minimal Light</option>
                  <option value="bold">Bold Red</option>
                </select>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Title
                  </label>
                  <input
                    type="text"
                    value={flierData.title}
                    onChange={(e) => updateFlierData('title', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={flierData.subtitle}
                    onChange={(e) => updateFlierData('subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="Event subtitle"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Event Type
                  </label>
                  <select
                    value={flierData.eventType}
                    onChange={(e) => updateFlierData('eventType', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                  >
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Conference">Conference</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Price
                  </label>
                  <input
                    type="text"
                    value={flierData.price}
                    onChange={(e) => updateFlierData('price', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="Event price"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Date
                  </label>
                  <input
                    type="date"
                    value={flierData.date}
                    onChange={(e) => updateFlierData('date', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Time
                  </label>
                  <input
                    type="text"
                    value={flierData.time}
                    onChange={(e) => updateFlierData('time', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="9:00 AM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={flierData.duration}
                    onChange={(e) => updateFlierData('duration', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="8 weeks"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Location
                </label>
                <input
                  type="text"
                  value={flierData.location}
                  onChange={(e) => updateFlierData('location', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                  placeholder="Event location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Description
                </label>
                <textarea
                  value={flierData.description}
                  onChange={(e) => updateFlierData('description', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                  placeholder="Event description"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Key Features
                </label>
                <div className="space-y-2">
                  {flierData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Feature"
                      />
                      <button
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addFeature}
                    className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Contact Info
                  </label>
                  <input
                    type="text"
                    value={flierData.contactInfo}
                    onChange={(e) => updateFlierData('contactInfo', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Registration Link
                  </label>
                  <input
                    type="text"
                    value={flierData.registrationLink}
                    onChange={(e) => updateFlierData('registrationLink', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="Website URL"
                  />
                </div>
              </div>

              {/* Download Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadFlier}
                disabled={isGenerating}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-medium text-lg transition-colors duration-200"
              >
                {isGenerating ? 'Generating...' : 'Download PNG'}
              </motion.button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              Live Preview
            </h2>
            
            <div className="flex justify-center">
              <div
                ref={flierRef}
                className="relative w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px]"
                style={{
                  aspectRatio: '2/3',
                  background: templateStyles.background,
                  color: templateStyles.color,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Header */}
                <div style={{ padding: '24px', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                      {flierData.eventType.toUpperCase()}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: templateStyles.accent }}>
                        {flierData.price}
                      </div>
                    </div>
                  </div>
                  
                  <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', lineHeight: '1.2' }}>
                    {flierData.title}
                  </h1>
                  <h2 style={{ fontSize: '18px', opacity: 0.9, marginBottom: '16px' }}>
                    {flierData.subtitle}
                  </h2>
                </div>

                {/* Date & Time */}
                <div style={{ padding: '16px 24px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                    <div>
                      <div style={{ opacity: 0.7, fontSize: '12px' }}>DATE</div>
                      <div style={{ fontWeight: 600 }}>
                        {new Date(flierData.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div style={{ opacity: 0.7, fontSize: '12px' }}>TIME</div>
                      <div style={{ fontWeight: 600 }}>{flierData.time}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ opacity: 0.7, fontSize: '12px' }}>DURATION</div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{flierData.duration}</div>
                  </div>
                </div>

                {/* Description */}
                <div style={{ padding: '24px', paddingBottom: '16px', flex: '1' }}>
                  <p style={{ fontSize: '14px', lineHeight: '1.5', opacity: 0.9, marginBottom: '16px' }}>
                    {flierData.description}
                  </p>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '8px' }}>LOCATION</div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{flierData.location}</div>
                  </div>

                  {/* Features */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '8px' }}>WHAT YOU'LL GET</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {flierData.features.slice(0, 4).map((feature, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                          <div 
                            style={{ 
                              width: '6px', 
                              height: '6px', 
                              borderRadius: '50%', 
                              marginRight: '8px',
                              backgroundColor: templateStyles.accent 
                            }}
                          />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: 'auto', padding: '24px', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px', color: templateStyles.accent }}>
                      AETech Research Labs
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
                      📞 {flierData.contactInfo}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>
                      🌐 {flierData.registrationLink}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
