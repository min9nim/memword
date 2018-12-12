import $m from "../com/util";
import { deleteWord } from "../src/restful";

import "./Word.scss";
import app from "../src/app";




const remove = async (word, dom) => {
    if (!confirm("삭제합니다")) {
        return;
    }

    // 애니메이션 시작
    //await $m.removeAnimation(dom, 0.2)
    $m.removeAnimation(dom, 0.2)

    // DB 삭제처리
    let json = await deleteWord(word.id);
    if (json.status === "Fail") {
        $m.cancelRemoveAnimation(dom, 0.2)
    } else {
        app.view.Index.setState({ list: app.view.Index.state.list.filter(o => o.id !== word.id) })
    }
}



function mouseenter(dom){
    dom.style.color = "red";
}

function mouseleave(dom){
    dom.style.color = "";
}


class Word extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { word } = this.props;
        return (
            <li ref={el => { this.dom = el }} >
                <div className="word">
                    <div className="value">
                        {word.word} <sup>{word.hit}</sup>
                    </div>

                    <div className="remove" onClick={() => remove(word, this.dom)} onMouseLeave={() => mouseleave(this.dom)}  onMouseEnter={() => mouseenter(this.dom)}>
                        <i className="icon-trash-empty" />
                    </div>

                </div>
            </li>
        )
    }
}


export default Word