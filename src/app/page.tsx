import Link from "next/link";
import { ArrowRight, Users, Briefcase, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#93c5fd] text-white p-4 md:p-5 relative overflow-hidden">
      {/* Декоративные сферы */}
      <div className="absolute -top-[10%] -left-[5%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[60px]" />
      <div className="absolute -bottom-[10%] -right-[5%] w-[400px] h-[400px] bg-black/20 rounded-full blur-[80px]" />

      <nav className="w-full max-w-[1200px] flex justify-between items-center py-2.5 z-10">
        <div className="text-2xl md:text-[28px] font-black tracking-tighter">ЗОРКО</div>
        <div className="flex gap-4 md:gap-5 items-center">
          <Link href="/login" className="text-white/70 no-underline font-bold text-sm">Войти</Link>
          <Link href="/register" className="bg-white text-[#1e3a8a] px-4 md:px-[25px] py-2 md:py-2.5 rounded-full no-underline font-extrabold text-sm shadow-lg">
            Начать
          </Link>
        </div>
      </nav>

      <div className="max-w-[800px] text-center mt-8 md:mt-5 z-10 px-4">
        <h1 className="text-[32px] md:text-[64px] font-black leading-[0.95] mb-4 md:mb-[15px] tracking-[-2px]">
          Соединяем <span className="text-white">Бренды</span> <br />
          и <span className="text-[#f59e0b]">Блогеров</span>
        </h1>
        <p className="text-base md:text-lg text-white/60 max-w-[550px] mx-auto mb-8 md:mb-[25px] font-medium leading-relaxed">
          Самая прозрачная платформа для быстрого подбора блогеров, безопасных сделок и эффективного маркетинга.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-[15px] justify-center items-center">
          <Link href="/register?role=brand" className="w-full md:w-auto min-h-[48px] bg-white text-[#1e3a8a] px-7 py-3.5 rounded-[24px] no-underline font-black text-base shadow-xl flex items-center justify-center gap-2">
            Я Бренд <ArrowRight size={18} />
          </Link>
          <Link href="/register?role=blogger" className="w-full md:w-auto min-h-[48px] bg-white/10 text-white px-7 py-3.5 rounded-[24px] no-underline font-black text-base border-2 border-white/20 backdrop-blur-md flex items-center justify-center gap-2">
            Я Блогер <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-[1100px] mt-12 md:mt-[30px] pb-8 md:pb-[30px] z-10 px-4">
        {[
          { icon: <Users size={24} />, title: "Быстрый подбор", desc: "Умные алгоритмы находят идеальных блогеров для вашей ниши за считанные секунды.", bg: 'bg-white/5' },
          { icon: <ShieldCheck size={24} />, title: "Безопасные сделки", desc: "Автоматические контракты и выплаты. Оплата только после подтверждения работы.", bg: 'bg-[#f59e0b]/10' },
          { icon: <Briefcase size={24} />, title: "Экономия времени", desc: "Управляйте всеми кампаниями, чатами и документами в одном рабочем пространстве.", bg: 'bg-white/10' }
        ].map((feature, i) => (
          <div key={i} className={`p-6 md:p-[20px_25px] rounded-[28px] ${feature.bg} backdrop-blur-[20px] border border-white/10 transition-transform duration-300`}>
            <div className={`mb-3 ${i === 1 ? 'text-[#f59e0b]' : 'text-white'}`}>{feature.icon}</div>
            <h3 className="text-lg md:text-[18px] font-extrabold mb-2">{feature.title}</h3>
            <p className="text-sm text-white/50 font-medium leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      <footer className="p-10 border-t border-white/10 w-full text-center text-white/30 text-sm font-bold">
        © 2024 ЗОРКО. Все права защищены.
      </footer>
    </main>
  );
}
