import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import { useParams, withRouter } from 'react-router-dom';

import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
//import images

//import Components
//import SearchOption from "../../Components/Common/SearchOption";
import LanguageDropdown from '../../Components/Common/LanguageDropdown';
import WebAppsDropdown from '../../Components/Common/WebAppsDropdown';
//import MyCartDropdown from "../../Components/Common/MyCartDropdown";
import FullScreenDropdown from '../../Components/Common/FullScreenDropdown';
//import NotificationDropdown from "../../Components/Common/NotificationDropdown";
import ProfileDropdown from '../../Components/Common/ProfileDropdown';
//import LightDark from "../../Components/Common/LightDark";
import { decrypt } from '../../security';
import { refreshCacheAndReload, checkVersion } from './../../CacheController';
// import WalletRecharge from '../../Components/Common/WalletRecharge';


import { useSelector, useDispatch } from 'react-redux';
import { fetchPdfCredit } from '../../store/dig/pdf/action';
import { getWalletCoinBalance, purchaseCreditsWithCoins } from '../../helpers/backend_helper';
import { ToastMe } from '../../Components/Common/ToastInit';

const Header = (props) => {
  const { onChangeLayoutMode, layoutModeType, headerClass } = props;
  const [search, setSearch] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  // Add Credits Modal State
  const [walletData, setWalletData] = useState({ balance: 0, rate: 1 });
  const [walletLoading, setWalletLoading] = useState(false);
  const [creditsInput, setCreditsInput] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');

  const toogleSearch = () => {
    setSearch(!search);
  };

  // Fetch wallet data when modal opens
  const fetchWalletData = async () => {
    setWalletLoading(true);
    setPurchaseError('');
    setPurchaseSuccess('');
    try {
      const response = await getWalletCoinBalance({});
      setWalletData({
        balance: response.balance || 0,
        rate: response.rate || 1
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setPurchaseError('Failed to fetch wallet data');
      setWalletData({ balance: 0, rate: 1 });
    } finally {
      setWalletLoading(false);
    }
  };

  const toggleCreditsModal = () => {
    if (!showCreditsModal) {
      fetchWalletData();
      setCreditsInput('');
      setPurchaseError('');
      setPurchaseSuccess('');
    }
    setShowCreditsModal(!showCreditsModal);
  };

  // Calculate coins needed for desired credits
  const coinsNeeded = creditsInput ? Math.ceil(Number(creditsInput) * walletData.rate) : 0;
  const maxCredits = walletData.balance / walletData.rate;
  const isValidPurchase = creditsInput && Number(creditsInput) > 0 && Number(creditsInput) <= maxCredits;

  const handlePurchase = async () => {
    if (!isValidPurchase) return;

    setPurchaseLoading(true);
    setPurchaseError('');
    setPurchaseSuccess('');

    try {
      const response = await purchaseCreditsWithCoins({ credits: Number(creditsInput) });

      if (response.success) {
        // Show success notification, refresh credits and close modal
        ToastMe('success', 'top-right', `Successfully purchased ${creditsInput} credits!`);
        dispatch(fetchPdfCredit());
        setShowCreditsModal(false);
      } else {
        throw new Error(response.message || 'Purchase failed');
      }
    } catch (error) {
      setPurchaseError(error.message || 'Failed to purchase credits. Please try again.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const toogleMenuBtn = () => {
    var windowSize = document.documentElement.clientWidth;

    if (windowSize > 767) document.querySelector('.hamburger-icon').classList.toggle('open');

    //For collapse horizontal menu
    if (document.documentElement.getAttribute('data-layout') === 'horizontal') {
      document.body.classList.contains('menu') ? document.body.classList.remove('menu') : document.body.classList.add('menu');
    }

    //For collapse vertical menu
    if (document.documentElement.getAttribute('data-layout') === 'vertical') {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove('vertical-sidebar-enable');
        document.documentElement.getAttribute('data-sidebar-size') === 'sm'
          ? document.documentElement.setAttribute('data-sidebar-size', '')
          : document.documentElement.setAttribute('data-sidebar-size', 'sm');
      } else if (windowSize > 1025) {
        document.body.classList.remove('vertical-sidebar-enable');
        document.documentElement.getAttribute('data-sidebar-size') === 'lg'
          ? document.documentElement.setAttribute('data-sidebar-size', 'sm')
          : document.documentElement.setAttribute('data-sidebar-size', 'lg');
      } else if (windowSize <= 767) {
        document.body.classList.add('vertical-sidebar-enable');
        document.documentElement.setAttribute('data-sidebar-size', 'lg');
      }
    }

    //Two column menu
    if (document.documentElement.getAttribute('data-layout') === 'twocolumn') {
      document.body.classList.contains('twocolumn-panel')
        ? document.body.classList.remove('twocolumn-panel')
        : document.body.classList.add('twocolumn-panel');
    }
  };
  const dispatch = useDispatch();
  const { userCredits, isPdfCreditFetched } = useSelector((state) => ({
    userCredits: state.PdfExp.userCredits || 0,
    isPdfCreditFetched: state.PdfExp.isPdfCreditFetched || false,
  }));
  var isFreeActive = localStorage.getItem('isFreeActive');
  if (isFreeActive !== null) {
    isFreeActive = JSON.parse(isFreeActive);
  } else {
    isFreeActive = false;
  }

  let websiteLogos = localStorage.getItem('_w');
  if (websiteLogos !== null) {
    websiteLogos = decrypt(websiteLogos);
    var logoSm = JSON.parse(websiteLogos).iconLogo;
    var logoDark = JSON.parse(websiteLogos).mainLogoDark;
    var logoLight = JSON.parse(websiteLogos).mainLogoLight;
    var favicon = JSON.parse(websiteLogos).favicon;
    document.getElementById('favicon').setAttribute('href', favicon);
  } else {
    var logoSm = '';
    var logoDark = '';
    var logoLight = '';
    var favicon = '';
  }

  // useEffect(async () => {
  //   let t = await checkVersion();
  //   setUpdateAvailable(t);
  // }, [props]);
  useEffect(() => {
  // 1. Define the async function inside
  const checkUpdate = async () => {
    let t = await checkVersion();
    setUpdateAvailable(t);
  };

  // 2. Call it immediately
  checkUpdate();
}, [props]);
  useEffect(() => {
    dispatch(fetchPdfCredit());
  }, [dispatch]);
  return (
    <React.Fragment>
      <header id='page-topbar' className={headerClass}>
        <div className='layout-width position-relative'>
          {isFreeActive && (
            <div className='panel-warning-message'>
              <div className='d-flex'>
                <span>{props.t('FREE_PLAN_BANNER_MESSAGE')}</span>
              </div>
            </div>
          )}
          {updateAvailable && (
            <div className='panel-warning-message bg-light' style={{ fontSize: '11px' }}>
              <div className='d-flex gap-2'>
                <span>{"✨New Version Available✨: We've updated panel to make it faster and better for you"}</span>
                <button className='btn btn-sm btn-primary my-0 py-0 fs-11 fw-normal' onClick={() => refreshCacheAndReload()}>
                  Click to Refresh
                </button>
              </div>
            </div>
          )}
          <div className='navbar-header' style={updateAvailable ? { height: '55px' } : {}}>
            <div className='d-flex'>
              <div className='navbar-brand-box horizontal-logo'>
                <Link to='/' className='logo logo-dark'>
                  <span className='logo-sm'>
                    <img src={logoSm} alt='' height='22' />
                  </span>
                  <span className='logo-lg'>
                    <img src={logoDark} alt='' height='50' />
                  </span>
                </Link>

                <Link to='/' className='logo logo-light'>
                  <span className='logo-sm'>
                    <img src={logoSm} alt='' height='22' />
                  </span>
                  <span className='logo-lg'>
                    <img src={logoLight} alt='' height='50' />
                  </span>
                </Link>
              </div>

              <button
                onClick={toogleMenuBtn}
                type='button'
                className='btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger'
                id='topnav-hamburger-icon'
              >
                <span className='hamburger-icon'>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
              {/* <div className='d-flex align-items-center ms-3'>
                <div className='badge bg-soft-success text-success fs-13 px-3 py-2 w-100 text-start'>
                  <i className='mdi mdi-wallet me-1'></i>
                  Credits: {isPdfCreditFetched ? userCredits : '...'}
                </div>
              </div> */}
              {/* <div className='d-flex align-items-center px-3 gap-2'>
                <div className='badge bg-soft-success text-success fs-13 px-3 py-2'>
                  <i className='mdi mdi-wallet me-1'></i>
                  Credits: {isPdfCreditFetched ? userCredits : '...'}
                </div>
                <button
                  className='btn btn-sm btn-primary'
                  onClick={toggleCreditsModal}
                  style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '6px', backgroundColor: "rgb(118, 211, 230)", textcolor:"#000000" }}
                >
                  <i className='mdi mdi-plus me-1'></i>
                  Add Credits
                </button>
              </div> */}
              {/* <SearchOption /> */}
            </div>

            <div className='d-flex align-items-center'>
              {/* <Dropdown isOpen={search} toggle={toogleSearch} className="d-md-none topbar-head-dropdown header-item">
                                <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                                    <i className="bx bx-search fs-22"></i>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                                    <Form className="p-3">
                                        <div className="form-group m-0">
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Search ..."
                                                    aria-label="Recipient's username" />
                                                <button className="btn btn-primary" type="submit"><i
                                                    className="mdi mdi-magnify"></i></button>
                                            </div>
                                        </div>
                                    </Form>
                                </DropdownMenu>
                            </Dropdown> */}

              {/* LanguageDropdown */}
              <LanguageDropdown />

              {/* WebAppsDropdown */}
              <WebAppsDropdown />

              {/* MyCartDropdwon */}
              {/* <MyCartDropdown /> */}

              {/* FullScreenDropdown */}
              <FullScreenDropdown />

              {/* Dark/Light Mode set */}
              {/* <LightDark
                                layoutMode={layoutModeType}
                                onChangeLayoutMode={onChangeLayoutMode}
                            /> */}

              {/* NotificationDropdown */}
              {/* <NotificationDropdown /> */}
              {/* <WalletRecharge /> */}

              {/* ProfileDropdown */}
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Add Credits Modal */}
      <Modal isOpen={showCreditsModal} toggle={toggleCreditsModal} centered>
        <ModalHeader toggle={toggleCreditsModal} style={{ borderBottom: '1px solid #e9ebec' }}>
          <div className='d-flex align-items-center gap-2'>
            <i className='mdi mdi-wallet-plus' style={{ fontSize: '20px', color: '#405189' }}></i>
            <span>Add Credits</span>
          </div>
        </ModalHeader>
        <ModalBody>
          {walletLoading ? (
            <div className='text-center py-4'>
              <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </div>
              <p className='mt-2 mb-0' style={{ fontSize: '13px', color: '#878a99' }}>Loading wallet data...</p>
            </div>
          ) : (
            <>
              {/* Wallet Balance Section */}
              <div className='d-flex justify-content-between mb-4'>
                {/* Current Credits */}
                <div className='text-center flex-fill p-3 rounded-3 me-2' style={{ backgroundColor: 'rgba(10, 179, 156, 0.1)' }}>
                  <i className='mdi mdi-star-circle' style={{ fontSize: '28px', color: '#0ab39c' }}></i>
                  <h6 className='text-muted mb-1 mt-2' style={{ fontSize: '11px' }}>Current Credits</h6>
                  <h4 className='mb-0' style={{ color: '#0ab39c', fontWeight: '600' }}>
                    {isPdfCreditFetched ? userCredits.toLocaleString() : '...'}
                  </h4>
                </div>
                {/* Coin Balance */}
                <div className='text-center flex-fill p-3 rounded-3 ms-2' style={{ backgroundColor: 'rgba(64, 81, 137, 0.1)' }}>
                  <i className='mdi mdi-bitcoin' style={{ fontSize: '28px', color: '#405189' }}></i>
                  <h6 className='text-muted mb-1 mt-2' style={{ fontSize: '11px' }}>Coin Balance</h6>
                  <h4 className='mb-0' style={{ color: '#405189', fontWeight: '600' }}>
                    {walletData.balance.toLocaleString()}
                  </h4>
                </div>
              </div>

              {/* Conversion Rate Info */}
              <div className='p-3 rounded-3 mb-4' style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ebec' }}>
                <div className='d-flex align-items-center justify-content-between'>
                  <span style={{ fontSize: '13px', color: '#495057' }}>
                    <i className='mdi mdi-swap-horizontal me-2' style={{ color: '#405189' }}></i>
                    Conversion Rate
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#405189' }}>
                    1 Credit = {walletData.rate} Coin
                  </span>
                </div>
                <div className='d-flex align-items-center justify-content-between mt-2'>
                  <span style={{ fontSize: '12px', color: '#878a99' }}>Max purchasable</span>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#0ab39c' }}>
                    {maxCredits.toLocaleString()} credits
                  </span>
                </div>
              </div>

              {/* Credits Input */}
              <div className='mb-3'>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#495057', marginBottom: '8px', display: 'block' }}>
                  Enter Credits to Purchase
                </label>
                <input
                  type='number'
                  className='form-control'
                  placeholder='e.g. 100'
                  value={creditsInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      setCreditsInput(value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === '.' || e.key === 'e' || e.key === '-' || e.key === '+') {
                      e.preventDefault();
                    }
                  }}
                  style={{ fontSize: '14px', padding: '10px 14px' }}
                  min='1'
                  max={maxCredits}
                  step='1'
                />
              </div>

              {/* Coins Needed Display */}
              {creditsInput && Number(creditsInput) > 0 && (
                <div className='p-3 rounded-3 mb-3' style={{
                  backgroundColor: isValidPurchase ? 'rgba(10, 179, 156, 0.1)' : 'rgba(249, 62, 62, 0.1)',
                  border: `1px solid ${isValidPurchase ? '#0ab39c' : '#f93e3e'}`
                }}>
                  <div className='d-flex align-items-center justify-content-between'>
                    <span style={{ fontSize: '13px', color: '#495057' }}>Coins Required</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: isValidPurchase ? '#0ab39c' : '#f93e3e' }}>
                      {coinsNeeded.toLocaleString()} coins
                    </span>
                  </div>
                  {!isValidPurchase && Number(creditsInput) > maxCredits && (
                    <p className='mb-0 mt-2' style={{ fontSize: '12px', color: '#f93e3e' }}>
                      <i className='mdi mdi-alert-circle me-1'></i>
                      Insufficient coins. Maximum: {maxCredits.toLocaleString()} credits
                    </p>
                  )}
                </div>
              )}

              {/* Error Message */}
              {purchaseError && (
                <div className='alert alert-danger py-2 mb-3' style={{ fontSize: '12px' }}>
                  <i className='mdi mdi-alert-circle me-1'></i>
                  {purchaseError}
                </div>
              )}

              {/* Success Message */}
              {purchaseSuccess && (
                <div className='alert alert-success py-2 mb-3' style={{ fontSize: '12px' }}>
                  <i className='mdi mdi-check-circle me-1'></i>
                  {purchaseSuccess}
                </div>
              )}

              {/* Purchase Button */}
              <button
                className='btn btn-primary w-100'
                onClick={handlePurchase}
                disabled={!isValidPurchase || purchaseLoading}
                style={{ padding: '10px', fontSize: '14px', fontWeight: '500' }}
              >
                {purchaseLoading ? (
                  <>
                    <span className='spinner-border spinner-border-sm me-2' role='status'></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className='mdi mdi-cart-plus me-1'></i>
                    Purchase {creditsInput || 0} Credits
                  </>
                )}
              </button>
            </>
          )}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

Header.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(Header));
