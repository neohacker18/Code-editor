const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid"); 

const dirCodes = path.join(__dirname, "codes");

if (fs.existsSync(dirCodes)===undefined) {
  fs.mkdirSync(dircodes, { recursive: true });
}

const generateFile = async (format, content) => {
  const jobId = uuid();
  const filename = `${jobId}.${format}`;
  const filepath = path.join(dirCodes, filename);
  await fs.writeFileSync(filepath, content);
  return {filepath,message:"Success"};
};

module.exports = {
  generateFile
};
