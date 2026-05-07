'use client'
import { useEffect, useState } from 'react'
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

const PAGE_SIZE = 6

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [search, setSearch] = useState('')
  const [state, setState] = useState('')
  const [course, setCourse] = useState('')
  const [states, setStates] = useState<string[]>([])
  const [courses, setCourses] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch('https://marvelous-transformation-production-8e9a.up.railway.app/states').then(r => r.json()).then(setStates)
    fetch('https://marvelous-transformation-production-8e9a.up.railway.app/courses').then(r => r.json()).then(setCourses)
  }, [])

  useEffect(() => {
    setLoading(true)
    setPage(1)
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (state) params.append('state', state)
    if (course) params.append('course', course)

    fetch(`https://marvelous-transformation-production-8e9a.up.railway.app/colleges?${params}`)
      .then(r => r.json())
      .then(data => { setColleges(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [search, state, course])

  const totalPages = Math.ceil(colleges.length / PAGE_SIZE)
  const paginated = colleges.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Colleges</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search colleges..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={state}
          onChange={e => setState(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All States</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={course}
          onChange={e => setCourse(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Courses</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={() => { setSearch(''); setState(''); setCourse('') }}
          className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          Clear
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-gray-500">Loading colleges...</div>
      )}

      {/* Empty */}
      {!loading && colleges.length === 0 && (
        <div className="text-center py-12 text-gray-500">No colleges found. Try different filters.</div>
      )}

      {/* Results count */}
      {!loading && colleges.length > 0 && (
        <p className="text-gray-500 text-sm mb-4">Showing {paginated.length} of {colleges.length} colleges</p>
      )}

      {/* College Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginated.map(college => (
          <div key={college.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-bold text-gray-900">{college.name}</h2>
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded-full">
                ⭐ {college.rating}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-1">📍 {college.location}, {college.state}</p>
            <p className="text-blue-600 font-semibold mb-2">₹{college.fees.toLocaleString()}/year</p>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{college.description}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {college.courses.slice(0, 3).map(c => (
                <span key={c} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">{c}</span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">🎯 {college.placement}% placement</span>
              <Link href={`/colleges/${college.id}`} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-4 py-2 rounded-lg border transition ${
                page === p
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}