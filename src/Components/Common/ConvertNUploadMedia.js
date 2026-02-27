import Axios from 'axios';

function ConvertNUploadMedia(file) {
  return new Promise((resolve, reject) => {
    let config = {
      method: 'post',
      url: `https://mapi.1automations.com/api/v2/media/audio`,
      headers: {
        'Content-Type': file.type,
      },
      data: file,
    };

    Axios(config)
      .then((response) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject('Failed to complete upload');
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

export default ConvertNUploadMedia;
