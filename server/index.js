import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import { OpenAI } from 'openai'

const app = express()
app.use(express.json())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

function loadProfile () {
  const p = process.env.PROFILE_PATH || './data/profile.json'
  const abs = path.resolve(p)
  try {
    return JSON.parse(fs.readFileSync(abs, 'utf8'))
  } catch (e) {
    console.error('Falha ao ler profile.json em', abs, e.message)
    return {}
  }
}

// system prompt restritivo
function systemPrompt(profile) {
  const name = profile?.owner?.name || 'Autor'
  return [
    `Você é o agente oficial do portfólio de ${name}.`,
    `Regra de ouro: responda APENAS perguntas sobre ${name}, seu trabalho, habilidades, projetos, conquistas e contato.`,
    `Se a pergunta fugir do escopo (ex.: notícias, piadas gerais, matemática aleatória), responda educadamente que só pode falar sobre o ${name} e convide o usuário a perguntar algo do perfil.`,
    `Se não souber, diga que não há informação no perfil.`,
    `Estilo: direto, educado, inspirando-se no iOS 16+ (clean) e com toques “liquid glass” no tom (sem firula).`,
    `Se for pedido link ou rede social, use os dados do profile.json.`,
  ].join('\n')
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/profile', (_req, res) => {
  res.json(loadProfile())
})

app.post('/api/ask', async (req, res) => {
  try {
    const question = String(req.body?.message || '').trim()
    if (!question) {
      return res.status(400).json({ error: 'Mensagem vazia' })
    }

    const profile = loadProfile()
    const system = systemPrompt(profile)

    const context = JSON.stringify(profile)

    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.4,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `Pergunta: ${question}\n\nContexto (profile.json): ${context}` }
      ]
    })

    const answer = completion.choices?.[0]?.message?.content?.trim() || 'Sem resposta'
    res.json({ answer })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao responder' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`))
