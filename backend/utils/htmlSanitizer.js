/**
 * Advanced HTML sanitizer to deeply clean blog content
 */
const sanitizeHtml = (html) => {
  if (!html) return '';
  
  let cleaned = html;
  
  // Multiple iterations of replacements to catch nested patterns
  for (let i = 0; i < 5; i++) {
    const beforeCleaning = cleaned;
    
    // Replace all forms of empty paragraphs
    cleaned = cleaned
      // Empty paragraph
      .replace(/<p><\/p>/g, '')
      // Paragraph with whitespace
      .replace(/<p>\s*<\/p>/g, '')
      // Paragraph with non-breaking space
      .replace(/<p>&nbsp;<\/p>/g, '')
      // Multiple non-breaking spaces
      .replace(/<p>(&nbsp;\s*){1,}<\/p>/g, '')
      // Paragraph with single break
      .replace(/<p><br\s*\/?><\/p>/g, '')
      // Paragraph with break and whitespace
      .replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, '')
      // Paragraph with multiple breaks
      .replace(/<p>(<br\s*\/?>\s*){1,}<\/p>/g, '')
      // Combined patterns
      .replace(/<p>\s*(&nbsp;\s*)*(<br\s*\/?>\s*)*(&nbsp;\s*)*<\/p>/g, '');
    
    // If no changes were made, stop processing
    if (beforeCleaning === cleaned) {
      break;
    }
  }
  
  // Clean consecutive breaks
  cleaned = cleaned.replace(/(<br\s*\/?>\s*){2,}/g, '<br/>');
  
  // Remove empty paragraphs at the beginning and end
  cleaned = cleaned.replace(/^(\s*<p>\s*<\/p>\s*)+/g, '');
  cleaned = cleaned.replace(/(\s*<p>\s*<\/p>\s*)+$/g, '');
  
  return cleaned;
};

module.exports = sanitizeHtml; 