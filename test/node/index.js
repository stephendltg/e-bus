const bus = require('../../packages/e-bus/src')

const mutate = (key, value) => console.log('Mutate: ' + key + ': ' + value)
const init = new Map([['foo', {value: 'Hello world', expiration: 0}]])
const mitt = bus( mutate, init)

mitt.set("title", "my-title")

console.log(mitt.get('foo'))

console.log(mitt.json())