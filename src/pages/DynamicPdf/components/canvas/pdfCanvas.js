//PDFCanvas.js - FIXED FOR LINE ELEMENT
import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState
} from 'react';
import { Stage, Layer, Transformer } from 'react-konva';
import KonvaElement from './konvaElement';
import BackgroundImage from './BackgroundImage';
import ElementContextMenu from '../ElementContextMenu';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectElement,
  updateElement,
  deselectElement,
  deleteElement,
  bringElementForward,
  sendElementBackward,
  bringElementToFront,
  sendElementToBack,
  duplicateElement
} from '../../store/actions';

// Default A4 dimensions (used as fallback)
const DEFAULT_PDF_WIDTH = 794;
const DEFAULT_PDF_HEIGHT = 1123;
const MARGIN = 36;

const VIEWPORT_WIDTH = 840;
const VIEWPORT_HEIGHT = 700;

const PDFCanvas = forwardRef((props, ref) => {
  const stageRef = useRef();
  const transformerRef = useRef();
  const nodeRefs = useRef({});
  const containerRef = useRef();
  const dispatch = useDispatch();
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [contextMenuElementId, setContextMenuElementId] = useState(null);

  const { elements = [], backgroundImage = null, pageWidth, pageHeight } = useSelector(state => {
    const pdfState = state.pdfBuilder || { pages: [], currentPageId: null };
    const page =
      pdfState.pages.find(p => p.id === pdfState.currentPageId) || {
        elements: [],
        width: DEFAULT_PDF_WIDTH,
        height: DEFAULT_PDF_HEIGHT
      };

    // Separate background image from regular elements
    const bgImage = page.elements.find(el => el.type === 'bg_image' || el.isBackground);
    const regularElements = page.elements.filter(el => el.type !== 'bg_image' && !el.isBackground);

    return {
      elements: regularElements,
      backgroundImage: bgImage,
      pageWidth: page.width || DEFAULT_PDF_WIDTH,
      pageHeight: page.height || DEFAULT_PDF_HEIGHT
    };
  });

  const selectedId = useSelector(
    state => state.pdfBuilder?.selectedElementId
  );

  const selectedElement = elements.find(el => el.id === selectedId);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedElement) return;

      const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if (isTyping || isEditingTable) return;

      const step = e.shiftKey ? 10 : 1;
      let updates = {};

      switch (e.key) {
        case 'ArrowUp':
          updates.y = Math.max(MARGIN, selectedElement.y - step);
          e.preventDefault();
          break;
        case 'ArrowDown':
          updates.y = Math.min(pageHeight - MARGIN - (selectedElement.height || 0), selectedElement.y + step);
          e.preventDefault();
          break;
        case 'ArrowLeft':
          updates.x = Math.max(MARGIN, selectedElement.x - step);
          e.preventDefault();
          break;
        case 'ArrowRight':
          updates.x = Math.min(pageWidth - MARGIN - (selectedElement.width || 0), selectedElement.x + step);
          e.preventDefault();
          break;
        case 'Delete':
          dispatch(deleteElement(selectedElement.id));
          e.preventDefault();
          return;
        default:
          return;
      }

      if (Object.keys(updates).length > 0) {
        dispatch(updateElement(selectedElement.id, updates));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElement, dispatch, isEditingTable, pageWidth, pageHeight]);

  useEffect(() => {
    if (!transformerRef.current) return;

    if (isEditingTable) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
      return;
    }

    if (selectedId) {
      const node = nodeRefs.current[selectedId]?.current;
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, elements, isEditingTable]);

  const handleElementChange = (elementId, patch) => {
    dispatch(updateElement(elementId, patch));
  };

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      dispatch(deselectElement());
    }
  };

  const handleStageMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      dispatch(deselectElement());
    }
  };

  const handleElementRightClick = (e, elementId) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    setContextMenu({
      x: pointerPosition.x,
      y: pointerPosition.y,
    });
    setContextMenuElementId(elementId);
    dispatch(selectElement(elementId));
  };

  const handleContextMenuAction = (action) => {
    if (!contextMenuElementId) return;

    switch (action) {
      case 'edit':
        window.dispatchEvent(new CustomEvent('showPropertiesPanel'));
        break;
      case 'duplicate':
        dispatch(duplicateElement(contextMenuElementId));
        break;
      case 'bringForward':
        dispatch(bringElementForward(contextMenuElementId));
        break;
      case 'sendBackward':
        dispatch(sendElementBackward(contextMenuElementId));
        break;
      case 'bringToFront':
        dispatch(bringElementToFront(contextMenuElementId));
        break;
      case 'sendToBack':
        dispatch(sendElementToBack(contextMenuElementId));
        break;
      case 'delete':
        dispatch(deleteElement(contextMenuElementId));
        break;
      default:
        break;
    }
  };

  const closeContextMenu = () => {
    setContextMenu(null);
    setContextMenuElementId(null);
  };

  useImperativeHandle(ref, () => ({
    getStage: () => stageRef.current,
    toDataURL: (options = {}) => stageRef.current?.toDataURL(options),
    toJSON: () => stageRef.current?.toJSON(),
    setIsEditingTable: (isEditing) => setIsEditingTable(isEditing)
  }));

  // ⭐ NEW: Get enabled anchors based on element type
  const getEnabledAnchors = () => {
    if (!selectedElement) return undefined;

    switch (selectedElement.type) {
      case 'line':
        // Only allow horizontal resizing (left and right handles)
        return ['middle-left', 'middle-right'];

      case 'table':
        // Only corner handles for tables
        return ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

      default:
        // All handles for other elements
        return [
          'top-left', 'top-center', 'top-right',
          'middle-left', 'middle-right',
          'bottom-left', 'bottom-center', 'bottom-right'
        ];;
    }
  };
  const isRotationEnabled = () => {
    if (!selectedElement) return true;

    // Enable rotation for all elements except tables
    return selectedElement.type !== 'table';
  };

  const viewportWidth = Math.max(VIEWPORT_WIDTH, pageWidth + 40);
  const viewportHeight = Math.max(VIEWPORT_HEIGHT, pageHeight + 40);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: `${viewportWidth}px`,
        height: `${viewportHeight}px`,
        overflow: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f5f5f5'
      }}
    >
      <div style={{
        display: 'inline-block',
        margin: '20px'
      }}>
        <Stage
          ref={stageRef}
          width={pageWidth}
          height={pageHeight}
          style={{
            background: 'white',
            boxShadow: '0 0 8px rgba(0,0,0,0.2)'
          }}
          onClick={handleStageClick}
          onMouseDown={handleStageMouseDown}
          onContextMenu={(e) => e.evt.preventDefault()}
        >
          <Layer>
            {/* Render background image first (if exists) - non-selectable, non-draggable */}
            {backgroundImage && (
              <BackgroundImage
                imageUrl={backgroundImage.imageUrl}
                width={pageWidth}
                height={pageHeight}
              />
            )}

            {/* Render regular elements */}
            {elements.map(el => {
              if (!nodeRefs.current[el.id]) nodeRefs.current[el.id] = React.createRef();
              return (
                <KonvaElement
                  key={el.id}
                  element={el}
                  forwardRef={nodeRefs.current[el.id]}
                  isSelected={selectedId === el.id}
                  onSelect={() => dispatch(selectElement(el.id))}
                  onChange={patch => handleElementChange(el.id, patch)}
                  onEditingChange={setIsEditingTable}
                  onContextMenu={(e) => handleElementRightClick(e, el.id)}
                  pageWidth={pageWidth}
                  pageHeight={pageHeight}
                />
              );
            })}

            {!isEditingTable && (
              <Transformer
                ref={transformerRef}
                ignoreStroke={true}
                keepRatio={false}
                rotateEnabled={isRotationEnabled()}  // ⭐ Enable rotation
                rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}  // ⭐ Snap to angles
                anchorSize={8}  // ⭐ Make anchors easier to grab
                borderStrokeWidth={2}  // ⭐ Thicker border
                borderStroke="#4dabf7"  // ⭐ Blue color
                enabledAnchors={getEnabledAnchors()}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 10 || newBox.height < 10) return oldBox;
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>
      </div>

      <ElementContextMenu
        position={contextMenu}
        onAction={handleContextMenuAction}
        onClose={closeContextMenu}
      />
    </div>
  );
});

export default PDFCanvas;