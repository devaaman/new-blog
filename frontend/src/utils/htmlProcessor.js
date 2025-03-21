/**
 * A global HTML processor that thoroughly removes all types of empty paragraphs
 * before content is rendered
 */

// This runs at the DOM level to remove any empty paragraphs directly
export const setupEmptyParagraphRemover = () => {
  // Run once on page load
  removeEmptyParagraphs();
  
  // Set up a MutationObserver to catch dynamically added content
  const observer = new MutationObserver(() => {
    removeEmptyParagraphs();
  });
  
  // Start observing the document for added nodes
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  // Function to remove empty paragraphs from the DOM
  function removeEmptyParagraphs() {
    // Get all paragraphs
    const paragraphs = document.querySelectorAll('p');
    
    paragraphs.forEach(p => {
      // Check if paragraph is empty or only contains whitespace/breaks
      if (
        !p.textContent.trim() || // Empty or whitespace only
        p.innerHTML === '&nbsp;' || // Non-breaking space
        p.innerHTML === '<br>' || // Single break
        p.innerHTML === '<br/>' || // Single break (self-closing)
        p.innerHTML.match(/^\s*(<br\s*\/?>\s*)+\s*$/) // Only breaks with whitespace
      ) {
        p.remove(); // Directly remove from DOM
      }
    });
  }
}; 