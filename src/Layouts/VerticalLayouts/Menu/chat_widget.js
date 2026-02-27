import { TbBrandHipchat } from 'react-icons/tb';
import UserPermissions from '../../../Routes/UserPermissions';

export default [
  {
    id: 'all_channels',
    label: 'Widget',
    link: '/products/widget',
    parentId: 'chatwidget',
    icon: <TbBrandHipchat className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.WIDGET.WIDGET,
  },
];
