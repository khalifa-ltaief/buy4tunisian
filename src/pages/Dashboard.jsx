import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RATES = { USD: 4.0, EUR: 4.5 };

const CATEGORIES = {
  course: {
    label: '🎓 Online Course',
    fields: ['course_url', 'platform', 'price', 'notes'],
    platforms: ['Udemy', 'Coursera', 'LinkedIn Learning', 'Skillshare', 'MasterClass', 'Pluralsight', 'edX', 'Domestika', 'Other'],
  },
  subscription: {
    label: '🎬 Subscription',
    fields: ['service', 'plan', 'price', 'notes'],
    services: ['Netflix', 'Spotify', 'ChatGPT Plus', 'Canva Pro', 'Adobe Creative Cloud', 'YouTube Premium', 'Disney+', 'Microsoft 365', 'Other'],
    plans: ['1 Month', '3 Months', '6 Months', '1 Year'],
  },
  game: {
    label: '🎮 Game Top-up',
    fields: ['game', 'amount', 'player_id', 'price', 'notes'],
    games: ['Free Fire', 'eFootball / PES', 'Steam', 'PlayStation Store', 'Xbox', 'Valorant', 'PUBG', 'League of Legends', 'Other'],
  },
  other: {
    label: '🛒 Other Service',
    fields: ['description', 'price', 'notes'],
  },
};

