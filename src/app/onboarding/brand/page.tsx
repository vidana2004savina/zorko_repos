'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'

// Создаем внутренний компонент прямо здесь или импортируем его
// Чтобы избежать ошибки __webpack_require__.n, мы выносим логику в динамический импорт
const OnboardingView = dynamic(() => Promise.resolve(OnboardingComponent), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
    </div>
  )
})

export default function BrandOnboarding() {
  return <OnboardingView />
}

// Выносим основной код в отдельную функцию, которая будет отрендерена только на клиенте
function OnboardingComponent() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const router = require('next/navigation').useRouter()
  const Lucide = require('lucide-react')
  
  const steps = [
    {
      title: "Добро пожаловать в Зорко!",
      description: "Платформа, которая делает сотрудничество с блогерами простым и прозрачным.",
      icon: <Lucide.Search className="text-blue-600" size={40} />,
      benefits: ["Быстрый подбор блогеров", "Безопасные сделки", "Экономия времени"]
    },
    {
      title: "Как это работает?",
      description: "Всего 3 простых шага до вашей первой успешной рекламной кампании.",
      icon: <Lucide.Clock className="text-emerald-500" size={40} />,
      benefits: ["Заполните бриф", "Выберите блогеров из пула", "Получите результат"]
    },
    {
      title: "Ваша безопасность — наш приоритет",
      description: "Мы берем на себя все юридические и финансовые вопросы.",
      icon: <Lucide.ShieldCheck className="text-amber-500" size={40} />,
      benefits: ["Автоматические договоры", "Проверка блогеров на накрутки", "Гарантия возврата средств"]
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/campaign/create')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 overflow-hidden">
      <div className="w-full max-w-2xl space-y-6 md:space-y-8 relative">
        <div className="text-center space-y-4 md:space-y-6">
          <div className="flex justify-center">
            <div className="p-4 md:p-5 bg-slate-50 rounded-3xl shadow-inner">
              {steps[currentStep].icon}
            </div>
          </div>
          
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight px-4">
              {steps[currentStep].title}
            </h1>
            <p className="text-base md:text-lg text-slate-500 max-w-md mx-auto leading-relaxed px-4">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 max-w-sm mx-auto px-4">
            {steps[currentStep].benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <Lucide.CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                <span className="text-slate-700 font-medium text-sm md:text-base">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 md:gap-8">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl text-base font-bold hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-200 active:scale-95"
          >
            {currentStep === steps.length - 1 ? 'Найти блогеров' : 'Далее'}
            <Lucide.ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
