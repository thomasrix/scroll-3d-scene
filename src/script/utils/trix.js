const IE = isIE();
export function create (type, parent, classname){
    // Genbruges til at bygge elementer i DOM strukturen
    var el = document.createElement(type);
    if(classname != undefined){
        if(classname.constructor === Array){
            classname.forEach(function(item){
                el.classList.add(item);
            })
        }else if (classname.constructor === String){
            el.classList.add(classname);
        }
    }
    if(parent){
        parent.appendChild(el);
    }
    return el;
};
export function select (s, e = document){
    // Shortcut to select dom elements
    return e.querySelector(s);
};
export function selectAll (s, e = document){
    // Shortcut to select dom elements
    return e.querySelectorAll(s);
}
export function replaceLineBreaks(t){
    t = t.replace(/<h>/g, '<div class="inline-header">');
    t = t.replace(/<\/h>/g, '</div>');
    return t.replace(/(?:\r\n|\r|\n)/g, ' <br/> ');
};
export function throttleEvents(listener, delay) {
    var timeout;
    var throttledListener = function(e) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(listener, delay, e);
    }
    return throttledListener;
};
export function addNodeListForEach(nodelist){
    if(window.NodeList && !NodeList.prototype.forEach){
        nodelist.forEach = function(callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };

    }
};
export function fetchJSON(url){
    function handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
    let f = fetch(url)
        .catch(err => {
            return Promise.reject('URL REJECTED');
        })
        .then(handleErrors)
        .then((response) => {
            // console.log('load ok')
            return response.json();
        })
        .then( json => {
            return Promise.resolve(json);
        })
        .catch(error => console.log('There is an error:', error));
    return f;
}
export function blurText(element, amount = 0){
    // console.log(IE, amount);
    if (IE){
        element.style.color = 'transparent';
        element.style.textShadow = `0px 0px ${amount * 2}px #FFFFFF`;
    }else{
        element.style.filter = `blur(${amount}px)`;
    }
}
export function isIE() {
    const ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
    const msie = ua.indexOf('MSIE '); // IE 10 or older
    const trident = ua.indexOf('Trident/'); //IE 11

    return (msie > 0 || trident > 0);
}