import * as actionTypes from './constants';
import { v4 as uuidv4 } from 'uuid';

// Page size definitions (portrait dimensions at 96 DPI)
const PAGE_SIZES = {
    A4: { width: 794, height: 1123 },      // 210mm x 297mm
    A5: { width: 559, height: 794 },       // 148mm x 210mm
    Letter: { width: 816, height: 1056 },  // 8.5" x 11"
    Legal: { width: 816, height: 1344 },   // 8.5" x 14"
};

// Default A4 dimensions (portrait)
const DEFAULT_PAGE_WIDTH = PAGE_SIZES.A4.width;
const DEFAULT_PAGE_HEIGHT = PAGE_SIZES.A4.height;

const initialState = {
    templateName: 'PDF Template',
    pages: [{ id: uuidv4(), width: DEFAULT_PAGE_WIDTH, height: DEFAULT_PAGE_HEIGHT, elements: [] }],
    currentPageId: null,
    selectedElementId: null,
    variables: [],
    loading: false,
    error: null,

    // Preview State
    previewContent: null,
    previewLoading: false,
    previewError: null
};

initialState.currentPageId = initialState.pages[0].id;

// --- HELPER FUNCTION: Recalculate Table Data ---
// This ensures consistency across Load, Update, and Variable Change events.
// It maps the variable data (source) to the table rows (preview) based on columnMappings.
const generateTableDataFromSource = (element, variables) => {
    if (!element.isDynamic || !element.dataSourceVariable || !element.columnMappings) {
        return element;
    }

    // 1. Find Data Source
    const variable = variables.find(v => v.name === element.dataSourceVariable);
    let sourceData = [];
    if (variable) {
        // Use fallback (mock data) or actual value
        sourceData = Array.isArray(variable.fallback) ? variable.fallback : (variable.value || []);
    }

    // 2. Generate Header Row
    const headerRow = element.columnMappings.map(m => m.header || '');

    // 3. Generate Body Rows
    // Ensure we have at least 1 body row if data exists, or default to current row count
    // We max with 1 to ensure at least one row exists if sourceData is empty
    const rowCount = Math.max((element.rows || 3) - 1, sourceData.length, 1);

    const dataRows = Array(rowCount).fill(null).map((_, rIdx) => {
        return element.columnMappings.map(mapping => {
            // If data exists for this row, extract it using dataKey
            if (rIdx < sourceData.length && mapping.dataKey) {
                const rowItem = sourceData[rIdx];
                // Safely access the property and convert to string
                return (rowItem && rowItem[mapping.dataKey] !== undefined)
                    ? String(rowItem[mapping.dataKey])
                    : '';
            }
            return ''; // Empty cell if no data
        });
    });

    const newData = [headerRow, ...dataRows];

    // 4. Return updated element
    return {
        ...element,
        data: newData,
        rows: newData.length,
        cols: element.columnMappings.length,
        // Recalculate width to ensure columns fit
        width: Math.max(element.columnMappings.length * (element.cellWidth || 100), element.cellWidth || 100)
    };
};

const pdfBuilderReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_ELEMENT: {
            const { elementType } = action.payload;
            let newElement;

            if (elementType === 'table') {
                newElement = {
                    id: uuidv4(),
                    type: 'table',
                    x: 50,
                    y: 50,
                    width: 240,
                    height: 90,
                    rows: 3,
                    cols: 3,
                    cellWidth: 80,
                    cellHeight: 30,
                    data: [
                        ['Header 1', 'Header 2', 'Header 3'],
                        ['', '', ''],
                        ['', '', '']
                    ],
                    isDynamic: false,
                    dataSourceVariable: '',
                    columns: [],
                    columnMappings: [],
                    borderColor: '#000000',
                    borderWidth: 1,
                    showGridLines: true,
                    hasHeader: true,
                    headerBackgroundColor: '#f0f0f0',
                    cellBackgroundColor: '#ffffff',
                    alternateRowColor: null,
                    fontSize: 12,
                    fontFamily: 'Arial',
                    textColor: '#000000',
                    headerTextColor: '#000000',
                    textAlign: 'left',
                    verticalAlign: 'top',
                    cellPadding: 4,
                    cellStyles: {},
                    stroke: '#000',
                    opacity: 1
                };
            } else {
                const baseElement = {
                    id: uuidv4(),
                    type: elementType,
                    x: 70,
                    y: 70,
                    fill: '#000000',
                    stroke: '#000000',
                    strokeWidth: 0,
                    fontStyle: 'normal',
                    textDecoration: '',
                    fontFamily: 'Arial',
                    align: 'left',
                    opacity: 1,
                };

                switch (elementType) {
                    case 'qr':
                        newElement = { ...baseElement, width: 100, height: 100, qrData: 'https://example.com', fill: 'transparent' };
                        break;
                    case 'heading':
                        newElement = { ...baseElement, width: 300, height: 60, text: 'Heading', fontSize: 32, fontStyle: 'bold', headingLevel: 'h1' };
                        break;
                    case 'text':
                        newElement = { ...baseElement, width: 250, height: 40, text: 'I am a Text block', fontSize: 14 };
                        break;
                    case 'image':
                        newElement = { ...baseElement, width: 150, height: 150, imageUrl: 'https://placehold.co/150x150/e2e8f0/4a5568?text=Image', fill: 'transparent' };
                        break;
                    case 'textarea':
                        newElement = {
                            ...baseElement,
                            width: 350, height: 150,
                            text: 'Text Area',
                            fontSize: 14,
                            fill: '#000000',
                            backgroundColor: '#ffffff',
                            stroke: '#cbd5e0',
                            strokeWidth: 1,
                            padding: 10
                        };
                        break;
                    case 'line':
                        newElement = { ...baseElement, width: 400, height: 2, fill: '#000000', stroke: '#000000', strokeWidth: 2 };
                        break;
                    case 'box':
                        newElement = { ...baseElement, fill: 'transparent', stroke: '#000000', strokeWidth: 2 };
                        break;
                    default:
                        newElement = { ...baseElement, text: 'New Element', width: 150, height: 50 };
                }
            }

            return {
                ...state,
                pages: state.pages.map(page =>
                    page.id === state.currentPageId
                        ? { ...page, elements: [...page.elements, newElement] }
                        : page
                ),
                selectedElementId: newElement.id,
            };
        }

        case actionTypes.ADD_PAGE: {
            const orientation = action.payload?.orientation || 'portrait';
            const size = action.payload?.size || 'A4';
            const isLandscape = orientation === 'landscape';

            // Get dimensions for selected size
            const sizeConfig = PAGE_SIZES[size] || PAGE_SIZES.A4;
            const baseWidth = sizeConfig.width;
            const baseHeight = sizeConfig.height;

            const newPage = {
                id: uuidv4(),
                width: isLandscape ? baseHeight : baseWidth,
                height: isLandscape ? baseWidth : baseHeight,
                size: size,
                elements: []
            };
            return {
                ...state,
                pages: [...state.pages, newPage],
                currentPageId: newPage.id,
                selectedElementId: null,
            };
        }

        case actionTypes.ADD_PAGES_FROM_PDF: {
            const { pdfPages } = action.payload;

            const newPages = pdfPages.map((pdfPage, index) => {
                const pageId = uuidv4();

                // Use actual PDF page dimensions (supports portrait, landscape, or mixed)
                const pageWidth = pdfPage.width || DEFAULT_PAGE_WIDTH;
                const pageHeight = pdfPage.height || DEFAULT_PAGE_HEIGHT;

                // Debug logging
                console.log(`Creating page ${index + 1}: ${pageWidth}x${pageHeight}, isLandscape=${pageWidth > pageHeight}`);

                const imageElement = {
                    id: uuidv4(),
                    type: 'bg_image',
                    x: 0,
                    y: 0,
                    width: pageWidth,
                    height: pageHeight,
                    imageUrl: pdfPage.imageData,
                    opacity: 1,
                    rotation: 0,
                    draggable: false,
                    isBackground: true,
                };

                return {
                    id: pageId,
                    width: pageWidth,
                    height: pageHeight,
                    elements: [imageElement],
                };
            });

            // Check if current state only has one empty page - replace it instead of appending
            const hasOnlyEmptyPage = state.pages.length === 1 && state.pages[0].elements.length === 0;

            return {
                ...state,
                pages: hasOnlyEmptyPage ? newPages : [...state.pages, ...newPages],
                currentPageId: newPages[0]?.id || state.currentPageId,
                selectedElementId: null,
            };
        }

        case actionTypes.DELETE_PAGE: {
            const { pageId } = action.payload;
            if (state.pages.length <= 1) {
                return state;
            }
            const newPages = state.pages.filter(p => p.id !== pageId);
            const newCurrentPageId = state.currentPageId === pageId
                ? newPages[0].id
                : state.currentPageId;
            return {
                ...state,
                pages: newPages,
                currentPageId: newCurrentPageId,
                selectedElementId: null
            };
        }

        case actionTypes.SET_CURRENT_PAGE:
            return {
                ...state,
                currentPageId: action.payload.pageId,
                selectedElementId: null,
            };

        case actionTypes.REORDER_PAGE: {
            return {
                ...state,
                pages: action.payload
            };
        }

        case actionTypes.UPDATE_ELEMENT: {
            const { elementId, updates } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => {
                    if (page.id !== state.currentPageId) {
                        return page;
                    }

                    return {
                        ...page,
                        elements: page.elements.map(el => {
                            if (el.id === elementId) {
                                // 1. Check if it's a table
                                if (el.type === 'table') {
                                    let syncUpdates = { ...updates };

                                    // 2. If Width changed -> Recalculate Cell Width
                                    if (updates.width !== undefined && el.cols > 0) {
                                        syncUpdates.cellWidth = updates.width / el.cols;
                                    }

                                    // 3. If Height changed -> Recalculate Cell Height
                                    if (updates.height !== undefined && el.rows > 0) {
                                        syncUpdates.cellHeight = updates.height / el.rows;
                                    }

                                    return { ...el, ...syncUpdates };
                                }

                                // 4. Not a table, proceed normally
                                return { ...el, ...updates };
                            }
                            return el;
                        }),
                    };
                }),
            };
        }

        case actionTypes.DELETE_ELEMENT:
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.filter(el => el.id !== action.payload.elementId)
                })),
                selectedElementId: state.selectedElementId === action.payload.elementId ? null : state.selectedElementId,
            };

        case actionTypes.SELECT_ELEMENT:
            return { ...state, selectedElementId: action.payload.elementId };

        case actionTypes.DESELECT_ELEMENT:
            return { ...state, selectedElementId: null };

        case actionTypes.UPDATE_TABLE_CELL: {
            const { elementId, rowIndex, colIndex, value } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el => {
                        if (el.id === elementId && el.type === 'table') {
                            const newData = el.data.map((row, rIdx) =>
                                rIdx === rowIndex
                                    ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
                                    : row
                            );
                            return { ...el, data: newData };
                        }
                        return el;
                    }),
                })),
            };
        }

        case actionTypes.ADD_TABLE_ROW: {
            const { elementId, position } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el => {
                        if (el.id === elementId && el.type === 'table') {
                            const newRow = Array(el.cols).fill('');
                            const newData = position === 'start'
                                ? [newRow, ...el.data]
                                : [...el.data, newRow];
                            return {
                                ...el,
                                data: newData,
                                rows: el.rows + 1,
                                height: el.height + el.cellHeight
                            };
                        }
                        return el;
                    }),
                })),
            };
        }

        case actionTypes.DELETE_TABLE_ROW: {
            const { elementId, rowIndex } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el => {
                        if (el.id === elementId && el.type === 'table' && el.rows > 1) {
                            const newData = el.data.filter((_, idx) => idx !== rowIndex);
                            return {
                                ...el,
                                data: newData,
                                rows: el.rows - 1,
                                height: el.height - el.cellHeight
                            };
                        }
                        return el;
                    }),
                })),
            };
        }

        case actionTypes.DELETE_TABLE_COLUMN: {
            const { elementId, colIndex } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el => {
                        if (el.id === elementId && el.type === 'table' && el.cols > 1) {
                            const newData = el.data.map(row =>
                                row.filter((_, idx) => idx !== colIndex)
                            );
                            const newCols = el.cols - 1;
                            const newWidth = newCols * el.cellWidth;

                            return {
                                ...el,
                                data: newData,
                                cols: newCols,
                                width: Math.max(newWidth, el.cellWidth)
                            };
                        }
                        return el;
                    }),
                })),
            };
        }

        case actionTypes.ADD_TABLE_COLUMN: {
            const { elementId, position } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el => {
                        if (el.id === elementId && el.type === 'table') {
                            const newData = el.data.map(row =>
                                position === 'start' ? ['', ...row] : [...row, '']
                            );
                            return {
                                ...el,
                                data: newData,
                                cols: el.cols + 1,
                                width: el.width + el.cellWidth
                            };
                        }
                        return el;
                    }),
                })),
            };
        }

        case actionTypes.UPDATE_TABLE_STYLE: {
            const { elementId, styleUpdates } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el =>
                        el.id === elementId && el.type === 'table'
                            ? { ...el, ...styleUpdates }
                            : el
                    ),
                })),
            };
        }

        case actionTypes.UPDATE_CELL_STYLE: {
            const { elementId, rowIndex, colIndex, styleUpdates } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el => {
                        if (el.id === elementId && el.type === 'table') {
                            const cellKey = `${rowIndex}-${colIndex}`;
                            return {
                                ...el,
                                cellStyles: {
                                    ...el.cellStyles,
                                    [cellKey]: {
                                        ...(el.cellStyles?.[cellKey] || {}),
                                        ...styleUpdates
                                    }
                                }
                            };
                        }
                        return el;
                    }),
                })),
            };
        }

        // --- DYNAMIC TABLE LOGIC ---

        case actionTypes.TOGGLE_TABLE_DYNAMIC: {
            const { elementId } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el => {
                        if (el.id === elementId && el.type === 'table') {
                            const isDynamic = !el.isDynamic;
                            // When toggling ON, try to hydrate if variables are set
                            const updatedEl = { ...el, isDynamic };
                            return isDynamic ? generateTableDataFromSource(updatedEl, state.variables) : updatedEl;
                        }
                        return el;
                    }),
                })),
            };
        }

        case actionTypes.TOGGLE_TABLE_DYNAMIC_MODE: {
            const { elementId, isDynamic } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el => {
                        if (el.id === elementId && el.type === 'table') {
                            const updatedEl = { ...el, isDynamic };

                            // Initialize mappings if empty and switching to dynamic
                            if (isDynamic && (!el.columnMappings || el.columnMappings.length === 0)) {
                                updatedEl.columnMappings = [];
                                updatedEl.data = [];
                            }

                            // Hydrate data immediately
                            return isDynamic ? generateTableDataFromSource(updatedEl, state.variables) : updatedEl;
                        }
                        return el;
                    })
                }))
            };
        }

        case actionTypes.SET_TABLE_DATA_SOURCE: {
            const { elementId, dataSourceVariable } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el => {
                        if (el.id === elementId && el.type === 'table') {
                            const updatedEl = { ...el, dataSourceVariable };
                            // Immediately regenerate data when source changes
                            return generateTableDataFromSource(updatedEl, state.variables);
                        }
                        return el;
                    }),
                })),
            };
        }

        case actionTypes.ADD_TABLE_COLUMN_MAPPING: {
            const { elementId } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el => {
                        if (el.id === elementId) {
                            const newMapping = { header: 'New Column', dataKey: '' };
                            const updatedEl = {
                                ...el,
                                columnMappings: [...(el.columnMappings || []), newMapping]
                            };
                            return generateTableDataFromSource(updatedEl, state.variables);
                        }
                        return el;
                    })
                }))
            };
        }

        case actionTypes.UPDATE_TABLE_COLUMN_MAPPING: {
            const { elementId, index, field, value } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el => {
                        if (el.id === elementId) {
                            const updatedMappings = [...(el.columnMappings || [])];
                            if (updatedMappings[index]) {
                                updatedMappings[index] = { ...updatedMappings[index], [field]: value };
                            }

                            const updatedEl = { ...el, columnMappings: updatedMappings };
                            return generateTableDataFromSource(updatedEl, state.variables);
                        }
                        return el;
                    })
                }))
            };
        }

        case actionTypes.DELETE_TABLE_COLUMN_MAPPING: {
            const { elementId, index } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el => {
                        if (el.id === elementId) {
                            const updatedMappings = (el.columnMappings || []).filter((_, i) => i !== index);
                            const updatedEl = { ...el, columnMappings: updatedMappings };
                            // Ensure at least 1 column or empty state
                            if (updatedMappings.length === 0) {
                                return { ...updatedEl, data: [], cols: 0, width: 100 };
                            }
                            return generateTableDataFromSource(updatedEl, state.variables);
                        }
                        return el;
                    })
                }))
            };
        }

        case actionTypes.REORDER_TABLE_COLUMNS: {
            const { elementId, fromIndex, toIndex } = action.payload;
            return {
                ...state,
                pages: state.pages.map(page => ({
                    ...page,
                    elements: page.elements.map(el => {
                        if (el.id === elementId && el.type === 'table') {
                            // Reorder columns (configuration for dynamic mode uses columnMappings)
                            const updatedColumns = [...(el.columns || [])];
                            if (updatedColumns.length > 0) {
                                const [movedColumn] = updatedColumns.splice(fromIndex, 1);
                                updatedColumns.splice(toIndex, 0, movedColumn);
                            }

                            // Reorder Mappings if they exist
                            const updatedMappings = [...(el.columnMappings || [])];
                            if (updatedMappings.length > 0) {
                                const [movedMapping] = updatedMappings.splice(fromIndex, 1);
                                updatedMappings.splice(toIndex, 0, movedMapping);
                            }

                            const updatedEl = {
                                ...el,
                                columns: updatedColumns,
                                columnMappings: updatedMappings
                            };

                            // Regenerate data if dynamic
                            return el.isDynamic ? generateTableDataFromSource(updatedEl, state.variables) : updatedEl;
                        }
                        return el;
                    })
                }))
            };
        }

        // --- VARIABLE MANAGEMENT ---

        case actionTypes.SET_VARIABLES: {
            const newVariables = Array.isArray(action.payload.variables) ? action.payload.variables : state.variables;

            // ✅ FIX: When variables are set/loaded, update all dynamic tables that rely on them
            const updatedPages = state.pages.map(page => ({
                ...page,
                elements: page.elements.map(el => {
                    if (el.type === 'table' && el.isDynamic && el.dataSourceVariable) {
                        return generateTableDataFromSource(el, newVariables);
                    }
                    return el;
                })
            }));

            return {
                ...state,
                variables: newVariables,
                pages: updatedPages
            };
        }

        case actionTypes.ADD_VARIABLE: {
            const { variable } = action.payload;
            const exists = state.variables.some(v => v.name === variable.name);
            if (exists) {
                console.warn(`Variable with name "${variable.name}" already exists`);
                return state;
            }
            return { ...state, variables: [...state.variables, variable] };
        }

        case actionTypes.UPDATE_VARIABLE: {
            const { index, updates } = action.payload;
            if (index < 0 || index >= state.variables.length) return state;

            const newVariables = state.variables.map((v, i) => i === index ? { ...v, ...updates } : v);

            // Update tables immediately when variable data changes
            const updatedPages = state.pages.map(page => ({
                ...page,
                elements: page.elements.map(el => {
                    if (el.type === 'table' && el.isDynamic && el.dataSourceVariable) {
                        return generateTableDataFromSource(el, newVariables);
                    }
                    return el;
                })
            }));

            return { ...state, variables: newVariables, pages: updatedPages };
        }

        case actionTypes.DELETE_VARIABLE: {
            const { index } = action.payload;
            if (index < 0 || index >= state.variables.length) return state;

            const newVariables = state.variables.filter((_, i) => i !== index);
            // Update tables immediately (they will likely empty out)
            const updatedPages = state.pages.map(page => ({
                ...page,
                elements: page.elements.map(el => {
                    if (el.type === 'table' && el.isDynamic && el.dataSourceVariable) {
                        return generateTableDataFromSource(el, newVariables);
                    }
                    return el;
                })
            }));

            return { ...state, variables: newVariables, pages: updatedPages };
        }

        case actionTypes.SAVE_PDF_REQUEST:
            return { ...state, loading: true };

        case actionTypes.SAVE_PDF_SUCCESS:
            return { ...state, loading: false, error: null };

        case actionTypes.SAVE_PDF_FAILURE:
            return { ...state, loading: false, error: action.payload.error };

        case actionTypes.BRING_ELEMENT_FORWARD: {
            const { elementId } = action.payload;
            const currentPage = state.pages.find(p => p.id === state.currentPageId);
            if (!currentPage) return state;
            const elements = [...currentPage.elements];
            const index = elements.findIndex(el => el.id === elementId);
            if (index < elements.length - 1) {
                [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
            }
            return {
                ...state,
                pages: state.pages.map(page => page.id === state.currentPageId ? { ...page, elements } : page)
            };
        }

        case actionTypes.SEND_ELEMENT_BACKWARD: {
            const { elementId } = action.payload;
            const currentPage = state.pages.find(p => p.id === state.currentPageId);
            if (!currentPage) return state;
            const elements = [...currentPage.elements];
            const index = elements.findIndex(el => el.id === elementId);
            if (index > 0) {
                [elements[index], elements[index - 1]] = [elements[index - 1], elements[index]];
            }
            return {
                ...state,
                pages: state.pages.map(page => page.id === state.currentPageId ? { ...page, elements } : page)
            };
        }

        case actionTypes.BRING_ELEMENT_TO_FRONT: {
            const { elementId } = action.payload;
            const currentPage = state.pages.find(p => p.id === state.currentPageId);
            if (!currentPage) return state;
            const elements = [...currentPage.elements];
            const index = elements.findIndex(el => el.id === elementId);
            if (index !== -1) {
                const element = elements.splice(index, 1)[0];
                elements.push(element);
            }
            return {
                ...state,
                pages: state.pages.map(page => page.id === state.currentPageId ? { ...page, elements } : page)
            };
        }

        case actionTypes.SEND_ELEMENT_TO_BACK: {
            const { elementId } = action.payload;
            const currentPage = state.pages.find(p => p.id === state.currentPageId);
            if (!currentPage) return state;
            const elements = [...currentPage.elements];
            const index = elements.findIndex(el => el.id === elementId);
            if (index !== -1) {
                const element = elements.splice(index, 1)[0];
                elements.unshift(element);
            }
            return {
                ...state,
                pages: state.pages.map(page => page.id === state.currentPageId ? { ...page, elements } : page)
            };
        }

        case actionTypes.DUPLICATE_ELEMENT: {
            const { elementId } = action.payload;
            const currentPage = state.pages.find(p => p.id === state.currentPageId);
            if (!currentPage) return state;
            const elements = [...currentPage.elements];
            const element = elements.find(el => el.id === elementId);
            if (element) {
                const duplicated = {
                    ...element,
                    id: uuidv4(),
                    x: element.x + 20,
                    y: element.y + 20,
                };
                elements.push(duplicated);
                return {
                    ...state,
                    pages: state.pages.map(page => page.id === state.currentPageId ? { ...page, elements } : page),
                    selectedElementId: duplicated.id
                };
            }
            return state;
        }

        case actionTypes.SET_TEMPLATE_NAME:
            return { ...state, templateName: action.payload.name };

        case actionTypes.LOAD_PDF_TEMPLATE: {
            const newPages = action.payload.pages;
            const newVariables = action.payload.variables || [];

            // Hydrate dynamic tables and ensure page dimensions exist
            const hydratedPages = newPages.map(page => ({
                ...page,
                // Ensure pages have dimensions (for backward compatibility with old templates)
                width: page.width || DEFAULT_PAGE_WIDTH,
                height: page.height || DEFAULT_PAGE_HEIGHT,
                elements: page.elements.map(el => {
                    if (el.type === 'table' && el.isDynamic) {
                        return generateTableDataFromSource(el, newVariables);
                    }
                    return el;
                })
            }));

            const newCurrentPageId = (hydratedPages && hydratedPages.length > 0) ? hydratedPages[0].id : null;

            return {
                ...state,
                templateName: action.payload.name || state.templateName,
                pages: hydratedPages, // Use hydrated pages
                variables: newVariables,
                currentPageId: newCurrentPageId,
                selectedElementId: null
            };
        }

        case actionTypes.RESET_PDF_TEMPLATE: {
            const newPageId = uuidv4();
            return {
                ...initialState,
                templateName: 'Untitled Template',
                pages: [{ id: newPageId, width: DEFAULT_PAGE_WIDTH, height: DEFAULT_PAGE_HEIGHT, elements: [] }],
                currentPageId: newPageId,
            };
        }

        // --- PREVIEW ACTIONS ---
        case actionTypes.PREVIEW_PDF_REQUEST:
            return { ...state, previewLoading: true, previewError: null };

        case actionTypes.PREVIEW_PDF_SUCCESS:
            return {
                ...state,
                previewLoading: false,
                previewContent: action.payload.previewContent,
                previewError: null
            };

        case actionTypes.PREVIEW_PDF_FAILURE:
            return { ...state, previewLoading: false, previewError: action.payload.error };

        default:
            return state;
    }
};

export default pdfBuilderReducer;