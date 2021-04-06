# E-BUS

E-bus was made for the browser and nodejs

## INSTALL

```
npm install --save @stephendltg/e-bus
```

For browser hhen with a module bundler like rollup or webpack, use as you would anything else:

```
// using ES6 modules
import eventBus from '@stephendltg/e-bus'
 
// using CommonJS modules
var eventBus = require('@stephendltg/e-bus')
```

## USAGE

```
const emitter = eventBus()
```

or add mutate (store) func && init store

```
const mutate = (key, value) => console.log(key + ': ' + value)
const init = new Map([['foo', 'Hello world]])
const emitter = eventBus( mutate, init)
```

### PUB/SUB

```
 
// subscribe to an event
emitter.sub('foo', e => console.log('foo', e) )
 
// subscribe to all events
emitter.sub('*', (type, e) => console.log(type, e) )
 
// publish an event
emitter.pub('foo', { a: 'b' })
 
// working with handler references:
function onFoo() {}
emitter.sub('foo', onFoo)   // listen
emitter.unsub('foo', onFoo)  // unlisten function onFoo
emitter.unsub('foo') // unlisten all functions

// working with bus function
emitter.sub('test', e => typeof e === 'function' ? e() : null )
emitter.pub('test', ()=> console.log(678))

// Remove sub
emitter.unsub('foo')

```

### STORE

```
// Store Set
emitter.set('stub', 78)

// Store with expiration in millisecondes
emitter.set('stub', 89, 4000)

// Store get
emitter.get('stub')

// Store delete
emitter.del('stub')

// clearing all data
emitter.all.clear()

// Export store to json
let export = emitter.json()

```