const lamu = require('../')({
  lineSpacing: 1
})

console.log()

lamu.log({label: 'info', text: 'hello world'})
const log = lamu.log({label: 'download', text: `please wait...`, color: 'yellow'})
lamu.log({label: 'warning', text: 'goodbye world'})

setTimeout(() => {
  lamu.update(log, {text: 'done!', color: 'green'})
  console.log()
}, 1000)
