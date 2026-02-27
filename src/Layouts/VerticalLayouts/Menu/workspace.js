import { GrSupport } from 'react-icons/gr';
import { RiLinkM } from 'react-icons/ri';
import { CiMoneyCheck1 } from 'react-icons/ci';
import { FiShare2 } from 'react-icons/fi';
import { MdGroups } from 'react-icons/md';
import { FaIdCard } from 'react-icons/fa';
import { FaCreditCard } from 'react-icons/fa';
import { MdOutlineWallet } from 'react-icons/md';
import { ImCogs } from 'react-icons/im';

export default [
  {
    id: 'account',
    label: 'Account Settings',
    link: '/workspace/settings',
    parentId: 'workspace',
    icon: <ImCogs className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    role: ['user', 'team_member'],
  },
  {
    id: 'wallet',
    label: 'Wallet & Transactions',
    link: '/workspace/wallet',
    parentId: 'workspace',
    icon: <MdOutlineWallet className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    role: ['user'],
  },
  {
    id: 'billing',
    label: 'Billing',
    link: '/workspace/billing',
    parentId: 'workspace',
    icon: <FaCreditCard className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    role: ['user'],
  },
  {
    id: 'role_nd_permission',
    label: 'Roles & Permissions',
    link: '/workspace/user-role',
    parentId: 'workspace',
    icon: <FaIdCard className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    role: ['user'],
  },
  {
    id: 'manage_team',
    label: 'Manage Team',
    link: '/workspace/team-member',
    parentId: 'workspace',
    icon: <MdGroups className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    role: ['user'],
  },
  {
    id: 'visitor_conversion',
    label: 'Visitors & Conversion',
    link: '/workspace/affiliate/vnc',
    parentId: 'workspace',
    icon: <FiShare2 className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    role: ['user'],
  },
  {
    id: 'affiliate_commision',
    label: 'Commission & Payout',
    link: '/workspace/affiliate/cnp',
    parentId: 'workspace',
    icon: <CiMoneyCheck1 className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    role: ['user'],
  },
  {
    id: 'links_n_alias',
    label: 'Links & Alias',
    link: '/workspace/affiliate/settings',
    parentId: 'workspace',
    icon: <RiLinkM className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    role: ['user'],
  },
  {
    id: 'support_ticket',
    label: 'Support Ticket',
    link: '/workspace/ticket',
    parentId: 'workspace',
    icon: <GrSupport className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    role: ['user', 'team_member'],
  },
];
