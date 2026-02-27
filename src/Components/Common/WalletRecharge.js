import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { withRouter, useHistory } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getPaymentLink, resetChannel, resetSubscription } from '../../store/actions';

const WalletRecharge = (props) => {
  const dispatch = useDispatch();
  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  useEffect(() => {
    dispatch(getPaymentLink());
  }, [dispatch]);

  const [paymentLink, setPaymentLink] = useState({});

  const { subscriptionApiResponse, isPaymentLinkFetched, isChannelPropFetched, apiResponse } = useSelector((state) => ({
    subscriptionApiResponse: state.Subscription.subscriptionApiResponse,
    isPaymentLinkFetched: state.Subscription.isPaymentLinkFetched,
    isChannelPropFetched: state.Channel.isChannelPropFetched,
    apiResponse: state.Channel.apiResponse,
  }));

  useEffect(() => {
    if (isChannelPropFetched) {
      if (apiResponse.prop === 'redirect_url') {
        setLoading(false);
        if (apiResponse.success) {
          window.open(apiResponse?.data, '_blank');
        } else {
        }
        dispatch(resetChannel('isChannelPropFetched', false));
        dispatch(resetChannel('apiResponse', {}));
      }
    }
  }, [isChannelPropFetched]);

  useEffect(() => {
    if (isPaymentLinkFetched) {
      if (subscriptionApiResponse.success) {
        setPaymentLink(subscriptionApiResponse.data);
      } else {
      }
      dispatch(resetSubscription('subscriptionApiResponse', {}));
      dispatch(resetSubscription('isPaymentLinkFetched', false));
    }
  }, [isPaymentLinkFetched]);

  function redirectToRechargeLink(channel_id) {
    setLoading(true);
    dispatch(getChannelProp({ id: channel_id, prop: 'recharge_url' }));
  }

  return (
    <React.Fragment>
      <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className='ms-sm-3 header-item topbar-user bg-transparent'>
        <DropdownToggle tag='button' type='button' className='btn btn-sm btn-primary'>
          <span className='d-flex align-items-center'>
            <i className='mdi mdi-wallet text-white'></i>
            <span
              className='d-none d-xl-inline-block ms-1 fw-medium user-name-text text-white'
              style={{
                maxWidth: '150px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Recharge Wallet
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-end'>
          <DropdownItem href='#'>
            <i className='bx bxs-user-circle text-muted fs-16 align-middle me-1'></i>
            <span className='align-middle'>General Wallet</span>
          </DropdownItem>
          <DropdownItem href='#'>
            <i className='bx bx-git-compare text-muted fs-16 align-middle me-1'></i> <span className='align-middle'>Channel Wallet</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

WalletRecharge.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(WalletRecharge));
