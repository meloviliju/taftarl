"use strict";
const get_word_for_list = (dictionary, id, word_class) => {
    const [word] = dictionary.words.filter(a => a.entry.id === id);
    const html_element_id = `id${id}_${word.entry.form.split(" ").join("_")}`;
    const word_form = `<td>${id}</td><td><a href="./dict.html#${html_element_id}">${word.entry.form}</a></td>`;
    const translations = word_class == "全単語" ? `<td class="meaning">${word.translations.map(t => t.forms.join(", ")).join("；")}</td>` : `<td class="meaning">${word.translations.filter(t => t.title == word_class).map(t => t.forms.join(", ")).join("、")}</td>`;
    return translations == '<td class="meaning"></td>' ? "" : `<tr>${word_form}${translations}</tr>`;
};
const word_count = (word_class_id) => {
    return document.getElementById(word_class_id).children[1].childElementCount;
};
const render_for_list = (dictionary) => {
    const word_classes = ["全単語", "名詞", "代名詞", "動詞", "形容詞", "助辞"];
    const word_classes_id = { "全単語": "all", "名詞": "noun", "代名詞": "pronoun", "動詞": "verb", "形容詞": "modifier", "助辞": "particle" };
    let ids = dictionary.words.map(a => a.entry.id);
    for (let i = 0; i < word_classes.length; i++) {
        const word_class = word_classes[i];
        const word_class_id = word_classes_id[word_class];
        document.getElementById(word_class_id).innerHTML += ids.map(id => get_word_for_list(dictionary, id, word_class)).join("");
        document.getElementById(`${word_class_id}_summary`).innerHTML += `　${word_count(word_class_id)}語`;
    }
};
