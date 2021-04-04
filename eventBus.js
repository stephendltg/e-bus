"use strict";

/**
 * EventBus
 */
module.exports = (n) => { return {
    all: n = n || new Map,
    on: (e,t) => {
      if(typeof t !== 'function') return
      let i = n.get(e)
      i&&i.push(t) || n.set(e,[t])
    },
    off: (e,t) => {
      if(!t && n.delete(e)) return
      let i = n.get(e)
      if(i) while(i.indexOf(t) > -1) i.splice(i.indexOf(t),1)
    },
    emit: (e,t) => {
      (n.get(e) || []).slice().map( n => n(t) ),
      (n.get("*") || []).slice().map( n => n(e,t) )
    }
  }}
  
  
/*

const emitter = require('./eventBus.js')()

or
const eventBus = require('./eventBus.js')
const emitter = eventBus()
 
// listen to an event
emitter.on('foo', e => console.log('foo', e) )
 
// listen to all events
emitter.on('*', (type, e) => console.log(type, e) )
 
// fire an event
emitter.emit('foo', { a: 'b' })
 
// clearing all events
emitter.all.clear()
 
// working with handler references:
function onFoo() {}
emitter.on('foo', onFoo)   // listen
emitter.off('foo', onFoo)  // unlisten function onFoo
emitter.off('foo') // unlisten all functions

// bus function
emitter.on('test', e => typeof e === 'function' ? e() : null )
emitter.emit('test', ()=> console.log(678))


all
A Map of event names to registered handler functions.

on
Register an event handler for the given type.

Parameters
type (string | symbol) Type of event to listen for, or "*" for all events
handler Function Function to call in response to given event

off
Remove an event handler for the given type.

Parameters
type (string | symbol) Type of event to unregister handler from, or "*"
handler Function Handler function to remove

emit
Invoke all handlers for the given type. If present, "*" handlers are invoked after type-matched handlers.

Note: Manually firing "*" handlers is not supported.

Parameters
type (string | symbol) The event type to invoke
evt Any? Any value (object is recommended and powerful), passed to each handler

*/

