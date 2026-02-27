import React from "react";
import "./preloader.css";

const OverlayAlert = (props) => {
  return (
    <>
      {props.isExpired ? (
        <div className="overlay_full_page_loading_light">
          <div className="overlay_animation_holder_light">
            <div className="overlay_animation_wrapper_light w-50">
              <div className="overlay_svg_holder">
                <i className="bx bxs-error text-light" style={{ fontSize: "52px" }}></i>
              </div>
              <div className="overlay_brand_name_light text-white">{props.title}</div>
              <div className="overlay_brand_tag_light text-white">{props.subtitle}</div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default OverlayAlert;
