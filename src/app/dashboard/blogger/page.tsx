'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  LayoutGrid, 
  MessageSquare, 
  FileText, 
  User, 
  Search, 
  Filter, 
  MapPin, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  Send,
  ChevronRight,
  Star,
  Instagram,
  Youtube,
  Plus,
  LogOut,
  Send as TelegramIcon
} from 'lucide-react'
import { supabase, type Profile } from '../../../lib/supabase'

const mockCampaigns = [

// ... (оставляем mockCampaigns без изменений)
  {
    id: '1',
    brand: 'Zorko Coffee',
    title: 'Реклама новой линейки кофе',
    description: 'Ищем блогеров для создания креативных сторис и постов о нашем новом сорте кофе из Эфиопии.',
    budget: '15 000 ₽',
    category: 'Food',
    location: 'Москва',
    type: 'Разовая интеграция',
    platforms: ['Instagram', 'Telegram']
  },
  {
    id: '2',
    brand: 'BeautyBox',
    title: 'Обзор весенней коллекции косметики',
    description: 'Нужен честный обзор бокса с косметикой. Формат: распаковка + макияж.',
    budget: '25 000 ₽',
    category: 'Beauty',
    location: 'Федеральный',
    type: 'Долгосрочное сотрудничество',
    platforms: ['YouTube', 'Instagram']
  },
  {
    id: '3',
    brand: 'FitLife',
    title: 'Марафон здоровых привычек',
    description: 'Приглашаем амбассадоров для участия в 30-дневном марафоне. Еженедельные отчеты.',
    budget: '40 000 ₽',
    category: 'Услуги',
    location: 'Федеральный',
    type: 'Долгосрочное сотрудничество',
    platforms: ['VK', 'Telegram']
  }
]
export default function BloggerDashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'feed' | 'responses' | 'messenger' | 'profile'>('feed')
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [responseMessage, setResponseMessage] = useState('')
  const [isSent, setIsSent] = useState(false)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/register')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
      }
      setLoading(false)
    }

    getProfile()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSent(true)
    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 1500))
    setTimeout(() => {
      setSelectedCampaign(null)
      setIsSent(false)
      setResponseMessage('')
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#f0f4f8] overflow-hidden font-sans flex-col md:flex-row">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex w-24 md:w-72 bg-white border-r border-blue-50 flex-col transition-all duration-500 shadow-2xl shadow-blue-100/50 z-20">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-200">З</div>
          <span className="hidden md:block font-black text-2xl text-blue-900 tracking-tighter">ЗОРКО</span>
        </div>

        <nav className="flex-1 px-6 space-y-3 mt-6">
          {[
            { id: 'feed', icon: <LayoutGrid size={22} />, label: 'Лента заданий' },
            { id: 'responses', icon: <CheckCircle2 size={22} />, label: 'Мои отклики' },
            { id: 'messenger', icon: <MessageSquare size={22} />, label: 'Мессенджер' },
            { id: 'profile', icon: <User size={22} />, label: 'Профиль' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-[1.02]' 
                  : 'text-blue-300 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <div className={activeTab === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'}>
                {item.icon}
              </div>
              <span className="hidden md:block font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-red-300 hover:bg-red-50 hover:text-red-600 mt-auto"
          >
            <LogOut size={22} />
            <span className="hidden md:block font-bold text-sm tracking-tight">Выйти</span>
          </button>
        </nav>

        <div className="p-6 border-t border-blue-50">
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-blue-50/50 border border-blue-100/50 cursor-pointer hover:bg-blue-50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shadow-sm border-2 border-white">
              <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name}`} alt="Avatar" />
            </div>
            <div className="hidden md:block overflow-hidden">
              <div className="font-black text-sm text-blue-900 truncate">{profile?.full_name}</div>
              <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Блогер</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-blue-50 flex justify-around items-center p-2 z-50">
        {[
          { id: 'feed', icon: <LayoutGrid size={22} />, label: 'Лента' },
          { id: 'responses', icon: <CheckCircle2 size={22} />, label: 'Отклики' },
          { id: 'messenger', icon: <MessageSquare size={22} />, label: 'Чат' },
          { id: 'profile', icon: <User size={22} />, label: 'Профиль' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              activeTab === item.id ? 'text-blue-600' : 'text-blue-300'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold mt-1">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative pb-16 md:pb-0">
        {/* Декоративные пятна на фоне */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-orange-100/20 rounded-full blur-3xl -z-10" />

        <header className="h-20 md:h-24 bg-white/80 backdrop-blur-xl border-b border-blue-50 flex items-center justify-between px-6 md:px-10 shrink-0 z-10">
          <h2 className="text-xl md:text-2xl font-black text-blue-900 tracking-tight">
            {activeTab === 'feed' && 'Лента заданий'}
            {activeTab === 'responses' && 'Мои отклики'}
            {activeTab === 'messenger' && 'Мессенджер'}
            {activeTab === 'profile' && 'Мой профиль'}
          </h2>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" size={20} />
              <input
                type="text"
                placeholder="Поиск заданий..."
                className="pl-12 pr-6 py-3 bg-blue-50/50 border border-blue-100 rounded-2xl text-sm font-bold text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all w-64"
              />
            </div>
            <button className="p-2.5 md:p-3 bg-white border border-blue-50 text-blue-300 rounded-xl hover:text-blue-600 hover:shadow-lg transition-all">
              <Filter size={22} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10">
          {activeTab === 'feed' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
              {mockCampaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white rounded-[32px] md:rounded-[40px] shadow-sm border border-blue-50 p-6 md:p-8 space-y-6 md:space-y-8 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 group relative overflow-hidden">
                  {/* Акцентная полоска */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl border border-blue-100 group-hover:scale-110 transition-transform">
                        {campaign.brand[0]}
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-black text-blue-900 group-hover:text-blue-600 transition-colors leading-tight">{campaign.title}</h3>
                        <p className="text-xs md:text-sm text-blue-300 font-bold uppercase tracking-widest mt-1">{campaign.brand}</p>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto bg-orange-500 text-white px-5 py-2 rounded-2xl text-sm font-black shadow-lg shadow-orange-100 text-center">
                      {campaign.budget}
                    </div>
                  </div>

                  <p className="text-blue-900/60 font-medium leading-relaxed line-clamp-3 text-sm md:text-base">
                    {campaign.description}
                  </p>

                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {[
                      { icon: <MapPin size={14} />, text: campaign.location },
                      { icon: <Clock size={14} />, text: campaign.type },
                      { icon: <Star size={14} />, text: campaign.category }
                    ].map((tag, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-50/50 rounded-xl text-[10px] md:text-xs font-bold text-blue-400 border border-blue-100/50">
                        {tag.icon} {tag.text}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-blue-50">
                    <div className="flex gap-2 md:gap-3">
                      {campaign.platforms.map(p => (
                        <div key={p} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-blue-50 flex items-center justify-center text-blue-200 hover:text-blue-600 hover:border-blue-600 transition-all cursor-help shadow-sm">
                          {p === 'Instagram' && <Instagram size={18} />}
                          {p === 'YouTube' && <Youtube size={18} />}
                          {p === 'Telegram' && <TelegramIcon size={18} />}
                        </div>                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedCampaign(campaign)}
                      className="flex items-center gap-3 bg-blue-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 active:scale-95"
                    >
                      Откликнуться <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-4xl space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl bg-slate-100 overflow-hidden border-4 border-white shadow-xl">
                      <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name}`} alt="Avatar" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg hover:bg-emerald-600 transition-all">
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-center md:text-left space-y-2">
                    <h3 className="text-3xl font-bold text-slate-900">{profile?.full_name}</h3>
                    <p className="text-slate-500 font-medium">Блогер</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-xl font-bold text-slate-900">0</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Подписчики</div>
                      </div>
                      <div className="w-px h-8 bg-slate-100 self-center" />
                      <div className="text-center">
                        <div className="text-xl font-bold text-slate-900">5.0</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Рейтинг</div>
                      </div>
                      <div className="w-px h-8 bg-slate-100 self-center" />
                      <div className="text-center">
                        <div className="text-xl font-bold text-slate-900">0</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Сделки</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Полное имя</label>
                    <input type="text" defaultValue={profile?.full_name} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Роль</label>
                    <input type="text" defaultValue={profile?.role} disabled className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none opacity-60" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Основная платформа</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none">
                      <option>Instagram</option>
                      <option>YouTube</option>
                      <option>Telegram</option>
                      <option>TikTok</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">О себе</label>
                  <textarea rows={4} defaultValue="Fashion & Lifestyle блогер. Делюсь секретами стиля и красоты. Работаю с брендами одежды и косметики." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none" />
                </div>

                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-slate-200">
                  Сохранить профиль
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      {selectedCampaign && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-900">Отклик на задание</h3>
                  <p className="text-slate-500">{selectedCampaign.title}</p>
                </div>
                <button onClick={() => setSelectedCampaign(null)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleResponse} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Ваше сообщение бренду</label>
                  <textarea 
                    required
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Расскажите, почему вы подходите для этого задания..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                    rows={4}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-slate-200"
                >
                  Отправить отклик
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
