import AWS from 'aws-sdk';

let accessKeyId = 'VI6MRCQDN1EELYEP2NSC';
let secretAccessKey = 'jemu8SiqYm8jZsLuFoeaYHGkpwRdkac76ljOadTq';

let wasabiEndpoint = new AWS.Endpoint('s3.eu-west-1.wasabisys.com');

let AWSS3 = new AWS.S3({
  endpoint: wasabiEndpoint,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  correctClockSkew: true,
});

export default AWSS3;
