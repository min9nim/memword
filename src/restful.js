import fetch from 'isomorphic-unfetch';

export async function wordList(){
    let res = await fetch(app.BACKEND + "/api/list", {
        method: "GET"
    })
    return res.json();
}

export async function reqWord(word) {
    let res = await fetch("/api/word/" + word, {
        method: "GET"
    })

    if (res.status === 200) {
        let text = await res.text();
        return text;
    }
}


export async function reqWords(words) {
    let res = await fetch("/api/words/" + words, {
        method: "GET"
    })

    if (res.status === 200) {
        let text = await res.text();
        return text;
    }
}


export async function saveWord(word) {
    let res = await fetch("/api/save", {
        method: "POST",
        body: JSON.stringify({ word }),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if (res.status === 200) {
        return await res.json();
    }
}

export async function deleteWord(id) {
    let res = await fetch("/api/delete/" + id, {
        method: "DELETE"
    })

    if (res.status === 200) {
        return await res.json();
    }
}