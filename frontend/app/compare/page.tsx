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

export default function ComparePage() {
  const [allColleges, setAllColleges] = useState<College[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [compared, setCompared] = useState<College[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('https://marvelous-transformation-production-8e9a.up.railway.app/colleges')
      .then(r => r.json())
      .then(setAllColleges)
  }, [])

  const handleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id))
    } else if (selected.length < 3) {
      setSelected([...selected, id])
    }
  }

  const handleCompare = async () => {
    if (selected.length < 2) {
      setError('Please select at least 2 colleges to compare.')
      return
    }
    setError('')
    setLoading(true)
    const res = await fetch(`https://marvelous-transformation-production-8e9a.up.railway.app/compare?ids=${selected.join(',')}`)
    const data = await res.json()
    setCompared(data)
    setLoading(false)
  }

  const handleReset = () => {
    setSelected([])
    setCompared([])
    setError('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">⚖️ Compare Colleges</h1>
      <p className="text-gray-500 mb-6">Select 2 or 3 colleges to compare side by side.</p>

      {/* College Selector */}
      {compared.length === 0 && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-3">
              Selected: <span className="font-semibold text-blue-600">{selected.length}/3</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allColleges.map(college => (
                <div
                  key={college.id}
                  onClick={() => handleSelect(college.id)}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition ${
                    selected.includes(college.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{college.name}</p>
                      <p className="text-sm text-gray-500">{college.location}, {college.state}</p>
                    </div>
                    {selected.includes(college.id) && (
                      <span className="text-blue-600 font-bold text-lg">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <button
            onClick={handleCompare}
            disabled={selected.length < 2}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compare {selected.length > 0 ? `(${selected.length} selected)` : ''}
          </button>
        </>
      )}

      {/* Loading */}
      {loading && <div className="text-center py-12 text-gray-500">Loading comparison...</div>}

      {/* Comparison Table */}
      {compared.length > 0 && (
        <div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  {compared.map(c => (
                    <th key={c.id} className="text-left p-4 font-semibold">{c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="p-4 font-medium text-gray-600">📍 Location</td>
                  {compared.map(c => <td key={c.id} className="p-4">{c.location}, {c.state}</td>)}
                </tr>
                <tr className="border-t border-gray-100 bg-gray-50">
                  <td className="p-4 font-medium text-gray-600">💰 Annual Fees</td>
                  {compared.map(c => (
                    <td key={c.id} className="p-4 font-semibold text-blue-600">₹{c.fees.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-4 font-medium text-gray-600">⭐ Rating</td>
                  {compared.map(c => (
                    <td key={c.id} className="p-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">{c.rating}/5</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-100 bg-gray-50">
                  <td className="p-4 font-medium text-gray-600">🎯 Placement</td>
                  {compared.map(c => (
                    <td key={c.id} className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${c.placement}%` }} />
                        </div>
                        <span className="font-semibold text-green-600">{c.placement}%</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-4 font-medium text-gray-600">📚 Courses</td>
                  {compared.map(c => (
                    <td key={c.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {c.courses.map(course => (
                          <span key={course} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">{course}</span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-100 bg-gray-50">
                  <td className="p-4 font-medium text-gray-600">🏆 Best For</td>
                  {compared.map(c => (
                    <td key={c.id} className="p-4 text-gray-600 text-sm">{c.description}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={handleReset}
            className="mt-6 border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
          >
             Compare Again
          </button>
        </div>
      )}
    </div>
  )
}