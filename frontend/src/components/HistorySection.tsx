import { HistoryEntry, FIELD_LABELS } from '../types'

export function HistorySection({ history }: { history: HistoryEntry[] }) {
  if (history.length === 0) {
    return (
      <div style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: '20px 0' }}>
        Nenhuma alteração registrada ainda.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {history.map((h, i) => (
        <div key={h.id} style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '10px 0',
          borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--bg4)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, fontSize: 12,
          }}>
            {h.changed_by.slice(0, 1).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{h.changed_by}</span>
              {' alterou '}
              <span style={{ color: 'var(--accent)', fontWeight: 500 }}>
                {FIELD_LABELS[h.field_name] ?? h.field_name}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {h.old_value && (
                <span style={{
                  fontSize: 12, padding: '2px 8px', borderRadius: 6,
                  background: 'var(--red-bg)', color: 'var(--red)',
                  textDecoration: 'line-through', maxWidth: 200,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {h.old_value}
                </span>
              )}
              {h.old_value && h.new_value && (
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>→</span>
              )}
              {h.new_value && (
                <span style={{
                  fontSize: 12, padding: '2px 8px', borderRadius: 6,
                  background: 'var(--green-bg)', color: 'var(--green)',
                  maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {h.new_value}
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
              {new Date(h.created_at).toLocaleString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}