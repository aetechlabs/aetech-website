'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import ImageUpload from './ImageUpload';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing your blog post...',
  className = ''
}: RichTextEditorProps) {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = useCallback((text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + text.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  const handleImageUploaded = (url: string) => {
    const imageMarkdown = `\n![Image](${url})\n`;
    insertText(imageMarkdown);
    setShowImageUpload(false);
  };

  const insertMarkdown = (markdown: string, offset = 0) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText;
    if (selectedText) {
      // Wrap selected text
      newText = markdown.replace('{}', selectedText);
    } else {
      // Insert markdown template
      newText = markdown.replace('{}', '');
    }
    
    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length - offset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarButtons = [
    { label: 'Bold', action: () => insertMarkdown('**{}**', 2), icon: 'B' },
    { label: 'Italic', action: () => insertMarkdown('*{}*', 1), icon: 'I' },
    { label: 'Code', action: () => insertMarkdown('`{}`', 1), icon: '</>' },
    { label: 'Heading 1', action: () => insertMarkdown('# {}'), icon: 'H1' },
    { label: 'Heading 2', action: () => insertMarkdown('## {}'), icon: 'H2' },
    { label: 'Heading 3', action: () => insertMarkdown('### {}'), icon: 'H3' },
    { label: 'Link', action: () => insertMarkdown('[{}](url)'), icon: '🔗' },
    { label: 'Quote', action: () => insertMarkdown('> {}'), icon: '❝' },
    { label: 'List', action: () => insertMarkdown('- {}'), icon: '•' },
    { label: 'Code Block', action: () => insertMarkdown('\n```\n{}\n```\n'), icon: '{ }' },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="border border-gray-300 dark:border-gray-600 rounded-t-lg bg-gray-50 dark:bg-gray-800 p-3">
        <div className="flex flex-wrap gap-2">
          {toolbarButtons.map((button) => (
            <button
              key={button.label}
              onClick={button.action}
              className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              title={button.label}
            >
              {button.icon}
            </button>
          ))}
          
          <div className="border-l border-gray-300 dark:border-gray-600 mx-2"></div>
          
          <button
            onClick={() => setShowImageUpload(!showImageUpload)}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            📷 Image
          </button>
        </div>
      </div>

      {/* Image Upload */}
      {showImageUpload && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-4"
          />
        </motion.div>
      )}

      {/* Text Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-b-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-y focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        
        {/* Character count */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded">
          {value.length} characters
        </div>
      </div>

      {/* Preview Mode Toggle */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>💡 <strong>Tip:</strong> Use Markdown syntax for formatting. Select text and click toolbar buttons for quick formatting.</p>
      </div>
    </div>
  );
}
