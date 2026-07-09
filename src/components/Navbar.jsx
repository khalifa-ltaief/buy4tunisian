 import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(251, 251, 252, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(201,168,76,0.1)',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 70,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne', fontWeight: 800, color: '#0A0A0F', fontSize: 16,
          }}>B4</div>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>
            buy4<span style={{ color: 'var(--gold)' }}>tunisian</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <span style={{ color: 'var(--text2)', fontSize: 14 }}>{user.name}</span>
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="btn-outline"
                style={{ padding: '8px 20px', fontSize: 14 }}
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} style={{
                background: 'none', border: 'none', color: 'var(--text3)',
                fontSize: 14, padding: '8px 12px', borderRadius: 8,
                transition: 'color 0.2s',
              }}
                onMouseOver={e => e.target.style.color = 'var(--text)'}
                onMouseOut={e => e.target.style.color = 'var(--text3)'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline" style={{ padding: '8px 20px', fontSize: 14 }}>
                Login
              </Link>
              <Link to="/register" className="btn-gold" style={{ padding: '8px 20px', fontSize: 14 }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
