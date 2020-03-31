//import Link from 'next/link';
import './Header.scss'
import app from '../src/app'
import Menu from './Menu'
import { withRouter } from 'next/router'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false,
    }
    app.view.Header = this
  }

  showMenu() {
    this.setState({ showMenu: true })
  }

  hideMenu() {
    this.setState({ showMenu: false })
  }

  logoClick() {
    if (app.router.pathname === '/') {
      //app.view.Index.setState({ word: "", result: "" })
      location.href = '/'
    } else {
      app.router.push('/')
    }
  }

  goLogin() {
    //this.props.router.push("/login");
    /**
     * 18.11.11
     * 화면을 뒤집으면서 이동해야 로그인버튼이 나타난다
     */
    location.href = '/login'
  }

  componentDidMount() {
    this._ismounted = true
  }

  componentWillUnmount() {
    this._ismounted = false
  }

  render() {
    // console.log("Header 렌더링..")
    return (
      <div className="upper">
        <div className="wrapper">
          <div className="title">
            <div className="logo" onClick={this.logoClick.bind(this)}>
              Words i didn't know
            </div>
            <div className="slogan">몰랐던 단어는 좀 기억하자!</div>
          </div>
          <div className="login">
            {app.auth.isLogin() ? (
              // "프로필사진+이름"
              <React.Fragment>
                <img className="user-image" src={app.user.image}></img>
                <div className="user-name" onClick={this.showMenu.bind(this)}>
                  <div>{app.user.name}</div>
                  <i className="icon-menu" />
                </div>
              </React.Fragment>
            ) : (
              <div className="login-btn" onClick={this.goLogin.bind(this)}>
                <i className="icon-login" />
                로그인
              </div>
            )}
          </div>
          {this.state.showMenu && (
            <Menu hideMenu={this.hideMenu.bind(this)} newLink={this.newLink} />
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
