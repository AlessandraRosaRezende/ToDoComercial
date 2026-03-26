import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Project } from '../types'
import { StatusBadge } from './StatusBadge'

interface Props {
  project: Project
  hasQuestions: boolean
  onEdit: (p: Project) => void
  onDelete: (id: string) => void
}

export function ProjectCard({ project, hasQuestions, onEdit, onDelete }: Props) {
  const navigate = useNavigate()

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Excluir "${project.project}"? Esta ação não pode ser desfeita.`)) {
      onDelete(project.id)
    }
  }

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '20px 22px',
      position: 'relative', display: 'flex', flexDirection: 'column', gap: 12,
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border2)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)' }}
    >
      {/* Question indicator */}
      {hasQuestions && (
        <div title="Tem perguntas registradas" style={{
          position: 'absolute', top: 14, right: 14,
          background: 'var(--accent)', borderRadius: 999,
          width: 20, height: 20, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 11,
          boxShadow: '0 0 0 3px rgba(124,106,247,0.2)',
        }}>❓</div>
      )}

      {/* Title */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3, marginBottom: 4, paddingRight: 28 }}>
          {project.project}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text2)' }}>{project.subproduct}</div>
      </div>

      {/* Status */}
      <div><StatusBadge status={project.status} size="sm" /></div>

      {/* Owners */}
      {project.owners && project.owners.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {project.owners.map(name => (
            <span key={name} style={{
              fontSize: 11, fontWeight: 600, padding: '2px 9px',
              background: 'var(--bg4)', color: 'var(--text2)',
              borderRadius: 999, border: '1px solid var(--border2)',
            }}>
              {name}
            </span>
          ))}
        </div>
      )}

      {/* Next steps preview */}
      {project.next_steps && (
        <div style={{
          fontSize: 12, color: 'var(--text2)', lineHeight: 1.6,
          padding: '9px 12px', background: 'var(--bg3)', borderRadius: 8,
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          <span style={{ fontWeight: 700, color: 'var(--text3)', fontSize: 10, letterSpacing: '0.06em' }}>PRÓX. PASSOS · </span>
          {project.next_steps}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
          🗓 {project.deadline || 'Sem prazo'}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Btn label="Detalhes" onClick={() => navigate(`/project/${project.id}`)} primary />
          <Btn label="Editar" onClick={e => { e.stopPropagation(); onEdit(project) }} />
          <Btn label="✕" onClick={confirmDelete} danger />
        </div>
      </div>
    </div>
  )
}

function Btn({ label, onClick, primary, danger }: {
  label: string; onClick: (e: React.MouseEvent) => void; primary?: boolean; danger?: boolean
}) {
  return (
    <button onClick={onClick} style={{
      fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 7,
      border: '1px solid var(--border2)',
      background: primary ? 'var(--accent)' : 'var(--bg4)',
      color: primary ? '#fff' : danger ? 'var(--red)' : 'var(--text2)',
      cursor: 'pointer',
    }}>
      {label}
    </button>
  )
}