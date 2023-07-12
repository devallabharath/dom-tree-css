#!/usr/local/bin/node
const fs = require("fs");
const process = require('process');
const { JSDOM } = require("jsdom")
const dt =  require("./domtojson");

const inFile = process.argv[2]
const outFile = process.argv[3]

const html = new JSDOM(fs.readFileSync(inFile))
const body = dt.toJSON(html.window.document.querySelector("body"))

function removeScript(){
    for (let item of body.childNodes){
        if(item.tagName == "script"){
            body.childNodes.splice(body.childNodes.indexOf(item),1)
        }
    }
}

function flatten(object, path = '', res = undefined) {
    if (!Array.isArray(res)) {res = []};

    if (object !== null && typeof object === 'object') {
        if (Array.isArray(object)) {
            for (let i = 0; i < object.length; i++) {
                flatten(object[i], path + '[' + i + ']', res)
            }
        } else {
            const keys = Object.keys(object)
            for (let i=0; i < keys.length; i++) {
                const key = keys[i]
                flatten(object[key], path ? path + '.' + key : key, res)
            }
        }
    } else {
        if (path){ res.push({[path]:object}) }
    }
    return res;
}

function Content(data){
    let output = `/* Dom Tree: ${inFile.split("/").pop()}`;
    data.forEach( item =>{
        const key = Object.keys(item)[0];
        const value = item[key];
        const parts = key.split('.');
        let tabs = '';
        for (let i = 0; i < parts.length - 1; i++){tabs += '\t'};
        if (parts[parts.length - 1].includes('attributes')){
            if ( value == "id" || value == "class" ){
                output += value == "id" ? ', #' : ', .';
            } else{
                output += value;
            }
        }else{
            output += `\n${tabs}${value}`;
        }
    });
    output += "\n*/";
    return output;
}

function Main(){
    removeScript();
    const flat = flatten(body);
    fs.writeFileSync(outFile, Content(flat), err => {
        if (err) {console.error(err)};
    });
}

Main()
