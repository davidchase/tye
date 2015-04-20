# tye
Micro Event Delegation Library 


### Usage
```js
var tye = require('tye');

// Bind click event to document.body
tye(document.body).on('click', someFunction);
// Event Delegation:
tye(document.body).on('click', '.my-class' someFunction);

// Remove click binding from '.my-class'
tye(document.body).off('click', '.my-class');
// Remove all click bindings from document.body
tye(document.body).off('click');
```