import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { cleanHtml } from '../utils/cleanHtml';

const SanitizedContent = ({ html, className = '' }) => {
  const contentRef = useRef(null);
  
  // Clean the HTML
  const sanitizedHtml = DOMPurify.sanitize(cleanHtml(html));
  
  useEffect(() => {
    // Additional client-side cleaning after mounting
    if (contentRef.current) {
      // Get all empty paragraphs and remove them
      const emptyParagraphs = contentRef.current.querySelectorAll('p:empty, p:only-child > br, p:only-child > &nbsp;');
      emptyParagraphs.forEach(p => p.remove());
    }
  }, [html]);
  
  return (
    <div 
      ref={contentRef}
      className={`sanitized-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default SanitizedContent; 