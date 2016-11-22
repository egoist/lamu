const type = process.argv[2]

const options = type === 'old' ? {
  table: false
} : {}

const lamu = require('./')(options)
console.log()
lamu.log({
  label: 'info',
  text: 'hello'
})
const id = lamu.log({
  label: 'error',
  text: 'fixing...'
})
lamu.log({
  label: 'warning',
  text: 'this is not ok'
})
const download = lamu.log({
  label: 'download',
  text: 'downloading windows... lol'
})

setTimeout(() => {
  lamu.update(id, {
    label: 'success',
    text: 'I fixed it!'
  })
}, 1000)

setTimeout(() => {
  lamu.update(download, {
    text: 'completed'
  })
  lamu.log({
    label: 'really long text',
    text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
  })
  lamu.log({
    color: 'magenta',
    label: 'webpack is so great',
    text: 'but slow?'
  })
  console.log()
}, 2000)
