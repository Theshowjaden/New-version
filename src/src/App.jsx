import React, { useState, useEffect } from 'react';

const THEME = {
  bg: '#080b0f',
  surface: '#0d1117',
  border: '#1c2230',
  text: '#c8d4e0',
  textDim: '#4a5568',
  accent: '#3b82f6',
  green: '#22c55e',
  red: '#ef4444',
  amber: '#f59e0b',
};

const CHECKLIST = [
  { id: 'htf1', label: 'HTF: Lower Highs + Lower Lows', type: 'check' },
  { id: 'htf2', label: 'HTF: Clean pullback structure', type: 'check' },
  { id: 'sweep1', label: 'SWEEP: BSL wicked', type: 'check' },
  { id: 'sweep2', label: 'SWEEP: Trendline rejection', type: 'check' },
  { id: 'entry1', label: 'ENTRY: CHOCH to downside', type: 'check' },
  { id: 'entry2', label: 'ENTRY: Displacement confirmed', type: 'check' },
  { id: 'entry3', label: 'ENTRY: BOS follows CHOCH', type: 'check' },
  { id: 'poi', label: 'POI Selection', type: 'radio', options: ['FVG', 'OB'] },
  { id: 'sl', label: 'Stop Loss', type: 'radio', options: ['Conservative', 'Less Conservative'] },
  { id: 'target1', label: 'TARGET: Clear path LL', type: 'check' },
  { id: 'target2', label: 'TARGET: 1:3 R:R confirmed', type: 'check' },
];

