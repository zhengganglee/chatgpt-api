import dotenv from 'dotenv-safe'
import http from 'http'
import process from 'process'
import querystring from 'querystring'

import { ChatGPTAPI } from '../src'

dotenv.config()

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      const data = querystring.parse(body)
      if (data.prompt) {
        const promptValue =
          typeof data.prompt === 'string' ? data.prompt : data.prompt.join(',')
        const api = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY })

        const msgId =
          typeof data.parentMessageId === 'string'
            ? data.parentMessageId
            : data.parentMessageId.join(',')
        let opts = msgId ? { parentMessageId: msgId } : {}
        console.log(
          `############################22 promptValue=${promptValue} msgId=${msgId} opts=${JSON.stringify(
            opts
          )}`
        )
        const response = await api.sendMessage(promptValue, opts)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(response))
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end('Bad Request: Invalid prompt parameter')
      }
    })
  } else {
    res.writeHead(404)
    res.end()
  }
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
