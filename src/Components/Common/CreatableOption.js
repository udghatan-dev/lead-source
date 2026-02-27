import React from 'react';

import CreatableSelect from 'react-select/creatable';
import CustomNotification from './CustomNotification';

const components = {
  DropdownIndicator: null,
};

function isUrl(url) {
  let regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  let match = url.match(regex);
  return match ? true : false;
}

function extractHostname(url) {
  try {
    if (!isUrl(url)) {
      return null;
    }
    if (url.indexOf('https') === -1 || url.indexOf('http') === -1) {
      url = `https://${url}`;
    }
    let urlObject = new URL(url);
    return urlObject.hostname;
  } catch (error) {
    return null;
  }
}

const createOption = (label, validation) => {
  let url = label;
  if (validation === 'url') {
    url = extractHostname(label);
  }
  if (url !== null) {
    return {
      label: url,
      value: url,
    };
  } else {
    CustomNotification.error('Enter a valid domain');
    return null;
  }
};

export default (props) => {
  const [inputValue, setInputValue] = React.useState('');
  const [value, setValue] = React.useState([]);

  React.useEffect(() => {
    if (value.length === 0 && props.options.length > 0) {
      setValue(props.options);
    }
  }, [props.options]);

  React.useEffect(() => {
    props.setOptions(value);
  }, [value]);

  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        let v = createOption(inputValue, props.validation);
        setValue((prev) => (v !== null ? [...prev, v] : prev));
        setInputValue('');
        event.preventDefault();
    }
  };

  return (
    <CreatableSelect
      components={components}
      inputValue={inputValue}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={(newValue) => setValue(newValue)}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder='Type and press enter...'
      value={value}
    />
  );
};
