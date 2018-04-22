import * as fs from 'fs';

export class Readme {
    public static groups = {};

    public static makeReadme() {
        for (const groupKey of Object.keys(this.groups)) {
            this.appendReadme(`# ${groupKey}\n`);

            for (const recipe of this.groups[groupKey]) {
                this.appendReadme(recipe);
            }
        }
    }

    public static appendReadme(text) {
        fs.appendFile(`${process.cwd()}/README.md`, text, (err) => {
            if (err) {
                return console.log(err); //tslint:disable-line no-console
            }
        });
    }
}
