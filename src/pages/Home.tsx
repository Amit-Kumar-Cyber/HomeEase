import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Footer } from '../components/Footer'

export const Home = () => {
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      if (profile?.role === 'admin') navigate('/admin')
      else if (profile?.role === 'worker') navigate('/worker')
      else navigate('/dashboard')
    } else {
      navigate('/register')
    }
  }

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-blue-500/10"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Professional Home Services
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
                At Your Doorstep
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Book trusted professionals for plumbing, electrical work, cleaning, and more across India.
              Quality service, verified workers, transparent pricing.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-sky-500/30"
            >
              {user ? 'Go to Dashboard' : 'Book a Service Now'}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="glass-effect p-8 rounded-2xl card-hover">
              <div className="w-14 h-14 bg-sky-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">Verified Professionals</h3>
              <p className="text-gray-400 leading-relaxed">
                All service providers are thoroughly vetted and background-checked for your safety and peace of mind.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-2xl card-hover">
              <div className="w-14 h-14 bg-sky-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">Flexible Scheduling</h3>
              <p className="text-gray-400 leading-relaxed">
                Choose your preferred date and time. Our professionals work around your schedule, not the other way around.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-2xl card-hover">
              <div className="w-14 h-14 bg-sky-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">Transparent Pricing</h3>
              <p className="text-gray-400 leading-relaxed">
                Know the cost upfront with no hidden fees. Clear pricing for every service before you book.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Simple steps to get your home service needs met</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Choose Service</h3>
              <p className="text-gray-400 text-sm">Select from our wide range of home services</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Pick Date & Time</h3>
              <p className="text-gray-400 text-sm">Schedule at your convenience</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Matched</h3>
              <p className="text-gray-400 text-sm">We assign a verified professional</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Service Done</h3>
              <p className="text-gray-400 text-sm">Job completed to your satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
