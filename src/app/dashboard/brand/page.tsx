'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { 
  MessageSquare, 
  FileText, 
  LayoutDashboard, 
  Settings, 
  Search, 
  Plus, 
  MoreVertical, 
  Paperclip, 
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  CreditCard,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Truck,
  X,
  Star
} from 'lucide-react'

type Tab = 'messenger' | 'documents' | 'campaigns' | 'settings' | 'search'

const mockBloggers = [
  {
    id: '1',
    name: 'Алина Соколова',
    handle: '@alina_style',
    followers: '45k',
    platform: 'Instagram',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
    bio: 'Fashion & Lifestyle блогер. Делюсь секретами стиля и красоты.',
    category: 'Fashion'
  },
  {
    id: '2',
    name: 'Максим Петров',
    handle: 'MaxTech',
    followers: '120k',
    platform: 'YouTube',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maxim',
    bio: 'Обзоры гаджетов и технологий. Честно о новинках.',
    category: 'Tech'
  },
  {
    id: '3',
    name: 'Елена Иванова',
    handle: '@elena_food',
    followers: '15k',
    platform: 'Telegram',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    bio: 'Простые рецепты на каждый день. Фуд-фотограф.',
    category: 'Food'
  }
]

const typicalTasks = [
  {
    id: 'typical-1',
    brand: 'ShineSkin',
    title: 'Показ новой линейки уходовой косметики',
    type: 'Бартер + оплата за результат',
    description: 'Нужно показать 3 средства из новой линейки (пенка, тоник, крем) в утреннем ритуале. Формат: видео Reels/TikTok до 60 сек. Блогер должен использовать продукт в кадре.',
    requirements: 'микро-/мидл-блогер, тематика beauty, женская аудитория 20–35 лет, вовлечённость (ER) не ниже 2%.',
    deadline: '10 дней после одобрения заявки',
    budget: '7 000 руб. + продукция',
    platforms: ['TikTok'],
    platformName: 'TikTok',
    location: 'Вся Россия',
    delivery: 'Курьерская доставка за счет бренда (3-5 дней)',
    image: 'https://avatars.mds.yandex.net/i?id=0a20d3b942425549805cd9670ee5c6b3f88e1662-9232692-images-thumbs&n=13'
  },
  {
    id: 'typical-2',
    brand: 'ShineSkin',
    title: 'UGC-съёмка крема от солнца SPF 50',
    type: 'Оплата за готовый контент',
    description: 'Требуется записать честный обзор на крем в формате «до/после» на пляже или в городе. Видео 30–90 сек, горизонтальное, без музыки (для правок бренда).',
    requirements: 'естественная внешность, опыт съёмки UGC, портфолио с примерами.',
    deadline: '5 дней',
    budget: '4 500 руб.',
    platforms: ['Instagram*'],
    platformName: 'Instagram*',
    location: 'Не важно (пляж или городская среда)',
    delivery: 'Почта России / СДЭК (до 7 дней)',
    image: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/c93a59123544873.60f05a5689291.jpg'
  },
  {
    id: 'typical-3',
    brand: 'ПораКофе',
    title: 'Реклама кофейни по бартеру (локально)',
    type: 'Бартер',
    description: 'Посетить кофейню в центре города, снять сторис/пост с атмосферой заведения, показать интерьер и продукт (кофе, выпечку). Отметить геолокацию и аккаунт кофейни.',
    requirements: 'блогер из того же города, аудитория 2–10 тыс. подписчиков, лайфстайл/еда.',
    deadline: '7 дней с момента получения приглашения',
    budget: 'Кофе + десерт (до 1000 руб.)',
    platforms: ['ВКонтакте'],
    platformName: 'ВКонтакте',
    location: 'Москва, ул. Центральная, 15',
    delivery: 'Личное посещение заведения',
    image: 'https://avatars.mds.yandex.net/get-altay/13996387/2a0000019368398491b689f3ee8beb3546ed/orig'
  }
]

