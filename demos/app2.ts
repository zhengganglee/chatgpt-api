import dotenv from 'dotenv-safe'
import http from 'http'
import process from 'process'
import querystring from 'querystring'

import { oraPromise } from 'ora'
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
        const api = new ChatGPTAPI({apiKey: process.env.OPENAI_API_KEY})
        const prompt = typeof data.prompt === 'string' ? data.prompt : null
        const msgId = typeof data.msgId === 'string' ? data.msgId : null
        let opts = msgId ? {parentMessageId: msgId} : {}
        console.log(`############################22 promptValue=${prompt} msgId=${msgId} opts=${JSON.stringify(opts)}`)

        // let res2
        // if (msgId) {
        //   // const prompt2 = 'Can you make it cuter and shorter?'
        //   res2 = await oraPromise(
        //       api.sendMessage(prompt, {
        //         parentMessageId: msgId
        //       }),
        //       {
        //         text: prompt
        //       }
        //   )
        //   console.log('=====res2\n' + res2.text + '\n')
        // } else {
        //   // const prompt = 'Write a poem about cats.'
        //   res2 = await oraPromise(api.sendMessage(prompt), {
        //     text: prompt
        //   })
        //   console.log('=====res1\n' + res2.text + '\n')
        // }

        const prompt1 = 'Write a poem about cats.'
        let res2 = await oraPromise(api.sendMessage(prompt1), {
          text: prompt1
        })
        console.log('====1\n' + res2.text + '\n')
        console.log('====2\n' + JSON.stringify(res2) + '\n')

        const prompt2 = 'Can you make it cuter and shorter?'
        res2 = await oraPromise(
            api.sendMessage(prompt2, {
              parentMessageId: res2.id
            }),
            {
              text: prompt2
            }
        )
        console.log('====3\n' + res2.text + '\n')
        console.log('====4\n' + JSON.stringify(res2) + '\n')

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(res2))
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
