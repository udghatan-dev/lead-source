import React from 'react';
import './preloader.css';
// import VARIABLES from './variables.json';
// import { ReactComponent as Loader1 } from './../../assets/images/svg/loaders/loader.svg';
// import { ReactComponent as Loader2 } from './../../assets/images/svg/loaders/loader2.svg';
// import { ReactComponent as Loader3 } from './../../assets/images/svg/loaders/loader3.svg';
// import { ReactComponent as Loader4 } from './../../assets/images/svg/loaders/loader4.svg';
// import { ReactComponent as Loader6 } from './../../assets/images/svg/loaders/loader6.svg';
// import { ReactComponent as Loader7 } from './../../assets/images/svg/loaders/loader7.svg';
import Loader8 from './../../assets/images/svg/loaders/loader8-unscreen.gif';
import Default from './../../assets/images/svg/loaders/default.svg';
//import Loader9 from './../../assets/images/svg/loaders/loader9-unscreen.gif';
import { decrypt } from '../../security';

const Preloader = (props) => {
  let bgTheme = 'light';
  let brandName = '';
  let brandTag = 'Please wait...';
  let loader = Default;
  let mediaDimension = { h: 'auto', w: '100px' };
  let customBg = '';

  if (localStorage.getItem('_lc') !== null) {
    let data = decrypt(localStorage.getItem('_lc'));
    try {
      data = JSON.parse(data);
      if (data.enable !== undefined && data.enable === false) {
        localStorage.removeItem('_lc');
        return;
      }
      bgTheme = data.theme;
      brandName = data.title;
      brandTag = data.sub_title;
      loader = data.media;
      if (data.dimension !== undefined) {
        mediaDimension = { h: data.dimension.h, w: data.dimension.w };
      }
      if (data.custom_bg !== undefined) {
        customBg = data.custom_bg;
      }
    } catch (error) {}
  }
  // if (VARIABLES[window.location.hostname.toUpperCase()] !== undefined) {
  //   var loader = VARIABLES[window.location.hostname.toUpperCase()]['LOADER'];
  // } else {
  //   var loader = VARIABLES['DEFAULT']['LOADER'];
  // }
  // if (VARIABLES[window.location.hostname.toUpperCase()] !== undefined) {
  //   var brandName = VARIABLES[window.location.hostname.toUpperCase()]['TITLE'];
  // } else {
  //   var brandName = VARIABLES['DEFAULT']['TITLE'];
  // }
  // if (VARIABLES[window.location.hostname.toUpperCase()] !== undefined) {
  //   var brandTag = VARIABLES[window.location.hostname.toUpperCase()]['TAG'];
  // } else {
  //   var brandTag = VARIABLES['DEFAULT']['TAG'];
  // }
  // if (VARIABLES[window.location.hostname.toUpperCase()] !== undefined) {
  //   var bgTheme = VARIABLES[window.location.hostname.toUpperCase()]['THEME'];
  // } else {
  //   var bgTheme = VARIABLES['DEFAULT']['THEME'];
  // }

  return (
    <>
      {/* {bgTheme === 'light' ? (
        <div className='full_page_loading_light'>
          <div className='animation_holder_light'>
            <div className='animation_wrapper_light'>
              <div className='svg_holder'>
                {loader === 'LOADER1' ? (
                  <Loader1 />
                ) : loader === 'LOADER2' ? (
                  <Loader2 />
                ) : loader === 'LOADER3' ? (
                  <Loader3 />
                ) : loader === 'LOADER4' ? (
                  <Loader4 />
                ) : loader === 'LOADER6' ? (
                  <Loader6 />
                ) : loader === 'LOADER7' ? (
                  <Loader7 />
                ) : loader === 'LOADER8' ? (
                  <img src={Loader8} width='200px' />
                ) : loader === 'LOADER9' ? (
                  <img src={Loader9} width='200px' />
                ) : (
                  ''
                )}
              </div>
              <div className='brand_name_light'>{brandName}</div>
              <div className='brand_tag_light'>{brandTag}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className='full_page_loading_dark'>
          <div className='animation_holder_dark'>
            <div className='animation_wrapper_dark'>
              <div className='svg_holder'>
                {loader === 'LOADER1' ? (
                  <Loader1 />
                ) : loader === 'LOADER2' ? (
                  <Loader2 />
                ) : loader === 'LOADER3' ? (
                  <Loader3 />
                ) : loader === 'LOADER4' ? (
                  <Loader4 />
                ) : loader === 'LOADER6' ? (
                  <Loader6 />
                ) : loader === 'LOADER7' ? (
                  <Loader7 />
                ) : loader === 'LOADER8' ? (
                  <img src={Loader8} width='200px' />
                ) : loader === 'LOADER9' ? (
                  <img src={Loader9} width='200px' />
                ) : (
                  ''
                )}
              </div>
              <div className='brand_name_dark'>{brandName}</div>
              <div className='brand_tag_dark'>{brandTag}</div>
            </div>
          </div>
        </div>
      )} */}

      {bgTheme === 'light' ? (
        <div className='full_page_loading_light'>
          <div className='animation_holder_light'>
            <div className='animation_wrapper_light'>
              <div className='svg_holder'>
                <img src={loader} width={mediaDimension.w} height={mediaDimension.h} />
              </div>
              <div className='brand_name_light'>{brandName}</div>
              <div className='brand_tag_light'>{brandTag}</div>
              <div className='update_message_light' id='config_loading_message_update'></div>
            </div>
          </div>
        </div>
      ) : bgTheme === 'dark' ? (
        <div className='full_page_loading_dark'>
          <div className='animation_holder_dark'>
            <div className='animation_wrapper_dark'>
              <div className='svg_holder'>
                <img src={loader} width={mediaDimension.w} height={mediaDimension.h} />
              </div>
              <div className='brand_name_dark'>{brandName}</div>
              <div className='brand_tag_dark'>{brandTag}</div>
              <div className='update_message_dark' id='config_loading_message_update'></div>
            </div>
          </div>
        </div>
      ) : (
        <div className='full_page_loading_dark' style={{ backgroundColor: customBg }}>
          <div className='animation_holder_dark'>
            <div className='animation_wrapper_dark'>
              <div className='svg_holder'>
                <img src={loader} width={mediaDimension.w} height={mediaDimension.h} />
              </div>
              <div className='brand_name_dark'>{brandName}</div>
              <div className='brand_tag_dark'>{brandTag}</div>
              <div className='update_message_dark' id='config_loading_message_update'></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Preloader;
