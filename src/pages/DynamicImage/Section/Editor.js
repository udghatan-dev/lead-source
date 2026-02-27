import React, { useState } from 'react';
import { Col, Container, Row, Card, CardHeader, CardBody, Input } from 'reactstrap';
import ImageBox from './../Components/Image';
import BgImageBox from './../Components/BackgroundImage';
import Action from './../Components/Action';
import TextBox from './../Components/Text';
import QRBox from './../Components/QR';
import { Stage, Layer, Transformer, Line } from 'react-konva';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Editor = ({
  scale,
  title,
  setTitle,
  saveImageExperience,
  dimensions,
  handleBgImageSelection,
  stageRef,
  transformerRef,
  setMenuPosition,
  onNodeClick,
  shapes,
  onNodeDragEnd,
  hLines,
  vLines,
  menuPosition,
  handleAction,
  divRef,
  onDragMove,
  onDragEnd,
  onRotation,
  backgroundImage,
  variables,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  function generateContent(content) {
    (variables || []).map((variable) => {
      if (content.indexOf('${' + variable.name + '}') !== -1) {
        content = content.replaceAll('${' + variable.name + '}', variable.fallback ?? '');
      }
    });

    return content;
  }

  const [edit, setEdit] = useState(false);

  return (
    <Card className={'w-100 h-100'}>
      <CardHeader className={'d-flex pb-1'}>
        <div className='flex-grow-1 d-flex align-items-start'>
          <span
            class='mt-1'
            contentEditable={edit}
            id='experience_title'
            style={{ display: 'inline-block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {title}
          </span>
          <span className='ms-1'>
            <i
              className={classnames('btn btn-sm btn-ghost-dark btn-icon', { 'bx bx-check fs-14': edit }, { 'ri-pencil-fill': !edit })}
              onClick={() => {
                if (edit) {
                  let div = document.querySelector('#experience_title');
                  if (div) {
                    setTitle(div.textContent);
                  }
                }
                setEdit(!edit);
              }}
            ></i>
          </span>
        </div>
        <div className='flex-shrink-0 d-flex gap-2'>
          <label
            className='btn btn-sm rounded-2 btn-soft-dark d-flex align-items-center'
            onClick={() => {
              history.push('/image');
            }}
          >
            <i className='bx bx-arrow-back me-1 fs-16'></i>
            <span>{t('Back')}</span>
          </label>
          <input type='file' id='background_image_selector' className='d-none' onChange={handleBgImageSelection} />
          <label className='btn btn-sm rounded-2 btn-soft-success d-flex align-items-center' htmlFor='background_image_selector'>
            <i className='bx bxs-image me-1 fs-16'></i>
            <span>{t('Background Image')}</span>
          </label>

          <label className='btn btn-sm rounded-2 btn-soft-primary d-flex align-items-center' onClick={() => saveImageExperience()}>
            <i className='bx bxs-save me-1 fs-16'></i>
            <span>{t('Save')}</span>
          </label>
        </div>
      </CardHeader>
      <CardBody className={'bg-light p-4 w-100 h-100'}>
        <Card className={'mx-auto w-100 pb-0 border-0'}>
          <div ref={divRef} className={'bg-light w-100 d-flex justify-content-center'} style={{ height: '548px', position: 'relative' }}>
            <div style={{ height: dimensions.height * scale, width: dimensions.width * scale, position: 'relative' }}>
              <Stage
                onClick={(e) => e.target === stageRef.current && transformerRef.current.nodes([])}
                ref={stageRef}
                scaleX={scale}
                scaleY={scale}
                width={dimensions.width * scale}
                height={dimensions.height * scale}
                className='bg-white'
                onMouseDown={(e) => {
                  if (e.target === stageRef.current) {
                    setMenuPosition(null);
                  } else {
                    onNodeClick();
                  }
                }}
              >
                <Layer>
                  {/* {backgroundImage !== null && (
                                <BgImageBox
                                  shapeProps={{ x: 0, y: 0, width: dimensions.width, height: dimensions.height, id: 0 }}
                                  content={backgroundImage.url}
                                  onClick={() => {
                                    setMenuPosition(null);
                                    transformerRef.current.nodes([]);
                                  }}
                                />
                              )} */}
                  {shapes.map((element) => {
                    if (element.type === 'bg_image' && backgroundImage !== null) {
                      return (
                        <BgImageBox
                          shapeProps={{ x: 0, y: 0, width: dimensions.width, height: dimensions.height, id: 0 }}
                          content={backgroundImage.url}
                          onClick={() => {
                            setMenuPosition(null);
                            transformerRef.current.nodes([]);
                          }}
                        />
                      );
                    }
                    if (element.type === 'image') {
                      return (
                        <ImageBox
                          key={element.id}
                          shapeProps={{
                            id: element.id,
                            x: element.pos.x,
                            y: element.pos.y,
                            ...element.props,
                          }}
                          content={generateContent(element.props.content)}
                          onMouseDown={(e) => transformerRef.current.nodes([e.currentTarget])}
                          onNodeClick={onNodeClick}
                          onNodeDragEnd={onNodeDragEnd}
                        />
                      );
                    }
                    if (element.type === 'text') {
                      return (
                        <TextBox
                          key={element.id}
                          shapeProps={{
                            id: element.id,
                            x: element.pos.x,
                            y: element.pos.y,
                            ...element.props,
                          }}
                          content={generateContent(element.props.content)}
                          onMouseDown={(e) => transformerRef.current.nodes([e.currentTarget])}
                          onNodeClick={onNodeClick}
                          onNodeDragEnd={onNodeDragEnd}
                          variables={variables}
                        />
                      );
                    }
                    if (element.type === 'qr') {
                      return (
                        <QRBox
                          key={element.id}
                          shapeProps={{
                            id: element.id,
                            x: element.pos.x,
                            y: element.pos.y,
                            ...element.props,
                          }}
                          content={generateContent(element.props.content)}
                          onMouseDown={(e) => transformerRef.current.nodes([e.currentTarget])}
                          onNodeClick={onNodeClick}
                          onNodeDragEnd={onNodeDragEnd}
                          variables={variables}
                        />
                      );
                    }
                  })}

                  <Transformer ref={transformerRef} onDragMove={onDragMove} onDragEnd={onDragEnd} onTransformEnd={onRotation} />
                  {hLines.map((item, i) => (
                    <Line key={i} {...item} />
                  ))}
                  {vLines.map((item, i) => (
                    <Line key={i} {...item} />
                  ))}
                </Layer>
              </Stage>
              {menuPosition && <Action menuPosition={menuPosition} handleAction={handleAction} />}
            </div>
          </div>
        </Card>
      </CardBody>
    </Card>
  );
};

export default Editor;
