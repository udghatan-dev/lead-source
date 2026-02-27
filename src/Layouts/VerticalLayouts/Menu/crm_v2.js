import { BiGitCompare } from 'react-icons/bi';
import { FaRegAddressBook } from 'react-icons/fa6';
import { FaLayerGroup } from 'react-icons/fa6';
import { IoMegaphone } from 'react-icons/io5';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { CiViewTable } from 'react-icons/ci';
import { AiOutlineLink } from 'react-icons/ai';
import { BiExport } from 'react-icons/bi';
import { HiViewBoards } from 'react-icons/hi';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { BsDatabaseGear } from 'react-icons/bs';
import { BiImport } from 'react-icons/bi';
import UserPermissions from '../../../Routes/UserPermissions';

export default [
  {
    id: 'live_chat',
    label: 'Live Chat',
    link: '/products/crmv2/chat/0',
    parentId: 'crm_v2',
    icon: <IoChatbubblesOutline className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM_V2.LIVE_CHAT,
  },
  {
    id: 'channel',
    label: 'Channel',
    link: '/products/crmv2/channelv2',
    parentId: 'crm_v2',
    icon: <BiGitCompare className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM_V2.CHANNEL,
  },
  {
    id: 'contact',
    label: 'Contact',
    link: '/products/crmv2/contacts',
    parentId: 'crm_v2',
    icon: <FaRegAddressBook className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM_V2.CONTACT,
  },
  {
    id: 'boards',
    label: 'Boards',
    link: '/products/crmv2/boards',
    parentId: 'crm_v2',
    icon: <HiViewBoards className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM_V2.BOARD,
  },
  {
    id: 'data_stores',
    label: 'Data Stores',
    link: '/products/crmv2/data-store',
    parentId: 'crm_v2',
    icon: <BsDatabaseGear className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM_V2.DATA_STORE,
  },
  {
    id: 'super_field',
    label: 'Super Field',
    link: '/products/crmv2/super-field',
    parentId: 'crm_v2',
    icon: <CiViewTable className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM_V2.SUPER_FIELD,
  },
  {
    id: 'segment',
    label: 'Segment',
    link: '/products/crmv2/segments',
    parentId: 'crm_v2',
    icon: <FaLayerGroup className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM_V2.SEGMENT,
  },
  {
    id: 'bulk_campaign',
    label: 'Bulk Campaign',
    link: '/products/crmv2/campaign',
    parentId: 'crm_v2',
    icon: <IoMegaphone className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM_V2.CAMPAIGN,
  },
  {
    id: 'canned_replies',
    label: 'Canned Replies',
    link: '/products/crmv2/quick-reply',
    parentId: 'crm_v2',
    icon: <AiOutlineThunderbolt className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM_V2.CANNED_REPLY,
  },
  {
    id: 'crm_triggers',
    label: 'CRM Triggers',
    link: '/products/crmv2/trigger',
    parentId: 'crm_v2',
    icon: <AiOutlineLink className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM_V2.TRIGGER,
  },
  {
    id: 'import_history',
    label: 'Imports',
    link: '/products/crmv2/import',
    parentId: 'crm_v2',
    icon: <BiImport className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM_V2.IMPORT,
  },
  {
    id: 'export_history',
    label: 'Exports',
    link: '/products/crmv2/export',
    parentId: 'crm_v2',
    icon: <BiExport className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM_V2.EXPORT,
  },
];
