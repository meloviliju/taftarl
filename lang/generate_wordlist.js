"use strict";
var get_word_for_list = function (dictionary, id, word_class) {
    var word = dictionary.words.filter(function (a) { return a.entry.id === id; })[0];
    var html_element_id = "id" + id + "_" + word.entry.form.split(" ").join("_");
    var word_form = "<td>" + id + "</td><td><a href=\"./dict.html#" + html_element_id + "\">" + word.entry.form + "</a></td>";
    var translations = word_class == "全単語" ? "<td class=\"meaning\">" + word.translations.map(function (t) { return t.forms.join(", "); }).join("、") + "</td>" : "<td class=\"meaning\">" + word.translations.filter(function (t) { return t.title == word_class; }).map(function (t) { return t.forms.join(", "); }).join("、") + "</td>";
    return translations == '<td class="meaning"></td>' ? "" : "<tr>" + word_form + translations + "</tr>";
};
var word_count = function (word_class_id) {
    return document.getElementById(word_class_id).children[1].childElementCount;
};
var render_for_list = function (dictionary) {
    var word_classes = ["全単語", "名詞", "代名詞", "動詞", "形容詞", "助辞"];
    var word_classes_id = { "全単語": "all", "名詞": "noun", "代名詞": "pronoun", "動詞": "verb", "形容詞": "modifier", "助辞": "particle" };
    var ids = dictionary.words.map(function (a) { return a.entry.id; });
    var _loop_1 = function (i) {
        var word_class = word_classes[i];
        var word_class_id = word_classes_id[word_class];
        document.getElementById(word_class_id).innerHTML += ids.map(function (id) { return get_word_for_list(dictionary, id, word_class); }).join("");
        document.getElementById(word_class_id + "_summary").innerHTML += "\u3000" + word_count(word_class_id) + "\u8A9E";
    };
    for (var i = 0; i < word_classes.length; i++) {
        _loop_1(i);
    }
};
