import { FaWhatsapp } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import { BiGitCompare } from 'react-icons/bi';
import UserPermissions from '../../../Routes/UserPermissions';

export default [
  {
    id: 'all_channels',
    label: 'All Channels',
    link: '/products/channel',
    parentId: 'channels',
    icon: <BiGitCompare className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CHANNEL_API.CHANNEL,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    link: '/products/channel?type=whatsapp',
    parentId: 'channels',
    icon: <FaWhatsapp className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CHANNEL_API.CHANNEL,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    link: '/products/channel?type=instagram',
    parentId: 'channels',
    icon: <FaInstagram className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CHANNEL_API.CHANNEL,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    link: '/products/channel?type=facebook',
    parentId: 'channels',
    icon: <FaFacebook className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.CHANNEL_API.CHANNEL,
  },
];
