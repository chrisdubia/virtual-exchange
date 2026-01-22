import React, { useState, useRef } from 'react';
import { Globe, Users, School, MessageSquare, Search, Filter, CheckCircle, X, Heart, Building, GraduationCap, BookOpen, Sparkles, Shield, Mail, Lock, User } from 'lucide-react';

const VirtualExchangePlatform = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const aiSearchRef = useRef(null);

  // MapWorks Logo Component
  const MapWorksLogo = ({ size = 'md' }) => {
    const sizes = {
      sm: 'w-8 h-12',
      md: 'w-12 h-18',
      lg: 'w-16 h-24'
    };
    return (
      <svg viewBox="0 0 68.53 99.93" className={sizes[size]}>
        <defs>
          <style>
            {`.cls-1{fill:none}.cls-1,.cls-2,.cls-3,.cls-4{stroke-width:0px}.cls-2{fill:#e2d7cf}.cls-3{fill:#fdc20f}.cls-4{fill:#010101}`}
          </style>
        </defs>
        <g>
          <circle className="cls-1" cx="34.26" cy="32.09" r="10.79" transform="translate(-6.81 9.36) rotate(-14.16)"/>
          <polygon className="cls-4" points="40.6 89.63 27.93 89.63 34.26 99.93 40.6 89.63"/>
        </g>
        <path className="cls-3" d="m22.54,80.88c1.31-.92,2.9-1.46,4.62-1.46,3.06,0,5.73,1.71,7.1,4.22,1.37-2.51,4.04-4.22,7.1-4.22,1.72,0,3.31.54,4.62,1.46l.26-.42c9.97-17.44,22.28-37.78,22.28-48.36C68.53,7.42,47.85,0,34.28,0c0,0-.01,0-.02,0s-.01,0-.02,0C20.68,0,0,7.42,0,32.09c0,10.58,12.31,30.92,22.28,48.36l.26.42Zm11.72-59.58c5.96,0,10.79,4.83,10.79,10.79s-4.83,10.79-10.79,10.79-10.79-4.83-10.79-10.79,4.83-10.79,10.79-10.79Z"/>
        <path className="cls-2" d="m40.6,89.63l5.39-8.75c-1.31-.92-2.9-1.46-4.62-1.46-3.06,0-5.73,1.71-7.1,4.22-1.37-2.51-4.04-4.22-7.1-4.22-1.72,0-3.31.54-4.62,1.46l5.39,8.75h12.67Z"/>
      </svg>
    );
  };

  // Virtual Exchange Logo Component
  const VirtualExchangeLogo = ({ size = 'md' }) => {
    const sizes = {
      sm: { container: 'w-16 h-16', circle: 16 },
      md: { container: 'w-24 h-24', circle: 24 },
      lg: { container: 'w-32 h-32', circle: 32 }
    };
    const s = sizes[size];
    return (
      <svg viewBox="0 0 200 200" className={s.container}>
        <circle cx="100" cy="60" r="35" stroke="#6B7280" strokeWidth="8" fill="none"/>
        <circle cx="100" cy="60" r="12" fill="#14B8A6"/>
        <circle cx="65" cy="120" r="35" stroke="#6B7280" strokeWidth="8" fill="none"/>
        <circle cx="65" cy="120" r="12" fill="#EF4444"/>
        <circle cx="135" cy="120" r="35" stroke="#6B7280" strokeWidth="8" fill="none"/>
        <circle cx="135" cy="120" r="12" fill="#6B7280"/>
      </svg>
    );
  };

  // Comprehensive database of organizations
  const organizations = [
    // PROVIDERS
    {
      id: 1,
      name: "Stevens Initiative",
      type: "Provider",
      category: "Exchange Provider",
      country: "United States",
      region: "North America",
      description: "A leading virtual exchange initiative funded by the U.S. Department of State, connecting youth globally.",
      languages: ["English", "Arabic", "Spanish"],
      interests: ["Cross-Cultural Dialogue", "Peace Building", "STEM"],
      capacity: "50,000+ participants annually",
      verified: true,
      website: "stevensinitiative.org",
      partnershipGoals: ["Expand VE programs", "Build institutional capacity", "Foster global citizenship"]
    },
    {
      id: 2,
      name: "Soliya",
      type: "Provider",
      category: "Exchange Provider",
      country: "United States",
      region: "North America",
      description: "Facilitates dialogue-based virtual exchange programs connecting students across cultures.",
      languages: ["English", "Arabic"],
      interests: ["Intercultural Dialogue", "Conflict Resolution", "Media Literacy"],
      capacity: "10,000+ students annually",
      verified: true,
      website: "soliya.net",
      partnershipGoals: ["Cross-cultural understanding", "Digital facilitation training"]
    },
    {
      id: 3,
      name: "SUNY COIL",
      type: "Provider",
      category: "Exchange Provider",
      country: "United States",
      region: "North America",
      description: "Collaborative Online International Learning - pioneering virtual exchange in higher education.",
      languages: ["English", "Spanish", "French", "Chinese"],
      interests: ["Higher Education", "Curriculum Integration", "Faculty Development"],
      capacity: "30,000+ students annually",
      verified: true,
      website: "coil.suny.edu",
      partnershipGoals: ["Global learning partnerships", "Faculty training", "Course integration"]
    },
    {
      id: 4,
      name: "iEARN",
      type: "Provider",
      category: "Exchange Provider",
      country: "United States",
      region: "Global Network",
      description: "International Education and Resource Network - the world's largest K-12 online learning community.",
      languages: ["English", "Spanish", "Arabic", "French", "Portuguese"],
      interests: ["Project-Based Learning", "Global Collaboration", "Youth Empowerment"],
      capacity: "150,000+ students in 140+ countries",
      verified: true,
      website: "iearn.org",
      partnershipGoals: ["Student-led projects", "Teacher collaboration", "Global citizenship"]
    },
    {
      id: 5,
      name: "Global Nomads Group",
      type: "Provider",
      category: "Exchange Provider",
      country: "United States",
      region: "North America",
      description: "Uses digital storytelling and video conferencing to connect youth for global dialogue.",
      languages: ["English", "Spanish", "Arabic"],
      interests: ["Digital Storytelling", "Youth Leadership", "Peacebuilding"],
      capacity: "50,000+ students",
      verified: true,
      website: "gng.org",
      partnershipGoals: ["Video exchange programs", "Story-based learning", "Conflict resolution"]
    },
    {
      id: 6,
      name: "Erasmus+ Virtual Exchange",
      type: "Provider",
      category: "Exchange Provider",
      country: "European Union",
      region: "Europe",
      description: "EU-funded initiative promoting intercultural dialogue through virtual exchange.",
      languages: ["English", "Arabic", "French", "German", "Spanish"],
      interests: ["Intercultural Education", "Youth Engagement", "Digital Skills"],
      capacity: "30,000+ participants",
      verified: true,
      website: "europa.eu/erasmus-plus",
      partnershipGoals: ["EU-Mediterranean partnerships", "Higher education exchange"]
    },
    {
      id: 7,
      name: "IREX",
      type: "Provider",
      category: "Exchange Provider",
      country: "United States",
      region: "Global",
      description: "International nonprofit advancing global education and development through exchange programs.",
      languages: ["English", "Russian", "Arabic", "French"],
      interests: ["Media Literacy", "Civil Society", "Youth Development"],
      capacity: "25,000+ participants annually",
      verified: true,
      website: "irex.org",
      partnershipGoals: ["Media literacy programs", "Democracy education", "Leadership development"]
    },

    // HIGHER EDUCATION INSTITUTIONS
    {
      id: 8,
      name: "New York University",
      type: "University",
      category: "Higher Education",
      country: "United States",
      region: "North America",
      students: 52000,
      languages: ["English", "Spanish", "Chinese", "Arabic"],
      interests: ["COIL Programs", "Global Studies", "Social Innovation"],
      verified: true,
      description: "Private research university with extensive global campus network and virtual exchange programs.",
      partnershipGoals: ["Course-integrated VE", "Faculty collaboration", "Research partnerships"]
    },
    {
      id: 9,
      name: "University of California, Berkeley",
      type: "University",
      category: "Higher Education",
      country: "United States",
      region: "North America",
      students: 45000,
      languages: ["English", "Spanish", "Mandarin"],
      interests: ["STEM Education", "Social Justice", "Environmental Studies"],
      verified: true,
      description: "Leading public research university committed to global engagement and collaborative learning.",
      partnershipGoals: ["Research collaboration", "STEM exchanges", "Innovation partnerships"]
    },
    {
      id: 10,
      name: "Georgetown University",
      type: "University",
      category: "Higher Education",
      country: "United States",
      region: "North America",
      students: 20000,
      languages: ["English", "Spanish", "Arabic", "French"],
      interests: ["International Relations", "Diplomacy", "Global Health"],
      verified: true,
      description: "Jesuit university with strong commitment to global engagement and intercultural dialogue.",
      partnershipGoals: ["Diplomacy education", "Global health initiatives", "Cross-cultural exchange"]
    },
    {
      id: 11,
      name: "University of Marburg",
      type: "University",
      category: "Higher Education",
      country: "Germany",
      region: "Europe",
      students: 26000,
      languages: ["German", "English"],
      interests: ["Liberal Arts", "Sciences", "International Studies"],
      verified: true,
      description: "Historic German university embracing digital innovation and global partnerships.",
      partnershipGoals: ["EU-US partnerships", "Research collaboration", "Student mobility alternatives"]
    },
    {
      id: 12,
      name: "University of São Paulo",
      type: "University",
      category: "Higher Education",
      country: "Brazil",
      region: "South America",
      students: 95000,
      languages: ["Portuguese", "English", "Spanish"],
      interests: ["Sustainability", "Public Health", "Engineering"],
      verified: true,
      description: "Latin America's largest and most prestigious university seeking global partnerships.",
      partnershipGoals: ["South-North collaboration", "Sustainability projects", "Faculty exchange"]
    },
    {
      id: 13,
      name: "American University of Cairo",
      type: "University",
      category: "Higher Education",
      country: "Egypt",
      region: "Middle East",
      students: 6500,
      languages: ["English", "Arabic"],
      interests: ["Middle East Studies", "Peace & Conflict", "Media"],
      verified: true,
      description: "English-language university bridging cultures between the Middle East and the West.",
      partnershipGoals: ["Cross-regional dialogue", "Media studies collaboration", "Cultural exchange"]
    },

    // K-12 SCHOOLS
    {
      id: 14,
      name: "Thomas Jefferson High School for Science and Technology",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      students: 1900,
      languages: ["English", "Spanish", "Mandarin"],
      interests: ["STEM", "Computer Science", "Research"],
      verified: true,
      description: "Top-ranked STEM-focused magnet high school seeking international research collaborations.",
      partnershipGoals: ["STEM project collaboration", "Student research exchanges", "Innovation challenges"]
    },
    {
      id: 15,
      name: "Fulham Preparatory School",
      type: "Primary School",
      category: "K-12",
      country: "United Kingdom",
      region: "Europe",
      students: 450,
      languages: ["English", "French"],
      interests: ["Global Citizenship", "Arts", "Environmental Awareness"],
      verified: true,
      description: "Independent primary school in London committed to global education and cultural exchange.",
      partnershipGoals: ["Pen pal programs", "Cultural celebrations", "Environmental projects"]
    },
    {
      id: 16,
      name: "Escola Móbile",
      type: "High School",
      category: "K-12",
      country: "Brazil",
      region: "South America",
      students: 1200,
      languages: ["Portuguese", "English", "Spanish"],
      interests: ["Innovation", "Entrepreneurship", "Sustainability"],
      verified: true,
      description: "Progressive Brazilian school focused on innovation and global collaboration.",
      partnershipGoals: ["Project-based exchanges", "Language partnerships", "Cultural immersion"]
    },
    {
      id: 17,
      name: "Singapore American School",
      type: "High School",
      category: "K-12",
      country: "Singapore",
      region: "Asia",
      students: 4000,
      languages: ["English", "Mandarin", "Spanish"],
      interests: ["STEM", "Global Issues", "Service Learning"],
      verified: true,
      description: "International school serving diverse community with strong global education program.",
      partnershipGoals: ["Model UN exchanges", "STEM collaborations", "Service learning projects"]
    },
    {
      id: 18,
      name: "Lycée International de Saint-Germain-en-Laye",
      type: "High School",
      category: "K-12",
      country: "France",
      region: "Europe",
      students: 3000,
      languages: ["French", "English", "German", "Spanish"],
      interests: ["Multilingual Education", "European Studies", "Arts"],
      verified: true,
      description: "Prestigious multilingual lycée with 14 international sections.",
      partnershipGoals: ["Language exchange", "European integration studies", "Cultural partnerships"]
    },
    {
      id: 19,
      name: "Lincoln High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      students: 850,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Cultural Exchange", "Environmental Studies"],
      verified: true,
      description: "Progressive high school interested in global collaboration and cultural exchange programs.",
      partnershipGoals: ["European partner schools", "Language exchange", "Climate action projects"]
    },
    {
      id: 20,
      name: "Greenfield Middle School",
      type: "Middle School",
      category: "K-12",
      country: "Canada",
      region: "North America",
      students: 450,
      languages: ["English", "French"],
      interests: ["Environmental Studies", "Music", "Sports"],
      verified: true,
      description: "Middle school committed to environmental education and global citizenship.",
      partnershipGoals: ["Climate action projects", "Cultural exchange", "Student leadership"]
    },
    // EAST COAST ART SCHOOLS
    {
      id: 21,
      name: "Rhode Island School of Design (RISD)",
      type: "Art School",
      category: "Higher Education",
      country: "United States",
      region: "North America",
      city: "Providence",
      state: "Rhode Island",
      students: 2500,
      languages: ["English"],
      interests: ["Fine Arts", "Design", "Visual Culture", "Cross-Cultural Dialogue", "Social Justice Art"],
      verified: true,
      description: "Premier art and design college seeking international collaborations in contemporary art, design thinking, and cultural exchange.",
      partnershipGoals: ["Design justice projects", "International studio collaborations", "Art history exchanges"],
      website: "risd.edu"
    },
    {
      id: 22,
      name: "Maryland Institute College of Art (MICA)",
      type: "Art School",
      category: "Higher Education",
      country: "United States",
      region: "North America",
      city: "Baltimore",
      state: "Maryland",
      students: 1800,
      languages: ["English", "Spanish"],
      interests: ["Social Practice Art", "Illustration", "Animation", "Community Engagement", "Public Art"],
      verified: true,
      description: "Leading art college focused on social practice and community-engaged art with global perspective.",
      partnershipGoals: ["Community art projects", "Social justice collaborations", "Digital media exchange"],
      website: "mica.edu"
    },
    {
      id: 23,
      name: "School of Visual Arts (SVA)",
      type: "Art School",
      category: "Higher Education",
      country: "United States",
      region: "North America",
      city: "New York",
      state: "New York",
      students: 4000,
      languages: ["English", "Spanish", "Mandarin"],
      interests: ["Graphic Design", "Photography", "Film", "Illustration", "Digital Arts"],
      verified: true,
      description: "NYC-based art school connecting students globally through visual storytelling and design.",
      partnershipGoals: ["Visual storytelling projects", "Design competitions", "International exhibitions"],
      website: "sva.edu"
    },
    {
      id: 24,
      name: "Pratt Institute",
      type: "Art School",
      category: "Higher Education",
      country: "United States",
      region: "North America",
      city: "Brooklyn",
      state: "New York",
      students: 3200,
      languages: ["English"],
      interests: ["Architecture", "Design", "Fine Arts", "Sustainability", "Urban Design"],
      verified: true,
      description: "Brooklyn art and design school emphasizing sustainable design and global urban challenges.",
      partnershipGoals: ["Sustainable design projects", "Urban planning exchanges", "Architecture collaborations"],
      website: "pratt.edu"
    },
    {
      id: 25,
      name: "Massachusetts College of Art and Design (MassArt)",
      type: "Art School",
      category: "Higher Education",
      country: "United States",
      region: "North America",
      city: "Boston",
      state: "Massachusetts",
      students: 1900,
      languages: ["English"],
      interests: ["Public Art", "Fashion Design", "Fiber Arts", "Social Change", "Community Design"],
      verified: true,
      description: "Public art college committed to art as a tool for social change and community building.",
      partnershipGoals: ["Public art collaborations", "Social change projects", "Fashion sustainability"],
      website: "massart.edu"
    },
    {
      id: 26,
      name: "Maine College of Art & Design (MECA&D)",
      type: "Art School",
      category: "Higher Education",
      country: "United States",
      region: "North America",
      city: "Portland",
      state: "Maine",
      students: 500,
      languages: ["English"],
      interests: ["Environmental Art", "Studio Arts", "Contemporary Practice", "Sustainability"],
      verified: true,
      description: "Small art college focused on environmental art and sustainability in creative practice.",
      partnershipGoals: ["Environmental art projects", "Climate art collaborations", "Rural-urban exchanges"],
      website: "meca.edu"
    },
    {
      id: 27,
      name: "Pennsylvania Academy of the Fine Arts (PAFA)",
      type: "Art School",
      category: "Higher Education",
      country: "United States",
      region: "North America",
      city: "Philadelphia",
      state: "Pennsylvania",
      students: 300,
      languages: ["English"],
      interests: ["Painting", "Sculpture", "Drawing", "Art History", "Museum Studies"],
      verified: true,
      description: "Historic art academy combining museum and school, focused on traditional and contemporary fine arts.",
      partnershipGoals: ["Museum exchange programs", "Classical techniques sharing", "Art history research"],
      website: "pafa.org"
    },
    {
      id: 28,
      name: "Corcoran School of the Arts & Design at GWU",
      type: "Art School",
      category: "Higher Education",
      country: "United States",
      region: "North America",
      city: "Washington",
      state: "District of Columbia",
      students: 800,
      languages: ["English", "Spanish", "French"],
      interests: ["Photojournalism", "Graphic Design", "Fine Arts", "Global Arts", "Cultural Diplomacy"],
      verified: true,
      description: "DC-based art school integrating arts with international policy and cultural diplomacy.",
      partnershipGoals: ["Art diplomacy projects", "Documentary photography exchanges", "Policy and art collaborations"],
      website: "corcoran.gwu.edu"
    },
    {
      id: 29,
      name: "Moore College of Art & Design",
      type: "Art School",
      category: "Higher Education",
      country: "United States",
      region: "North America",
      city: "Philadelphia",
      state: "Pennsylvania",
      students: 400,
      languages: ["English"],
      interests: ["Fashion Design", "Illustration", "Textile Design", "Women in Arts", "Social Practice"],
      verified: true,
      description: "Women's art and design college focused on empowerment through creative practice.",
      partnershipGoals: ["Women artists exchanges", "Fashion sustainability projects", "Feminist art collaborations"],
      website: "moore.edu"
    },
    {
      id: 30,
      name: "School of the Museum of Fine Arts at Tufts (SMFA)",
      type: "Art School",
      category: "Higher Education",
      country: "United States",
      region: "North America",
      city: "Boston",
      state: "Massachusetts",
      students: 600,
      languages: ["English"],
      interests: ["Interdisciplinary Arts", "Community Arts", "Museum Practice", "Contemporary Art"],
      verified: true,
      description: "Art school within Tufts University emphasizing experimental and interdisciplinary practice.",
      partnershipGoals: ["Museum-based learning exchanges", "Interdisciplinary collaborations", "Community art projects"],
      website: "smfa.tufts.edu"
    },
    // PUBLIC ART HIGH SCHOOLS & MIDDLE SCHOOLS (K-12)
    {
      id: 31,
      name: "LaGuardia High School of Music & Art and Performing Arts",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "New York",
      state: "New York",
      students: 2700,
      languages: ["English", "Spanish", "Mandarin"],
      interests: ["Visual Arts", "Music", "Dance", "Drama", "Technical Theater", "Cultural Exchange"],
      verified: true,
      description: "Renowned NYC public arts high school featured in 'Fame,' offering intensive arts training alongside academics.",
      partnershipGoals: ["International arts showcases", "Student performances exchanges", "Visual arts exhibitions"],
      website: "laguardiahs.org"
    },
    {
      id: 32,
      name: "Duke Ellington School of the Arts",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Washington",
      state: "District of Columbia",
      students: 550,
      languages: ["English", "Spanish"],
      interests: ["Visual Arts", "Museum Studies", "Music", "Dance", "Literary Media", "Technical Design"],
      verified: true,
      description: "DC public arts high school providing pre-professional arts training with strong academic curriculum.",
      partnershipGoals: ["Arts diplomacy projects", "International showcases", "Cultural ambassador programs"],
      website: "dukeartsdc.com"
    },
    {
      id: 33,
      name: "New Orleans Center for Creative Arts (NOCCA)",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "New Orleans",
      state: "Louisiana",
      students: 700,
      languages: ["English", "French"],
      interests: ["Visual Arts", "Music", "Dance", "Creative Writing", "Culinary Arts", "Cultural Heritage"],
      verified: true,
      description: "Regional arts high school celebrating Louisiana's rich cultural traditions through intensive arts education.",
      partnershipGoals: ["Cultural heritage exchanges", "Jazz education programs", "Culinary arts partnerships"],
      website: "nocca.com"
    },
    {
      id: 34,
      name: "Baltimore School for the Arts",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Baltimore",
      state: "Maryland",
      students: 450,
      languages: ["English"],
      interests: ["Visual Arts", "Theater", "Dance", "Music", "Social Justice Arts"],
      verified: true,
      description: "Public arts high school emphasizing artistic excellence and community engagement through the arts.",
      partnershipGoals: ["Community arts projects", "Urban arts exchanges", "Social justice art collaborations"],
      website: "bsa.baltimoreCity.gov"
    },
    {
      id: 35,
      name: "Los Angeles County High School for the Arts (LACHSA)",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Los Angeles",
      state: "California",
      students: 800,
      languages: ["English", "Spanish"],
      interests: ["Visual Arts", "Animation", "Film Production", "Music", "Dance", "Theater"],
      verified: true,
      description: "California public residential arts high school providing intensive training for gifted arts students.",
      partnershipGoals: ["Film exchange programs", "Animation collaborations", "Entertainment industry connections"],
      website: "lachsa.net"
    },
    {
      id: 36,
      name: "Booker T. Washington High School for the Performing and Visual Arts",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Dallas",
      state: "Texas",
      students: 750,
      languages: ["English", "Spanish"],
      interests: ["Visual Arts", "Theater", "Dance", "Music", "Arts Management"],
      verified: true,
      description: "Dallas magnet school dedicated to developing artistically gifted students in diverse disciplines.",
      partnershipGoals: ["Southwest cultural exchanges", "Bilingual arts programs", "Performance tours"],
      website: "bookerarts.com"
    },
    {
      id: 37,
      name: "Walnut Hill School for the Arts",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Natick",
      state: "Massachusetts",
      students: 300,
      languages: ["English"],
      interests: ["Ballet", "Music", "Theater", "Visual Arts", "Writing & Publishing"],
      verified: true,
      description: "Independent arts boarding school offering conservatory-level training with college prep academics.",
      partnershipGoals: ["International student exchanges", "Arts intensive programs", "Collaboration projects"],
      website: "walnuthillarts.org"
    },
    {
      id: 38,
      name: "Interlochen Arts Academy",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Interlochen",
      state: "Michigan",
      students: 500,
      languages: ["English", "French", "Spanish"],
      interests: ["Music", "Visual Arts", "Theater", "Dance", "Creative Writing", "Film"],
      verified: true,
      description: "Premier boarding arts high school in northern Michigan with year-round programming.",
      partnershipGoals: ["Summer arts exchanges", "International performances", "Artist residencies"],
      website: "interlochen.org"
    },
    {
      id: 39,
      name: "Chicago High School for the Arts (ChiArts)",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Chicago",
      state: "Illinois",
      students: 600,
      languages: ["English", "Spanish", "Polish"],
      interests: ["Visual Arts", "Music", "Dance", "Theater", "Urban Arts", "Social Practice"],
      verified: true,
      description: "Chicago's public arts high school dedicated to developing diverse artistic voices and perspectives.",
      partnershipGoals: ["Urban arts exchanges", "Community engagement projects", "Multicultural collaborations"],
      website: "chiarts.org"
    },
    {
      id: 40,
      name: "Denver School of the Arts",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Denver",
      state: "Colorado",
      students: 900,
      languages: ["English", "Spanish"],
      interests: ["Visual Arts", "Band", "Orchestra", "Theater", "Dance", "Creative Writing"],
      verified: true,
      description: "Denver public magnet school providing intensive arts education from 6th-12th grade.",
      partnershipGoals: ["Mountain west arts network", "Environmental arts projects", "Native arts collaborations"],
      website: "dsa.dpsk12.org"
    },
    {
      id: 41,
      name: "Arts High School (Newark, NJ)",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Newark",
      state: "New Jersey",
      students: 550,
      languages: ["English", "Spanish", "Portuguese"],
      interests: ["Visual Arts", "Music", "Dance", "Theater", "Arts Administration"],
      verified: true,
      description: "Newark's public arts high school preparing students for arts careers and higher education.",
      partnershipGoals: ["Urban renewal through arts", "Community arts partnerships", "College prep collaborations"],
      website: "nps.k12.nj.us/arts"
    },
    {
      id: 42,
      name: "Perpich Center for Arts Education",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Golden Valley",
      state: "Minnesota",
      students: 400,
      languages: ["English", "Spanish", "Somali"],
      interests: ["Visual Arts", "Music", "Dance", "Theater", "Literary Arts", "Media Arts"],
      verified: true,
      description: "Minnesota's statewide public residential arts high school serving talented students across the state.",
      partnershipGoals: ["Rural-urban arts exchanges", "Nordic arts connections", "Indigenous arts programs"],
      website: "mcae.k12.mn.us"
    },
    {
      id: 43,
      name: "Orange County School of the Arts (OCSA)",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Santa Ana",
      state: "California",
      students: 2200,
      languages: ["English", "Spanish", "Vietnamese"],
      interests: ["Visual Arts", "Music", "Dance", "Theater", "Film & Video", "Creative Writing"],
      verified: true,
      description: "Large public arts high school serving Orange County with comprehensive arts conservatory programs.",
      partnershipGoals: ["Pacific Rim arts exchanges", "Digital media collaborations", "Performance tours"],
      website: "ocsarts.net"
    },
    {
      id: 44,
      name: "Frank Sinatra School of the Arts",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Queens",
      state: "New York",
      students: 800,
      languages: ["English", "Spanish", "Korean"],
      interests: ["Visual Arts", "Drama", "Dance", "Vocal Music", "Instrumental Music", "Film"],
      verified: true,
      description: "NYC public arts high school in Queens emphasizing arts excellence and college preparation.",
      partnershipGoals: ["International showcases", "Youth arts festivals", "Cross-cultural performances"],
      website: "franksinatraschoolofthearts.org"
    },
    {
      id: 45,
      name: "Middle School 244 (The New School for Leadership and the Arts)",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Brooklyn",
      state: "New York",
      students: 350,
      languages: ["English", "Spanish"],
      interests: ["Visual Arts", "Music", "Dance", "Theater Arts", "Leadership Development"],
      verified: true,
      description: "Brooklyn public middle school integrating arts education with leadership training.",
      partnershipGoals: ["Youth leadership exchanges", "Community arts projects", "Arts integration programs"],
      website: "ms244.org"
    },
    {
      id: 46,
      name: "Ruth Asawa San Francisco School of the Arts (SOTA)",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "San Francisco",
      state: "California",
      students: 700,
      languages: ["English", "Spanish", "Mandarin"],
      interests: ["Visual Arts", "Music", "Dance", "Theater", "Technical Arts", "Creative Writing"],
      verified: true,
      description: "San Francisco's public arts high school named after renowned artist Ruth Asawa.",
      partnershipGoals: ["Bay Area arts network", "Asian-Pacific exchanges", "Social justice arts"],
      website: "sota.org"
    },
    {
      id: 47,
      name: "Milwaukee High School of the Arts",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Milwaukee",
      state: "Wisconsin",
      students: 500,
      languages: ["English", "Spanish"],
      interests: ["Visual Arts", "Music", "Dance", "Theater", "Literary Arts"],
      verified: true,
      description: "Milwaukee public magnet school providing comprehensive arts education for talented students.",
      partnershipGoals: ["Great Lakes arts network", "Urban arts initiatives", "Community partnerships"],
      website: "mhsa.milwaukee.k12.wi.us"
    },
    {
      id: 48,
      name: "Classen School of Advanced Studies (Arts Focus)",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Oklahoma City",
      state: "Oklahoma",
      students: 280,
      languages: ["English", "Spanish"],
      interests: ["Visual Arts", "Music", "Theater", "STEAM Integration", "Digital Arts"],
      verified: true,
      description: "Oklahoma City middle school combining advanced academics with intensive arts programming.",
      partnershipGoals: ["Regional arts partnerships", "Native American arts integration", "STEAM collaborations"],
      website: "classenarts.okcps.org"
    },
    {
      id: 49,
      name: "New World School of the Arts",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Miami",
      state: "Florida",
      students: 600,
      languages: ["English", "Spanish", "Creole"],
      interests: ["Visual Arts", "Music", "Theater", "Dance", "Latin Arts", "Caribbean Culture"],
      verified: true,
      description: "Miami public-private arts school celebrating multicultural arts in a diverse urban setting.",
      partnershipGoals: ["Latin American exchanges", "Caribbean arts partnerships", "Bilingual arts programs"],
      website: "nwsarts.com"
    },
    {
      id: 50,
      name: "Metropolitan Arts Institute",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Phoenix",
      state: "Arizona",
      students: 450,
      languages: ["English", "Spanish"],
      interests: ["Visual Arts", "Music", "Theater", "Dance", "Digital Media", "Southwest Arts"],
      verified: true,
      description: "Phoenix public charter arts high school integrating Southwest cultural traditions with contemporary arts.",
      partnershipGoals: ["Southwest arts exchanges", "Indigenous arts collaboration", "Border arts projects"],
      website: "metroartsinstitute.org"
    }
  ];

  // AI Search Handler
  const handleAISearch = () => {
    const query = aiSearchRef.current?.value || '';
    if (!query.trim()) return;
    
    const keywords = query.toLowerCase();
    const filtered = organizations.filter(org => {
      const searchText = `${org.name} ${org.description} ${org.interests.join(' ')} ${org.country}`.toLowerCase();
      return searchText.includes(keywords) || 
             org.type.toLowerCase().includes(keywords) ||
             org.region.toLowerCase().includes(keywords);
    });
    setSearchResults(filtered);
  };

  // Authentication Modal
  const AuthModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Branding */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-3 gap-2 h-full">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-blue-500 rounded"></div>
                ))}
              </div>
            </div>
            <div className="relative z-10 text-center">
              <VirtualExchangeLogo size="lg" />
              <h2 className="text-3xl font-light text-gray-800 mt-6">The Virtual Exchange</h2>
              <p className="text-gray-600 mt-4 text-sm">Breaking down borders through education</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-12">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {authMode === 'signup' ? 'Create An Account' : 'Welcome Back'}
            </h3>
            <p className="text-gray-600 mb-6">
              {authMode === 'signup' ? 'Already an user?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                className="text-blue-600 font-semibold hover:underline"
              >
                {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
              </button>
            </p>

            <form className="space-y-4">
              {authMode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="First Name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Last Name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="password" 
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
              >
                {authMode === 'signup' ? 'Sign Up' : 'Sign In'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or Sign {authMode === 'signup' ? 'Up' : 'In'} With</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <button type="button" className="border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#DB4437" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                <button type="button" className="border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition flex items-center justify-center">
                  <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button type="button" className="border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition flex items-center justify-center">
                  <svg className="w-6 h-6" fill="#0A66C2" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button type="button" className="border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition flex items-center justify-center">
                  <svg className="w-6 h-6" fill="#1DA1F2" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  // Connect Modal
  const ConnectModal = ({ org }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">Connect with {org.name}</h3>
            <p className="text-gray-600 mt-1">Send a professional introduction</p>
          </div>
          <button type="button" onClick={() => setShowConnectModal(false)} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Organization</label>
            <input 
              type="text" 
              placeholder="Organization Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
            <input 
              type="text" 
              placeholder="e.g., Teacher, Administrator, Program Director"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Interest</label>
            <textarea 
              rows="4"
              placeholder="Describe your ideal collaboration and what you hope to achieve together..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Timeline</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Within 1 month</option>
              <option>1-3 months</option>
              <option>3-6 months</option>
              <option>Flexible</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Send Connection Request
            </button>
            <button 
              type="button"
              onClick={() => setShowConnectModal(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Organization Card
  const OrganizationCard = ({ org }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-800">{org.name}</h3>
            {org.verified && (
              <CheckCircle className="text-blue-600" size={20} />
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Globe size={14} />
              {org.country}
            </span>
            <span>•</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
              {org.category}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{org.description}</p>

      <div className="space-y-3 mb-4">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Languages</div>
          <div className="flex flex-wrap gap-2">
            {org.languages.map(lang => (
              <span key={lang} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {lang}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Focus Areas</div>
          <div className="flex flex-wrap gap-2">
            {org.interests.slice(0, 3).map(interest => (
              <span key={interest} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {org.partnershipGoals && (
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Partnership Goals</div>
            <ul className="text-xs text-gray-600 space-y-1">
              {org.partnershipGoals.slice(0, 2).map((goal, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-blue-600">•</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setSelectedOrg(org);
            setShowConnectModal(true);
          }}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
        >
          Connect
        </button>
        <button
          type="button"
          onClick={() => setSelectedOrg(org)}
          className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
        >
          View Profile
        </button>
      </div>
    </div>
  );

  // Home Page
  const HomePage = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-4 gap-4 h-full">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="bg-blue-600 rounded-lg"></div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <VirtualExchangeLogo size="lg" />
          <h1 className="text-6xl font-light text-gray-900 mt-6 mb-4">The Virtual Exchange</h1>
          <p className="text-xl text-gray-600 mb-2 italic">"Every conversation is a step toward solidarity"</p>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            A vetted, professional gateway connecting educational institutions worldwide for meaningful virtual exchange programs
          </p>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Browse Partners
            </button>
          </div>
        </div>
      </div>

      {/* AI Search Section */}
      <div className="bg-white rounded-3xl shadow-lg p-12 border border-gray-100">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Sparkles className="text-purple-600" size={32} />
          <h2 className="text-3xl font-semibold text-gray-800">AI-Powered Matchmaking</h2>
        </div>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Describe your ideal partnership in natural language, and our AI will find the perfect matches for you
        </p>
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Sparkles className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                ref={aiSearchRef}
                type="text"
                onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                placeholder="e.g., 'I'm a high school teacher in Spain looking for a US-based science class for a 4-week environmental project'"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleAISearch}
              className="bg-[#666666] text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition whitespace-nowrap"
            >
              Find Matches
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Try:</span>
            {[
              "STEM partnerships in Europe",
              "Middle school cultural exchange",
              "University research collaboration"
            ].map(example => (
              <button
                type="button"
                key={example}
                onClick={() => {
                  if (aiSearchRef.current) {
                    aiSearchRef.current.value = example;
                    handleAISearch();
                  }
                }}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
        
        {searchResults.length > 0 && (
          <div className="mt-8 max-w-6xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Found {searchResults.length} matching {searchResults.length === 1 ? 'organization' : 'organizations'}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.slice(0, 6).map(org => (
                <OrganizationCard key={org.id} org={org} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Verified Community</h3>
          <p className="text-gray-600">All organizations are thoroughly vetted by MapWorks Learning for safety and authenticity</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Global Network</h3>
          <p className="text-gray-600">Connect with schools, universities, and exchange providers across 30+ countries</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Smart Matching</h3>
          <p className="text-gray-600">AI-powered recommendations find your ideal partners based on goals and compatibility</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12">
        <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { num: "1", title: "Create Profile", desc: "Tell us about your institution and exchange goals" },
            { num: "2", title: "Get Verified", desc: "MapWorks Learning reviews your application" },
            { num: "3", title: "Find Partners", desc: "Use AI search or browse to discover matches" },
            { num: "4", title: "Connect", desc: "Send requests and start your exchange journey" }
          ].map(step => (
            <div key={step.num} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.num}
              </div>
              <h4 className="font-semibold text-lg mb-2 text-gray-800">{step.title}</h4>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MapWorks Section */}
      <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 232.141881846956494 338.498431847133361" className="w-24 h-36">
            <defs>
              <style>
                {`.cls-1{fill:none}.cls-1,.cls-2,.cls-3,.cls-4{stroke-width:0px}.cls-2{fill:#e2d7cf}.cls-3{fill:#fdc20f}.cls-4{fill:#010101}`}
              </style>
            </defs>
            <g>
              <circle className="cls-1" cx="116.070869358580694" cy="108.699568257919054" r="36.558952052235334" transform="translate(-23.06179559778073 31.692137478444366) rotate(-14.157929574861932)"/>
              <polygon className="cls-4" points="137.535488382486619 303.618393128356729 94.606445569940661 303.618393128356729 116.070771550284007 338.498431847133361 137.535488382486619 303.618393128356729"/>
            </g>
            <path className="cls-3" d="m76.358177774963224,273.964872525803912c4.438932637560356-3.101223238967577,9.829403872412513-4.93384123163014,15.655164212825184-4.93384123163014,10.382576720179713,0,19.413894108001841,5.779013485183896,24.057429562495599,14.294759089170839,4.64387420087769-8.515745603986943,13.674852842310429-14.294759089170839,24.057429562490142-14.294759089170839,5.826099086798422,0,11.216231575266647,1.832956739059227,15.655164212827003,4.934179978026805l.885144305702852-1.438317189804366c33.776063366800372-59.078726135398028,75.473372215652489-127.983468927578542,75.473372215652489-163.827241137879355C232.141881846956494,25.136337435787937,162.090484280021883,0,116.126716268564451,0c-.018682615858779,0-.037262103358444.001016239181808-.055944718280443.001016239181808-.018292304825081,0-.037262102421664-.001016239181808-.055554407246746-.001016239181808C70.051397566926425,0,0,25.136337435787937,0,108.699652944516856c0,35.843772210300813,41.69697010246,104.748515002481327,75.473033469258553,163.827241137879355l.885144305704671,1.437978443407701Zm39.712593775320784-201.824424176150387c20.186913360050312,0,36.559256158103381,16.362128333020337,36.559256158103381,36.559204594863331,0,20.197076261845723-16.372342798053069,36.558865848472124-36.559256158103381,36.558865848472124-20.186574613670018,0-36.558864924916634-16.361789586626401-36.558864924916634-36.558865848472124,0-20.197076261842994,16.372290311246616-36.559204594863331,36.558864924916634-36.559204594863331Z"/>
            <path className="cls-2" d="m137.535097530621897,303.618393128356729l18.248267794979256-29.653520602552817c-4.438932637560356-3.101223238967577-9.829403872414332-4.93384123163014-15.655164212827003-4.93384123163014-10.382237973786687,0-19.413555361612453,5.779013485183896-24.057090816104392,14.294759089170839-4.643874200879509-8.515745603986943-13.675191588701637-14.294759089170839-24.05776830888135-14.294759089170839-5.825760340412671,0-11.216231575264828,1.832956739059227-15.655164212825184,4.934179978026805l18.247980069589175,29.653181856156152h42.928939686069498Z"/>
          </svg>
        </div>
        <h3 className="text-3xl font-semibold text-gray-800 mb-4">Developed by MapWorks Learning</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          At MapWorks Learning, virtual exchange isn't just a program we offer—it's what we live and breathe. 
          The Virtual Exchange is our gift to the global community: a vetted, professional gateway designed to break down borders. 
          We believe that every student, from elementary school to university, deserves a window to the world. 
          This platform is the bridge that makes those connections possible, safe, and meaningful.
        </p>
        <a 
          href="https://mapworkslearning.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Learn More About MapWorks
        </a>
      </div>
    </div>
  );

  // Browse Page
  const BrowsePage = () => {
    const [filter, setFilter] = useState('all');
    const [regionFilter, setRegionFilter] = useState('all');
    
    const filteredOrgs = organizations.filter(org => {
      const matchesType = filter === 'all' || org.category === filter;
      const matchesRegion = regionFilter === 'all' || org.region === regionFilter;
      return matchesType && matchesRegion;
    });

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-gray-800 mb-4">Browse Partners</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our global network of verified educational institutions and exchange providers
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="Exchange Provider">Exchange Providers</option>
                <option value="Higher Education">Universities & Colleges</option>
                <option value="K-12">K-12 Schools</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <select 
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Regions</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="South America">South America</option>
                <option value="Middle East">Middle East</option>
                <option value="Global Network">Global</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center text-gray-600">
          Showing {filteredOrgs.length} {filteredOrgs.length === 1 ? 'organization' : 'organizations'}
        </div>

        {/* Organizations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map(org => (
            <OrganizationCard key={org.id} org={org} />
          ))}
        </div>
      </div>
    );
  };

  // About Page
  const AboutPage = () => (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">About The Virtual Exchange</h1>
        <p className="text-xl text-gray-600 italic">"Every conversation is a step toward solidarity"</p>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-lg">
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-gray-700 leading-relaxed text-lg">
            The Virtual Exchange is MapWorks Learning's way of making global connection easier, safer, and more human 
            for students, educators, and communities. It is a place where schools and organizations can find trusted 
            partners, design exchanges that fit real constraints, and create experiences where connection leads to 
            growth and growth leads to action.
          </p>

          <p className="text-gray-700 leading-relaxed text-lg">
            Virtual exchange works when it is built with care. Connection is not a one time event. It is a practice. 
            It grows through clear expectations, thoughtful pacing, skilled facilitation, and spaces where students 
            and teachers feel seen and heard. When those conditions are in place, young people listen more deeply, 
            ask better questions, and learn how to collaborate with respect. Educators gain peers beyond their own 
            walls, strengthen their craft through shared learning, and bring global understanding into everyday 
            classroom life in a way that feels doable, not overwhelming.
          </p>

          <p className="text-gray-700 leading-relaxed text-lg">
            At MapWorks Learning, we design everything around youth leadership. In our campfires, students are not 
            guests in someone else's agenda. They set the tone, shape the questions, and lead the work. Teachers and 
            facilitators hold the space with steadiness, care, and clarity so trust can form and learning can deepen. 
            The Virtual Exchange extends that same approach into a broader ecosystem, so more classrooms and 
            organizations can build relationships across borders and turn those relationships into meaningful projects.
          </p>

          <p className="text-gray-700 leading-relaxed text-lg">
            This matters now because the world is asking young people and educators to live inside tension every day. 
            Polarization is louder. Distrust spreads faster than truth. It is easier to retreat into our own corners, 
            to label, to dismiss, to stop listening. Virtual exchange will not solve every crisis. But it can change 
            the temperature in the room. It can turn "them" into someone with a name, a story, and a voice. It can 
            replace assumption with relationship. It gives students and educators a way to practice open mindedness, 
            compassion, and responsibility in real time, with real people, when it would be simplest to turn away. 
            And that practice is not optional anymore. It is leadership training for the world we are already in.
          </p>

          <p className="text-gray-700 leading-relaxed text-lg font-semibold">
            Virtual exchange should not be a luxury. It should be a standard. The Virtual Exchange exists to help 
            make that standard real, so every student and every educator can access the kind of learning that grows 
            dignity, belonging, and the ability to lead with care in a connected world.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-10 rounded-2xl border-2 border-yellow-200">
        <div className="flex flex-col items-center text-center">
          <MapWorksLogo />
          <h3 className="text-3xl font-bold text-gray-900 mt-6 mb-4">MapWorks Learning</h3>
          <p className="text-gray-700 leading-relaxed text-lg max-w-2xl">
            As leading practitioners of virtual exchange, we've created this platform to connect educators and 
            organizations worldwide – because every conversation is a step toward solidarity.
          </p>
          <a
            href="https://mapworkslearning.org"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition"
          >
            Learn More About MapWorks
          </a>
        </div>
      </div>
    </div>
  );

  // Contact Page
  const ContactPage = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">
          Have questions? We'd love to hear from you.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input 
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input 
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
            <input 
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>General Inquiry</option>
              <option>Partnership Question</option>
              <option>Technical Support</option>
              <option>Verification Status</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea 
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-gray-600">
        <p>Or email us directly at <a href="mailto:info@mapworkslearning.org" className="text-blue-600 hover:underline">info@mapworkslearning.org</a></p>
      </div>
    </div>
  );

  // Donate Page
  const DonatePage = () => (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <Heart className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">Support Global Education</h1>
        <p className="text-xl text-gray-600">
          Help us connect students and educators worldwide
        </p>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Your Support Matters</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          The Virtual Exchange is a free platform designed to democratize access to global learning opportunities. 
          Your donation helps us maintain the platform, verify organizations, and provide support to educators 
          who are working to bring the world into their classrooms.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Every contribution, no matter the size, helps us break down borders and create opportunities for 
          meaningful cross-cultural dialogue.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { amount: "$25", desc: "Support one classroom connection" },
          { amount: "$100", desc: "Help verify 10 organizations" },
          { amount: "$500", desc: "Sponsor a school partnership" }
        ].map(tier => (
          <div key={tier.amount} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-lg transition">
            <div className="text-4xl font-bold text-blue-600 mb-2">{tier.amount}</div>
            <p className="text-gray-600 mb-6">{tier.desc}</p>
            <button type="button" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Donate {tier.amount}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Custom Amount</h3>
        <p className="text-gray-600 mb-6">Choose your own contribution amount</p>
        <div className="max-w-sm mx-auto">
          <div className="flex gap-3 mb-4">
            <span className="bg-gray-100 px-4 py-3 rounded-lg text-gray-700 font-semibold">$</span>
            <input 
              type="number" 
              placeholder="Enter amount"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="button" className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition">
            Make a Donation
          </button>
        </div>
      </div>

      <div className="text-center text-gray-600">
        <p className="mb-2">MapWorks Learning is a registered nonprofit organization</p>
        <p className="text-sm">All donations are tax-deductible</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('home')}>
              <VirtualExchangeLogo size="sm" />
              <div>
                <div className="text-lg font-light text-gray-700">The Virtual Exchange</div>
                <div className="text-xs text-gray-500">by MapWorks Learning</div>
              </div>
            </div>
            <div className="flex gap-8 items-center">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className={`font-medium transition ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className={`font-medium transition ${activeTab === 'browse' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Browse
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`font-medium transition ${activeTab === 'about' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                About
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`font-medium transition ${activeTab === 'contact' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Contact
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('donate')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition flex items-center gap-2"
              >
                <Heart size={16} fill="white" />
                Donate
              </button>
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'browse' && <BrowsePage />}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'donate' && <DonatePage />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-12 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <VirtualExchangeLogo size="sm" />
                <div className="text-base font-medium text-gray-800">The Virtual Exchange</div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Breaking down borders through education
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Platform</h4>
              <div className="space-y-2.5">
                <div className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition">Browse Partners</div>
                <div className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition">How It Works</div>
                <div className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition">Verification</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">About</h4>
              <div className="space-y-2.5">
                <div className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition">Our Mission</div>
                <div className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition">MapWorks Learning</div>
                <div className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition">Contact Us</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Support</h4>
              <div className="space-y-2.5">
                <div className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition">Donate</div>
                <div className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition">FAQ</div>
                <div className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition">Resources</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <MapWorksLogo size="sm" />
                <div className="text-sm text-gray-700">
                  <span className="font-medium">MapWorks Learning</span>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-600 text-sm italic mb-1">"Every conversation is a step toward solidarity"</p>
                <p className="text-gray-500 text-xs">© 2026 The Virtual Exchange | A MapWorks Learning Initiative</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAuthModal && <AuthModal />}
      {showConnectModal && selectedOrg && <ConnectModal org={selectedOrg} />}
    </div>
  );
};

export default VirtualExchangePlatform;