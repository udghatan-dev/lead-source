import { takeLatest, put, select } from 'redux-saga/effects';
import * as actionTypes from './constants';
import { savePdfFailure } from './actions';
import {
  createPdfExp,
  updatePdfExp
} from '../../../store/dig/pdf/action.js';
import { processEditorContent } from '../TableEditor/TableDataProcessor.js';
import { previewPdfSuccess, previewPdfFailure } from './actions';

const getPdfBuilderState = state => state.pdfBuilder;

// const transformToLayerFormat = (element) => {
//   const pos = {
//     x: element.x,
//     y: element.y
//   };

//   let props = {
//     width: element.width,
//     height: element.height,
//     opacity: element.opacity || 1,
//     stroke: element.stroke || "#000000",
//     strokeWidth: element.strokeWidth || 0
//   };

//   switch (element.type) {
//     case 'text':
//     case 'heading':
//     case 'textarea':
//       props = {
//         ...props,
//         content: element.text,
//         fontFamily: element.fontFamily,
//         fontSize: element.fontSize,
//         fontStyle: element.fontStyle || 'normal',
//         align: element.align || 'left',
//         verticalAlign: element.verticalAlign || 'top',
//         fill: element.fill || '#000000',
//         headingLevel: element.headingLevel,
//         padding: element.padding,
//         backgroundColor: element.backgroundColor
//       };
//       break;

//     case 'image':
//       props = {
//         ...props,
//         content: element.imageUrl,
//         objectFit: element.objectFit || 'contain'
//       };
//       break;

//     case 'qr':
//       props = {
//         ...props,
//         content: element.qrData,
//         ecl: "H",
//         quality: 1,
//         margin: 2,
//         bgColor: element.qrBackgroundColor || "#FFFFFF",
//         fgColor: element.fill || "#000000",
//         qrTransparentBg: element.qrTransparentBg
//       };
//       break;

//     case 'box':
//     case 'line':
//       props = {
//         ...props,
//         fill: element.fill || 'transparent',
//         dash: element.dash
//       };
//       break;

//     case 'table':
//       props = {
//         ...props,
//         ...element,
//         data: element.isDynamic ? [] : element.data,
//         dataSourceVariable: element.isDynamic ? element.dataSourceVariable : null,
//         columnMappings: element.isDynamic ? element.columnMappings : []
//       };
//       break;

//     default:
//       props = { ...props, ...element };
//   }

//   return {
//     type: element.type,
//     id: element.id,
//     pos: pos,
//     props: props
//   };
// };

