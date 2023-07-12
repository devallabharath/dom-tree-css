#!/usr/local/bin/node
const fs = require("fs");
const { extname } = require('path');
const process = require('process');
const { JSDOM } = require("jsdom")

const inFile = process.argv[2]
const outFile = process.argv[3]
let html;
let body;

// This function takes a node as an argument and returns a JSON object
function toJSON(node){
    // If no node is passed, set it to undefined
    node = node || undefined
    // Check if the node is of type 1
    if (node.nodeType == 1){
        let obj = {};
        // Set the tagName property to lowercase
        obj.tagName = node.tagName.toLowerCase();
        let attrs = node.attributes;
        let childNodes = node.childNodes;
        let length;
        let arr;
        // Check if there are any attributes
        if (attrs){
            length = attrs.length;
            arr = obj.attributes = [];
            // Loop through the attributes and add class and id to the array
            for ( let i=0; i < length; i++ ){
                const attr = attrs[ i ];
                if ( attr.nodeName == "class" || attr.nodeName == "id" ){
                    arr[ i ] = [ attr.nodeName, attr.nodeValue ];
                }
            }
        }
        // Check if there are any child nodes
        if (childNodes){
            length = childNodes.length;
            // Check if the length is not 0
            if ( length != 0 ){
                arr = obj.childNodes = [];
                // Loop through the child nodes and call the toJSON function on them
                for ( let i = 0; i < length; i++ ){
                    if ( i % 2 !== 0 ){
                        arr.push( toJSON(childNodes[i]) );
                    }
                }
            }
        }
        // Return the JSON object
        return obj;
    }
}

// This function removes all script tags from the body element
function removeScript(){
    // Loop through each child node of the body element
    for (let item of body.childNodes){
        // Check if the tag name is "script"
        if(item.tagName == "script"){
            // Remove the script tag from the body element
            body.childNodes.splice(body.childNodes.indexOf(item),1)
        }
    }
}

// This function takes an object and flattens it into an array of key-value pairs.
function Flatten(object, path = '', res = undefined) {
    // If the result is not an array, set it to an empty array
    if (!Array.isArray(res)) {res = []};

    // If the object is not null and is an object
    if (object !== null && typeof object === 'object') {
        // If the object is an array
        if (Array.isArray(object)) {
            // Loop through each element in the array
            for (let i = 0; i < object.length; i++) {
                // Recursively call the function on each element
                Flatten(object[i], path + '[' + i + ']', res)
            }
        } else {
            // Get the keys of the object
            const keys = Object.keys(object)
            // Loop through each key
            for (let i=0; i < keys.length; i++) {
                // Get the current key
                const key = keys[i]
                // Recursively call the function on each key
                Flatten(object[key], path ? path + '.' + key : key, res)
            }
        }
    } else {
        // If the path is not empty, push the key-value pair to the result array
        if (path){ res.push({[path]:object}) }
    }
    // Return the flattened array
    return res;
}

// Function to generate content from data
function Content(data){
    // Initialize output string with file name
    let output = `/* Dom Tree: ${inFile.split("/").pop()}`;

    // Iterate through data array
    data.forEach( item =>{
        // Get key and value from object
        const key = Object.keys(item)[0];
        const value = item[key];
        // Split key into parts
        const parts = key.split('.');
        // Initialize tabs string
        let tabs = '';
        // Loop through parts and add tabs
        for (let i = 0; i < parts.length - 1; i++){tabs += '\t'};
        // Check if last part of key includes attributes
        if (parts[parts.length - 1].includes('attributes')){
            // Check if value is id or class
            if ( value == "id" || value == "class" ){
                // Add # or . to output string
                output += value == "id" ? ', #' : ', .';
            } else{
                // Add value to output string
                output += value;
            }
        }else{
            // Add value to output string with tabs
            output += `\n${tabs}${value}`;
        }
    });
    // Add closing comment tag to output string
    output += "\n*/";
    // Return output string
    return output;
}

// Function to process the HTML file
function Process(){
    // Create a new JSDOM object from the input file
    html = new JSDOM(fs.readFileSync(inFile))
    // Convert the body of the HTML document to JSON format
    body = toJSON(html.window.document.querySelector("body"))
    // Remove any script tags from the HTML document
    removeScript();
    // Generate content from the flattened JSON object
    let content = Content(Flatten(body))
    // If the output file already exists, append the new content to it
    if (fs.existsSync(outFile)){
        const old = fs.readFileSync(outFile)
        content += "\n" + old
    }
    // Write the content to the output file
    fs.writeFileSync(outFile, content, err => {
        if (err) {console.error(err)};
    });
}

// Function to check if the input file exists and is an HTML file
function Main(){
    // Check if the input file exists
    if (fs.existsSync(inFile)) {
        // Check if the input file is an HTML file
        if (extname(inFile)==".html"){Process()}
        // Log an error message if the input file is not html file
        else{console.log(`Err: ${inFile} is not html file.`);}
    }else{
        // Log an error message if the input file does not exist
        console.log(`Err: ${inFile} does not exits.`);
    }
}

Main()
