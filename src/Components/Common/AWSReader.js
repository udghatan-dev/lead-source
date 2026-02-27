import AWS from 'aws-sdk';

let accessKeyForReader = 'S5WH8K9VARML3HD7RTAS';
let secretKeyForReader = 'A34eaPoRqnJUT2V7idXLAJH13RZjZsJXObL5uygj';

let wasabiEndpoint = new AWS.Endpoint('s3.eu-west-1.wasabisys.com');

let AWSS3Reader = new AWS.S3({
  endpoint: wasabiEndpoint,
  accessKeyId: accessKeyForReader,
  secretAccessKey: secretKeyForReader,
});

export default AWSS3Reader;
