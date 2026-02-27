import React, { lazy, useRef, useState, useEffect } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { LuZap } from 'react-icons/lu';
import { HiOutlineSupport } from 'react-icons/hi';
import CustomNotification from './CustomNotification';
import UserPermissions from './../../Routes/UserPermissions';
import { postContact, postCustomField, resetContact, resetCustomField } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';

const RightSidebar = lazy(() => import('../../Components/Common/RightSidebar'));
const AddNewContactCRMV2 = lazy(() => import('../../pages/CRM/ContactV2/AddNewContactModel'));
const AddNewContactCRMV1 = lazy(() => import('../../pages/CRM/Contacts/NewContact'));

const SuperFieldPopup = lazy(() => import('../../pages/CRM/SuperField/SuperFieldPopup'));
const CustomFieldModal = lazy(() => import('../../pages/CRM/CustomField/CustomFieldModal'));

const actions = (crmVersion) => {
  return [
    {
      label: crmVersion === 'v1' ? 'Create Custom Field' : 'Create Super Field',
      icon: <LuZap size={16} />,
      target: crmVersion === 'v1' ? 'custom_field' : 'super_field',
      permissions: crmVersion === 'v1' ? 'CRM.CUSTOM_FIELD' : 'CRM_V2.SUPER_FIELD',
    },
    {
      label: 'Create Contact',
      icon: <FaUserPlus size={16} />,
      target: `contact_${crmVersion}`,
      permissions: crmVersion === 'v1' ? 'CRM.CONTACT' : 'CRM_V2.CONTACT',
    },
    { label: 'Support Ticket', icon: <HiOutlineSupport size={16} />, target: 'support', permissions: '' },
  ];
};

const FloatingActionWidget = ({ crmVersion }) => {
  const dispatch = useDispatch();
  const [openOption, setOpenOption] = useState({ status: false, module: '' });
  const [open, setOpen] = useState(false);
  const [mouseEffect, setMouseEffect] = useState(false);
  const wrapperRef = useRef();

  const { contactPosted, apiResponse, customFieldApiResponse, isCustomFieldPosted, userRNP } = useSelector((state) => ({
    contactPosted: state.Contact.contactPosted,
    apiResponse: state.Contact.apiResponse,
    isCustomFieldPosted: state.CustomField.isPosted,
    customFieldApiResponse: state.CustomField.apiResponse,
    userRNP: state.UserSession.userRNP,
  }));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClose = () => {
    setOpenOption({ status: false });
  };

  useEffect(() => {
    if (contactPosted) {
      if (apiResponse.success) {
        CustomNotification.success('Contact Added Successfully');
      } else {
        CustomNotification.error('Failed to create contact');
      }
      dispatch(resetContact('contactPosted', false));
      dispatch(resetContact('apiResponse', {}));
    }
  }, [contactPosted]);

  useEffect(() => {
    if (isCustomFieldPosted) {
      if (customFieldApiResponse.success) {
        CustomNotification.success('Custom Field Added Successfully');
      } else {
        CustomNotification.error(apiResponse.data);
      }
      dispatch(resetCustomField('isPosted', false));
      dispatch(resetCustomField('apiResponse', {}));
    }
  }, [isCustomFieldPosted]);

  function createContactV1(action, data) {
    let json = {
      type: 'single',
      chat: { ...data },
    };
    dispatch(postContact(json));
    CustomNotification.success('New Contact Add Request Sent');
    handleClose();
  }

  function handleAddCustomField(action, data) {
    let json = {
      name: data.name,
      field_id: data.field_id,
      type: data.type,
      description: data.description,
      display_as_tag: data.display_as_tag,
      display: data.display,
      color_code: data.color_code,
      logs: [],
    };
    dispatch(postCustomField(json));
    CustomNotification.success('Custom Field Add Request Sent');
    handleClose();
  }

  return (
    <>
      <div ref={wrapperRef} style={{ position: 'fixed', bottom: crmVersion === 'v2' ? '80px' : '30px', right: '20px', zIndex: 1000 }}>
        <div
          className={`position-absolute d-flex flex-column align-items-end mb-3 transition ${open ? 'opacity-100' : 'opacity-0 invisible'}`}
          style={{
            width: 'max-content',
            right: '15px',
            bottom: '20px',
            transition: 'opacity 0.3s',
          }}
        >
          {actions(crmVersion).map((action, idx) => {
            let allowed = false;
            if (action.permissions) {
              let action_permissions = action.permissions.split('.');
              let permissions = UserPermissions[action_permissions[0]][action_permissions[1]];
              userRNP?.permissions?.map((permission) => {
                if (permissions.indexOf(permission) !== -1) {
                  allowed = true;
                }
              });
            } else {
              allowed = true;
            }
            if (allowed) {
              return (
                <button
                  key={idx}
                  className='btn btn-primary shadow-sm mb-2 d-flex align-items-center gap-2 floating-widget-options'
                  onClick={() => {
                    setOpen(false);
                    setOpenOption({ status: true, module: action.target });
                  }}
                >
                  {action.icon}
                  <span style={{ fontSize: '0.700rem' }}>{action.label}</span>
                </button>
              );
            }
          })}
        </div>

        <button
          className='btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow'
          style={{ width: '36px', height: '36px', transition: 'opacity 0.3s' }}
          onClick={() => setOpen((prev) => !prev)}
          onMouseEnter={() => setMouseEffect(true)}
          onMouseLeave={() => setMouseEffect(false)}
        >
          {open ? (
            <i className='bx bx-x' style={{ fontSize: '22px' }}></i>
          ) : (
            <i className={mouseEffect ? 'bx bx-shape-circle bx-tada' : 'bx bx-shape-circle'} style={{ fontSize: '22px' }}></i>
          )}
        </button>
      </div>

      {/* Support Ticket */}
      {openOption.status && openOption.module === 'support' && (
        <RightSidebar handleClose={handleClose} open={openOption.status} setOpen={handleClose} />
      )}

      {/* CRM V1 Contact Modal */}
      {openOption.status && openOption.module === 'contact_v1' && (
        <AddNewContactCRMV1
          open={openOption.status}
          handleClose={handleClose}
          action={'new'}
          data={{ callback: createContactV1 }}
          cb={createContactV1}
        />
      )}

      {/* CRM V2 Contact Modal */}
      {openOption.status && openOption.module === 'contact_v2' && (
        <AddNewContactCRMV2 handleClose={handleClose} open={openOption.status} data={{}} />
      )}

      {/* Custom Field Modal */}
      {openOption.status && openOption.module === 'custom_field' && (
        <CustomFieldModal handleClose={handleClose} open={openOption.status} action='add' callback={handleAddCustomField} />
      )}

      {/* Super Field Modal */}
      {openOption.status && openOption.module === 'super_field' && (
        <SuperFieldPopup handleClose={handleClose} open={openOption.status} noCallback={true} />
      )}
    </>
  );
};

export default FloatingActionWidget;
