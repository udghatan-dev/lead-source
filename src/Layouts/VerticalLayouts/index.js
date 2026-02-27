import React, { lazy, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useHistory } from 'react-router-dom';

//import Components
const Header = lazy(() => import('./Header'));
const Sidebar = lazy(() => import('./Sidebar'));
import Preloader from './../../Components/Loaders/Preloader';

//import actions
import {
  changeLayout,
  changeSidebarTheme,
  changeLayoutMode,
  changeLayoutWidth,
  changeLayoutPosition,
  changeTopbarTheme,
  changeLeftsidebarSizeType,
  changeLeftsidebarViewType,
} from '../../store/actions';

//redux
import { useSelector, useDispatch } from 'react-redux';
// import FloatingActionWidget from '../../Components/Common/FloatingWidget';

const Layout = (props) => {
  const history = useHistory();
  const [showIGPromotion, setShowIGPromotion] = useState(false);
  const [headerClass, setHeaderClass] = useState('');
  const dispatch = useDispatch();
  const {
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
  } = useSelector((state) => ({
    layoutType: state.Layout.layoutType,
    leftSidebarType: state.Layout.leftSidebarType,
    layoutModeType: state.Layout.layoutModeType,
    layoutWidthType: state.Layout.layoutWidthType,
    layoutPositionType: state.Layout.layoutPositionType,
    topbarThemeType: state.Layout.topbarThemeType,
    leftsidbarSizeType: state.Layout.leftsidbarSizeType,
    leftSidebarViewType: state.Layout.leftSidebarViewType,
  }));

  /*
    layout settings
    */
  useEffect(() => {
    if (
      layoutType ||
      leftSidebarType ||
      layoutModeType ||
      layoutWidthType ||
      layoutPositionType ||
      topbarThemeType ||
      leftsidbarSizeType ||
      leftSidebarViewType
    ) {
      dispatch(changeLeftsidebarViewType(leftSidebarViewType));
      dispatch(changeLeftsidebarSizeType(leftsidbarSizeType));
      dispatch(changeSidebarTheme(leftSidebarType));
      dispatch(changeLayoutMode(layoutModeType));
      dispatch(changeLayoutWidth(layoutWidthType));
      dispatch(changeLayoutPosition(layoutPositionType));
      dispatch(changeTopbarTheme(topbarThemeType));
      dispatch(changeLayout(layoutType));
    }
  }, [
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    dispatch,
  ]);
  /*
    call dark/light mode
    */
  const onChangeLayoutMode = (value) => {
    if (changeLayoutMode) {
      dispatch(changeLayoutMode(value));
    }
  };

  useEffect(() => {
    try {
      if (!localStorage.getItem('ig_promotional_timeout')) {
        return setShowIGPromotion(true);
      }
      let timeout = localStorage.getItem('ig_promotional_timeout');
      if (timeout == '-1') {
        return;
      }
      timeout = Number(timeout);
      if (new Date().getTime() > timeout) {
        setShowIGPromotion(true);
      }
    } catch (error) {}
  }, []);

  // class add remove in header
  useEffect(() => {
    window.addEventListener('scroll', scrollNavigation, true);
  });
  function scrollNavigation() {
    var scrollup = document.documentElement.scrollTop;
    if (scrollup > 50) {
      setHeaderClass('topbar-shadow');
    } else {
      setHeaderClass('');
    }
  }
  return (
    <React.Suspense fallback={<Preloader />}>
      <React.Fragment>
        <div id='layout-wrapper'>
          <Header headerClass={headerClass} layoutModeType={layoutModeType} onChangeLayoutMode={onChangeLayoutMode} />
          <Sidebar layoutType={layoutType} />
          <div className='main-content'>{props.children}</div>
        </div>
      </React.Fragment>
    </React.Suspense>
  );
};

Layout.propTypes = {
  children: PropTypes.object,
};

export default withRouter(Layout);
