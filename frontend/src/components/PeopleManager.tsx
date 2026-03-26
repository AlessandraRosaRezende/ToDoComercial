import React, { useState } from 'react'
import { Person } from '../types'
import { createPerson, deletePerson } from '../hooks/useProjects'

interface Props {
  people: Person[]
  onClose: () => void
  onChanged: () => void
}

export function PeopleManager({ people, onClose, onChanged }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const add = async () => {
    if (!name.trim()) { setErr('Nome obrigatório'); return }
    setSaving(true); setErr('')
    try {
      await createPerson({ name: name.trim(), email: email.trim(), role: role.trim() })
      setName(''); setEmail(''); setRole('')
      onChanged()
    } catch (e: any) {
      setErr(e.message ?? 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string, personName: string) => {
    if (!confirm(`Remover "${personName}"?`)) return
    await deletePerson(id)
    onChanged()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 600, backdropFilter: 'blur(3px)',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        borderRadius: 'var(--radius-lg)', padding: 28, width: 520,
        maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Gerenciar Pessoas</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
              Pool de responsáveis disponíveis para associar a projetos
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text3)', fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Add form */}
        <div style={{
          background: 'var(--bg3)', borderRadius: 'var(--radius)',
          border: '1px solid var(--border)', padding: 16, marginBottom: 16,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.06em', marginBottom: 10 }}>
            ADICIONAR PESSOA
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <input
              placeholder="Nome *"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && add()}
              style={inp}
            />
            <input
              placeholder="Cargo / Área"
              value={role}
              onChange={e => setRole(e.target.value)}
              style={inp}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder="E-mail (opcional)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ ...inp, flex: 1 }}
            />
            <button
              onClick={add}
              disabled={saving}
              style={{
                background: 'var(--accent)', color: '#fff', border: 'none',
                borderRadius: 'var(--radius)', padding: '0 16px',
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? '...' : '+ Adicionar'}
            </button>
          </div>
          {err && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 6 }}>{err}</div>}
        </div>

        {/* People list */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {people.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text3)', fontSize: 13 }}>
              Nenhuma pessoa cadastrada ainda
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {people.map(p => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', background: 'var(--bg3)',
                  borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--accent-light)', color: 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 13, flexShrink: 0,
                    }}>
                      {p.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                        {[p.role, p.email].filter(Boolean).join(' · ') || 'Sem informações adicionais'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(p.id, p.name)}
                    style={{
                      fontSize: 12, color: 'var(--red)', background: 'none',
                      border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
                    }}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const inp: React.CSSProperties = {
  background: 'var(--bg2)', border: '1px solid var(--border2)',
  borderRadius: 'var(--radius)', padding: '9px 12px',
  color: 'var(--text)', fontSize: 13, outline: 'none', width: '100%',
}