import * as process from 'process'
import dotenv from 'dotenv-safe'
import { oraPromise } from 'ora'

import { ChatGPTAPI } from '../src'

dotenv.config()

/**
 * Demo CLI for testing basic functionality.
 *
 * ```
 * npx tsx demos/app.ts
 * ```
 */
async function main() {
  const api = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY })

  const args = process.argv.slice(2)
  const argsStr = args.join(', ')
  const prompt = argsStr

  const res = await oraPromise(api.sendMessage(prompt), {
    text: prompt
  })
  console.log(JSON.stringify(res))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
