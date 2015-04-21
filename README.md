# tye
Micro Event Delegation Library 


### Usage
```js
// Using browserify
var tye = require('tye');
// or using the bundled file in dist
<script src="/path/to/dist/bundle.min.js"></script>

// Bind click event to document.body
tye(document.body).on('click', someFunction);
// Event Delegation:
tye(document.body).on('click', '.my-class' someFunction);

// Remove click binding from '.my-class'
tye(document.body).off('click', '.my-class');
// Remove all click bindings from document.body
tye(document.body).off('click');
```

### Under the Hood
This is a wrapper around [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

That allows for event delegation by using [element.matches](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches)

Thats it, very simple implementation.