'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

interface SocialPostData {
  title: string;
  subtitle: string;
  eventDate: string;
  eventTime: string;
  callToAction: string;
  hashtags: string[];
  logoUrl: string;
  backgroundType: 'gradient' | 'image' | 'solid';
  backgroundValue: string;
  textColor: string;
  accentColor: string;
  size: 'square' | 'story' | 'banner';
}

const defaultSocialData: SocialPostData = {
  title: 'Programming Bootcamp 2025',
  subtitle: 'Master Full-Stack Development',
  eventDate: 'March 15, 2025',
  eventTime: '9:00 AM',
  callToAction: 'Register Now!',
  hashtags: ['#ProgrammingBootcamp', '#WebDevelopment', '#AETech', '#TechEducation'],
  logoUrl: '/assets/Light transparent logo.png',
  backgroundType: 'gradient',
  backgroundValue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  textColor: '#ffffff',
  accentColor: '#ff6b6b',
  size: 'square'
};

const socialSizes = {
  square: { width: 800, height: 800, name: 'Instagram Square (800x800)' },
  story: { width: 720, height: 1280, name: 'Instagram Story (720x1280)' },
  banner: { width: 1200, height: 630, name: 'Facebook Banner (1200x630)' }
};

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
];

export default function SocialMediaGenerator() {
  const [socialData, setSocialData] = useState<SocialPostData>(defaultSocialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const postRef = useRef<HTMLDivElement>(null);

  const updateSocialData = (field: keyof SocialPostData, value: any) => {
    setSocialData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addHashtag = () => {
    setSocialData(prev => ({
      ...prev,
      hashtags: [...prev.hashtags, '']
    }));
  };

  const updateHashtag = (index: number, value: string) => {
    setSocialData(prev => ({
      ...prev,
      hashtags: prev.hashtags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const removeHashtag = (index: number) => {
    setSocialData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter((_, i) => i !== index)
    }));
  };

  const downloadSocialPost = async () => {
    if (!postRef.current) return;

    setIsGenerating(true);
    try {
      const size = socialSizes[socialData.size];
      const canvas = await html2canvas(postRef.current, {
        useCORS: true,
        allowTaint: true,
        width: size.width,
        height: size.height
      });

      const link = document.createElement('a');
      link.download = `${socialData.title.replace(/\s+/g, '-').toLowerCase()}-${socialData.size}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating social post:', error);
      alert('Error generating social post. Please try again.');
    }
    setIsGenerating(false);
  };

  const getPostDimensions = () => {
    const size = socialSizes[socialData.size];
    const scale = socialData.size === 'story' ? 0.3 : socialData.size === 'banner' ? 0.4 : 0.5;
    return {
      width: size.width * scale,
      height: size.height * scale
    };
  };

  const dimensions = getPostDimensions();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
      {/* Form Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white">
          Social Media Post Generator
        </h3>

        <div className="space-y-4 sm:space-y-6">
          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Post Size
            </label>
            <select
              value={socialData.size}
              onChange={(e) => updateSocialData('size', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {Object.entries(socialSizes).map(([key, size]) => (
                <option key={key} value={key}>{size.name}</option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Title
            </label>
            <input
              type="text"
              value={socialData.title}
              onChange={(e) => updateSocialData('title', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Subtitle
            </label>
            <input
              type="text"
              value={socialData.subtitle}
              onChange={(e) => updateSocialData('subtitle', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Event subtitle"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                Event Date
              </label>
              <input
                type="text"
                value={socialData.eventDate}
                onChange={(e) => updateSocialData('eventDate', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                placeholder="March 15, 2025"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                Event Time
              </label>
              <input
                type="text"
                value={socialData.eventTime}
                onChange={(e) => updateSocialData('eventTime', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                placeholder="9:00 AM"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Call to Action
            </label>
            <input
              type="text"
              value={socialData.callToAction}
              onChange={(e) => updateSocialData('callToAction', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Register Now!"
            />
          </div>

          {/* Background */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Background
            </label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {gradients.map((gradient, index) => (
                <button
                  key={index}
                  onClick={() => updateSocialData('backgroundValue', gradient)}
                  className="w-full h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500"
                  style={{ background: gradient }}
                />
              ))}
            </div>
            <textarea
              value={socialData.backgroundValue}
              onChange={(e) => updateSocialData('backgroundValue', e.target.value)}
              rows={2}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              placeholder="CSS gradient or color"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Hashtags
            </label>
            <div className="space-y-2">
              {socialData.hashtags.map((hashtag, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={hashtag}
                    onChange={(e) => updateHashtag(index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="#hashtag"
                  />
                  <button
                    onClick={() => removeHashtag(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={addHashtag}
                className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500"
              >
                + Add Hashtag
              </button>
            </div>
          </div>

          {/* Download Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadSocialPost}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-medium text-lg transition-colors duration-200"
          >
            {isGenerating ? 'Generating...' : 'Download Social Post'}
          </motion.button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white">
          Social Media Preview
        </h3>
        
        <div className="flex justify-center">
          <div
            ref={postRef}
            className="rounded-lg overflow-hidden shadow-2xl relative w-full max-w-sm sm:max-w-md"
            style={{
              width: Math.min(dimensions.width, 400),
              height: Math.min(dimensions.height, 400 * (dimensions.height / dimensions.width)),
              background: socialData.backgroundValue,
              color: socialData.textColor
            }}
          >
            {/* Content based on size */}
            {socialData.size === 'story' ? (
              // Story Layout
              <div className="h-full flex flex-col justify-between p-8">
                <div className="text-center">
                  <img
                    src={socialData.logoUrl}
                    alt="Logo"
                    className="h-16 w-auto mx-auto mb-6"
                  />
                  <h1 className="text-4xl font-bold mb-4 leading-tight">
                    {socialData.title}
                  </h1>
                  <h2 className="text-2xl mb-8 opacity-90">
                    {socialData.subtitle}
                  </h2>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg p-6 mb-6">
                    <div className="text-lg font-semibold">{socialData.eventDate}</div>
                    <div className="text-lg">{socialData.eventTime}</div>
                  </div>
                  
                  <div 
                    className="text-3xl font-bold mb-4 px-6 py-3 rounded-full inline-block"
                    style={{ backgroundColor: socialData.accentColor }}
                  >
                    {socialData.callToAction}
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {socialData.hashtags.map((tag, index) => (
                      <span key={index} className="text-sm opacity-80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : socialData.size === 'banner' ? (
              // Banner Layout
              <div className="h-full flex items-center justify-between p-8">
                <div className="flex-1">
                  <img
                    src={socialData.logoUrl}
                    alt="Logo"
                    className="h-12 w-auto mb-4"
                  />
                  <h1 className="text-3xl font-bold mb-2 leading-tight">
                    {socialData.title}
                  </h1>
                  <h2 className="text-xl mb-4 opacity-90">
                    {socialData.subtitle}
                  </h2>
                  <div className="text-lg mb-4">
                    {socialData.eventDate} • {socialData.eventTime}
                  </div>
                  <div 
                    className="text-xl font-bold px-6 py-2 rounded-lg inline-block"
                    style={{ backgroundColor: socialData.accentColor }}
                  >
                    {socialData.callToAction}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex flex-wrap justify-end gap-1">
                    {socialData.hashtags.map((tag, index) => (
                      <span key={index} className="text-sm opacity-80 block">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Square Layout
              <div className="h-full flex flex-col justify-center text-center p-8">
                <img
                  src={socialData.logoUrl}
                  alt="Logo"
                  className="h-16 w-auto mx-auto mb-6"
                />
                <h1 className="text-3xl font-bold mb-4 leading-tight">
                  {socialData.title}
                </h1>
                <h2 className="text-xl mb-6 opacity-90">
                  {socialData.subtitle}
                </h2>
                
                <div className="bg-white/20 rounded-lg p-4 mb-6">
                  <div className="text-lg font-semibold">{socialData.eventDate}</div>
                  <div className="text-lg">{socialData.eventTime}</div>
                </div>
                
                <div 
                  className="text-2xl font-bold mb-4 px-6 py-3 rounded-full inline-block"
                  style={{ backgroundColor: socialData.accentColor }}
                >
                  {socialData.callToAction}
                </div>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {socialData.hashtags.map((tag, index) => (
                    <span key={index} className="text-sm opacity-80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
