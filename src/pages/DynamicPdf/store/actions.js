// store/actions.js
import * as actionTypes from './constants';

export const addElement = (elementType) => ({
  type: actionTypes.ADD_ELEMENT,
  payload: { elementType },
});

export const deselectElement = () => ({
  type: actionTypes.DESELECT_ELEMENT
});

export const updateElement = (elementId, updates) => ({
  type: actionTypes.UPDATE_ELEMENT,
  payload: { elementId, updates },
});

export const deleteElement = (elementId) => ({
  type: actionTypes.DELETE_ELEMENT,
  payload: { elementId },
});

export const duplicateElement = (elementId) => ({
  type: actionTypes.DUPLICATE_ELEMENT,
  payload: { elementId },
});

export const selectElement = (elementId) => ({
  type: actionTypes.SELECT_ELEMENT,
  payload: { elementId },
});

// --- Table-specific Actions ---
export const updateTableCell = (elementId, rowIndex, colIndex, value) => ({
  type: actionTypes.UPDATE_TABLE_CELL,
  payload: { elementId, rowIndex, colIndex, value },
});

export const addTableRow = (elementId, position = 'end') => ({
  type: actionTypes.ADD_TABLE_ROW,
  payload: { elementId, position },
});

export const deleteTableRow = (elementId, rowIndex) => ({
  type: actionTypes.DELETE_TABLE_ROW,
  payload: { elementId, rowIndex },
});

export const addTableColumn = (elementId, position = 'end') => ({
  type: actionTypes.ADD_TABLE_COLUMN,
  payload: { elementId, position },
});

export const deleteTableColumn = (elementId, colIndex) => ({
  type: actionTypes.DELETE_TABLE_COLUMN,
  payload: { elementId, colIndex },
});

export const updateTableStyle = (elementId, styleUpdates) => ({
  type: actionTypes.UPDATE_TABLE_STYLE,
  payload: { elementId, styleUpdates },
});

export const updateCellStyle = (elementId, rowIndex, colIndex, styleUpdates) => ({
  type: actionTypes.UPDATE_CELL_STYLE,
  payload: { elementId, rowIndex, colIndex, styleUpdates },
});

// --- Dynamic Table Mapping Actions ---
export const toggleTableDynamicMode = (elementId, isDynamic) => ({
  type: actionTypes.TOGGLE_TABLE_DYNAMIC_MODE,
  payload: { elementId, isDynamic }
});

// FIXED: Changed to match Reducer expectations
export const setTableDataSource = (elementId, dataSourceVariable) => ({
  type: actionTypes.SET_TABLE_DATA_SOURCE,
  payload: { elementId, dataSourceVariable }
});

export const addTableColumnMapping = (elementId) => ({
  type: actionTypes.ADD_TABLE_COLUMN_MAPPING,
  payload: { elementId }
});

export const updateTableColumnMapping = (elementId, index, field, value) => ({
  type: actionTypes.UPDATE_TABLE_COLUMN_MAPPING,
  payload: { elementId, index, field, value }
});

export const deleteTableColumnMapping = (elementId, index) => ({
  type: actionTypes.DELETE_TABLE_COLUMN_MAPPING,
  payload: { elementId, index }
});

// --- Layer Management Actions ---
export const bringElementForward = (elementId) => ({
  type: actionTypes.BRING_ELEMENT_FORWARD,
  payload: { elementId },
});

export const sendElementBackward = (elementId) => ({
  type: actionTypes.SEND_ELEMENT_BACKWARD,
  payload: { elementId },
});

export const bringElementToFront = (elementId) => ({
  type: actionTypes.BRING_ELEMENT_TO_FRONT,
  payload: { elementId },
});

export const sendElementToBack = (elementId) => ({
  type: actionTypes.SEND_ELEMENT_TO_BACK,
  payload: { elementId },
});

// --- Page Actions ---
export const reorderPages = (reorderedPages) => ({
  type: actionTypes.REORDER_PAGE,
  payload: reorderedPages
});

export const addPage = (orientation = 'portrait', size = 'A4') => ({
  type: actionTypes.ADD_PAGE,
  payload: { orientation, size },
});

