import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import { OpenAI } from 'openai'

const app = express()
app.use(express.json())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.post('/api/ask', async (req, res) => {
  try {
    const question = String(req.body?.message || '')
    const profile = JSON.parse(fs.readFileSync(process.env.PROFILE_PATH || './data/profile.json','utf8'))

    const system = `Você é o agente do portfólio de Julio Zampieri.
Responda somente sobre o Julio usando APENAS os dados abaixo.
Se faltar a informação, diga que não encontrou no portfólio.

PERFIL:
${JSON.stringify(profile)}`

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: question }
      ]
    })

    res.json({ answer: completion.choices[0].message.content })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao responder' })
  }
})

app.listen(process.env.PORT || 3001, () =>
  console.log(`API on http://localhost:${process.env.PORT || 3001}`)
)
