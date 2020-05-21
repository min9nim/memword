import { reqWord, reqWords, saveWord, wordList } from '../src/restful'
import app from '../src/app'
import { withRouter } from 'next/router'
// import { observable, reaction, decorate } from 'mobx'
import {
  pipe,
  trim,
  split,
  length,
  gt,
  __,
  ifElse,
  pipeP,
  complement,
  toLower,
  identity,
  equals,
} from 'ramda'
import Word from '../comps/Word'
import { Facebook } from 'react-content-loader'
import Layout from '../comps/Layout'

import './index.scss'

class Index extends React.Component {
  constructor(props) {
    console.log('Index 생성자 호출')
    super(props)

    this.state = {
      word: '',
      result: '',
      loading: false,
      list: this.props.list || [],
    }

    app.state.menuIdx = props.menuIdx

    if (props.user && props.user.id) {
      app.state.userID = props.user.id
      app.user = props.user
      global.sessionStorage &&
        global.sessionStorage.setItem('user', JSON.stringify(app.user))
    }

    // // 변이를 추적할 상태 지정
    // decorate(this, { state: observable }) // or this.state = observable(this.state);

    // // 변화에 따른 효과를 정의
    // reaction(() => this.state.word, this.resizeInput)

    app.view.Index = this
    app.router = this.props.router
  }

  handleChange(e) {
    this.setState({ word: e.target.value })
    this.resizeInput()
  }

  resizeInput = () => {
    console.log('resizeInput 호출')
    let ta = this.input
    ta.style.height = ''

    if (ta.scrollHeight > ta.offsetHeight) {
      ta.style.height = ta.scrollHeight + 'px'
    }

    if (this.state.word === '') {
      ta.style.height = ''
    }
  }

  goList() {
    // this.props.router.push('/')
    this.initWord()
  }

  async search() {
    if (!this.state.word) {
      try {
        const text = await navigator.clipboard.readText()
        console.log('Pasted content: ', text)
        this.setState({ word: text })
      } catch (e) {
        console.error('Failed to read clipboard contents: ', e)
      }
      if (!this.state.word) {
        alert('검색할 단어를 입력하세요')
        return
      }
    }
    if (this.state.word.includes(' ')) {
      alert('단어 사이 공백을 제거해 주세요')
      return
    }
    const isSentence = pipe(trim, split(' '), length, gt(__, 1))

    const getResult = ifElse(isSentence, reqWords, reqWord)

    this.setState({ loading: true })

    pipeP(getResult, ({ result }) => {
      this.setState({
        result,
        loading: false,
      })
    })(this.state.word)

    pipe(
      ifElse(complement(isSentence), toLower, identity),
      saveWord,
    )(this.state.word)

    // saveWord(this.state.word);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return complement(equals)(this.state, nextState)
  }

  static async getInitialProps(ctx) {
    const { req, res, pathname, query, asPath, AppTree } = ctx
    app.logger.verbose('Index의 getInitialProps 호출')

    let user = app.getUser(req)
    app.user.token = user.token
    app.state.menuIdx = app.state.menu.findIndex((m) => m.path === pathname)
    let { list } = await wordList()

    return { list, user, menuIdx: app.state.menuIdx }
  }

  async componentDidMount() {
    this.input.focus()
    const { word } = this.props.router.query
    if (word) {
      this.setState({ word })
      this.setState({ loading: true })
      const { result } = await reqWord(word)
      this.setState({
        result,
        loading: false,
      })
    }
  }

  initWord = async () => {
    const { list } = await wordList()
    this.setState({ word: '', result: '', list })
    this.input.focus()
  }

  render() {
    console.log('Index 렌더링')

    const res = this.state.result ? (
      <React.Fragment>
        <div className="title2">검색 결과</div>
        <div
          className="result"
          dangerouslySetInnerHTML={{ __html: this.state.result }}
        ></div>
        <div className="list-btn">
          <button onClick={this.goList.bind(this)}>목록으로 이동</button>
        </div>
      </React.Fragment>
    ) : (
      <Facebook />
    )

    const finded = (
      <React.Fragment>
        <div className="title2">
          {app.auth.isLogin()
            ? app.state.menu[app.state.menuIdx].label
            : '로그인이 필요합니다 '}
        </div>
        <div className="history">
          <ul>
            {this.state.list.map((o) => (
              <Word key={o.id} word={o} />
            ))}
          </ul>
        </div>
      </React.Fragment>
    )

    return (
      <Layout>
        <div className="lower">
          <div className="wrapper">
            <div className="title">단어를 검색해 보세요</div>
            <div className="word">
              <textarea
                value={this.state.word}
                ref={(ele) => {
                  this.input = ele
                }}
                onChange={this.handleChange.bind(this)}
              ></textarea>
              {this.state.word && (
                <div className="icon-cancel delete" onClick={this.initWord} />
              )}
              <button onClick={this.search.bind(this)}>검색</button>
            </div>
            <div className="resultWrapper">
              {this.state.result === '' && !this.state.loading ? finded : res}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default withRouter(Index)
