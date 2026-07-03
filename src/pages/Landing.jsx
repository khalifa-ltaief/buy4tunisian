import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const SLIDES = [
  {
    tag: 'Available in Tunisia 🇹🇳',
    title: 'Any service,',
    highlight: 'paid your way',
    sub: "Can't pay internationally? We do it for you. Courses, subscriptions, games and more — pay with D17 or Binance.",
  },
  {
    tag: 'Netflix • Spotify • ChatGPT',
    title: 'Top subscriptions,',
    highlight: 'delivered fast',
    sub: 'Get access to the world\'s best apps and services. Pay locally in DT — we handle the rest.',
  },
  {
    tag: 'Free Fire • Steam • PlayStation',
    title: 'Game top-ups,',
    highlight: 'instant delivery',
    sub: 'Top up your favorite games in minutes. Just send your player ID and we\'ll charge it right away.',
  },
  {
    tag: 'Udemy • Coursera • LinkedIn',
    title: 'World-class courses,',
    highlight: 'no limits',
    sub: 'Access any online course from any platform. Pay with D17 or eDinar and get credentials to your dashboard.',
  },
];

const CATEGORIES = [
  {
    icon: '🎓', title: 'Online Courses',
    desc: 'Udemy, Coursera, LinkedIn Learning, Skillshare, MasterClass and more.',
    examples: ['Udemy', 'Coursera', 'Skillshare', 'MasterClass'],
  },
  {
    icon: '🎬', title: 'Subscriptions',
    desc: 'Netflix, Spotify, ChatGPT Plus, Canva Pro, Adobe and more.',
    examples: ['Netflix', 'Spotify', 'ChatGPT Plus', 'Adobe'],
  },
  {
    icon: '🎮', title: 'Game Top-ups',
    desc: 'Free Fire, PES, Steam, PlayStation, Xbox, Valorant and more.',
    examples: ['Free Fire', 'Steam', 'PlayStation', 'Valorant'],
  },
  {
    icon: '🛒', title: 'Other Services',
    desc: 'Anything else you need paid internationally — just ask us!',
    examples: ['Amazon', 'App Store', 'Google Play', 'Any Service'],
  },
];

const STEPS = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up in seconds. No international card needed.', icon: '👤' },
  { num: '02', title: 'Submit Your Request', desc: 'Choose what you want, fill in the details and send.', icon: '📋' },
  { num: '03', title: 'Pay Locally', desc: 'Pay via D17 or Binance — 100% Tunisian-friendly.', icon: '💳' },
  { num: '04', title: 'Get Your Access', desc: 'We handle everything and deliver to your dashboard.', icon: '🎓' },
];

const TESTIMONIALS = [
  { name: 'Amine B.', city: 'Tunis', text: 'Finally I can access Udemy courses! Got my Python course within 2 hours.', rating: 5 },
  { name: 'Sarra M.', city: 'Sousse', text: 'Subscribed to Netflix and Spotify same day. Super fast and trusted!', rating: 5 },
  { name: 'Youssef K.', city: 'Sfax', text: 'Topped up my Free Fire diamonds in 10 minutes. Highly recommend!', rating: 5 },
];

const FAQS = [
  { q: 'Which payment methods do you accept?', a: 'We accept D17 and Binance — all Tunisian-friendly payment methods.' },
  { q: 'How long does it take to get my order?', a: "Usually within a few hours after payment confirmation. We notify you as soon as it's ready." },
  { q: 'Which services do you support?', a: 'We support online courses, subscriptions like Netflix and Spotify, game top-ups, and much more. Just ask!' },
  { q: 'Is it safe and secure?', a: 'Yes. Everything is delivered privately through your personal dashboard.' },
  { q: 'What if I have a problem?', a: "Contact us through your dashboard chat and we'll resolve it as quickly as possible." },
];

