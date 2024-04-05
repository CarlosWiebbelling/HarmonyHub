const commands = require('../index')

const interactions = []
const interactionsFn = {}

for (obj in commands) {
  interactions.push(commands[obj].key)
  interactionsFn[commands[obj].key] = commands[obj].execute
}

const mapInteraction = (key) => interactionsFn[key]

module.exports = {
  mapInteraction,
  interactions
}
