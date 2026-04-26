import * as fs from 'fs';
import * as path from 'path';

export class HTML {
  public static readonly headerStart = '<h1>';
  public static readonly headerEnd = '</h1>';

  public static readonly mobileViewport =
    '<meta name="viewport" content="width=device-width, initial-scale=1">';

  public static readonly charset =
    '<meta charset="utf-8">';

  public static readonly audio = `
<audio id="beep" preload="auto"></audio>`;

  public static readonly css = `<style>
a {
  color: orange;
  text-decoration: none;
}

html,
body {
  background-color: #000;
  color: #fff;
}

div,
h1,
h2 {
  background-color: #000;
  border: none;
  color: #fff;
}

button {
  display: inline-block;
  border-radius: 4px;
  background-color: #f4511e;
  border: none;
  color: #fff;
  text-align: center;
  font-size: 28px;
  padding: 20px;
  width: 400px;
  transition: all 0.5s;
  cursor: pointer;
  margin: 5px;
}

.completed {
  background-color: green;
  color: white;
  display: none;
}

.timerCompletedButShowing {
  background-color: green;
  color: black;
}

.timer {
  background-color: yellow;
  color: black;
}

.panel {
  border: 1px solid #fff;
  border-top: none;
  padding: 25px;
}
</style>`;

  public static javascript(): string {
    const jsPath = path.resolve(__dirname, 'js.ts');
    const js = fs.readFileSync(jsPath, 'utf8');

    return `<script>${HTML.escapeScript(js)}</script>`;
  }

  private static escapeScript(script: string): string {
    return script.replace(/<\/script>/gi, '<\\/script>');
  }
}
