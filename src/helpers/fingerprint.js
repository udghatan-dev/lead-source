import FingerprintJS from '@fingerprintjs/fingerprintjs';
const fpPromise = FingerprintJS.load();

export default () => {
  return new Promise(async (resolve, reject) => {
    try {
      const fp = await fpPromise;
      const result = await fp.get();
      resolve(result.visitorId);
    } catch (error) {
      reject(error);
    }
  });
};
