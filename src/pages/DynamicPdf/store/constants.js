// store/constants.js
// Action type constants for the PDF Builder feature

// Element Actions
export const ADD_ELEMENT = 'pdfBuilder/ADD_ELEMENT';
export const UPDATE_ELEMENT = 'pdfBuilder/UPDATE_ELEMENT';
export const DELETE_ELEMENT = 'pdfBuilder/DELETE_ELEMENT';
export const DUPLICATE_ELEMENT = 'pdfBuilder/DUPLICATE_ELEMENT';
export const SELECT_ELEMENT = 'pdfBuilder/SELECT_ELEMENT';
export const DESELECT_ELEMENT = 'pdfBuilder/DESELECT_ELEMENT';

// Table-Specific Actions
export const UPDATE_TABLE_CELL = 'pdfBuilder/UPDATE_TABLE_CELL';
export const ADD_TABLE_ROW = 'pdfBuilder/ADD_TABLE_ROW';
export const DELETE_TABLE_ROW = 'pdfBuilder/DELETE_TABLE_ROW';
export const ADD_TABLE_COLUMN = 'pdfBuilder/ADD_TABLE_COLUMN';
export const DELETE_TABLE_COLUMN = 'pdfBuilder/DELETE_TABLE_COLUMN';
export const UPDATE_TABLE_STYLE = 'pdfBuilder/UPDATE_TABLE_STYLE';
export const UPDATE_CELL_STYLE = 'pdfBuilder/UPDATE_CELL_STYLE';

// Dynamic Table Actions (Config)
export const TOGGLE_TABLE_DYNAMIC = 'pdfBuilder/TOGGLE_TABLE_DYNAMIC';
export const SET_TABLE_DATA_SOURCE = 'pdfBuilder/SET_TABLE_DATA_SOURCE';
export const ADD_TABLE_COLUMN_CONFIG = 'pdfBuilder/ADD_TABLE_COLUMN_CONFIG';
export const UPDATE_TABLE_COLUMN_CONFIG = 'pdfBuilder/UPDATE_TABLE_COLUMN_CONFIG';
export const DELETE_TABLE_COLUMN_CONFIG = 'pdfBuilder/DELETE_TABLE_COLUMN_CONFIG';
export const REORDER_TABLE_COLUMNS = 'pdfBuilder/REORDER_TABLE_COLUMNS';

// Dynamic Table Actions (Mappings) - (Was using magic strings)
export const TOGGLE_TABLE_DYNAMIC_MODE = 'pdfBuilder/TOGGLE_TABLE_DYNAMIC_MODE';
export const SET_TABLE_DATA_SOURCE_MAPPING = 'pdfBuilder/SET_TABLE_DATA_SOURCE_MAPPING';
export const ADD_TABLE_COLUMN_MAPPING = 'pdfBuilder/ADD_TABLE_COLUMN_MAPPING';
export const UPDATE_TABLE_COLUMN_MAPPING = 'pdfBuilder/UPDATE_TABLE_COLUMN_MAPPING';
export const DELETE_TABLE_COLUMN_MAPPING = 'pdfBuilder/DELETE_TABLE_COLUMN_MAPPING';

// Layer Management Actions (Consolidated)
export const BRING_ELEMENT_FORWARD = 'pdfBuilder/BRING_ELEMENT_FORWARD';
export const SEND_ELEMENT_BACKWARD = 'pdfBuilder/SEND_ELEMENT_BACKWARD';
export const BRING_ELEMENT_TO_FRONT = 'pdfBuilder/BRING_ELEMENT_TO_FRONT';
export const SEND_ELEMENT_TO_BACK = 'pdfBuilder/SEND_ELEMENT_TO_BACK';

// Page Actions
export const ADD_PAGE = 'pdfBuilder/ADD_PAGE';
export const DELETE_PAGE = 'pdfBuilder/DELETE_PAGE';
export const REORDER_PAGE = 'pdfBuilder/REORDER_PAGE';
export const DUPLICATE_PAGE = 'pdfBuilder/DUPLICATE_PAGE';
export const SET_CURRENT_PAGE = 'pdfBuilder/SET_CURRENT_PAGE';
export const SET_TEMPLATE_NAME = 'pdfBuilder/SET_TEMPLATE_NAME';
export const ADD_PAGES_FROM_PDF = 'pdfBuilder/ADD_PAGES_FROM_PDF';

// Variable Actions
export const SET_VARIABLES = 'pdfBuilder/SET_VARIABLES';
export const ADD_VARIABLE = 'pdfBuilder/ADD_VARIABLE';
export const UPDATE_VARIABLE = 'pdfBuilder/UPDATE_VARIABLE';
export const DELETE_VARIABLE = 'pdfBuilder/DELETE_VARIABLE';

// Saga Actions for Saving to Backend
export const SAVE_PDF_REQUEST = 'pdfBuilder/SAVE_PDF_REQUEST';
export const SAVE_PDF_SUCCESS = 'pdfBuilder/SAVE_PDF_SUCCESS';
export const SAVE_PDF_FAILURE = 'pdfBuilder/SAVE_PDF_FAILURE';

// PDF Template Loading/Saving Actions (Moved from actions.js)
export const LIST_PDF_TEMPLATES = 'LIST_PDF_TEMPLATES';
export const LIST_PDF_TEMPLATES_SUCCESS = 'LIST_PDF_TEMPLATES_SUCCESS';
export const LIST_PDF_TEMPLATES_FAILURE = 'LIST_PDF_TEMPLATES_FAILURE';
export const LOAD_PDF_TEMPLATE = 'LOAD_PDF_TEMPLATE';
export const LOAD_PDF_TEMPLATE_SUCCESS = 'LOAD_PDF_TEMPLATE_SUCCESS';
export const LOAD_PDF_TEMPLATE_FAILURE = 'LOAD_PDF_TEMPLATE_FAILURE';
export const SAVE_PDF_TEMPLATE = 'SAVE_PDF_TEMPLATE';
export const SAVE_PDF_TEMPLATE_SUCCESS = 'SAVE_PDF_TEMPLATE_SUCCESS';
export const SAVE_PDF_TEMPLATE_FAILURE = 'SAVE_PDF_TEMPLATE_FAILURE';
export const DELETE_PDF_TEMPLATE = 'DELETE_PDF_TEMPLATE';
export const DELETE_PDF_TEMPLATE_SUCCESS = 'DELETE_PDF_TEMPLATE_SUCCESS';
export const DELETE_PDF_TEMPLATE_FAILURE = 'DELETE_PDF_TEMPLATE_FAILURE';
export const RESET_PDF_TEMPLATE = 'RESET_PDF_TEMPLATE';

export const PREVIEW_PDF_REQUEST = 'PREVIEW_PDF_REQUEST';
export const PREVIEW_PDF_SUCCESS = 'PREVIEW_PDF_SUCCESS';
export const PREVIEW_PDF_FAILURE = 'PREVIEW_PDF_FAILURE';