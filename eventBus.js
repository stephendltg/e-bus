"use strict";

/**
 * EventBus
 */
module.exports = (func, n) => { 
  
  const mutate = (k,v)=> typeof func === 'function' ? func(k,v) : null

  return {
    all: n = n || new Map,
    json: () => Array.from(n.entries()),
    sub: (e,t) => {
      if(typeof t !== 'function') return
      let i = n.get(e)
      i&&i.push(t) || n.set(e,[t])
    },
    unsub: (e,t) => {
      if(!t && n.delete(e)) return
      let i = n.get(e)
      if(i) while(i.indexOf(t) > -1) i.splice(i.indexOf(t),1)
    },
    pub: (e,t) => {
      (n.get(e) || []).slice().map( n => n(t) ),
      (n.get("*") || []).slice().map( n => n(e,t) )
    },
    set: (k,v,e = 0) => {
      if(typeof value === 'function') return
      mutate(k,v)
      return n.set(k, {
        value: v,
        expiration: e != =0 ? new Date().getTime() + parseInt(e) : 0
      }).has(k)
    },
    del: (k) => n.delete(k),
    get: (k,d= null) => {
      if( !n.has(k) ) return d
      if( n.get(k).expiration === 0 ) return n.get(k).value
      else if( n.get(k).expiration > new Date().getTime() ) return n.get(k).value
      else n.delete(k)
      mutate(k,null)
      return d
    }
  }
}
  
  
/*

const emitter = require('./eventBus.js')()

or
const eventBus = require('./eventBus.js')
const emitter = eventBus()

or 

const emitter = eventBus( (key, value) => console.log( key + ': ' + value) )
 
// subscribe to an event
emitter.sub('foo', e => console.log('foo', e) )
 
// subscribe to all events
emitter.sub('*', (type, e) => console.log(type, e) )
 
// publish an event
emitter.pub('foo', { a: 'b' })
 
// clearing all data
emitter.all.clear()
 
// working with handler references:
function onFoo() {}
emitter.sub('foo', onFoo)   // listen
emitter.unsub('foo', onFoo)  // unlisten function onFoo
emitter.unsub('foo') // unlisten all functions

// bus function
emitter.sub('test', e => typeof e === 'function' ? e() : null )
emitter.pub('test', ()=> console.log(678))

// cache
emitter.set('stub', 78)
// cache with expiration in miliseconde
emitter.set('stub', 89, 4000)
// get cache
emitter.get('stub')
// del cache
emitter.del('stub')


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