export default function Landing() {
  const [visible, setVisible] = useState(false);
  const [slide, setSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[slide];

  return (
    <div style={{ paddingTop: 70 }}>

      {/* HERO SLIDER */}
      <section style={{
        minHeight: '92vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden', padding: '80px 24px',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(rgba(201,168,76,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px', pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: 1200, margin: '0 auto', width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center',
        }}>
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 50, padding: '6px 16px', marginBottom: 28, transition: 'all 0.5s',
            }}>
              <span style={{ width: 6, height: 6, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
              <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 500 }}>{s.tag}</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 24, transition: 'all 0.5s',
            }}>
              {s.title}{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--gold), #E8C97A)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.highlight}</span>
            </h1>

            <p style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
              {s.sub}
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-gold" style={{ fontSize: 16, padding: '14px 36px' }}>
                Start Now — It's Free
              </Link>
              <Link to="/login" className="btn-outline" style={{ fontSize: 16, padding: '14px 36px' }}>
                I have an account
              </Link>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 40 }}>
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} style={{
                  width: i === slide ? 28 : 8, height: 8, borderRadius: 50,
                  background: i === slide ? 'var(--gold)' : 'rgba(201,168,76,0.25)',
                  border: 'none', transition: 'all 0.3s', cursor: 'pointer', padding: 0,
                }} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
              {[['1000+', 'Orders delivered'], ['2h', 'Avg delivery time'], ['100%', 'Secure & trusted']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Syne', color: 'var(--gold)' }}>{val}</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Card */}
         <div className="hero-card-wrapper" style={{
  opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)',
  transition: 'all 0.7s ease 0.2s', display: 'flex', justifyContent: 'center',
}}>
            <div style={{
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 24, padding: 28, width: '100%', maxWidth: 420,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 500 }}>ORDER #1042</span>
                <span className="badge badge-delivered">✓ Delivered</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {[
                  { icon: '🎓', name: 'React Complete Guide', sub: 'Udemy Course', color: '#A435F0' },
                  { icon: '🎬', name: 'Netflix Premium', sub: '1 Month Subscription', color: '#E50914' },
                  { icon: '🎮', name: 'Free Fire — 1000 Diamonds', sub: 'Game Top-up', color: '#FF6B35' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: 'var(--bg4)', borderRadius: 12, padding: '12px 14px',
                    display: 'flex', gap: 12, alignItems: 'center',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: `${item.color}22`, border: `1px solid ${item.color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    }}>{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 10, padding: '12px 14px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>Paid via D17</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)' }}>180 DT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid var(--border2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>What we offer</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px' }}>Everything you need, one place</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="card" style={{ transition: 'all 0.25s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{cat.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{cat.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 16 }}>{cat.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {cat.examples.map(ex => (
                    <span key={ex} style={{
                      fontSize: 12, padding: '3px 10px', borderRadius: 50,
                      background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
                      color: 'var(--gold)',
                    }}>{ex}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>How it works</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px' }}>
              From request to delivery<br />in under 2 hours
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {STEPS.map(st => (
              <div key={st.num} className="card" style={{ position: 'relative', overflow: 'hidden', transition: 'all 0.25s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{
                  position: 'absolute', top: -10, right: -10, fontSize: 72, fontWeight: 900,
                  fontFamily: 'Syne', color: 'rgba(201,168,76,0.05)', lineHeight: 1,
                }}>{st.num}</div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{st.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{st.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>Testimonials</p>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800 }}>Trusted by Tunisian users</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card">
                <div style={{ color: 'var(--gold)', fontSize: 18, marginBottom: 14 }}>{'★'.repeat(t.rating)}</div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text2)', marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14, color: '#0A0A0F',
                  }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>FAQ</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px' }}>Common Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: 'var(--bg3)', border: '1px solid',
                borderColor: openFaq === i ? 'rgba(201,168,76,0.4)' : 'var(--border)',
                borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s',
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', padding: '20px 24px', background: 'none', border: 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', gap: 16,
                }}>
                  <span style={{ fontWeight: 600, fontSize: 15, textAlign: 'left', color: 'var(--text1)' }}>{faq.q}</span>
                  <span style={{
                    color: 'var(--gold)', fontSize: 22, flexShrink: 0,
                    transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)',
                    display: 'inline-block',
                  }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 20px', fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 20 }}>
            Ready to get started?<br />
            <span style={{ color: 'var(--gold)' }}>No limits.</span>
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 17, marginBottom: 40 }}>
            Join thousands of Tunisians accessing world-class services.
          </p>
          <Link to="/register" className="btn-gold" style={{ fontSize: 17, padding: '16px 48px' }}>
            Create Free Account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border2)', padding: '32px 24px',
        textAlign: 'center', color: 'var(--text3)', fontSize: 13,
      }}>
        <div style={{ marginBottom: 8, fontFamily: 'Syne', fontWeight: 600, color: 'var(--text2)' }}>
          buy4<span style={{ color: 'var(--gold)' }}>tunisian</span>
        </div>
        <div>Made with ❤️ By Khalifa Ltaief · 2026</div>
      </footer>
    </div>
  );
}