/**
 * Custom formatter for ReactQuill that prevents empty paragraphs
 */
export const preventEmptyParagraphs = (delta) => {
  // Check if delta operations create empty paragraphs
  const ops = delta.ops;
  
  // If we have an insert with just a newline or empty string, modify it
  if (ops && ops.length === 1 && ops[0].insert) {
    const text = ops[0].insert;
    if (text === '\n' || text === '') {
      // Don't create an empty paragraph
      return delta;
    }
  }
  
  return delta;
}; 