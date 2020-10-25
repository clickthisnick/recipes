import * as fs from 'fs';

export class Index {
    public static groups = {};
    public static equipment = [];

    public static generate() {
        let text = '';
        const groups = Object.keys(this.groups).sort();
        for (const group of groups) {
            text += `<h1>${group}</h1>`;
            text += this.groups[group].join('');
        }

        this.append(text);
    }

    public static append(text) {
        fs.appendFileSync(`${process.cwd()}/index.html`, text);
    }
}
