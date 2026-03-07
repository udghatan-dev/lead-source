import React, { useState, useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';

const SearchableSelect = ({ items, value, onChange, placeholder, disabled, nameKey = 'name', idKey = 'id' }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!value) setSearch('');
  }, [value]);

  const filtered = items.filter((item) =>
    (item[nameKey] || '').toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (item) => {
    onChange(item);
    setSearch('');
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearch('');
  };

  if (disabled && items.length === 0) {
    return (
      <div
        className='form-control text-muted'
        style={{ fontSize: '0.85rem', backgroundColor: '#f8fafc', cursor: 'not-allowed' }}
      >
        {placeholder || 'No items available'}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {value && !isOpen ? (
        <div
          className='form-control d-flex align-items-center justify-content-between'
          style={{ fontSize: '0.85rem', cursor: 'pointer' }}
          onClick={() => setIsOpen(true)}
        >
          <span>{value[nameKey]}</span>
          <IoMdClose
            style={{ fontSize: '1rem', color: '#94a3b8', cursor: 'pointer' }}
            onClick={handleClear}
          />
        </div>
      ) : (
        <div className='position-relative'>
          <FiSearch
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '0.9rem',
            }}
          />
          <input
            type='text'
            className='form-control'
            style={{ fontSize: '0.85rem', paddingLeft: '32px' }}
            placeholder={placeholder || 'Search...'}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            autoFocus={isOpen}
          />
        </div>
      )}

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1050,
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: '#fff',
            border: '1px solid #dee2e6',
            borderRadius: '0 0 6px 6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {filtered.length === 0 ? (
            <div className='px-3 py-2 text-muted' style={{ fontSize: '0.83rem' }}>
              No results found
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item[idKey]}
                className='px-3 py-2'
                style={{
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  backgroundColor: value && value[idKey] === item[idKey] ? '#eff6ff' : 'transparent',
                  borderBottom: '1px solid #f1f5f9',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    value && value[idKey] === item[idKey] ? '#eff6ff' : 'transparent';
                }}
                onClick={() => handleSelect(item)}
              >
                {item[nameKey]}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
