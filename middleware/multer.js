const multer = require('multer');
const fs = require('fs/promises');

const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  dest: 'public/images/uploads'
});

module.exports = upload