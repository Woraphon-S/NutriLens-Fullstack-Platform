import { Camera, Zap, BarChart3, Trophy, ArrowRight, Sparkles, Shield, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-health-bg via-white to-health-green-light/20" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-health-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-health-emerald/5 rounded-full blur-3xl" />

        <div className="relative container-app pt-20 pb-40">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-health-green-light/30 text-health-green-dark text-sm font-medium mb-8 slide-up">
              <Sparkles className="w-4 h-4" />
              ขับเคลื่อนด้วย Gemini 2.5 Flash AI
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-health-dark leading-tight mb-6 slide-up delay-100">
              วิเคราะห์อาหาร
              <br />
              <span className="bg-gradient-to-r from-health-green to-health-emerald bg-clip-text text-transparent">
                ด้วยพลัง AI
              </span>
            </h1>

            <p className="text-lg text-health-muted max-w-xl mx-auto mb-10 leading-relaxed slide-up delay-200">
              แค่ถ่ายรูปอาหาร NutriLens AI จะวิเคราะห์วัตถุดิบ แคลอรี่ และสารอาหารหลักให้คุณทันที
              พร้อมระบบติดตามสุขภาพและ Gamification ที่ทำให้การดูแลตัวเองเป็นเรื่องสนุก
            </p>

            <div className="flex items-center justify-center gap-4 slide-up delay-300">
              <a href="/analyze" className="btn-primary inline-flex items-center gap-2 no-underline">
                <Camera className="w-5 h-5" />
                เริ่มวิเคราะห์เลย
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/dashboard" className="btn-secondary inline-flex items-center gap-2 no-underline">
                <BarChart3 className="w-5 h-5" />
                ดูแดชบอร์ด
              </a>
            </div>
          </div>

          {/* Stats Strip */}
          <div className="mt-32 mb-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto slide-up delay-400">
            {[
              { label: 'ความแม่นยำ AI', value: '95%+', icon: '🎯' },
              { label: 'วิเคราะห์เร็ว', value: '< 5 วิ', icon: '⚡' },
              { label: 'รองรับอาหาร', value: '10,000+', icon: '🍜' },
              { label: 'ฟรีไม่จำกัด', value: 'Guest Mode', icon: '🆓' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <span className="text-2xl mb-1 block">{stat.icon}</span>
                <span className="text-xl font-bold text-health-green-dark">{stat.value}</span>
                <span className="text-xs text-health-muted block mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-health-dark mb-4">
              ใช้งานง่ายใน <span className="text-health-green">3 ขั้นตอน</span>
            </h2>
            <p className="text-health-muted max-w-lg mx-auto">
              ไม่ต้องนับแคลเอง ไม่ต้อง Google หาข้อมูล แค่ถ่ายรูปแล้วปล่อยให้ AI ทำงาน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                icon: <Camera className="w-8 h-8 text-health-green" />,
                title: 'ถ่ายรูปอาหาร',
                desc: 'ถ่ายรูปจานอาหารหรืออัปโหลดภาพจากอัลบั้ม รองรับ JPEG, PNG และ WebP',
              },
              {
                step: '02',
                icon: <Zap className="w-8 h-8 text-health-green" />,
                title: 'AI วิเคราะห์',
                desc: 'Gemini 2.5 Flash จะแยกส่วนวัตถุดิบทุกชิ้น ประมาณน้ำหนัก แคลอรี่ และสารอาหารในไม่กี่วินาที',
              },
              {
                step: '03',
                icon: <BarChart3 className="w-8 h-8 text-health-green" />,
                title: 'ดูผลลัพธ์',
                desc: 'เห็นข้อมูลโภชนาการอย่างละเอียด พร้อมคำแนะนำจาก AI นักโภชนาการ',
              },
            ].map((item) => (
              <div key={item.step} className="glass-card p-8 text-center group">
                <div className="relative mb-6">
                  <span className="text-6xl font-extrabold text-health-green-light/40 absolute -top-4 left-1/2 -translate-x-1/2">
                    {item.step}
                  </span>
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-health-bg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-health-dark mb-2">{item.title}</h3>
                <p className="text-sm text-health-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-health-dark mb-4">
              ฟีเจอร์ <span className="text-health-green">ระดับพรีเมียม</span>
            </h2>
            <p className="text-health-muted max-w-lg mx-auto">
              ออกแบบมาเพื่อให้การดูแลสุขภาพเป็นเรื่องง่ายและสนุก
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'AI วิเคราะห์อัจฉริยะ',
                desc: 'ใช้ Gemini 2.5 Flash แยกส่วนวัตถุดิบและคำนวณสารอาหารจากรูปภาพ',
                color: 'from-green-400 to-emerald-500',
              },
              {
                icon: <Trophy className="w-6 h-6" />,
                title: 'ระบบ Streak & XP',
                desc: 'บันทึกอาหารทุกวัน สะสม Streak และอัปเลเวล สร้างนิสัยดีด้วย Gamification',
                color: 'from-purple-400 to-violet-500',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'แดชบอร์ดสุขภาพ',
                desc: 'ติดตามแคลอรี่ สารอาหาร และความก้าวหน้าของคุณได้แบบเรียลไทม์',
                color: 'from-blue-400 to-cyan-500',
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'ประวัติมื้ออาหาร',
                desc: 'ดูย้อนหลังทุกมื้อที่วิเคราะห์ เทียบสถิติรายวัน รายสัปดาห์',
                color: 'from-amber-400 to-orange-500',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Guest Mode ฟรี',
                desc: 'วิเคราะห์ได้ทันทีโดยไม่ต้องสมัครสมาชิก ไม่จำกัดจำนวนครั้ง',
                color: 'from-rose-400 to-pink-500',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'เร็วทันใจ',
                desc: 'ผลลัพธ์ภายในไม่กี่วินาที รองรับทุกอุปกรณ์ ออกแบบ Responsive 100%',
                color: 'from-teal-400 to-emerald-500',
              },
            ].map((feature) => (
              <div key={feature.title} className="glass-card p-6 group cursor-default">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-health-dark mb-2">{feature.title}</h3>
                <p className="text-sm text-health-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container-app">
          <div className="glass-card p-12 md:p-16 text-center bg-gradient-to-br from-health-bg to-white">
            <h2 className="text-3xl md:text-4xl font-bold text-health-dark mb-4">
              พร้อมเริ่มดูแลสุขภาพแล้วหรือยัง?
            </h2>
            <p className="text-health-muted max-w-md mx-auto mb-8">
              เริ่มใช้งานได้เลยตอนนี้ ไม่ต้องสมัคร ไม่ต้องจ่าย แค่ถ่ายรูปอาหารแล้วรอดูมายากล
            </p>
            <a href="/analyze" className="btn-primary inline-flex items-center gap-2 text-lg no-underline">
              <Camera className="w-5 h-5" />
              วิเคราะห์มื้อแรกของคุณ
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
