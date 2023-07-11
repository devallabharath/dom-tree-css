/* eslint-disable no-undef */
'use strict';

// convert to json

Object.defineProperty(exports, "__esModule", {
    value: true
});
const toJSON = exports.toJSON = node => {
    node = node || undefined;
    if (node.nodeType == 1){
        let obj = {}
        obj.tagName = node.tagName.toLowerCase();
        let attrs = node.attributes;
        let childNodes = node.childNodes;
        let length;
        let arr;
        if (attrs) {
            length = attrs.length;
            arr = obj.attributes = [];
            for (let i = 0; i < length; i++) {
                const attr = attrs[i];
                if(attr.nodeName == "class" || attr.nodeName == "id"){
                    arr[i] = [attr.nodeName, attr.nodeValue];
                }
            }
        }
        if (childNodes) {
            length = childNodes.length;
            if (length != 0){
                arr = obj.childNodes = [];
                for (let i = 0; i < length; i++) {
                    if(i%2 !== 0){
                        arr.push(toJSON(childNodes[i]));
                    }
                }
            }
        }
        return obj
    }
};

// convert htmlnode to string
const outerHTML = exports.outerHTML = node => {
    return node.outerHTML || new XMLSerializer().serializeToString(node);
};
