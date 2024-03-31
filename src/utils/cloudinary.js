import {v2 as cloudinary} from 'cloudinary';
        
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        // if localFile path not exist
        if(!localFilePath) {
          console.error('Local file path is empty or undefined');
          return null;
        }

        // Log the local file path before upload
        console.log('Uploading file to Cloudinary:', localFilePath);


        //upload the file on cloudinary
         const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"  // it will automatically detect the file type
         })
         // file has been uploaded successfully
         console.log("File is successfully uploaded on cloudinary", response.url);

        // remove the file after uploaded successfully 
        fs.unlinkSync(localFilePath)
        // console.log(response)
         return response;
        
    } catch (error) {
      fs.unlinkSync(localFilePath) // remove the locally saved temporary file from the server as the upload operation get failed
        
    }
}

export {uploadOnCloudinary}