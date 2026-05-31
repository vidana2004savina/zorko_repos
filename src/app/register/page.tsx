'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Building2, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function RegisterForm() {  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') || 'brand'
  
  const [role, setRole] = useState<'brand' | 'blogger'>(initialRole as 'brand' | 'blogger')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      console.log('Начинаем регистрацию...', { email, role });
      // 1. Регистрация пользователя в Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          }
        }
      })

      if (authError) {
        console.error('Ошибка Auth:', authError);
        setError(authError.message === 'User already registered' 
          ? 'Пользователь с таким Email уже зарегистрирован' 
          : authError.message);
        setLoading(false);
        return;
      }
      
      if (!authData.user) {
        setError('Не удалось получить данные пользователя');
        setLoading(false);
        return;
      }

      console.log('Пользователь создан, создаем профиль...', authData.user.id);

      // 2. Создание профиля в таблице profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([ // Используем upsert вместо insert
          {
            id: authData.user.id,
            full_name: fullName,
            role: role,
          },
        ])

      if (profileError) {
        console.error('Ошибка создания профиля:', profileError);
        setError('Ошибка при создании профиля: ' + profileError.message);
        setLoading(false);
        return;
      }
      console.log('Профиль создан успешно, перенаправляем...');

      // 3. Перенаправление
      if (role === 'brand') {
        router.push('/onboarding/brand')
      } else {
        router.push('/dashboard/blogger')
      }
    } catch (err: any) {
      console.error('Общая ошибка регистрации:', err);
      setError(err.message || 'Произошла ошибка при регистрации')
    } finally {
      setLoading(false)
    }  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-gradient p-4 relative overflow-hidden">
      {/* Декоративные сферы как на референсе */}
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-blue-400/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-900/40 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-4xl shadow-2xl p-8 space-y-6 relative z-10 border border-white/20">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-blue-900">Регистрация</h1>
          <p className="text-blue-400/80 text-xs font-medium">Создайте аккаунт, чтобы присоединиться к Зорко</p>
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

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-blue-900/60 ml-1 uppercase tracking-wider">Полное имя</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              className="w-full h-12 px-5 bg-blue-50/30 border border-blue-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-blue-200 text-blue-900 font-medium text-base md:text-sm"
              placeholder="Введите ваше имя"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-blue-900/60 ml-1 uppercase tracking-wider">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full h-12 px-5 bg-blue-50/30 border border-blue-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-blue-200 text-blue-900 font-medium text-base md:text-sm"
              placeholder="Введите Email"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-blue-900/60 ml-1 uppercase tracking-wider">Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full h-12 px-5 bg-blue-50/30 border border-blue-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-blue-200 text-blue-900 font-medium text-base md:text-sm"
              placeholder="Введите пароль"
            />
          </div>
          <div className="flex items-center gap-3 px-1">
            <input type="checkbox" id="terms" className="w-4 h-4 rounded border-blue-200 text-blue-600 focus:ring-blue-500/20" />
            <label htmlFor="terms" className="text-[10px] text-blue-400 font-medium leading-tight">
              Я согласен на обработку <span className="text-blue-600 font-bold">Персональных данных</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 rounded-2xl text-white font-bold text-base shadow-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] ${
              role === 'brand' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Создание...' : 'Зарегистрироваться'}
          </button>
        </form>
        {role === 'blogger' && (
          <div className="space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-blue-100"></div></div>
              <span className="relative px-4 bg-white/0 text-[9px] font-bold text-blue-300 uppercase tracking-widest">Войти через</span>
            </div>

            <div className="flex justify-center gap-4">
              {[
                { name: 'vk', icon: 'https://www.svgrepo.com/show/452131/vk.svg' },
                { name: 'yandex', icon: 'https://www.svgrepo.com/show/303213/yandex-logo.svg' },
                { name: 'google', icon: 'https://www.svgrepo.com/show/303108/google-icon.svg' }
              ].map((social) => (
                <button key={social.name} className="w-11 h-11 rounded-xl bg-white border border-blue-50 flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all">
                  <img src={social.icon} className="w-5 h-5" alt={social.name} />
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-blue-400 font-medium">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Войти
          </Link>
        </p>      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-main-gradient">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
