/**
 * Thoroughly cleans HTML content by removing empty paragraphs and unnecessary tags
 * @param {string} html - The HTML content to clean
 * @return {string} - Cleaned HTML
 */
export const cleanHtml = (html) => {
  if (!html) return '';
  
  // First pass: remove common empty paragraph patterns
  let cleaned = html;
  
  // Array of patterns to clean
  const patterns = [
    /<p><\/p>/g,                    // Empty paragraph
    /<p>\s*<\/p>/g,                 // Paragraph with whitespace
    /<p>\s*&nbsp;\s*<\/p>/g,        // Paragraph with non-breaking space
    /<p><br\s*\/?><\/p>/g,          // Paragraph with single line break
    /<p>\s*<br\s*\/?>\s*<\/p>/g,    // Paragraph with line break and whitespace
    /<p>\s*<br\s*\/?>\s*<br\s*\/?>\s*<\/p>/g, // Paragraph with multiple breaks
    /<p>&nbsp;<\/p>/g,              // Paragraph with &nbsp;
    /<p>\s*&nbsp;\s*&nbsp;\s*<\/p>/g // Paragraph with multiple &nbsp;
  ];
  
  // First pass
  patterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Multiple passes to handle nested cases (up to 5 passes)
  for (let i = 0; i < 5; i++) {
    const before = cleaned;
    patterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '');
    });
    
    // If no changes were made in this pass, we're done
    if (before === cleaned) break;
  }
  
  // Remove consecutive breaks
  cleaned = cleaned.replace(/<br\s*\/?>\s*<br\s*\/?>/g, '<br/>');
  
  // Fix any content that starts or ends with empty paragraphs
  cleaned = cleaned.replace(/^(\s*<p>\s*<\/p>\s*)+/g, '');
  cleaned = cleaned.replace(/(\s*<p>\s*<\/p>\s*)+$/g, '');
  
  return cleaned;
}; 