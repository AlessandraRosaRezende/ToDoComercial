import { useState } from 'react'
import { Comment } from '../types'
import { addComment } from '../hooks/useProjects'
import { useUser } from '../lib/UserContext'

interface Props {
  projectId: string
  comments: Comment[]
  onAdded: () => void
}

export function CommentsSection({ projectId, comments, onAdded }: Props) {
  const { user } = useUser()
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)

  // Filter out AI Q&A comments (those start with ❓)
  const regularComments = comments.filter(c => !c.content.startsWith('❓'))

  const submit = async () => {
    if (!text.trim()) return
    setSaving(true)
    try {
      await addComment({
        project_id: projectId,
        author_name: user?.name ?? 'Anônimo',
        author_email: user?.email ?? '',
        content: text.trim(),
      })
      setText('')
      onAdded()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {regularComments.length === 0 ? (
        <div style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: '20px 0' }}>
          Nenhum comentário ainda. Seja o primeiro!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {regularComments.map(c => (
            <div key={c.id} style={{
              background: 'var(--bg3)', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)', padding: '12px 16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.author_name}</span>
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                  {new Date(c.created_at).toLocaleString('pt-BR')}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{c.content}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <textarea
          style={{
            flex: 1, background: 'var(--bg3)', border: '1px solid var(--border2)',
            borderRadius: 'var(--radius)', padding: '10px 14px',
            color: 'var(--text)', fontSize: 14, outline: 'none',
            resize: 'vertical', minHeight: 72,
          }}
          placeholder="Adicione um comentário..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button
          onClick={submit}
          disabled={saving || !text.trim()}
          style={{
            background: 'var(--bg4)', color: 'var(--text2)',
            borderRadius: 'var(--radius)', padding: '10px 16px',
            fontWeight: 600, fontSize: 13, border: '1px solid var(--border2)',
            opacity: saving || !text.trim() ? 0.5 : 1, alignSelf: 'flex-end',
          }}
        >
          {saving ? '...' : 'Comentar'}
        </button>
      </div>
    </div>
  )
}