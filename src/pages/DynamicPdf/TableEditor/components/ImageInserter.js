/**
 * Image Inserter Modal
 *
 * Allows inserting images via:
 * - URL input (supports variables like ${image_url})
 * - File upload
 * - Variable insertion helpers
 */

import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Badge,
  Spinner
} from 'reactstrap';
import AWSS3 from '../../../../Components/Common/AWS';
import uniqid from 'uniqid';

const ImageInserter = ({ isOpen, toggle, editor, variables = [] }) => {
  const [activeTab, setActiveTab] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [actualImageWidth, setActualImageWidth] = useState(null);
  const [actualImageHeight, setActualImageHeight] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const hasVariable = imageUrl.includes('${');

  // Get current text alignment from editor
  const getCurrentAlignment = () => {
    if (!editor) return 'left';
    if (editor.isActive({ textAlign: 'left' })) return 'left';
    if (editor.isActive({ textAlign: 'center' })) return 'center';
    if (editor.isActive({ textAlign: 'right' })) return 'right';
    return 'left';
  };

  const alignment = getCurrentAlignment();

  const handleUrlChange = (url) => {
    setImageUrl(url);
    // Only show preview if no variables
    if (!url.includes('${')) {
      setPreviewUrl(url);

      // Get actual image dimensions for URL images
      const img = new Image();
      img.onload = () => {
        setActualImageWidth(img.width);
        setActualImageHeight(img.height);
      };
      img.onerror = () => {
        setActualImageWidth(null);
        setActualImageHeight(null);
      };
      img.src = url;
    } else {
      setPreviewUrl('');
      setActualImageWidth(null);
      setActualImageHeight(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setImageUrl(dataUrl);
        setPreviewUrl(dataUrl);

        // Get actual image dimensions
        const img = new Image();
        img.onload = () => {
          setActualImageWidth(img.width);
          setActualImageHeight(img.height);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertVariable = (variableName) => {
    const newUrl = `\${${variableName}}`;
    setImageUrl(newUrl);
    setPreviewUrl('');
  };

  const uploadToS3 = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          Bucket: 'confidentialcontent',
          Key: 'flow/workflow/' + uniqid() + '.' + file.name.split('.').pop(),
          Body: file,
          ContentType: file.type,
          ACL: 'public-read',
        };

        const options = {
          partSize: 10 * 1024 * 1024, // 10 MB
          queueSize: 10,
        };

        const data = await AWSS3.upload(params, options).promise();
        resolve(data.Location);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleInsert = async () => {
    if (!imageUrl) return;

    let finalImageUrl = imageUrl;

    // If file was uploaded locally, upload to S3 first
    if (uploadedFile && !imageUrl.startsWith('http') && !imageUrl.includes('${')) {
      setUploading(true);
      try {
        finalImageUrl = await uploadToS3(uploadedFile);
      } catch (error) {
        console.error('Error uploading to S3:', error);
        alert('Failed to upload image. Please try again.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Calculate smart default dimensions
    let insertWidth = 300;
    let insertHeight = 200;

    if (actualImageWidth && actualImageHeight) {
      // Use actual dimensions but constrain to reasonable size for PDF
      const maxWidth = 600;
      const maxHeight = 400;

      if (actualImageWidth > maxWidth || actualImageHeight > maxHeight) {
        const aspectRatio = actualImageWidth / actualImageHeight;
        if (actualImageWidth > actualImageHeight) {
          insertWidth = maxWidth;
          insertHeight = Math.round(maxWidth / aspectRatio);
        } else {
          insertHeight = maxHeight;
          insertWidth = Math.round(maxHeight * aspectRatio);
        }
      } else {
        insertWidth = actualImageWidth;
        insertHeight = actualImageHeight;
      }
    }

    editor?.chain().focus().insertImage(finalImageUrl, insertWidth, insertHeight, alignment).run();

    // Reset state
    setImageUrl('');
    setUploadedFile(null);
    setPreviewUrl('');
    setActualImageWidth(null);
    setActualImageHeight(null);
    toggle();
  };

  const handleCancel = () => {
    setImageUrl('');
    setUploadedFile(null);
    setPreviewUrl('');
    setActualImageWidth(null);
    setActualImageHeight(null);
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Insert Image</ModalHeader>
      <ModalBody>
        {/* Tabs */}
        <Nav tabs className="mb-3">
          <NavItem>
            <NavLink
              className={activeTab === '1' ? 'active' : ''}
              onClick={() => setActiveTab('1')}
              style={{ cursor: 'pointer', fontSize: '13px' }}
            >
              <i className="bx bx-link"></i> URL
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === '2' ? 'active' : ''}
              onClick={() => setActiveTab('2')}
              style={{ cursor: 'pointer', fontSize: '13px' }}
            >
              <i className="bx bx-upload"></i> Upload
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          {/* URL Tab */}
          <TabPane tabId="1">
            <div className="mb-3">
              <Label style={{ fontSize: '13px', fontWeight: '600' }}>Image URL</Label>
              <Input
                type="text"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg or ${variable_name}"
                style={{ fontSize: '13px', fontFamily: 'monospace' }}
              />
              <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                💡 Use <code style={{ fontSize: '11px' }}>${'{variable_name}'}</code> for dynamic images
              </small>
            </div>

            {/* Variable Helpers */}
            {variables.length > 0 && (
              <div className="mb-3">
                <Label style={{ fontSize: '12px', fontWeight: '600' }}>Quick Insert Variables</Label>
                <div className="d-flex flex-wrap gap-2">
                  {variables.map((variable, index) => (
                    <Badge
                      key={index}
                      color="success"
                      className="cursor-pointer"
                      onClick={() => handleInsertVariable(variable.name)}
                      style={{
                        fontSize: '11px',
                        fontWeight: '500',
                        padding: '6px 10px',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="bx bx-data me-1"></i>
                      {variable.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabPane>

          {/* Upload Tab */}
          <TabPane tabId="2">
            <div className="mb-3">
              <Label style={{ fontSize: '13px', fontWeight: '600' }}>Upload Image</Label>
              <Input
                innerRef={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ fontSize: '13px' }}
              />
              <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                Supported formats: JPG, PNG, GIF, SVG
              </small>
            </div>
          </TabPane>
        </TabContent>

        {/* Image Info */}
        {actualImageWidth && actualImageHeight && (
          <div className="alert alert-light mb-3" style={{ fontSize: '12px', padding: '10px 12px' }}>
            <i className="bx bx-info-circle me-2"></i>
            <strong>Image size:</strong> {actualImageWidth} × {actualImageHeight} px
            <span className="text-muted ms-2">(will be auto-sized for PDF)</span>
          </div>
        )}

        {/* Alignment - Auto-synced with Editor */}
        <div className="mb-3">
          <Label style={{ fontSize: '12px', fontWeight: '600' }}>
            Alignment
            <i className="bx bx-link-alt ms-1 text-primary" style={{ fontSize: '10px' }} title="Synced with text alignment"></i>
          </Label>
          <div className="alert alert-light mb-0" style={{ fontSize: '11px', padding: '8px 12px' }}>
            <i className="bx bx-info-circle me-1"></i>
            Image will use current text alignment: <strong>{alignment.charAt(0).toUpperCase() + alignment.slice(1)}</strong>
          </div>
        </div>

        {/* Preview */}
        {previewUrl && !hasVariable && (
          <div className="mb-3">
            <Label style={{ fontSize: '12px', fontWeight: '600' }}>Preview</Label>
            <div
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                padding: '16px',
                textAlign: 'center',
                backgroundColor: '#f8f9fa'
              }}
            >
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        )}

        {hasVariable && (
          <div
            className="alert alert-info mb-3"
            style={{ fontSize: '11px', padding: '12px' }}
          >
            <i className="bx bx-info-circle me-1"></i>
            This image URL contains a variable. The actual image will be displayed when the variable is resolved.
          </div>
        )}

        {/* Helpful Tip */}
        <div
          className="alert alert-light mb-0"
          style={{ fontSize: '11px', padding: '10px 12px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}
        >
          <i className="bx bx-bulb me-1"></i>
          <strong>Tip:</strong> After inserting, click the image to fine-tune its size and alignment in the <strong>Image</strong> tab.
        </div>
      </ModalBody>

      <ModalFooter>
        <style>{`
          .image-inserter-button {
            color: #333 !important;
            background-color: white !important;
            border-color: #dee2e6 !important;
            transition: all 0.2s ease;
          }
          .image-inserter-button:hover:not(:disabled) {
            background-color: #f8f9fa !important;
            color: #666 !important;
            border-color: #adb5bd !important;
          }
          .image-inserter-button:disabled {
            opacity: 0.6;
          }
        `}</style>
        <Button className="image-inserter-button" onClick={handleCancel} size="sm" disabled={uploading}>
          Cancel
        </Button>
        <Button
          className="image-inserter-button"
          onClick={handleInsert}
          disabled={!imageUrl || uploading}
          size="sm"
        >
          {uploading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Uploading...
            </>
          ) : (
            <>
              <i className="bx bx-plus me-1"></i> Insert Image
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ImageInserter;
