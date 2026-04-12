import * as fs from 'fs';

export class HTML {
    public static headerStart = '<h1>';
    public static headerEnd = '</h1>';
    public static mobileViewport = '<meta name="viewport" content="width=device-width, initial-scale=1">';
    public static chartSet = '<meta charset="utf-8">';
    public static audio = `<!-- https://stackoverflow.com/a/68107904 -->
    <audio id="beep" preload="auto"></audio>
    `

    public static css = `<style>

    a {
        color:orange;
        text-decoration:none;
    }

    html {
        background-color: #000000;
    }

    div, h1, h2 {
        background-color: #000000;
        border: none;
        color: #FFFFFF;
    }

    button {
        display: inline-block;
        border-radius: 4px;
        background-color: #f4511e;
        border: none;
        color: #FFFFFF;
        text-align: center;
        font-size: 28px;
        padding: 20px;
        width: 400px;
        transition: all 0.5s;
        cursor: pointer;
        margin: 5px;
    }

    #ingredients {

    }

    .completed {
        background-color:green;
        color: white;
        display: none;
    }

    .timerCompletedButShowing {
        background-color:green;
        color: black;
    }

    .timer {
        background-color:yellow;
        color: black;
    }

    .panel {
        border-right-style: solid;
        border-bottom-style: solid;
        border-left-style: solid;
        padding: 25px;
        border-width: 1px;
    }
    </style>`;

    public static javascript = () => {
        const js = fs.readFileSync('src/class/js.ts')
        return `<script>${js}</script>`
    }
}
