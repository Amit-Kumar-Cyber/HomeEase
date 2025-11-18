import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { serviceApi, workerApi, bookingApi, Service, Worker } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export const BookService = () => {
  const { serviceId } = useParams<{ serviceId: string }>()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [service, setService] = useState<Service | null>(null)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [selectedWorker, setSelectedWorker] = useState<string>('')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [address, setAddress] = useState(profile?.address || '')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (serviceId) {
      fetchServiceAndWorkers()
    }
  }, [serviceId])

  const fetchServiceAndWorkers = async () => {
    try {
      const serviceData = await serviceApi.getById(serviceId!)
      setService(serviceData)

      const workersData = await workerApi.getAvailable(serviceData.category)
      setWorkers(workersData || [])
    } catch (error) {
      console.error('Error fetching service and workers:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !service) return

    setError('')
    setLoading(true)

    try {
      await bookingApi.create({
        service_id: service._id,
        worker_id: selectedWorker || undefined,
        booking_date: bookingDate,
        booking_time: bookingTime,
        address,
        notes: notes || undefined
      })

      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/services')}
          className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
        >
          ← Back to Services
        </button>

        <div className="glass-effect rounded-2xl overflow-hidden">
          <div className="h-64 overflow-hidden">
            <img
              src={service.image_url}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">{service.name}</h1>
                <p className="text-gray-400">{service.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Starting at</div>
                <div className="text-3xl font-bold text-sky-400">₹{service.base_price}</div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                    Service Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={today}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Time
                  </label>
                  <select
                    id="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select time</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                  Service Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  placeholder="Enter your address"
                />
              </div>

              {workers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Worker (Optional)
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {workers.map((worker) => (
                      <button
                        key={worker._id}
                        type="button"
                        onClick={() => setSelectedWorker(worker._id === selectedWorker ? '' : worker._id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedWorker === worker._id
                            ? 'border-sky-500 bg-sky-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="font-semibold text-white mb-1">{worker.user_id.full_name}</div>
                        <div className="text-xs text-gray-400 mb-2">{worker.total_jobs} jobs completed</div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-300">{worker.rating.toFixed(1)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Leave unselected for automatic assignment
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                  placeholder="Any specific requirements or instructions..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Creating Booking...' : `Book Now - ₹${service.base_price}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