const transformToLayerFormat = (element) => {
  // 1. Destructure to separate root/pos fields from the rest
  // 'rest' will contain only the candidates for 'props'
  const { id, type, x, y, ...rest } = element;

  const pos = {
    x: x,
    y: y
  };

  // 2. Define Base Props (Common to all elements)
  let props = {
    width: rest.width,
    height: rest.height,
    opacity: rest.opacity ?? 1,
    stroke: rest.stroke ?? "#000000",
    strokeWidth: rest.strokeWidth ?? 0,
    rotation: rest.rotation ?? 0, // Ensure rotation is captured if you use it
  };

  // 3. Type-Specific Logic
  switch (type) {
    case 'text':
    case 'heading':
    case 'textarea':
      props = {
        ...props,
        content: rest.text, // Map frontend 'text' to backend 'content'
        fontFamily: rest.fontFamily,
        fontSize: rest.fontSize,
        fontStyle: rest.fontStyle || 'normal',
        align: rest.align || 'left',
        verticalAlign: rest.verticalAlign || 'top',
        fill: rest.fill || '#000000',
        headingLevel: rest.headingLevel,
        padding: rest.padding,
        backgroundColor: rest.backgroundColor
      };
      break;

    case 'image':
      props = {
        ...props,
        content: rest.imageUrl, // Map 'imageUrl' to 'content'
        objectFit: rest.objectFit || 'contain'
      };
      break;

    case 'qr':
      props = {
        ...props,
        content: rest.qrData, // Map 'qrData' to 'content'
        ecl: "H",
        quality: 1,
        margin: 2,
        bgColor: rest.qrBackgroundColor || "#FFFFFF",
        fgColor: rest.fill || "#000000",
        qrTransparentBg: rest.qrTransparentBg
      };
      break;

    case 'box':
    case 'line':
      props = {
        ...props,
        fill: rest.fill || 'transparent',
        dash: rest.dash
      };
      break;

    case 'table':
      props = {
        ...props,
        // We explicitly do NOT spread ...rest here to avoid clutter
        rows: rest.rows,
        cols: rest.cols,
        cellWidth: rest.cellWidth,
        cellHeight: rest.cellHeight,
        borderWidth: rest.borderWidth,
        borderColor: rest.borderColor,
        showGridLines: rest.showGridLines,
        hasHeader: rest.hasHeader,
        headerBackgroundColor: rest.headerBackgroundColor,
        headerTextColor: rest.headerTextColor,
        cellBackgroundColor: rest.cellBackgroundColor,
        alternateRowColor: rest.alternateRowColor,
        cellPadding: rest.cellPadding,
        fontSize: rest.fontSize,
        fontFamily: rest.fontFamily,
        textColor: rest.textColor,
        textAlign: rest.textAlign,
        verticalAlign: rest.verticalAlign,

        // Dynamic Data Logic
        isDynamic: rest.isDynamic,
        // If dynamic, send empty data array to save space/bandwidth
        data: rest.isDynamic ? [] : rest.data,
        dataSourceVariable: rest.isDynamic ? rest.dataSourceVariable : null,
        columnMappings: rest.isDynamic ? rest.columnMappings : []
      };
      break;

    default:
      // For unknown types, we spread 'rest' but 'id', 'type', 'x', 'y' are already removed!
      props = { ...props, ...rest };
  }

  // 4. Return Clean Structure
  return {
    id,
    type,
    pos,
    props
  };
};

function* savePdfSaga(action) {
  try {
    const { id, name: payloadName } = action.payload;

    const pdfState = yield select(getPdfBuilderState);
    if (!pdfState) {
      throw new Error("PDF Builder state is not initialized.");
    }

    const {
      pages = [],
      variables = [],
      templateName: stateName = 'Untitled Template',
      page_size = 'A4'
    } = pdfState;

    if (!pages || pages.length === 0) {
      throw new Error("No pages found to save.");
    }

    const allPagesTransformed = pages.map(page => ({
      width: page.width,
      height: page.height,
      elements: page.elements.map(el => transformToLayerFormat(el))
    }));

    const variableArray = variables.map(v => ({
      name: v.name,
      fallback: v.fallback || ""
    }));

    const finalName = payloadName || stateName;

    // Build payload object for KONVA editor
    const rawPayload = {
      name: finalName,
      pages: allPagesTransformed,
      variable: variableArray,
      page_size: page_size,
      type: 'KONVA'
    };

    // Clean payload - ensure JSON serializable and remove undefined values
    const payloadData = JSON.parse(JSON.stringify(rawPayload));

    if (id) {
      yield put(updatePdfExp({
        pdf: id,
        update: payloadData
      }));
    } else {
      yield put(createPdfExp(payloadData));
    }

  } catch (error) {
    console.error("Save PDF Error:", error);
    yield put(savePdfFailure(error.message));
  }
}


// Preview Saga
function* previewPdfSaga(action) {
  try {
    const { editorJSON } = action.payload;
    // Get variables from state
    const pdfState = yield select(getPdfBuilderState);
    const variables = pdfState?.variables || [];

    // Process the content (this logic is now shared via TableDataProcessor)
    // We wrap it in a promise if it were async, but it's synchronous for now.
    // If it becomes expensive, we might want to yield call() it.
    const processedContent = processEditorContent(editorJSON, variables);

    yield put(previewPdfSuccess(processedContent));
  } catch (error) {
    console.error("Preview Generation Error", error);
    yield put(previewPdfFailure(error.message));
  }
}

export default function* pdfBuilderSaga() {
  yield takeLatest(actionTypes.SAVE_PDF_REQUEST, savePdfSaga);
  yield takeLatest(actionTypes.PREVIEW_PDF_REQUEST, previewPdfSaga);
}
