import React, { useEffect, useState, useMemo, Suspense, lazy, useRef } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Col, Container, Row, Card, CardHeader, CardBody, Input } from 'reactstrap';

import Preloader from '../../Components/Loaders/Preloader';

import BreadCrumb from '../../Components/Common/BreadCrumb';
//Import actions

//redux
import MetaTag from '../../Components/Common/Meta';
import LeftSidebar from './Section/LeftSidebar';
import Editor from './Section/Editor';
import CustomNotification from '../../Components/Common/CustomNotification';
import AWSS3 from '../../Components/Common/AWS';
import uniqueId from 'uniqid';
import { createImageExp, findImageExp, resetImageExp, updateImageExp } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CheckFeatureAccess from '../../common/utils/CheckFeatureAccess';

const ImageEditor = (props) => {
  const history = useHistory();
  const { dig_id, action } = useParams();
  const dispatch = useDispatch();
  const { isImageExpCreated, isImageExpUpdated, isImageExpFound, imageExpApiResponse, userRNP } = useSelector((state) => ({
    isImageExpCreated: state.ImageExperience.isImageExpCreated,
    isImageExpUpdated: state.ImageExperience.isImageExpUpdated,
    isImageExpFound: state.ImageExperience.isImageExpFound,
    imageExpApiResponse: state.ImageExperience.apiResponse,
    userRNP: state.UserSession.userRNP,
  }));

  useEffect(() => {
    if (dig_id !== 'new' && action !== undefined) {
      if (!CheckFeatureAccess(userRNP, 'dig.img_exp.UPDATE')) {
        return history.push('/image');
      }
      if (action !== 'edit' && action !== 'clone') {
        return history.push('/image');
      }
      setLoading(true);
      dispatch(findImageExp({ image: dig_id }));
    } else {
      if (!CheckFeatureAccess(userRNP, 'dig.img_exp.CREATE')) {
        return history.push('/image');
      }
    }
  }, [dig_id]);

  useEffect(() => {
    if (isImageExpFound) {
      setLoading(false);
      if (imageExpApiResponse.success) {
        let bg_image = imageExpApiResponse.data.layer.filter((c) => c.type === 'bg_image');
        if (bg_image.length > 0) {
          if (bg_image[0].props.height > 548) {
            setDimensions({
              width: parseInt(bg_image[0].props.width),
              height: parseInt(bg_image[0].props.height),
            });
            setScale(548 / bg_image[0].props.height);
          }
          setBackgroundImage({
            local: false,
            url: bg_image[0].props.content,
            dimensions: {
              width: bg_image[0].props.width,
              height: bg_image[0].props.height,
            },
          });
        }
        setShapes(imageExpApiResponse.data.layer);
        setTitle(imageExpApiResponse.data.name);
        setVariables(imageExpApiResponse.data.variable);
      } else {
        CustomNotification.error(props.t(imageExpApiResponse.data));
      }
      dispatch(resetImageExp('apiResponse', {}));
      dispatch(resetImageExp('isImageExpFound', false));

      if (!imageExpApiResponse.success) {
        setTimeout(() => {
          return history.push('/image');
        }, 500);
      }
    }
  }, [isImageExpFound]);

  useEffect(() => {
    if (isImageExpCreated) {
      setLoading(false);
      if (imageExpApiResponse.success) {
        CustomNotification.success(props.t('Image Experience Created'));
      } else {
        CustomNotification.error(props.t(imageExpApiResponse.data));
      }
      dispatch(resetImageExp('apiResponse', {}));
      dispatch(resetImageExp('isImageExpCreated', false));

      if (imageExpApiResponse.success) {
        setTimeout(() => {
          return history.push('/image');
        }, 500);
      }
    }
  }, [isImageExpCreated]);

  useEffect(() => {
    if (isImageExpUpdated) {
      setLoading(false);
      if (imageExpApiResponse.success) {
        CustomNotification.success(props.t('Image Experience Updated'));
      } else {
        CustomNotification.error(props.t(imageExpApiResponse.data));
      }
      dispatch(resetImageExp('apiResponse', {}));
      dispatch(resetImageExp('isImageExpUpdated', false));

      if (imageExpApiResponse.success) {
        setTimeout(() => {
          return history.push('/image');
        }, 500);
      }
    }
  }, [isImageExpUpdated]);

  const [hLines, setHLines] = useState([]);
  const [vLines, setVLines] = useState([]);

  const transformerRef = useRef();
  const stageRef = useRef();

  const getSnapLines = (excludedShape) => {
    const stage = stageRef.current;
    if (!stage) return;

    const vertical = [];
    const horizontal = [];

    //console.log(excludedShape);

    // // We snap over edges and center of each object on the canvas
    // // We can query and get all the shapes by their name property `shape`.
    // stage.find('Circle').forEach((shape) => {
    //   // We don't want to snap to the selected shape, so we will be passing them as `excludedShape`
    //   //console.log(excludedShape);
    //   if (shape === excludedShape) return;

    //   const box = shape.getClientRect({ relativeTo: stage });
    //   vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
    //   horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
    // });

    // stage.find('Rect').forEach((shape) => {
    //   // We don't want to snap to the selected shape, so we will be passing them as `excludedShape`
    //   //console.log(excludedShape);
    //   if (shape === excludedShape) return;

    //   const box = shape.getClientRect({ relativeTo: stage });
    //   vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
    //   horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
    // });

    stage.find('Image').forEach((shape) => {
      // We don't want to snap to the selected shape, so we will be passing them as `excludedShape`
      //console.log(excludedShape);
      if (shape === excludedShape) return;

      const box = shape.getClientRect({ relativeTo: stage });
      vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
      horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
    });

    stage.find('Text').forEach((shape) => {
      // We don't want to snap to the selected shape, so we will be passing them as `excludedShape`
      //console.log(excludedShape);
      if (shape === excludedShape) return;

      const box = shape.getClientRect({ relativeTo: stage });
      vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
      horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
    });

    return {
      vertical: vertical.flat(),
      horizontal: horizontal.flat(),
    };
  };

  const getShapeSnappingEdges = () => {
    const stage = stageRef.current;
    const tr = transformerRef.current;

    const box = tr.findOne('.back').getClientRect({ relativeTo: stage });
    const absPos = tr.findOne('.back').absolutePosition();

    return {
      vertical: [
        // Left vertical edge
        {
          guide: box.x,
          offset: absPos.x - box.x,
          snap: 'start',
        },
        // Center vertical edge
        {
          guide: box.x + box.width / 2,
          offset: absPos.x - box.x - box.width / 2,
          snap: 'center',
        },
        // Right vertical edge
        {
          guide: box.x + box.width,
          offset: absPos.x - box.x - box.width,
          snap: 'end',
        },
      ],
      horizontal: [
        // Top horizontal edge
        {
          guide: box.y,
          offset: absPos.y - box.y,
          snap: 'start',
        },
        // Center horizontal edge
        {
          guide: box.y + box.height / 2,
          offset: absPos.y - box.y - box.height / 2,
          snap: 'center',
        },
        // Bottom horizontal edge
        {
          guide: box.y + box.height,
          offset: absPos.y - box.y - box.height,
          snap: 'end',
        },
      ],
    };
  };

  const SNAP_THRESHOLD = 5;
  const getClosestSnapLines = (possibleSnapLines, shapeSnappingEdges) => {
    const getAllSnapLines = (direction) => {
      const result = [];
      possibleSnapLines[direction].forEach((snapLine) => {
        shapeSnappingEdges[direction].forEach((snappingEdge) => {
          const diff = Math.abs(snapLine - snappingEdge.guide);
          // If the distance between the line and the shape is less than the threshold, we will consider it a snapping point.
          if (diff > SNAP_THRESHOLD) return;

          const { snap, offset } = snappingEdge;
          result.push({ snapLine, diff, snap, offset });
        });
      });
      return result;
    };

    const resultV = getAllSnapLines('vertical');
    const resultH = getAllSnapLines('horizontal');

    const closestSnapLines = [];

    const getSnapLine = ({ snapLine, offset, snap }, orientation) => {
      return { snapLine, offset, orientation, snap };
    };

    // find closest vertical and horizontal snappping lines
    const [minV] = resultV.sort((a, b) => a.diff - b.diff);
    const [minH] = resultH.sort((a, b) => a.diff - b.diff);
    if (minV) closestSnapLines.push(getSnapLine(minV, 'V'));
    if (minH) closestSnapLines.push(getSnapLine(minH, 'H'));

    return closestSnapLines;
  };

  const drawLines = (lines = []) => {
    if (lines.length > 0) {
      const lineStyle = {
        stroke: 'rgb(0, 161, 255)',
        strokeWidth: 1,
        name: 'guid-line',
        dash: [4, 6],
      };
      const hLines = [];
      const vLines = [];
      lines.forEach((l) => {
        if (l.orientation === 'H') {
          const line = {
            points: [-6000, 0, 6000, 0],
            x: 0,
            y: l.snapLine,
            ...lineStyle,
          };
          hLines.push(line);
        } else if (l.orientation === 'V') {
          const line = {
            points: [0, -6000, 0, 6000],
            x: l.snapLine,
            y: 0,
            ...lineStyle,
          };
          vLines.push(line);
        }
      });

      // Set state
      setHLines(hLines);
      setVLines(vLines);
    }
  };

  const onDragMove = () => {
    const target = transformerRef.current;
    const [selectedNode] = target.getNodes();

    if (!selectedNode) return;

    const possibleSnappingLines = getSnapLines(selectedNode);
    const selectedShapeSnappingEdges = getShapeSnappingEdges();

    const closestSnapLines = getClosestSnapLines(possibleSnappingLines, selectedShapeSnappingEdges);

    // Do nothing if no snapping lines
    if (closestSnapLines.length === 0) {
      setHLines([]);
      setVLines([]);

      return;
    }

    // draw the lines
    drawLines(closestSnapLines);

    const orgAbsPos = target.absolutePosition();
    const absPos = target.absolutePosition();

    // Find new position
    closestSnapLines.forEach((l) => {
      const position = l.snapLine + l.offset;
      if (l.orientation === 'V') {
        absPos.x = position;
      } else if (l.orientation === 'H') {
        absPos.y = position;
      }
    });

    // calculate the difference between original and new position
    const vecDiff = {
      x: orgAbsPos.x - absPos.x,
      y: orgAbsPos.y - absPos.y,
    };

    // apply the difference to the selected shape.
    const nodeAbsPos = selectedNode.getAbsolutePosition();
    const newPos = {
      x: nodeAbsPos.x - vecDiff.x,
      y: nodeAbsPos.y - vecDiff.y,
    };

    selectedNode.setAbsolutePosition(newPos);
  };

  function onDragEnd() {
    setHLines([]);
    setVLines([]);

    const target = transformerRef.current;
    const [selectedNode] = target.getNodes();

    if (!selectedNode) return;

    setShapes((prev) => {
      return prev.map((node) => {
        if (node.id === selectedNode.attrs.id) {
          node.pos.x = Math.round(selectedNode.x());
          node.pos.y = Math.round(selectedNode.y());
        }
        return node;
      });
    });
  }

  function onRotation() {
    const target = transformerRef.current;
    const [selectedNode] = target.getNodes();
    if (!selectedNode) return;

    let newShapes = JSON.parse(JSON.stringify(shapes));
    newShapes = newShapes.map((node) => {
      if (node.id == selectedNode.attrs.id) {
        let w = Math.round(selectedNode.width() * selectedNode.scaleX());
        let h = Math.round(selectedNode.height() * selectedNode.scaleY());
        if (Math.round(selectedNode.width() * selectedNode.scaleX()) > dimensions.width) {
          w = dimensions.width;
        }
        if (Math.round(selectedNode.height() * selectedNode.scaleY()) > dimensions.height) {
          h = dimensions.height;
        }
        node.props.width = w;
        node.props.height = h;
      }
      return node;
    });

    setShapes(newShapes);

    selectedNode.scaleX(1);
    selectedNode.scaleY(1);

    let x = selectedNode.x() ?? 0;
    let y = selectedNode.y() ?? 0;

    setMenuPosition({ y: y * scale, x: x * scale });
  }

  const [shapes, setShapes] = React.useState([]);
  const [variables, setVariables] = React.useState([]);

  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [scale, setScale] = useState(1);

  // We cant set the h & w on Stage to 100% it only takes px values so we have to
  // find the parent container's w and h and then manually set those !
  useEffect(() => {
    if (divRef.current?.offsetHeight && divRef.current?.offsetWidth) {
      setDimensions({
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight,
      });
    }
  }, []);

  const [backgroundImage, setBackgroundImage] = useState(null);

  function handleBgImageSelection(e) {
    let url = URL.createObjectURL(e.target.files[0]);
    let size = e.target.files[0].size;

    if (size > 500000) {
      return CustomNotification.error(props.t('Maximum File Size 500KB'));
    }

    let img = new Image();

    img.onload = function () {
      setBackgroundImage({
        local: true,
        url: url,
        file: e.target.files[0],
        dimensions: {
          width: img.width,
          height: img.height,
        },
      });

      let id = `${generateRandomPIN(2)}${new Date().getTime()}${generateRandomPIN(2)}`.toString();
      let newShapes = [...shapes].filter((c) => c.type !== 'bg_image');
      newShapes = [
        {
          id: id,
          pos: {
            x: 0,
            y: 0,
          },
          props: {
            height: img.height,
            width: img.width,
            content: url,
          },
          type: 'bg_image',
        },
      ].concat(newShapes);

      setShapes(newShapes);

      // if (img.height > 548) {
      //   setDimensions({
      //     width: parseInt(parseFloat((img.width * 548) / img.height).toFixed(2)),
      //     height: 548,
      //   });
      // }

      setDimensions({
        width: img.width,
        height: img.height,
      });

      setScale(548 / img.height);

      setMenuPosition(null);
    };

    img.src = url;
  }

  const [menuPosition, setMenuPosition] = useState(null);

  function onNodeClick() {
    const target = transformerRef?.current;
    const [selectedNode] = target?.getNodes();
    if (!selectedNode) return;

    let x = selectedNode.x() ?? 0;
    let y = selectedNode.y() ?? 0;

    setMenuPosition({ y: y * scale, x: x * scale });
  }

  function onNodeDragEnd(e) {
    setMenuPosition(null);
  }

  function generateRandomPIN(length = 4) {
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  function handleAddNewShape(node) {
    let x = Math.round(dimensions.width / 2);
    let y = Math.round(dimensions.height / 2);

    if (node.shape === 'image') {
      let newShapes = [...shapes].concat([
        {
          id: `${generateRandomPIN(2)}${new Date().getTime()}${generateRandomPIN(2)}`,
          type: 'image',
          pos: {
            x: x,
            y: y,
          },
          props: { ...node.defaultProps, width: node.defaultProps.width / scale, height: node.defaultProps.height / scale },
        },
      ]);
      setShapes(newShapes);
    }

    if (node.shape === 'text') {
      let newShapes = [...shapes].concat([
        {
          id: `${generateRandomPIN(2)}${new Date().getTime()}${generateRandomPIN(2)}`,
          type: 'text',
          pos: {
            x: x,
            y: y,
          },
          props: {
            ...node.defaultProps,
            width: node.defaultProps.width / scale,
            height: node.defaultProps.height / scale,
            fontSize: node.defaultProps.fontSize / scale,
          },
        },
      ]);
      setShapes(newShapes);
    }

    if (node.shape === 'qr') {
      let newShapes = [...shapes].concat([
        {
          id: `${generateRandomPIN(2)}${new Date().getTime()}${generateRandomPIN(2)}`,
          type: 'qr',
          pos: {
            x: x,
            y: y,
          },
          props: { ...node.defaultProps, width: node.defaultProps.width / scale, height: node.defaultProps.height / scale },
        },
      ]);
      setShapes(newShapes);
    }
  }

  function handleAction(action, elementId = null) {
    let id;
    if (elementId === null) {
      const target = transformerRef.current;
      const [selectedNode] = target.getNodes();

      if (!selectedNode) return;

      id = selectedNode.attrs.id;
    } else {
      id = elementId;
    }

    if (action === 'delete') {
      setShapes((prev) => {
        return prev.filter((c) => c.id !== id);
      });
    }

    if (action === 'clone') {
      let x = Math.round(dimensions.width / 2);
      let y = Math.round(dimensions.height / 2);

      let shape = shapes.filter((c) => c.id === id);
      if (shape.length > 0) {
        let t = JSON.parse(JSON.stringify(shape[0]));
        let newshapes = shapes.concat([
          {
            ...t,
            id: generateRandomPIN(2),
            pos: {
              x: x,
              y: y,
            },
          },
        ]);

        setShapes(newshapes);
      }
    }

    if (action === 'backward') {
      let prevIndex = 0;
      let shape;
      shapes.map((c, i) => {
        if (c.id === id) {
          prevIndex = i;
          shape = c;
        }
      });

      if (prevIndex === 0) {
        return;
      }

      let newShapes = [...shapes];
      newShapes = newShapes.filter((c) => c.id !== id);
      newShapes.splice(prevIndex - 1, 0, shape);

      setShapes(newShapes);
    }

    if (action === 'forward') {
      let prevIndex = 0;
      let shape;
      shapes.map((c, i) => {
        if (c.id === id) {
          prevIndex = i;
          shape = c;
        }
      });

      if (prevIndex === shapes.length - 1) {
        return;
      }
      let newShapes = [...shapes];
      newShapes = newShapes.filter((c) => c.id !== id);
      newShapes.splice(prevIndex + 1, 0, shape);

      setShapes(newShapes);
    }

    if (action === 'edit') {
      let shape = shapes.filter((c) => c.id === id);
      if (shape.length === 1) {
        setSelectedElement(shape[0]);
      }
    }

    if (action === 'layer') {
      setLeftSidebarActiveTab(1);
    }

    transformerRef.current.nodes([]);
    setMenuPosition(null);
  }

  function reorderCallback(payload) {
    setShapes(payload);
  }

  const [selectedElement, setSelectedElement] = useState(null);
  function selectionCallback(shape) {
    setSelectedElement(shape);
  }

  function handlePropsEditCallback(id, prop, value) {
    let newShapes = JSON.parse(JSON.stringify(shapes));
    let selectedShape;
    newShapes = newShapes.map((shape) => {
      if (shape.id == id) {
        shape['props'][prop] = value;
        selectedShape = shape;
      }
      return shape;
    });

    if (selectedElement !== null) {
      setSelectedElement(selectedShape);
    }

    setShapes(newShapes);
  }

  const [leftSidebarActiveTab, setLeftSidebarActiveTab] = useState(1);
  const containerRef = useRef(null);

  const [title, setTitle] = useState('Experience');
  const [loading, setLoading] = useState(false);

  async function saveImageExperience() {
    if (title.trim().length === 0) {
      return CustomNotification.error(props.t('Title is empty'));
    }

    if (backgroundImage === null) {
      return CustomNotification.error(props.t('Background image is required'));
    }

    for (let index = 0; index < variables.length; index++) {
      const variable = variables[index];
      if (variable.name.trim().length === 0) {
        return CustomNotification.error(props.t(`Variable #${index + 1} name is missing`));
      }
      if (variable.fallback.trim().length === 0) {
        return CustomNotification.error(props.t(`Variable #${index + 1} fallback is missing`));
      }
    }

    let bgImage = backgroundImage.url;

    if (backgroundImage.local) {
      setLoading(true);
      var params = {
        Bucket: 'confidentialcontent',
        Key: 'flow/workflow/' + uniqueId() + '.' + backgroundImage.file.name.split('.').pop(),
        Body: backgroundImage.file,
        ContentType: backgroundImage.file.type,
        ACL: 'public-read',
      };

      var options = {
        partSize: 10 * 1024 * 1024, // 10 MB
        queueSize: 10,
      };

      try {
        let data = await AWSS3.upload(params, options).promise();
        bgImage = data.Location;
        setLoading(false);
      } catch (error) {
        setLoading(false);
        return CustomNotification.error(props.t(`Failed to upload background image`));
      }
    }

    let finalShape = [...shapes].map((c) => {
      if (c.type === 'bg_image') {
        c.props.content = bgImage;
      }
      return c;
    });

    let json = {
      name: title,
      variable: variables,
      layer: finalShape,
    };

    if (action === 'edit') {
      setLoading(true);
      dispatch(
        updateImageExp({
          image: dig_id,
          update: json,
        })
      );
    } else {
      setLoading(true);
      dispatch(createImageExp(json));
    }
  }
  return (
    <Suspense fallback={<Preloader />}>
      <React.Fragment>
        <div className='page-content'>
          <MetaTag pageTitle='Editor | Dynamic Image Generator' />
          <Container fluid>
            <BreadCrumb title='Editor' pageTitle={props.t('Dynamic Image Generator')} />
            <Row className={'h-100'}>
              <Col lg={3}>
                <LeftSidebar
                  handleAddNewShape={handleAddNewShape}
                  shapes={shapes}
                  handleElementReorder={reorderCallback}
                  handleAction={handleAction}
                  selectionCallback={selectionCallback}
                  selectedElement={selectedElement}
                  handlePropsEditCallback={handlePropsEditCallback}
                  activeTab={leftSidebarActiveTab}
                  setActiveTab={setLeftSidebarActiveTab}
                  variables={variables}
                  setVariables={setVariables}
                  containerRef={containerRef}
                />
              </Col>
              <Col lg={9}>
                <Editor
                  scale={scale}
                  dimensions={dimensions}
                  handleBgImageSelection={handleBgImageSelection}
                  stageRef={stageRef}
                  transformerRef={transformerRef}
                  setMenuPosition={setMenuPosition}
                  onNodeClick={onNodeClick}
                  shapes={shapes}
                  onNodeDragEnd={onNodeDragEnd}
                  hLines={hLines}
                  vLines={vLines}
                  menuPosition={menuPosition}
                  handleAction={handleAction}
                  divRef={divRef}
                  onDragMove={onDragMove}
                  onDragEnd={onDragEnd}
                  onRotation={onRotation}
                  backgroundImage={backgroundImage}
                  variables={variables}
                  setTitle={setTitle}
                  title={title}
                  saveImageExperience={saveImageExperience}
                />
              </Col>
            </Row>
          </Container>
        </div>
        {loading && <Preloader />}
      </React.Fragment>
    </Suspense>
  );
};

ImageEditor.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(ImageEditor));
