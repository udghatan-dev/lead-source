import packageJson from '../package.json';
import moment from 'moment';

const buildDateGreaterThan = (latestDate, currentDate) => {
  const momLatestDateTime = moment(latestDate);
  const momCurrentDateTime = moment(currentDate);

  if (momLatestDateTime.isAfter(momCurrentDateTime)) {
    return true;
  } else {
    return false;
  }
};

const refreshCacheAndReload = () => {
  if (caches) {
    // Service worker cache should be cleared with caches.delete()
    caches.keys().then((names) => {
      for (const name of names) {
        caches.delete(name);
      }
    });
  }
  localStorage.removeItem('_v');
  localStorage.removeItem('_lv');
  // delete browser cache and hard reload
  window.location.reload(true);
};

const checkVersion = () => {
  return new Promise((resolve, reject) => {
    try {
      let version_local = localStorage.getItem('_v');
      let version_latest = localStorage.getItem('_lv');

      if (version_local === version_latest) {
        resolve(false);
      } else {
        resolve(true);
      }
    } catch (error) {
      resolve(false);
    }
  });
};

export { checkVersion, refreshCacheAndReload };
