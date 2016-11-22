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
    justify = true,
    logger = logUpdate
  } = {}) {
    this.messages = []
    this.align = align
    this.lineSpacing = lineSpacing
    this.separator = separator
    this.table = table
    this.justify = justify
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
        this.table ? wrapMessage(message, maxLabelWidth, this.justify) : message[2]
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

function wrapMessage(message, maxLabelWidth, justify) {
  const offsetWidth = maxLabelWidth + getWidth(message[1]) + 4
  const width = process.stdout.columns - offsetWidth
  const wrapped = justify ? wrap(justifyMessage(message[2], width * 0.9), width) : wrap(message[2], width * 0.9);
  return indent(wrapped, offsetWidth).trim();
}

function justifyMessage(message, len) {
  const words = message.split(/\s+/);
  let lines = [];
  let lastLine = words.reduce(function(line, word) {
    if (line) {
      if (line.length + word.length + 1 <= len)
        return line + ' ' + word;
      lines.push(line);
    }
    return word;
  });
  lines = lines.map(function(line) {
    if (line.indexOf(' ') >= 0){
      let lineLen = line.length;
      while(lineLen < len){
        line = line.replace(/ +/g, function(spaces) {
          return spaces + (lineLen++ < len ? ' ' : '');
        });
      }
    }
    return line;
  });
  lastLine && lines.push(lastLine);
  return lines.join('\n');
}
