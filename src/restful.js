import fetch from 'isomorphic-unfetch';


const req = async (path, method, body) => {
    try {
        // global.NProgress && global.NProgress.start();
        //console.log("@@@@ fetch 호출전 path = " + path)
        let opt = {
            method,
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": app.user.token
            }
        };

        //console.log("@@@@ fetch 호출전 app.user.token = " + JSON.stringify(opt, null, 2))
        console.log("url = " + app.BACKEND + path)
        let res = await fetch(app.BACKEND + path, opt)
        // global.NProgress && global.NProgress.done();
        
        if (res.status === 200) {
            let json = await res.json();
            if (json.status === "Fail") {
                console.log(json.message)
            }
            return json;
        } else {
            throw new Error(path + " : " + "status[" + res.status + "]");
        }
    } catch (e) {
        //console.error(e);
        throw e;
        //global.alert && global.alert(e.message);
    }
};


export async function wordList() {
    return await req("/api/list", "GET")
}

export async function reqWord(word) {
    return await req("/api/word/" + word, "GET")
}


export async function reqWords(words) {
    return await req("/api/words/" + words, "GET")

}


export async function saveWord(word) {
    // let res = await fetch("/api/save", {
    //     method: "POST",
    //     body: JSON.stringify({ word }),
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // })

    let res = await req("/api/save", "POST", { word });

    if (res.status === 200) {
        return await res.json();
    }
}

export async function deleteWord(id) {
    // let res = await fetch("/api/delete/" + id, {
    //     method: "DELETE"
    // })

    let res = await req("/api/delete/" + id, "DELETE")

    if (res.status === 200) {
        return await res.json();
    }
}

// 로그인처리
export async function login() {
    let json = await req("/api/login", "POST")
    return json;
}
