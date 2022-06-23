import React from 'react'
import PropTypes from 'prop-types'

export default function Navbar(props) {
  const setDefaultTheme = () => {
    localStorage.setItem("default-theme", props.mode);
    console.log(`${props.mode} set as default!`);
  };
  return (
    <nav className={`navbar navbar-expand-lg  nav-${props.mode}`}>
    <div className="container-fluid">
    <a className="navbar-brand" href="/">better-ide<span className='com'>.com</span></a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        </ul>
        <div className={`form-check form-switch text-${props.mode==='light'?'dark':'light'}`}>
        <input className="form-check-input" onClick={props.toggleMode} type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault" onClick={setDefaultTheme}>{props.mode==='light'?'Enable':'Disable'} Dark Mode</label>
        </div>
      </div>
    </div>
  </nav>
  )
}
Navbar.defaultProps = {
    aboutText: 'About'
  };
Navbar.propTypes={aboutText: PropTypes.string};