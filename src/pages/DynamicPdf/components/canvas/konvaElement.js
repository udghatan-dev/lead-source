import React, { useRef, useEffect, useState } from 'react';
import { Rect, Text, Image as KonvaImage, Group, Line } from 'react-konva';
import useImage from 'use-image';
import QRCode from 'qrcode';

const DEFAULT_PDF_WIDTH = 794;
const DEFAULT_PDF_HEIGHT = 1123;
const MARGIN = 36;

const round = (num, decimals = 3) => parseFloat(num.toFixed(decimals));

const KonvaElement = ({ element, isSelected, onSelect, onChange, forwardRef, onCellClick, onContextMenu, pageWidth = DEFAULT_PDF_WIDTH, pageHeight = DEFAULT_PDF_HEIGHT }) => {
  const internalRef = useRef();
  const shapeRef = forwardRef || internalRef;

  const [img] = useImage(element?.imageUrl, 'Anonymous');
  const [qrImage, setQrImage] = useState(null);

  // QR Code generation
  useEffect(() => {
    if (element?.type === 'qr' && element?.qrData) {
      let cancelled = false;

      const qrOptions = {
        width: element.width,
        margin: 1,
        color: {
          dark: '#000000',
          light: element.qrTransparentBg !== false ? '#00000000' : (element.qrBackgroundColor || '#ffffff')
        }
      };

      QRCode.toDataURL(element.qrData, qrOptions)
        .then(url => {
          if (!cancelled) {
            const image = new window.Image();
            image.src = url;
            image.onload = () => setQrImage(image);
          }
        })
        .catch(() => {});

      return () => { cancelled = true; };
    }
  }, [element?.type, element?.qrData, element?.width, element.qrTransparentBg, element.qrBackgroundColor]);

  if (!element) return null;

  const dragBoundFunc = (pos) => {
    const node = shapeRef.current;
    if (!node) return pos;

    try {
      const box = node.getClientRect();
      const newX = Math.max(MARGIN, Math.min(pos.x, pageWidth - MARGIN - box.width));
      const newY = Math.max(MARGIN, Math.min(pos.y, pageHeight - MARGIN - box.height));
      return { x: newX, y: newY };
    } catch {
      return pos;
    }
  };

  const handleSelect = (e) => {
    e?.cancelBubble?.();
    onSelect?.(element.id);
  };

  const handleDragEnd = (e) => {
    const finalPos = dragBoundFunc(e.target.position());
    onChange?.({
      x: round(finalPos.x),
      y: round(finalPos.y)
    });
  };

  const handleTransformEnd = () => {
    try {
      const node = shapeRef.current;
      if (!node) return;

      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      const rotation = node.rotation();

      let { x, y } = node.position();
      let width = element.width;
      let height = element.height;

      if (element.type === 'line') {
        width = Math.max(20, element.width * scaleX);
        height = element.strokeWidth || 2;

        node.scaleX(1);
        node.scaleY(1);

        x = Math.max(MARGIN, x);
        y = Math.max(MARGIN, y);

        onChange?.({
          x: round(x),
          y: round(y),
          width: round(width),
          height: round(height),
          rotation: round(rotation)
        });  //  SAVE ROTATION
        return;
      }

      //  ALL OTHER ELEMENTS - Normal handling
      node.scaleX(1);
      node.scaleY(1);

      width = Math.max(20, element.width * scaleX);
      height = Math.max(20, element.height * scaleY);

      const box = node.getClientRect();
      x = Math.max(MARGIN, Math.min(x, pageWidth - MARGIN - box.width));
      y = Math.max(MARGIN, Math.min(y, pageHeight - MARGIN - box.height));

      onChange?.({
        x: round(x),
        y: round(y),
        width: round(width),
        height: round(height),
        rotation: round(rotation)
      });  //  SAVE ROTATION
    } catch {
      // silently ignore
    }
  };
  // --- END: MODIFIED BLOCK 2 ---

  const renderContent = () => {
    switch (element.type) {
      case 'qr':
        return qrImage ? (
          <Group>
            {element.qrTransparentBg === false && (
              <Rect
                width={element.width}
                height={element.height}
                fill={element.qrBackgroundColor || '#ffffff'}
              />
            )}
            <KonvaImage image={qrImage} width={element.width} height={element.height} />
          </Group>
        ) : (
          <Rect width={element.width} height={element.height} fill="#f0f0f0" />
        );

      case 'heading':
      case 'text':
        return (
          <Text
            text={element.text || ''}
            fontSize={element.fontSize || 16}
            fontFamily={element.fontFamily || 'Arial'}
            fontStyle={element.fontStyle}
            textDecoration={element.textDecoration}
            fill={element.fill || '#000'}
            align={element.align || 'left'}
            width={element.width}
            height={element.height}
            verticalAlign="middle"
          />
        );

      case 'textarea':
        return (
          <Group>
            <Rect
              width={element.width}
              height={element.height}
              stroke={element.stroke || '#ddd'}
              strokeWidth={element.strokeWidth || 1}
              fill={element.backgroundColor || '#fff'}
            />
            <Text
              text={element.text || ''}
              fontSize={element.fontSize || 14}
              fontFamily={element.fontFamily || 'Arial'}
              fill={element.fill || '#000'}
              align={element.align || 'left'}
              width={Math.max(0, element.width - (element.padding || 10) * 2)}
              height={Math.max(0, element.height - (element.padding || 10) * 2)}
              x={element.padding || 10}
              y={element.padding || 10}
              verticalAlign="top"
            />
          </Group>
        );

      case 'image':
        return img ? (
          <KonvaImage image={img} width={element.width} height={element.height} />
        ) : (
          <Rect width={element.width} height={element.height} fill="#f0f0f0" />
        );

      case 'box':
        return (
          <Rect
            width={element.width || (pageWidth - 2 * MARGIN)}  // Default: full page width
            height={element.height || (pageHeight - 2 * MARGIN)} // Default: full page height
            stroke={element.stroke || '#000000'}
            strokeWidth={element.strokeWidth || 2}
            fill={element.fill || 'transparent'}
          />
        );

      case 'line': {
        const lineLength = element.width || 100;
        const strokeWidth = element.strokeWidth || 2;
        
        // Define a "hittable" height. At least 20px, or 
        // 10px padding around the visible stroke, whichever is larger.
        const hitAreaHeight = Math.max(20, strokeWidth + 10);
  
        return (
          // We use a React.Fragment (<>) to return two elements,
          // which will both be placed inside the main draggable <Group>.
          <>
            {/* 1. The INVISIBLE Hitbox */}
            {/* This Rect defines the "grabbable" area for the group. */}
            <Rect
              width={lineLength}
              height={hitAreaHeight}
              // Center the hitbox vertically around the line (which is at y=0)
              y={-hitAreaHeight / 2} 
              fill="transparent"
              listening={true} // Make sure it can be "hit"
            />
            
            {/* 2. The VISIBLE Line */}
            <Line
              points={[0, 0, lineLength, 0]} // Still drawn at y=0
              stroke={element.stroke || '#000000'}
              strokeWidth={strokeWidth}
              lineCap="round"
              lineJoin="round"
              // The Rect now handles all hit events, so we can disable
              // listening on the line itself to be more efficient.
              listening={false} 
            />
          </>
        );
      }

      case 'table': {
        const rows = element.rows || 3;
        const cols = element.cols || 3;
        const cellWidth = element.cellWidth || Math.round((element.width || 240) / cols);
        const cellHeight = element.cellHeight || Math.round((element.height || 120) / rows);

        const borderColor = element.borderColor || '#000';
        const borderWidth = element.borderWidth !== undefined ? element.borderWidth : 1;
        const headerBackgroundColor = element.headerBackgroundColor || '#f0f0f0';
        const cellBackgroundColor = element.cellBackgroundColor || '#fff';
        const alternateRowColor = element.alternateRowColor || null;
        const hasHeader = element.hasHeader !== undefined ? element.hasHeader : true;
        const textAlign = element.textAlign || 'left';
        const verticalAlign = element.verticalAlign || 'top';
        const fontSize = element.fontSize || 12;
        const fontFamily = element.fontFamily || 'Arial';
        const textColor = element.textColor || '#000';
        const headerTextColor = element.headerTextColor || '#000';
        const cellPadding = element.cellPadding !== undefined ? element.cellPadding : 4;
        const showGridLines = element.showGridLines !== undefined ? element.showGridLines : true;

        const cellStyles = element.cellStyles || {};

        const data = element.data || Array.from({ length: rows }, () =>
          Array.from({ length: cols }, () => '')
        );

        const cells = [];
        const lines = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = c * cellWidth;
            const y = r * cellHeight;
            const cellText = data[r]?.[c] ?? '';
            const isHeaderRow = hasHeader && r === 0;

            const cellKey = `${r}-${c}`;
            const cellStyle = cellStyles[cellKey] || {};

            let cellBg = cellStyle.backgroundColor || cellBackgroundColor;
            if (isHeaderRow) {
              cellBg = cellStyle.backgroundColor || headerBackgroundColor;
            } else if (alternateRowColor && r % 2 === 1) {
              cellBg = cellStyle.backgroundColor || alternateRowColor;
            }

            const cellTextColor = cellStyle.textColor || (isHeaderRow ? headerTextColor : textColor);
            const cellFontSize = cellStyle.fontSize || fontSize;
            const cellTextAlign = cellStyle.textAlign || textAlign;
            const cellVerticalAlign = cellStyle.verticalAlign || verticalAlign;
            const cellFontWeight = cellStyle.fontWeight || (isHeaderRow ? 'bold' : 'normal');

            const handleCellDblClick = (e) => {
              e.cancelBubble = true;
              if (e.evt) {
                e.evt.stopPropagation();
                e.evt.preventDefault();
              }

              const stage = e.target.getStage();
              if (stage && onCellClick) {
                const containerRect = stage.container().getBoundingClientRect();
                const absPos = e.target.getAbsolutePosition();

                const cellScreenX = containerRect.left + absPos.x;
                const cellScreenY = containerRect.top + absPos.y;

                onCellClick({
                  elementId: element.id,
                  row: r,
                  col: c,
                  value: cellText,
                  position: {
                    x: cellScreenX,
                    y: cellScreenY,
                    width: cellWidth,
                    height: cellHeight
                  },
                  style: {
                    fontSize: cellFontSize,
                    fontFamily: fontFamily,
                    textAlign: cellTextAlign
                  }
                });
              }
            };

            cells.push(
              <Group
                key={`cell-${r}-${c}`}
                x={x}
                y={y}
                listening={true}
              >
                <Rect
                  width={cellWidth}
                  height={cellHeight}
                  fill={cellBg}
                  stroke={showGridLines ? borderColor : 'transparent'}
                  strokeWidth={showGridLines ? borderWidth : 0}
                  onDblClick={handleCellDblClick}
                  onDblTap={handleCellDblClick}
                  listening={true}
                  perfectDrawEnabled={false}
                />
                <Text
                  x={cellPadding}
                  y={cellPadding}
                  text={cellText}
                  fontSize={cellFontSize}
                  fontFamily={fontFamily}
                  fontStyle={cellFontWeight}
                  fill={cellTextColor}
                  align={cellTextAlign}
                  width={Math.max(0, cellWidth - cellPadding * 2)}
                  height={Math.max(0, cellHeight - cellPadding * 2)}
                  verticalAlign={cellVerticalAlign}
                  wrap="word"
                  ellipsis={true}
                  onDblClick={handleCellDblClick}
                  onDblTap={handleCellDblClick}
                  listening={true}
                  perfectDrawEnabled={false}
                />
              </Group>
            );
          }
        }

        if (borderWidth > 0) {
          const tableWidth = cols * cellWidth;
          const tableHeight = rows * cellHeight;

          lines.push(
            <Rect
              key="outer-border"
              width={tableWidth}
              height={tableHeight}
              stroke={borderColor}
              strokeWidth={borderWidth * 1.5}
              fill="transparent"
            />
          );
        }

        return (
          <Group width={cols * cellWidth} height={rows * cellHeight}>
            {cells}
            {lines}
          </Group>
        );
      }

      default:
        return null;
    }
  };

  const groupProps = {
    id: element.id,
    x: element.x || 0,
    y: element.y || 0,
    rotation: element.rotation || 0,
    opacity: element.opacity !== undefined ? element.opacity : 1,
    onClick: handleSelect,
    onTap: handleSelect,
    ref: shapeRef,
    draggable: true,
    dragBoundFunc,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
    onContextMenu: onContextMenu,
    listening: true,
  };

  return (
    <Group {...groupProps}>
      {renderContent()}
    </Group>
  );
};

export default KonvaElement;