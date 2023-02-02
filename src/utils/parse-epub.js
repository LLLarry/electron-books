// const EPub = require("epub");
// const EPub = require("epub2/node");
const EPub = require("epub2").EPub;

const parseEpub = (filePath) => {
  return new Promise((resolve, reject) => {
    let epub = new EPub(filePath, "", "");
    epub.on("end", function () {
      // epub is now usable
      console.log(epub);
      resolve(epub);
      // epub.getChapter("chapter_id", function(err, text){});
    });
    epub.parse();
  });
};

export default parseEpub;
