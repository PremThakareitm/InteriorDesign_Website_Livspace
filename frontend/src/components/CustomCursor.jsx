import React, { useEffect, useState } from 'react';
import '../styles/cursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updateCursorPosition = (e) => {
      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    const updateCursorStyle = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y);
      if (hoveredElement) {
        const computedStyle = window.getComputedStyle(hoveredElement);
        setIsPointer(computedStyle.cursor === 'pointer');
      }
    };

    window.addEventListener('mousemove', updateCursorPosition);
    window.addEventListener('mouseover', updateCursorStyle);

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('mouseover', updateCursorStyle);
    };
  }, [position.x, position.y]);

  return (
    <>
      {/* Original cursor - always visible but small */}
      <style>
        {`
          * {
            cursor: default !important;
          }
          a, button, [role="button"], select, input[type="submit"], input[type="button"] {
            cursor: none !important;
          }
        `}
      </style>
      <div
        className="cursor"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        {/* Solid dot cursor */}
        <div 
          className="cursor-dot"
          style={{
            transform: `scale(${isPointer ? 1.5 : 1})`,
            opacity: 1,
          }}
        />
        {/* Glowing outline */}
        <div 
          className="cursor-outline"
          style={{
            transform: `scale(${isPointer ? 1.5 : 1})`,
            opacity: 0.5,
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
