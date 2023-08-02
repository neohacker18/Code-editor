import React,{useState,useEffect} from "react";
import { split as SplitEditor } from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-twilight";
import axios from "axios";
import moment from "moment";

const Editor = (props) => {
    const [font_size,setFontSize]=useState("18px")
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("cpp");
    const [jobId, setJobId] = useState(null);
    const [status, setStatus] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);
    const [theme,setTheme]=useState("terminal")
    useEffect(() => {
      const defaultLang = localStorage.getItem("default-language") || "cpp";
      setLanguage(defaultLang);
    }, []);
    // console.log(jobId)
    let pollInterval;
    const handleSubmit = async () => {
      const payload = {
        language,
        code,
      };
      try {
        setOutput("");
        setStatus(null);
        setJobId(null);
        setJobDetails(null);
        const {data}  = await axios.post(`http://localhost:80/run`, payload)
        if (data.jobId) {
          setJobId(data.jobId);
          setStatus("Processing");

          pollInterval = setInterval(async () => {
            const { data: statusRes } = await axios.get(
              `http://localhost:80/status`,
              {
                params: {
                  id: data.jobId,
                },
              }
            )
            const { success, job, error } = statusRes;
            if (success) {
              const { status: jobStatus, output: jobOutput } = job;
              setStatus(jobStatus);
              setJobDetails(job);
              if (jobStatus === "pending") return;
              if(jobStatus==='error'){
                setOutput('There are some errors in your code. Please rectify and try again later.');
                clearInterval(pollInterval);
                return;
              }
              setOutput(jobOutput);
              clearInterval(pollInterval);
            } else {
              console.error(error);
              setOutput(error);
              setStatus("Bad request");
              clearInterval(pollInterval);
            }
          }, 1000);
        } else {
          setOutput("Retry again.");
        }
      } catch ({ response }) {
        if (response) {
          const errMsg = response.data.err.stderr;
          setOutput("Error: "+ errMsg);
        } else {
          setOutput("Please retry submitting.");
        }
      }
    };
    const setDefaultLanguage = () => {
      localStorage.setItem("default-language", language);
      props.showAlert(`${language} set as default!`);
    };
   
  // console.log(status)
    const renderTimeDetails = () => {
      if (!jobDetails) {
        return "";
      }
      let { submittedAt, startedAt, completedAt } = jobDetails;
      let result = "";
      submittedAt = moment(submittedAt).toString();
      result += `Job Submitted At: ${submittedAt}  `;
      if (!startedAt || !completedAt) return result;
      const start = moment(startedAt);
      const end = moment(completedAt);
      const diff = end.diff(start, "seconds", true);
      result += `Execution Time: ${diff}s`;
      return result;
    };

    return (
    <div className={`hero${props.mode}`}>
      <div className="container">
        <br />
          <div className="d-flex align-items-center">
  <div className="p-2"><select className="btn btn-sm btn-dark"
          value={language}
          onChange={(e) => {
              setLanguage(e.target.value);
              props.showAlert("Language changed successfully!","success");
            }}
            >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
     </div>
  <div className="p-2">
        <button className="btn btn-sm btn-dark" onClick={setDefaultLanguage}>Set Default</button>
  </div>
  <div className="p-2">
        <select className="btn btn-sm btn-dark" value={theme}
        onChange={(e) => {
            setTheme(e.target.value);
            props.showAlert("Theme changed successfully!","success");
          }}>
            <option value="terminal">Terminal</option>
            <option value="github">Github</option>
            <option value="solarized dark">Solarized_dark</option>
            <option value="solarized light">Solarized_light</option>
            <option value="twilight">Twilight</option>
        </select>
  </div>
  <div className="p-2">
        <select className="btn btn-sm btn-dark" value={font_size}
        onChange={(e) => {
            setFontSize(e.target.value);
            props.showAlert("Font-Size changed successfully!","success");
          }}>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="22px">22px</option>
            <option value="24px">24px</option>
        </select>
  </div>
      </div>
  <SplitEditor
  name="UNIQUE_ID_OF_DIV"
  mode={language==='py'?'python':'c_cpp'}
  theme={theme}
  splits={1}
  orientation="beside"
  defaultValue={["Hello world!"]}
  value={code}
  width="85%"
  editorProps={{ $blockScrolling: true }}
  fontSize={font_size}
  onChange={(value)=>{setCode(value)}}
  />
  <br />
      <button className="btn submitButton"onClick={handleSubmit}>Submit</button>
      <div>
      <br />
        {status!=='success' && status && <button className="btn btn-warning" type="button" disabled>
  {status!=='error' && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
  <span> {status==='error'?"Error!":status==='pending'?"Pending":status}</span>
</button>}
  {(status==='success' || status==='error') &&<div className={`outputContainer${status}`}>
    <h5 style={{fontSize:'1.2rem'}}>Output:</h5>
    <p>{output}</p>
    <p>{'Execution'+renderTimeDetails().split('Execution')[1]}</p>
    <p>{renderTimeDetails().split('Execution')[0]}</p>
</div>}
      </div>
    </div>
  </div>
  );
}
  export default Editor
  