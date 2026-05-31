'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  CheckCircle2, 
  Tag, 
  Users, 
  Share2, 
  Edit3, 
  Archive, 
  Copy, 
  UserPlus,
  X,
  Search,
  MessageSquare
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'
export default function CampaignDetails() {  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [bloggers, setBloggers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [invitedBloggerIds, setInvitedBloggerIds] = useState<string[]>([])

  useEffect(() => {
    fetchCampaign()
    fetchBloggers()
    fetchExistingProposals()
  }, [params.id])

  const fetchExistingProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('blogger_id')
        .eq('campaign_id', params.id)
      
      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('not found')) {
          console.warn('Таблица proposals еще не создана')
          return
        }
        throw error
      }
      if (data) {
        setInvitedBloggerIds(data.map((p: any) => p.blogger_id))
      }
    } catch (err) {
      console.error('Ошибка при загрузке существующих предложений:', err)
    }
  }

  const fetchBloggers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'blogger')
      
      if (error) throw error
      setBloggers(data || [])
    } catch (err) {
      console.error('Ошибка при загрузке блогеров:', err)
    }
  }

  const handleInvite = async (bloggerId: string) => {
    if (invitedBloggerIds.includes(bloggerId)) return

    // Оптимистичное обновление UI
    setInvitedBloggerIds(prev => [...prev, bloggerId])

    try {
      const { error } = await supabase
        .from('proposals')
        .insert([
          {
            campaign_id: params.id,
            blogger_id: bloggerId,
            status: 'pending',
            message: `Здравствуйте! Нас заинтересовал ваш профиль для участия в кампании "${campaign?.title || 'нашего бренда'}". 

Будем рады сотрудничеству!`
          }
        ])
      
      if (error && error.code !== '23505') {
        setInvitedBloggerIds(prev => prev.filter(id => id !== bloggerId))
        console.error('Ошибка при приглашении:', error)
      } else {
        fetchCampaign()
      }
    } catch (err: any) {
      console.error('Ошибка при приглашении:', err)
      setInvitedBloggerIds(prev => prev.filter(id => id !== bloggerId))
    }
  }

  const fetchCampaign = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          proposals (
            id,
            status,
            blogger_id,
            profiles:blogger_id (
              full_name,
              avatar_url,
              social_links
            )
          )
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error
      setCampaign(data)
    } catch (err) {
      console.error('Ошибка при загрузке кампании:', err)
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Кампания не найдена</h1>
        <button onClick={() => router.back()} className="text-blue-600 font-bold flex items-center gap-2">
          <ArrowLeft size={20} /> Назад
        </button>
      </div>
    )
  }

  const filteredBloggers = bloggers.filter(blogger => 
    blogger.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blogger.social_links?.handle?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {    switch (status) {
      case 'accepted': return 'text-emerald-600 bg-emerald-50'
      case 'pending': return 'text-amber-600 bg-amber-50'
      case 'declined': return 'text-rose-600 bg-rose-50'
      default: return 'text-slate-600 bg-slate-50'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted': return 'Принято'
      case 'pending': return 'Ожидание'
      case 'declined': return 'Отклонено'
      default: return status
    }
  }

  const getPlatformLabel = (platform: string) => {
    const platforms: { [key: string]: string } = {
      'yt': 'YouTube',
      'tg': 'Telegram',
      'vk': 'VKontakte',
      'inst': 'Instagram',
      'tt': 'TikTok'
    }
    return platforms[platform.toLowerCase()] || platform
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="overflow-hidden">
              <h1 className="text-lg md:text-xl font-bold text-slate-900 truncate">{campaign.brand_name || 'Без названия'}</h1>
              <div className="flex items-center gap-2 md:gap-3 mt-0.5 overflow-x-auto no-scrollbar">
                <span className={`flex items-center gap-1.5 text-[10px] md:text-xs font-bold px-2 md:px-2.5 py-0.5 rounded-full shrink-0 ${
                  campaign.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${campaign.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {campaign.status === 'active' ? 'АКТИВНО' : 'ЗАВЕРШЕНО'}
                </span>
                <span className="text-slate-400 text-[10px] md:text-xs shrink-0">•</span>
                <span className="text-slate-500 text-[10px] md:text-xs font-medium flex items-center gap-1 shrink-0">
                  <Tag size={12} /> {campaign.category}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
              <Share2 size={20} />
            </button>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-600 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-1.5 md:gap-2"
            >
              <UserPlus size={18} /> <span className="hidden sm:inline">Пригласить</span><span className="sm:hidden">Пригласить</span>
            </button>
          </div>
        </div>
      </header>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
          <div className="bg-white w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-full sm:max-h-[80vh]">
            <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-slate-900">Пригласить блогеров</h2>
              <button onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Поиск по имени или никнейму..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base md:text-sm"
                />
              </div>            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {bloggers
                .filter(b => 
                  b.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  b.social_links?.handle?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((blogger) => (
                <div key={blogger.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden border border-blue-100">
                      {blogger.avatar_url ? (
                        <img src={blogger.avatar_url} alt={blogger.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="text-blue-300" size={24} />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{blogger.full_name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>{blogger.social_links?.handle || '@blogger'}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-blue-600 font-medium">{blogger.social_links?.followers || '0'} подписчиков</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleInvite(blogger.id)}
                    disabled={invitedBloggerIds.includes(blogger.id)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                      invitedBloggerIds.includes(blogger.id)
                        ? 'bg-emerald-100 text-emerald-700 cursor-default'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100'
                    }`}
                  >
                    {invitedBloggerIds.includes(blogger.id) ? (
                      <>
                        <CheckCircle2 size={16} /> Приглашен
                      </>
                    ) : (
                      <>
                        Пригласить
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Proposals */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Описание кампании</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {campaign.description}
                </p>
              </div>
            </div>

            {/* Invited Bloggers List */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Приглашенные блогеры</h2>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                  {campaign.proposals?.length || 0}
                </span>
              </div>

              {campaign.proposals && campaign.proposals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaign.proposals.map((proposal: any) => (
                    <div key={proposal.id} className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden">
                          {proposal.profiles?.avatar_url ? (
                            <img src={proposal.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Users size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{proposal.profiles?.full_name}</div>
                          <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded-full inline-block ${getStatusColor(proposal.status)}`}>
                            {getStatusLabel(proposal.status)}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => router.push('/dashboard/brand/messages')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Перейти в чат"
                      >
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                  <Users className="mx-auto text-slate-300 mb-4" size={40} />
                  <p className="text-slate-500 text-sm">Вы еще не пригласили ни одного блогера</p>
                  <button 
                    onClick={() => setShowInviteModal(true)}
                    className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                  >
                    Найти блогеров
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Actions & Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
              <h3 className="font-bold text-slate-900">Статистика</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Просмотры</span>
                  <span className="font-bold text-slate-900">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Охват</span>
                  <span className="font-bold text-slate-900">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Приглашено</span>
                  <span className="font-bold text-slate-900">{campaign.proposals?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h4 className="font-bold text-slate-900 px-2">Действия</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <Edit3 size={18} className="text-blue-500" /> Редактировать
                </button>
                <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <Copy size={18} className="text-emerald-500" /> Дублировать
                </button>
                <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all">
                  <Archive size={18} /> В архив
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>    </div>
  )
}
