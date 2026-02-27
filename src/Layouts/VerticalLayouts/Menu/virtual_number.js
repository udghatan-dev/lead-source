import { TbPhoneRinging } from 'react-icons/tb';
import UserPermissions from '../../../Routes/UserPermissions';

export default [
  {
    id: 'virtual_numbers',
    label: 'Virtual Number',
    link: '/products/virtual_number',
    parentId: 'virtual_number',
    icon: <TbPhoneRinging className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.VIRTUAL_NUMBER.NUMBER,
  },
];
