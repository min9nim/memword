import { reqWord, reqWords, saveWord, wordList } from "../src/restful";
import app from "../src/app";
// import $m from "../com/util";
import { withRouter } from 'next/router'
import { observable, reaction, decorate } from "mobx";
const R = require("ramda");
import Word from "../comps/Word";
import { Facebook } from 'react-content-loader'
import Layout from "../comps/Layout";

import "./index.scss"

class Index extends React.Component {
    constructor(props) {
        console.log("Index 생성자 호출")
        super(props);

        this.state = {
            word: "",
            result: "",
            loading: false,
            list: this.props.list || []
        }

        app.state.menuIdx = props.menuIdx;

        if (props.user && props.user.id) {
            app.state.userID = props.user.id;
            app.user = props.user;
            global.sessionStorage && global.sessionStorage.setItem("user", JSON.stringify(app.user))
        }


        // 변이를 추적할 상태 지정
        decorate(this, { state: observable });  // or this.state = observable(this.state);

        // 변화에 따른 효과를 정의
        reaction(() => this.state.word, this.resizeInput);

        app.view.Index = this;
        app.router = this.props.router;
    }

    handleChange(e) {
        this.setState({ word: e.target.value })
    }


    resizeInput = () => {
        console.log("resizeInput 호출")
        let ta = this.input;
        ta.style.height = "";

        if (ta.scrollHeight > ta.offsetHeight) {
            ta.style.height = ta.scrollHeight + "px"
        }

        if (this.state.word === "") {
            ta.style.height = "";
        }
    }


    async search() {
        if (this.state.word === "") {
            //alert("단어나 문장을 입력하세요");
            return;
        }

        const getResult = R.ifElse(
            R.pipe(
                R.trim,
                R.split(" "),
                R.length,
                R.gt(R.__, 1)
            ),
            reqWords,
            reqWord
        )

        this.setState({ loading: true });

        R.pipeP(
            getResult,
            ({result}) => {
                this.setState({
                    result,
                    loading: false
                })
            },
        )(this.state.word)

        saveWord(this.state.word);
    }


    shouldComponentUpdate(nextProps, nextState) {
        return R.complement(R.equals)(this.state, nextState)
    }


    static async getInitialProps({ req, asPath }) {
        console.log("Index의 getInitialProps 호출")
        let user = app.getUser(req);
        
        app.user.token = user.token;

        let { list } = await wordList();
        
        app.state.menuIdx = app.state.menu.findIndex(m => m.path === asPath);

        if (req) {
            // 서버에서
        } else {
            // 클라이언트에서
            //app.view.Index.state.list = list;
        }
        return { list, user, menuIdx: app.state.menuIdx}
    }


    componentDidMount() {
        this.input.focus();
    }

    initWord = async () => {
        const { list } = await wordList();
        this.setState({ word: "", result: "", list })
        this.input.focus();
    }

    render() {
        console.log("Index 렌더링")

        const res = this.state.result
            ?
            <React.Fragment>
                <div className="title2">검색 결과</div>
                <div className="result" dangerouslySetInnerHTML={{ __html: this.state.result }}>
                </div>
            </React.Fragment>
            :
            <Facebook />

        const finded = <React.Fragment>
            <div className="title2">{app.state.menu[app.state.menuIdx].label}</div>
            <div className="history">
                <ul>
                    {
                        this.state.list.map(o => <Word key={o.id} word={o} />)
                    }
                </ul>
            </div>
        </React.Fragment>


        return (
            <Layout>
                <div className="lower">
                    <div className="wrapper">
                        <div className="title">
                            단어 및 문장을 검색해 보세요
                        </div>
                        <div className="word">
                            <textarea value={this.state.word} ref={ele => { this.input = ele }} onChange={this.handleChange.bind(this)}></textarea>
                            {this.state.word &&
                                <div className="icon-cancel delete" onClick={this.initWord} />
                            }
                            <button onClick={this.search.bind(this)}>검색</button>
                        </div>
                        <div className="resultWrapper">
                            {
                                this.state.result === "" && !this.state.loading ? finded : res
                            }
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default withRouter(Index)