const dealSteps = [
  { id: 1, title: 'Направить предложения', desc: 'Выберите подходящих блогеров и отправьте им приглашение к сотрудничеству.' },
  { id: 2, title: 'Выбрать тендер', desc: 'Блогеры откликаются на ваше задание, предлагая свои условия и идеи.' },
  { id: 3, title: 'Согласовать блогера', desc: 'Изучите профили откликнувшихся, их статистику и выберите лучшего исполнителя.' },
  { id: 4, title: 'Безопасная сделка', desc: 'Зарезервируйте бюджет на платформе. Деньги будут выплачены только после подтверждения работы.' },
  { id: 5, title: 'Приемка работы', desc: 'Проверьте созданный контент на соответствие ТЗ и подтвердите выполнение.' }
]

const fullDealSteps = [
  { title: 'Согласование блогера и креатива', status: 'completed' },
  { title: 'Подписание предварительного договора (согласие)', status: 'completed' },
  { title: 'Стандартная форма договора', status: 'completed', sub: 'Мы лишь предоставляем стандартную форму' },
  { title: 'Выставление счета блогером', status: 'completed' },
  { title: 'Оплата счета брендом', status: 'completed' },
  { title: 'Получение токена в ОРД (под капотом)', status: 'pending' },
  { title: 'Размещение рекламы с токеном', status: 'pending' },
  { title: 'Отчет об охватах и передача в ЕРИР', status: 'pending' },
  { title: 'Завершение сделки и финальный расчет', status: 'pending' }
]

