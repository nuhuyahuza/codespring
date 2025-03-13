import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/course-thumbnails/');
  },
  filename: function (req, file, cb) {
    // Use courseId from the URL parameters as the filename
    const courseId = req.params.id;
    const extension = path.extname(file.originalname);
    cb(null, `${courseId}${extension}`);
  }
});

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept all image types
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files are allowed.'));
    }
  }
}); 