const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path")
require("dotenv").config();

const CONNECTION_URL=process.env.MONGODB_URI
const PORT =process.env.PORT || 80;

const { generateFile } = require("./generateFile");

const { addJobToQueue } = require("./jobQueue");
const Job = require("./models/Job");

const app = express();

mongoose.connect(
  CONNECTION_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    err && console.error(err);
    console.log("Successfully connected to MongoDB");
  }
);


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname,"build")))

// app.get('*',(req,res)=>{
//   res.sendFile(path.join(__dirname,"build","index.html"))
// })

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  console.log(language, "Length:", code?code.length:0);
  console.log(code)
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  const {filepath,message} = await generateFile(language, code[0]);
  const job = await new Job({ language, filepath }).save();
  console.log(job)
  const jobId = job["_id"];
  addJobToQueue(jobId)
  return res.status(201).json({ jobId});
});


app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  if (jobId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" });
    }
    
    const job = await Job.findById(jobId);
    if (job === undefined) {
      return res.status(400).json({ success: false, error: "couldn't find job" });
    }
    
    return res.status(201).json({ success: true, job });
  });
  
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});