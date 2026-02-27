import React from 'react';
import { MdOutlineTaskAlt } from 'react-icons/md';
import { MdHorizontalRule } from 'react-icons/md';
import { IoGitCompareOutline } from 'react-icons/io5';
import { VscRobot } from 'react-icons/vsc';
import { GrSettingsOption } from 'react-icons/gr';
import { AiOutlineYoutube } from 'react-icons/ai';
import { FaBook } from 'react-icons/fa';

const Widget = () => {
  return (
    <div
      style={{ position: 'fixed', paddingTop: '75px', zIndex: -100, right: 0, top: 0, bottom: 0, zIndex: 0, width: '35px' }}
      className='d-flex flex-column align-items-center bg-light'
    >
      <button className='btn btn-sm btn-light mt-2 p-1'>
        <IoGitCompareOutline className='fs-16 text-dark' />
      </button>
      <button className='btn btn-sm btn-light mt-2 p-1'>
        <VscRobot className='fs-16 text-dark' />
      </button>
      <button className='btn btn-sm btn-light mt-2 p-1'>
        <MdOutlineTaskAlt className='fs-16 text-dark' />
      </button>
      <MdHorizontalRule className='fs-13 mt-2' style={{ color: 'darkgrey' }} />
      <button className='btn btn-sm btn-light mt-2 p-1'>
        <AiOutlineYoutube className='fs-16 text-dark' />
      </button>
      <button className='btn btn-sm btn-light mt-2 p-1'>
        <FaBook className='fs-16 text-dark' />
      </button>
      <button className='btn btn-sm btn-light mt-2 p-1'>
        <GrSettingsOption className='fs-16 text-dark' />
      </button>
    </div>
  );
};

export default Widget;
