import { motion } from 'motion/react';
import { MapPin, Droplets, Trash2, Lightbulb, Waves, HelpCircle, ArrowRight } from 'lucide-react';

export default function LandingPage({ setView }: { setView: (v: any) => void }) {
  const services = [
    { icon: <MapPin className="w-6 h-6" />, title: "Road Damage", color: "bg-orange-100 text-orange-600" },
    { icon: <Droplets className="w-6 h-6" />, title: "Water Supply", color: "bg-blue-100 text-blue-600" },
    { icon: <Trash2 className="w-6 h-6" />, title: "Garbage", color: "bg-green-100 text-green-600" },
    { icon: <Lightbulb className="w-6 h-6" />, title: "Street Lights", color: "bg-yellow-100 text-yellow-600" },
    { icon: <Waves className="w-6 h-6" />, title: "Drainage", color: "bg-cyan-100 text-cyan-600" },
    { icon: <HelpCircle className="w-6 h-6" />, title: "Others", color: "bg-slate-100 text-slate-600" },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight">
            Better Cities, <span className="text-emerald-600">Together.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Report municipal issues in seconds. Track progress in real-time. 
            Help us build a cleaner, safer, and more efficient community.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button 
            onClick={() => setView('register')}
            className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200 active:scale-95 flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setView('login')}
            className="bg-white text-slate-800 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            Citizen Login
          </button>
          <button 
            onClick={() => setView('login')}
            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Admin Portal
          </button>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Our Services</h2>
          <p className="text-slate-500">We handle a wide range of municipal concerns</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-4 hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mx-auto`}>
                {service.icon}
              </div>
              <h3 className="font-semibold text-slate-800">{service.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats / Info */}
      <section className="bg-emerald-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">Empowering Citizens for a Smarter Future</h2>
            <p className="text-emerald-100 text-lg opacity-80">
              Our platform bridges the gap between residents and local government, 
              ensuring every voice is heard and every problem is addressed promptly.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <div className="text-4xl font-bold">24/7</div>
                <div className="text-emerald-300 text-sm">Reporting Available</div>
              </div>
              <div>
                <div className="text-4xl font-bold">100%</div>
                <div className="text-emerald-300 text-sm">Transparent Tracking</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
             <div className="bg-emerald-800/50 backdrop-blur-xl rounded-3xl p-8 border border-emerald-700/50">
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 items-center bg-emerald-900/40 p-4 rounded-xl">
                      <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold">#{i}</div>
                      <div className="flex-1 h-2 bg-emerald-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${100 - i * 20}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      </section>
    </div>
  );
}
