import { IoAnalytics } from 'react-icons/io5';
import { LuDatabaseZap } from 'react-icons/lu';
import { BsFillSafe2Fill } from 'react-icons/bs';
import { GoRepoTemplate } from 'react-icons/go';
import { SiGithubactions } from 'react-icons/si';
import UserPermissions from '../../../Routes/UserPermissions';

export default [
  {
    id: 'automation_analytics',
    label: 'Analytics',
    link: '/products/automation/analytics',
    parentId: 'automations',
    icon: <IoAnalytics className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
  },
  {
    id: 'workflow',
    label: 'Workflow',
    link: '/products/automation/flow',
    parentId: 'automations',
    icon: <SiGithubactions className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.AUTOMATION.WORKFLOW,
  },
  {
    id: 'data_store',
    label: 'Data Stores',
    link: '/products/automation/data-store',
    parentId: 'automations',
    icon: <LuDatabaseZap className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.AUTOMATION.DATA_STORE,
  },
  {
    id: 'automation_template',
    label: 'Templates',
    link: '/products/automation/template',
    parentId: 'automations',
    icon: <GoRepoTemplate className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.AUTOMATION.TEMPLATE,
  },
  {
    id: 'app_authentication',
    label: 'App Authentications',
    link: '/products/automation/authentication',
    parentId: 'automations',
    icon: <BsFillSafe2Fill className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.AUTOMATION.WORKFLOW,
  },
];
