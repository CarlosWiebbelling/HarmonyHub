const ping = require('./ping')

const {
  localize,
  speech,
  search
} = require('./gpt')

const {
  play,
  pause,
  stop,
  unpause
} = require('./yt')

const {
  isEven,
  isOdd
} = require('./numeric')

module.exports = {
  ping,
  play,
  pause,
  stop,
  unpause,
  localize,
  speech,
  isEven,
  isOdd,
  search
}
