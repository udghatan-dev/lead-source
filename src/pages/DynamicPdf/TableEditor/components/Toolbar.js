/**
 * Editor Toolbar Component
 *
 * Provides formatting and insert controls:
 * - Text formatting (bold, italic, underline)
 * - Headings (H1-H6)
 * - Text alignment
 * - Text color
 * - Insert (table, image, variable)
 */

import React, { useState } from 'react';
import { Button, ButtonGroup, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const Toolbar = ({ editor }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');

  if (!editor) return null;

  const headingLevels = [
    { level: 1, label: 'H1' },
    { level: 2, label: 'H2' },
    { level: 3, label: 'H3' },
    { level: 4, label: 'H4' },
    { level: 5, label: 'H5' },
    { level: 6, label: 'H6' },
  ];

  // Fonts available in backend - mapped to familiar names
  const fontFamilies = [
    { value: 'Arimo', label: 'Arial' }, // Arial alternative
    { value: 'Noto Sans', label: 'Verdana' }, // Verdana alternative
    { value: 'Tinos', label: 'Times New Roman' }, // Times New Roman alternative
    { value: 'EB Garamond', label: 'Georgia' }, // Georgia alternative
    { value: 'Cousine', label: 'Courier New' }, // Courier New alternative
    { value: 'Cabin', label: 'Trebuchet MS' }, // Trebuchet MS alternative
    { value: 'Comic Neue', label: 'Comic Sans MS' }, // Comic Sans alternative
    { value: 'Anton', label: 'Impact' }, // Impact alternative
    { value: 'Cormorant Garamond', label: 'Palatino' }, // Palatino alternative
    { value: 'EB Garamond', label: 'Garamond' }, // Garamond
    { value: 'Source Code Pro', label: 'Lucida Console' }, // Lucida Console alternative
    { value: 'Roboto', label: 'Roboto' }, // Modern font
    { value: 'Montserrat', label: 'Montserrat' }, // Modern font
    { value: 'Ubuntu', label: 'Ubuntu' }, // Modern font
  ];

  const fontSizes = [
    { value: '8px', label: '8' },
    { value: '9px', label: '9' },
    { value: '10px', label: '10' },
    { value: '11px', label: '11' },
    { value: '12px', label: '12' },
    { value: '14px', label: '14' },
    { value: '16px', label: '16' },
    { value: '18px', label: '18' },
    { value: '20px', label: '20' },
    { value: '24px', label: '24' },
    { value: '28px', label: '28' },
    { value: '32px', label: '32' },
    { value: '36px', label: '36' },
    { value: '48px', label: '48' },
    { value: '72px', label: '72' },
  ];

  const lineHeights = [
    { value: '1', label: '1.0' },
    { value: '1.15', label: '1.15' },
    { value: '1.5', label: '1.5' },
    { value: '2', label: '2.0' },
    { value: '2.5', label: '2.5' },
    { value: '3', label: '3.0' },
  ];

  // Force re-render when selection changes
  const [, forceUpdate] = useState({});

  // Update when editor selection changes
  React.useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      forceUpdate({});
    };

    editor.on('selectionUpdate', updateToolbar);
    editor.on('transaction', updateToolbar);

    return () => {
      editor.off('selectionUpdate', updateToolbar);
      editor.off('transaction', updateToolbar);
    };
  }, [editor]);

  // Get current font family
  const getCurrentFontFamily = () => {
    const attrs = editor.getAttributes('textStyle');
    const currentFont = attrs.fontFamily;
    if (!currentFont) return 'Default';
    const fontObj = fontFamilies.find(f => f.value === currentFont);
    return fontObj ? fontObj.label : 'Default';
  };

  // Get current font size
  const getCurrentFontSize = () => {
    const attrs = editor.getAttributes('textStyle');
    const currentSize = attrs.fontSize;
    if (!currentSize) return '14';
    const sizeObj = fontSizes.find(s => s.value === currentSize);
    return sizeObj ? sizeObj.label : '14';
  };

  // Get current line height
  const getCurrentLineHeight = () => {
    const attrs = editor.getAttributes('paragraph') || editor.getAttributes('heading');
    const currentLH = attrs.lineHeight;
    if (!currentLH) return '1.6';
    const lhObj = lineHeights.find(lh => lh.value === currentLH);
    return lhObj ? lhObj.label : '1.6';
  };

  // Get current heading level
  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'H1';
    if (editor.isActive('heading', { level: 2 })) return 'H2';
    if (editor.isActive('heading', { level: 3 })) return 'H3';
    if (editor.isActive('heading', { level: 4 })) return 'H4';
    if (editor.isActive('heading', { level: 5 })) return 'H5';
    if (editor.isActive('heading', { level: 6 })) return 'H6';
    return 'Normal';
  };

  const handleColorChange = (color) => {
    setCurrentColor(color);
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  return (
    <div
      className="editor-toolbar"
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
      }}
    >
      <style>{`
        .editor-toolbar .btn-light {
          color: #333 !important;
          background-color: white !important;
          border-color: #dee2e6 !important;
          transition: all 0.2s ease;
        }
        .editor-toolbar .btn-light:hover:not(:disabled) {
          background-color: #f8f9fa !important;
          color: #666 !important;
          border-color: #adb5bd !important;
        }
        .editor-toolbar .btn-light:disabled {
          opacity: 0.6;
        }
        .editor-toolbar .btn-light:active,
        .editor-toolbar .btn-light.active {
          background-color: #e3f2fd !important;
          border-color: #90caf9 !important;
          color: #1976d2 !important;
        }
        .editor-toolbar .dropdown-toggle {
          color: #333 !important;
          background-color: white !important;
          border-color: #dee2e6 !important;
        }
        .editor-toolbar .dropdown-toggle:hover:not(:disabled) {
          background-color: #f8f9fa !important;
          color: #666 !important;
          border-color: #adb5bd !important;
        }
      `}</style>
      {/* Text Formatting */}
      <ButtonGroup size="sm">
        <Button
          color="light"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
          style={{
            fontWeight: 'bold',
            fontSize: '14px',
            backgroundColor: editor.isActive('bold') ? '#e3f2fd' : '#fff',
          }}
        >
          B
        </Button>
        <Button
          color="light"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
          style={{
            fontStyle: 'italic',
            fontSize: '14px',
            backgroundColor: editor.isActive('italic') ? '#e3f2fd' : '#fff',
          }}
        >
          I
        </Button>
        <Button
          color="light"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
          style={{
            textDecoration: 'underline',
            fontSize: '14px',
            backgroundColor: editor.isActive('underline') ? '#e3f2fd' : '#fff',
          }}
        >
          U
        </Button>
      </ButtonGroup>

      <div style={{ width: '1px', height: '28px', backgroundColor: '#dee2e6' }}></div>

      {/* Heading Selector */}
      <UncontrolledDropdown>
        <DropdownToggle caret size="sm" color="light" style={{ minWidth: '80px' }}>
          {getCurrentHeading()}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive('paragraph')}
          >
            Normal Text
          </DropdownItem>
          <DropdownItem divider />
          {headingLevels.map(({ level, label }) => (
            <DropdownItem
              key={level}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              active={editor.isActive('heading', { level })}
            >
              <span style={{ fontSize: `${20 - level * 2}px`, fontWeight: 'bold' }}>
                {label}
              </span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>

      <div style={{ width: '1px', height: '28px', backgroundColor: '#dee2e6' }}></div>

      {/* Font Family Selector */}
      <UncontrolledDropdown>
        <DropdownToggle caret size="sm" color="light" style={{ minWidth: '140px', fontSize: '12px' }}>
          {getCurrentFontFamily()}
        </DropdownToggle>
        <DropdownMenu style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <DropdownItem
            onClick={() => editor.chain().focus().unsetFontFamily().run()}
          >
            Default Font
          </DropdownItem>
          <DropdownItem divider />
          {fontFamilies.map(({ value, label }) => (
            <DropdownItem
              key={value}
              onClick={() => editor.chain().focus().setFontFamily(value).run()}
              style={{ fontFamily: value }}
            >
              {label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>

      <div style={{ width: '1px', height: '28px', backgroundColor: '#dee2e6' }}></div>

      {/* Font Size Selector */}
      <UncontrolledDropdown>
        <DropdownToggle caret size="sm" color="light" style={{ minWidth: '70px', fontSize: '12px' }}>
          {getCurrentFontSize()}
        </DropdownToggle>
        <DropdownMenu style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {fontSizes.map(({ value, label }) => (
            <DropdownItem
              key={value}
              onClick={() => editor.chain().focus().setFontSize(value).run()}
            >
              <span style={{ fontSize: value }}>{label}</span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>

      <div style={{ width: '1px', height: '28px', backgroundColor: '#dee2e6' }}></div>

      {/* Line Height Selector */}
      <UncontrolledDropdown>
        <DropdownToggle caret size="sm" color="light" style={{ minWidth: '70px', fontSize: '12px' }} title="Line Height">
          <i className="bx bx-text me-1"></i>{getCurrentLineHeight()}
        </DropdownToggle>
        <DropdownMenu>
          {lineHeights.map(({ value, label }) => (
            <DropdownItem
              key={value}
              onClick={() => editor.chain().focus().setLineHeight(value).run()}
            >
              {label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>

      <div style={{ width: '1px', height: '28px', backgroundColor: '#dee2e6' }}></div>

      {/* Text Alignment */}
      <ButtonGroup size="sm">
        <Button
          color="light"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
          style={{
            backgroundColor: editor.isActive({ textAlign: 'left' }) ? '#e3f2fd' : '#fff',
          }}
        >
          <i className="bx bx-align-left"></i>
        </Button>
        <Button
          color="light"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
          style={{
            backgroundColor: editor.isActive({ textAlign: 'center' }) ? '#e3f2fd' : '#fff',
          }}
        >
          <i className="bx bx-align-middle"></i>
        </Button>
        <Button
          color="light"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
          style={{
            backgroundColor: editor.isActive({ textAlign: 'right' }) ? '#e3f2fd' : '#fff',
          }}
        >
          <i className="bx bx-align-right"></i>
        </Button>
        <Button
          color="light"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          active={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
          style={{
            backgroundColor: editor.isActive({ textAlign: 'justify' }) ? '#e3f2fd' : '#fff',
          }}
        >
          <i className="bx bx-align-justify"></i>
        </Button>
      </ButtonGroup>

      <div style={{ width: '1px', height: '28px', backgroundColor: '#dee2e6' }}></div>

      {/* Text Color */}
      <div style={{ position: 'relative' }}>
        <Button
          size="sm"
          color="light"
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Text Color"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <i className="bx bx-palette"></i>
          <div
            style={{
              width: '16px',
              height: '16px',
              backgroundColor: currentColor,
              border: '1px solid #ddd',
              borderRadius: '2px',
            }}
          ></div>
        </Button>

        {showColorPicker && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              padding: '8px',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 1000,
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '4px',
            }}
          >
            {['#000000', '#e03131', '#2f9e44', '#1971c2', '#f59f00', '#7950f2', '#0c8599', '#e64980'].map(color => (
              <div
                key={color}
                onClick={() => handleColorChange(color)}
                style={{
                  width: '28px',
                  height: '28px',
                  backgroundColor: color,
                  cursor: 'pointer',
                  borderRadius: '4px',
                  border: color === currentColor ? '2px solid #000' : '1px solid #ddd',
                }}
                title={color}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Undo/Redo */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
        <Button
          size="sm"
          color="light"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <i className="bx bx-undo"></i>
        </Button>
        <Button
          size="sm"
          color="light"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <i className="bx bx-redo"></i>
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
