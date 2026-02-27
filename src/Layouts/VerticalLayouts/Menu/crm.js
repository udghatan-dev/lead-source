import { BiGitCompare } from 'react-icons/bi';
import { FaRegAddressBook } from 'react-icons/fa6';
import { FaLayerGroup } from 'react-icons/fa6';
import { IoMegaphone } from 'react-icons/io5';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { MdOutlineQuickreply } from 'react-icons/md';
import { CiViewTable } from 'react-icons/ci';
import { AiOutlineLink } from 'react-icons/ai';
import UserPermissions from '../../../Routes/UserPermissions';

export default [
  {
    id: 'whatsapp',
    label: 'Live Chat',
    link: '/products/crm/livechat',
    parentId: 'crm_v1',
    icon: <IoChatbubblesOutline className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM.LIVE_CHAT,
  },
  {
    id: 'whatsapp',
    label: 'Channel',
    link: '/products/crm/channel',
    parentId: 'crm_v1',
    icon: <BiGitCompare className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM.CHANNEL,
  },
  {
    id: 'whatsapp',
    label: 'Contact',
    link: '/products/crm/contact',
    parentId: 'crm_v1',
    icon: <FaRegAddressBook className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM.CONTACT,
  },
  {
    id: 'instagram',
    label: 'Custom Field',
    link: '/products/crm/custom-field',
    parentId: 'crm_v1',
    icon: <CiViewTable className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM.CUSTOM_FIELD,
  },
  {
    id: 'facebook',
    label: 'Segment',
    link: '/products/crm/filter-list',
    parentId: 'crm_v1',
    icon: <FaLayerGroup className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM.SEGMENT,
  },
  {
    id: 'facebook',
    label: 'Bulk Campaign',
    link: '/products/crm/campaign',
    parentId: 'crm_v1',
    icon: <IoMegaphone className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM.CAMPAIGN,
  },
  {
    id: 'facebook',
    label: 'Canned Replies',
    link: '/products/crm/canned-replies',
    parentId: 'crm_v1',
    icon: <MdOutlineQuickreply className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM.CANNED_REPLY,
  },
  {
    id: 'facebook',
    label: 'CRM Triggers',
    link: '/products/crm/automation/trigger',
    parentId: 'crm_v1',
    icon: <AiOutlineLink className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CRM.TRIGGER,
  },
];
