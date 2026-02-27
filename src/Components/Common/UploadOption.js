import uniqid from "uniqid";

function CreateUploadOption(mediaFile, user = "", mime = "") {
  let params = {
    Bucket: "confidentialcontent",
    Key: "broadcast/" + uniqid() + "." + mediaFile.name.split(".").pop(),
    Body: mediaFile,
    ContentType: mediaFile.type,
    ACL: "public-read",
  };
  return params;
}

export default CreateUploadOption;
