"use strict";
const hs = document.querySelectorAll("H2, H3, H4");
var index = "";
var id = 0;
var id_sub = 0;
var id_sub_sub = 0;

function anchor(element, id, id_sub, id_sub_sub) {
    return `<a href="#${element.id}">${id}.${id_sub===0?"":`${id_sub}.`}${id_sub_sub===0?"":`${id_sub_sub}.`} ${element.innerText}</a>`
}

for (let i = 0; i < hs.length; i++) {
    switch (hs[i].tagName) {
        case "H2": id++; id_sub = 0; id_sub_sub = 0; index += `${anchor(hs[i], id, id_sub, id_sub_sub)}<br>`; break;
        case "H3": id_sub++; id_sub_sub = 0; index += `<div class="indent">${anchor(hs[i], id, id_sub, id_sub_sub)}</div>`; break;
        case "H4": id_sub_sub++; index += `<div class="double-indent">${anchor(hs[i], id, id_sub, id_sub_sub)}</div>`; break;
    }
}
document.getElementById("index").innerHTML += index;