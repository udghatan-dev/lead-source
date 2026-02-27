import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setVariables, setCurrentPage, addPage, deletePage, reorderPages } from '../../store/actions';
import { Card, CardBody, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import SimpleBar from 'simplebar-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ElementPalette from './ElementPalette';
import PropertiesPanel from './propertiesPanel';
import VariableWrapper from './variableWrapper';

const Sidebar = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const variables = useSelector(state => state.pdfBuilder?.variables || []);
  const selectedElementId = useSelector(state => state.pdfBuilder?.selectedElementId);
  const pages = useSelector(state => state.pdfBuilder?.pages || []);
  const currentPageId = useSelector(state => state.pdfBuilder?.currentPageId);

  // Auto-switch to Properties tab when element is selected
  useEffect(() => {
    if (selectedElementId !== null) {
      setActiveTab(1);
    }
  }, [selectedElementId]);

  useEffect(() => {
    const handleShowProperties = () => {
      setActiveTab(1);
    };

    window.addEventListener('showPropertiesPanel', handleShowProperties);
    return () => {
      window.removeEventListener('showPropertiesPanel', handleShowProperties);
    };
  }, []);

  const handleSetVariables = (newVariables) => {
    dispatch(setVariables(newVariables));
  };

  // Handle drag end for page reordering
  const handlePageDragEnd = (result) => {
    if (!result.destination) return; // Dropped outside the list

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return; // No change

    // Reorder pages array
    const reorderedPages = Array.from(pages);
    const [movedPage] = reorderedPages.splice(sourceIndex, 1);
    reorderedPages.splice(destinationIndex, 0, movedPage);

    // Dispatch action to update Redux state
    dispatch(reorderPages(reorderedPages));
  };

  return (
    <Card>
      <CardBody className='d-flex flex-column'>
        {/* Tab Buttons - Now with 4 tabs */}
        <div className='d-flex justify-content-center mb-3'>
          <div className='btn-group bg-light rounded-3 py-1 px-2 flex-wrap' role='group'>
            {/* Elements Tab */}
            <input
              type='radio'
              className='btn-check'
              name='component_toggle'
              id='editor_elements'
              checked={activeTab === 0}
              onChange={() => setActiveTab(0)}
            />
            <label
              className={classnames(
                'btn btn-sm rounded-3 shadow-none mb-0 me-2 border-0 d-flex align-items-center justify-content-center',
                {
                  'bg-white fw-bold text-primary': activeTab === 0,
                  'bg-transparent': activeTab !== 0,
                }
              )}
              htmlFor='editor_elements'
              style={{ fontSize: '12px' }}
            >
              <i className={classnames('me-1 fs-16', { 'bx bx-package': activeTab !== 0 }, { 'bx bxs-package': activeTab === 0 })}></i>
              Elements
            </label>

            {/* Properties Tab */}
            <input
              type='radio'
              className='btn-check'
              name='component_toggle'
              id='editor_properties'
              checked={activeTab === 1}
              onChange={() => setActiveTab(1)}
            />
            <label
              className={classnames(
                'btn btn-sm rounded-3 shadow-none mb-0 me-2 border-0 d-flex align-items-center justify-content-center',
                {
                  'bg-white fw-bold text-primary': activeTab === 1,
                  'bg-transparent': activeTab !== 1,
                }
              )}
              htmlFor='editor_properties'
              style={{ fontSize: '12px' }}
            >
              <i className={classnames('me-1 fs-16', { 'bx bx-cog': activeTab !== 1 }, { 'bx bxs-cog': activeTab === 1 })}></i>
              Properties
            </label>

            {/* Pages Tab - NEW */}
            <input
              type='radio'
              className='btn-check'
              name='component_toggle'
              id='editor_pages'
              checked={activeTab === 2}
              onChange={() => setActiveTab(2)}
            />
            <label
              className={classnames(
                'btn btn-sm rounded-3 shadow-none mb-0 me-2 border-0 d-flex align-items-center justify-content-center',
                {
                  'bg-white fw-bold text-primary': activeTab === 2,
                  'bg-transparent': activeTab !== 2,
                }
              )}
              htmlFor='editor_pages'
              style={{ fontSize: '12px' }}
            >
              <i className={classnames('me-1 fs-16', { 'bx bx-file': activeTab !== 2 }, { 'bx bxs-file': activeTab === 2 })}></i>
              Pages
            </label>

            {/* Variables Tab */}
            <input
              type='radio'
              className='btn-check'
              name='component_toggle'
              id='editor_variables'
              checked={activeTab === 3}
              onChange={() => setActiveTab(3)}
            />
            <label
              className={classnames('btn btn-sm rounded-3 shadow-none mb-0 border-0 d-flex align-items-center justify-content-center', {
                'bg-white fw-bold text-primary': activeTab === 3,
                'bg-transparent': activeTab !== 3,
              })}
              htmlFor='editor_variables'
              style={{ fontSize: '12px' }}
            >
              <i className={classnames('me-1 fs-16', { 'bx bx-edit': activeTab !== 3 }, { 'bx bxs-edit': activeTab === 3 })}></i>
              Variables
            </label>
          </div>
        </div>

        {/* Tab Content with SimpleBar */}
        <div style={{ maxHeight: '400px' }}>
          <SimpleBar style={{ maxHeight: '400px' }} autoHide={true}>
            <TabContent activeTab={activeTab} className='text-muted'>
              {/* Elements Tab */}
              <TabPane tabId={0} id='tab-elements'>
                <ElementPalette />
              </TabPane>

              {/* Properties Tab */}
              <TabPane tabId={1} id='tab-properties'>
                {selectedElementId !== null ? (
                  <PropertiesPanel />
                ) : (
                  <div className='d-flex flex-column gap-3 align-items-center justify-content-center py-5'>
                    <i className='bx bx-info-circle text-muted' style={{ fontSize: '48px' }}></i>
                    <span className='text-muted'>Select an element to edit its properties</span>
                  </div>
                )}
              </TabPane>

              {/* Pages Tab */}
              <TabPane tabId={2} id='tab-pages'>
                <div className='d-flex flex-column gap-3'>
                  {/* Add Page Section */}
                  <div>
                    <label className='form-label text-muted mb-2 d-flex align-items-center gap-1' style={{ fontSize: '11px' }}>
                      <i className='bx bx-plus-circle'></i>
                      ADD NEW PAGE
                    </label>
                    <div className='d-flex gap-2'>
                      <button
                        className='btn btn-success btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1'
                        onClick={() => dispatch(addPage('portrait'))}
                        title='Add Portrait Page (Vertical)'
                      >
                        <i className='bx bx-file fs-16'></i>
                        Portrait
                      </button>
                      <button
                        className='btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1'
                        onClick={() => dispatch(addPage('landscape'))}
                        title='Add Landscape Page (Horizontal)'
                      >
                        <i className='bx bx-file fs-16' style={{ transform: 'rotate(90deg)' }}></i>
                        Landscape
                      </button>
                    </div>
                  </div>

                  {/* Pages List Section */}
                  <div>
                    <div className='d-flex align-items-center justify-content-between mb-2'>
                      <span className='text-muted fw-semibold d-flex align-items-center gap-1' style={{ fontSize: '11px' }}>
                        <i className='bx bx-collection'></i>
                        YOUR PAGES ({pages?.length || 0})
                      </span>
                    </div>

                    {pages && pages.length > 0 ? (
                      <DragDropContext onDragEnd={handlePageDragEnd}>
                        <Droppable droppableId="pages-list">
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className='d-flex flex-column gap-2'
                              style={{
                                backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : 'transparent',
                                borderRadius: '8px',
                                padding: snapshot.isDraggingOver ? '8px' : '0',
                                transition: 'all 0.2s ease'
                              }}
                            >
                            {pages.map((page, index) => (
                              <Draggable key={page.id} draggableId={page.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`d-flex align-items-center justify-content-between p-2 border rounded ${
                                      currentPageId === page.id ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'
                                    }`}
                                    style={{
                                      cursor: 'grab',
                                      backgroundColor: snapshot.isDragging ? '#e3f2fd' : '',
                                      boxShadow: snapshot.isDragging ? '0 5px 10px rgba(0,0,0,0.2)' : 'none',
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {/* Drag Handle */}
                                    <div 
                                      {...provided.dragHandleProps}
                                      className='d-flex align-items-center gap-2'
                                      style={{ cursor: 'grab' }}
                                    >
                                      <i className='bx bx-menu text-muted fs-18' title='Drag to reorder'></i>
                                    </div>

                                    {/* Page Info - Clickable */}
                                    <div
                                      className='d-flex align-items-center gap-2 flex-grow-1'
                                      onClick={() => dispatch(setCurrentPage(page.id))}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      {/* Orientation indicator icon */}
                                      <i
                                        className={`bx ${page.width > page.height ? 'bx-rectangle' : 'bx-rectangle-portrait'} fs-18 ${currentPageId === page.id ? 'text-primary' : 'text-muted'}`}
                                        title={page.width > page.height ? 'Landscape' : 'Portrait'}
                                      ></i>
                                      <span className={`fw-semibold ${currentPageId === page.id ? 'text-primary' : ''}`}>
                                        Page {index + 1}
                                      </span>
                                      <span
                                        className={`badge ${page.width > page.height ? 'bg-primary' : 'bg-success'} bg-opacity-10 ${page.width > page.height ? 'text-primary' : 'text-success'}`}
                                        style={{ fontSize: '9px' }}
                                        title={page.width > page.height ? 'Landscape' : 'Portrait'}
                                      >
                                        {page.width > page.height ? 'Landscape' : 'Portrait'}
                                      </span>
                                      {currentPageId === page.id && (
                                        <i className='bx bx-check-circle text-primary fs-16'></i>
                                      )}
                                    </div>
                                    
                                    {/* Delete button - only show if more than 1 page */}
                                    {pages.length > 1 && (
                                      <button
                                        className='btn btn-sm btn-outline-danger d-flex align-items-center'
                                        style={{ padding: '4px 8px' }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const orientation = page.width > page.height ? 'Landscape' : 'Portrait';
                                          const elementCount = page.elements?.filter(el => el.type !== 'bg_image' && !el.isBackground).length || 0;
                                          const confirmMsg = `Delete Page ${index + 1} (${orientation})?\n\n` +
                                            `This page has ${elementCount} element${elementCount !== 1 ? 's' : ''}.\n` +
                                            `This action cannot be undone.`;
                                          if (window.confirm(confirmMsg)) {
                                            dispatch(deletePage(page.id));
                                          }
                                        }}
                                        title='Delete Page'
                                      >
                                        <i className='bx bx-trash fs-16'></i>
                                      </button>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    ) : (
                      <div className='text-center text-muted py-4 border rounded bg-light'>
                        <i className='bx bx-file-blank fs-48 d-block mb-2 text-muted'></i>
                        <span style={{ fontSize: '12px' }}>No pages yet. Add a page above to start.</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabPane>

              {/* Variables Tab */}
              <TabPane tabId={3} id='tab-variables'>
                <VariableWrapper variables={variables} setVariables={handleSetVariables} />
              </TabPane>
            </TabContent>
          </SimpleBar>
        </div>
      </CardBody>
    </Card>
  );
};

export default Sidebar;