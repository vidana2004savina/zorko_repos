'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function LoginForm() {  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') || 'brand'
  
  const [role, setRole] = useState<'brand' | 'blogger'>(initialRole as 'brand' | 'blogger')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (data.user) {
        // Проверяем роль пользователя в профиле
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          if (profileError.code === 'PGRST116') { // PGRST116 - record not found
            console.log('Профиль не найден, создаем новый...');
            const { error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: data.user.id,
                  full_name: data.user.user_metadata?.full_name || 'Пользователь',
                  role: role,
                },
              ])
            if (createError) throw createError
            
            // После создания профиля перенаправляем
            if (role === 'brand') {
              router.push('/onboarding/brand')
            } else {
              router.push('/dashboard/blogger')
            }
            return
          }
          throw profileError
        }

        // Перенаправляем в зависимости от роли
        if (profile.role === 'brand') {
          router.push('/dashboard/brand')
        } else {
          router.push('/dashboard/blogger')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Неверный email или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-gradient p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-blue-400/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-900/40 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-4xl shadow-2xl p-8 space-y-6 relative z-10 border border-white/20">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-blue-900">Вход</h1>
          <p className="text-blue-400/80 text-xs font-medium">Добро пожаловать в Зорко</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-2xl text-xs font-medium">
            {error}
          </div>
        )}

        <div className="flex p-1 bg-blue-50/50 rounded-2xl border border-blue-100/50">
          <button
            onClick={() => setRole('brand')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
              role === 'brand' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-blue-400 hover:text-blue-600'
            }`}
          >
            Бренд
          </button>
          <button
            onClick={() => setRole('blogger')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
              role === 'blogger' ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'text-blue-400 hover:text-blue-600'
            }`}
          >
            Блогер
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-blue-900/60 ml-1 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-200" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full h-12 pl-12 pr-5 bg-blue-50/30 border border-blue-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-blue-200 text-blue-900 font-medium text-base md:text-sm"
                placeholder="Введите Email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-blue-900/60 ml-1 uppercase tracking-wider">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-200" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full h-12 pl-12 pr-5 bg-blue-50/30 border border-blue-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-blue-200 text-blue-900 font-medium text-base md:text-sm"
                placeholder="Введите пароль"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 rounded-2xl text-white font-bold text-base shadow-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] ${
              role === 'brand' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Вход...' : 'Войти'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
        <p className="text-center text-xs text-blue-400 font-medium">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Зарегистрироваться
          </Link>
        </p>      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-main-gradient">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
