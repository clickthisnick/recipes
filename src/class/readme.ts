import * as fs from 'fs';

export class Readme {
    public static groups = {};

    public static makeReadme() {
        let text = '';
        const groups = Object.keys(this.groups).sort();
        console.log(groups); // tslint:disable-line
        for (const group of groups) {
            text += `# ${group}\n`;
            text += this.groups[group].join('');
        }

        console.log(text); // tslint:disable-line

        this.appendReadme(text);
    }

    public static appendReadme(text) {
        fs.appendFileSync(`${process.cwd()}/README.md`, text);
    }
}
