import React from 'react';
import { BiSolidCopyAlt } from 'react-icons/bi';
import { MdOutlineCancel } from 'react-icons/md';
import { LuNotebookPen } from 'react-icons/lu';

const NodeOptions = ({ toggleSideBar, payload, nodeClass, isConnectable = true, styles }) => {
  return (
    <div className={`${nodeClass} d-flex align-items-center gap-2`} style={styles}>
      <LuNotebookPen
        className='fs-18 text-dark animate-me'
        onClick={(e) => {
          e.preventDefault();
          toggleSideBar('note', 1, payload);
        }}
      />
      {isConnectable && (
        <>
          <BiSolidCopyAlt
            className='fs-18 animate-me'
            style={{ color: 'green' }}
            onClick={(e) => {
              e.preventDefault();
              toggleSideBar('copy', 1, payload);
            }}
          />
        </>
      )}
      <MdOutlineCancel
        className='fs-18 animate-me'
        style={{ color: 'red' }}
        onClick={(e) => {
          e.preventDefault();
          toggleSideBar('delete', 1, payload);
        }}
      />
    </div>
  );
};

export default NodeOptions;
