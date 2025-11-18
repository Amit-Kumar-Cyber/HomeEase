import { useEffect, useState } from 'react'
import { bookingApi, serviceApi, workerApi, Booking, Service, Profile, Worker } from '../lib/api'

type BookingWithDetails = Booking & { service_id: Service; user_id: Profile; worker_id?: Worker }

export const AdminDashboard = () => {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'workers'>('bookings')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [bookingsData, servicesData, workersData] = await Promise.all([
        bookingApi.getAllForAdmin(),
        serviceApi.getAllForAdmin(),
        workerApi.getAllForAdmin()
      ])
      setBookings(bookingsData || [])
      setServices(servicesData || [])
      setWorkers(workersData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateWorkerVerification = async (workerId: string, status: 'verified' | 'rejected') => {
    try {
      await workerApi.updateVerification(workerId, status)
      fetchData()
    } catch (error) {
      console.error('Error updating worker:', error)
    }
  }

  const toggleServiceStatus = async (serviceId: string) => {
    try {
      await serviceApi.toggleStatus(serviceId)
      fetchData()
    } catch (error) {
      console.error('Error updating service:', error)
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
      case 'verified': return 'bg-green-500/20 text-green-400'
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
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage all system operations</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass-effect p-6 rounded-xl">
            <div className="text-3xl font-bold text-white mb-1">{bookings.length}</div>
            <div className="text-sm text-gray-400">Total Bookings</div>
          </div>
          <div className="glass-effect p-6 rounded-xl">
            <div className="text-3xl font-bold text-white mb-1">{services.length}</div>
            <div className="text-sm text-gray-400">Services</div>
          </div>
          <div className="glass-effect p-6 rounded-xl">
            <div className="text-3xl font-bold text-white mb-1">{workers.length}</div>
            <div className="text-sm text-gray-400">Total Workers</div>
          </div>
          <div className="glass-effect p-6 rounded-xl">
            <div className="text-3xl font-bold text-white mb-1">
              {workers.filter(w => w.verification_status === 'verified').length}
            </div>
            <div className="text-sm text-gray-400">Verified Workers</div>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-medium rounded-lg transition-all ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 font-medium rounded-lg transition-all ${
              activeTab === 'services'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`px-6 py-3 font-medium rounded-lg transition-all ${
              activeTab === 'workers'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Workers
          </button>
        </div>

        {activeTab === 'bookings' && (
          <div className="grid gap-6">
            {bookings.map((booking) => {
              const service = typeof booking.service_id === 'object' ? booking.service_id : null
              const user = typeof booking.user_id === 'object' ? booking.user_id : null
              if (!service || !user) return null
              
              return (
                <div key={booking._id} className="glass-effect rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{service.name}</h3>
                      <p className="text-sm text-gray-400 mb-1">Customer: {user.full_name}</p>
                      <p className="text-sm text-gray-400">{booking.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(booking.status)}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                    <div className="text-lg font-bold text-white mt-2">₹{booking.total_amount}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}</span>
                    <span>•</span>
                    <span>Booked {new Date(booking.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service._id} className="glass-effect rounded-2xl overflow-hidden">
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                    <span className="px-2 py-1 bg-sky-500/20 text-sky-400 text-xs font-semibold rounded">
                      ₹{service.base_price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      service.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => toggleServiceStatus(service._id)}
                      className="text-sm text-sky-400 hover:text-sky-300 font-medium"
                    >
                      {service.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'workers' && (
          <div className="grid gap-6">
            {workers.map((worker) => {
              const profile = typeof worker.user_id === 'object' ? worker.user_id : null
              if (!profile) return null
              
              return (
                <div key={worker._id} className="glass-effect rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{profile.full_name}</h3>
                      <div className="space-y-1 text-sm text-gray-400 mb-3">
                        <p>Email: {profile.email}</p>
                        <p>Phone: {profile.phone}</p>
                        <p>Skills: {worker.skills.length > 0 ? worker.skills.join(', ') : 'None specified'}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-white">Rating: {worker.rating.toFixed(1)} ★</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-white">{worker.total_jobs} jobs completed</span>
                        <span className="text-gray-400">•</span>
                        <span className={`capitalize ${
                          worker.availability_status === 'available' ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {worker.availability_status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize mb-3 ${getStatusColor(worker.verification_status)}`}>
                        {worker.verification_status}
                      </span>
                      {worker.verification_status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateWorkerVerification(worker._id, 'rejected')}
                            className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => updateWorkerVerification(worker._id, 'verified')}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
                          >
                            Verify
                          </button>
                        </div>
                      )}
                    </div>
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
