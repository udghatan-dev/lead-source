import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import AWSS3 from '../../../Components/Common/AWS';
import uniqid from 'uniqid';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

/**
 * Convert a PDF file to an array of PNG image data URLs (lossless quality)
 * @param {File} file - The PDF file to convert
 * @param {Object} options - Conversion options
 * @param {number} options.scale - Scale factor for rendering (default: 3 for high quality)
 * @returns {Promise<Array<{pageNumber: number, imageData: string, width: number, height: number}>>}
 */
export const convertPdfToImages = async (file, options = {}) => {
  const { scale = 3 } = options;

  try {
    // Read the PDF file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const totalPages = pdf.numPages;
    const images = [];

    // Process each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      // Create canvas for rendering
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render PDF page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Convert canvas to PNG data URL (lossless quality)
      const imageData = canvas.toDataURL('image/png');

      images.push({
        pageNumber: pageNum,
        imageData,
        width: viewport.width / scale,
        height: viewport.height / scale,
      });

      // Clean up
      page.cleanup();
    }

    return {
      success: true,
      images,
      totalPages,
      fileName: file.name,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to convert PDF',
      images: [],
    };
  }
};

/**
 * Validate if a file is a PDF
 * @param {File} file - The file to validate
 * @returns {boolean}
 */
export const isPdfFile = (file) => {
  if (!file) return false;
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
};

/**
 * Get optimal scale for PDF rendering based on A4 dimensions
 * A4 at 72 DPI: 595 x 842 points
 * Konva canvas typical size: 595 x 842 pixels
 * @returns {number} Scale factor
 */
export const getOptimalScale = () => {
  // Scale of 2 gives good quality for screen display
  // Adjust this based on your requirements
  return 2;
};

/**
 * Convert data URL to Blob
 * @param {string} dataURL - The data URL to convert
 * @returns {Blob}
 */
const dataURLtoBlob = (dataURL) => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Upload image data URL to Wasabi S3
 * @param {string} imageDataURL - The image data URL to upload
 * @param {number} pageNumber - The page number
 * @param {string} fileName - Original PDF file name
 * @returns {Promise<string>} S3 URL of uploaded image
 */
const uploadImageToS3 = async (imageDataURL, pageNumber, fileName) => {
  try {
    // Convert data URL to Blob
    const blob = dataURLtoBlob(imageDataURL);

    // Generate unique file name
    const sanitizedFileName = fileName.replace(/\.pdf$/i, '');
    const uniqueKey = `flow/workflow/${uniqid()}_page${pageNumber}_${sanitizedFileName}.png`;

    // Upload parameters
    const params = {
      Bucket: 'confidentialcontent',
      Key: uniqueKey,
      Body: blob,
      ContentType: 'image/png',
      ACL: 'public-read',
    };

    const options = {
      partSize: 10 * 1024 * 1024, // 10 MB
      queueSize: 10,
    };

    // Upload to S3
    const data = await AWSS3.upload(params, options).promise();
    return data.Location;
  } catch (error) {

    throw error;
  }
};

/**
 * Convert a PDF file to images and upload them to S3
 * @param {File} file - The PDF file to convert
 * @param {Object} options - Conversion options
 * @param {number} options.scale - Scale factor for rendering (default: 3 for high quality)
 * @param {boolean} options.uploadToS3 - Whether to upload images to S3 (default: true)
 * @returns {Promise<Object>}
 */
export const convertPdfToImagesWithUpload = async (file, options = {}) => {
  const { scale = 3, uploadToS3 = true } = options;

  try {
    // Read the PDF file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const totalPages = pdf.numPages;
    const images = [];

    // Process each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const pageRotation = page.rotate || 0;
      const viewport = page.getViewport({ scale });

      // Create canvas for rendering
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render PDF page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      const imageData = canvas.toDataURL('image/png');

      let finalImageUrl = imageData;

      // Upload to S3 if requested
      if (uploadToS3) {
        try {
          finalImageUrl = await uploadImageToS3(imageData, pageNum, file.name);
        } catch (uploadError) {
          // Fall back to data URL if upload fails
          finalImageUrl = imageData;
        }
      }
      const DPI_SCALE = 96 / 72;

      const baseWidth = viewport.width / scale;
      const baseHeight = viewport.height / scale;
      const finalWidth = Math.round(baseWidth * DPI_SCALE);
      const finalHeight = Math.round(baseHeight * DPI_SCALE);

      images.push({
        pageNumber: pageNum,
        imageData: finalImageUrl,
        width: finalWidth,
        height: finalHeight,
        rotation: pageRotation,
        isLandscape: finalWidth > finalHeight,
        uploadedToS3: uploadToS3 && finalImageUrl !== imageData,
      });

      // Clean up
      page.cleanup();
    }

    return {
      success: true,
      images,
      totalPages,
      fileName: file.name,
      uploadedToS3: uploadToS3,
    };
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    return {
      success: false,
      error: error.message || 'Failed to convert PDF',
      images: [],
    };
  }
};
