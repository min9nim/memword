import { reqWord, reqWords, saveWord, wordList } from "../src/restful";
import app from "../src/app";
import $m from "../com/util";
import { withRouter } from 'next/router'
const R = require("ramda");
global.R = R;

import fetch from 'isomorphic-unfetch';
import Word from "../comps/Word";



import "./index.scss"

class Index extends React.Component {
    constructor(props) {
        console.log("Index 생성자 호출")
        super(props);

        this.state = {
            word: "",
            result: "",
            list: this.props.list
        }

        app.view.Index = this;
        app.router = this.props.router;
    }

    handleChange(e) {
        this.setState({ word: e.target.value }, this.resizeInput)
    }


    resizeInput = () => {
        let ta = this.input;

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


        // if (this.state.word.trim().split(" ").length > 1) {
        //     result = await reqWords(this.state.word);
        // } else {
        //     result = await reqWord(this.state.word);
        // }

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

        // $m._pipe(
        //     getResult,
        //     $m._trace("after getReuslt"),
        //     (res) => {debugger; return res;},
        //     R.prop("then")(result => {
        //         this.setState({ result });
        //     })

        // )(this.state.word)

        getResult(this.state.word).then(result => {
            this.setState({ result });
        })

        saveWord(this.state.word);
    }

    logoClick() {
        //location.href = "/"

        this.setState({ word: "", result: "" }, () => {
            app.router.push("/");
        })
    }


    static async getInitialProps({ req, asPath }) {
        console.log("Index의 getInitialProps 호출")
        let { list } = await wordList();
        if (req) {
            // 서버에서
        } else {
            // 클라이언트에서
            app.view.Index.state.list = list;
        }
        return { list }
    }


    componentDidMount() {
        this.input.focus();
    }

    initWord = () => {
        this.setState({ word: "", result: "" }, this.resizeInput)
    }


    render() {
        console.log("Index 렌더링")
        return (
            <div className="index">
                <div className="upper">
                    <div className="wrapper">
                        <div className="logo" onClick={this.logoClick.bind(this)}>memword</div>
                        <div className="slogan">한번 몰랐던 영단어 두번 모르지 말자!</div>
                    </div>
                </div>
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
                        {
                            this.state.result
                                ?
                                <React.Fragment>
                                    <div className="title2">검색 결과</div>
                                    <div className="result" dangerouslySetInnerHTML={{ __html: this.state.result }}>
                                    </div>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <div className="title2">내가 찾아본 단어</div>
                                    <div className="history">
                                        <ul>
                                            {
                                                this.state.list.map(o => <Word key={o.id} word={o} />)
                                            }
                                        </ul>
                                    </div>
                                </React.Fragment>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Index)
