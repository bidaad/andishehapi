"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correctPersian = void 0;
function correctPersian(str) {
    return str
        .replace(/ي/g, 'ی')
        .replace(/ي/g, 'ی')
        .replace(/ى/g, 'ی')
        .replace(/ﻳ/g, 'ی')
        .replace(/ﻱ/g, 'ی')
        .replace(/ﻲ/g, 'ی')
        .replace(/ﻰ/g, 'ی')
        .replace(/ﻯ/g, 'ی')
        .replace(/ك/g, 'ک')
        .replace('٠', '۰')
        .replace('١', '۱')
        .replace('٢', '۲')
        .replace('٣', '۳')
        .replace('٤', '۴')
        .replace(/٥/g, '۵')
        .replace(/٦/g, '۶')
        .replace('٧', '۷')
        .replace('٨', '۸')
        .replace('٩', '۹');
}
exports.correctPersian = correctPersian;
