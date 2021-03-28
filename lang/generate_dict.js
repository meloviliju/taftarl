"use strict";
var get_word = function (dictionary, id) {
    var word = dictionary.words.filter(function (a) { return a.entry.id === id; })[0];
    var html_element_id = "id" + id + "_" + word.entry.form.split(" ").join("_");
    var word_form = "<div><div class=\"word_form\">" + word.entry.form + "</div><div class=\"tags\">" + word.tags.map(function (a) { return '<span class="bordered_info">' + a + '</span>'; }).join("") + "</div><a id=\"permalink_" + html_element_id + "\" href=\"#" + html_element_id + "\" class=\"permalink\">\u00B6</a></div>";
    var translations = "<div class=\"word_infos\">" + word.translations.map(function (t) { return '<p class="word_info"><span class="bordered_info">' + t.title + '</span>' + t.forms.join(", ") + '</p>'; }).join("") + "</div>";
    var contents = word.contents.map(function (_a) {
        var title = _a.title, text = _a.text;
        return '<div class="word_infos"><p class="word_info"><span class="nonbordered_info">' + title + '</span>' + text + '</p></div>';
    }).join("");
    var relations = "<div class=\"word_infos\">" + word.relations.map(function (_a) {
        var title = _a.title, entry = _a.entry;
        return '<p class="word_info">→<span class="bordered_info">' + title + '</span><a href="#id' + entry.id + '_' + entry.form + '">' + entry.form + '</a></p>';
    }).join("") + "</div>";
    return "<div class=\"word\" id=\"" + html_element_id + "\" onmouseover=\"document.getElementById('permalink_" + html_element_id + "').style.visibility = 'visible'\" onmouseout=\"document.getElementById('permalink_" + html_element_id + "').style.visibility = 'hidden'\">" + (word_form + translations + contents + relations) + "</div>";
};
var render = function (dictionary) {
    var _a;
    var _b;
    var urlParams = new URLSearchParams(window.location.search);
    var sortBy = (_b = urlParams.get('sortBy')) === null || _b === void 0 ? void 0 : _b.toLowerCase();
    var ids = dictionary.words.map(function (a) { return a.entry.id; });
    if (sortBy === "random") {
        for (var i = ids.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [ids[j], ids[i]], ids[i] = _a[0], ids[j] = _a[1];
        }
    }
    else if (sortBy === "id") {
        ids = ids.sort(function (a, b) { return a - b; });
    }
    else {
        ids = ids.sort(function (a, b) {
            var w_a = dictionary.words.filter(function (k) { return k.entry.id === a; })[0];
            var w_b = dictionary.words.filter(function (k) { return k.entry.id === b; })[0];
            return w_a.entry.form === w_b.entry.form ? 0 : w_a.entry.form > w_b.entry.form ? 1 : -1;
        });
    }
    document.getElementById("outer").innerHTML = ids.map(function (id) { return get_word(dictionary, id); }).join("");
};
