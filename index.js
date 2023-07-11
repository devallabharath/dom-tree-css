#!/usr/local/bin/node
const dt =  require("./domtojson");
const parser = require("node-html-parser");
const process = require('process');
const fs = require("fs");
const html = parser.parse(fs.readFileSync(process.argv[2]))
const body = dt.toJSON(html.querySelector("body"))

function removeScript(){
    for (let item of body.childNodes){
        if(item.tagName == "script"){
            body.childNodes.splice(body.childNodes.indexOf(item),1)
        }
    }
}

function flatten(object, path = '', res = undefined) {
    if (!Array.isArray(res)) {
        res = [];
    }
    if (object !== null && typeof object === 'object') {
        if (Array.isArray(object)) {
            for (let i = 0; i < object.length; i++) {
                flatten(object[i], path + '[' + i + ']', res)
            }
        } else {
            const keys = Object.keys(object)
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i]
                flatten(object[key], path ? path + '.' + key : key, res)
            }
        }
    } else {
        if (path) {
            res[path] = object
        }
    }
    return res
}

function Content(){
    let content = "/* Dom Tree\n"
    const flat = flatten(body)
    for (key of Object.keys(flat)){
        let len = key.replace("tagName", "")
        len = len.split("childNodes[0].").join('\t')
        len = len.split("childNodes[1].").join('\t')
        len = len.split("childNodes[2].").join('\t')
        len = len.split("childNodes[3].").join('\t')
        len = len.split("childNodes[4].").join('\t')
        len = len.split("childNodes[5].").join('\t')
        len = len.split("childNodes[6].").join('\t')
        len = len.split("childNodes[7].").join('\t')
        len = len.split("childNodes[8].").join('\t')

        content += len + flat[key] + "\n";
    }
    content += "*/ \n"
    return content
}

function Main(){
    removeScript()
    let content = Content()
    fs.writeFile(process.argv[3], content, err => {
        if (err) {
            console.error(err);
        }
    });
}

Main()
