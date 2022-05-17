const { WebSocket } = require('ws')

function* incrementOne () {
  let counter = 0
  while (counter < 1e6) {
    yield counter++
  }
}

const server = new WebSocket.Server({ port: 3000 })

server.on('connection', socket => {
  void async function() {
    const iterator = incrementOne()

    while (!iterator.next().done) {
      socket.send(JSON.stringify({ number: iterator.next().value }))
    }

    socket.close()
  }().catch(err => socket.send(JSON.stringify({ error: err.message })))
});