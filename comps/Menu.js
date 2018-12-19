import { withRouter } from 'next/router'
import app from "../src/app";
import "./Menu.scss";

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menu : app.state.menu
        }

        global.document.onclick = (e) => {
            let clickMenu = [e.target.className]

            if (e.target.parentNode) {
                clickMenu.push(e.target.parentNode.className);
                if (e.target.parentNode.parentNode) {
                    clickMenu.push(e.target.parentNode.parentNode.className);
                }
            }

            if (!clickMenu.includes("menu")) {
                props.hideMenu();
            }
        }

        app.view.Menu = this;
    }

    logout = async () => {
        await app.auth.signOut();
        this.props.hideMenu();
    }

    componentWillUnmount() {
        global.document.onclick = undefined;
    }

    selectMenu(idx) {
        return async (e) => {
            app.state.menuIdx = idx;
            app.router.push(app.state.menu[idx].path);
            //app.state.totalCount = "?";
            //app.state.isScrollLast = false;
            let fetchRes = await app.api.wordList({menuIdx: idx});

            this.props.hideMenu();
        }
    }

    render() {
        return (
            <div className="menu">
                <div className="user-info">
                    <img className="user-image" src={app.user.image}></img>
                    <div className="user-name">{app.user.name}</div>
                </div>
                <div className="item">
                    {
                        this.state.menu.map((m, idx) => {
                            return (
                                <div key={idx} onClick={this.selectMenu(idx)}>{m.label}</div>
                            )
                        })
                    }
                </div>
                <div className="item2">
                    {/* <div onClick={this.props.newLink}>등록하기</div> */}
                    <div onClick={this.logout}>로그아웃</div>
                </div>
            </div>
        )

    }
}



export default withRouter(Menu);