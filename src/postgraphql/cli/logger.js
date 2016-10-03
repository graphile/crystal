import * as chalk from 'chalk'

const write = (status, text = '') => {
  let logText

  switch (status) {
    case 'start':
      logText = `🚀  ${chalk.green(text)}`
      break
    default:
      logText = chalk.gray(text)
  }

  console.log(logText)
}

export const log = (text) => write(null, text)
export const start = (text) => write('start', text)
