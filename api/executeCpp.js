const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const compileCpp = (filepath, outPath) => {
  return new Promise((resolve, reject) => {
    exec(`g++ ${filepath} -o ${outPath}`, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      } else {
        resolve(stdout);
      }
    });
  });
};

const runCompiledProgram = (outPath) => {
  return new Promise((resolve, reject) => {
    exec(outPath, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      } else {
        resolve(stdout);
      }
    });
  });
};

const executeCpp = async (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  try {
    await compileCpp(filepath, outPath);

    const runResult = await runCompiledProgram(outPath);
    return runResult;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  executeCpp,
};
