/**
 * Custom Quill module that prevents empty blocks directly when editing
 */
export default class EmptyBlockPreventer {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    
    // Watch for text-change events
    this.quill.on('text-change', this.cleanup.bind(this));
    
    // Also run when focusing out of the editor (blur)
    this.quill.root.addEventListener('blur', this.finalCleanup.bind(this));
  }
  
  cleanup() {
    // Get the editor contents
    const contents = this.quill.getContents();
    
    // Check if we have empty operations
    if (contents && contents.ops) {
      let modified = false;
      const newOps = contents.ops.filter(op => {
        // Keep operations that actually have content
        if (op.insert && typeof op.insert === 'string') {
          const trimmed = op.insert.trim();
          return trimmed !== '' && trimmed !== '\n';
        }
        return true;
      });
      
      if (newOps.length !== contents.ops.length) {
        modified = true;
        this.quill.setContents(newOps);
      }
    }
  }
  
  finalCleanup() {
    // Get HTML and clean it
    const html = this.quill.root.innerHTML;
    
    // Clean out empty paragraphs
    const cleanedHtml = html
      .replace(/<p><\/p>/g, '')
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/<p><br><\/p>/g, '')
      .replace(/<p><br\/><\/p>/g, '')
      .replace(/<p>&nbsp;<\/p>/g, '');
    
    // Set back the cleaned HTML directly into the editor
    if (cleanedHtml !== html) {
      this.quill.root.innerHTML = cleanedHtml;
    }
  }
} 