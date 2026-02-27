/**
 * Image Settings Component
 *
 * Allows editing image properties after insertion:
 * - Width and height
 * - Alignment (left, center, right)
 * - Image source URL
 */

import React, { useState, useEffect } from 'react';
import { Label, Input, Button, ButtonGroup } from 'reactstrap';

const ImageSettings = ({ editor }) => {
  const [imageAttrs, setImageAttrs] = useState(null);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [alignment, setAlignment] = useState('left');
  const [imageUrl, setImageUrl] = useState('');
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1.5);

  // Extract image attributes from current selection
  useEffect(() => {
    if (!editor) return;

    const updateImageAttrs = () => {
      const { selection } = editor.state;
      const { node } = selection;

      // Check if selected node is an image
      if (node && node.type.name === 'resizableImage') {
        const attrs = node.attrs || {};
        setImageAttrs(attrs);
        const w = attrs.width || 300;
        const h = attrs.height || 200;
        setWidth(w);
        setHeight(h);
        setAspectRatio(w / h);
        setAlignment(attrs.textAlign || 'left');
        setImageUrl(attrs.src || '');
      } else {
        setImageAttrs(null);
      }
    };

    updateImageAttrs();

    // Listen for selection changes
    editor.on('selectionUpdate', updateImageAttrs);
    editor.on('update', updateImageAttrs);

    return () => {
      editor.off('selectionUpdate', updateImageAttrs);
      editor.off('update', updateImageAttrs);
    };
  }, [editor]);

  const handleWidthChange = (newWidth) => {
    const validWidth = Math.max(50, Math.min(800, newWidth));
    setWidth(validWidth);
    if (lockAspectRatio) {
      setHeight(Math.round(validWidth / aspectRatio));
    }
  };

  const handleHeightChange = (newHeight) => {
    const validHeight = Math.max(50, Math.min(800, newHeight));
    setHeight(validHeight);
    if (lockAspectRatio) {
      setWidth(Math.round(validHeight * aspectRatio));
    }
  };

  const handleAlignmentChange = (newAlignment) => {
    setAlignment(newAlignment);
    updateImageAttributes({ textAlign: newAlignment });
  };

  const applyDimensions = () => {
    updateImageAttributes({ width, height });
  };

  const applyPreset = (presetWidth, presetHeight) => {
    setWidth(presetWidth);
    setHeight(presetHeight);
    setAspectRatio(presetWidth / presetHeight);
    updateImageAttributes({ width: presetWidth, height: presetHeight });
  };

  const updateImageAttributes = (attrs) => {
    if (!editor) return;

    const { selection } = editor.state;
    const { node } = selection;

    if (node && node.type.name === 'resizableImage') {
      const { from } = selection;
      editor.chain().focus().setNodeSelection(from).updateAttributes('resizableImage', attrs).run();
    }
  };

  const handleDeleteImage = () => {
    if (!editor) return;

    const { selection } = editor.state;
    const { node } = selection;

    if (node && node.type.name === 'resizableImage') {
      editor.chain().focus().deleteSelection().run();
    }
  };

  // Don't show settings if no image is selected
  if (!imageAttrs) {
    return (
      <div className="p-3">
        <div
          className="alert alert-info mb-0"
          style={{
            fontSize: '12px',
            padding: '12px',
            textAlign: 'center',
            backgroundColor: '#e3f2fd',
            border: '1px solid #90caf9',
            borderRadius: '6px',
          }}
        >
          <i className="bx bx-info-circle me-2"></i>
          Select an image to edit its properties
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <style>{`
        .image-settings-button {
          color: #333 !important;
          background-color: white !important;
          border-color: #dee2e6 !important;
          transition: all 0.2s ease;
        }
        .image-settings-button:hover:not(:disabled) {
          background-color: #f8f9fa !important;
          color: #666 !important;
          border-color: #adb5bd !important;
        }
        .image-settings-button:disabled {
          opacity: 0.6;
        }
        .image-settings-button.active {
          background-color: #e3f2fd !important;
          border-color: #90caf9 !important;
          color: #1976d2 !important;
        }
      `}</style>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0" style={{ fontSize: '13px', fontWeight: 600 }}>
          <i className="bx bx-image me-2"></i>
          Image Settings
        </h6>
        <Button
          className="image-settings-button"
          size="sm"
          onClick={handleDeleteImage}
          style={{ fontSize: '11px', padding: '4px 8px', color: '#dc3545 !important' }}
          title="Delete Image"
        >
          <i className="bx bx-trash"></i>
        </Button>
      </div>

      {/* Image Source */}
      <div className="mb-3">
        <Label style={{ fontSize: '12px', fontWeight: '600' }}>Image Source</Label>
        <div
          style={{
            fontSize: '11px',
            fontFamily: 'monospace',
            padding: '8px 12px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            wordBreak: 'break-all',
            color: '#495057',
          }}
        >
          {imageUrl || 'No source'}
        </div>
      </div>

      {/* Dimensions */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Label style={{ fontSize: '12px', fontWeight: '600', margin: 0 }}>Dimensions</Label>
          <Button
            className={`image-settings-button ${lockAspectRatio ? 'active' : ''}`}
            size="sm"
            onClick={() => setLockAspectRatio(!lockAspectRatio)}
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={lockAspectRatio ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
          >
            <i className={lockAspectRatio ? 'bx bx-link' : 'bx bx-unlink'}></i>
            {lockAspectRatio ? 'Locked' : 'Free'}
          </Button>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-6">
            <Label style={{ fontSize: '11px', color: '#666' }}>Width (px)</Label>
            <div className="d-flex gap-1">
              <Button
                className="image-settings-button"
                size="sm"
                onClick={() => handleWidthChange(width - 10)}
                style={{ padding: '4px 8px', fontSize: '12px' }}
              >
                <i className="bx bx-minus"></i>
              </Button>
              <Input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 50)}
                onBlur={applyDimensions}
                onKeyDown={(e) => e.key === 'Enter' && applyDimensions()}
                min={50}
                max={800}
                style={{ fontSize: '12px', textAlign: 'center' }}
              />
              <Button
                className="image-settings-button"
                size="sm"
                onClick={() => handleWidthChange(width + 10)}
                style={{ padding: '4px 8px', fontSize: '12px' }}
              >
                <i className="bx bx-plus"></i>
              </Button>
            </div>
          </div>
          <div className="col-6">
            <Label style={{ fontSize: '11px', color: '#666' }}>Height (px)</Label>
            <div className="d-flex gap-1">
              <Button
                className="image-settings-button"
                size="sm"
                onClick={() => handleHeightChange(height - 10)}
                style={{ padding: '4px 8px', fontSize: '12px' }}
              >
                <i className="bx bx-minus"></i>
              </Button>
              <Input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 50)}
                onBlur={applyDimensions}
                onKeyDown={(e) => e.key === 'Enter' && applyDimensions()}
                min={50}
                max={800}
                style={{ fontSize: '12px', textAlign: 'center' }}
              />
              <Button
                className="image-settings-button"
                size="sm"
                onClick={() => handleHeightChange(height + 10)}
                style={{ padding: '4px 8px', fontSize: '12px' }}
              >
                <i className="bx bx-plus"></i>
              </Button>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <Button
          className="image-settings-button"
          size="sm"
          block
          onClick={applyDimensions}
          style={{ fontSize: '11px', marginBottom: '8px' }}
        >
          <i className="bx bx-check me-1"></i>
          Apply Dimensions
        </Button>

        {/* Preset Sizes */}
        <div>
          <Label style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Quick Presets:</Label>
          <div className="d-flex gap-1 flex-wrap">
            <Button
              className="image-settings-button"
              size="sm"
              onClick={() => applyPreset(200, 200)}
              style={{ fontSize: '10px', padding: '4px 8px' }}
            >
              200×200
            </Button>
            <Button
              className="image-settings-button"
              size="sm"
              onClick={() => applyPreset(300, 200)}
              style={{ fontSize: '10px', padding: '4px 8px' }}
            >
              300×200
            </Button>
            <Button
              className="image-settings-button"
              size="sm"
              onClick={() => applyPreset(400, 300)}
              style={{ fontSize: '10px', padding: '4px 8px' }}
            >
              400×300
            </Button>
            <Button
              className="image-settings-button"
              size="sm"
              onClick={() => applyPreset(500, 350)}
              style={{ fontSize: '10px', padding: '4px 8px' }}
            >
              500×350
            </Button>
          </div>
        </div>
      </div>

      {/* Alignment */}
      <div className="mb-3">
        <Label style={{ fontSize: '12px', fontWeight: '600' }}>Alignment</Label>
        <div className="d-grid">
          <ButtonGroup size="sm">
            <Button
              className={`image-settings-button ${alignment === 'left' ? 'active' : ''}`}
              onClick={() => handleAlignmentChange('left')}
              style={{ fontSize: '11px' }}
            >
              <i className="bx bx-align-left"></i> Left
            </Button>
            <Button
              className={`image-settings-button ${alignment === 'center' ? 'active' : ''}`}
              onClick={() => handleAlignmentChange('center')}
              style={{ fontSize: '11px' }}
            >
              <i className="bx bx-align-middle"></i> Center
            </Button>
            <Button
              className={`image-settings-button ${alignment === 'right' ? 'active' : ''}`}
              onClick={() => handleAlignmentChange('right')}
              style={{ fontSize: '11px' }}
            >
              <i className="bx bx-align-right"></i> Right
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Tips */}
      <div
        className="alert alert-light mb-0"
        style={{
          fontSize: '11px',
          padding: '10px 12px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '6px' }}>
          <i className="bx bx-bulb me-1"></i>
          Tips:
        </div>
        <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
          <li>Click on an image to select it and edit properties</li>
          <li>You can also resize by dragging the bottom-right corner</li>
          <li>Use variables like <code>${'{image_url}'}</code> for dynamic images</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageSettings;
