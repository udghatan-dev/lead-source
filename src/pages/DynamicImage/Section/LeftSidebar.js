import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import SimpleBar from 'simplebar-react';
import { Card, CardBody, TabContent, TabPane } from 'reactstrap';
import ElementBox from '../Components/Elements';
import ActionOrder from '../Components/ActionOrder';
import ElementEditor from './ElementEditor';
import VariableWrapper from './Variable';
import { useTranslation } from 'react-i18next';

const LeftSidebar = ({
  handleAddNewShape,
  handleElementReorder,
  handleAction,
  shapes,
  selectionCallback,
  selectedElement,
  handlePropsEditCallback,
  activeTab,
  setActiveTab,
  variables,
  setVariables,
  containerRef,
}) => {
  const { t } = useTranslation();
  const [verticalMargin, setVerticalMargin] = useState(0);
  useEffect(() => {
    if (document.documentElement.getAttribute('data-layout') === 'horizontal') {
      setVerticalMargin(120);
    } else {
      setVerticalMargin(72);
    }
  }, []);

  return (
    <Card className={'w-100'}>
      {selectedElement !== null ? (
        <ElementEditor
          element={selectedElement}
          handlePropsEditCallback={handlePropsEditCallback}
          selectionCallback={selectionCallback}
          variables={variables}
          containerRef={containerRef}
        />
      ) : (
        <CardBody>
          <div className='d-flex justify-content-center mb-3'>
            <div className='btn-group bg-light rounded-3 py-1 px-2 mt-n2 flex-wrap' role='group'>
              <input
                type='radio'
                className='btn-check'
                name='component_toggle'
                id='editor_meta'
                checked={activeTab === 0}
                onChange={() => setActiveTab(0)}
              />
              <label
                className={classnames(
                  'btn btn-sm rounded-3 shadow-none mb-0 me-3 border-0 d-flex align-items-center justify-content-center',
                  {
                    'bg-white fw-bold text-primary': activeTab === 0,
                    'bg-transparent': activeTab !== 0,
                  }
                )}
                htmlFor='editor_meta'
              >
                <i className={classnames('me-1 fs-16', { 'bx bx-package': activeTab !== 0 }, { 'bx bxs-package': activeTab === 0 })}></i>
                {t('Components')}
              </label>

              <input
                type='radio'
                className='btn-check'
                name='component_toggle'
                id='editor_components'
                checked={activeTab === 1}
                onChange={() => setActiveTab(1)}
              />
              <label
                className={classnames(
                  'btn btn-sm rounded-3 shadow-none mb-0 me-3 border-0 d-flex align-items-center justify-content-center',
                  {
                    'bg-white fw-bold text-primary': activeTab === 1,
                    'bg-transparent': activeTab !== 1,
                  }
                )}
                htmlFor='editor_components'
              >
                <i className={classnames('me-1 fs-16', { 'bx bx-layer': activeTab !== 1 }, { 'bx bxs-layer': activeTab === 1 })}></i>
                {t('Layers')}
              </label>

              <input
                type='radio'
                className='btn-check'
                name='component_toggle'
                id='editor_variables'
                checked={activeTab === 2}
                onChange={() => setActiveTab(2)}
              />
              <label
                className={classnames('btn btn-sm rounded-3 shadow-none mb-0 border-0 d-flex align-items-center justify-content-center', {
                  'bg-white fw-bold text-primary': activeTab === 2,
                  'bg-transparent': activeTab !== 2,
                })}
                htmlFor='editor_variables'
              >
                <i className={classnames('me-1 fs-16', { 'bx bx-cog': activeTab !== 2 }, { 'bx bxs-cog': activeTab === 2 })}></i>
                {t('Personalization')}
              </label>
            </div>
          </div>

          <SimpleBar style={{ height: '600px', overflowX: 'hidden' }} autoHide={true} className='px-2'>
            <TabContent activeTab={activeTab} className='text-muted'>
              <TabPane tabId={0} id='base-justified-home'>
                <ElementBox addNewShape={handleAddNewShape} />
              </TabPane>
              <TabPane tabId={1} id='base-justified-home'>
                <ActionOrder
                  handleElementReorder={handleElementReorder}
                  handleAction={handleAction}
                  elements={shapes}
                  selectionCallback={selectionCallback}
                  setActiveTab={setActiveTab}
                />
              </TabPane>
              <TabPane tabId={2} id='base-justified-home'>
                <VariableWrapper setVariables={setVariables} variables={variables} />
              </TabPane>
            </TabContent>
          </SimpleBar>
        </CardBody>
      )}
    </Card>
  );
};

export default LeftSidebar;
