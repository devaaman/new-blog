import React, { useState, useEffect } from 'react';

const TableOfContents = ({ contentRef }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Get all headings from the content
    const headingElements = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const headingsData = Array.from(headingElements).map(heading => {
      // Add IDs to headings if they don't have one
      if (!heading.id) {
        heading.id = heading.textContent.toLowerCase().replace(/\s+/g, '-');
      }
      
      return {
        id: heading.id,
        text: heading.textContent,
        level: parseInt(heading.tagName.substring(1)) // Get heading level (1 for h1, 2 for h2, etc.)
      };
    });
    
    setHeadings(headingsData);
    
    // Set up intersection observer to track active heading
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );
    
    headingElements.forEach(element => {
      observer.observe(element);
    });
    
    return () => {
      headingElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, [contentRef]);
  
  if (headings.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm sticky top-24">
      <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Table of Contents</h3>
      <nav>
        <ul className="space-y-2">
          {headings.map(heading => (
            <li 
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
            >
              <a
                href={`#${heading.id}`}
                className={`text-sm block py-1 border-l-2 pl-2 transition ${
                  activeId === heading.id
                    ? 'border-purple-600 text-purple-600 font-medium'
                    : 'border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-300'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id).scrollIntoView({
                    behavior: 'smooth'
                  });
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents;