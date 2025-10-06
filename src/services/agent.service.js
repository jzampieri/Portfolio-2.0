import axios from 'axios'
const API = import.meta.env.VITE_API || 'http://localhost:3001'

export async function askAgent(message) {
  const { data } = await axios.post(`${API}/api/ask`, { message })
  return data.answer
}
