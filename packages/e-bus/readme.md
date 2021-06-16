---
order: 1
title: E-bus
---

# E-BUS

Message Queuing & memory data store

E-bus was made for the browser and nodejs

## INSTALL

```
npm install --save @stephendltg/e-bus
```

For browser hhen with a module bundler like rollup or webpack, use as you would anything else:

```
// using ES6 modules
import emitter from '@stephendltg/e-bus'
 
// using CommonJS modules
var emitter = require('@stephendltg/e-bus/dist/module.esm')

// HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="http://unpkg.com/@stephendltg/e-bus"></script>
  <title>Document</title>
</head>
<body>
  <script>
    console.log(mitt)
  </script>
  
</body>
</html>
```

## USAGE

```
const mitt = emitter()
```

or add mutate (store) func && init store

```
const mutate = (key, value) => console.log(key + ': ' + value)
const init = new Map([['title', {value: 'Hello world', expiration: 0}]])
const mitt = emitter( mutate, init)
```

### PUB/SUB

```
 
// subscribe to an event
mitt.sub('foo', e => console.log('foo', e) )
 
// subscribe to all events
mitt.sub('*', (type, e) => console.log(type, e) )
 
// publish an event
mitt.pub('foo', { a: 'b' })
 
// working with handler references:
function onFoo() {}
mitt.sub('foo', onFoo)   // listen
mitt.unsub('foo', onFoo)  // unlisten function onFoo
mitt.unsub('foo') // unlisten all functions

// working with bus function
mitt.sub('test', e => typeof e === 'function' ? e() : null )
mitt.pub('test', ()=> console.log(678))

// Remove sub
mitt.unsub('foo')

```

### STORE

```
// Store Set
mitt.set('stub', 78)

// Store with expiration in millisecondes
mitt.set('stub', 89, 4000)

// Store get
mitt.get('stub')

// Store delete
mitt.del('stub')

// clearing all data
mitt.all.clear()

// Export store to json
let export = mitt.json()

```