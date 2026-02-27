// // FlowSidebar.js - Tabbed sidebar for Flow Editor
// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Card, CardBody, TabContent, TabPane } from 'reactstrap';
// import classnames from 'classnames';
// import SimpleBar from 'simplebar-react';
// import FlowElementPalette from './FlowElementPalette';
// import FlowTableProperties from './FlowTableProperties_New';
// import FlowPropertiesPanel from './FlowPropertiesPanel';
// import SidebarVariable from '../components/Sidebar/variableWrapper';
// import { Badge } from 'reactstrap';

// const FlowSidebar = ({ editor, insertVariable }) => {
//   const [activeTab, setActiveTab] = useState(0);
//   const variables = useSelector(state => state.pdfBuilder?.variables || []);

//   // Auto-switch to Properties tab when table is selected
//   useEffect(() => {
//     if (editor && editor.isActive('table')) {
//       setActiveTab(1);
//     }
//   }, [editor?.state.selection]);

//   return (
//     <Card className="border shadow-sm" style={{ height: 'calc(100vh - 150px)' }}>
//       <CardBody className="d-flex flex-column p-2">
//         {/* Tab Buttons */}
//         <div className="d-flex justify-content-center mb-3">
//           <div className="btn-group bg-light rounded-3 py-1 px-2 flex-wrap" role="group">
//             {/* Components Tab */}
//             <input
//               type="radio"
//               className="btn-check"
//               name="flow_toggle"
//               id="flow_components"
//               checked={activeTab === 0}
//               onChange={() => setActiveTab(0)}
//             />
//             <label
//               className={classnames(
//                 'btn btn-sm rounded-3 shadow-none mb-0 me-2 border-0 d-flex align-items-center justify-content-center',
//                 {
//                   'bg-white fw-bold text-primary': activeTab === 0,
//                   'bg-transparent': activeTab !== 0,
//                 }
//               )}
//               htmlFor="flow_components"
//               style={{ fontSize: '12px' }}
//             >
//               <i className={classnames('me-1 fs-16', {
//                 'bx bx-package': activeTab !== 0,
//                 'bx bxs-package': activeTab === 0
//               })}></i>
//               Components
//             </label>

//             {/* Properties Tab */}
//             <input
//               type="radio"
//               className="btn-check"
//               name="flow_toggle"
//               id="flow_properties"
//               checked={activeTab === 1}
//               onChange={() => setActiveTab(1)}
//             />
//             <label
//               className={classnames(
//                 'btn btn-sm rounded-3 shadow-none mb-0 me-2 border-0 d-flex align-items-center justify-content-center',
//                 {
//                   'bg-white fw-bold text-primary': activeTab === 1,
//                   'bg-transparent': activeTab !== 1,
//                 }
//               )}
//               htmlFor="flow_properties"
//               style={{ fontSize: '12px' }}
//             >
//               <i className={classnames('me-1 fs-16', {
//                 'bx bx-cog': activeTab !== 1,
//                 'bx bxs-cog': activeTab === 1
//               })}></i>
//               Properties
//             </label>

//             {/* Variables Tab */}
//             <input
//               type="radio"
//               className="btn-check"
//               name="flow_toggle"
//               id="flow_variables"
//               checked={activeTab === 2}
//               onChange={() => setActiveTab(2)}
//             />
//             <label
//               className={classnames(
//                 'btn btn-sm rounded-3 shadow-none mb-0 border-0 d-flex align-items-center justify-content-center',
//                 {
//                   'bg-white fw-bold text-primary': activeTab === 2,
//                   'bg-transparent': activeTab !== 2,
//                 }
//               )}
//               htmlFor="flow_variables"
//               style={{ fontSize: '12px' }}
//             >
//               <i className={classnames('me-1 fs-16', {
//                 'bx bx-edit': activeTab !== 2,
//                 'bx bxs-edit': activeTab === 2
//               })}></i>
//               Variables
//             </label>
//           </div>
//         </div>

//         {/* Tab Content with SimpleBar */}
//         <div style={{ flex: 1, overflow: 'hidden' }}>
//           <SimpleBar style={{ maxHeight: 'calc(100vh - 220px)' }} autoHide={true}>
//             <TabContent activeTab={activeTab} className="text-muted">
//               {/* Components Tab */}
//               <TabPane tabId={0} id="tab-components">
//                 <FlowElementPalette
//                   editor={editor}
//                   variables={variables}
//                 />
//               </TabPane>

//               {/* Properties Tab */}
//               <TabPane tabId={1} id="tab-properties">
//                 {editor && editor.isActive('table') ? (
//                   <FlowTableProperties editor={editor} />
//                 ) : (
//                   <FlowPropertiesPanel editor={editor} />
//                 )}
//               </TabPane>

//               {/* Variables Tab */}
//               <TabPane tabId={2} id="tab-variables">
//                 <div className="p-2">
//                   <h6 className="fw-bold text-uppercase small text-muted mb-3">Manage Variables</h6>
//                   <SidebarVariable />

//                   {variables.length > 0 && (
//                     <div className="mt-3 pt-3 border-top">
//                       <small className="text-muted d-block mb-2">Click to insert:</small>
//                       <div className="d-flex flex-wrap gap-1">
//                         {variables.map((v, i) => (
//                           <Badge
//                             key={i}
//                             color="info"
//                             className="cursor-pointer"
//                             style={{ cursor: 'pointer', padding: '6px 12px' }}
//                             onClick={() => insertVariable(v.name)}
//                           >
//                             {v.name}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </TabPane>
//             </TabContent>
//           </SimpleBar>
//         </div>
//       </CardBody>
//     </Card>
//   );
// };

// export default FlowSidebar;
