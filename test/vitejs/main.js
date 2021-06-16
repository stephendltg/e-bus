import './style.css'

import mitt from '@stephendltg/e-bus/dist/module.esm'

window.mitt = mitt()

window.mitt.set('title', 'MITT')

document.querySelector('#app').innerHTML = `
  <h1>Hello ${window.mitt.get('title')} !</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
