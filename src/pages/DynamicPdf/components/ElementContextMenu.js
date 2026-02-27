// components/ElementContextMenu.js - Fixed positioning
import React, { useEffect, useRef } from 'react';
import './custom.css';

const ElementContextMenu = ({ position, onAction, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (position) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [position, onClose]);

  if (!position) return null;

  const actions = [
    { key: 'edit', icon: 'bx bxs-edit', label: 'Edit', title: 'Edit Element' },
    { key: 'duplicate', icon: 'bx bx-copy', label: 'Clone', title: 'Clone Element' },
    { key: 'bringForward', icon: 'bx bx-up-arrow-alt', label: 'Forward', title: 'Bring Forward' },
    { key: 'sendBackward', icon: 'bx bx-down-arrow-alt', label: 'Backward', title: 'Send Backward' },
    { key: 'bringToFront', icon: 'bx bx-chevrons-up', label: 'To Front', title: 'Bring to Front' },
    { key: 'sendToBack', icon: 'bx bx-chevrons-down', label: 'To Back', title: 'Send to Back' },
    { key: 'delete', icon: 'bx bxs-trash', label: 'Delete', title: 'Delete Element', danger: true },
  ];

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: `${position.y}px`, 
        left: `${position.x}px`, 
        zIndex: 1000,
        minWidth: '50px',
      }}
      className="bg-dark rounded-3 shadow-lg d-flex flex-column py-1"
    >
      {actions.map((action) => (
        <button
          key={action.key}
          onClick={() => {
            onAction(action.key);
            onClose();
          }}
          className={`dig-action-button text-white text-start px-3 py-2 border-0 bg-transparent d-flex align-items-center gap-2 ${
            action.danger ? 'text-danger' : ''
          }`}
          title={action.title}
          style={{ cursor: 'pointer' }}
        >
          <i className={`${action.icon} fs-16`}></i>
          <span className="small">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ElementContextMenu;