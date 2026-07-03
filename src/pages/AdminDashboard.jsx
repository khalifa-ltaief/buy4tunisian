import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = ['pending', 'paid', 'processing', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/dashboard'); return; }
    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedOrder) fetchMessages(selectedOrder.id);
  }, [selectedOrder]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAll = async () => {
    const headers = { Authorization: `Bearer ${user.token}` };
    try {
      const [oRes, uRes] = await Promise.all([
        fetch('https://buy4tunisian-backend.onrender.com/api/admin/orders', { headers }),
        fetch('https://buy4tunisian-backend.onrender.com/api/admin/users', { headers }),
      ]);
      if (oRes.ok) setOrders(await oRes.json());
      if (uRes.ok) setUsers(await uRes.json());
    } catch {}
  };

  const fetchMessages = async (orderId) => {
    try {
      const res = await fetch(`https://buy4tunisian-backend.onrender.com/api/admin/messages/${orderId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) setMessages(await res.json());
    } catch {}
  };

  const acceptOrder = async (order) => {
    try {
      await fetch(`https://buy4tunisian-backend.onrender.com/api/admin/orders/${order.id}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchAll();
      setSelectedOrder({ ...order, accepted: true, status: 'paid' });
      fetchMessages(order.id);
    } catch {}
  };

  const updateStatus = async (orderId, status) => {
    try {
      await fetch(`https://buy4tunisian-backend.onrender.com/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch {}
  };

  const sendMessage = async () => {
    if (!msgText.trim()) return;
    try {
      await fetch('https://buy4tunisian-backend.onrender.com/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ order_id: selectedOrder.id, user_id: selectedOrder.user_id, content: msgText }),
      });
      setMsgText('');
      fetchMessages(selectedOrder.id);
    } catch {}
  };

  const stats = [
    { label: 'Total Orders', value: orders.length },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length },
    { label: 'Total Users', value: users.length },
  ];

  const statusColor = {
    pending: 'badge-pending', paid: 'badge-paid',
    delivered: 'badge-delivered', cancelled: 'badge-cancelled', processing: 'badge-pending',
  };

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', padding: '90px 24px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 8, padding: '4px 12px', fontSize: 12, color: 'var(--gold)', fontWeight: 600,
            }}>ADMIN</div>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.5px' }}>Control Panel</h1>
          </div>
          <p style={{ color: 'var(--text2)' }}>Manage orders, users, and chat with clients</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 16, padding: '20px 24px' }}>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Syne' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg3)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {[['orders', 'Orders'], ['users', 'Users']].map(([t, label]) => (
            <button key={t} onClick={() => { setTab(t); setSelectedOrder(null); }} style={{
              padding: '8px 20px', borderRadius: 10, border: 'none',
              background: tab === t ? 'var(--gold)' : 'transparent',
              color: tab === t ? '#0A0A0F' : 'var(--text2)',
              fontWeight: tab === t ? 600 : 400, fontSize: 14, transition: 'all 0.2s',
            }}>{label}</button>
          ))}
        </div>

        {/* Orders List */}
        {tab === 'orders' && !selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text3)' }}>No orders yet.</div>
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
                      {!o.accepted && <span style={{ fontSize: 11, background: 'rgba(239,68,68,0.1)', color: '#f87171', padding: '2px 8px', borderRadius: 50 }}>Needs Review</span>}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, wordBreak: 'break-all' }}>{o.course_url}</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                      {o.platform} · {o.payment_method} · <span style={{ color: 'var(--gold)' }}>{o.user_name}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gold)' }}>{o.price_dt} DT</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>${o.price_usd}</div>
                    <div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 8 }}>Open Chat →</div>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

              {/* Chat */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Chat — Order #{selectedOrder.id}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{selectedOrder.user_name} · {selectedOrder.user_email}</div>
                  </div>
                  <span className={`badge ${statusColor[selectedOrder.status] || 'badge-pending'}`}>{selectedOrder.status}</span>
                </div>

                <div style={{ height: 400, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {messages.map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: m.type === 'admin' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '75%', padding: '12px 16px', borderRadius: 16,
                        borderBottomRightRadius: m.type === 'admin' ? 4 : 16,
                        borderBottomLeftRadius: m.type === 'user' ? 4 : 16,
                        background: m.type === 'admin' ? 'rgba(201,168,76,0.15)' : 'var(--bg4)',
                        border: `1px solid ${m.type === 'admin' ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
                        fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                      }}>
                        {m.type === 'user' && (
                          <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, marginBottom: 6 }}>{selectedOrder.user_name}</div>
                        )}
                        {m.content}
                        {m.screenshot_url && (
                          <img src={m.screenshot_url} alt="screenshot" style={{ width: '100%', borderRadius: 8, marginTop: 8, cursor: 'pointer' }}
                            onClick={() => window.open(m.screenshot_url)} />
                        )}
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6, textAlign: 'right' }}>
                          {new Date(m.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                  <textarea
                    placeholder="Type a message..."
                    value={msgText} onChange={e => setMsgText(e.target.value)}
                    rows={2} style={{ flex: 1, padding: '10px 14px', fontSize: 14, resize: 'none' }}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  />
                  <button onClick={sendMessage} className="btn-gold" style={{ padding: '10px 20px', fontSize: 14 }}>
                    Send
                  </button>
                </div>
              </div>

              {/* Order Info + Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card">
                  <div style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600, marginBottom: 16 }}>Order Details</div>
                  {[
                    ['User', selectedOrder.user_name],
                    ['Email', selectedOrder.user_email],
                    ['Platform', selectedOrder.platform],
                    ['Payment', selectedOrder.payment_method],
                    ['Price', `$${selectedOrder.price_usd} = ${selectedOrder.price_dt} DT`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                      <span style={{ color: 'var(--text3)' }}>{k}</span>
                      <span style={{ fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4, wordBreak: 'break-all' }}>{selectedOrder.course_url}</div>
                </div>

                {/* Accept button */}
                {!selectedOrder.accepted && (
                  <button onClick={() => acceptOrder(selectedOrder)} className="btn-gold" style={{ padding: '14px', fontSize: 15 }}>
                    ✅ Accept Order
                  </button>
                )}

                {/* Status update */}
                <div className="card">
                  <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 10 }}>Update Status</div>
                  <select
                    value={selectedOrder.status}
                    onChange={e => { updateStatus(selectedOrder.id, e.target.value); setSelectedOrder({ ...selectedOrder, status: e.target.value }); }}
                    style={{ width: '100%', padding: '10px 14px', fontSize: 14, background: 'var(--bg4)' }}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Quick replies */}
                <div className="card">
                  <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 12 }}>Quick Replies</div>
                  {[
                    ['✅ Payment received', 'Payment received! We are now buying your course. Please wait...'],
                    ['🎓 Course delivered', 'Your course has been delivered! Check your credentials above. Enjoy learning! 🚀'],
                    ['⏳ Please wait', 'We are processing your order. Please wait a few minutes...'],
                  ].map(([label, msg]) => (
                    <button key={label} onClick={() => setMsgText(msg)} style={{
                      width: '100%', textAlign: 'left', padding: '8px 12px', marginBottom: 8,
                      background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: 8,
                      fontSize: 12, color: 'var(--text2)', cursor: 'pointer',
                    }}>{label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {users.map(u => (
              <div key={u.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 16, color: '#0A0A0F',
                }}>{u.name[0].toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{u.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)' }}>{u.email}</div>
                </div>
                {u.phone && <div style={{ fontSize: 13, color: 'var(--text3)' }}>{u.phone}</div>}
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>{orders.filter(o => o.user_id === u.id).length} orders</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>Joined {new Date(u.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}