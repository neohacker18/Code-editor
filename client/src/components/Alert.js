import React from "react";

export default function Alert(props) {
  return (
    <div>
    <div className={`alert${props.mode}`} style={{height:'15px'}}>
      {props.alert && (
          <div
          className={`alert alert-success alert-dismissible fade show`}
          role="alert"
          >
        {props.alert.message}
        </div>
      )}
    </div>
      </div>
  );
}
