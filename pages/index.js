import { reqWord, reqWords, saveWord } from "../src/restful";
import app from "../src/app";
import { withRouter } from 'next/router'

import fetch from 'isomorphic-unfetch';
import Word from "../comps/Word";



import "./index.scss"

class Index extends React.Component {
    constructor(props) {
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
        this.setState({ word: e.target.value })
        let ta = e.target;

        if (ta.scrollHeight > ta.offsetHeight) {
            ta.style.height = ta.scrollHeight + "px"
        }
    }


    async search() {
        if (this.state.word === "") {
            //alert("단어나 문장을 입력하세요");
            return;
        }
        let result;
        if (this.state.word.trim().split(" ").length > 1) {
            result = await reqWords(this.state.word);
        } else {
            result = await reqWord(this.state.word);
        }
        this.setState({ result });

        saveWord(this.state.word);

    }

    logoClick(){
        // location.href = "/"
        //app.router.push("/");
        this.setState({word: "", result: ""})
    }


    static async getInitialProps({ req, asPath }) {
        let res = await fetch(app.BACKEND + "/api/list", {
            method: "GET"
        })
        return await res.json();
    }


    componentDidMount() {
        this.input.focus();
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
