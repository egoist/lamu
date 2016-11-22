import chalk from 'chalk'
import textTable from 'text-table'
import logUpdate from 'log-update'
import indent from 'indent-string'
import wrap from 'wrap-ansi'
import getWidth from 'string-width'
import stripAnsi from 'strip-ansi'

const defaultPatterns = {
  error: 'red',
  success: 'green',
  info: 'cyan',
  warning: 'yellow'
}

const defaultAligns = {
  left: 'l',
  right: 'r'
}

class Lamu {
  // [TODO] add a center option to centerlize the whole output
  constructor({
    align = 'right',
    lineSpacing = 0,
    separator = '::',
    table = true,
    logger = logUpdate
  } = {}) {
    this.messages = []
    this.align = align
    this.lineSpacing = lineSpacing
    this.separator = separator
    this.table = table
    this.logger = logger
  }

  push(data) {
    const index = this.messages.length
    this.updateIndex(index, data)
    for (let i = 0; i < this.lineSpacing; i++) {
      this.messages.push(['', '', ''])
    }
    return index
  }

  log(data) {
    const index = this.push(data)
    this.output()
    return index
  }

  updateIndex(index, {
    label,
    text,
    color
  } = {}) {
    const current = this.messages[index]
    label = label || current[0]

    let coloredLabel
    if (color) {
      label = stripAnsi(label)
      coloredLabel = chalk[color](label)
    } else if (defaultPatterns[label]) {
      label = stripAnsi(label)
      coloredLabel = chalk[defaultPatterns[label]](label)
    } else {
      coloredLabel = chalk.dim(label)
    }

    this.messages[index] = [
      (label || color) ? coloredLabel : current[0],
      chalk.dim(this.separator),
      text || current[2]
    ]
    return this
  }

  update(index, data) {
    this.updateIndex(index, data)
    this.output()
  }

  output() {
    for (let i = 0; i < this.messages.length; i++) {
      this.messages[i][2] = this.messages[i][2].replace(/^\s*/gm, '')
    }
    const maxLabelWidth = this.messages.reduce((current, next) => {
      if (getWidth(next[0]) > current) return getWidth(next[0])
      return current
    }, 0)
    const data = this.messages.map(message => {
      return [
        message[0],
        message[1],
        this.table ? wrapMessage(message, maxLabelWidth) : message[2]
      ]
    })
    if (this.table) {
      this.logger(textTable(data, {
        align: [defaultAligns[this.align], 'l', 'l'],
        stringLength: getWidth
      }))
    } else {
      this.logger(data.map(message => {
        return message.join(' ')
      }).join('\n'))
    }
    return this
  }
}

export default options => {
  return new Lamu(options)
}

function wrapMessage(message, maxLabelWidth) {
  const offsetWidth = maxLabelWidth + getWidth(message[1]) + 4
  const width = process.stdout.columns - offsetWidth
  return indent(wrap(message[2], width * 0.9), offsetWidth).trim()
}
