import { useState } from 'react'
import { ProjectDetail } from '../types'
import { addComment } from '../hooks/useProjects'
import { useUser } from '../lib/UserContext'

interface QA { question: string; answer: string; author: string; ts: string }

interface Props {
  project: ProjectDetail
  onCommentAdded: () => void
}

export function AskAI({ project, onCommentAdded }: Props) {
  const { user } = useUser()
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [localQAs, setLocalQAs] = useState<QA[]>([])

  const ask = async () => {
    if (!question.trim() || loading) return
    setLoading(true)
    const q = question.trim()
    setQuestion('')

    try {
      const context = `
Você é um assistente especializado em gestão de projetos. Responda de forma objetiva e direta em português.

Contexto do projeto:
- Projeto: ${project.project}
- Categoria: ${project.subproduct}
- Status: ${project.status}
- Próximos Passos: ${project.next_steps}
- Observações: ${project.observations}
- Prazo: ${project.deadline}

Histórico recente de alterações:
${project.history.slice(0, 5).map(h => `- ${h.changed_by} alterou "${h.field_name}": "${h.old_value}" → "${h.new_value}" em ${new Date(h.created_at).toLocaleDateString('pt-BR')}`).join('\n') || 'Sem alterações registradas'}

Comentários recentes:
${project.comments.slice(-5).map(c => `- ${c.author_name}: ${c.content}`).join('\n') || 'Sem comentários'}

Pergunta: ${q}
      `.trim()

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: context }],
        }),
      })

      const data = await res.json()
      const answer = data.content?.map((b: any) => b.text || '').join('') || 'Não foi possível obter resposta.'

      const qa: QA = {
        question: q,
        answer,
        author: user?.name ?? 'Anônimo',
        ts: new Date().toISOString(),
      }

      setLocalQAs(prev => [...prev, qa])

      // Save question + answer as comments in the backend
      await addComment({
        project_id: project.id,
        author_name: user?.name ?? 'Anônimo',
        author_email: user?.email ?? '',
        content: `❓ **${q}**\n\n🤖 ${answer}`,
      })
      onCommentAdded()
    } catch (e) {
      setLocalQAs(prev => [...prev, {
        question: q,
        answer: 'Erro ao conectar com a IA. Verifique a conexão e tente novamente.',
        author: user?.name ?? 'Anônimo',
        ts: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
    }
  }

  // Separate stored QAs (from comments) from local ones
  const storedQAs = project.comments
    .filter(c => c.content.startsWith('❓'))
    .map(c => {
      const lines = c.content.split('\n\n')
      const q2 = lines[0].replace('❓ **', '').replace('**', '')
      const a2 = lines.slice(1).join('\n\n').replace('🤖 ', '')
      return { question: q2, answer: a2, author: c.author_name, ts: c.created_at }
    })

  const allQAs = [...storedQAs, ...localQAs]

  return (
    <div>
      {allQAs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
          {allQAs.map((qa, i) => (
            <div key={i} style={{
              background: 'var(--bg3)', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)', overflow: 'hidden',
            }}>
              <div style={{
                padding: '10px 16px', borderBottom: '1px solid var(--border)',
                display: 'flex', gap: 8, alignItems: 'flex-start',
              }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>❓</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{qa.question}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                    {qa.author} · {new Date(qa.ts).toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>🤖</span>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{qa.answer}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={{
            flex: 1, background: 'var(--bg3)', border: '1px solid var(--border2)',
            borderRadius: 'var(--radius)', padding: '10px 14px',
            color: 'var(--text)', fontSize: 14, outline: 'none',
          }}
          placeholder={loading ? 'Aguardando resposta da IA...' : 'Pergunte algo sobre este projeto...'}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && ask()}
          disabled={loading}
        />
        <button
          onClick={ask}
          disabled={loading || !question.trim()}
          style={{
            background: 'var(--accent)', color: '#fff',
            borderRadius: 'var(--radius)', padding: '0 18px',
            fontWeight: 600, fontSize: 13,
            opacity: loading || !question.trim() ? 0.5 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? '...' : 'Perguntar'}
        </button>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>
        Pressione Enter para enviar · As perguntas e respostas ficam salvas no histórico
      </div>
    </div>
  )
}