import React, { useState, useEffect } from 'react'
import { Project, ProjectStatus, STATUS_CONFIG } from '../types'
import { createProject, updateProject, usePeople } from '../hooks/useProjects'
import { useUser } from '../lib/UserContext'
import { OwnersSelect } from './OwnersSelect'

interface Props {
  project?: Project | null
  onClose: () => void
  onSaved: () => void
}

const STATUSES = Object.keys(STATUS_CONFIG) as ProjectStatus[]

export function ProjectForm({ project, onClose, onSaved }: Props) {
  const { user } = useUser()
  const { people } = usePeople()
  const [form, setForm] = useState({
    project: project?.project ?? '',
    subproduct: project?.subproduct ?? '',
    status: (project?.status ?? '🔵 AGUARDANDO') as ProjectStatus,
    next_steps: project?.next_steps ?? '',
    observations: project?.observations ?? '',
    deadline: project?.deadline ?? '',
    owners: project?.owners ?? [],
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const set = (k: string, v: string | string[]) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.project.trim() || !form.subproduct.trim()) {
      setErr('Projeto e subproduto são obrigatórios')
      return
    }
    setSaving(true); setErr('')
    try {
      if (project) {
        await updateProject(project.id, { ...form, updated_by: user?.name ?? 'Anônimo' })
      } else {
        await createProject({ ...form, created_by: user?.name ?? 'Anônimo' })
      }
      onSaved(); onClose()
    } catch (e: any) {
      setErr(e.message ?? 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 500, backdropFilter: 'blur(3px)',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        borderRadius: 'var(--radius-lg)', padding: 32, width: 580,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {project ? 'Editar projeto' : 'Novo projeto'}
          </div>
          <button onClick={onClose} style={{ color: 'var(--text3)', fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Projeto / Frente *">
            <input style={inp} value={form.project} onChange={e => set('project', e.target.value)} placeholder="Ex: WhiteWall (Blip)" />
          </Field>

          <Field label="Subproduto / Descrição *">
            <input style={inp} value={form.subproduct} onChange={e => set('subproduct', e.target.value)} placeholder="Ex: Atendimento Digital (MG e Nacional)" />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Status">
              <select style={inp} value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                ))}
              </select>
            </Field>
            <Field label="Prazo / Sprint">
              <input style={inp} value={form.deadline} onChange={e => set('deadline', e.target.value)} placeholder="Ex: 30/03/26" />
            </Field>
          </div>

          <Field label="Responsáveis">
            <OwnersSelect
              people={people}
              selected={form.owners}
              onChange={owners => set('owners', owners)}
            />
          </Field>

          <Field label="Próximos Passos / Ação Requerida">
            <textarea
              style={{ ...inp, minHeight: 80, resize: 'vertical' }}
              value={form.next_steps}
              onChange={e => set('next_steps', e.target.value)}
              placeholder="Descreva as próximas ações..."
            />
          </Field>

          <Field label="Observações / Impedimentos">
            <textarea
              style={{ ...inp, minHeight: 80, resize: 'vertical' }}
              value={form.observations}
              onChange={e => set('observations', e.target.value)}
              placeholder="Contexto, impedimentos, notas relevantes..."
            />
          </Field>

          {err && (
            <div style={{ fontSize: 12, color: 'var(--red)', padding: '8px 12px', background: 'var(--red-bg)', borderRadius: 8 }}>
              {err}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={onClose} style={{ ...btn, background: 'var(--bg4)', color: 'var(--text2)' }}>Cancelar</button>
            <button onClick={submit} disabled={saving} style={{ ...btn, background: 'var(--accent)', color: '#fff', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Salvando...' : project ? 'Salvar alterações' : 'Criar projeto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  )
}

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)',
  borderRadius: 'var(--radius)', padding: '10px 12px',
  color: 'var(--text)', fontSize: 14, outline: 'none',
}

const btn: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 'var(--radius)',
  fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none',
}