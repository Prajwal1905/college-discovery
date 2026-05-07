'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface College {
  id: number
  name: string
  location: string
  state: string
  fees: number
  rating: number
  courses: string[]
  placement: number
  description: string
}

export default function CollegeDetailPage() {
  const { id } = useParams()
  const [college, setCollege] = useState<College | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:5000/colleges/${id}`)
      .then(r => r.json())
      .then(data => { setCollege(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-500 text-xl">Loading...</div>
  if (error || !college) return <div className="text-center py-20 text-red-500 text-xl">College not found.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <Link href="/colleges" className="text-blue-600 hover:underline mb-6 inline-block">← Back to Colleges</Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{college.name}</h1>
            <p className="text-gray-500">📍 {college.location}, {college.state}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-green-100 text-green-700 text-lg font-bold px-4 py-2 rounded-full">⭐ {college.rating}/5</span>
            <Link
              href={`/compare?add=${college.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              + Add to Compare
            </Link>
          </div>
        </div>
        <p className="text-gray-600 mt-4 text-lg">{college.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Annual Fees</p>
          <p className="text-2xl font-bold text-blue-600">₹{college.fees.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Placement Rate</p>
          <p className="text-2xl font-bold text-green-600">{college.placement}%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Rating</p>
          <p className="text-2xl font-bold text-yellow-500">⭐ {college.rating}/5</p>
        </div>
      </div>

      {/* Courses */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Courses Offered</h2>
        <div className="flex flex-wrap gap-2">
          {college.courses.map(c => (
            <span key={c} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">{c}</span>
          ))}
        </div>
      </div>

      {/* Placements */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Placement Details</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${college.placement}%` }}
            />
          </div>
          <span className="text-green-600 font-bold text-lg">{college.placement}%</span>
        </div>
        <p className="text-gray-500 mt-2 text-sm">Students placed through campus recruitment</p>
      </div>
    </div>
  )
}