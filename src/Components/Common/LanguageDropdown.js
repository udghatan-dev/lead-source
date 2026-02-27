import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { get, map } from 'lodash';

//i18n
import i18n, { changeMyLanguage } from '../../i18n';
import languages from '../../common/languages';
import axios from 'axios';

function fetchTranslations() {
  return new Promise((resolve, reject) => {
    axios('https://partner-api.1automations.com/api/v1/core/translations')
      .then((response) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((err) => {
        reject();
      });
  });
}

const LanguageDropdown = () => {
  // Declare a new state variable, which we'll call "menu"
  const [selectedLang, setSelectedLang] = useState('');
  const [availableTranslations, setAvailableTranslations] = useState([]);

  useEffect(() => {
    const currentLanguage =
      localStorage.getItem('I18N_LANGUAGE') || localStorage.getItem('userLanguage') || localStorage.getItem('panelLanguage') || 'en';
    setSelectedLang(currentLanguage);

    fetchTranslations()
      .then((data) => {
        if (data.length > 0) {
          let allLangs = [
            {
              name: 'Default (English)',
              code: 'en',
              logo: languages.en.flag,
            },
          ].concat(data);
          setAvailableTranslations(allLangs);
        } else {
          setAvailableTranslations(data);
        }
      })
      .catch((_) => {});
  }, []);

  const changeLanguageAction = (lang) => {
    //set language as i18n
    //i18n.changeLanguage(lang);
    changeMyLanguage(lang);
    localStorage.setItem('I18N_LANGUAGE', lang);
    setSelectedLang(lang);
  };

  const [isLanguageDropdown, setIsLanguageDropdown] = useState(false);
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdown(!isLanguageDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown isOpen={isLanguageDropdown} toggle={toggleLanguageDropdown} className='ms-1 topbar-head-dropdown header-item'>
        <DropdownToggle className='btn btn-icon btn-topbar btn-ghost-secondary rounded-circle' tag='button'>
          {availableTranslations.length > 0 && availableTranslations.find((c) => c.code === selectedLang) ? (
            <img
              src={availableTranslations.find((c) => c.code === selectedLang)?.logo}
              alt='Header Language'
              height='20'
              className='rounded'
            />
          ) : (
            <img src={get(languages, `${selectedLang}.flag`)} alt='Header Language' height='20' className='rounded' />
          )}
        </DropdownToggle>
        <DropdownMenu className='notify-item language py-2'>
          {availableTranslations.length > 0 ? (
            <>
              {map(availableTranslations, (item) => {
                return (
                  <DropdownItem
                    key={item.code}
                    onClick={() => changeLanguageAction(item.code)}
                    className={`notify-item ${selectedLang === item.code ? 'active' : 'none'}`}
                  >
                    <img src={item.logo} alt='Skote' className='me-2 rounded' height='18' />
                    <span className='align-middle'>{item.name}</span>
                  </DropdownItem>
                );
              })}
            </>
          ) : (
            <>
              {map(Object.keys(languages), (key) => {
                return (
                  <DropdownItem
                    key={key}
                    onClick={() => changeLanguageAction(key)}
                    className={`notify-item ${selectedLang === key ? 'active' : 'none'}`}
                  >
                    <img src={get(languages, `${key}.flag`)} alt='Skote' className='me-2 rounded' height='18' />
                    <span className='align-middle'>{get(languages, `${key}.label`)}</span>
                  </DropdownItem>
                );
              })}
            </>
          )}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default LanguageDropdown;
