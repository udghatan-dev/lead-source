import React from 'react';
import MetaTags from 'react-meta-tags';
import { AES, enc } from 'crypto-js';

const MetaTag = (props) => {
  let websiteTitle = '';
  // let basicPanelSettings = localStorage.getItem("_basic");
  // let s_k = window.location.origin;
  // let bytes = AES.decrypt(basicPanelSettings, s_k);
  // basicPanelSettings = bytes.toString(enc.Utf8);
  // if (basicPanelSettings !== null) {
  //   var websiteTitle = JSON.parse(basicPanelSettings).title;
  // }
  return (
    <React.Fragment>
      <MetaTags>
        <title>
          {props.pageTitle} | {websiteTitle ?? ''}
        </title>
      </MetaTags>
    </React.Fragment>
  );
};

export default MetaTag;
