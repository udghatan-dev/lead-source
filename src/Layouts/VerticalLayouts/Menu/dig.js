import { BsImages, BsFileEarmarkPdf, BsCloud, BsCreditCard2Back, BsMic, BsFileCode } from 'react-icons/bs';
import UserPermissions from '../../../Routes/UserPermissions';

export default [
  {
    id: 'image_experience',
    label: 'Image Experience',
    link: '/image',
    parentId: 'dynamic_experience',
    icon: <BsImages className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    id: 'pdf_experience',
    label: 'PDF Experience',
    link: '/pdf',
    parentId: 'dynamic_experience',
    icon: <BsFileEarmarkPdf className="fs-18 text-red-500" style={{ fill: 'currentColor' }}/>,
    iconType: 'component',
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
    {
    id: 'storage',
    label: 'Storage',
    link: '/storage',
    parentId: 'dynamic_experience',
    icon: <BsCloud className="fs-18 text-red-500" style={{ fill: 'currentColor' }}/>,
    iconType: 'component',
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    id: 'credit_history',
    label: 'Credit History',
    link: '/credit-history',
    parentId: 'dynamic_experience',
    icon: <BsCreditCard2Back className="fs-18 text-red-500" style={{ fill: 'currentColor' }}/>,
    iconType: 'component',
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
    {
    id: 'api_doc_for_pdf',
    label: 'API DOC',
    link: '/api-docs',
    parentId: 'dynamic_experience',
    // icon: <BsMic className="fs-18" style={{ fill: 'currentColor' }}/>,
    icon: <BsFileCode className="fs-18" style={{ fill: 'currentColor' }}/>,
    iconType: 'component',
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  }
];
