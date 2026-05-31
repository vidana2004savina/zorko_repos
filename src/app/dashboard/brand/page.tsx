'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
  ArrowLeft
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
  },
  {
    id: '4',
    name: 'Дмитрий Волков',
    handle: '@volkov_travel',
    followers: '85k',
    platform: 'TikTok',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
    bio: 'Путешествия по России и миру. Лайфхаки для туристов.',
    category: 'Travel'
  },
  {
    id: '5',
    name: 'Мария Кот',
    handle: '@masha_beauty',
    followers: '32k',
    platform: 'Instagram',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    bio: 'Бьюти-эксперт. Тестирую косметику и делаю туториалы.',
    category: 'Beauty'
  }
]

export default function BrandDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('campaigns')
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [localMessages, setLocalMessages] = useState<Record<string, any[]>>({})

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchCampaigns();
        await fetchProposals();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [])

  const fetchProposals = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          campaigns!inner(*)
        `)
        .eq('campaigns.user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      console.log('Fetched proposals:', data)
      setProposals(data || [])
      if (data && data.length > 0 && !selectedChat) {
        setSelectedChat(data[0].id)
      }
    } catch (err) {
      console.error('Ошибка при загрузке предложений:', err)
    }
  }

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setCampaigns(data || [])
    } catch (err) {
      console.error('Ошибка при загрузке кампаний:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return
    
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'brand',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setLocalMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }))
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
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside className="hidden md:flex w-20 md:w-64 bg-white border-r border-slate-200 flex-col transition-all">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">З</div>
          <span className="hidden md:block font-bold text-xl text-slate-900 tracking-tight">Зорко</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as Tab)
                setSelectedDeal(null)
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <div className={activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}>
                {item.icon}
              </div>
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

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center p-2 z-50">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id as Tab)
              setSelectedDeal(null)
            }}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              activeTab === item.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            {activeTab === 'documents' && selectedDeal && (
              <button 
                onClick={() => setSelectedDeal(null)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-lg md:text-xl font-bold text-slate-900 truncate">
              {(activeTab === 'documents' && selectedDeal) ? 'Детали сделки' : sidebarItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors hidden md:block">
              <Search size={20} />
            </button>
            <Link href="/campaign/create" className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-1 md:gap-2 shadow-lg shadow-blue-100">
              <Plus size={18} /> <span className="hidden sm:inline">Создать задание</span><span className="sm:hidden">Создать</span>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto w-full">
            {activeTab === 'campaigns' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2">
                    <div className="text-slate-500 text-sm font-medium">Активные задания</div>
                    <div className="text-3xl font-bold text-slate-900">{campaigns.length}</div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2">
                    <div className="text-slate-500 text-sm font-medium">Откликов получено</div>
                    <div className="text-3xl font-bold text-blue-600">0</div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2">
                    <div className="text-slate-500 text-sm font-medium">Завершено сделок</div>
                    <div className="text-3xl font-bold text-emerald-500">0</div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Мои задания</h3>
                    <button className="text-blue-600 text-sm font-bold hover:underline">Все задания</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {loading ? (
                      <div className="p-12 text-center text-slate-400 font-medium">Загрузка заданий...</div>
                    ) : campaigns.length === 0 ? (
                      <div className="p-12 text-center space-y-4">
                        <div className="text-slate-400 font-medium">У вас пока нет созданных заданий</div>
                        <Link href="/campaign/create" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
                          Создать первое задание <Plus size={16} />
                        </Link>
                      </div>
                    ) : (
                      campaigns.map((campaign) => (
                        <Link 
                          key={campaign.id} 
                          href={`/campaign/${campaign.id}`}
                          className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                              <LayoutDashboard size={24} />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{campaign.brand_name}</div>
                              <div className="text-sm text-slate-500 flex items-center gap-2">
                                <span>{campaign.category}</span> • <span>{campaign.budget} ₽</span> • <span className="flex items-center gap-1 text-emerald-600 font-medium"><CheckCircle2 size={14} /> {campaign.status === 'active' ? 'Активно' : campaign.status}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex -space-x-2">
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">0</div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300 group-hover:text-blue-500 transition-colors">
                              <span className="text-xs font-bold hidden md:block">Детали</span>
                              <ChevronRight size={20} />
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
              {activeTab === 'messenger' && (
                <div className="h-[calc(100vh-180px)] md:h-[calc(100vh-180px)] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex relative">
                  {proposals.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center space-y-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <MessageSquare size={32} className="md:w-10 md:h-10" />
                      </div>
                      <div className="space-y-2 max-w-sm">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900">У вас пока нет отправленных предложений</h3>
                        <p className="text-slate-500 text-sm">
                          Создайте задание и отправьте предложения подходящим блогерам, чтобы начать общение.
                        </p>
                      </div>
                      {campaigns.length > 0 ? (
                        <Link href="/campaign/matching" className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 text-center">
                          Подобрать блогеров
                        </Link>
                      ) : (
                        <Link href="/campaign/create" className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 text-center">
                          Создать задание
                        </Link>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Chat List - Hidden on mobile when chat is selected */}
                      <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-4 border-b border-slate-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Поиск чатов..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                          {proposals.map((proposal) => {
                            const blogger = mockBloggers.find(b => b.id === proposal.blogger_id) || {
                              name: 'Блогер',
                              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${proposal.blogger_id}`
                            };
                            return (
                              <button
                                key={proposal.id}
                                onClick={() => setSelectedChat(proposal.id)}
                                className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 ${selectedChat === proposal.id ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : ''}`}
                              >
                                <img src={blogger.avatar} className="w-12 h-12 rounded-full object-cover" alt="" />
                                <div className="text-left overflow-hidden">
                                  <div className="font-bold text-slate-900 truncate">{blogger.name}</div>
                                  <div className="text-xs text-slate-500 truncate">{proposal.campaigns?.title}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Chat Window - Hidden on mobile when no chat is selected */}
                      <div className={`flex-1 flex flex-col bg-slate-50/30 ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                        {selectedChat ? (
                          <>
                            {/* Chat Header */}
                            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => setSelectedChat(null)}
                                  className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl"
                                >
                                  <ArrowLeft size={20} />
                                </button>
                                <img 
                                  src={mockBloggers.find(b => b.id === proposals.find(p => p.id === selectedChat)?.blogger_id)?.avatar || ''} 
                                  className="w-10 h-10 rounded-full object-cover" 
                                  alt="" 
                                />
                                <div>
                                  <div className="font-bold text-slate-900 text-sm md:text-base">
                                    {mockBloggers.find(b => b.id === proposals.find(p => p.id === selectedChat)?.blogger_id)?.name}
                                  </div>
                                  <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">В сети</div>
                                </div>
                              </div>
                              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                <MoreVertical size={20} />
                              </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                              <div className="flex justify-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">Сегодня</span>
                              </div>
                              
                              {/* Initial Offer Message */}
                              <div className="flex justify-end">
                                <div className="max-w-[90%] md:max-w-[80%] bg-blue-600 text-white p-3 md:p-4 rounded-2xl rounded-tr-none shadow-md shadow-blue-100">
                                  <p className="text-sm leading-relaxed">
                                    {proposals.find(p => p.id === selectedChat)?.message}
                                  </p>
                                  <div className="text-[10px] text-blue-100 mt-2 text-right font-medium">
                                    {new Date(proposals.find(p => p.id === selectedChat)?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              </div>

                              {/* Local Messages */}
                              {(localMessages[selectedChat || ''] || []).map((msg) => (
                                <div key={msg.id} className="flex justify-end">
                                  <div className="max-w-[90%] md:max-w-[80%] bg-blue-600 text-white p-3 md:p-4 rounded-2xl rounded-tr-none shadow-md shadow-blue-100">
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    <div className="text-[10px] text-blue-100 mt-2 text-right font-medium">{msg.time}</div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Input */}
                            <div className="p-3 md:p-4 bg-white border-t border-slate-100">
                              <div className="flex items-center gap-2 md:gap-3">
                                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors hidden sm:block">
                                  <Paperclip size={20} />
                                </button>
                                <input 
                                  type="text" 
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                  placeholder="Сообщение..." 
                                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-base md:text-sm outline-none focus:ring-2 focus:ring-blue-500/20" 
                                />
                                <button 
                                  onClick={handleSendMessage}
                                  className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                >
                                  <Send size={20} />
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex-1 flex items-center justify-center text-slate-400 font-medium p-6 text-center">
                            Выберите чат, чтобы начать общение
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
              {activeTab === 'documents' && (
                selectedDeal ? (
                  <div className="flex justify-center pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-full max-w-3xl space-y-8">
                      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                          <div className="flex items-center gap-4">
                            <img src={selectedDeal.img} className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt="" />
                            <div>
                              <h3 className="font-black text-slate-900 text-2xl">{selectedDeal.blogger}</h3>
                              <p className="text-slate-500 font-medium">{selectedDeal.task}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold uppercase tracking-wider border border-emerald-100">
                              {selectedDeal.status}
                            </div>
                          </div>
                        </div>

                        <div className="p-8 space-y-8">
                          {/* Platform Info */}
                          <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100/50">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xs font-bold uppercase">
                                {selectedDeal.platform}
                              </div>
                              <span className="font-black text-blue-900 uppercase tracking-wider text-sm">
                                {selectedDeal.platform === 'inst' ? 'Нативная интеграция' : 'Рекламная кампания'}
                              </span>
                            </div>
                            <p className="text-blue-900/60 text-sm leading-relaxed font-medium">
                              {selectedDeal.platform === 'inst' 
                                ? 'Мы помогаем найти лица для бренда для саморекламы или нативной рекламы. В данной соцсети мы не используем термин "реклама" и не проводим маркировку.'
                                : 'Данная кампания подлежит обязательной маркировке согласно законодательству РФ. Мы предоставляем все необходимые инструменты для передачи данных в ОРД и ЕРИР.'}
                            </p>
                          </div>

                          {/* Steps */}
                          <div className="space-y-4">
                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs ml-1">Шаги сделки</h4>
                            <div className="space-y-3">
                              {(selectedDeal.platform === 'inst' ? [
                                { label: 'Согласование блогера и креатива', done: true },
                                { label: 'Подписание предварительного договора (согласие)', done: true },
                                { label: 'Счет и оплата услуг', done: true },
                                { label: 'Создание креатива и передача бренду', done: false },
                                { label: 'Завершение сделки и постоплата', done: false },
                              ] : [
                                { label: 'Согласование блогера и креатива', done: true },
                                { label: 'Подписание предварительного договора (согласие)', done: true },
                                { label: 'Стандартная форма договора (мы не несем ответственности)', done: true, note: 'Мы лишь предоставляем стандартную форму' },
                                { label: 'Выставление счета блогером', done: true },
                                { label: 'Оплата счета брендом', done: true },
                                { label: 'Получение токена в ОРД (под капотом)', done: false },
                                { label: 'Размещение рекламы с токеном', done: false },
                                { label: 'Отчет об охватах и передача в ЕРИР', done: false },
                                { label: 'Завершение сделки и финальный расчет', done: false },
                              ]).map((step, i) => (
                                <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${step.done ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50/50 border-slate-100 opacity-60'}`}>
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                    {step.done ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                                  </div>
                                  <div>
                                    <div className={`text-sm font-bold ${step.done ? 'text-emerald-900' : 'text-slate-600'}`}>{step.label}</div>
                                    {step.note && <div className="text-[10px] text-slate-400 font-medium mt-1 italic">{step.note}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                          <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                            Открыть чат
                          </button>
                          <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all">
                            Скачать документы
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 max-w-6xl">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900 text-lg">Сделки в процессе</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50">
                              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Блогер</th>
                              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Задание</th>
                              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Дата</th>
                              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Сумма</th>
                              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Статус</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {[
                              { id: 1, blogger: 'Алина Соколова', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina', task: 'Интеграция Coffee 1', date: '12.02.2024', amount: '12 000 ₽', status: 'В процессе', platform: 'tg' },
                              { id: 2, blogger: 'Марк Виноградов', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark', task: 'Пост в Instagram', date: '14.02.2024', amount: '25 000 ₽', status: 'В процессе', platform: 'inst' },
                            ].map((deal) => (
                              <tr 
                                key={deal.id} 
                                className="hover:bg-slate-50 transition-colors cursor-pointer"
                                onClick={() => setSelectedDeal(deal)}
                              >
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <img src={deal.img} className="w-8 h-8 rounded-full object-cover" alt="" />
                                    <span className="font-bold text-sm text-slate-900">{deal.blogger}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-sm text-slate-600">{deal.task}</td>
                                <td className="p-4 text-sm text-slate-500">{deal.date}</td>
                                <td className="p-4 text-sm font-bold text-slate-900">{deal.amount}</td>
                                <td className="p-4">
                                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    {deal.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )
              )}

              {activeTab === 'search' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Поиск блогеров</h3>
                      <p className="text-slate-500 text-sm font-medium">Найдите идеальное лицо для вашего бренда</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          placeholder="Категория, имя или соцсеть..." 
                          className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                        />
                      </div>
                      <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
                        <Settings size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockBloggers.map((blogger) => (
                      <div key={blogger.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
                        <div className="p-6 space-y-4">
                          <div className="flex items-center gap-4">
                            <img src={blogger.avatar} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{blogger.name}</div>
                              <div className="text-sm text-slate-500">{blogger.handle}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg">{blogger.platform}</div>
                            <div className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg">{blogger.followers} фолловеров</div>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2 font-medium leading-relaxed">
                            {blogger.bio}
                          </p>
                          <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all">
                            Предложить сотрудничество
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8 max-w-2xl">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-3xl bg-slate-100 overflow-hidden border-4 border-white shadow-lg">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Brand" alt="Avatar" />
                      </div>
                      <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                        <Plus size={16} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Zorko Coffee</h3>
                      <p className="text-slate-500 text-sm">ID: 84729572</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Название компании</label>
                      <input type="text" defaultValue="Zorko Coffee" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email для уведомлений</label>
                      <input type="email" defaultValue="brand@zorko.ru" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard size={18} className="text-blue-600" /> Способы оплаты
                    </h4>
                    <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                        <Plus size={20} />
                      </div>
                      <span className="text-sm font-bold text-slate-500 group-hover:text-blue-600">Подключить ЮKassa или Stripe</span>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
                    Сохранить изменения
                  </button>
                </div>
              )}
        </div>
      </div>
    </main>
  </div>
)
}
