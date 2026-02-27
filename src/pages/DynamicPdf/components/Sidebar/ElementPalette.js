// ElementPalette.js - Styled to match DynamicImage
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addElement, addPage, addPagesFromPdf } from '../../store/actions';
import { Card, CardBody, CardHeader, Row, Col, Spinner } from 'reactstrap';
import { convertPdfToImagesWithUpload, isPdfFile } from '../../utils/pdfToImages';
import CustomNotification from '../../../../Components/Common/CustomNotification';

const COMPONENTS = [
  {
    title: 'Heading',
    help: 'Add Heading Block',
    icon: 'bx bx-heading',
    shape: 'heading',
  },
  {
    title: 'Text',
    help: 'Add Text Block',
    icon: 'bx bx-text',
    shape: 'text',
  },
  {
    title: 'Text Area',
    help: 'Add Text Area Block',
    icon: 'bx bx-file',
    shape: 'textarea',
  },
  {
    title: 'Image',
    help: 'Add Image Block',
    icon: 'bx bx-image',
    shape: 'image',
  },
  {
    title: 'QR Code',
    help: 'Add QR Code Block',
    icon: 'bx bx-qr',
    shape: 'qr',
  },
  {
    title: 'Line',
    help: 'Add Line',
    icon: 'bx bx-minus',
    shape: 'line',
  },
  // {
  //   title: 'Page Border',
  //   help: 'Add Rectangle Shape',
  //   icon: 'bx bx-rectangle',
  //   shape: 'box',
  // },
  // {
  //   title: 'Table',
  //   help: 'Add Table/Grid',
  //   icon: 'bx bx-table',
  //   shape: 'table',
  // },
];

const ElementPalette = () => {
  const dispatch = useDispatch();
  const currentPageId = useSelector(state => state.pdfBuilder?.currentPageId);
  const fileInputRef = useRef(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);

  const handleAddElement = (component) => {
    if (!currentPageId) {
      // alert('Please create or select a page first');
      return;
    }
    dispatch(addElement(component.shape));
  };

  const handlePdfUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePdfFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isPdfFile(file)) {
      CustomNotification.error('Please select a valid PDF file');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      CustomNotification.error('PDF file is too large. Maximum size is 10MB');
      return;
    }

    setIsProcessingPdf(true);
    CustomNotification.info(`Processing and uploading PDF: ${file.name}...`);

    try {
      // Use the new function with S3 upload (PNG format for lossless quality)
      const result = await convertPdfToImagesWithUpload(file, {
        scale: 3,  // Higher scale for better quality
        uploadToS3: true
      });

      if (result.success && result.images.length > 0) {
        // Dispatch action to add pages with images (now containing S3 URLs)
        dispatch(addPagesFromPdf(result.images));

        const uploadStatus = result.uploadedToS3 ? ' and uploaded to S3' : '';
        CustomNotification.success(
          `Successfully imported ${result.totalPages} page${result.totalPages > 1 ? 's' : ''} from your PDF`
        );
      } else {
        CustomNotification.error(result.error || 'Failed to process PDF');
      }
    } catch (error) {
      CustomNotification.error('An error occurred while processing the PDF');
    } finally {
      setIsProcessingPdf(false);
      // Reset input to allow re-uploading the same file
      event.target.value = '';
    }
  };

  return (
    <React.Fragment>
      {/* Hidden file input for PDF upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handlePdfFileChange}
        style={{ display: 'none' }}
      />

      <Row>
        {COMPONENTS.map((component) => (
          <Col xxl={6} xl={6} lg={4} key={component.shape}>
            <Card
              className='card-animate'
              style={{ cursor: 'pointer', size: '120px' }}
              title={component.help}
              onClick={() => handleAddElement(component)}
            >
              <CardHeader className='border-0 p-1 d-flex align-items-center justify-content-center'>
                <i className={`${component.icon} text-muted`} style={{ fontSize: '36px' }}></i>
              </CardHeader>
              <CardBody className='d-flex align-items-center justify-content-center p-1'>
                <span>{component.title}</span>
              </CardBody>
            </Card>
          </Col>
        ))}

        {/* Upload PDF Button */}
        <Col xxl={12} xl={12} lg={12}>
          <Card
            className='card-animate'
            style={{
              cursor: isProcessingPdf ? 'wait' : 'pointer',
              height: '120px',
              opacity: isProcessingPdf ? 0.7 : 1
            }}
            title='Upload PDF and convert pages to images'
            onClick={isProcessingPdf ? undefined : handlePdfUploadClick}
          >
            <CardHeader className='border-0 p-1 d-flex align-items-center justify-content-center bg-soft-primary'>
              {isProcessingPdf ? (
                <Spinner color="primary" size="sm" style={{ width: '36px', height: '36px' }} />
              ) : (
                <i className='bx bx-upload text-primary' style={{ fontSize: '36px' }}></i>
              )}
            </CardHeader>
            <CardBody className='d-flex align-items-center justify-content-center p-1'>
              <span className='text-primary fw-medium'>
                {isProcessingPdf ? 'Processing PDF...' : 'Upload PDF'}
              </span>
            </CardBody>
          </Card>
        </Col>

        {/* Add Page Button - Same Style */}
        {/* <Col xxl={12} xl={12} lg={12}>
          <Card
            className='card-animate'
            style={{ cursor: 'pointer', height:'120px' }}
            title='Add a new page'
            onClick={() => dispatch(addPage())}
          >
            <CardHeader className='border-0 p-1 d-flex align-items-center justify-content-center bg-soft-success'>
              <i className='bx bx-plus text-success' style={{ fontSize: '36px' }}></i>
            </CardHeader>
            <CardBody className='d-flex align-items-center justify-content-center p-1'>
              <span className='text-success fw-medium'>Add New Page</span>
            </CardBody>
          </Card>
        </Col> */}
      </Row>
    </React.Fragment>
  );
};

export default ElementPalette;