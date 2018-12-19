
export function _findLink(links, linkID) {
    let link;
    for (let l of links) {
        if (l.id === linkID) {
            link = l;
        } else {
            for (let l2 of l.refLinks) {
                if (l2.id === linkID) {
                    link = l2;
                    break;
                }
            }
        }
        if (link) break;
    }

    return link;
}

export function _getHostname(url){
    let start = url.indexOf("://") + 3;
    let end = url.indexOf("/", start)
    return url.slice(start, end);
}

export function isExpired(exp){
    let month = 1000 * 60 * 60 * 24 * 30;
    return Date.now() > exp + month;  // 만료시간을 임의로 한달 연장
}

//global._findLink = _findLink;