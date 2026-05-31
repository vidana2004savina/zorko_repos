'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Star, CheckCircle2, Send, Loader2, ArrowRight, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'

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

export default function BloggerMatching() {
  const [isMatching, setIsMatching] = useState(true)
  const [sentOffers, setSentOffers] = useState<string[]>([])
  const [currentCampaignId, setCurrentCampaignId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: campaigns } = await supabase
          .from('campaigns')
          .select('id')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)

        if (campaigns && campaigns.length > 0) {
          const campaignId = campaigns[0].id
          setCurrentCampaignId(campaignId)
          
          const { data: existingProposals } = await supabase
            .from('proposals')
            .select('blogger_id')
            .eq('campaign_id', campaignId)
          
          if (existingProposals) {
            setSentOffers(existingProposals.map(p => p.blogger_id))
          }
        }
      }
      setIsMatching(false)
    }

    init()
  }, [])

  const sendOffer = async (bloggerId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        alert('Пожалуйста, войдите в систему')
        return
      }

      let campaignId = currentCampaignId
      let campaignTitle = ''
      let campaignDesc = ''

      if (!campaignId) {
        const { data: campaigns } = await supabase
          .from('campaigns')
          .select('id, title, description')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)

        if (!campaigns || campaigns.length === 0) {
          alert('Сначала создайте кампанию')
          return
        }
        campaignId = campaigns[0].id
        campaignTitle = campaigns[0].title
        campaignDesc = campaigns[0].description
        setCurrentCampaignId(campaignId)
      } else {
        const { data: campaign } = await supabase
          .from('campaigns')
          .select('title, description')
          .eq('id', campaignId)
          .single()
        if (campaign) {
          campaignTitle = campaign.title
          campaignDesc = campaign.description
        }
      }
      
      const { data: proposalData, error } = await supabase
        .from('proposals')
        .insert({
          campaign_id: campaignId,
          blogger_id: bloggerId,
          status: 'pending',
          message: `Здравствуйте! Нас заинтересовал ваш профиль для участия в кампании "${campaignTitle}". 

Детали задания:
${campaignDesc}

Будем рады сотрудничеству!`
        })
        .select()

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('not found')) {
          throw new Error('Таблица "proposals" не найдена в базе данных. Пожалуйста, создайте её в консоли Supabase.')
        }
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Offer sent successfully:', proposalData)
      setSentOffers(prev => [...prev, bloggerId])
    } catch (err: any) {
      console.error('Ошибка при отправке оффера:', err)
      alert(err.message || 'Неизвестная ошибка')
    }
  }
  if (isMatching) {    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-8"
        >
          <div className="relative">
            <div className="w-32 h-32 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Анализируем базу...</h2>
            <p className="text-slate-500">Подбираем идеальных блогеров под ваш бриф</p>
          </div>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                className="w-3 h-3 bg-blue-600 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Подходящие блогеры</h1>
            <p className="text-sm md:text-base text-slate-500">Мы нашли {mockBloggers.length} кандидатов для вашей кампании</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/brand')}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg active:scale-95"
          >
            В личный кабинет <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence>
            {mockBloggers.map((blogger, idx) => (
              <motion.div
                key={blogger.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-blue-100/50 transition-all group"
              >
                <div className="p-5 md:p-6 space-y-5 md:space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                        <img 
                          src={blogger.avatar} 
                          alt={blogger.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(blogger.name)}&background=random`
                          }}
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{blogger.name}</h3>
                        <p className="text-xs md:text-sm text-slate-500 truncate">{blogger.handle}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1 shrink-0">
                      <Star size={12} fill="currentColor" /> 4.9
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Подписчики</div>
                      <div className="text-sm md:text-base font-black text-slate-900">{blogger.followers}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Платформа</div>
                      <div className="text-sm md:text-base font-black text-slate-900">{blogger.platform}</div>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {blogger.bio}
                  </p>

                  <button
                    onClick={() => sendOffer(blogger.id)}
                    disabled={sentOffers.includes(blogger.id)}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 ${
                      sentOffers.includes(blogger.id)
                        ? 'bg-emerald-50 text-emerald-600 cursor-default'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'
                    }`}
                  >
                    {sentOffers.includes(blogger.id) ? (
                      <>
                        <CheckCircle2 size={18} /> Предложение отправлено
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Отправить предложение
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
