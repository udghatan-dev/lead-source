import React from 'react';
import AWSS3 from './AWS';
import uniqid from 'uniqid';

const uploadContent = (folder, file) => {
  return new Promise((resolve, reject) => {
    try {
      var params = {
        Bucket: 'confidentialcontent',
        Key: folder + '/' + uniqid() + '.' + file.name.split('.').pop(),
        Body: file,
        ContentType: file.type,
        ACL: 'public-read',
      };

      var options = {
        partSize: 10 * 1024 * 1024, // 10 MB
        queueSize: 10,
      };

      AWSS3.upload(params, options, function (err, data) {
        if (!err) {
          resolve(data.Location);
        } else {
          reject('');
        }
      });
    } catch (error) {
      reject('');
    }
  });
};
export default uploadContent;