const PAYMENT_METHODS = ['Binance'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState('orders');
  const [category, setCategory] = useState('course');
  const [form, setForm] = useState({
    course_url: '', platform: 'Udemy',
    service: 'Netflix', plan: '1 Month',
    game: 'Free Fire', amount: '', player_id: '',
    description: '',
    price: '', currency: 'USD',
    payment_method: 'D17', notes: '',
  });
  const [sending, setSending] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) fetchMessages(selectedOrder.id);
  }, [selectedOrder]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://buy4tunisian-backend.onrender.com/api/orders/mine', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) setOrders(await res.json());
    } catch {}
  };

  const fetchMessages = async (orderId) => {
    try {
      const res = await fetch(`https://buy4tunisian-backend.onrender.com/api/messages/${orderId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) { console.log(err); }
  };

  const buildOrderDetails = () => {
    const cat = CATEGORIES[category];
    const price_dt = (parseFloat(form.price) * RATES[form.currency]).toFixed(2);
    let course_url = '';
    let details = '';

    if (category === 'course') {
      course_url = form.course_url;
      details = `[COURSE] ${form.platform}`;
    } else if (category === 'subscription') {
      course_url = `${form.service} — ${form.plan}`;
      details = `[SUBSCRIPTION] ${form.service} · ${form.plan}`;
    } else if (category === 'game') {
      course_url = `${form.game} — ${form.amount}`;
      details = `[GAME] ${form.game} · ${form.amount} · Player ID: ${form.player_id}`;
    } else {
      course_url = form.description;
      details = `[OTHER] ${form.description}`;
    }

    return { course_url, details, price_dt, platform: category, payment_method: form.payment_method, price_usd: form.price, notes: form.notes };
  };

  const submitOrder = async () => {
    if (!form.price) return;
    setSending(true);
    try {
      const { course_url, price_dt, platform, payment_method, price_usd, notes } = buildOrderDetails();
      const res = await fetch('https://buy4tunisian-backend.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ course_url, platform, payment_method, price_usd, price_dt, notes, currency: form.currency }),
      });
      if (res.ok) {
        setForm({
          course_url: '', platform: 'Udemy', service: 'Netflix', plan: '1 Month',
          game: 'Free Fire', amount: '', player_id: '', description: '',
          price: '', currency: 'USD', payment_method: 'D17', notes: '',
        });
        setTab('orders');
        fetchOrders();
      }
    } catch {} finally { setSending(false); }
  };

  const sendMessage = async () => {
    if (!msgText.trim() && !screenshot) return;
    try {
      await fetch('https://buy4tunisian-backend.onrender.com/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          content: msgText || '📸 Screenshot sent',
          type: 'user',
          screenshot_url: screenshot || null,
        }),
      });
      setMsgText('');
      setScreenshot('');
      await fetchMessages(selectedOrder.id);
    } catch (err) { console.log(err); }
  };

  const handleScreenshot = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setScreenshot(reader.result);
    reader.readAsDataURL(file);
  };

  const priceDT = form.price ? (parseFloat(form.price) * RATES[form.currency]).toFixed(2) : null;

  const statusColor = {
    pending: 'badge-pending', paid: 'badge-paid',
    delivered: 'badge-delivered', cancelled: 'badge-cancelled', processing: 'badge-pending',
  };

  const cat = CATEGORIES[category];

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', padding: '90px 24px 40px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Hey, {user?.name} 👋</h1>
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>Manage your requests</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-outline" style={{ fontSize: 13, padding: '8px 18px' }}>
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--bg3)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {[['orders', 'My Orders'], ['new', 'New Request']].map(([t, label]) => (
            <button key={t} onClick={() => { setTab(t); setSelectedOrder(null); }} style={{
              padding: '8px 20px', borderRadius: 10, border: 'none',
              background: tab === t ? 'var(--gold)' : 'transparent',
              color: tab === t ? '#0A0A0F' : 'var(--text2)',
              fontWeight: tab === t ? 600 : 400, fontSize: 14, transition: 'all 0.2s',
            }}>{label}</button>
          ))}
        </div>

        {/* New Request Form */}
        {tab === 'new' && (
          <div className="card" style={{ maxWidth: 580, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>New Request</h2>

            {/* Category selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10, display: 'block' }}>What do you want?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {Object.entries(CATEGORIES).map(([key, val]) => (
                  <button key={key} onClick={() => setCategory(key)} style={{
                    padding: '12px 16px', borderRadius: 12, border: '1px solid',
                    borderColor: category === key ? 'var(--gold)' : 'var(--border)',
                    background: category === key ? 'rgba(201,168,76,0.1)' : 'var(--bg4)',
                    color: category === key ? 'var(--gold)' : 'var(--text2)',
                    fontWeight: category === key ? 600 : 400, fontSize: 14,
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                  }}>{val.label}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* COURSE fields */}
              {category === 'course' && (
                <>
                  <div>
                    <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, display: 'block' }}>Course Link *</label>
                    <input placeholder="https://www.udemy.com/course/..."
                      value={form.course_url} onChange={e => setForm({ ...form, course_url: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', fontSize: 14 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, display: 'block' }}>Platform</label>
                    <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', fontSize: 14, background: 'var(--bg4)' }}>
                      {cat.platforms.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* SUBSCRIPTION fields */}
              {category === 'subscription' && (
                <>
                  <div>
                    <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, display: 'block' }}>Service</label>
                    <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', fontSize: 14, background: 'var(--bg4)' }}>
                      {cat.services.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, display: 'block' }}>Plan Duration</label>
                    <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', fontSize: 14, background: 'var(--bg4)' }}>
                      {cat.plans.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* GAME fields */}
              {category === 'game' && (
                <>
                  <div>
                    <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, display: 'block' }}>Game</label>
                    <select value={form.game} onChange={e => setForm({ ...form, game: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', fontSize: 14, background: 'var(--bg4)' }}>
                      {cat.games.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, display: 'block' }}>Amount / Package</label>
                    <input placeholder="e.g. 1000 Diamonds, Top-up 50$..."
                      value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', fontSize: 14 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, display: 'block' }}>Player ID / Username *</label>
                    <input placeholder="Your in-game ID or username"
                      value={form.player_id} onChange={e => setForm({ ...form, player_id: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', fontSize: 14 }} />
                  </div>
                </>
              )}

              {/* OTHER fields */}
              {category === 'other' && (
                <div>
                  <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, display: 'block' }}>Describe what you need *</label>
                  <textarea placeholder="e.g. Amazon purchase, App Store top-up..."
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3} style={{ width: '100%', padding: '12px 16px', fontSize: 14, resize: 'vertical' }} />
                </div>
              )}

              {/* Price + Currency */}
              <div>
                <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, display: 'block' }}>Price *</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}
                    style={{ padding: '12px 16px', fontSize: 14, background: 'var(--bg4)', borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text1)', width: 90 }}>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input type="number" placeholder="e.g. 15"
                      value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', fontSize: 14, paddingRight: priceDT ? 110 : 16 }} />
                    {priceDT && (
                      <div style={{
                        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: 8, padding: '4px 10px', fontSize: 13, color: 'var(--gold)', fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}>= {priceDT} DT</div>
                    )}
                  </div>
                </div>
                {priceDT && (
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>
                    Rate: 1 {form.currency} = {RATES[form.currency]} DT
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, display: 'block' }}>Payment Method</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {PAYMENT_METHODS.map(pm => (
                    <button key={pm} onClick={() => setForm({ ...form, payment_method: pm })} style={{
                      flex: 1, padding: '10px', borderRadius: 10, border: '1px solid',
                      borderColor: form.payment_method === pm ? 'var(--gold)' : 'var(--border)',
                      background: form.payment_method === pm ? 'rgba(201,168,76,0.1)' : 'var(--bg4)',
                      color: form.payment_method === pm ? 'var(--gold)' : 'var(--text2)',
                      fontWeight: form.payment_method === pm ? 600 : 400,
                      cursor: 'pointer', fontSize: 14, transition: 'all 0.2s',
                    }}>{pm === 'D17' ? '💳 D17' : '💰 Binance'}</button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, display: 'block' }}>Notes (optional)</label>
                <textarea placeholder="Any special instructions..."
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={2} style={{ width: '100%', padding: '12px 16px', fontSize: 14, resize: 'vertical' }} />
              </div>

              <button onClick={submitOrder} disabled={sending || !form.price}
                className="btn-gold" style={{ padding: '14px', fontSize: 15, opacity: (sending || !form.price) ? 0.6 : 1 }}>
                {sending ? 'Sending...' : 'Send Request →'}
              </button>
            </div>
          </div>
        )}

        {/* Orders List */}
        {tab === 'orders' && !selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text3)' }}>
                No orders yet.{' '}
                <button onClick={() => setTab('new')} style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Make your first request →
                </button>
              </div>
            ) : orders.map(o => (
              <div key={o.id} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setSelectedOrder(o)}
                onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border2)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>#{o.id}</span>
                      <span className={`badge ${statusColor[o.status] || 'badge-pending'}`}>{o.status}</span>
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>{o.platform}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, wordBreak: 'break-all' }}>{o.course_url}</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)' }}>{o.payment_method}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gold)' }}>{o.price_dt} DT</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{o.price_usd} {o.currency || 'USD'}</div>
                    <div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 8, fontWeight: 500 }}>View Chat →</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat View */}
        {tab === 'orders' && selectedOrder && (
          <div>
            <button onClick={() => setSelectedOrder(null)} style={{
              background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer',
              fontSize: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6,
            }}>← Back to orders</button>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Order #{selectedOrder.id}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{selectedOrder.course_url}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>{selectedOrder.price_dt} DT</div>
                  <span className={`badge ${statusColor[selectedOrder.status] || 'badge-pending'}`}>{selectedOrder.status}</span>
                </div>
              </div>

              <div style={{ height: 380, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text3)', marginTop: 60 }}>
                    Waiting for admin to respond...
                  </div>
                )}
                {messages.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: m.type === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '75%', padding: '12px 16px', borderRadius: 16,
                      borderBottomRightRadius: m.type === 'user' ? 4 : 16,
                      borderBottomLeftRadius: m.type === 'admin' ? 4 : 16,
                      background: m.type === 'user' ? 'rgba(201,168,76,0.15)' : 'var(--bg4)',
                      border: `1px solid ${m.type === 'user' ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
                      fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                    }}>
                      {m.type === 'admin' && (
                        <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600, marginBottom: 6 }}>Admin</div>
                      )}
                      {m.content}
                      {m.screenshot_url && (
                        <img src={m.screenshot_url} alt="screenshot" style={{ width: '100%', borderRadius: 8, marginTop: 8 }} />
                      )}
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6, textAlign: 'right' }}>
                        {new Date(m.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
                {screenshot && (
                  <div style={{ marginBottom: 10, position: 'relative', display: 'inline-block' }}>
                    <img src={screenshot} alt="preview" style={{ height: 80, borderRadius: 8 }} />
                    <button onClick={() => setScreenshot('')} style={{
                      position: 'absolute', top: -8, right: -8, background: '#ef4444',
                      border: 'none', borderRadius: '50%', width: 20, height: 20,
                      color: '#fff', cursor: 'pointer', fontSize: 12,
                    }}>×</button>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <label style={{ cursor: 'pointer', padding: '10px 14px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: 10 }}>
                    📸
                    <input type="file" accept="image/*" onChange={handleScreenshot} style={{ display: 'none' }} />
                  </label>
                  <textarea placeholder="Type a message..."
                    value={msgText} onChange={e => setMsgText(e.target.value)}
                    rows={2} style={{ flex: 1, padding: '10px 14px', fontSize: 14, resize: 'none' }}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  />
                  <button onClick={sendMessage} className="btn-gold" style={{ padding: '10px 20px', fontSize: 14 }}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}