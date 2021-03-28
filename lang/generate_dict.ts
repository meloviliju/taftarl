type Dictionary = {
    readonly words: {
        readonly entry: {
            readonly id: number,
            readonly form: string
        },
        readonly translations: {
            readonly title: string,
            readonly forms: string[]
        }[],
        readonly tags: string[],
        readonly contents: {
            readonly title: string,
            readonly text: string
        }[],
        readonly variations: unknown[],
        readonly relations: {
            readonly title: string,
            readonly entry: {
                readonly id: number,
                readonly form: string
            }
        }[]
    }[]
}

const get_word = (dictionary: Dictionary, id: number) => {
    const [word] = dictionary.words.filter(a => a.entry.id === id);

    const html_element_id = `id${id}_${word.entry.form.split(" ").join("_")}`;

    const word_form = `<div><div class="word_form">${word.entry.form}</div><div class="tags">${word.tags.map(a => '<span class="bordered_info">' + a + '</span>').join("")
        }</div><a id="permalink_${html_element_id}" href="#${html_element_id}" class="permalink">¶</a></div>`;
    
    const translations = `<div class="word_infos">${word.translations.map(t => '<p class="word_info"><span class="bordered_info">' + t.title + '</span>' + t.forms.join(", ") + '</p>').join("")}</div>`;
    
    const contents = word.contents.map(({ title, text }) => '<div class="word_infos"><p class="word_info"><span class="nonbordered_info">' + title + '</span>' + text + '</p></div>').join("");

    const relations = `<div class="word_infos">${word.relations.map(({ title, entry}) => '<p class="word_info">→<span class="bordered_info">' + title + '</span><a href="#id' + entry.id + '_' + entry.form + '">' + entry.form + '</a></p>').join("")}</div>`;

    return `<div class="word" id="${html_element_id}" onmouseover="document.getElementById('permalink_${html_element_id}').style.visibility = 'visible'" onmouseout="document.getElementById('permalink_${html_element_id}').style.visibility = 'hidden'">${word_form + translations + contents + relations}</div>`;
}

const render = (dictionary: Dictionary) => {
    const urlParams = new URLSearchParams(window.location.search);
    const sortBy = urlParams.get('sortBy')?.toLowerCase();

    let ids = dictionary.words.map(a => a.entry.id);

    if (sortBy === "random") {
        for (let i = ids.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ids[i], ids[j]] = [ids[j], ids[i]];
        }
    } else if (sortBy === "id") {
        ids = ids.sort((a, b) => a - b);
    } else {
        ids = ids.sort((a, b) => {
            const [w_a] = dictionary.words.filter(k => k.entry.id === a);
            const [w_b] = dictionary.words.filter(k => k.entry.id === b);
            return w_a.entry.form === w_b.entry.form ? 0 : w_a.entry.form > w_b.entry.form ? 1 : -1;
        })
    } 
    document.getElementById("outer")!.innerHTML = ids.map(id => get_word(dictionary, id)).join("");
}