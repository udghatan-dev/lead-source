/**
 * Resizable Image Component
 *
 * React component for resizable images with variable support
 */

import React, { useState, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Resizable } from 're-resizable';

const ResizableImageComponent = ({ node, updateAttributes, selected }) => {
  const { src, width, height, textAlign } = node.attrs;
  const [isVariable, setIsVariable] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(src);
  const [currentSize, setCurrentSize] = useState({ width, height });

  useEffect(() => {
    // Update size when node attributes change
    setCurrentSize({ width, height });
  }, [width, height]);

  useEffect(() => {
    // Check if src contains variable pattern ${...}
    const hasVariable = src && src.includes('${');
    setIsVariable(hasVariable);

    if (hasVariable) {
      // Generate placeholder for variable images
      const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${currentSize.width}' height='${currentSize.height}'%3E%3Crect width='100%25' height='100%25' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23666'%3E${encodeURIComponent(src)}%3C/text%3E%3C/svg%3E`;
      setPreviewSrc(placeholderSvg);
    } else {
      setPreviewSrc(src);
    }
  }, [src, currentSize.width, currentSize.height]);

  const handleResize = (e, direction, ref, delta) => {
    const newWidth = parseInt(ref.style.width, 10);
    const newHeight = parseInt(ref.style.height, 10);

    setCurrentSize({ width: newWidth, height: newHeight });
    updateAttributes({
      width: newWidth,
      height: newHeight,
    });
  };

  const alignmentStyles = {
    left: { marginLeft: 0, marginRight: 'auto' },
    center: { marginLeft: 'auto', marginRight: 'auto' },
    right: { marginLeft: 'auto', marginRight: 0 },
    justify: { width: '100%' },
  };

  return (
    <NodeViewWrapper
      className="resizable-image-wrapper"
      style={{
        display: 'block',
        textAlign: textAlign || 'left',
        ...alignmentStyles[textAlign || 'left'],
      }}
    >
      <Resizable
        size={{ width: currentSize.width, height: currentSize.height }}
        onResizeStop={handleResize}
        lockAspectRatio={!isVariable} // Lock aspect ratio for real images
        enable={{
          top: false,
          right: true,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
        handleStyles={{
          right: {
            width: '8px',
            right: '-4px',
            cursor: 'ew-resize',
          },
          bottom: {
            height: '8px',
            bottom: '-4px',
            cursor: 'ns-resize',
          },
          bottomRight: {
            width: '16px',
            height: '16px',
            right: '-8px',
            bottom: '-8px',
            cursor: 'nwse-resize',
            background: selected ? '#0ea5e9' : 'transparent',
            borderRadius: '50%',
            border: selected ? '2px solid white' : 'none',
            zIndex: 10,
          },
        }}
        style={{
          display: 'inline-block',
          border: selected ? '2px solid #0ea5e9' : '1px solid #e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden',
          transition: 'all 0.2s',
          boxShadow: selected ? '0 0 0 3px rgba(14, 165, 233, 0.1)' : 'none',
        }}
      >
        <img
          src={previewSrc}
          alt={isVariable ? src : 'Image'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: isVariable ? 'contain' : 'cover',
            display: 'block',
            backgroundColor: isVariable ? '#f5f5f5' : 'transparent',
          }}
          draggable={false}
        />
      </Resizable>

      {isVariable && (
        <div
          style={{
            fontSize: '11px',
            color: '#666',
            marginTop: '4px',
            fontFamily: 'monospace',
          }}
        >
          Variable: {src}
        </div>
      )}
    </NodeViewWrapper>
  );
};

export default ResizableImageComponent;
