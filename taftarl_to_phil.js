"use strict";
const phil_rout = document.getElementById("phil_rout");
const phil_stujesn = document.getElementById("phil_stujesn");
const phil_snenik = document.getElementById("phil_snenik");
const phil_liestu = document.getElementById("phil_liestu");
const phil_rukest = document.getElementById("phil_rukest");
const phil_stususn = document.getElementById("phil_stususn");
const taftarl_cyrl = document.getElementById("taftarl_cyrl");
const taftarl_forl = document.getElementById("taftarl_forl");
const taftarl_is_leap = document.getElementById("is_leap");
const alqday = 107587.909944;
const faikday = 108000;
const faikliestu = 4500;
const faikrukest = 125;
const compensatory_stususn = 1445;
const seven_years_day = 2882;
const year_seq = [411, 412, 412, 411, 412, 412, 412];
const stususn_analyser = (delta) => {
    if (delta < 0)
        throw new Error("delta is needed to be positive or 0");
    let remaining_delta = delta;
    const ret = {
        "liestu": 0,
        "rukest": 0,
        "stususn": 0,
    };
    ret["liestu"] = Math.floor(remaining_delta / faikliestu);
    remaining_delta = remaining_delta % faikliestu;
    ret["rukest"] = Math.floor(remaining_delta / faikrukest);
    remaining_delta = remaining_delta % faikrukest;
    ret["stususn"] = remaining_delta;
    return ret;
};
const taftarl_to_philifiar = () => {
    const cyrl = Number(taftarl_cyrl.value);
    const { rout, stujesn, snenik, liestu, rukest, stususn } = taf_to_phil(Number(taftarl_cyrl.value), Number(taftarl_forl.value));
    phil_rout.value = rout;
    phil_stujesn.value = stujesn;
    phil_snenik.value = snenik;
    phil_liestu.value = liestu;
    phil_rukest.value = rukest;
    phil_stususn.value = stususn.toPrecision(10);
    taftarl_is_leap.innerHTML = (((cyrl % 7) + 7) % 7 === 1 || ((cyrl % 7) + 7) % 7 === 5) ? "-" : "+";
};
const philifiar_to_taftarl = () => {
    const { cyrl, forl } = phil_to_taf(Number(phil_rout.value), Number(phil_stujesn.value), Number(phil_snenik.value), Number(phil_liestu.value), Number(phil_rukest.value), Number(phil_stususn.value));
    taftarl_cyrl.value = cyrl;
    taftarl_forl.value = forl.toPrecision(10);
    taftarl_is_leap.innerHTML = (((cyrl % 7) + 7) % 7 === 1 || ((cyrl % 7) + 7) % 7 === 5) ? "-" : "+";
};
const calc_forl_delta = (c, f) => {
    let ret_delta = f - 1;
    let year = 0;
    if (c >= 1090) {
        year = (c - 1090) - Math.floor((c - 1090) / 7) * 7;
        ret_delta += Math.floor((c - 1090) / 7) * seven_years_day;
        for (let i = 0; i < year; i++) {
            ret_delta += year_seq[i];
        }
    }
    else {
        year = (1090 - c) - Math.floor((1090 - c) / 7) * 7;
        ret_delta -= Math.floor((1090 - c) / 7) * seven_years_day;
        for (let i = 0; i < year; i++) {
            ret_delta -= year_seq[6 - i];
        }
    }
    return ret_delta;
};
const taf_to_phil = (cyrl, forl) => {
    const ret_phil = {
        "rout": 0,
        "stujesn": 0,
        "snenik": 0,
        "liestu": 0,
        "rukest": 0,
        "stususn": 0
    };
    const forl_delta = calc_forl_delta(cyrl, forl);
    const stususn_delta = forl_delta * alqday + compensatory_stususn;
    console.log(`stususn_delta: ${stususn_delta}`);
    if (stususn_delta >= 0) {
        let days = Math.floor(stususn_delta / faikday);
        let remaining_delta = stususn_delta - days * faikday;
        ret_phil["rout"] = 2016 + Math.floor(days / 365);
        days -= Math.floor(days / 365) * 365;
        ret_phil["stujesn"] = (days < 30 * 11) ? 1 + Math.floor(days / 30) : 12;
        days -= ((days < 30 * 11) ? Math.floor(days / 30) : 11) * 30;
        ret_phil["snenik"] = 1 + days;
        const { liestu, rukest, stususn } = stususn_analyser(remaining_delta);
        ret_phil["liestu"] = liestu;
        ret_phil["rukest"] = rukest;
        ret_phil["stususn"] = stususn;
    }
    else {
        let days = Math.ceil(stususn_delta / faikday);
        let remaining_delta = stususn_delta - days * faikday;
        ret_phil["rout"] = 2015 + Math.ceil(days / 365);
        days -= Math.ceil(days / 365) * 365 - 364;
        ret_phil["stujesn"] = (days < 330) ? 1 + Math.floor(days / 30) : 12;
        days -= ((days < 330) ? Math.floor(days / 30) : 11) * 30;
        ret_phil["snenik"] = 1 + days;
        const { liestu, rukest, stususn } = stususn_analyser(remaining_delta + faikday);
        ret_phil["liestu"] = liestu;
        ret_phil["rukest"] = rukest;
        ret_phil["stususn"] = stususn;
    }
    return ret_phil;
};
const calc_stususn_delta = (rout, stujesn, snenik, liestu, rukest, stususn) => {
    if (rout >= 2016) {
        return ((rout - 2016) * 365 + (stujesn - 1) * 30 + (snenik - 1)) * 108000
            + liestu * 4500 + rukest * 125 + stususn
            - compensatory_stususn;
    }
    else {
        return ((rout - 2015) * 365 + (stujesn - 12) * 30 + (snenik - 35)) * 108000
            + (liestu - 23) * 4500 + (rukest - 35) * 125 + (stususn - 125)
            - compensatory_stususn;
    }
};
const phil_to_taf = (rout, stujesn, snenik, liestu, rukest, stususn) => {
    const ret_taf = {
        "cyrl": 0,
        "forl": 0
    };
    const stususn_delta = calc_stususn_delta(rout, stujesn, snenik, liestu, rukest, stususn);
    console.log(`stususn_delta: ${stususn_delta}`);
    if (stususn_delta >= 0) {
        let year = Math.floor(stususn_delta / (alqday * seven_years_day)) * 7;
        let remaining_delta = stususn_delta - (alqday * seven_years_day) * year / 7;
        for (let i = 0; i < 7; i++) {
            if (remaining_delta - alqday * year_seq[i] >= 0) {
                remaining_delta -= alqday * year_seq[i];
                year += 1;
            }
            else {
                break;
            }
        }
        const day = remaining_delta / alqday;
        ret_taf["cyrl"] = 1090 + year;
        ret_taf["forl"] = 1 + day;
    }
    else {
        let year = Math.ceil(stususn_delta / (alqday * seven_years_day)) * 7;
        let remaining_delta = stususn_delta - (alqday * seven_years_day) * year / 7;
        for (let i = 0; i < 7; i++) {
            if (remaining_delta + alqday * year_seq[6 - i] <= 0) {
                remaining_delta += alqday * year_seq[6 - i];
                year -= 1;
            }
            else {
                break;
            }
        }
        if (remaining_delta < 0)
            year -= 1;
        const day = (((year % 7) + 7) % 7 === 0 || ((year % 7) + 7) % 7 === 3 ? 411 : 412) + remaining_delta / alqday + 1;
        ret_taf["cyrl"] = 1090 + year;
        ret_taf["forl"] = day;
    }
    return ret_taf;
};
const testcases = [
    [[2016, 1, 1, 0, 11, 70], [1090, 1], 0],
    [[2015, 12, 35, 0, 14, 107.09005600000091], [1089, 412], -107587.909944],
    [[2015, 12, 34, 0, 18, 19.180112000001827], [1089, 411], -215175.819888],
    [[2016, 1, 2, 0, 8, 32.909943999999086], [1090, 2], 109032.909944],
    [[2016, 12, 35, 14, 28, 120.03950399905443], [1090, 367], 39377175.039504],
];
const test_phil_to_taf = (phil_input, taftarl_output) => {
    const [rout, stujesn, snenik, liestu, rukest, stususn] = phil_input;
    const [cyrl, forl] = taftarl_output;
    const { cyrl: ret_cyrl, forl: ret_forl } = phil_to_taf(rout, stujesn, snenik, liestu, rukest, stususn);
    if (cyrl !== ret_cyrl || forl !== ret_forl) {
        console.log(ret_cyrl, ret_forl);
        return true;
    }
    else {
        return false;
    }
};
const test_taf_to_phil = (taftarl_input, phil_output) => {
    const [cyrl, forl] = taftarl_input;
    const [rout, stujesn, snenik, liestu, rukest, stususn] = phil_output;
    const { rout: ret_rout, stujesn: ret_stujesn, snenik: ret_snenik, liestu: ret_liestu, rukest: ret_rukest, stususn: ret_stususn } = taf_to_phil(cyrl, forl);
    if (rout !== ret_rout || stujesn !== ret_stujesn || snenik !== ret_snenik || liestu !== ret_liestu || rukest !== ret_rukest || stususn !== ret_stususn) {
        console.log(ret_rout, ret_stujesn, ret_snenik, ret_liestu, ret_rukest, ret_stususn);
        return true;
    }
    else {
        return false;
    }
};
const tester = () => {
    let failed_case_phil_to_taf = "";
    let failed_case_taf_to_phil = "";
    testcases.forEach(element => {
        const [p, t, _] = element;
        if (test_phil_to_taf(p, t)) {
            failed_case_phil_to_taf += `[${p}] / [${t}]\n`;
        }
        if (test_taf_to_phil(t, p)) {
            failed_case_phil_to_taf += `[${t}] / [${p}]\n`;
        }
    });
    let alert_message = "";
    if (failed_case_phil_to_taf !== "" || failed_case_taf_to_phil !== "") {
        alert_message += "test failed on cases below.";
        alert_message += (failed_case_phil_to_taf === "") ? "" : `\nphilifiar to taftarl:\n${failed_case_phil_to_taf}`;
        alert_message += (failed_case_taf_to_phil === "") ? "" : `\ntaftarl to philifiar:\n${failed_case_taf_to_phil}`;
    }
    if (alert_message !== "") {
        alert(alert_message);
    }
};
const test_calc_forl_delta = (taftarl_input, stususn_output) => {
    const [cyrl, forl] = taftarl_input;
    if (stususn_output !== calc_forl_delta(cyrl, forl) * alqday) {
        console.log(forl, cyrl, stususn_output);
        return true;
    }
    else {
        return false;
    }
};
const test_calc_stususn_delta = (phil_input, stususn_output) => {
    const [rout, stujesn, snenik, liestu, rukest, stususn] = phil_input;
    if (stususn_output !== calc_stususn_delta(rout, stujesn, snenik, liestu, rukest, stususn)) {
        console.log(rout, stujesn, snenik, liestu, rukest, stususn, stususn_output);
        return true;
    }
    else {
        return false;
    }
};
const inner_tester = () => {
    testcases.forEach(element => {
        const [p, f, sd] = element;
        test_calc_forl_delta(f, sd);
        test_calc_stususn_delta(p, sd);
    });
};
