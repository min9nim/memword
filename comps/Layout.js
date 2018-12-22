import Head from 'next/head';
import Header from './Header';
import { withRouter } from 'next/router'

import "./Layout.scss";
import app from '../src/app';

const Layout = (props) => {
  app.router = props.router;
  // app.state.menuIdx = app.state.menu.findIndex(m => m.path === app.router.asPath);
  app.auth.init();

  return (
    <div className="index">
      <div>
        <Header />
      </div>
      {props.children}
    </div>
  )
}

export default withRouter(Layout)