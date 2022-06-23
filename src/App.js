import "./App.css";
import React,{useState} from "react";
import Nav from './components/Nav'
import Editor from './components/Editor'
import Alert from "./components/Alert";

export default function App() {
  const [alert,setAlert]=useState(null)
  const [mode, setMode] = useState('light'); //whether dark mode is enabled or not
  
  const showAlert=(message,type)=>{
    setAlert({
      message:message,
      type:type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1800);
  }
  const toggleMode=()=>{
    if(mode==='light')
    {
      setMode('dark');
      document.body.style.backgroundColor='rgb(33 53 72)';
      showAlert("Dark Mode has been enabled","success");
    }
    else
    {
      setMode('light');
      document.body.style.backgroundColor='white';
      showAlert("Dark Mode has been disabled","success");
    }
  }
  return (
    <div className={`hero${mode}`}>
    <Nav mode={mode} toggleMode={toggleMode}/>
    <Alert alert={alert} mode={mode}/>
    <Editor showAlert={showAlert} mode={mode}/>
    </div>
  );
}
