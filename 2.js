const multer = require('multer');

const fileStorageEngine = multer.diskStorage({
    destination:(req, res, cb) =>{
        cb(null, "./images");
    },
    filename:(req, res, cb) =>{
        cb(false, Date() + "-"+ fileStorageEngine.originalname);
    },
})
const upload = multer({ storage: fileStorageEngine}),

// app.post("./single", upload.single:"image")
module.exports = upload;