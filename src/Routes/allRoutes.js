import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

//Dashboard
const ProductsPage = lazy(() => import('../pages/DashboardAnalytics'));
const WorkspacePage = lazy(() => import('../pages/Workspace'));

//login
const Login = lazy(() => import('../pages/Authentication/Login'));
const Logout = lazy(() => import('../pages/Authentication/Logout'));

const NoAuth = lazy(() => import('./../pages/Error/NoAuth'));

//DIG
const DIG = lazy(() => import('./../pages/DynamicImage/index'));
const DIGEditor = lazy(() => import('../pages/DynamicImage/Editor'));

// import PdfBuilder from "../pages/DynamicPdf/index"; 
const PDF = lazy(() => import('./../pages/DynamicPdf/index'));
const PdfEditor = lazy(() => import('../pages/DynamicPdf/Editor'));

const storage= lazy(()=>import('../pages/Storage/StorageExplorer'));

const CreditHistory = lazy(() => import('../pages/CreditHistory/CreditHistory'));

const FlowEditor = lazy(() => import('./../pages/DynamicPdf/Editor_table'));
// import FlowEditor from "../pages/DynamicPdf/Editor_table"


// API Documentation
const ApiDocs = lazy(() => import('../pages/ApiDocs/index'));

// Lead Source
const LeadSource = lazy(() => import('../pages/LeadSource/index'));
const LeadSourceSetup = lazy(() => import('../pages/LeadSource/ConnectionSetup'));

import UserPermissions from './UserPermissions';

const digRoute = [
  { path: '/products', component: ProductsPage, permissions: UserPermissions.DIG.IMAGE_EXPERIENCE },
  { path: '/workspace', component: WorkspacePage, permissions: UserPermissions.DIG.IMAGE_EXPERIENCE },
  {
    path: '/image',
    component: DIG,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/image/:dig_id',
    component: DIGEditor,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/image/:dig_id/:action',
    component: DIGEditor,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/image/:dig_id/:action',
    component: DIGEditor,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  // PDF
  {
    path: '/pdf/new',
    component: PdfEditor,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/pdf/:id/:mode',
    component: PdfEditor,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/pdf',
    component: PDF,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/storage',
    component: storage,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/credit-history',
    component: CreditHistory,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/table/new',
    component: FlowEditor,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/table/:id/:mode',
    component: FlowEditor,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  // API Documentation
  {
    path: '/api-docs',
    component: ApiDocs,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  // Lead Source
  {
    path: '/settings',
    component: LeadSource,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/settings/:sourceKey',
    component: LeadSourceSetup,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  }
];

const productPageRoute = [
  { path: '/no-auth', component: NoAuth },

  {
    path: '/',
    exact: true,
    component: () => <Redirect to='/image' />,
  },
  {
    path: '/',
    exact: true,
    component: () => <Redirect to='/pdf' />,
  }
];

const defaultPageRoute = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to='/image' />,
  },
  {
    path: '/',
    exact: true,
    component: () => <Redirect to='/pdf' />,
  },
];

const publicRoutes = [
  // Authentication Page
  { path: '/logout', component: Logout },
  { path: '/connect', component: Login },
  { path: '/login', component: Login },
  // { path: '/table/:id', component: FlowEditor },
  // { path: '/table/:id/:mode', component: FlowEditor },
  // { path: '/AgentEditor', component: VoiceAgentEditor}

];

// { path: '/pdf', component: PdfBuilder },
export { productPageRoute, defaultPageRoute, publicRoutes, digRoute };
