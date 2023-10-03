const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'videoList.json'
);

const VideoList = {
  all: function (id) {
    const allVideo = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    return allVideo.find(mov => mov.id === id);
  },
};

module.exports = VideoList;
