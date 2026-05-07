import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  connectionString: 'postgresql://postgres:QNYoKfiZEsYMgCLoDBLAmieyntywCVKI@turntable.proxy.rlwy.net:39762/railway',
  ssl: { rejectUnauthorized: false }
})

const colleges = [
  { name: "IIT Bombay", location: "Mumbai", state: "Maharashtra", fees: 200000, rating: 4.8, courses: ["B.Tech", "M.Tech", "MBA", "PhD"], placement: 95, description: "Premier engineering institute known for excellence in technology and research." },
  { name: "IIT Delhi", location: "New Delhi", state: "Delhi", fees: 200000, rating: 4.8, courses: ["B.Tech", "M.Tech", "MBA"], placement: 94, description: "Top engineering college with world-class faculty and infrastructure." },
  { name: "IIT Madras", location: "Chennai", state: "Tamil Nadu", fees: 195000, rating: 4.7, courses: ["B.Tech", "M.Tech", "PhD"], placement: 93, description: "Ranked #1 in NIRF, known for research and innovation." },
  { name: "BITS Pilani", location: "Pilani", state: "Rajasthan", fees: 500000, rating: 4.6, courses: ["B.Tech", "MBA", "M.Tech"], placement: 90, description: "Top private engineering college with strong industry connections." },
  { name: "NIT Trichy", location: "Tiruchirappalli", state: "Tamil Nadu", fees: 150000, rating: 4.5, courses: ["B.Tech", "M.Tech"], placement: 88, description: "Best NIT in India with excellent placement record." },
  { name: "VIT Vellore", location: "Vellore", state: "Tamil Nadu", fees: 350000, rating: 4.2, courses: ["B.Tech", "MBA", "MCA"], placement: 82, description: "Large private university with diverse courses and good placements." },
  { name: "Delhi University", location: "New Delhi", state: "Delhi", fees: 50000, rating: 4.3, courses: ["BA", "B.Com", "B.Sc", "MA"], placement: 75, description: "Premier central university offering diverse undergraduate programs." },
  { name: "Jadavpur University", location: "Kolkata", state: "West Bengal", fees: 30000, rating: 4.4, courses: ["B.Tech", "B.Sc", "MA"], placement: 85, description: "Top government university in Eastern India." },
  { name: "IIM Ahmedabad", location: "Ahmedabad", state: "Gujarat", fees: 2500000, rating: 4.9, courses: ["MBA", "PhD"], placement: 99, description: "Best business school in India with top corporate recruiters." },
  { name: "IIM Bangalore", location: "Bangalore", state: "Karnataka", fees: 2400000, rating: 4.9, courses: ["MBA", "Executive MBA"], placement: 98, description: "World-class management institute in Silicon Valley of India." },
  { name: "NIT Warangal", location: "Warangal", state: "Telangana", fees: 145000, rating: 4.4, courses: ["B.Tech", "M.Tech", "MBA"], placement: 87, description: "Top NIT with strong alumni network and placements." },
  { name: "IIIT Hyderabad", location: "Hyderabad", state: "Telangana", fees: 300000, rating: 4.5, courses: ["B.Tech", "M.Tech", "PhD"], placement: 92, description: "Top institute for CS and IT with excellent placements." },
  { name: "IIT Kharagpur", location: "Kharagpur", state: "West Bengal", fees: 195000, rating: 4.7, courses: ["B.Tech", "M.Tech", "MBA", "PhD"], placement: 92, description: "Oldest IIT with largest campus and diverse programs." },
  { name: "AIIMS Delhi", location: "New Delhi", state: "Delhi", fees: 5000, rating: 4.9, courses: ["MBBS", "MD", "MS", "PhD"], placement: 99, description: "Premier medical institute, best in India for medicine." },
  { name: "IIT Roorkee", location: "Roorkee", state: "Uttarakhand", fees: 190000, rating: 4.6, courses: ["B.Tech", "M.Tech", "MBA"], placement: 91, description: "Oldest technical institute in Asia with strong legacy." },
  { name: "SRM Institute", location: "Chennai", state: "Tamil Nadu", fees: 300000, rating: 3.9, courses: ["B.Tech", "MBA", "MCA", "B.Sc"], placement: 78, description: "Large private university with multiple campuses." },
  { name: "Amity University", location: "Noida", state: "Uttar Pradesh", fees: 250000, rating: 3.8, courses: ["B.Tech", "MBA", "BA", "B.Com"], placement: 72, description: "Private university with wide range of programs." },
  { name: "Anna University", location: "Chennai", state: "Tamil Nadu", fees: 80000, rating: 4.2, courses: ["B.Tech", "M.Tech", "MBA"], placement: 83, description: "Top state technical university in Tamil Nadu." },
  { name: "IIT Hyderabad", location: "Hyderabad", state: "Telangana", fees: 190000, rating: 4.5, courses: ["B.Tech", "M.Tech", "PhD"], placement: 89, description: "New-gen IIT with focus on innovation and research." },
  { name: "Symbiosis International University", location: "Pune", state: "Maharashtra", fees: 350000, rating: 4.0, courses: ["MBA", "BA", "B.Com", "B.Tech"], placement: 78, description: "Premier private university with international exposure." },
  { name: "IIM Calcutta", location: "Kolkata", state: "West Bengal", fees: 2300000, rating: 4.8, courses: ["MBA", "PhD"], placement: 98, description: "One of the oldest and most prestigious IIMs." },
  { name: "XLRI Jamshedpur", location: "Jamshedpur", state: "Jharkhand", fees: 2000000, rating: 4.7, courses: ["MBA", "Executive MBA"], placement: 97, description: "Top HR and business management school in India." },
  { name: "Hindu College Delhi", location: "New Delhi", state: "Delhi", fees: 30000, rating: 4.3, courses: ["BA", "B.Sc", "B.Com"], placement: 70, description: "Top arts and science college under Delhi University." },
  { name: "IIT Gandhinagar", location: "Gandhinagar", state: "Gujarat", fees: 185000, rating: 4.5, courses: ["B.Tech", "M.Tech", "PhD"], placement: 88, description: "Known for liberal arts integration with engineering." },
  { name: "Manipal Institute of Technology", location: "Manipal", state: "Karnataka", fees: 400000, rating: 4.1, courses: ["B.Tech", "MBA", "MCA"], placement: 80, description: "Leading private engineering college with global exposure." },
]

async function main() {
  // Create table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "College" (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      state TEXT NOT NULL,
      fees INTEGER NOT NULL,
      rating FLOAT NOT NULL,
      courses TEXT[] NOT NULL,
      placement INTEGER NOT NULL,
      description TEXT NOT NULL,
      image TEXT,
      "createdAt" TIMESTAMP DEFAULT NOW()
    )
  `)

  for (const college of colleges) {
    await pool.query(
      `INSERT INTO "College" (name, location, state, fees, rating, courses, placement, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [college.name, college.location, college.state, college.fees, college.rating, college.courses, college.placement, college.description]
    )
  }
  console.log(' Seeded 25 colleges to Railway!')
  await pool.end()
}

main().catch(console.error)