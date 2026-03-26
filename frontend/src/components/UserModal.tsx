import React from 'react'
import { useState } from 'react'
import { useUser } from '../lib/UserContext'

export function UserModal() {
  const { user, setUser } = useUser()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')

  if (user) return null

  const submit = () => {
    if (!name.trim() || !email.trim()) { setErr('Preencha nome e e-mail'); return }
    setUser({ name: name.trim(), email: email.trim() })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        borderRadius: 'var(--radius-lg)', padding: 36, width: 380,
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
      }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Bem-vindo ao Follow-up</div>
          <div style={{ fontSize: 13, color: 'var(--text2)' }}>
            Informe seu nome e e-mail para identificar suas edições e comentários.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            placeholder="Seu nome"
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Seu e-mail"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            style={inputStyle}
          />
          {err && <div style={{ fontSize: 12, color: 'var(--red)' }}>{err}</div>}
          <button onClick={submit} style={btnStyle}>Entrar</button>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg3)', border: '1px solid var(--border2)',
  borderRadius: 'var(--radius)', padding: '10px 14px',
  color: 'var(--text)', fontSize: 14, outline: 'none', width: '100%',
}

const btnStyle: React.CSSProperties = {
  background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius)',
  padding: '11px 0', fontWeight: 600, fontSize: 14, marginTop: 4, width: '100%',
}