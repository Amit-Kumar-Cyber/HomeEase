import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingApi, Booking, Service } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

type BookingWithService = Booking & { service_id: Service }

export const UserDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<BookingWithService[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    if (!user) return

    try {
      const data = await bookingApi.getMyBookings()
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (bookingId: string) => {
    try {
      await bookingApi.updateStatus(bookingId, 'cancelled')
      fetchBookings()
    } catch (error) {
      console.error('Error cancelling booking:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'accepted': return 'bg-green-500/20 text-green-400'
      case 'in_progress': return 'bg-blue-500/20 text-blue-400'
      case 'completed': return 'bg-purple-500/20 text-purple-400'
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      case 'rejected': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">My Bookings</h1>
            <p className="text-gray-400">Manage your service requests</p>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
          >
            Book New Service
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
            <p className="text-gray-400 mb-6">Start by booking your first service</p>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 font-medium rounded-lg transition-all"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => {
              const service = typeof booking.service_id === 'object' ? booking.service_id : null
              if (!service) return null
              
              return (
                <div key={booking._id} className="glass-effect rounded-2xl p-6 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-display font-semibold text-white mb-1">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">{booking.address}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {booking.booking_time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                      <div className="text-2xl font-bold text-white mt-2">₹{booking.total_amount}</div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mb-4 p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-400">
                        <span className="font-semibold text-gray-300">Notes:</span> {booking.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xs text-gray-500">
                      Booked {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
