import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

export const Navbar = () => {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const getDashboardRoute = () => {
    if (!profile) return '/dashboard'
    if (profile.role === 'admin') return '/admin'
    if (profile.role === 'worker') return '/worker'
    return '/dashboard'
  }

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xl font-display font-bold text-white">HomeEase</span>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <button
                  onClick={() => navigate(getDashboardRoute())}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === getDashboardRoute()
                      ? 'text-sky-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                {profile?.role === 'user' && (
                  <button
                    onClick={() => navigate('/services')}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === '/services'
                        ? 'text-sky-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Services
                  </button>
                )}
                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{profile?.full_name}</p>
                    <p className="text-xs text-gray-400 capitalize">{profile?.role}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-medium text-white hover:text-sky-400 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-lg transition-all transform hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
