import dotenv from 'dotenv-safe'
import http from 'http'
import process from 'process'
import querystring from 'querystring'

import { ChatGPTAPI } from '../src'

dotenv.config()
const api = new ChatGPTAPI({apiKey: process.env.OPENAI_API_KEY})

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      const data = querystring.parse(body)
      if (data.prompt) {
        const prompt = typeof data.prompt === 'string' ? data.prompt : null
        const msgId = typeof data.msgId === 'string' ? data.msgId : null
        let opts = msgId ? { parentMessageId: msgId } : {}
        console.log(`收到请求 prompt=${prompt} msgId=${msgId} opts=${JSON.stringify(opts)}`)

        let result = await api.sendMessage(prompt, opts)
        console.log(`响应结果200 prompt=${prompt} result=${result}`)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
      } else {
        console.log(`响应结果400 prompt=${prompt}`)
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