export const deletePage = (pageId) => ({
  type: actionTypes.DELETE_PAGE,
  payload: { pageId },
});

export const duplicatePage = (pageId) => ({
  type: actionTypes.DUPLICATE_PAGE,
  payload: { pageId },
});

export const setCurrentPage = (pageId) => ({
  type: actionTypes.SET_CURRENT_PAGE,
  payload: { pageId },
});

export const addPagesFromPdf = (pdfPages) => ({
  type: actionTypes.ADD_PAGES_FROM_PDF,
  payload: { pdfPages },
});

// --- Variable Actions ---
export const setVariables = (variables) => ({
  type: actionTypes.SET_VARIABLES,
  payload: { variables },
});

export const addVariable = (variable) => ({
  type: actionTypes.ADD_VARIABLE,
  payload: { variable },
});

export const updateVariable = (index, updates) => ({
  type: actionTypes.UPDATE_VARIABLE,
  payload: { index, updates },
});

export const deleteVariable = (index) => ({
  type: actionTypes.DELETE_VARIABLE,
  payload: { index },
});

export const savePdfRequest = (payload) => ({
  type: actionTypes.SAVE_PDF_REQUEST,
  payload
});

export const savePdfSuccess = (response) => ({
  type: actionTypes.SAVE_PDF_SUCCESS,
  payload: { response },
});

export const savePdfFailure = (error) => ({
  type: actionTypes.SAVE_PDF_FAILURE,
  payload: { error },
});

// --- PDF Template Actions ---
export const listPdfTemplates = (payload) => ({
  type: actionTypes.LIST_PDF_TEMPLATES,
  payload
});

export const loadPdfTemplate = (payload) => ({
  type: actionTypes.LOAD_PDF_TEMPLATE,
  payload
});

export const savePdfTemplate = (payload) => ({
  type: actionTypes.SAVE_PDF_TEMPLATE,
  payload
});

export const deletePdfTemplate = (payload) => ({
  type: actionTypes.DELETE_PDF_TEMPLATE,
  payload
});

export const resetPdfTemplate = (key, value) => ({
  type: actionTypes.RESET_PDF_TEMPLATE,
  payload: { key, value }
});

export const listPdfTemplatesSuccess = (payload) => ({
  type: actionTypes.LIST_PDF_TEMPLATES_SUCCESS,
  payload
});

export const listPdfTemplatesFailure = (error) => ({
  type: actionTypes.LIST_PDF_TEMPLATES_FAILURE,
  payload: error
});

export const deletePdfTemplateSuccess = (payload) => ({
  type: actionTypes.DELETE_PDF_TEMPLATE_SUCCESS,
  payload
});

export const deletePdfTemplateFailure = (error) => ({
  type: actionTypes.DELETE_PDF_TEMPLATE_FAILURE,
  payload: error
});

export const savePdfTemplateSuccess = (payload) => ({
  type: actionTypes.SAVE_PDF_TEMPLATE_SUCCESS,
  payload
});

export const savePdfTemplateFailure = (error) => ({
  type: actionTypes.SAVE_PDF_TEMPLATE_FAILURE,
  payload: error
});

export const loadPdfTemplateSuccess = (payload) => ({
  type: actionTypes.LOAD_PDF_TEMPLATE_SUCCESS,
  payload
});

export const loadPdfTemplateFailure = (error) => ({
  type: actionTypes.LOAD_PDF_TEMPLATE_FAILURE,
  payload: error
});

export const setTemplateName = (name) => ({
  type: actionTypes.SET_TEMPLATE_NAME,
  payload: { name }
});

export const previewPdfRequest = (editorJSON) => ({
  type: actionTypes.PREVIEW_PDF_REQUEST,
  payload: { editorJSON }
});

export const previewPdfSuccess = (previewContent) => ({
  type: actionTypes.PREVIEW_PDF_SUCCESS,
  payload: { previewContent }
});

export const previewPdfFailure = (error) => ({
  type: actionTypes.PREVIEW_PDF_FAILURE,
  payload: { error }
});