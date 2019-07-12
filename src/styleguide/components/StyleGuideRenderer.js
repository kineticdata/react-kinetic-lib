import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'rsg-components/Styled';
import logo from '../../assets/common/images/logo.png';

export function StyleGuideRenderer({
  classes,
  title,
  homepageUrl,
  children,
  toc,
}) {
  return (
    <React.Fragment>
      <nav className={`app-header sticky-top`}>
        <div className="navbar navbar-expand navbar-light">
          <div className="nav-title nav-brand">
            <div className="logo">
              <img src={logo} alt="Kinetic Data logo" style={{ height: 40 }} />
            </div>
            <h2 className="space-title">{title}</h2>
          </div>
          <ul className={`ml-auto navbar-nav mr-4`}>
            <li className="nav-item text-nowrap">
              <a
                className={`nav-link`}
                href="https://kineticdata.github.io/react-kinetic-lib/"
              >
                Github
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <section className="app-body">
        <div className="container-fluid">
          <div className="row flex-sm-nowrap">
            {toc}
            <main
              className={`app-body__main col-xs-9 col-lg-10 py-md-3 pl-md-5`}
            >
              {children}
            </main>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

StyleGuideRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  homepageUrl: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Styled(() => {})(StyleGuideRenderer);
