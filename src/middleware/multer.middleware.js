 import multer from "multer";


 const storage = multer.diskStorage({
    destination: function (req, file, cb) {    // req ---> user pakharu jau request asuchi  // file ---> sabu file ra access milijae store kariba pain
      cb(null, "./public/temp")        // cb --> callback  
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    } 
  }) 
  
  export const upload = multer({ 
    storage,
 })