export default function BrandDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('campaigns')
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [localMessages, setLocalMessages] = useState<Record<string, any[]>>({})
  const [activeStepInfo, setActiveStepInfo] = useState<number | null>(null)
  const [detailedTask, setDetailedTask] = useState<any | null>(null)

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (isMounted) {
        await fetchCampaigns();
        await fetchProposals();
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [])

  const fetchProposals = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      const { data, error } = await supabase.from('proposals').select('*, campaigns!inner(*)').eq('campaigns.user_id', session.user.id).order('created_at', { ascending: false })
      if (error) throw error
      setProposals(data || [])
      if (data && data.length > 0 && !selectedChat) setSelectedChat(data[0].id)
    } catch (err) { console.error(err) }
  }

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      const { data, error } = await supabase.from('campaigns').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
      if (error) throw error
      setCampaigns(data || [])
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return
    const newMessage = { id: Date.now(), text: message, sender: 'brand', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setLocalMessages(prev => ({ ...prev, [selectedChat]: [...(prev[selectedChat] || []), newMessage] }))
    setMessage('')
  }

  const sidebarItems = [
    { id: 'campaigns', icon: <LayoutDashboard size={20} />, label: 'Мои задания' },
    { id: 'messenger', icon: <MessageSquare size={20} />, label: 'Мессенджер' },
    { id: 'documents', icon: <FileText size={20} />, label: 'Документы' },
    { id: 'search', icon: <Search size={20} />, label: 'Поиск блогеров' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Настройки' },
  ]

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden flex-col md:flex-row">
      <aside className="hidden md:flex w-20 md:w-64 bg-white border-r border-slate-200 flex-col transition-all">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">З</div>
          <span className="hidden md:block font-bold text-xl text-slate-900 tracking-tight">Зорко</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {sidebarItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id as Tab); setSelectedDeal(null); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
              <div className={activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</div>
              <span className="hidden md:block font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Brand" alt="Avatar" />
            </div>
            <div className="hidden md:block overflow-hidden">
              <div className="font-bold text-sm text-slate-900 truncate">Zorko Coffee</div>
              <div className="text-xs text-slate-500 truncate">brand@zorko.ru</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 truncate">
              {sidebarItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/campaign/create" className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-1 md:gap-2 shadow-lg shadow-blue-100">
              <Plus size={18} /> <span className="hidden sm:inline">Создать задание</span>
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto w-full">
            {activeTab === 'campaigns' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                  {[
                    { label: 'Активные задания', value: campaigns.length, color: 'text-blue-600' },
                    { label: 'Откликов получено', value: '0', color: 'text-emerald-600' },
                    { label: 'Завершено сделок', value: '0', color: 'text-amber-600' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm font-bold text-slate-400 mb-2">{stat.label}</div>
                      <div className={`text-4xl font-black ${stat.color}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Типовые задания</h2>
                  <div className="grid grid-cols-1 gap-6">
                    {typicalTasks.map((task) => (
                      <div key={task.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-blue-100/20 transition-all group">
                        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                          <div className="flex-1 space-y-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                                  <Sparkles size={14} /> {task.brand}
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{task.title}</h3>
                              </div>
                              <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 whitespace-nowrap uppercase tracking-wider">
                                {task.type}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Описание</div>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">{task.description}</p>
                              </div>
                              <div className="space-y-2">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Требования</div>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">{task.requirements}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-6 pt-2">
                              <div className="flex items-center gap-2"><LayoutDashboard size={16} className="text-slate-400" /><div className="text-xs font-bold text-slate-600">{task.platformName}</div></div>
                              <div className="flex items-center gap-2"><Clock size={16} className="text-slate-400" /><div className="text-xs font-bold text-slate-600">{task.deadline}</div></div>
                              <div className="flex items-center gap-2"><CreditCard size={16} className="text-slate-400" /><div className="text-xs font-bold text-slate-900">{task.budget}</div></div>
                            </div>
                          </div>
                          <div className="lg:w-64 flex flex-col gap-3 shrink-0">
                            <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden mb-2">
                              <img src={task.image} alt={task.title} className="w-full h-full object-cover" crossOrigin="anonymous" />
                            </div>
                        <button 
                          onClick={() => router.push(`/deal/${task.id}`)}
                          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                        >
                          Начать сотрудничество <ChevronRight size={18} />
                        </button>                            <button onClick={() => setDetailedTask(task)} className="w-full bg-white border-2 border-slate-100 text-slate-600 py-4 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all">
                              Подробнее
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {detailedTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl relative my-auto">
            <button onClick={() => setDetailedTask(null)} className="absolute top-6 right-6 p-3 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors z-10">
              <X size={24} />
            </button>
            <div className="p-6 md:p-10 space-y-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0 shadow-lg">
                  <img src={detailedTask.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest"><Sparkles size={16} /> {detailedTask.brand}</div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">{detailedTask.title}</h2>
                  <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-wider">{detailedTask.type}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-5 bg-slate-50 rounded-3xl space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest"><LayoutDashboard size={14} /> Платформа</div>
                  <div className="text-sm font-bold text-slate-900">{detailedTask.platforms.join(', ')}</div>
                </div>
                <div className="p-5 bg-slate-50 rounded-3xl space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest"><MapPin size={14} /> Локация</div>
                  <div className="text-sm font-bold text-slate-900">{detailedTask.location}</div>
                </div>
                <div className="p-5 bg-slate-50 rounded-3xl space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest"><Truck size={14} /> Доставка</div>
                  <div className="text-sm font-bold text-slate-900">{detailedTask.delivery}</div>
                </div>
                <div className="p-5 bg-blue-600 rounded-3xl space-y-2">
                  <div className="flex items-center gap-2 text-white/60 font-black text-[10px] uppercase tracking-widest"><CreditCard size={14} /> Стоимость</div>
                  <div className="text-sm font-bold text-white">{detailedTask.budget}</div>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900">Шаги рекламной кампании</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fullDealSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-black text-xs ${step.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{step.status === 'completed' ? <CheckCircle2 size={16} /> : i + 1}</div>
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-slate-900 leading-tight">{step.title}</div>
                        {step.sub && <div className="text-[9px] text-slate-400 italic">{step.sub}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">Подходящие кандидаты <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded-lg text-[10px] flex items-center gap-1"><Sparkles size={10} /> AI ПОДБОР</span></h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {mockBloggers.map((blogger) => (
                    <div key={blogger.id} className="p-4 bg-slate-50 rounded-3xl flex flex-col items-center text-center space-y-3 border border-transparent hover:border-blue-200 transition-all">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm"><img src={blogger.avatar} alt="" className="w-full h-full object-cover" /></div>
                      <div><div className="text-sm font-black text-slate-900">{blogger.name}</div><div className="text-[10px] text-slate-400 font-bold">{blogger.handle}</div></div>
                      <div className="flex items-center gap-1 text-amber-500 font-black text-[10px]"><Star size={10} fill="currentColor" /> 4.9</div>
                      <button className="w-full py-2 bg-white text-blue-600 rounded-xl text-[10px] font-black border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">Отправить предложение</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
