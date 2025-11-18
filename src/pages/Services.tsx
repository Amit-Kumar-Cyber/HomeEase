import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serviceApi, Service } from '../lib/api'

export const Services = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const data = await serviceApi.getAll()
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading services...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Our Services</h1>
          <p className="text-gray-400 text-lg">Choose from our wide range of professional home services</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="glass-effect rounded-2xl overflow-hidden card-hover cursor-pointer"
              onClick={() => navigate(`/book/${service._id}`)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-display font-semibold text-white">{service.name}</h3>
                  <span className="px-3 py-1 bg-sky-500/20 text-sky-400 text-sm font-semibold rounded-full">
                    ₹{service.base_price}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{service.category}</span>
                  <button className="text-sky-400 hover:text-sky-300 font-medium text-sm transition-colors">
                    Book Now →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