function App() {
  const [trades, setTrades] = useState([]);
  const [view, setView] = useState('log');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    pair: 'XAU/USD',
    session: 'London',
    checklist: {},
    outcome: '',
    r: '',
    notes: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('smc_trades');
    if (saved) {
      setTrades(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('smc_trades', JSON.stringify(trades));
  }, [trades]);

  const handleSave = () => {
    if (editId) {
      setTrades(trades.map(t => (t.id === editId ? { ...formData, id: editId } : t)));
    } else {
      setTrades([{ ...formData, id: Date.now() }, ...trades]);
    }
    resetForm();
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      pair: 'XAU/USD',
      session: 'London',
      checklist: {},
      outcome: '',
      r: '',
      notes: '',
    });
  };

  const handleEdit = (trade) => {
    setEditId(trade.id);
    setFormData(trade);
    setView('form');
  };

  const handleDelete = (id) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  const getScore = (checklist) => {
    const total = CHECKLIST.length;
    const done = Object.values(checklist).filter(v => v === true || v).length;
    return { done, total };
  };

  const stats = {
    total: trades.length,
    wins: trades.filter(t => t.outcome === 'Win').length,
    losses: trades.filter(t => t.outcome === 'Loss').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: THEME.bg, color: THEME.text, fontFamily: "'Courier New', monospace" }}>
      <div style={{ background: THEME.surface, borderBottom: `1px solid ${THEME.border}`, padding: '20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: THEME.textDim, textTransform: 'uppercase' }}>
            SMC TRADING SYSTEM
          </div>
          <h1 style={{ fontSize: 28, margin: '8px 0 0 0', fontWeight: 700 }}>TRADE JOURNAL</h1>
        </div>
      </div>

      <div style={{ display: 'flex', background: THEME.surface, borderBottom: `1px solid ${THEME.border}` }}>
        {['log', 'form', 'stats'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setView(tab);
              if (tab !== 'form') {
                resetForm();
              }
            }}
            style={{
              flex: 1,
              padding: '14px',
              background: 'none',
              border: 'none',
              borderBottom: view === tab ? `2px solid ${THEME.accent}` : '2px solid transparent',
              color: view === tab ? THEME.accent : THEME.textDim,
              fontSize: 11,
              letterSpacing: 2,
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            {tab === 'log' ? 'LOG' : tab === 'form' ? '+ NEW' : 'STATS'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px' }}>
        {view === 'log' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: THEME.textDim }}>
                {stats.total} total · {stats.wins} wins · {stats.losses} losses
              </div>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {trades.length === 0 ? (
                <div style={{ textAlign: 'center', color: THEME.textDim, padding: '40px 20px' }}>
                  No trades yet. Create one to get started.
                </div>
              ) : (
                trades.map(trade => {
                  const score = getScore(trade.checklist);
                  const pct = Math.round((score.done / score.total) * 100);
                  return (
                    <div
                      key={trade.id}
                      onClick={() => handleEdit(trade)}
                      style={{
                        background: THEME.surface,
                        border: `1px solid ${THEME.border}`,
                        borderRadius: 6,
                        padding: 16,
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{trade.pair}</div>
                          <div style={{ fontSize: 11, color: THEME.textDim }}>{trade.session} · {trade.date}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 12, color: trade.outcome === 'Win' ? THEME.green : trade.outcome === 'Loss' ? THEME.red : THEME.textDim }}>
                            {trade.outcome || 'PENDING'}
                          </div>
                          {trade.r && <div style={{ fontSize: 11, color: THEME.text }}>{trade.r}R</div>}
                        </div>
                      </div>
                      <div style={{ height: 3, background: THEME.border, borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? THEME.green : THEME.amber }} />
                      </div>
                      <div style={{ fontSize: 10, color: THEME.textDim, marginTop: 8 }}>
                        {score.done}/{score.total} rules ({pct}%)
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {view === 'form' && (
          <div style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 6, padding: 20 }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: 16 }}>
              {editId ? 'EDIT TRADE' : 'NEW TRADE'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 11, color: THEME.textDim, display: 'block', marginBottom: 6 }}>DATE</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  style={{ width: '100%', padding: 8, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 4, fontFamily: 'inherit' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: THEME.textDim, display: 'block', marginBottom: 6 }}>PAIR</label>
                <input
                  type="text"
                  value={formData.pair}
                  onChange={e => setFormData({ ...formData, pair: e.target.value })}
                  style={{ width: '100%', padding: 8, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 4, fontFamily: 'inherit' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: THEME.textDim, display: 'block', marginBottom: 6 }}>SESSION</label>
                <select
                  value={formData.session}
                  onChange={e => setFormData({ ...formData, session: e.target.value })}
                  style={{ width: '100%', padding: 8, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 4, fontFamily: 'inherit' }}
                >
                  <option value="London">London</option>
                  <option value="New York">New York</option>
                  <option value="Overlap">Overlap</option>
                  <option value="Asia">Asia</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: THEME.textDim, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>CHECKLIST</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {CHECKLIST.map(item => (
                  <div key={item.id}>
                    {item.type === 'check' ? (
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.checklist[item.id] || false}
                          onChange={e => setFormData({ ...formData, checklist: { ...formData.checklist, [item.id]: e.target.checked } })}
                        />
                        <span style={{ fontSize: 12 }}>{item.label}</span>
                      </label>
                    ) : (
                      <div>
                        <div style={{ fontSize: 11, color: THEME.textDim, marginBottom: 6 }}>{item.label}</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {item.options.map(opt => (
                            <button
                              key={opt}
                              onClick={() => setFormData({ ...formData, checklist: { ...formData.checklist, [item.id]: opt } })}
                              style={{
                                padding: '8px 12px',
                                background: formData.checklist[item.id] === opt ? THEME.accent : THEME.bg,
                                border: `1px solid ${formData.checklist[item.id] === opt ? THEME.accent : THEME.border}`,
                                color: formData.checklist[item.id] === opt ? '#fff' : THEME.text,
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontSize: 11,
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {editId && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 11, color: THEME.textDim, display: 'block', marginBottom: 6 }}>OUTCOME</label>
                  <select
                    value={formData.outcome}
                    onChange={e => setFormData({ ...formData, outcome: e.target.value })}
                    style={{ width: '100%', padding: 8, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 4, fontFamily: 'inherit' }}
                  >
                    <option value="">Select</option>
                    <option value="Win">Win</option>
                    <option value="Loss">Loss</option>
                    <option value="Breakeven">Breakeven</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: THEME.textDim, display: 'block', marginBottom: 6 }}>R RATIO</label>
                  <input
                    type="text"
                    value={formData.r}
                    onChange={e => setFormData({ ...formData, r: e.target.value })}
                    placeholder="3.0"
                    style={{ width: '100%', padding: 8, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 4, fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: THEME.textDim, display: 'block', marginBottom: 6 }}>NOTES</label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Trade observations..."
                style={{ width: '100%', padding: 8, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 4, minHeight: 60, fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleSave}
                style={{ flex: 1, padding: 12, background: THEME.accent, border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
              >
                SAVE
              </button>
              <button
                onClick={resetForm}
                style={{ flex: 1, padding: 12, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
              >
                CANCEL
              </button>
              {editId && (
                <button
                  onClick={() => {
                    handleDelete(editId);
                    resetForm();
                  }}
                  style={{ flex: 1, padding: 12, background: THEME.red, border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
                >
                  DELETE
                </button>
              )}
            </div>
          </div>
        )}

        {view === 'stats' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <StatCard label="TOTAL" value={stats.total} />
            <StatCard label="WINS" value={stats.wins} color={THEME.green} />
            <StatCard label="LOSSES" value={stats.losses} color={THEME.red} />
            <StatCard label="WIN RATE" value={stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) + '%' : '—'} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 6, padding: 20 }}>
      <div style={{ fontSize: 11, color: THEME.textDim, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: color || THEME.text }}>
        {value}
      </div>
    </div>
  );
}

export default App;
