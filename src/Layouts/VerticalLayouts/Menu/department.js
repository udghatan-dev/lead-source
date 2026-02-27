import { IoAnalytics } from 'react-icons/io5';
import { IoBusinessOutline } from 'react-icons/io5';
import { ImProfile } from 'react-icons/im';
import UserPermissions from '../../../Routes/UserPermissions';

export default [
  {
    id: 'department_analytics',
    label: 'Analytics',
    link: '/products/department/analytics',
    parentId: 'department',
    icon: <IoAnalytics className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.DEPARTMENT.ANALYTICS,
  },
  {
    id: 'department_groups',
    label: 'Departments',
    link: '/products/department',
    parentId: 'department',
    icon: <IoBusinessOutline className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.DEPARTMENT.DEPARTMENT,
  },
  {
    id: 'department_role',
    label: 'Roles',
    link: '/products/department/role',
    parentId: 'department',
    icon: <ImProfile className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.DEPARTMENT.ROLE,
  },
];
