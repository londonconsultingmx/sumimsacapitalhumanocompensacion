import React, { useState } from 'react'
import BrandMark from './BrandMark.jsx'

// Acceso sencillo antes de la portada. Es una barrera del lado del cliente
// (el sitio es estático en GitHub Pages): detiene visitas casuales, no es
// seguridad de servidor. Las credenciales se validan contra un hash SHA-256
// de "usuario|contraseña" para no dejarlas legibles en el bundle.
const AUTH_KEY = 'sumimsa-auth'
const AUTH_HASH = '02c56cfb6b09c4805d260b1ffc7cf820eb4329eba33208760a8bb8e92df863d8'

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function isAuthed() {
  try {
    return sessionStorage.getItem(AUTH_KEY) === AUTH_HASH
  } catch {
    return false
  }
}

export default function LoginGate({ onSuccess }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setChecking(true)
    setError(false)
    const hash = await sha256Hex(`${user.trim().toLowerCase()}|${pass}`)
    if (hash === AUTH_HASH) {
      try {
        sessionStorage.setItem(AUTH_KEY, AUTH_HASH)
      } catch {
        // sin sessionStorage (modo privado estricto) — se permite igual
      }
      onSuccess()
    } else {
      setError(true)
      setChecking(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white rounded-md shadow-card p-8 flex flex-col gap-5"
      >
        <div className="flex flex-col items-center gap-2">
          <BrandMark size="lg" caption={null} />
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted mt-2">
            Compensación Variable · Subdirecciones
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-user" className="text-xs font-semibold text-slate-600">
            Usuario
          </label>
          <input
            id="login-user"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
            autoFocus
            className="border border-slate-300 rounded-sm px-3 py-2 text-sm focus:border-teal focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-pass" className="text-xs font-semibold text-slate-600">
            Contraseña
          </label>
          <input
            id="login-pass"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
            className="border border-slate-300 rounded-sm px-3 py-2 text-sm focus:border-teal focus:outline-none"
          />
        </div>

        {error && (
          <div className="text-xs font-semibold" style={{ color: '#B91C1C' }}>
            Usuario o contraseña incorrectos.
          </div>
        )}

        <button
          type="submit"
          disabled={checking || !user || !pass}
          className="bg-teal hover:bg-teal-dark disabled:opacity-50 transition text-white px-4 py-2.5 rounded-sm text-sm font-semibold"
        >
          {checking ? 'Verificando…' : 'Entrar'}
        </button>

        <div className="text-[10px] text-muted text-center">
          Acceso restringido · Dirección de Capital Humano
        </div>
      </form>
    </div>
  )
}
