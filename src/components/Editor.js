import { render } from "react-dom";
import { split as SplitEditor } from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";


import React from 'react'

const Editor = () => {
  return (
    <div>
  <SplitEditor
    mode="java"
    theme="github"
    splits={2}
    orientation="below"
    value={["hi", "hello"]}
    name="UNIQUE_ID_OF_DIV"
    editorProps={{ $blockScrolling: true }}
  />
    </div>
  )
}

export default Editor