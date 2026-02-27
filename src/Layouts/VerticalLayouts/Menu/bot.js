import { VscRobot } from 'react-icons/vsc';
import { IoAnalytics } from 'react-icons/io5';
import { LuDatabaseZap } from 'react-icons/lu';
import { BsJournalCode } from 'react-icons/bs';
import { GoRepoTemplate } from 'react-icons/go';
import UserPermissions from '../../../Routes/UserPermissions';

export default [
  {
    id: 'analytics',
    label: 'Analytics',
    link: '/products/bot/analytics',
    parentId: 'bots',
    icon: <IoAnalytics className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
  },
  {
    id: 'chatbots',
    label: 'Chatbots',
    link: '/products/bot/flow',
    parentId: 'bots',
    icon: <VscRobot className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.BOT.WORKFLOW,
  },
  {
    id: 'data_stores',
    label: 'Data Stores',
    link: '/products/bot/data-store',
    parentId: 'bots',
    icon: <LuDatabaseZap className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.BOT.DATA_STORE,
  },
  {
    id: 'bot_fields',
    label: 'Bot Fields',
    link: '/products/bot/bot-field',
    parentId: 'bots',
    icon: <BsJournalCode className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.BOT.BOT_FIELD,
  },
  {
    id: 'template',
    label: 'Templates',
    link: '/products/bot/template',
    parentId: 'bots',
    icon: <GoRepoTemplate className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.BOT.TEMPLATE,
  },
];
