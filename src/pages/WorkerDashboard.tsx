import { useEffect, useState } from 'react'
import { bookingApi, Booking, Service, Profile } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

type BookingWithDetails = Booking & { service_id: Service; user_id: Profile }

export const WorkerDashboard = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'completed'>('pending')

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    if (!user) return

    try {
      const data = await bookingApi.getMyJobs()
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      await bookingApi.updateStatus(bookingId, status)
      fetchBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const acceptBooking = (bookingId: string) => updateBookingStatus(bookingId, 'accepted')
  const rejectBooking = (bookingId: string) => updateBookingStatus(bookingId, 'rejected')
  const startJob = (bookingId: string) => updateBookingStatus(bookingId, 'in_progress')
  const completeJob = (bookingId: string) => updateBookingStatus(bookingId, 'completed')

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

  const filterBookings = () => {
    switch (activeTab) {
      case 'pending':
        return bookings.filter(b => b.status === 'pending')
      case 'active':
        return bookings.filter(b => ['accepted', 'in_progress'].includes(b.status))
      case 'completed':
        return bookings.filter(b => ['completed', 'cancelled', 'rejected'].includes(b.status))
      default:
        return bookings
    }
  }

  const filteredBookings = filterBookings()

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
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">Worker Dashboard</h1>
          <p className="text-gray-400">Manage your service bookings</p>
        </div>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-medium rounded-lg transition-all ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 font-medium rounded-lg transition-all ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Active ({bookings.filter(b => ['accepted', 'in_progress'].includes(b.status)).length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 font-medium rounded-lg transition-all ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            History ({bookings.filter(b => ['completed', 'cancelled', 'rejected'].includes(b.status)).length})
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No bookings in this category</h3>
            <p className="text-gray-400">Check back later for new booking requests</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => {
              const service = typeof booking.service_id === 'object' ? booking.service_id : null
              const user = typeof booking.user_id === 'object' ? booking.user_id : null
              if (!service || !user) return null
              
              return (
                <div key={booking._id} className="glass-effect rounded-2xl p-6 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-display font-semibold text-white">
                            {service.name}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Customer</p>
                            <p className="text-white font-medium">{user.full_name}</p>
                            <p className="text-sm text-gray-400">{user.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Location</p>
                            <p className="text-white">{booking.address}</p>
                          </div>
                        </div>
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
                          <span className="text-white font-semibold">₹{booking.total_amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mb-4 p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-400">
                        <span className="font-semibold text-gray-300">Special Instructions:</span> {booking.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => rejectBooking(booking._id)}
                          className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => acceptBooking(booking._id)}
                          className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
                        >
                          Accept Booking
                        </button>
                      </>
                    )}
                    {booking.status === 'accepted' && (
                      <button
                        onClick={() => startJob(booking._id)}
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                      >
                        Start Job
                      </button>
                    )}
                    {booking.status === 'in_progress' && (
                      <button
                        onClick={() => completeJob(booking._id)}
                        className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                      >
                        Mark as Completed
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
