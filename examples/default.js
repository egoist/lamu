const lamu = require('../')()

console.log()

lamu.log({
  label: 'success',
  text: 'Nothing goes wrong thus far'
})
lamu.log({
  label: 'warning',
  text: 'But keep eyes open!'
})
lamu.log({
  label: 'error',
  text: 'Things changed'
})
lamu.log({
  label: 'see you',
  color: 'magenta',
  text: 'everything has an end.'
})

console.log()
