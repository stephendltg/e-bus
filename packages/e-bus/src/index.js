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
      if(typeof v === 'function') return
      n.set(k, {
        value: v,
        expiration: e !== 0 ? new Date().getTime() + parseInt(e) : 0
      })
      mutate(k,v)
      return n.has(k)
    },
    del: (k) => {
      let x = n.delete(k)
      if(x) mutate(k,null)
      return x
    },
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
