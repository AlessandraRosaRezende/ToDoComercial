import React from 'react'
import { ProjectStatus, STATUS_CONFIG } from '../types'

export function StatusBadge({ status, size = 'md' }: { status: ProjectStatus; size?: 'sm' | 'md' }) {
  const cfg = STATUS_CONFIG[status]
  const s: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: size === 'sm' ? '3px 10px' : '4px 12px',
    borderRadius: 999,
    background: cfg.bg,
    color: cfg.color,
    fontSize: size === 'sm' ? 11 : 12,
    fontWeight: 700,
    letterSpacing: '0.06em',
    whiteSpace: 'nowrap',
  }
  return (
    <span style={s}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  )
}