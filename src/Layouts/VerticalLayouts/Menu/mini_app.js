import { FaWpforms } from 'react-icons/fa6';
import UserPermissions from '../../../Routes/UserPermissions';

export default [
  {
    id: 'miniapp_flow',
    label: 'Mini Apps',
    link: '/products/flows',
    parentId: 'miniapps',
    icon: <FaWpforms className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.MINI_APP.FLOW,
  },
];
