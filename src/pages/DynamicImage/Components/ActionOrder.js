import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useTranslation } from 'react-i18next';

function ActionOrder({ elements, handleElementReorder, handleAction, selectionCallback, setActiveTab }) {
  const { t } = useTranslation();
  function handleOnQRDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(elements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    handleElementReorder(items);
  }
  return (
    <React.Fragment>
      <Card className='bg-transparent shadow-none border-0'>
        <CardBody className={'px-0 pt-0 h-100'}>
          <DragDropContext onDragEnd={handleOnQRDragEnd}>
            <Droppable droppableId='quick_reply_buttons'>
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {(elements || []).map((element, index) => {
                    return (
                      <Draggable key={`qr_button_${index}`} draggableId={`qr_button_${index}`} index={index}>
                        {(provided) => (
                          <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Card className='bg-light shadow-2 rounded-3 border mb-2'>
                              <CardHeader className='p-0 py-1 rounded-top-4 bg-transparent border-0'>
                                <div className='d-flex'>
                                  <div className='flex-shrink-0 border-end p-1 pe-2 ps-1 d-flex align-items-center'>
                                    <span className='mx-1 fw-bold fs-12'>{`L${index + 1}`}</span>
                                    <i className='bi bi-grip-vertical me-2'></i>
                                    <div className='avatar-xxs bg-transparent'>
                                      <div className='avatar-title rounded bg-soft-primary text-secondary'>
                                        {element.type === 'bg_image' && <i className={'bx bx-images'}></i>}
                                        {element.type === 'image' && <i className={'bx bx-image'}></i>}
                                        {element.type === 'qr' && <i className={'bx bx-qr'}></i>}
                                        {element.type === 'text' && <i className={'bx bx-text'}></i>}
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className='flex-grow-1 border-end p-1 px-2'
                                    onClick={() => {
                                      let elem = document.getElementById('info_icon_' + element.id);
                                      if (elem !== null) {
                                        if (elem.style.display === 'none') {
                                          elem.style.display = 'block';
                                        } else {
                                          elem.style.display = 'none';
                                        }
                                      }
                                    }}
                                  >
                                    {element.type === 'bg_image' ? (
                                      <span className='fs-12 fw-bold'>{t('Background Image')}</span>
                                    ) : (
                                      <span className='fs-12 fw-bold'>{element.type.toUpperCase()}</span>
                                    )}
                                  </div>
                                  {element.type !== 'bg_image' && (
                                    <div className='flex-shrink-0 p-1 px-2'>
                                      <i
                                        className='bx bx-cog fs-16 btn btn-ghost-primary btn-sm my-0 py-0'
                                        onClick={() => {
                                          selectionCallback(element);
                                        }}
                                      ></i>
                                      <i
                                        className='bx bxs-copy-alt fs-16 btn btn-ghost-primary btn-sm my-0 py-0'
                                        onClick={() => {
                                          handleAction('clone', element.id);
                                        }}
                                      ></i>
                                      <i
                                        className='bx bxs-trash fs-16 btn btn-ghost-danger btn-sm my-0 py-0'
                                        onClick={() => {
                                          handleAction('delete', element.id);
                                        }}
                                      ></i>
                                    </div>
                                  )}
                                </div>
                              </CardHeader>
                            </Card>
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

          {elements.length === 0 && (
            <div className='d-flex flex-column gap-3 align-items-center justify-content-center'>
              <span>{t('No Element Found')}</span>
            </div>
          )}

          <div className='d-flex flex-column gap-3 align-items-center justify-content-center mt-3'>
            <span className='btn btn-sm btn-soft-dark d-flex align-items-center justify-content-center' onClick={() => setActiveTab(0)}>
              <i class='bx bx-plus me-1'></i>
              {t('Add Component')}
            </span>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default ActionOrder;
