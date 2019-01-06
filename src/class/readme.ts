import * as fs from 'fs';

export class Readme {
    public static groups = {};

    public static makeReadme() {
        let text = '';
        const groups = Object.keys(this.groups).sort();

        for (const group of groups) {
            text += `# ${group}\n`;
            text += this.groups[group].join('');
        }

        console.log(text); // tslint:disable-line

        this.appendReadme(text);
    }

    public static appendReadme(text) {
        fs.appendFile(`${process.cwd()}/README.md`, text, (err) => {
            if (err) {
                return console.log(err); //tslint:disable-line no-console
            }
        });
    }
}
