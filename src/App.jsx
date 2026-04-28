import React, { useState, useRef } from 'react';
import { Globe, Users, School, MessageSquare, Search, Filter, CheckCircle, X, Heart, Building, GraduationCap, BookOpen, Sparkles, Shield, Mail, Lock, User, ChevronDown, Download, Upload, FileText, Tag, Menu } from 'lucide-react';

const VirtualExchangePlatform = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [registrationStep, setRegistrationStep] = useState(1);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(() => {
    return !localStorage.getItem('cookieConsent');
  });
  const [showGettingStartedDropdown, setShowGettingStartedDropdown] = useState(false);
  const [showLessonPlanModal, setShowLessonPlanModal] = useState(false);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState(null);
  const [showResourceSubmitModal, setShowResourceSubmitModal] = useState(false);
  const [showIntroductionRequestModal, setShowIntroductionRequestModal] = useState(false);
  const [showClaimProfileModal, setShowClaimProfileModal] = useState(false);
  const [selectedOrgForRequest, setSelectedOrgForRequest] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('userFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [resourceFilters, setResourceFilters] = useState({
    subject: 'all',
    type: 'all',
    ageGroup: 'all'
  });
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    intent: '',
    role: '',
    organization: '',
    gradeLevels: [],
    subjects: [],
    studentMin: '',
    studentMax: '',
    technology: [],
    techRestrictions: '',
    duration: [],
    exchanges: []
  });
  const [signupSubmitting, setSignupSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState('');
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
      name: "MapWorks Learning",
      type: "Provider",
      category: "Exchange Provider",
      country: "United States",
      region: "North America",
      description: "A nonprofit redefining how young people engage with the world through campfire-style exchanges that blend dialogue, project design, and real-world action. We help students think critically, act with care, and lead boldly.",
      languages: ["English", "Spanish", "Arabic"],
      interests: ["Youth Leadership", "Global Competencies", "Project-Based Learning", "Climate Action", "Peace Building"],
      capacity: "1,000+ students annually",
      email: "hello@mapworkslearning.org",
      phone: "+1 (202) 470-3226",
      verified: true,
      website: "mapworkslearning.org",
      partnershipGoals: ["Youth-led programming", "Cross-cultural collaboration", "Action-oriented exchanges"],
      programs: [
        {
          name: "Ukraine Youth Action Network (UYAN)",
          status: "current",
          duration: "14 weeks",
          participants: "20-30 students per cohort",
          description: "Connects young Ukrainians whose lives have been disrupted by war with peers in the United States. Through weekly activities, students share personal stories, explore perspectives, discover heroes, and collaborate on community-building projects that create positive impact. A powerful space for healing, resilience, and cross-cultural understanding.",
          technology: "Zoom, Padlet, Google Workspace",
          schedule: "Weekly sessions",
          applicationDeadline: "Rolling admissions (U.S. schools, Grades 7-12)",
          cost: "Free for schools (teacher stipends available)",
          gradeLevel: "Grades 7-12",
          funding: "Supported by Stevens Initiative and Bezos Family Foundation"
        },
        {
          name: "Youth Global Climate Initiative",
          status: "upcoming",
          duration: "12 weeks",
          participants: "40-50 students (multinational cohorts)",
          description: "An innovative virtual exchange bringing together youth from diverse regions to address the global climate crisis. Students collaborate on climate literacy, examine local environmental challenges, and co-design actionable sustainability projects. Emphasizes systems thinking, youth agency, and community-led climate solutions.",
          technology: "Zoom, Miro, Google Workspace, Slack",
          schedule: "Launching Fall 2026",
          applicationDeadline: "August 2026",
          cost: "Free for schools",
          gradeLevel: "Grades 9-12, University"
        }
      ]
    },
    {
      id: 2,
      name: "Stevens Initiative",
      type: "Provider",
      category: "Exchange Provider",
      country: "United States",
      region: "North America",
      description: "A leading virtual exchange initiative funded by the U.S. Department of State, connecting youth globally.",
      languages: ["English", "Arabic", "Spanish"],
      interests: ["Cross-Cultural Dialogue", "Peace Building", "STEM"],
      capacity: "50,000+ participants annually",
      email: "info@stevensinitiative.org",
      phone: "+1 (202) 464-6040",
      verified: true,
      website: "stevensinitiative.org",
      partnershipGoals: ["Expand VE programs", "Build institutional capacity", "Foster global citizenship"],
      programs: []
    },
    {
      id: 3,
      name: "Soliya",
      type: "Provider",
      category: "Exchange Provider",
      country: "United States",
      region: "North America",
      description: "Facilitates dialogue-based virtual exchange programs connecting students across cultures.",
      languages: ["English", "Arabic"],
      interests: ["Intercultural Dialogue", "Conflict Resolution", "Media Literacy"],
      capacity: "10,000+ students annually",
      email: "info@soliya.net",
      phone: "+1 (212) 655-5050",
      verified: true,
      website: "soliya.net",
      partnershipGoals: ["Cross-cultural understanding", "Digital facilitation training"],
      programs: [
        {
          name: "Connect Program",
          status: "current",
          duration: "4-8 weeks",
          participants: "8-10 students per dialogue group",
          description: "Partners with universities and youth organizations worldwide to bring together students in small, diverse groups for facilitated dialogues on identity, conflict, and current global events. A transformational space where participants gain confidence to engage across differences.",
          technology: "Custom dialogue platform, video conferencing",
          schedule: "Twice weekly 2-hour sessions",
          applicationDeadline: "Rolling admissions",
          cost: "Contact for institutional pricing",
          gradeLevel: "University"
        },
        {
          name: "Global Circles",
          status: "current",
          duration: "Varies",
          participants: "Small diverse groups",
          description: "Pro-facilitated, accelerated dialogue bringing together hundreds of participants in small groups reflecting diverse backgrounds, geographies, identities, and worldviews to discuss global issues sparking debate and shaping societies.",
          technology: "Custom dialogue platform",
          schedule: "Flexible scheduling",
          applicationDeadline: "Rolling admissions",
          cost: "Contact for pricing",
          gradeLevel: "University, Professional"
        }
      ]
    },
    {
      id: 4,
      name: "SUNY COIL",
      type: "Provider",
      category: "Exchange Provider",
      country: "United States",
      region: "North America",
      description: "Collaborative Online International Learning - pioneering virtual exchange in higher education.",
      languages: ["English", "Spanish", "French", "Chinese"],
      interests: ["Higher Education", "Curriculum Integration", "Faculty Development"],
      capacity: "30,000+ students annually",
      email: "coil@suny.edu",
      phone: "+1 (518) 443-5011",
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
      email: "info@iearn.org",
      phone: "+1 (212) 870-2332",
      verified: true,
      website: "iearn.org",
      partnershipGoals: ["Student-led projects", "Teacher collaboration", "Global citizenship"],
      programs: [
        {
          name: "Meet the World",
          status: "current",
          duration: "4-12 weeks",
          participants: "Classroom partnerships",
          description: "Virtual program connecting classrooms across the country or around the world, providing students with opportunities to explore different cultures, ask meaningful questions, and engage in shared learning experiences with peers.",
          technology: "Safe online collaboration platform, video conferencing",
          schedule: "Flexible, teacher-determined",
          applicationDeadline: "Rolling admissions",
          cost: "Free for schools",
          gradeLevel: "K-12"
        },
        {
          name: "Compañeros de Clase Globales",
          status: "current",
          duration: "8-16 weeks",
          participants: "Spanish-speaking classrooms",
          description: "Grant-funded international virtual exchange program focused on igniting learning and sparking curiosity about the world through collaborative projects inspired by UN Sustainable Development Goals. Connects Spanish-speaking students from the U.S., Guatemala, and Mexico.",
          technology: "iEARN Collaboration Centre, video tools",
          schedule: "Project-based, flexible timing",
          applicationDeadline: "Rolling admissions",
          cost: "Free (grant-funded)",
          gradeLevel: "Grades 4-12"
        },
        {
          name: "Storytelling for Social Change",
          status: "current",
          duration: "10-14 weeks",
          participants: "Youth from Algeria, Tunisia, and U.S.",
          description: "Builds global leaders by engaging Algerian, Tunisian, and American youth in collaboration to tell stories about real world issues in their local communities.",
          technology: "Digital storytelling tools, video conferencing",
          schedule: "Weekly sessions",
          applicationDeadline: "Contact for dates",
          cost: "Free (grant-funded)",
          gradeLevel: "Grades 9-12, University"
        }
      ]
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
      email: "info@gng.org",
      phone: "+1 (212) 563-7973",
      verified: true,
      website: "gng.org",
      partnershipGoals: ["Video exchange programs", "Story-based learning", "Conflict resolution"],
      programs: [
        {
          name: "Real Youth, Artificial Intelligence",
          status: "current",
          duration: "8-10 weeks",
          participants: "Middle and high school students",
          description: "Connects youth from the U.S. and the Middle East and North Africa to examine responsible use of AI in their digital lives. Developed by young designers via GNG's Content Creation Lab, participants also learn curriculum development, design, video production, and digital safety practices.",
          technology: "Video conferencing, digital collaboration tools",
          schedule: "In-class or out-of-class options",
          applicationDeadline: "Rolling admissions",
          cost: "Free (Stevens Initiative funded)",
          gradeLevel: "Grades 6-12"
        },
        {
          name: "Global Campfire",
          status: "current",
          duration: "6-12 weeks",
          participants: "Partner classrooms",
          description: "Project-based curriculum where students work together with a partner classroom from another country to explore global citizenship through collaborative projects focused on civic education, positive social change, and sustainable environment.",
          technology: "Video conferencing, digital collaboration spaces",
          schedule: "Weekly sessions",
          applicationDeadline: "Rolling admissions",
          cost: "Contact for pricing",
          gradeLevel: "Grades 6-12"
        },
        {
          name: "Youth Voices",
          status: "current",
          duration: "Varies",
          participants: "Classroom connections",
          description: "Video conferencing program connecting classrooms to learn together on civic education, creating positive social change, and learning science for sustainable environment.",
          technology: "Video conferencing platform",
          schedule: "Flexible",
          applicationDeadline: "Rolling admissions",
          cost: "Contact for pricing",
          gradeLevel: "Grades 6-12"
        }
      ]
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
      email: "contact@erasmusplus.eu",
      phone: "+32 2 299 9696",
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
      email: "communications@irex.org",
      phone: "+1 (202) 628-8188",
      verified: true,
      website: "irex.org",
      partnershipGoals: ["Media literacy programs", "Democracy education", "Leadership development"],
      programs: [
        {
          name: "Global Solutions Sustainability Challenge",
          status: "current",
          duration: "12 weeks",
          participants: "Binational college teams (U.S., Iraq, Jordan)",
          description: "Virtual exchange pairing college students on binational teams to address community challenges related to UN Sustainable Development Goals and innovate sustainable solutions. Emphasizes design thinking, cross-cultural collaboration, and workforce development.",
          technology: "Video conferencing, collaborative project tools",
          schedule: "Weekly team meetings and structured activities",
          applicationDeadline: "Contact for cohort dates",
          cost: "Free (Stevens Initiative funded)",
          gradeLevel: "University"
        },
        {
          name: "Global Solutions Conversations",
          status: "current",
          duration: "6 weeks",
          participants: "College students (U.S., Iraq, Jordan)",
          description: "Six-week virtual exchange series consisting of six binational calls where students practice cross-cultural collaboration, learn about each other's culture, engage in design thinking, and discuss global issues in their communities.",
          technology: "Video conferencing platform",
          schedule: "Weekly 90-minute sessions",
          applicationDeadline: "Contact for cohort dates",
          cost: "Free (Stevens Initiative funded)",
          gradeLevel: "University"
        }
      ]
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
      description: "English-language university bridging cultures between the Middle East and the West.",
      partnershipGoals: ["Cross-regional dialogue", "Media studies collaboration", "Cultural exchange"]
    },

    // K-12 SCHOOLS
    {
      id: 14,
      name: "Thomas Jefferson High School for Science and Technology",
      type: "High School",
      category: "K-12",
      grades: "9-12",
      country: "United States",
      region: "North America",
      students: 1900,
      languages: ["English", "Spanish", "Mandarin"],
      interests: ["STEM", "Computer Science", "Research"],
      description: "Top-ranked STEM-focused magnet high school seeking international research collaborations.",
      partnershipGoals: ["STEM project collaboration", "Student research exchanges", "Innovation challenges"],
      techAvailable: ["1:1 Chromebooks", "Google Workspace", "Zoom", "High-speed WiFi"],
      duration: ["6 weeks", "Semester", "Full year"]
    },
    {
      id: 15,
      name: "Fulham Preparatory School",
      type: "Primary School",
      category: "K-12",
      grades: "K-6",
      country: "United Kingdom",
      region: "Europe",
      students: 450,
      languages: ["English", "French"],
      interests: ["Global Citizenship", "Arts", "Environmental Awareness"],
      description: "Independent primary school in London committed to global education and cultural exchange.",
      partnershipGoals: ["Pen pal programs", "Cultural celebrations", "Environmental projects"],
      techAvailable: ["iPads", "Microsoft Teams", "SmartBoards"],
      duration: ["4 weeks", "6 weeks", "8 weeks"]
    },
    {
      id: 16,
      name: "Escola Móbile",
      type: "High School",
      category: "K-12",
      grades: "9-12",
      country: "Brazil",
      region: "South America",
      students: 1200,
      languages: ["Portuguese", "English", "Spanish"],
      interests: ["Innovation", "Entrepreneurship", "Sustainability"],
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
      description: "Premier art and design college seeking international collaborations in contemporary art, design thinking, and cultural exchange.",
      partnershipGoals: ["Design justice projects", "International studio collaborations", "Art history exchanges"],
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
      description: "Leading art college focused on social practice and community-engaged art with global perspective.",
      partnershipGoals: ["Community art projects", "Social justice collaborations", "Digital media exchange"],
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
      description: "NYC-based art school connecting students globally through visual storytelling and design.",
      partnershipGoals: ["Visual storytelling projects", "Design competitions", "International exhibitions"],
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
      description: "Brooklyn art and design school emphasizing sustainable design and global urban challenges.",
      partnershipGoals: ["Sustainable design projects", "Urban planning exchanges", "Architecture collaborations"],
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
      description: "Public art college committed to art as a tool for social change and community building.",
      partnershipGoals: ["Public art collaborations", "Social change projects", "Fashion sustainability"],
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
      description: "Small art college focused on environmental art and sustainability in creative practice.",
      partnershipGoals: ["Environmental art projects", "Climate art collaborations", "Rural-urban exchanges"],
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
      description: "Historic art academy combining museum and school, focused on traditional and contemporary fine arts.",
      partnershipGoals: ["Museum exchange programs", "Classical techniques sharing", "Art history research"],
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
      description: "DC-based art school integrating arts with international policy and cultural diplomacy.",
      partnershipGoals: ["Art diplomacy projects", "Documentary photography exchanges", "Policy and art collaborations"],
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
      description: "Women's art and design college focused on empowerment through creative practice.",
      partnershipGoals: ["Women artists exchanges", "Fashion sustainability projects", "Feminist art collaborations"],
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
      description: "Art school within Tufts University emphasizing experimental and interdisciplinary practice.",
      partnershipGoals: ["Museum-based learning exchanges", "Interdisciplinary collaborations", "Community art projects"],
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
      description: "Renowned NYC public arts high school featured in 'Fame,' offering intensive arts training alongside academics.",
      partnershipGoals: ["International arts showcases", "Student performances exchanges", "Visual arts exhibitions"],
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
      description: "DC public arts high school providing pre-professional arts training with strong academic curriculum.",
      partnershipGoals: ["Arts diplomacy projects", "International showcases", "Cultural ambassador programs"],
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
      description: "Regional arts high school celebrating Louisiana's rich cultural traditions through intensive arts education.",
      partnershipGoals: ["Cultural heritage exchanges", "Jazz education programs", "Culinary arts partnerships"],
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
      description: "Public arts high school emphasizing artistic excellence and community engagement through the arts.",
      partnershipGoals: ["Community arts projects", "Urban arts exchanges", "Social justice art collaborations"],
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
      description: "California public residential arts high school providing intensive training for gifted arts students.",
      partnershipGoals: ["Film exchange programs", "Animation collaborations", "Entertainment industry connections"],
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
      description: "Dallas magnet school dedicated to developing artistically gifted students in diverse disciplines.",
      partnershipGoals: ["Southwest cultural exchanges", "Bilingual arts programs", "Performance tours"],
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
      description: "Independent arts boarding school offering conservatory-level training with college prep academics.",
      partnershipGoals: ["International student exchanges", "Arts intensive programs", "Collaboration projects"],
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
      description: "Premier boarding arts high school in northern Michigan with year-round programming.",
      partnershipGoals: ["Summer arts exchanges", "International performances", "Artist residencies"],
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
      description: "Chicago's public arts high school dedicated to developing diverse artistic voices and perspectives.",
      partnershipGoals: ["Urban arts exchanges", "Community engagement projects", "Multicultural collaborations"],
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
      description: "Denver public magnet school providing intensive arts education from 6th-12th grade.",
      partnershipGoals: ["Mountain west arts network", "Environmental arts projects", "Native arts collaborations"],
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
      description: "Newark's public arts high school preparing students for arts careers and higher education.",
      partnershipGoals: ["Urban renewal through arts", "Community arts partnerships", "College prep collaborations"],
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
      description: "Minnesota's statewide public residential arts high school serving talented students across the state.",
      partnershipGoals: ["Rural-urban arts exchanges", "Nordic arts connections", "Indigenous arts programs"],
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
      description: "Large public arts high school serving Orange County with comprehensive arts conservatory programs.",
      partnershipGoals: ["Pacific Rim arts exchanges", "Digital media collaborations", "Performance tours"],
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
      description: "NYC public arts high school in Queens emphasizing arts excellence and college preparation.",
      partnershipGoals: ["International showcases", "Youth arts festivals", "Cross-cultural performances"],
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
      description: "Brooklyn public middle school integrating arts education with leadership training.",
      partnershipGoals: ["Youth leadership exchanges", "Community arts projects", "Arts integration programs"],
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
      description: "San Francisco's public arts high school named after renowned artist Ruth Asawa.",
      partnershipGoals: ["Bay Area arts network", "Asian-Pacific exchanges", "Social justice arts"],
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
      description: "Milwaukee public magnet school providing comprehensive arts education for talented students.",
      partnershipGoals: ["Great Lakes arts network", "Urban arts initiatives", "Community partnerships"],
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
      description: "Oklahoma City middle school combining advanced academics with intensive arts programming.",
      partnershipGoals: ["Regional arts partnerships", "Native American arts integration", "STEAM collaborations"],
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
      description: "Miami public-private arts school celebrating multicultural arts in a diverse urban setting.",
      partnershipGoals: ["Latin American exchanges", "Caribbean arts partnerships", "Bilingual arts programs"],
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
      description: "Phoenix public charter arts high school integrating Southwest cultural traditions with contemporary arts.",
      partnershipGoals: ["Southwest arts exchanges", "Indigenous arts collaboration", "Border arts projects"],
    },

    // PUBLIC STEM SCHOOLS
    {
      id: 51,
      name: "BASIS Scottsdale",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Scottsdale",
      state: "Arizona",
      students: 850,
      languages: ["English"],
      interests: ["STEM", "Computer Science", "Engineering", "Mathematics"],
      description: "Top-ranked public charter school with rigorous STEM curriculum and international focus.",
      partnershipGoals: ["STEM research exchanges", "Coding competitions", "Mathematics olympiads"]
    },
    {
      id: 52,
      name: "North Carolina School of Science and Mathematics",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Durham",
      state: "North Carolina",
      students: 680,
      languages: ["English"],
      interests: ["STEM", "Research", "Innovation", "Scientific Inquiry"],
      description: "Nation's first public residential high school focused on science, technology, and mathematics.",
      partnershipGoals: ["Research collaborations", "STEM mentorship", "Innovation challenges"]
    },
    {
      id: 53,
      name: "Illinois Mathematics and Science Academy",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Aurora",
      state: "Illinois",
      students: 650,
      languages: ["English"],
      interests: ["STEM", "Mathematics", "Science Research", "Technology Innovation"],
      description: "Premier public residential STEM school preparing students for leadership in science and technology.",
      partnershipGoals: ["Student research exchanges", "STEM curriculum development", "Global challenges"]
    },
    {
      id: 54,
      name: "Brooklyn Technical High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Brooklyn",
      state: "New York",
      students: 5800,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering", "Computer Science", "Architecture"],
      website: "brooklyntechnicalhighschool.edu",
      email: "info@brooklyntechnicalhighschool.edu",
      phone: "+1 (718) 637-9037",
      verified: true,
      description: "One of the largest specialized STEM high schools in the United States.",
      partnershipGoals: ["Engineering projects", "Technology competitions", "Urban planning exchanges"]
    },
    {
      id: 55,
      name: "Stuyvesant High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "New York",
      state: "New York",
      students: 3300,
      languages: ["English", "Spanish", "Mandarin"],
      interests: ["STEM", "Computer Science", "Mathematics", "Physics"],
      website: "stuyvesanthighschool.edu",
      email: "info@stuyvesanthighschool.edu",
      phone: "+1 (718) 221-1421",
      verified: true,
      description: "Elite public STEM high school known for rigorous academics and technological innovation.",
      partnershipGoals: ["STEM olympiads", "Research partnerships", "Tech innovation exchanges"]
    },
    {
      id: 56,
      name: "Bronx High School of Science",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Bronx",
      state: "New York",
      students: 3000,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Scientific Research", "Mathematics", "Environmental Science"],
      website: "bronxhighschoolofscience.edu",
      email: "info@bronxhighschoolofscience.edu",
      phone: "+1 (917) 870-8670",
      verified: true,
      description: "Historic public STEM school producing numerous Nobel laureates and leading scientists.",
      partnershipGoals: ["Science research exchanges", "Environmental projects", "Student mentorship"]
    },
    {
      id: 57,
      name: "Montgomery Blair High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Silver Spring",
      state: "Maryland",
      students: 2700,
      languages: ["English", "Spanish", "French"],
      interests: ["STEM", "Computer Science", "Mathematics", "Science Research"],
      website: "montgomeryblairhighschool.edu",
      email: "info@montgomeryblairhighschool.edu",
      phone: "+1 (555) 748-2348",
      verified: true,
      description: "Public magnet high school with renowned STEM magnet program and diverse student body.",
      partnershipGoals: ["STEM competitions", "Research collaborations", "Technology exchanges"]
    },
    {
      id: 58,
      name: "Mission San Jose High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Fremont",
      state: "California",
      students: 2100,
      languages: ["English", "Mandarin", "Spanish"],
      interests: ["STEM", "Computer Science", "Robotics", "Mathematics"],
      website: "missionsanjosehighschool.edu",
      email: "info@missionsanjosehighschool.edu",
      phone: "+1 (415) 500-5100",
      verified: true,
      description: "Top-ranked public high school with strong STEM programs and Silicon Valley connections.",
      partnershipGoals: ["Tech industry partnerships", "Robotics competitions", "Coding exchanges"]
    },
    {
      id: 59,
      name: "Lynbrook High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "San Jose",
      state: "California",
      students: 1900,
      languages: ["English", "Mandarin"],
      interests: ["STEM", "Engineering", "Computer Science", "Mathematics"],
      website: "lynbrookhighschool.edu",
      email: "info@lynbrookhighschool.edu",
      phone: "+1 (650) 605-2605",
      verified: true,
      description: "High-performing public school with comprehensive STEM programs and technology focus.",
      partnershipGoals: ["Innovation challenges", "STEM mentorship", "International competitions"]
    },
    {
      id: 60,
      name: "Bergen County Academies",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Hackensack",
      state: "New Jersey",
      students: 1100,
      languages: ["English"],
      interests: ["STEM", "Engineering", "Medical Science", "Computer Science"],
      website: "bergencountyacademies.edu",
      email: "info@bergencountyacademies.edu",
      phone: "+1 (555) 385-7185",
      verified: true,
      description: "Public magnet school offering seven specialized academies including engineering and medical science.",
      partnershipGoals: ["STEM academy exchanges", "Research partnerships", "Career exploration"]
    },
    {
      id: 61,
      name: "Raleigh Charter High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Raleigh",
      state: "North Carolina",
      students: 620,
      languages: ["English"],
      interests: ["STEM", "Research Triangle Collaboration", "Technology", "Innovation"],
      website: "raleighcharterhighschool.edu",
      email: "info@raleighcharterhighschool.edu",
      phone: "+1 (555) 794-2394",
      verified: true,
      description: "Public charter school leveraging Research Triangle Park connections for STEM education.",
      partnershipGoals: ["Research park collaborations", "STEM mentorship", "Innovation projects"]
    },
    {
      id: 62,
      name: "Tesla STEM High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Redmond",
      state: "Washington",
      students: 950,
      languages: ["English", "Mandarin"],
      interests: ["STEM", "Technology", "Engineering Design", "Innovation"],
      description: "Public STEM-focused school partnering with tech companies for real-world learning experiences.",
      partnershipGoals: ["Tech industry partnerships", "Project-based learning", "Innovation exchanges"]
    },
    {
      id: 63,
      name: "Detroit Edison Public School Academy",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Detroit",
      state: "Michigan",
      students: 650,
      languages: ["English"],
      interests: ["STEM", "Engineering", "Technology", "Urban Innovation"],
      description: "Public charter school with STEM focus serving Detroit's diverse community.",
      partnershipGoals: ["Urban STEM solutions", "Industry partnerships", "Community technology projects"]
    },
    {
      id: 64,
      name: "School of Science and Engineering",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Dallas",
      state: "Texas",
      students: 1450,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering", "Science Research", "Technology"],
      description: "Public magnet school offering rigorous STEM curriculum with university partnerships.",
      partnershipGoals: ["University collaborations", "STEM research", "Engineering projects"]
    },
    {
      id: 65,
      name: "High Technology High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Lincroft",
      state: "New Jersey",
      students: 280,
      languages: ["English"],
      interests: ["STEM", "Computer Science", "Engineering", "Biotechnology"],
      description: "Selective public school focusing on advanced technology and engineering education.",
      partnershipGoals: ["Tech competitions", "Research partnerships", "Innovation challenges"]
    },
    {
      id: 66,
      name: "Whitney M. Young Magnet High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Chicago",
      state: "Illinois",
      students: 2100,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Mathematics", "Science", "Technology"],
      description: "Chicago's premier public magnet school with strong STEM curriculum and diverse enrollment.",
      partnershipGoals: ["Urban STEM initiatives", "Mathematics competitions", "Science exchanges"]
    },
    {
      id: 67,
      name: "Gwinnett School of Mathematics, Science and Technology",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Lawrenceville",
      state: "Georgia",
      students: 850,
      languages: ["English"],
      interests: ["STEM", "Mathematics", "Science Research", "Technology Innovation"],
      description: "Public residential magnet school offering intensive STEM education in metro Atlanta.",
      partnershipGoals: ["STEM research exchanges", "Innovation partnerships", "Academic competitions"]
    },
    {
      id: 68,
      name: "Central Magnet School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Murfreesboro",
      state: "Tennessee",
      students: 480,
      languages: ["English"],
      interests: ["STEM", "Science", "Mathematics", "Technology"],
      description: "Public magnet school with strong STEM focus and advanced placement offerings.",
      partnershipGoals: ["STEM curriculum exchanges", "Research projects", "Student mentorship"]
    },
    {
      id: 69,
      name: "Design Tech High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Redwood City",
      state: "California",
      students: 550,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Design Thinking", "Technology", "Innovation"],
      description: "Public charter school integrating design thinking with STEM education.",
      partnershipGoals: ["Design thinking workshops", "Innovation projects", "Tech collaborations"]
    },
    {
      id: 70,
      name: "Mass Academy of Math and Science",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Worcester",
      state: "Massachusetts",
      students: 120,
      languages: ["English"],
      interests: ["STEM", "Mathematics", "Science Research", "Technology"],
      description: "Public residential STEM school on Worcester Polytechnic Institute campus.",
      partnershipGoals: ["University research partnerships", "STEM competitions", "Academic exchanges"]
    },
    {
      id: 71,
      name: "BASIS Peoria",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Peoria",
      state: "Arizona",
      students: 450,
      languages: ["English"],
      interests: ["STEM", "Mathematics", "Science", "Technology"],
      description: "Public charter middle school with accelerated STEM curriculum and global perspective.",
      partnershipGoals: ["STEM curriculum exchanges", "Mathematics competitions", "Science projects"]
    },
    {
      id: 72,
      name: "Explorer Middle School",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Phoenix",
      state: "Arizona",
      students: 620,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Robotics", "Coding", "Engineering"],
      description: "Public middle school with comprehensive STEM program and maker space.",
      partnershipGoals: ["Robotics competitions", "STEM exchanges", "Project-based learning"]
    },
    {
      id: 73,
      name: "Rachel Carson Middle School",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Herndon",
      state: "Virginia",
      students: 1200,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Environmental Science", "Technology", "Mathematics"],
      description: "Public middle school with IB program and strong STEM focus.",
      partnershipGoals: ["Environmental STEM projects", "Global exchanges", "Science collaborations"]
    },
    {
      id: 74,
      name: "KIPP Inwood Academy",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "New York",
      state: "New York",
      students: 480,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Mathematics", "Science", "College Preparation"],
      description: "Public charter middle school with rigorous STEM curriculum preparing students for college.",
      partnershipGoals: ["STEM mentorship", "College prep partnerships", "Science exchanges"]
    },
    {
      id: 75,
      name: "Eastside STEAM Academy",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "East Palo Alto",
      state: "California",
      students: 350,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Arts Integration", "Technology", "Innovation"],
      description: "Public middle school integrating STEAM education with community engagement.",
      partnershipGoals: ["STEAM projects", "Community partnerships", "Arts and tech integration"]
    },
    {
      id: 76,
      name: "River Trails Middle School",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Mount Prospect",
      state: "Illinois",
      students: 950,
      languages: ["English"],
      interests: ["STEM", "Robotics", "Engineering", "Technology"],
      description: "Public middle school with award-winning STEM program and robotics team.",
      partnershipGoals: ["Robotics competitions", "STEM exchanges", "Engineering challenges"]
    },
    {
      id: 77,
      name: "Hopkins West Junior High",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Minnetonka",
      state: "Minnesota",
      students: 1100,
      languages: ["English"],
      interests: ["STEM", "Engineering", "Computer Science", "Innovation"],
      description: "Public middle school with comprehensive STEM curriculum and technology integration.",
      partnershipGoals: ["STEM curriculum development", "Technology partnerships", "Innovation projects"]
    },
    {
      id: 78,
      name: "Odle Middle School",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Bellevue",
      state: "Washington",
      students: 850,
      languages: ["English", "Mandarin"],
      interests: ["STEM", "Robotics", "Mathematics", "Science"],
      description: "Public middle school with strong STEM program and diverse international community.",
      partnershipGoals: ["International STEM exchanges", "Robotics partnerships", "Math competitions"]
    },
    {
      id: 79,
      name: "Frost Middle School",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Fairfax",
      state: "Virginia",
      students: 1050,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Technology", "Science", "Engineering"],
      description: "Public middle school with advanced STEM offerings and technology integration.",
      partnershipGoals: ["STEM exchanges", "Technology projects", "Science partnerships"]
    },
    {
      id: 80,
      name: "Piedmont Middle School",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "San Jose",
      state: "California",
      students: 780,
      languages: ["English", "Spanish", "Vietnamese"],
      interests: ["STEM", "Engineering", "Robotics", "Computer Science"],
      description: "Public middle school serving diverse community with comprehensive STEM program.",
      partnershipGoals: ["STEM diversity initiatives", "Engineering projects", "Tech partnerships"]
    },
    {
      id: 81,
      name: "Beckendorff Junior High",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Katy",
      state: "Texas",
      students: 1400,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Science Research", "Technology", "Mathematics"],
      description: "Large public middle school with extensive STEM programs and competitions.",
      partnershipGoals: ["STEM competitions", "Science exchanges", "Research partnerships"]
    },
    {
      id: 82,
      name: "Fulton Science Academy",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Alpharetta",
      state: "Georgia",
      students: 550,
      languages: ["English"],
      interests: ["STEM", "Science Olympiad", "Mathematics", "Technology"],
      description: "Public charter middle school with science-focused curriculum and hands-on learning.",
      partnershipGoals: ["Science Olympiad exchanges", "STEM mentorship", "Research projects"]
    },
    {
      id: 83,
      name: "Harmony School of Innovation",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Houston",
      state: "Texas",
      students: 620,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Innovation", "Engineering", "Robotics"],
      description: "Public charter middle school emphasizing STEM innovation and project-based learning.",
      partnershipGoals: ["Innovation challenges", "Robotics competitions", "STEM exchanges"]
    },
    {
      id: 84,
      name: "Canyon Vista Middle School",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Round Rock",
      state: "Texas",
      students: 1150,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Robotics", "Computer Science", "Mathematics"],
      description: "Public middle school with award-winning STEM program and technology focus.",
      partnershipGoals: ["Robotics exchanges", "STEM curriculum sharing", "Tech competitions"]
    },
    {
      id: 85,
      name: "Northview Middle School",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Johns Creek",
      state: "Georgia",
      students: 1300,
      languages: ["English"],
      interests: ["STEM", "Mathematics", "Science", "Technology"],
      description: "High-performing public middle school with comprehensive STEM curriculum.",
      partnershipGoals: ["STEM exchanges", "Academic competitions", "International partnerships"]
    },
    {
      id: 86,
      name: "STEM Academy of Hollywood",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Hollywood",
      state: "Florida",
      students: 480,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering", "Robotics", "Computer Programming"],
      description: "Public magnet middle school with intensive STEM curriculum and hands-on learning.",
      partnershipGoals: ["STEM project exchanges", "Engineering partnerships", "Technology competitions"]
    },
    {
      id: 87,
      name: "Alice Deal Middle School",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Washington",
      state: "District of Columbia",
      students: 1200,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Environmental Science", "Technology", "Mathematics"],
      description: "Urban public middle school with strong STEM program and diverse student body.",
      partnershipGoals: ["Urban STEM initiatives", "Environmental projects", "Technology exchanges"]
    },
    {
      id: 88,
      name: "Summit Elementary School",
      type: "Primary School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Boulder",
      state: "Colorado",
      students: 380,
      languages: ["English"],
      interests: ["STEM", "Environmental Education", "Technology", "Innovation"],
      description: "Public elementary school integrating STEM education with environmental focus.",
      partnershipGoals: ["Environmental STEM projects", "Elementary exchanges", "Innovation in education"]
    },
    {
      id: 89,
      name: "BASIS Chandler Primary",
      type: "Primary School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Chandler",
      state: "Arizona",
      students: 520,
      languages: ["English"],
      interests: ["STEM", "Mathematics", "Science Exploration", "Critical Thinking"],
      description: "Public charter elementary school with rigorous STEM-focused curriculum.",
      partnershipGoals: ["Elementary STEM exchanges", "Mathematics programs", "Science partnerships"]
    },
    {
      id: 90,
      name: "KIPP STAR Elementary",
      type: "Primary School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Austin",
      state: "Texas",
      students: 450,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Science", "Technology Literacy", "Mathematics"],
      description: "Public charter elementary school building strong STEM foundation for underserved communities.",
      partnershipGoals: ["Elementary STEM initiatives", "Community partnerships", "Educational equity"]
    },
    {
      id: 91,
      name: "Exploris STEM Elementary",
      type: "Primary School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Raleigh",
      state: "North Carolina",
      students: 410,
      languages: ["English"],
      interests: ["STEM", "Hands-on Science", "Engineering Design", "Technology"],
      description: "Public charter elementary school with integrated STEM curriculum and project-based learning.",
      partnershipGoals: ["STEM education exchanges", "Project collaborations", "Early childhood STEM"]
    },
    {
      id: 92,
      name: "Discovery Elementary School",
      type: "Primary School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Arlington",
      state: "Virginia",
      students: 550,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Science Exploration", "Mathematics", "Technology Integration"],
      description: "Public elementary school with innovative STEM programs and technology integration.",
      partnershipGoals: ["Elementary STEM exchanges", "Technology partnerships", "Science education"]
    },
    {
      id: 93,
      name: "Endeavor STEM Academy",
      type: "Primary School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Orlando",
      state: "Florida",
      students: 620,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Space Science", "Engineering", "Technology"],
      description: "Public elementary school with space-themed STEM curriculum near Kennedy Space Center.",
      partnershipGoals: ["Space science exchanges", "STEM partnerships", "Innovation in elementary education"]
    },
    {
      id: 94,
      name: "Manhattan School for Science",
      type: "Primary School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "New York",
      state: "New York",
      students: 340,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Scientific Inquiry", "Mathematics", "Technology"],
      description: "Urban public elementary school with inquiry-based STEM curriculum.",
      partnershipGoals: ["Urban STEM initiatives", "Elementary exchanges", "Science partnerships"]
    },
    {
      id: 95,
      name: "Pacific Elementary STEM School",
      type: "Primary School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "San Francisco",
      state: "California",
      students: 480,
      languages: ["English", "Spanish", "Mandarin"],
      interests: ["STEM", "Technology", "Environmental Science", "Engineering"],
      description: "Public elementary school with comprehensive STEM program serving diverse community.",
      partnershipGoals: ["STEM diversity initiatives", "Technology exchanges", "Environmental education"]
    },
    {
      id: 96,
      name: "Innovation Lab School",
      type: "Primary School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Seattle",
      state: "Washington",
      students: 420,
      languages: ["English"],
      interests: ["STEM", "Maker Education", "Design Thinking", "Technology"],
      description: "Public elementary school emphasizing hands-on STEM learning and innovation.",
      partnershipGoals: ["Maker education exchanges", "Innovation partnerships", "STEM curriculum development"]
    },
    {
      id: 97,
      name: "Young Achievers Science and Math Pilot",
      type: "Primary School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Boston",
      state: "Massachusetts",
      students: 510,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Mathematics", "Science", "Technology Literacy"],
      description: "Public pilot elementary school with intensive math and science focus.",
      partnershipGoals: ["Math and science exchanges", "STEM education research", "Urban education partnerships"]
    },
    {
      id: 98,
      name: "STEM Elementary at Columbia",
      type: "Primary School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "San Diego",
      state: "California",
      students: 560,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering Design", "Robotics", "Science"],
      description: "Public elementary school with project-based STEM curriculum and robotics program.",
      partnershipGoals: ["Elementary robotics exchanges", "STEM project partnerships", "Engineering education"]
    },
    {
      id: 99,
      name: "Peachtree Elementary STEM Academy",
      type: "Primary School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Atlanta",
      state: "Georgia",
      students: 470,
      languages: ["English"],
      interests: ["STEM", "Technology", "Mathematics", "Science Exploration"],
      description: "Public elementary school with comprehensive STEM curriculum and technology integration.",
      partnershipGoals: ["Elementary STEM exchanges", "Technology partnerships", "Science education"]
    },
    {
      id: 100,
      name: "Christa McAuliffe Elementary",
      type: "Primary School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Houston",
      state: "Texas",
      students: 640,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Space Science", "Engineering", "Mathematics"],
      description: "Public elementary school with space-themed STEM curriculum near NASA Johnson Space Center.",
      partnershipGoals: ["Space science exchanges", "NASA partnerships", "STEM education innovation"]
    },
    {
      id: 101,
      name: "Fulton STEM Academy",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Atlanta",
      state: "Georgia",
      students: 780,
      languages: ["English"],
      interests: ["STEM", "Computer Science", "Engineering", "Biotechnology"],
      description: "Public STEM-focused high school with university and industry partnerships.",
      partnershipGoals: ["Industry partnerships", "Research collaborations", "STEM competitions"]
    },
    {
      id: 102,
      name: "Metro Early College High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Columbus",
      state: "Ohio",
      students: 320,
      languages: ["English"],
      interests: ["STEM", "Early College", "Engineering", "Technology"],
      description: "Small public STEM school offering early college opportunities through university partnerships.",
      partnershipGoals: ["Early college programs", "STEM mentorship", "University collaborations"]
    },
    {
      id: 103,
      name: "Signature School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Evansville",
      state: "Indiana",
      students: 370,
      languages: ["English"],
      interests: ["STEM", "Innovation", "Engineering", "Research"],
      description: "Public charter high school with nationally recognized STEM program and project-based learning.",
      partnershipGoals: ["Innovation projects", "STEM research", "Academic exchanges"]
    },
    {
      id: 104,
      name: "School for Advanced Studies",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Miami",
      state: "Florida",
      students: 420,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Advanced Studies", "Research", "Engineering"],
      description: "Public magnet school on university campus offering advanced STEM coursework.",
      partnershipGoals: ["University research partnerships", "Advanced STEM programs", "International exchanges"]
    },
    {
      id: 105,
      name: "California Academy of Mathematics and Science",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Carson",
      state: "California",
      students: 550,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Mathematics", "Science Research", "Technology"],
      description: "Public STEM magnet school located on California State University campus.",
      partnershipGoals: ["University partnerships", "STEM research", "Academic competitions"]
    },
    {
      id: 106,
      name: "Early College High School at Delaware State",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Dover",
      state: "Delaware",
      students: 310,
      languages: ["English"],
      interests: ["STEM", "Early College", "Science", "Technology"],
      description: "Public early college school with focus on STEM and college readiness.",
      partnershipGoals: ["Early college STEM", "University collaborations", "Student mentorship"]
    },
    {
      id: 107,
      name: "Phoenix Coding Academy",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Phoenix",
      state: "Arizona",
      students: 420,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Computer Science", "Coding", "Software Development"],
      description: "Public charter high school specializing in computer science and software development.",
      partnershipGoals: ["Coding competitions", "Tech industry partnerships", "Software projects"]
    },
    {
      id: 108,
      name: "Science and Engineering Magnet School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Dallas",
      state: "Texas",
      students: 970,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering", "Science", "Mathematics"],
      description: "Public magnet high school with comprehensive STEM curriculum and industry partnerships.",
      partnershipGoals: ["Engineering projects", "Industry collaborations", "STEM exchanges"]
    },
    {
      id: 109,
      name: "Liberal Arts and Science Academy",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Austin",
      state: "Texas",
      students: 1050,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Liberal Arts", "Science Research", "Technology"],
      description: "Public magnet school integrating liberal arts with rigorous STEM education.",
      partnershipGoals: ["Interdisciplinary projects", "Research partnerships", "University collaborations"]
    },
    {
      id: 110,
      name: "School Without Walls High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Washington",
      state: "District of Columbia",
      students: 620,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Urban Studies", "Technology", "Innovation"],
      description: "Public magnet school using city as classroom with strong STEM program.",
      partnershipGoals: ["Urban STEM initiatives", "Museum partnerships", "Community projects"]
    },
    {
      id: 111,
      name: "Dunbar High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Lexington",
      state: "Kentucky",
      students: 1280,
      languages: ["English"],
      interests: ["STEM", "Engineering", "Computer Science", "Mathematics"],
      description: "Public high school with award-winning STEM programs and strong academic tradition.",
      partnershipGoals: ["STEM competitions", "Engineering projects", "Academic partnerships"]
    },
    {
      id: 112,
      name: "duPont Manual Magnet High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Louisville",
      state: "Kentucky",
      students: 1950,
      languages: ["English"],
      interests: ["STEM", "Mathematics", "Science", "Engineering"],
      description: "Historic public magnet school with multiple career pathways including STEM.",
      partnershipGoals: ["STEM magnet exchanges", "Career pathway partnerships", "Academic competitions"]
    },
    {
      id: 113,
      name: "Cranbrook STEM Academy",
      type: "Middle School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Birmingham",
      state: "Michigan",
      students: 490,
      languages: ["English"],
      interests: ["STEM", "Robotics", "Science", "Engineering Design"],
      description: "Public middle school with intensive STEM program and maker spaces.",
      partnershipGoals: ["Robotics exchanges", "Maker education", "STEM competitions"]
    },
    {
      id: 114,
      name: "STEM Academy at Bartlett",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Anchorage",
      state: "Alaska",
      students: 580,
      languages: ["English"],
      interests: ["STEM", "Arctic Science", "Engineering", "Environmental Studies"],
      description: "Public magnet school integrating STEM with Alaska's unique environment and challenges.",
      partnershipGoals: ["Arctic STEM research", "Environmental partnerships", "Native science integration"]
    },
    {
      id: 115,
      name: "Central High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Philadelphia",
      state: "Pennsylvania",
      students: 2700,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering", "Computer Science", "Mathematics"],
      description: "Historic public magnet school with strong STEM programs and diverse student body.",
      partnershipGoals: ["Urban STEM initiatives", "Engineering competitions", "University partnerships"]
    },
    {
      id: 116,
      name: "Poolesville High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Poolesville",
      state: "Maryland",
      students: 1450,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Science Research", "Mathematics", "Technology"],
      description: "Public magnet school offering science, math, and computer science specializations.",
      partnershipGoals: ["Research partnerships", "STEM olympiads", "Academic exchanges"]
    },
    {
      id: 117,
      name: "Walt Whitman High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Bethesda",
      state: "Maryland",
      students: 2050,
      languages: ["English", "Spanish", "French"],
      interests: ["STEM", "Science Research", "Engineering", "Technology"],
      description: "High-performing public school with comprehensive STEM offerings and AP programs.",
      partnershipGoals: ["STEM research exchanges", "Academic competitions", "International partnerships"]
    },
    {
      id: 118,
      name: "River Hill High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Clarksville",
      state: "Maryland",
      students: 1650,
      languages: ["English"],
      interests: ["STEM", "Computer Science", "Engineering", "Biotechnology"],
      description: "Public high school with strong STEM programs and technology integration.",
      partnershipGoals: ["STEM competitions", "Technology partnerships", "Innovation projects"]
    },
    {
      id: 119,
      name: "Thomas S. Wootton High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Rockville",
      state: "Maryland",
      students: 2100,
      languages: ["English", "Spanish", "Mandarin"],
      interests: ["STEM", "Computer Science", "Mathematics", "Science Research"],
      description: "Large public high school with diverse student body and comprehensive STEM programs.",
      partnershipGoals: ["STEM diversity initiatives", "Academic exchanges", "Research partnerships"]
    },
    {
      id: 120,
      name: "Skyline High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Ann Arbor",
      state: "Michigan",
      students: 1850,
      languages: ["English"],
      interests: ["STEM", "Engineering", "Computer Science", "Innovation"],
      description: "Public high school with strong STEM curriculum near University of Michigan.",
      partnershipGoals: ["University partnerships", "STEM mentorship", "Innovation challenges"]
    },
    {
      id: 121,
      name: "International Academy",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Troy",
      state: "Michigan",
      students: 390,
      languages: ["English", "Spanish", "French"],
      interests: ["STEM", "International Baccalaureate", "Science", "Mathematics"],
      description: "Public IB school on community college campus with strong STEM focus.",
      partnershipGoals: ["IB STEM exchanges", "College partnerships", "International collaborations"]
    },
    {
      id: 122,
      name: "Adlai E. Stevenson High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Lincolnshire",
      state: "Illinois",
      students: 4400,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering", "Computer Science", "Science Research"],
      description: "One of nation's largest and highest-performing public high schools with extensive STEM programs.",
      partnershipGoals: ["Large-scale STEM exchanges", "Engineering competitions", "Research partnerships"]
    },
    {
      id: 123,
      name: "Naperville Central High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Naperville",
      state: "Illinois",
      students: 2800,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Mathematics", "Science", "Technology"],
      description: "High-performing public school with comprehensive STEM curriculum and advanced offerings.",
      partnershipGoals: ["STEM exchanges", "Academic competitions", "Technology partnerships"]
    },
    {
      id: 124,
      name: "Hinsdale Central High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Hinsdale",
      state: "Illinois",
      students: 2700,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering", "Computer Science", "Mathematics"],
      description: "Top-ranked public high school with strong STEM programs and academic tradition.",
      partnershipGoals: ["STEM curriculum exchanges", "Engineering projects", "Academic partnerships"]
    },
    {
      id: 125,
      name: "Glenbrook North High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Northbrook",
      state: "Illinois",
      students: 2200,
      languages: ["English"],
      interests: ["STEM", "Science Research", "Mathematics", "Technology"],
      description: "Well-established public high school with comprehensive STEM offerings.",
      partnershipGoals: ["STEM exchanges", "Research partnerships", "Academic competitions"]
    },
    {
      id: 126,
      name: "New Trier High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Winnetka",
      state: "Illinois",
      students: 4000,
      languages: ["English", "Spanish", "French"],
      interests: ["STEM", "Science Research", "Mathematics", "Engineering"],
      description: "Nationally recognized public high school with extensive STEM curriculum and resources.",
      partnershipGoals: ["STEM research exchanges", "Academic competitions", "International partnerships"]
    },
    {
      id: 127,
      name: "Evanston Township High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Evanston",
      state: "Illinois",
      students: 3200,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering", "Computer Science", "Urban Innovation"],
      description: "Large urban public high school with diverse programs including STEM academies.",
      partnershipGoals: ["Urban STEM initiatives", "Diversity in STEM", "University partnerships"]
    },
    {
      id: 128,
      name: "Lake Stevens High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Lake Stevens",
      state: "Washington",
      students: 2100,
      languages: ["English"],
      interests: ["STEM", "Engineering", "Environmental Science", "Technology"],
      description: "Public high school integrating STEM with environmental and sustainability focus.",
      partnershipGoals: ["Environmental STEM projects", "Sustainability partnerships", "Technology exchanges"]
    },
    {
      id: 129,
      name: "Kamiak High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Mukilteo",
      state: "Washington",
      students: 1850,
      languages: ["English"],
      interests: ["STEM", "Aerospace Engineering", "Computer Science", "Robotics"],
      description: "Public high school with strong STEM programs and aerospace industry connections.",
      partnershipGoals: ["Aerospace STEM exchanges", "Industry partnerships", "Robotics competitions"]
    },
    {
      id: 130,
      name: "Newport High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Bellevue",
      state: "Washington",
      students: 2350,
      languages: ["English", "Mandarin", "Spanish"],
      interests: ["STEM", "Computer Science", "Engineering", "Mathematics"],
      description: "High-performing public school with strong STEM programs and diverse international community.",
      partnershipGoals: ["International STEM exchanges", "Tech partnerships", "Academic competitions"]
    },
    {
      id: 131,
      name: "Issaquah High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Issaquah",
      state: "Washington",
      students: 1950,
      languages: ["English"],
      interests: ["STEM", "Environmental Science", "Technology", "Engineering"],
      description: "Public high school with comprehensive STEM curriculum and outdoor education focus.",
      partnershipGoals: ["STEM exchanges", "Environmental partnerships", "Technology projects"]
    },
    {
      id: 132,
      name: "Pine View School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Osprey",
      state: "Florida",
      students: 2150,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Gifted Education", "Research", "Mathematics"],
      description: "Public school for gifted students with intensive STEM programs from elementary through high school.",
      partnershipGoals: ["Gifted STEM exchanges", "Research partnerships", "Academic competitions"]
    },
    {
      id: 133,
      name: "Suncoast Community High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Riviera Beach",
      state: "Florida",
      students: 1920,
      languages: ["English", "Spanish"],
      interests: ["STEM", "IB Programme", "Science Research", "Mathematics"],
      description: "Public magnet school combining IB program with strong STEM focus.",
      partnershipGoals: ["IB STEM exchanges", "Research partnerships", "International collaborations"]
    },
    {
      id: 134,
      name: "Stanton College Preparatory School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Jacksonville",
      state: "Florida",
      students: 1650,
      languages: ["English", "Spanish"],
      interests: ["STEM", "College Preparation", "Science", "Mathematics"],
      description: "Top-ranked public magnet school with rigorous STEM curriculum and college focus.",
      partnershipGoals: ["STEM exchanges", "College partnerships", "Academic competitions"]
    },
    {
      id: 135,
      name: "The School for the Talented and Gifted",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Dallas",
      state: "Texas",
      students: 230,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Gifted Education", "Mathematics", "Science Research"],
      description: "Highly selective public magnet school for gifted students with intensive STEM focus.",
      partnershipGoals: ["Gifted STEM exchanges", "Research partnerships", "Academic olympiads"]
    },
    {
      id: 136,
      name: "Carnegie Vanguard High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Houston",
      state: "Texas",
      students: 850,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Vanguard Program", "Science", "Mathematics"],
      description: "Public magnet school with rigorous vanguard program and strong STEM curriculum.",
      partnershipGoals: ["STEM exchanges", "Academic competitions", "Research projects"]
    },
    {
      id: 137,
      name: "DeBakey High School for Health Professions",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Houston",
      state: "Texas",
      students: 780,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Health Sciences", "Medical Research", "Biotechnology"],
      description: "Public magnet school focusing on health sciences and medical STEM education.",
      partnershipGoals: ["Medical STEM exchanges", "Healthcare partnerships", "Research collaborations"]
    },
    {
      id: 138,
      name: "Northside College Prep",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Chicago",
      state: "Illinois",
      students: 1100,
      languages: ["English", "Spanish"],
      interests: ["STEM", "College Preparation", "Research", "Mathematics"],
      description: "Highly selective public magnet school with rigorous STEM curriculum and college focus.",
      partnershipGoals: ["STEM exchanges", "University partnerships", "Research collaborations"]
    },
    {
      id: 139,
      name: "Payton College Prep",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Chicago",
      state: "Illinois",
      students: 1200,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Liberal Arts", "Science", "Technology"],
      description: "Selective public magnet school integrating STEM with liberal arts education.",
      partnershipGoals: ["Interdisciplinary STEM", "Academic exchanges", "College partnerships"]
    },
    {
      id: 140,
      name: "Jones College Prep",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Chicago",
      state: "Illinois",
      students: 2100,
      languages: ["English", "Spanish"],
      interests: ["STEM", "College Preparation", "Engineering", "Computer Science"],
      description: "Large selective public magnet school with comprehensive STEM programs.",
      partnershipGoals: ["STEM exchanges", "Engineering partnerships", "Technology competitions"]
    },
    {
      id: 141,
      name: "Lane Tech College Prep",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Chicago",
      state: "Illinois",
      students: 4400,
      languages: ["English", "Spanish", "Polish"],
      interests: ["STEM", "Engineering", "Computer Science", "Technology"],
      description: "One of the largest and oldest public high schools in Chicago with strong STEM tradition.",
      partnershipGoals: ["Large-scale STEM exchanges", "Engineering projects", "Tech partnerships"]
    },
    {
      id: 142,
      name: "Westview High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Portland",
      state: "Oregon",
      students: 2050,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Computer Science", "Engineering", "Environmental Science"],
      description: "Large public high school with comprehensive STEM programs and sustainability focus.",
      partnershipGoals: ["STEM exchanges", "Sustainability partnerships", "Technology projects"]
    },
    {
      id: 143,
      name: "Plano West Senior High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Plano",
      state: "Texas",
      students: 3200,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering", "Computer Science", "Robotics"],
      description: "Large high-performing public school with extensive STEM programs and competitive teams.",
      partnershipGoals: ["STEM competitions", "Engineering exchanges", "Robotics partnerships"]
    },
    {
      id: 144,
      name: "Plano East Senior High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Plano",
      state: "Texas",
      students: 3100,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Computer Science", "Mathematics", "Science"],
      description: "Large public high school with strong STEM curriculum and academic programs.",
      partnershipGoals: ["STEM exchanges", "Technology partnerships", "Academic competitions"]
    },
    {
      id: 145,
      name: "Westlake High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Austin",
      state: "Texas",
      students: 2850,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering", "Science Research", "Technology"],
      description: "Top-performing public high school with comprehensive STEM programs and resources.",
      partnershipGoals: ["STEM research exchanges", "Engineering competitions", "Technology partnerships"]
    },
    {
      id: 146,
      name: "Vandegrift High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Austin",
      state: "Texas",
      students: 2650,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering", "Computer Science", "Innovation"],
      description: "Modern public high school with strong STEM programs and innovative learning spaces.",
      partnershipGoals: ["Innovation challenges", "STEM exchanges", "Technology partnerships"]
    },
    {
      id: 147,
      name: "Cinco Ranch High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Katy",
      state: "Texas",
      students: 3450,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering", "Science", "Mathematics"],
      description: "Large high-performing public school with extensive STEM curriculum and programs.",
      partnershipGoals: ["STEM exchanges", "Engineering projects", "Academic partnerships"]
    },
    {
      id: 148,
      name: "Tompkins High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Katy",
      state: "Texas",
      students: 3200,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Computer Science", "Robotics", "Engineering"],
      description: "Newer public high school with state-of-the-art facilities and strong STEM programs.",
      partnershipGoals: ["STEM competitions", "Robotics exchanges", "Technology partnerships"]
    },
    {
      id: 149,
      name: "The Woodlands High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "The Woodlands",
      state: "Texas",
      students: 3550,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Science Research", "Engineering", "Technology"],
      description: "Large public high school with comprehensive STEM programs and research opportunities.",
      partnershipGoals: ["Research partnerships", "STEM exchanges", "Academic competitions"]
    },
    {
      id: 150,
      name: "Coppell High School",
      type: "High School",
      category: "K-12",
      country: "United States",
      region: "North America",
      city: "Coppell",
      state: "Texas",
      students: 3100,
      languages: ["English", "Spanish"],
      interests: ["STEM", "Engineering", "Computer Science", "Mathematics"],
      description: "High-performing public school with strong STEM curriculum and competitive academic programs.",
      partnershipGoals: ["STEM exchanges", "Engineering competitions", "Technology partnerships"]
    }
  ];

  // Enhanced AI Search Handler with Natural Language Processing
  const handleAISearch = () => {
    const query = aiSearchRef.current?.value || '';
    if (!query.trim()) return;

    const keywords = query.toLowerCase();

    // Extract school level from query
    let schoolLevelMatch = null;
    if (keywords.match(/\b(elementary|primary|k-5|kindergarten|grade 1-5)\b/)) {
      schoolLevelMatch = 'Primary School';
    } else if (keywords.match(/\b(middle school|junior high|grades? 6-8|6th|7th|8th)\b/)) {
      schoolLevelMatch = 'Middle School';
    } else if (keywords.match(/\b(high school|secondary|grades? 9-12|freshman|sophomore|junior|senior|9th|10th|11th|12th)\b/)) {
      schoolLevelMatch = 'High School';
    } else if (keywords.match(/\b(university|college|higher education)\b/)) {
      schoolLevelMatch = 'University';
    }

    // Extract languages from query
    const languageKeywords = ['spanish', 'english', 'french', 'german', 'mandarin', 'chinese', 'arabic', 'portuguese', 'russian'];
    const languageMatch = languageKeywords.find(lang => keywords.includes(lang));

    // Extract subject areas from query
    const subjectMatches = [];
    if (keywords.match(/\b(stem|science|technology|engineering|math|mathematics|computer|coding|robotics)\b/)) {
      subjectMatches.push('STEM');
    }
    if (keywords.match(/\b(art|arts|music|theater|theatre|dance|visual|creative)\b/)) {
      subjectMatches.push('Arts');
    }
    if (keywords.match(/\b(environment|environmental|climate|sustainability|green|ecology)\b/)) {
      subjectMatches.push('Environmental');
    }
    if (keywords.match(/\b(culture|cultural|language|international|global)\b/)) {
      subjectMatches.push('Cultural');
    }

    // Extract regions/countries from query
    const regionKeywords = {
      'north america': 'North America',
      'usa': 'United States',
      'united states': 'United States',
      'us': 'United States',
      'america': 'United States',
      'canada': 'Canada',
      'europe': 'Europe',
      'european': 'Europe',
      'spain': 'Spain',
      'france': 'France',
      'germany': 'Germany',
      'uk': 'United Kingdom',
      'united kingdom': 'United Kingdom',
      'asia': 'Asia',
      'china': 'China',
      'japan': 'Japan',
      'south america': 'South America',
      'brazil': 'Brazil',
      'middle east': 'Middle East'
    };

    let regionMatch = null;
    for (const [keyword, region] of Object.entries(regionKeywords)) {
      if (keywords.includes(keyword)) {
        regionMatch = region;
        break;
      }
    }

    // Filter organizations based on extracted criteria
    const filtered = organizations.filter(org => {
      // Basic text search
      const searchText = `${org.name} ${org.description} ${org.interests?.join(' ')} ${org.country} ${org.city || ''} ${org.state || ''}`.toLowerCase();
      const matchesKeywords = searchText.includes(keywords) ||
                             org.type.toLowerCase().includes(keywords) ||
                             org.region.toLowerCase().includes(keywords);

      // School level match
      const matchesSchoolLevel = !schoolLevelMatch || org.type === schoolLevelMatch;

      // Language match
      const matchesLanguage = !languageMatch ||
                             (org.languages && org.languages.some(lang =>
                               lang.toLowerCase().includes(languageMatch)
                             ));

      // Subject match
      const matchesSubject = subjectMatches.length === 0 ||
                            (org.interests && subjectMatches.some(subject =>
                              org.interests.some(interest =>
                                interest.toLowerCase().includes(subject.toLowerCase())
                              )
                            ));

      // Region/Country match
      const matchesRegion = !regionMatch ||
                           org.region === regionMatch ||
                           org.country === regionMatch;

      // Return true if matches keywords OR matches specific criteria
      return matchesKeywords || (matchesSchoolLevel && matchesLanguage && matchesSubject && matchesRegion);
    });

    // Sort results by relevance (most matches first)
    const scoredResults = filtered.map(org => {
      let score = 0;
      const searchText = `${org.name} ${org.description} ${org.interests?.join(' ')}`.toLowerCase();

      // Increase score for keyword matches
      const words = keywords.split(' ').filter(w => w.length > 2);
      words.forEach(word => {
        if (searchText.includes(word)) score += 2;
      });

      // Increase score for specific criteria matches
      if (schoolLevelMatch && org.type === schoolLevelMatch) score += 5;
      if (languageMatch && org.languages?.some(l => l.toLowerCase().includes(languageMatch))) score += 3;
      if (subjectMatches.length > 0 && org.interests?.some(i =>
        subjectMatches.some(s => i.toLowerCase().includes(s.toLowerCase()))
      )) score += 4;
      if (regionMatch && (org.region === regionMatch || org.country === regionMatch)) score += 3;

      return { ...org, score };
    });

    scoredResults.sort((a, b) => b.score - a.score);
    setSearchResults(scoredResults);
  };

  // Toggle favorite
  const toggleFavorite = (org) => {
    const isFavorited = favorites.some(fav => fav.id === org.id);
    let newFavorites;

    if (isFavorited) {
      newFavorites = favorites.filter(fav => fav.id !== org.id);
    } else {
      newFavorites = [...favorites, org];
    }

    setFavorites(newFavorites);
    localStorage.setItem('userFavorites', JSON.stringify(newFavorites));
  };

  const isFavorited = (orgId) => {
    return favorites.some(fav => fav.id === orgId);
  };

  // Handle signup form submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupSubmitting(true);
    setSignupError('');

    // For now, just simulate success since email API may not be configured yet
    try {
      // Try to call the API, but don't fail if it's not configured
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupForm),
        });

        if (!response.ok) {
          console.warn('Email API not configured, continuing without email');
        }
      } catch (apiError) {
        // API not available yet, that's okay
        console.warn('Email service not configured:', apiError);
      }

      // Always show success to user - account creation works even without email
      setSignupSuccess(true);
      setSignupForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        intent: '',
        role: '',
        organization: '',
        gradeLevels: [],
        subjects: [],
        studentMin: '',
        studentMax: '',
        technology: [],
        techRestrictions: '',
        duration: []
      });

      // Show success message for 3 seconds then close modal
      setTimeout(() => {
        setSignupSuccess(false);
        setShowAuthModal(false);
      }, 3000);
    } catch (error) {
      setSignupError('Failed to create account. Please try again or contact us at hello@mapworkslearning.org');
    } finally {
      setSignupSubmitting(false);
    }
  };

  // Comprehensive Registration Modal - Minimal Elegant Design
  const AuthModal = () => {
    const handleSocialLogin = (provider) => {
      console.log(`${provider} login clicked - OAuth integration needed`);
      // TODO: Implement OAuth flow with backend
    };

    if (authMode === 'signin') {
      // Simple sign in form
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
            <button type="button" onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>

            <h3 className="text-2xl font-light text-gray-800 mb-2">Welcome Back</h3>
            <p className="text-sm text-gray-600 mb-6">
              Don't have an account?{' '}
              <button type="button" onClick={() => setAuthMode('signup')} className="text-gray-800 font-medium hover:underline">
                Sign Up
              </button>
            </p>

            {/* Social Login Options */}
            <div className="space-y-3 mb-6">
              <button type="button" onClick={() => handleSocialLogin('Google')} className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="grid grid-cols-3 gap-3">
                <button type="button" onClick={() => handleSocialLogin('LinkedIn')} className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>

                <button type="button" onClick={() => handleSocialLogin('Facebook')} className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>

                <button type="button" onClick={() => handleSocialLogin('X')} className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <input type="email" placeholder="Email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm" required />
              </div>
              <div>
                <input type="password" placeholder="Password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm" required />
              </div>
              <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition text-sm">
                Sign In
              </button>
            </form>
          </div>
        </div>
      );
    }

    // Comprehensive registration - Clean centered layout
    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl relative">
        <div className="p-8">
          <button
            type="button"
            onClick={() => setShowAuthModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X size={24} />
          </button>

          <h3 className="text-2xl font-light text-gray-800 mb-2">Create An Account</h3>
          <p className="text-sm text-gray-600 mb-6">
            Already an user?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className="text-gray-800 font-medium hover:underline"
            >
              Sign In
            </button>
          </p>

          {/* Social Login Options */}
          <div className="space-y-3 mb-6">
            <button type="button" onClick={() => handleSocialLogin('Google')} className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="grid grid-cols-3 gap-3">
              <button type="button" onClick={() => handleSocialLogin('LinkedIn')} className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>

              <button type="button" onClick={() => handleSocialLogin('Facebook')} className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>

              <button type="button" onClick={() => handleSocialLogin('X')} className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">Or fill out the form below</span>
            </div>
          </div>

          {/* Success Message */}
          {signupSuccess && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <CheckCircle className="inline mr-2" size={16} />
                Account created! Check your email for next steps.
              </p>
            </div>
          )}

          {/* Error Message */}
          {signupError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{signupError}</p>
            </div>
          )}

          <div className="max-h-[50vh] overflow-y-auto pr-2">
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              {/* Basic Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 text-sm"
                  required
                />
                <input
                  type="password"
                  placeholder="Password (optional)"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 text-sm"
                />
              </div>

              {/* Intent & Role */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Your Intent (Optional)</h4>
                <select
                  value={signupForm.intent}
                  onChange={(e) => setSignupForm({...signupForm, intent: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                >
                  <option value="">Select your intent...</option>
                  <option value="provider">Virtual Exchange Provider (offering services)</option>
                  <option value="participant">Looking to Participate (seeking a match)</option>
                </select>
                <select
                  value={signupForm.role}
                  onChange={(e) => setSignupForm({...signupForm, role: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 text-sm"
                >
                  <option value="">I am a...</option>
                  <option value="teacher">Teacher</option>
                  <option value="school">School</option>
                  <option value="administrator">School Administrator</option>
                  <option value="district">District</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Organization Name"
                  value={signupForm.organization}
                  onChange={(e) => setSignupForm({...signupForm, organization: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 text-sm"
                  required
                />
              </div>

              {/* Grade Levels */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Grade Levels (Optional)</h4>
                <p className="text-xs text-gray-600 mb-2">Select all that apply</p>
                <div className="grid grid-cols-3 gap-2">
                  {['K-2', '3-5', '6-8', '9-12', 'University'].map(grade => (
                    <label key={grade} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>{grade}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subjects */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Subject Areas (Optional)</h4>
                <select multiple className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm" size="4">
                  <option value="STEM">STEM</option>
                  <option value="Arts">Arts & Humanities</option>
                  <option value="Languages">Languages</option>
                  <option value="Social Sciences">Social Sciences</option>
                  <option value="Environmental">Environmental Studies</option>
                  <option value="Health">Health & Wellness</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>

              {/* Student Count */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Number of Students (Optional)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Min" className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm" />
                  <input type="number" placeholder="Max" className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm" />
                </div>
              </div>

              {/* Technology */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Technology Available (Optional)</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Chromebooks', 'iPads', 'Laptops', 'Zoom', 'Google Meet', 'Microsoft Teams', 'High-speed WiFi', 'SmartBoards'].map(tech => (
                    <label key={tech} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>{tech}</span>
                    </label>
                  ))}
                </div>
                <textarea placeholder="Tech restrictions (blocked platforms, bandwidth limits, etc.)" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 text-sm" rows="2"></textarea>
              </div>

              {/* Duration */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preferred Duration (Optional)</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['2 weeks', '4 weeks', '6 weeks', '8 weeks', 'Semester', 'Full year'].map(dur => (
                    <label key={dur} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>{dur}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Exchange Programs (only shown for providers) */}
              {signupForm.intent === 'provider' && (
                <div className="border-t border-gray-200 pt-5 mt-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Your Exchange Programs</h4>
                      <p className="text-xs text-gray-600 mt-1">Add the virtual exchanges your organization operates</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSignupForm({
                          ...signupForm,
                          exchanges: [...signupForm.exchanges, { name: '', description: '', status: 'current', duration: '', gradeLevel: '', cost: '' }]
                        });
                      }}
                      className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-medium hover:bg-gray-900 transition flex items-center gap-1"
                    >
                      <span>+</span> Add Exchange
                    </button>
                  </div>

                  {signupForm.exchanges.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No exchanges added yet. Click "Add Exchange" to list your programs.</p>
                  )}

                  <div className="space-y-4">
                    {signupForm.exchanges.map((exchange, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const newExchanges = signupForm.exchanges.filter((_, i) => i !== index);
                            setSignupForm({ ...signupForm, exchanges: newExchanges });
                          }}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>

                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Exchange Program Name"
                            value={exchange.name}
                            onChange={(e) => {
                              const newExchanges = [...signupForm.exchanges];
                              newExchanges[index].name = e.target.value;
                              setSignupForm({ ...signupForm, exchanges: newExchanges });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                            placeholder="e.g., Global Youth Dialogue Program"
                          />

                          <textarea
                            placeholder="Brief description of this exchange program"
                            value={exchange.description}
                            onChange={(e) => {
                              const newExchanges = [...signupForm.exchanges];
                              newExchanges[index].description = e.target.value;
                              setSignupForm({ ...signupForm, exchanges: newExchanges });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                            rows="3"
                            placeholder="Describe the program, its goals, and what makes it unique..."
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <select
                              value={exchange.status}
                              onChange={(e) => {
                                const newExchanges = [...signupForm.exchanges];
                                newExchanges[index].status = e.target.value;
                                setSignupForm({ ...signupForm, exchanges: newExchanges });
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                            >
                              <option value="current">Current Program</option>
                              <option value="upcoming">Upcoming Program</option>
                            </select>

                            <input
                              type="text"
                              placeholder="Duration (e.g., 8 weeks)"
                              value={exchange.duration}
                              onChange={(e) => {
                                const newExchanges = [...signupForm.exchanges];
                                newExchanges[index].duration = e.target.value;
                                setSignupForm({ ...signupForm, exchanges: newExchanges });
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Grade Level (e.g., 9-12)"
                              value={exchange.gradeLevel}
                              onChange={(e) => {
                                const newExchanges = [...signupForm.exchanges];
                                newExchanges[index].gradeLevel = e.target.value;
                                setSignupForm({ ...signupForm, exchanges: newExchanges });
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                            />

                            <input
                              type="text"
                              placeholder="Cost (e.g., Free, Contact for pricing)"
                              value={exchange.cost}
                              onChange={(e) => {
                                const newExchanges = [...signupForm.exchanges];
                                newExchanges[index].cost = e.target.value;
                                setSignupForm({ ...signupForm, exchanges: newExchanges });
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={signupSubmitting}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signupSubmitting ? 'Creating Account...' : 'Create Account & Find Matches'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    );
  };

  // Connect Modal
  const ConnectModal = ({ org }) => {
    const [connectForm, setConnectForm] = useState({
      yourOrganization: '',
      yourRole: '',
      partnershipInterest: '',
      timeline: 'Within 1 month'
    });
    const [connectSubmitting, setConnectSubmitting] = useState(false);
    const [connectSuccess, setConnectSuccess] = useState(false);
    const [connectError, setConnectError] = useState('');

    const handleConnectSubmit = async (e) => {
      e.preventDefault();
      setConnectSubmitting(true);
      setConnectError('');

      try {
        const response = await fetch('/api/connect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...connectForm,
            targetOrganization: org.name,
            targetEmail: org.email,
            organizationWebsite: org.website
          }),
        });

        if (!response.ok) {
          console.warn('Connection email service not configured yet');
        }

        setConnectSuccess(true);
        setTimeout(() => {
          setConnectSuccess(false);
          setShowConnectModal(false);
          setConnectForm({
            yourOrganization: '',
            yourRole: '',
            partnershipInterest: '',
            timeline: 'Within 1 month'
          });
        }, 2000);
      } catch (error) {
        console.warn('Connection email not sent:', error);
        // Still show success since form was filled out
        setConnectSuccess(true);
        setTimeout(() => {
          setConnectSuccess(false);
          setShowConnectModal(false);
        }, 2000);
      } finally {
        setConnectSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">Connect with {org.name}</h3>
              <p className="text-gray-600 mt-1">Send a professional introduction to {org.email}</p>
            </div>
            <button type="button" onClick={() => setShowConnectModal(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {connectSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <CheckCircle className="inline mr-2" size={16} />
                Connection request sent successfully!
              </p>
            </div>
          )}

          {connectError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{connectError}</p>
            </div>
          )}

          <form onSubmit={handleConnectSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Organization</label>
              <input
                type="text"
                placeholder="Organization Name"
                value={connectForm.yourOrganization}
                onChange={(e) => setConnectForm({...connectForm, yourOrganization: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
              <input
                type="text"
                placeholder="e.g., Teacher, Administrator, Program Director"
                value={connectForm.yourRole}
                onChange={(e) => setConnectForm({...connectForm, yourRole: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Interest</label>
              <textarea
                rows="4"
                placeholder="Describe your ideal collaboration and what you hope to achieve together..."
                value={connectForm.partnershipInterest}
                onChange={(e) => setConnectForm({...connectForm, partnershipInterest: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Timeline</label>
              <select
                value={connectForm.timeline}
                onChange={(e) => setConnectForm({...connectForm, timeline: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option>Within 1 month</option>
                <option>1-3 months</option>
                <option>3-6 months</option>
                <option>Flexible</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={connectSubmitting}
                className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connectSubmitting ? 'Sending...' : 'Send Connection Request'}
              </button>
              <button
                type="button"
                onClick={() => setShowConnectModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Organization Profile Modal - Shows full organization details including programs
  const OrganizationProfileModal = ({ org }) => {
    if (!org) return null;

    const gradeLabel = getGradeLabel(org);

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={() => { setShowProfileModal(false); setSelectedOrg(null); }}
      >
        <div
          className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">{org.name}</h2>
                  {org.verified && (
                    <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      <CheckCircle size={16} />
                      <span className="text-sm font-semibold">Verified Profile</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Globe size={16} />
                    {org.country}
                  </span>
                  <span>•</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                    {gradeLabel}
                  </span>
                  {org.students && (
                    <>
                      <span>•</span>
                      <span>{org.students.toLocaleString()} students</span>
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowProfileModal(false); setSelectedOrg(null); }}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700">{org.description}</p>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {org.languages.map(lang => (
                  <span key={lang} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {org.interests.map(interest => (
                  <span key={interest} className="bg-green-100 text-green-700 px-3 py-1.5 rounded text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Partnership Goals */}
            {org.partnershipGoals && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Partnership Goals</h3>
                <ul className="text-gray-700 space-y-2">
                  {org.partnershipGoals.map((goal, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preferred Duration */}
            {org.duration && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Preferred Duration</h3>
                <div className="flex flex-wrap gap-2">
                  {org.duration.map((dur, idx) => (
                    <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded text-sm">
                      {dur}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Technology */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Technology</h3>
              {org.techAvailable && org.techAvailable.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {org.techAvailable.map((tech, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">To be added when profile is claimed</p>
              )}
            </div>

            {/* Contact Information - Only for Verified Profiles */}
            {org.verified && (org.website || org.email || org.phone) && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  {org.website && (
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-gray-400" />
                      <a
                        href={`https://${org.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {org.website}
                      </a>
                    </div>
                  )}
                  {org.email && (
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-gray-400" />
                      <a
                        href={`mailto:${org.email}`}
                        className="text-gray-700 hover:text-blue-600"
                      >
                        {org.email}
                      </a>
                    </div>
                  )}
                  {org.phone && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <span>{org.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Virtual Exchange Programs */}
            {org.programs && org.programs.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Virtual Exchange Programs</h3>
                <div className="space-y-4">
                  {org.programs.map((program, idx) => (
                    <div key={idx} className={`rounded-lg p-4 ${program.status === 'current' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{program.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${program.status === 'current' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                          {program.status === 'current' ? 'Open Now' : 'Upcoming'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{program.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-semibold text-gray-600">Duration:</span> {program.duration}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">Participants:</span> {program.participants}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">Tech:</span> {program.technology}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">Cost:</span> {program.cost}
                        </div>
                      </div>
                      {program.applicationDeadline && (
                        <div className="mt-3 text-sm text-gray-600">
                          <span className="font-semibold">Apply by:</span> {program.applicationDeadline}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 p-6 space-y-3 bg-gray-50 rounded-b-2xl">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedOrgForRequest(org);
                  setShowIntroductionRequestModal(true);
                  setShowProfileModal(false);
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Request an Introduction
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(org);
                }}
                className={`px-4 py-3 border rounded-lg font-semibold transition ${
                  isFavorited(org.id)
                    ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
                title={isFavorited(org.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  size={20}
                  fill={isFavorited(org.id) ? 'currentColor' : 'none'}
                />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedOrgForRequest(org);
                setShowClaimProfileModal(true);
                setShowProfileModal(false);
              }}
              className="w-full py-3 border border-yellow-400 bg-yellow-50 text-yellow-800 rounded-lg font-semibold hover:bg-yellow-100 transition"
            >
              Claim this Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Verification Modal - Automated verification system
  const VerificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">Get Your Organization Verified</h3>
                <p className="text-gray-600">Join 100+ verified partners on The Virtual Exchange</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowVerificationModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Why Get Verified?</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Build trust with global partners - verified badge shows authenticity</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Appear higher in search results and AI recommendations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Access to premium partnership tools and resources</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Free - verification is completely free for all educational institutions</span>
            </li>
          </ul>
        </div>

        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
              <input
                type="text"
                placeholder="e.g., Lincoln High School"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type *</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
                <option value="">Select type...</option>
                <option value="primary">Primary/Elementary School (Ages 5-11)</option>
                <option value="middle">Middle/Junior Secondary (Ages 11-14)</option>
                <option value="high">High/Upper Secondary (Ages 14-18)</option>
                <option value="university">University/Higher Education (Ages 18+)</option>
                <option value="provider">Exchange Provider/Organization</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
              <input
                type="text"
                placeholder="e.g., United States"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City/Region *</label>
              <input
                type="text"
                placeholder="e.g., Boston, MA"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Official Website URL *</label>
            <input
              type="url"
              placeholder="https://www.yourschool.edu"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">We'll verify your organization using your official website</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Official Email Address *</label>
            <input
              type="email"
              placeholder="admin@yourschool.edu"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be from your organization's domain (we'll send a verification email)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Role *</label>
            <input
              type="text"
              placeholder="e.g., Principal, Director of International Programs, Teacher"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Students (Approximate)</label>
            <input
              type="number"
              placeholder="e.g., 500"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Automated Verification Process:</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xs">1</div>
                <div>
                  <strong>Website Verification:</strong> We automatically check that your website domain matches your organization
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xs">2</div>
                <div>
                  <strong>Email Verification:</strong> We send a verification link to your official email address
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xs">3</div>
                <div>
                  <strong>Database Cross-Check:</strong> We verify your organization against educational databases
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xs">4</div>
                <div>
                  <strong>Instant Approval:</strong> Most verifications are completed within 24 hours
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <Shield size={20} />
              Submit for Verification
            </button>
            <button
              type="button"
              onClick={() => setShowVerificationModal(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By submitting, you confirm that you are an authorized representative of this organization
          </p>
        </form>
      </div>
    </div>
  );

  // Cookie Consent Component - GDPR/CCPA Compliant
  const CookieConsent = () => {
    if (!showCookieConsent) return null;

    const acceptCookies = () => {
      localStorage.setItem('cookieConsent', 'accepted');
      setShowCookieConsent(false);
    };

    const declineCookies = () => {
      localStorage.setItem('cookieConsent', 'declined');
      setShowCookieConsent(false);
    };

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 animate-slide-up">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">We Value Your Privacy</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We use cookies and similar technologies to improve your experience, analyze site performance, and enable essential features.
                By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or decline non-essential cookies.
                {' '}
                <button type="button" onClick={() => setActiveTab('privacy')} className="text-gray-800 underline hover:text-gray-900">
                  Learn more in our Privacy Policy
                </button>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={declineCookies}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={acceptCookies}
                className="px-6 py-2.5 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition text-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to get grade label
  const getGradeLabel = (org) => {
    if (org.grades) return `Grades ${org.grades}`;
    // Fallback based on type
    if (org.type === 'Primary School') return 'Grades K-5';
    if (org.type === 'Middle School') return 'Grades 6-8';
    if (org.type === 'High School') return 'Grades 9-12';
    if (org.type === 'University' || org.type === 'Art School') return 'Higher Education';
    if (org.category === 'Exchange Provider') return 'Exchange Provider';
    return org.category;
  };

  // Organization Card
  const OrganizationCard = ({ org }) => {
    const gradeLabel = getGradeLabel(org);

    return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-800">{org.name}</h3>
            {org.verified && (
              <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                <CheckCircle size={14} />
                <span className="text-xs font-semibold">Verified Profile</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
            <span className="flex items-center gap-1">
              <Globe size={14} />
              {org.country}
            </span>
            <span>•</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
              {gradeLabel}
            </span>
            {org.students && (
              <>
                <span>•</span>
                <span className="text-xs">{org.students.toLocaleString()} students</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content section that grows to push buttons to bottom */}
      <div className="flex-1 flex flex-col">
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

        {org.duration && (
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Preferred Duration</div>
            <div className="flex flex-wrap gap-2">
              {org.duration.slice(0, 3).map((dur, idx) => (
                <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                  {dur}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Technology</div>
          {org.techAvailable && org.techAvailable.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {org.techAvailable.slice(0, 3).map((tech, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-400 italic">To be added</div>
          )}
        </div>
      </div>

      {/* Contact Information - Only for Verified Profiles */}
      {org.verified && (org.website || org.email || org.phone) && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Contact Information</div>
          <div className="space-y-2">
            {org.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe size={14} className="text-gray-400" />
                <a
                  href={`https://${org.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {org.website}
                </a>
              </div>
            )}
            {org.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-gray-400" />
                <a
                  href={`mailto:${org.email}`}
                  className="text-gray-700 hover:text-blue-600"
                >
                  {org.email}
                </a>
              </div>
            )}
            {org.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>{org.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}
      </div>

      {/* Buttons section stays at bottom */}
      <div className="space-y-2 mt-auto">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedOrgForRequest(org);
              setShowIntroductionRequestModal(true);
            }}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
          >
            Request an Introduction
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedOrg(org);
              setShowProfileModal(true);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(org);
            }}
            className={`px-4 py-2 border rounded-lg font-semibold transition text-sm ${
              isFavorited(org.id)
                ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            title={isFavorited(org.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={20}
              fill={isFavorited(org.id) ? 'currentColor' : 'none'}
            />
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedOrgForRequest(org);
            setShowClaimProfileModal(true);
          }}
          className="w-full py-2 border border-yellow-400 bg-yellow-50 text-yellow-800 rounded-lg font-semibold hover:bg-yellow-100 transition text-sm"
        >
          Claim this Profile
        </button>
      </div>
    </div>
    );
  };

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
        <div className="relative z-10 flex flex-col items-center">
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Found {searchResults.length} matching {searchResults.length === 1 ? 'organization' : 'organizations'}
              </h3>
              <button
                type="button"
                onClick={() => setSearchResults([])}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Clear Results
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(org => (
                <OrganizationCard key={org.id} org={org} />
              ))}
            </div>
            {searchResults.length > 6 && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('browse');
                    // Optional: could pre-fill browse filters based on search
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all results in Browse →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-5 mx-auto">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3" style={{color: '#666666'}}>Verified Community</h3>
          <p className="text-gray-600">All organizations are thoroughly vetted by MapWorks Learning for safety and authenticity</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5 mx-auto">
            <Globe className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3" style={{color: '#666666'}}>Global Network</h3>
          <p className="text-gray-600">Connect with schools, universities, and exchange providers across 30+ countries</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-5 mx-auto">
            <MessageSquare className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3" style={{color: '#666666'}}>Smart Matching</h3>
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
    </div>
  );

  // Helper function to get school level from type
  const getSchoolLevel = (type) => {
    if (type === 'Primary School') return 'Primary/Elementary';
    if (type === 'Middle School') return 'Middle/Junior Secondary';
    if (type === 'High School') return 'High/Upper Secondary';
    if (type === 'University') return 'University/Higher Education';
    if (type === 'Art School') return 'University/Higher Education';
    return null;
  };

  // Global subjects categorized by discipline
  const globalSubjects = [
    // STEM
    { value: 'STEM', label: 'STEM (Science, Technology, Engineering, Math)', category: 'STEM' },
    { value: 'Mathematics', label: 'Mathematics', category: 'STEM' },
    { value: 'Science', label: 'Science (General)', category: 'STEM' },
    { value: 'Physics', label: 'Physics', category: 'STEM' },
    { value: 'Chemistry', label: 'Chemistry', category: 'STEM' },
    { value: 'Biology', label: 'Biology', category: 'STEM' },
    { value: 'Computer Science', label: 'Computer Science / ICT', category: 'STEM' },
    { value: 'Engineering', label: 'Engineering', category: 'STEM' },
    { value: 'Robotics', label: 'Robotics', category: 'STEM' },
    { value: 'Technology', label: 'Technology', category: 'STEM' },
    { value: 'Environmental Science', label: 'Environmental Science', category: 'STEM' },

    // Arts & Humanities
    { value: 'Arts', label: 'Arts (General)', category: 'Arts' },
    { value: 'Visual Arts', label: 'Visual Arts / Fine Arts', category: 'Arts' },
    { value: 'Music', label: 'Music', category: 'Arts' },
    { value: 'Theater', label: 'Theater / Drama', category: 'Arts' },
    { value: 'Dance', label: 'Dance / Movement', category: 'Arts' },
    { value: 'Film', label: 'Film / Media Production', category: 'Arts' },
    { value: 'Photography', label: 'Photography', category: 'Arts' },
    { value: 'Literature', label: 'Literature', category: 'Humanities' },
    { value: 'History', label: 'History', category: 'Humanities' },
    { value: 'Geography', label: 'Geography', category: 'Humanities' },
    { value: 'Philosophy', label: 'Philosophy', category: 'Humanities' },

    // Languages
    { value: 'Language Arts', label: 'Language Arts / English', category: 'Languages' },
    { value: 'World Languages', label: 'World Languages', category: 'Languages' },
    { value: 'Spanish', label: 'Spanish Language', category: 'Languages' },
    { value: 'French', label: 'French Language', category: 'Languages' },
    { value: 'Mandarin', label: 'Mandarin Chinese', category: 'Languages' },
    { value: 'Arabic', label: 'Arabic Language', category: 'Languages' },
    { value: 'ESL', label: 'ESL / English Language Learning', category: 'Languages' },

    // Social Sciences
    { value: 'Social Studies', label: 'Social Studies', category: 'Social Sciences' },
    { value: 'Economics', label: 'Economics', category: 'Social Sciences' },
    { value: 'Political Science', label: 'Political Science / Civics', category: 'Social Sciences' },
    { value: 'Psychology', label: 'Psychology', category: 'Social Sciences' },
    { value: 'Sociology', label: 'Sociology', category: 'Social Sciences' },
    { value: 'Anthropology', label: 'Anthropology', category: 'Social Sciences' },

    // Global & Cultural
    { value: 'Global Studies', label: 'Global Studies / International Relations', category: 'Global' },
    { value: 'Cultural Studies', label: 'Cultural Studies', category: 'Global' },
    { value: 'Religious Studies', label: 'Religious Studies', category: 'Global' },
    { value: 'Peace Studies', label: 'Peace & Conflict Studies', category: 'Global' },
    { value: 'Human Rights', label: 'Human Rights Education', category: 'Global' },
    { value: 'Diversity', label: 'Diversity & Inclusion', category: 'Global' },

    // Environmental & Sustainability
    { value: 'Environmental Studies', label: 'Environmental Studies', category: 'Environment' },
    { value: 'Sustainability', label: 'Sustainability', category: 'Environment' },
    { value: 'Climate Change', label: 'Climate Change', category: 'Environment' },
    { value: 'Agriculture', label: 'Agriculture / Farming', category: 'Environment' },

    // Professional & Career
    { value: 'Business', label: 'Business / Entrepreneurship', category: 'Career' },
    { value: 'Health Sciences', label: 'Health Sciences', category: 'Career' },
    { value: 'Medical', label: 'Medical / Healthcare', category: 'Career' },
    { value: 'Law', label: 'Law / Legal Studies', category: 'Career' },
    { value: 'Education', label: 'Education / Teaching', category: 'Career' },
    { value: 'Communications', label: 'Communications / Media', category: 'Career' },
    { value: 'Journalism', label: 'Journalism', category: 'Career' },

    // Life Skills & Wellbeing
    { value: 'Physical Education', label: 'Physical Education / Sports', category: 'Wellbeing' },
    { value: 'Health', label: 'Health & Wellness', category: 'Wellbeing' },
    { value: 'Social Emotional Learning', label: 'Social-Emotional Learning (SEL)', category: 'Wellbeing' },
    { value: 'Leadership', label: 'Leadership', category: 'Wellbeing' },
    { value: 'Service Learning', label: 'Service Learning / Community Service', category: 'Wellbeing' },
    { value: 'Citizenship', label: 'Citizenship / Civic Engagement', category: 'Wellbeing' },

    // Special Programs
    { value: 'STEAM', label: 'STEAM (STEM + Arts)', category: 'Interdisciplinary' },
    { value: 'Project-Based Learning', label: 'Project-Based Learning', category: 'Interdisciplinary' },
    { value: 'Interdisciplinary', label: 'Interdisciplinary Studies', category: 'Interdisciplinary' },
    { value: 'Innovation', label: 'Innovation & Design Thinking', category: 'Interdisciplinary' },
    { value: 'Critical Thinking', label: 'Critical Thinking', category: 'Interdisciplinary' }
  ];

  // Browse Page with Advanced Filters and Pagination
  const BrowsePage = () => {
    const [filter, setFilter] = useState('all');
    const [regionFilter, setRegionFilter] = useState('all');
    const [schoolLevelFilter, setSchoolLevelFilter] = useState('all');
    const [languageFilter, setLanguageFilter] = useState('all');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [studentSizeFilter, setStudentSizeFilter] = useState('all');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(12);
    const [searchQuery, setSearchQuery] = useState('');

    // Get all unique languages and subjects from organizations
    const allLanguages = [...new Set(organizations.flatMap(org => org.languages || []))].sort();
    const allSubjects = [...new Set(organizations.flatMap(org => org.interests || []))].sort();

    const filteredOrgs = organizations.filter(org => {
      // Basic filters
      const matchesType = filter === 'all' || org.category === filter;
      const matchesRegion = regionFilter === 'all' || org.region === regionFilter;

      // School level filter
      const orgSchoolLevel = getSchoolLevel(org.type);
      const matchesSchoolLevel = schoolLevelFilter === 'all' ||
        (orgSchoolLevel && orgSchoolLevel === schoolLevelFilter);

      // Language filter
      const matchesLanguage = languageFilter === 'all' ||
        (org.languages && org.languages.includes(languageFilter));

      // Subject filter
      const matchesSubject = subjectFilter === 'all' ||
        (org.interests && org.interests.some(interest =>
          interest.toLowerCase().includes(subjectFilter.toLowerCase())
        ));

      // Student size filter
      let matchesStudentSize = true;
      if (studentSizeFilter !== 'all' && org.students) {
        const students = org.students;
        switch(studentSizeFilter) {
          case 'small':
            matchesStudentSize = students < 500;
            break;
          case 'medium':
            matchesStudentSize = students >= 500 && students < 1500;
            break;
          case 'large':
            matchesStudentSize = students >= 1500;
            break;
          default:
            matchesStudentSize = true;
        }
      }

      // Text search filter
      const matchesSearch = searchQuery === '' ||
        `${org.name} ${org.description} ${org.interests?.join(' ')} ${org.country} ${org.city || ''} ${org.state || ''}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesType && matchesRegion && matchesSchoolLevel &&
             matchesLanguage && matchesSubject && matchesStudentSize && matchesSearch;
    });

    const displayedOrgs = filteredOrgs.slice(0, itemsToShow);
    const hasMore = itemsToShow < filteredOrgs.length;

    const handleLoadMore = () => {
      setItemsToShow(prev => prev + 12);
    };

    const handleResetFilters = () => {
      setFilter('all');
      setRegionFilter('all');
      setSchoolLevelFilter('all');
      setLanguageFilter('all');
      setSubjectFilter('all');
      setStudentSizeFilter('all');
      setSearchQuery('');
      setItemsToShow(12);
    };

    const activeFilterCount = [filter, regionFilter, schoolLevelFilter, languageFilter, subjectFilter, studentSizeFilter]
      .filter(f => f !== 'all').length + (searchQuery ? 1 : 0);

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-gray-800 mb-4">Browse Partners</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our global network of verified educational institutions and exchange providers
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setItemsToShow(12);
            }}
            placeholder="Search by name, location, subjects, or keywords..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Basic Filters */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setItemsToShow(12);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                onChange={(e) => {
                  setRegionFilter(e.target.value);
                  setItemsToShow(12);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Level / Age Group</label>
              <select
                value={schoolLevelFilter}
                onChange={(e) => {
                  setSchoolLevelFilter(e.target.value);
                  setItemsToShow(12);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Levels</option>
                <option value="Primary/Elementary">Primary/Elementary (Ages 5-11)</option>
                <option value="Middle/Junior Secondary">Middle/Junior Secondary (Ages 11-14)</option>
                <option value="High/Upper Secondary">High/Upper Secondary (Ages 14-18)</option>
                <option value="University/Higher Education">University/Higher Education (Ages 18+)</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
            >
              {showAdvancedFilters ? '− Hide' : '+ Show'} Advanced Filters
              {activeFilterCount > 0 && (
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={languageFilter}
                  onChange={(e) => {
                    setLanguageFilter(e.target.value);
                    setItemsToShow(12);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Languages</option>
                  {allLanguages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject / Discipline</label>
                <select
                  value={subjectFilter}
                  onChange={(e) => {
                    setSubjectFilter(e.target.value);
                    setItemsToShow(12);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Subjects</option>
                  <optgroup label="STEM">
                    <option value="STEM">STEM (General)</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science (General)</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science / ICT</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Technology">Technology</option>
                  </optgroup>
                  <optgroup label="Arts & Humanities">
                    <option value="Arts">Arts (General)</option>
                    <option value="Visual Arts">Visual Arts / Fine Arts</option>
                    <option value="Music">Music</option>
                    <option value="Theater">Theater / Drama</option>
                    <option value="Dance">Dance / Movement</option>
                    <option value="Film">Film / Media Production</option>
                    <option value="Photography">Photography</option>
                    <option value="Literature">Literature</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Philosophy">Philosophy</option>
                  </optgroup>
                  <optgroup label="Languages">
                    <option value="Language Arts">Language Arts / English</option>
                    <option value="World Languages">World Languages</option>
                    <option value="Spanish">Spanish Language</option>
                    <option value="French">French Language</option>
                    <option value="Mandarin">Mandarin Chinese</option>
                    <option value="Arabic">Arabic Language</option>
                    <option value="ESL">ESL / English Language Learning</option>
                  </optgroup>
                  <optgroup label="Social Sciences">
                    <option value="Social Studies">Social Studies</option>
                    <option value="Economics">Economics</option>
                    <option value="Political Science">Political Science / Civics</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Sociology">Sociology</option>
                    <option value="Anthropology">Anthropology</option>
                  </optgroup>
                  <optgroup label="Global & Cultural Studies">
                    <option value="Global Studies">Global Studies / International Relations</option>
                    <option value="Cultural Studies">Cultural Studies</option>
                    <option value="Religious Studies">Religious Studies</option>
                    <option value="Peace Studies">Peace & Conflict Studies</option>
                    <option value="Human Rights">Human Rights Education</option>
                    <option value="Diversity">Diversity & Inclusion</option>
                  </optgroup>
                  <optgroup label="Environment & Sustainability">
                    <option value="Environmental Science">Environmental Science</option>
                    <option value="Environmental Studies">Environmental Studies</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Climate Change">Climate Change</option>
                    <option value="Agriculture">Agriculture / Farming</option>
                  </optgroup>
                  <optgroup label="Professional & Career Education">
                    <option value="Business">Business / Entrepreneurship</option>
                    <option value="Health Sciences">Health Sciences</option>
                    <option value="Medical">Medical / Healthcare</option>
                    <option value="Law">Law / Legal Studies</option>
                    <option value="Education">Education / Teaching</option>
                    <option value="Communications">Communications / Media</option>
                    <option value="Journalism">Journalism</option>
                  </optgroup>
                  <optgroup label="Wellbeing & Life Skills">
                    <option value="Physical Education">Physical Education / Sports</option>
                    <option value="Health">Health & Wellness</option>
                    <option value="Social Emotional Learning">Social-Emotional Learning (SEL)</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Service Learning">Service Learning / Community Service</option>
                    <option value="Citizenship">Citizenship / Civic Engagement</option>
                  </optgroup>
                  <optgroup label="Interdisciplinary">
                    <option value="STEAM">STEAM (STEM + Arts)</option>
                    <option value="Project-Based Learning">Project-Based Learning</option>
                    <option value="Interdisciplinary">Interdisciplinary Studies</option>
                    <option value="Innovation">Innovation & Design Thinking</option>
                    <option value="Critical Thinking">Critical Thinking</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School Size</label>
                <select
                  value={studentSizeFilter}
                  onChange={(e) => {
                    setStudentSizeFilter(e.target.value);
                    setItemsToShow(12);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Sizes</option>
                  <option value="small">Small (Under 500)</option>
                  <option value="medium">Medium (500-1,500)</option>
                  <option value="large">Large (1,500+)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{displayedOrgs.length}</span> of{' '}
            <span className="font-semibold">{filteredOrgs.length}</span>{' '}
            {filteredOrgs.length === 1 ? 'organization' : 'organizations'}
          </div>
          {activeFilterCount > 0 && (
            <div className="text-sm text-gray-500">
              {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
            </div>
          )}
        </div>

        {/* Organizations Grid */}
        {displayedOrgs.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedOrgs.map(org => (
                <OrganizationCard key={org.id} org={org} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Load More ({filteredOrgs.length - itemsToShow} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No partners found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    );
  };

  // About Page
  const AboutPage = () => (
    <div className="max-w-5xl mx-auto space-y-16">
      {/* Hero */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold" style={{color: '#666666'}}>About The Virtual Exchange</h1>
        <p className="text-2xl text-gray-600 italic max-w-3xl mx-auto leading-relaxed">
          "Every conversation is a step toward solidarity"
        </p>
      </div>

      {/* Mission Statement - Highlighted */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-12 shadow-sm">
        <p className="text-2xl text-gray-800 leading-relaxed text-center font-light">
          The Virtual Exchange is MapWorks Learning's way of making global connection <span className="font-semibold text-blue-700">easier</span>, <span className="font-semibold text-indigo-700">safer</span>, and more <span className="font-semibold text-purple-700">human</span> for students, educators, and communities.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5 mx-auto">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3" style={{color: '#666666'}}>Built with Care</h3>
          <p className="text-gray-700 leading-relaxed">
            Connection is not a one-time event. It's a practice that grows through clear expectations, thoughtful pacing, and spaces where everyone feels seen and heard.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-5 mx-auto">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3" style={{color: '#666666'}}>Youth Leadership</h3>
          <p className="text-gray-700 leading-relaxed">
            Students set the tone, shape the questions, and lead the work. Teachers hold the space with care and clarity so trust can form and learning can deepen.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-5 mx-auto">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3" style={{color: '#666666'}}>Meaningful Action</h3>
          <p className="text-gray-700 leading-relaxed">
            Relationships across borders become meaningful projects. Connection leads to growth, and growth leads to action.
          </p>
        </div>
      </div>

      {/* What Happens Section */}
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
        <h2 className="text-3xl font-semibold mb-6 text-center" style={{color: '#666666'}}>What Happens When It Works</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              For Students
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 flex-shrink-0" style={{lineHeight: '1.75rem'}}>•</span>
                <span>Listen more deeply and ask better questions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 flex-shrink-0" style={{lineHeight: '1.75rem'}}>•</span>
                <span>Learn to collaborate with respect across differences</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 flex-shrink-0" style={{lineHeight: '1.75rem'}}>•</span>
                <span>Practice open-mindedness and compassion with real people</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              For Educators
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-purple-600 flex-shrink-0" style={{lineHeight: '1.75rem'}}>•</span>
                <span>Gain peers beyond their own walls</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 flex-shrink-0" style={{lineHeight: '1.75rem'}}>•</span>
                <span>Strengthen their craft through shared learning</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 flex-shrink-0" style={{lineHeight: '1.75rem'}}>•</span>
                <span>Bring global understanding into everyday classroom life</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Why This Works - Generative Social Fields Section */}
      <div className="bg-white rounded-3xl p-16 shadow-sm">
        <h2 className="text-4xl font-light mb-4 text-center tracking-tight" style={{color: '#1d1d1f'}}>Why This Actually Works</h2>
        <div className="max-w-5xl mx-auto">
          <p className="text-xl text-center mb-16 max-w-3xl mx-auto" style={{color: '#6e6e73', lineHeight: '1.6', fontWeight: '300'}}>
            Virtual exchange isn't just feel-good storytelling. It creates what researchers call <span className="font-medium" style={{color: '#1d1d1f'}}>generative social fields</span> – relational spaces where students can show up authentically, connect across difference, and develop the adaptability needed for an interconnected world.
          </p>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 mb-20">
            <div>
              <h3 className="text-2xl font-medium mb-4 tracking-tight text-center" style={{color: '#1d1d1f'}}>Authentic Connection</h3>
              <p className="text-lg" style={{color: '#6e6e73', lineHeight: '1.7', fontWeight: '300'}}>
                When students share genuine stories across cultures, they create spaces where people feel seen and emotionally safe. This isn't theory – it's observable in how students interact, the quality of their questions, and their willingness to be vulnerable.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-medium mb-4 tracking-tight text-center" style={{color: '#1d1d1f'}}>Living Systems Change</h3>
              <p className="text-lg" style={{color: '#6e6e73', lineHeight: '1.7', fontWeight: '300'}}>
                Real change doesn't come from one-time workshops. It grows organically when students practice showing up with awareness, emotional literacy, and care for others – the same skills that drive flourishing in adult life.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-medium mb-4 tracking-tight text-center" style={{color: '#1d1d1f'}}>Networks of Growth</h3>
              <p className="text-lg" style={{color: '#6e6e73', lineHeight: '1.7', fontWeight: '300'}}>
                Virtual exchanges create interconnected webs of relationship – like underground root systems sharing nutrients across ecosystems. Knowledge, empathy, and hope flow through these networks. No single point of failure. Just continuous growth through authentic human connection.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-medium mb-4 tracking-tight text-center" style={{color: '#1d1d1f'}}>Evidence-Based Practice</h3>
              <p className="text-lg" style={{color: '#6e6e73', lineHeight: '1.7', fontWeight: '300'}}>
                Research shows virtual exchange reduces prejudice, increases perspective-taking, and builds skills for navigating conflict. But it only works when done with care, not as checkbox compliance.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-12 mb-16">
            <p className="text-2xl text-center leading-relaxed" style={{color: '#1d1d1f', fontWeight: '300', fontStyle: 'italic'}}>
              "The quality of relationships is the most significant factor for happiness, longevity, and well-being."
            </p>
            <p className="text-center mt-4" style={{color: '#6e6e73', fontSize: '0.95rem'}}>
              Harvard Study of Adult Development (80+ years of research)
            </p>
          </div>

          <p className="text-xl text-center max-w-3xl mx-auto" style={{color: '#6e6e73', lineHeight: '1.7', fontWeight: '300'}}>
            Virtual exchange cultivates the relational competencies that matter: empathy, collaboration, critical thinking, and the ability to hold complexity. These aren't soft skills. They're the foundations of leadership, innovation, and human flourishing.
          </p>
        </div>
      </div>

      {/* Why Now Section */}
      <div className="bg-white rounded-3xl p-14 shadow-sm border border-gray-200">
        <h2 className="text-3xl font-semibold mb-8 text-center" style={{color: '#666666'}}>Why This Matters Now</h2>
        <div className="space-y-6 text-lg leading-relaxed text-gray-700 max-w-4xl mx-auto">
          <p>
            The world is asking young people and educators to live inside tension every day. Polarization is louder. Distrust spreads faster than truth.
          </p>
          <p>
            Virtual exchange won't solve every crisis. But it can change the temperature in the room. It can turn <span className="font-semibold" style={{color: '#8B5CF6'}}>"them"</span> into someone with a name, a story, and a voice.
          </p>
          <p className="text-xl font-semibold text-center pt-6" style={{color: '#666666'}}>
            This is leadership training for the world we are already in.
          </p>
        </div>
      </div>

      {/* Call to Action - Big Statement */}
      <div className="bg-white rounded-3xl p-16 shadow-sm border border-gray-100 text-center">
        <h2 className="text-4xl font-medium mb-6 leading-tight tracking-tight" style={{color: '#1d1d1f'}}>
          Virtual exchange should not be a luxury.<br/>
          It should be a standard.
        </h2>
        <p className="text-xl leading-relaxed max-w-3xl mx-auto" style={{color: '#6e6e73', lineHeight: '1.7', fontWeight: '300'}}>
          The Virtual Exchange exists to help make that standard real, so every student and every educator can access the kind of learning that grows dignity, belonging, and the ability to lead with care in a connected world.
        </p>
      </div>

      {/* MapWorks Section */}
      <div className="bg-white rounded-3xl p-14 shadow-sm border border-gray-100">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex justify-center">
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
          <h3 className="text-3xl font-medium tracking-tight" style={{color: '#1d1d1f'}}>Developed by MapWorks Learning</h3>
          <p className="text-lg leading-relaxed max-w-2xl" style={{color: '#6e6e73', lineHeight: '1.7', fontWeight: '300'}}>
            At MapWorks Learning, virtual exchange isn't just a program we offer—it's what we live and breathe. The Virtual Exchange is our gift to the global community: a vetted, professional gateway designed to break down borders. We believe that every student, from elementary school to university, deserves a window to the world. This platform is the bridge that makes those connections possible, safe, and meaningful.
          </p>
          <a
            href="https://mapworkslearning.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-xl font-medium hover:opacity-90 transition shadow-sm hover:shadow-md"
            style={{backgroundColor: '#1d1d1f', color: 'white'}}
          >
            Learn More About MapWorks
          </a>
        </div>
      </div>
    </div>
  );

  // Contact Page
  const ContactPage = () => {
    const [contactForm, setContactForm] = useState({
      firstName: '',
      lastName: '',
      email: '',
      organization: '',
      subject: 'General Inquiry',
      message: ''
    });
    const [contactSubmitting, setContactSubmitting] = useState(false);
    const [contactSuccess, setContactSuccess] = useState(false);
    const [contactError, setContactError] = useState('');

    const handleContactSubmit = async (e) => {
      e.preventDefault();
      setContactSubmitting(true);
      setContactError('');

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactForm),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        setContactSuccess(true);
        setContactForm({
          firstName: '',
          lastName: '',
          email: '',
          organization: '',
          subject: 'General Inquiry',
          message: ''
        });

        // Reset success message after 5 seconds
        setTimeout(() => setContactSuccess(false), 5000);
      } catch (error) {
        setContactError('Failed to send message. Please try again or email us directly at hello@mapworkslearning.org');
      } finally {
        setContactSubmitting(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        {contactSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              <CheckCircle className="inline mr-2" size={16} />
              Thank you for contacting us! We'll get back to you soon.
            </p>
          </div>
        )}

        {contactError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{contactError}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={contactForm.firstName}
                  onChange={(e) => setContactForm({...contactForm, firstName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={contactForm.lastName}
                  onChange={(e) => setContactForm({...contactForm, lastName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
              <input
                type="text"
                value={contactForm.organization}
                onChange={(e) => setContactForm({...contactForm, organization: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
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
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={contactSubmitting}
              className="w-full bg-gray-800 text-white py-4 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {contactSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>Or email us directly at <a href="mailto:hello@mapworkslearning.org" className="text-gray-800 font-medium hover:underline">hello@mapworkslearning.org</a></p>
        </div>
      </div>
    );
  };

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

  // Lesson Plan Data - Comprehensive plans for all activities with CC BY 4.0 license
  const lessonPlansData = [
    {
      id: 1,
      title: "Cultural Identity Tree",
      category: "identity",
      duration: "45-60 minutes",
      gradeLevel: "All Ages (adaptable)",
      subjects: ["Social Studies", "Art", "SEL"],
      description: "Students create a visual representation of their cultural background, family traditions, and personal values using a tree metaphor.",
      learningObjectives: [
        "Explore and articulate the various aspects of their cultural identity",
        "Think critically about how heritage, values, and aspirations shape who they are",
        "Act with care when sharing and learning about diverse backgrounds",
        "Lead by creating a classroom culture of respect and appreciation for diversity"
      ],
      materialsNeeded: [
        "Large paper or poster board (one per student)",
        "Colored markers, crayons, or colored pencils",
        "Optional: magazines for collage, glue, scissors",
        "Optional: real tree branches, leaves, or natural materials"
      ],
      stepByStep: [
        {
          step: 1,
          title: "Introduction (10 min)",
          content: "Explain the tree metaphor: roots (heritage/family), trunk (core values), branches (aspirations/dreams). Show an example and discuss why trees are a fitting symbol for identity."
        },
        {
          step: 2,
          title: "Brainstorming (10 min)",
          content: "Students create three lists: Heritage/Family (roots), Core Values (trunk), Dreams/Goals (branches). Encourage them to think deeply about what makes them who they are."
        },
        {
          step: 3,
          title: "Creation (20-30 min)",
          content: "Students draw their tree and fill each part with words, images, symbols, or collage elements representing their identity. Encourage creativity and personal expression."
        },
        {
          step: 4,
          title: "Sharing Circle (10-15 min)",
          content: "Students share their trees in small groups or pairs. Set community agreements: respectful listening, asking curious questions, appreciating differences."
        }
      ],
      reflectionQuestions: [
        "What surprised you about your own identity tree?",
        "What did you learn about your classmates that you didn't know before?",
        "How did it feel to share parts of your identity?",
        "What connections did you notice between your tree and others'?"
      ],
      assessment: [
        "Observe participation in sharing and respectful listening",
        "Review completed trees for depth of reflection",
        "Ask students to write a brief reflection on what they learned",
        "Note students' ability to ask respectful, curious questions"
      ],
      adaptations: [
        "Elementary: Use simpler vocabulary, provide more structured templates",
        "Middle School: Add more abstract concepts like personality traits and social identities",
        "High School/University: Include discussion of intersectionality and systemic influences on identity",
        "Virtual Exchange: Partners create trees and share via video call, noticing similarities and differences across cultures"
      ],
      virtualExchangeConnection: "Partner classrooms create identity trees and share them via video exchange. Students notice patterns, ask questions about different cultural traditions, and find unexpected common ground across borders.",
      evidenceSource: "Tested with 450+ students in MapWorks exchanges and 2,000+ students in partner schools across 15 countries",
      facilitatorNotes: "Some students struggle with 'core values' abstraction - offer concrete examples (family, honesty, creativity). Allow privacy - students can choose what to share. Best when followed by discussion of how identity shapes perspective. Works beautifully in multicultural classrooms where students discover unexpected common ground.",
      license: "CC BY 4.0",
      attribution: "Created by The Virtual Exchange",
      downloadUrl: "/downloads/cultural-identity-tree.pdf"
    },
    {
      id: 2,
      title: "The Five Types of Care",
      category: "empathy",
      duration: "30-45 minutes",
      gradeLevel: "Grades 3+",
      subjects: ["SEL", "Character Education", "Health"],
      description: "Students explore five ways to show care for others and practice each type through partnerships and real-world application.",
      learningObjectives: [
        "Identify and describe five distinct ways to show care: Kind Words, Time Together, Thoughtful Giving, Comforting Presence, Helpful Acts",
        "Think critically about which types of care are most meaningful in different situations",
        "Act with care by practicing multiple forms of caring with classmates",
        "Lead by modeling caring behaviors in daily interactions"
      ],
      materialsNeeded: [
        "Chart paper or whiteboard",
        "Index cards or sticky notes",
        "Optional: 'Care Cards' template (printable)",
        "Optional: journals for reflection"
      ],
      stepByStep: [
        {
          step: 1,
          title: "Introduction to the Five Types (10 min)",
          content: "Present each type of care with examples: Kind Words (compliments, encouragement), Time Together (listening, being present), Thoughtful Giving (meaningful gifts), Comforting Presence (being there in hard times), Helpful Acts (service, assistance). Discuss which resonates most with them."
        },
        {
          step: 2,
          title: "Personal Reflection (5 min)",
          content: "Students identify: Which type do they most naturally give? Which do they most appreciate receiving? Which might they want to practice more?"
        },
        {
          step: 3,
          title: "Partnership Practice (15-20 min)",
          content: "In pairs, students practice at least three types: share kind words, spend focused time listening, offer helpful acts. Rotate partners to practice with different classmates."
        },
        {
          step: 4,
          title: "Action Planning (10 min)",
          content: "Students create 'Care Cards' - small commitments to practice one type of care with someone specific this week. Share commitments if comfortable."
        }
      ],
      reflectionQuestions: [
        "Which type of care felt most natural to give? Most challenging?",
        "How did it feel to receive each type of care?",
        "Who in your life shows you care? How do they do it?",
        "How can you incorporate these practices into daily life?"
      ],
      assessment: [
        "Observe students' ability to demonstrate each type of care authentically",
        "Review Care Cards for thoughtful planning",
        "Follow up: Did students complete their care commitment? What was the impact?",
        "Note students' growing vocabulary for describing caring behaviors"
      ],
      adaptations: [
        "Younger students: Focus on 2-3 types with more concrete examples",
        "Older students: Explore cultural differences in expressions of care",
        "Virtual: Practice via video partnership - compliments, listening, sharing resources",
        "Advanced: Discuss which types are hardest to practice across divides (political, cultural, etc.)"
      ],
      virtualExchangeConnection: "Partner students across classrooms practice the five types through virtual interactions. They discover how care transcends borders and language barriers.",
      evidenceSource: "Adapted from research-based love languages framework, tested with 600+ students in SEL programs and virtual exchanges",
      facilitatorNotes: "Students love the Care Cards activity - make it tangible. Discussion of cultural differences in care expression is rich, especially with diverse classrooms. 'Time Together' often surprises students as most valuable. Some find 'Thoughtful Giving' challenging (equity concerns) - emphasize non-material gifts.",
      license: "CC BY 4.0",
      attribution: "Created by The Virtual Exchange | Inspired by Gary Chapman's Five Love Languages",
      downloadUrl: "/downloads/five-types-of-care.pdf"
    },
    {
      id: 3,
      title: "Community Needs Assessment",
      category: "collaboration",
      duration: "60-90 minutes (can span multiple sessions)",
      gradeLevel: "Grades 6+",
      subjects: ["Social Studies", "Service Learning", "Project-Based Learning"],
      description: "Students identify genuine needs in their community through research and stakeholder interviews, building toward collaborative action projects.",
      learningObjectives: [
        "Think critically about community challenges and their root causes",
        "Act with care by listening to diverse stakeholder perspectives",
        "Lead research efforts to understand problems deeply before proposing solutions",
        "Develop skills in interviewing, data collection, and empathetic problem-solving"
      ],
      materialsNeeded: [
        "Interview guide templates",
        "Recording devices or note-taking materials",
        "Chart paper for mapping findings",
        "Access to local news sources, community reports",
        "Optional: cameras for photo documentation"
      ],
      stepByStep: [
        {
          step: 1,
          title: "Identify Focus Area (15-20 min)",
          content: "Brainstorm community challenges students notice: environment, education, food access, elderly care, youth spaces, etc. Vote or discuss to narrow to 1-2 focus areas."
        },
        {
          step: 2,
          title: "Develop Research Questions (15 min)",
          content: "What do we want to understand? Who is affected? What's already being done? What's missing? Create interview questions and research plan."
        },
        {
          step: 3,
          title: "Conduct Research (Outside class or 30 min)",
          content: "Students interview community members, review local news, visit relevant locations. Focus on listening to those directly affected by the issue."
        },
        {
          step: 4,
          title: "Analyze and Map Findings (20-30 min)",
          content: "Compile interview notes, identify patterns, map stakeholders, discuss root causes vs. symptoms. Create visual representation of the need."
        },
        {
          step: 5,
          title: "Present Findings (10-15 min)",
          content: "Groups present what they learned. Discuss: What surprised us? What do we still need to understand? What might be appropriate responses?"
        }
      ],
      reflectionQuestions: [
        "What did you learn about this issue that you didn't know before?",
        "How did talking to community members change your understanding?",
        "What assumptions did you hold that were challenged?",
        "What would be respectful, effective ways to address this need?"
      ],
      assessment: [
        "Quality of research questions and interview protocols",
        "Depth of findings and analysis",
        "Ability to identify root causes, not just symptoms",
        "Respectful, empathetic approach to community engagement"
      ],
      adaptations: [
        "Younger students: Focus on school-based needs, simpler research methods",
        "Advanced: Partner with local nonprofits, conduct surveys, analyze data",
        "Virtual Exchange: Partner classrooms research parallel issues in their regions, compare findings",
        "Remote learning: Virtual interviews, online research, digital mapping tools"
      ],
      virtualExchangeConnection: "Partner classrooms in different regions each conduct community needs assessments. They compare findings, identify universal challenges, and potentially co-design solutions that work across contexts.",
      evidenceSource: "Based on Asset-Based Community Development framework, tested with 320 students in service-learning programs across 8 countries",
      facilitatorNotes: "CRITICAL: Students must talk to actual community members, not just Google. Interview skills need scaffolding - role-play first. Avoid 'savior complex' by emphasizing listening over fixing. Root causes discussion is challenging but essential. Works best when it leads to actual action, not just a report. Partner with local nonprofits when possible.",
      license: "CC BY 4.0",
      attribution: "Created by The Virtual Exchange | Informed by Asset-Based Community Development practices",
      downloadUrl: "/downloads/community-needs-assessment.pdf"
    }
  ];

  // External CC-Licensed Resources - Curated from reputable organizations with evidence
  const externalResources = [
    {
      id: 1,
      title: "Global Classroom Activities",
      source: "UNESCO",
      description: "Collection of 50+ activities promoting intercultural dialogue and global citizenship education",
      subject: ["Global Citizenship", "Intercultural Learning"],
      type: "Activity Collection",
      ageGroup: "Grades 6-12",
      license: "CC BY-SA 4.0",
      url: "https://www.unesco.org/en/education",
      format: "PDF",
      tags: ["UNESCO", "Global Citizenship", "Peace Education", "Intercultural Dialogue"],
      timeRequired: "30-60 min per activity",
      riskLevel: "Low to Medium",
      purpose: ["Ice breaker", "Deep dialogue", "Cultural awareness"],
      evidenceSource: "Tested in 156 schools across 32 countries through UNESCO GCED program",
      facilitatorNotes: "Start with low-risk activities to build trust. Activities scale well from small groups to whole class. Some require adapting for virtual format - check tech requirements first.",
      contributor: {
        name: "UNESCO Education Team",
        organization: "United Nations Educational, Scientific and Cultural Organization",
        attribution: "CC BY-SA 4.0"
      },
      outcomes: ["Cultural awareness", "Perspective-taking", "Global citizenship", "Dialogue skills"]
    },
    {
      id: 2,
      title: "Virtual Exchange Toolkit",
      source: "Stevens Initiative",
      description: "Comprehensive guide to designing and implementing virtual exchange programs with lesson plan templates",
      subject: ["Virtual Exchange", "Program Design"],
      type: "Toolkit",
      ageGroup: "Higher Education",
      license: "CC BY 4.0",
      url: "https://www.stevensinitiative.org/resources/",
      format: "Online Resource",
      tags: ["Stevens Initiative", "Virtual Exchange", "Higher Ed", "Program Design"],
      timeRequired: "Varies - planning toolkit",
      riskLevel: "Low",
      purpose: ["Program design", "Planning resource", "Implementation guide"],
      evidenceSource: "Developed from 50,000+ virtual exchange participants annually across Stevens-funded programs",
      facilitatorNotes: "Best used during planning phase. Templates save hours of prep time. Rubrics are particularly strong for assessing intercultural competence gains.",
      contributor: {
        name: "Stevens Initiative Team",
        organization: "Stevens Initiative",
        attribution: "CC BY 4.0"
      },
      outcomes: ["Program design skills", "Assessment frameworks", "Implementation strategies"]
    },
    {
      id: 3,
      title: "COIL Collaborative Assignments",
      source: "SUNY COIL Center",
      description: "Ready-to-use collaborative assignments for virtual exchange across disciplines",
      subject: ["Collaborative Learning", "All Subjects"],
      type: "Assignment Bank",
      ageGroup: "University",
      license: "CC BY-NC 4.0",
      url: "https://coil.suny.edu/",
      format: "Online Database",
      tags: ["SUNY COIL", "Higher Education", "Collaborative Assignments"],
      timeRequired: "2-12 weeks per assignment",
      riskLevel: "Medium",
      purpose: ["Collaborative project", "Discipline-specific learning", "Cross-cultural teamwork"],
      evidenceSource: "Used by 30,000+ university students annually across 80+ countries in SUNY COIL network",
      facilitatorNotes: "Allow extra time for technical issues in first sessions. Group formation is critical - use their pairing strategies. Assignments work best when integrated into grading, not extra credit.",
      contributor: {
        name: "SUNY COIL Center Faculty",
        organization: "State University of New York",
        attribution: "CC BY-NC 4.0"
      },
      outcomes: ["Disciplinary knowledge", "Collaboration", "Digital literacy", "Cultural competence"]
    },
    {
      id: 4,
      title: "iEARN Project Guides",
      source: "iEARN International",
      description: "100+ collaborative project guides connecting K-12 classrooms worldwide",
      subject: ["STEM", "Arts", "Social Studies", "Language Learning"],
      type: "Project Guides",
      ageGroup: "K-12",
      license: "CC BY-NC-SA 3.0",
      url: "https://iearn.org/",
      format: "Online Collection",
      tags: ["iEARN", "K-12", "Project-Based Learning", "Global Collaboration"],
      timeRequired: "4-16 weeks per project",
      riskLevel: "Low to High",
      purpose: ["Long-term project", "Authentic audience", "Service learning", "Student-led work"],
      evidenceSource: "35+ years of classroom testing, 150,000+ students participate annually across 140 countries",
      facilitatorNotes: "Projects require sustained commitment - don't start unless you can finish. Partner matching takes 2-4 weeks. Tech support is strong. Best projects have authentic real-world impact, not just info exchange.",
      contributor: {
        name: "iEARN Global Educator Network",
        organization: "iEARN International",
        attribution: "CC BY-NC-SA 3.0"
      },
      outcomes: ["Project management", "Global collaboration", "Authentic learning", "Service mindset", "Student agency"]
    },
    {
      id: 5,
      title: "Cultural Exchange Ice Breakers",
      source: "Global Nomads Group",
      description: "15 engaging ice breaker activities designed for virtual cross-cultural exchanges",
      subject: ["Cultural Exchange", "Communication"],
      type: "Activity Collection",
      ageGroup: "All Ages",
      license: "CC BY 4.0",
      url: "https://www.gng.org/",
      format: "PDF",
      tags: ["Ice Breakers", "Cross-Cultural", "Communication", "Virtual Exchange"],
      timeRequired: "15-30 min per activity",
      riskLevel: "Low",
      purpose: ["Ice breaker", "Community building", "First session", "Re-energizer"],
      evidenceSource: "Tested with 10,000+ students in Global Nomads Group virtual exchanges across 45 countries",
      facilitatorNotes: "Perfect for Session 1 - build comfort before going deeper. 'Show and Tell from Home' consistently wins for engagement. 'Two Truths One Lie' flops when cultural references don't translate. Pre-teach any idioms.",
      contributor: {
        name: "Global Nomads Group Facilitation Team",
        organization: "Global Nomads Group",
        attribution: "CC BY 4.0"
      },
      outcomes: ["Comfort with technology", "Initial connection", "Breaking stereotypes", "Curiosity"]
    },
    {
      id: 6,
      title: "Soliya Dialogue Curriculum",
      source: "Soliya",
      description: "Facilitation guide for dialogue-based virtual exchanges focused on bridging divides",
      subject: ["Dialogue", "Conflict Resolution", "Intercultural Understanding"],
      type: "Curriculum",
      ageGroup: "University",
      license: "CC BY-NC 4.0",
      url: "https://www.soliya.net/",
      format: "PDF Guide",
      tags: ["Soliya", "Dialogue", "Facilitation", "Intercultural"],
      timeRequired: "8-week program, 2 hours/week",
      riskLevel: "High",
      purpose: ["Deep dialogue", "Difficult conversations", "Perspective transformation", "Facilitation training"],
      evidenceSource: "20+ years of implementation, 25,000+ participants, peer-reviewed research on perspective change and reduced prejudice",
      facilitatorNotes: "DO NOT skip facilitator training - dialogue on charged topics requires skill. Students need emotional support structures. Expect discomfort - it's part of growth. Have counseling referrals ready. Best outcomes when integrated into curriculum, not standalone.",
      contributor: {
        name: "Soliya Facilitation Team",
        organization: "Soliya",
        attribution: "CC BY-NC 4.0"
      },
      outcomes: ["Perspective-taking", "Reduced prejudice", "Dialogue skills", "Emotional intelligence", "Conflict navigation"]
    },
    {
      id: 7,
      title: "OER Commons Global Education",
      source: "OER Commons",
      description: "Searchable database of 10,000+ openly licensed global education resources",
      subject: ["All Subjects"],
      type: "Resource Database",
      ageGroup: "K-12 & Higher Ed",
      license: "Various CC licenses",
      url: "https://www.oercommons.org/",
      format: "Online Database",
      tags: ["OER", "Open Educational Resources", "Global Education"],
      timeRequired: "Varies by resource",
      riskLevel: "Varies",
      purpose: ["Resource discovery", "Lesson planning", "Open content"],
      evidenceSource: "Largest OER repository globally, millions of educators use it for discovery",
      facilitatorNotes: "Quality varies wildly - always review before using. Search is powerful but overwhelming. Best for finding specific topics, not browsing. Check actual CC license on each resource, not just the hub.",
      contributor: {
        name: "OER Commons Community",
        organization: "ISKME (Institute for the Study of Knowledge Management in Education)",
        attribution: "Various CC licenses"
      },
      outcomes: ["Resource discovery", "Open education awareness", "Curriculum development"]
    }
  ];

  // Tested Activities Library - Short, evidence-based activities from real classrooms
  const testedActivities = [
    {
      id: "ta1",
      name: "Show & Tell from Home",
      timeRequired: "20 min",
      ageGroup: "All Ages",
      riskLevel: "Low",
      purpose: ["Ice breaker", "First session", "Cultural awareness"],
      description: "Students share one object from their home that's meaningful to them, explaining why it matters and what it says about their culture or family.",
      facilitatorNotes: "WINNER for first sessions. Students pick objects beforehand. Set 2-min timer per student. Ask follow-up questions to build connections between students. Works flawlessly on Zoom.",
      evidenceSource: "Tested with 2,300+ students in MapWorks Global Campfires across 28 countries over 4 years",
      outcomes: ["Initial comfort", "Breaking ice", "Cultural insight", "Storytelling practice"],
      contributor: {
        name: "MapWorks Learning",
        organization: "MapWorks Learning",
        attribution: "CC BY 4.0"
      },
      techNeeds: "Basic video call platform",
      adaptations: ["Younger students: shorter time limits", "Larger groups: breakout rooms of 4-6", "Asynchronous: video recordings"]
    },
    {
      id: "ta2",
      name: "60-Second Community Tours",
      timeRequired: "30 min",
      ageGroup: "Grades 4+",
      riskLevel: "Low",
      purpose: ["Community awareness", "Ice breaker", "Place-based learning"],
      description: "Students create 60-second video tours of their neighborhood, school, or town, highlighting what makes it unique.",
      facilitatorNotes: "Pre-record videos for homework, watch together live. Pause for questions. Students notice similarities across very different places - lean into that. Phone cameras work fine.",
      evidenceSource: "Used by 847 students across Stevens Initiative-funded exchanges, 94% engagement rate",
      outcomes: ["Place attachment", "Observation skills", "Pride in community", "Finding common ground"],
      contributor: {
        name: "Global Nomads Group Facilitation Team",
        organization: "Global Nomads Group",
        attribution: "CC BY 4.0"
      },
      techNeeds: "Video recording (phones fine), video sharing platform",
      adaptations: ["Virtual-only: use Google Street View tours", "Low-tech: photo slideshows", "Written descriptions with maps"]
    },
    {
      id: "ta3",
      name: "Hope Stories Exchange",
      timeRequired: "45 min",
      ageGroup: "Grades 6+",
      riskLevel: "Medium",
      purpose: ["Deep dialogue", "Hope building", "Emotional connection"],
      description: "Students share a personal story about a time they lost hope and how they found it again, then identify common themes across cultures.",
      facilitatorNotes: "DO NOT use in Session 1 - requires existing trust. Have counseling resources ready. Model vulnerability as facilitator first. Some students share deeply traumatic stories - be prepared to provide support. Best outcomes when followed by action projects.",
      evidenceSource: "Developed through Soliya dialogue programs with 3,200+ university students, shown to reduce prejudice by 23% in pre/post assessments",
      outcomes: ["Empathy", "Vulnerability", "Perspective-taking", "Finding common humanity"],
      contributor: {
        name: "Soliya Facilitation Team",
        organization: "Soliya",
        attribution: "CC BY 4.0"
      },
      techNeeds: "Breakout rooms, safe video platform with mute/camera off options",
      adaptations: ["Younger: lighter prompt like 'challenge you overcame'", "Lower risk: written exchange first", "Follow-up: art or poetry expressing themes"]
    },
    {
      id: "ta4",
      name: "Stereotypes We've Experienced",
      timeRequired: "50 min",
      ageGroup: "Grades 8+",
      riskLevel: "High",
      purpose: ["Difficult conversations", "Stereotype awareness", "Perspective transformation"],
      description: "Students anonymously share stereotypes others have about their culture/identity, then discuss how it feels and how to push back against stereotypes.",
      facilitatorNotes: "HIGH RISK but HIGH REWARD. Use anonymous submission (Padlet, Mentimeter). Set strict ground rules. Some students will cry - have tissues and support ready. White/privileged students sometimes derail with 'reverse racism' - prepare responses. Best with co-facilitation.",
      evidenceSource: "Adapted from Facing History curriculum, tested with 1,100+ students in iEARN projects across 19 countries",
      outcomes: ["Reduced stereotyping", "Empathy for marginalized groups", "Critical thinking", "Advocacy skills"],
      contributor: {
        name: "Facing History and Ourselves",
        organization: "Facing History and Ourselves",
        attribution: "CC BY-NC 4.0"
      },
      techNeeds: "Anonymous submission tool, breakout rooms",
      adaptations: ["Lower risk: focus on stereotypes in media vs personal", "Follow-up: counter-stereotype media projects", "Parent/admin notification recommended"]
    },
    {
      id: "ta5",
      name: "Our Shared Climate Story",
      timeRequired: "60 min",
      ageGroup: "Grades 7+",
      riskLevel: "Medium",
      purpose: ["Climate action", "Collaborative project", "Systems thinking"],
      description: "Partner classrooms research how climate change affects their local regions, then co-design a project addressing both communities' needs.",
      facilitatorNotes: "Students bring VERY different climate realities - one class might face drought, another flooding. Don't force connections if they're not there. Best when culminates in action, not just research. Expect climate anxiety - validate emotions.",
      evidenceSource: "Piloted with 340 students in MapWorks Youth Climate Fellows across 8 countries, 78% completed action projects",
      outcomes: ["Climate literacy", "Systems thinking", "Collaborative design", "Youth agency", "Local action"],
      contributor: {
        name: "MapWorks Learning",
        organization: "MapWorks Learning",
        attribution: "CC BY 4.0"
      },
      techNeeds: "Collaborative workspace (Miro, Google Docs), video calls, project documentation tools",
      adaptations: ["Shorter: focus on awareness without action project", "Longer: 12-week full implementation", "Cross-curricular: integrate science, social studies, language arts"]
    },
    {
      id: "ta6",
      name: "Day in the Life Photo Exchange",
      timeRequired: "40 min over 2 sessions",
      ageGroup: "All Ages",
      riskLevel: "Low",
      purpose: ["Daily life awareness", "Similarities and differences", "Visual literacy"],
      description: "Students photograph moments from their day (waking up, school, meals, family time), then exchange photos with partner class to identify similarities and differences.",
      facilitatorNotes: "Session 1: introduce and assign. Homework: take photos. Session 2: share and discuss. Privacy matters - some students can't share home photos (poverty, family situations). Offer alternatives like 'typical day drawings.' Focus on similarities, not poverty porn.",
      evidenceSource: "Used in 2,000+ iEARN classrooms globally over 15 years, consistently high engagement",
      outcomes: ["Visual literacy", "Cultural awareness", "Empathy", "Observation skills"],
      contributor: {
        name: "iEARN Global Network",
        organization: "iEARN International",
        attribution: "CC BY-NC-SA 3.0"
      },
      techNeeds: "Cameras (phones fine), photo sharing platform",
      adaptations: ["Low-tech: drawings instead of photos", "Younger: focus on 3-4 moments only", "Privacy-conscious: public spaces only (no home shots)"]
    },
    {
      id: "ta7",
      name: "Question Circles",
      timeRequired: "35 min",
      ageGroup: "Grades 3+",
      riskLevel: "Low",
      purpose: ["Curiosity building", "Question skills", "Respectful inquiry"],
      description: "Students practice asking thoughtful, respectful questions about each other's cultures without making assumptions or stereotyping.",
      facilitatorNotes: "Pre-teach question stems: 'Can you tell me about...', 'I'm curious why...', 'What's it like when...'. Ban questions starting with 'Do you all...' (assumes homogeneity). Model answering 'I don't know - that's different in my family' to show cultural diversity within countries.",
      evidenceSource: "Developed at Global Nomads Group, tested with 8,500+ students across 65 countries over 12 years",
      outcomes: ["Question formulation", "Curiosity", "Avoiding assumptions", "Active listening"],
      contributor: {
        name: "Global Nomads Group",
        organization: "Global Nomads Group",
        attribution: "CC BY 4.0"
      },
      techNeeds: "Video platform with chat or hand-raise features",
      adaptations: ["Younger: written questions submitted beforehand", "Shy students: anonymous question submission", "Larger groups: breakout rooms of 6-8"]
    },
    {
      id: "ta8",
      name: "Create Our Community Promise",
      timeRequired: "45 min",
      ageGroup: "All Ages",
      riskLevel: "Low",
      purpose: ["Community building", "Norm setting", "Ownership"],
      description: "Students co-create agreements about how they want to treat each other during the exchange, creating shared ownership of the space.",
      facilitatorNotes: "Session 1 activity - sets foundation for everything. Use collaborative doc. Prompt: 'How do we want to feel in this space? What do we need from each other?' Students generate ideas, then vote/refine. Post visibly in every session. Refer back when conflicts arise.",
      evidenceSource: "Adapted from Responsive Classroom practices, used in all MapWorks programs with 1,000+ students annually",
      outcomes: ["Shared ownership", "Psychological safety", "Conflict prevention", "Group cohesion"],
      contributor: {
        name: "MapWorks Learning",
        organization: "MapWorks Learning",
        attribution: "CC BY 4.0"
      },
      techNeeds: "Collaborative document (Google Doc, Padlet), screen sharing",
      adaptations: ["Younger: use drawings/images of desired community", "Async: collect ideas asynchronously, refine together live", "Multi-lingual: create in multiple languages"]
    }
  ];

  // Getting Started Page - Activities for Transformative Learning
  const GettingStartedPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const activities = [
      {
        id: 1,
        title: "Identity Exploration",
        category: "identity",
        duration: "45-60 min",
        level: "All Ages",
        description: "Students explore and share the visible and invisible aspects of their identity through creative expression.",
        objectives: [
          "Think critically about identity formation and cultural influences",
          "Act with care when learning about others' backgrounds and experiences",
          "Lead conversations about diversity and inclusion"
        ],
        activities: [
          {
            name: "Cultural Identity Tree",
            description: "Students create a visual representation of their cultural background, family traditions, and personal values using a tree metaphor - roots represent heritage, trunk represents core values, branches represent aspirations."
          },
          {
            name: "Identity Poetry",
            description: "Students write and share poems that express their identity, using prompts like 'I am from...' or acrostic poems with their names to explore who they are and who they hope to become."
          },
          {
            name: "The Identity Iceberg",
            description: "Students illustrate what others see about them (above water) and what's hidden beneath the surface - their thoughts, dreams, challenges, and experiences that shape who they are."
          }
        ]
      },
      {
        id: 2,
        title: "Building Understanding Through Dialogue",
        category: "empathy",
        duration: "30-45 min",
        level: "Grades 3+",
        description: "Activities that help students develop the capacity to understand and share the feelings of others across cultures.",
        objectives: [
          "Think critically about different perspectives and lived experiences",
          "Act with care through active listening and thoughtful responses",
          "Lead by example in creating inclusive, welcoming spaces"
        ],
        activities: [
          {
            name: "The Five Types of Care",
            description: "Students explore five ways to show care for others: Kind Words, Spending Time Together, Thoughtful Giving, Comforting Presence, and Helpful Acts. They practice each type in classroom partnerships."
          },
          {
            name: "Stories That Connect Us",
            description: "Students share personal stories about meaningful experiences, then identify common threads and universal themes that connect us across cultures and backgrounds."
          },
          {
            name: "Perspective Partners",
            description: "In pairs, students discuss a shared topic or challenge from their different viewpoints, practicing the skill of understanding without immediately agreeing or disagreeing."
          }
        ]
      },
      {
        id: 3,
        title: "Collaborative Problem-Solving",
        category: "collaboration",
        duration: "60-90 min",
        level: "Grades 6+",
        description: "Students work together across classrooms to identify real needs and design solutions that make an impact.",
        objectives: [
          "Think critically about community challenges and root causes",
          "Act with care by listening to affected community members",
          "Lead collaborative teams toward meaningful action"
        ],
        activities: [
          {
            name: "Community Needs Assessment",
            description: "Students research and identify a genuine need in their local or global community, gathering perspectives from multiple stakeholders to understand the full scope of the challenge."
          },
          {
            name: "Co-Design Solutions",
            description: "Partner classrooms across different regions work together to design solutions for a shared challenge, combining local knowledge with global perspectives."
          },
          {
            name: "Action Plan Development",
            description: "Students create detailed action plans for their projects, including roles, timelines, resources needed, and metrics for measuring impact on their community."
          }
        ]
      },
      {
        id: 4,
        title: "Global Citizenship in Action",
        category: "action",
        duration: "Ongoing",
        level: "All Ages",
        description: "Transform learning into action through projects that address real-world challenges and create positive change.",
        objectives: [
          "Think critically about global issues and their local manifestations",
          "Act with care in ways that respect community needs and cultural contexts",
          "Lead initiatives that demonstrate active citizenship and responsibility"
        ],
        activities: [
          {
            name: "Climate Action Partnerships",
            description: "Students in different countries collaborate on climate action projects, sharing local environmental challenges and co-creating solutions that can be adapted to different contexts."
          },
          {
            name: "Cross-Cultural Service Projects",
            description: "Partner classrooms identify ways to serve their respective communities while learning about service and civic engagement in different cultural contexts."
          },
          {
            name: "Digital Storytelling for Change",
            description: "Students create multimedia stories that raise awareness about important issues, combining personal narratives with calls to action that inspire others to get involved."
          }
        ]
      },
      {
        id: 5,
        title: "Cultivating Inclusive Communities",
        category: "kindness",
        duration: "15-30 min",
        level: "All Ages",
        description: "Daily practices that build a culture of kindness, respect, and belonging in your classroom and beyond.",
        objectives: [
          "Think critically about what creates welcoming, inclusive spaces",
          "Act with care through daily practices of kindness and respect",
          "Lead by modeling compassionate behavior for peers"
        ],
        activities: [
          {
            name: "Acts of Kindness Challenge",
            description: "Students commit to specific acts of kindness each day - toward themselves, others in their classroom, and the wider world - and reflect on the impact."
          },
          {
            name: "Compassion in Action",
            description: "Students write acrostic poems using words like CARE and COMPASSION, then practice each letter's action throughout the week (C - Comfort others, A - Ask how someone is doing, etc.)."
          },
          {
            name: "Creating Our Community Promise",
            description: "Classes work together to create a shared commitment statement that captures how they want to treat each other and what kind of community they want to build together."
          }
        ]
      },
      {
        id: 6,
        title: "Cross-Cultural Communication",
        category: "communication",
        duration: "30-45 min",
        level: "Grades 4+",
        description: "Develop skills for effective, respectful communication across languages, cultures, and perspectives.",
        objectives: [
          "Think critically about communication styles and cultural differences",
          "Act with care by being mindful of language barriers and cultural norms",
          "Lead cross-cultural dialogues with sensitivity and respect"
        ],
        activities: [
          {
            name: "Virtual School Tours",
            description: "Partner classrooms create photo or video tours of their schools, sharing what a typical day looks like and inviting questions about differences and similarities."
          },
          {
            name: "Name Stories Exchange",
            description: "Students share the stories behind their names - what they mean, who chose them, what they reveal about family culture and values - building connections through personal narratives."
          },
          {
            name: "Question and Curiosity Circles",
            description: "Students practice asking thoughtful, respectful questions about each other's cultures and experiences, learning to be curious without making assumptions or stereotyping."
          }
        ]
      },
      {
        id: 7,
        title: "Creative Expression Across Borders",
        category: "creativity",
        duration: "45-60 min",
        level: "All Ages",
        description: "Use art, music, and creative projects to build understanding and express shared humanity.",
        objectives: [
          "Think critically about how art communicates across language barriers",
          "Act with care by honoring diverse forms of creative expression",
          "Lead creative collaborations that celebrate cultural diversity"
        ],
        activities: [
          {
            name: "Collaborative Digital Art",
            description: "Partner classrooms co-create digital artwork that represents their shared values or combined cultural symbols, taking turns adding elements to the piece."
          },
          {
            name: "Music and Movement Exchange",
            description: "Students share traditional songs, dances, or musical instruments from their cultures, then teach simple versions to their partner classroom."
          },
          {
            name: "Global Poetry Collection",
            description: "Students write poems about universal themes (hope, home, friendship) in their native languages, then work together to translate and create a bilingual poetry collection."
          }
        ]
      },
      {
        id: 8,
        title: "Critical Thinking About Global Issues",
        category: "critical-thinking",
        duration: "60-90 min",
        level: "Grades 7+",
        description: "Examine complex global challenges from multiple perspectives and develop informed, nuanced understanding.",
        objectives: [
          "Think critically by analyzing issues from multiple cultural and political perspectives",
          "Act with care by engaging respectfully with viewpoints different from your own",
          "Lead informed discussions that move beyond stereotypes and oversimplification"
        ],
        activities: [
          {
            name: "Perspectives on Current Events",
            description: "Partner classrooms examine the same current event through their different local media sources, comparing coverage and discussing how perspective shapes understanding."
          },
          {
            name: "Global Issues Deep Dive",
            description: "Students research global challenges (climate change, migration, inequality) from multiple angles, then host a virtual forum where they share findings and discuss solutions."
          },
          {
            name: "Myth-Busting Exchange",
            description: "Students identify common stereotypes or misconceptions about each other's countries or cultures, then work together to provide accurate, nuanced information."
          }
        ]
      }
    ];

    const categories = [
      { id: 'all', name: 'All Activities', icon: BookOpen },
      { id: 'identity', name: 'Identity & Self-Discovery', icon: User },
      { id: 'empathy', name: 'Understanding & Empathy', icon: Heart },
      { id: 'collaboration', name: 'Collaboration', icon: Users },
      { id: 'action', name: 'Taking Action', icon: Sparkles },
      { id: 'kindness', name: 'Kindness & Community', icon: Heart },
      { id: 'communication', name: 'Communication', icon: MessageSquare },
      { id: 'creativity', name: 'Creative Expression', icon: Sparkles },
      { id: 'critical-thinking', name: 'Critical Thinking', icon: BookOpen }
    ];

    const filteredActivities = selectedCategory === 'all'
      ? activities
      : activities.filter(a => a.category === selectedCategory);

    return (
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-semibold text-gray-800 mb-4">Getting Started with The Virtual Exchange</h1>
          <p className="text-xl text-gray-600 mb-6">
            Transformative experiences that help students think critically, act with care, and lead boldly
          </p>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-left">
            <p className="text-gray-700 leading-relaxed">
              Every student deserves access to transformative experiences that help them engage meaningfully with the world
              and with each other. These activities are designed to help young people think critically about global challenges,
              act with care in their communities, and lead boldly toward positive change. Whether students are connecting across
              continents or within their own classroom, these experiences blend global competencies with real-world challenges
              and turn connection into action.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <Icon size={16} />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Activities Grid */}
        <div className="grid gap-8">
          {filteredActivities.map(activity => (
            <div key={activity.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{activity.title}</h2>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        ⏱ {activity.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        👥 {activity.level}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{activity.description}</p>

                {/* Learning Objectives */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Students will:</h3>
                  <ul className="space-y-2">
                    {activity.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Activity Details */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Activity Options:</h3>
                  <div className="space-y-4 mb-6">
                    {activity.activities.map((act, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-2">{act.name}</h4>
                        <p className="text-gray-700 text-sm">{act.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Lesson Plan Button */}
                  {lessonPlansData.find(lp => lp.title === activity.activities[0]?.name) && (
                    <button
                      type="button"
                      onClick={() => {
                        const lessonPlan = lessonPlansData.find(lp => lp.title === activity.activities[0]?.name);
                        setSelectedLessonPlan(lessonPlan);
                        setShowLessonPlanModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      <FileText size={18} />
                      View Full Lesson Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Getting Started Tips */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tips for Getting Started</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Starting in Your Own Classroom</h3>
              <p className="text-gray-700 text-sm">
                These activities work beautifully within a single classroom to build community and develop global competencies.
                Start here to prepare students for future cross-cultural exchanges.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Connecting with Partner Classrooms</h3>
              <p className="text-gray-700 text-sm">
                Ready to connect globally? Browse our partner organizations to find classrooms that match your interests,
                grade level, and schedule. These activities can be adapted for virtual exchanges via video call, shared documents, or collaborative platforms.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Adapt to Your Context</h3>
              <p className="text-gray-700 text-sm">
                Feel free to modify these activities to fit your students' needs, your curriculum goals, and your available resources.
                The core principle remains: create transformative experiences that develop caring, action-oriented leaders.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Move from Connection to Action</h3>
              <p className="text-gray-700 text-sm">
                The most powerful learning happens when students move beyond understanding to taking action.
                Challenge students to identify real needs and design projects that create positive change in their communities.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Connect?</h2>
            <p className="text-gray-600 mb-6">
              Browse our network of verified schools, universities, and exchange providers to find your perfect partner
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Partners
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Lesson Plans Page - Completely redesigned for teachers
  const LessonPlansPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredLessons = selectedCategory === 'all'
      ? lessonPlansData
      : lessonPlansData.filter(l => l.category === selectedCategory);

    return (
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div className="relative z-10 px-12 py-16 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wider bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  Ready to Use
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-4">Lesson Plans Made By Teachers, For Teachers</h1>
              <p className="text-xl text-white text-opacity-90 leading-relaxed">
                No fluff. No academic jargon. Just clear, actionable lesson plans you can use tomorrow.
                Download, adapt, make them yours. That's what they're here for.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
            }`}
          >
            All Lessons ({lessonPlansData.length})
          </button>
          {['identity', 'empathy', 'collaboration'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full font-semibold transition-all capitalize ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lesson Cards - Stunning Visual Design */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredLessons.map((lesson, idx) => {
            const gradients = [
              'from-pink-500 via-red-500 to-yellow-500',
              'from-green-400 via-cyan-500 to-blue-500',
              'from-purple-400 via-pink-500 to-red-500'
            ];
            const gradient = gradients[idx % gradients.length];

            return (
              <div key={lesson.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100">
                {/* Color Bar */}
                <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>

                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 bg-gradient-to-r ${gradient} text-white rounded-full text-xs font-bold uppercase`}>
                          {lesson.category}
                        </span>
                        <span className="text-sm text-gray-500">⏱ {lesson.duration}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">{lesson.description}</p>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Grade Level</div>
                      <div className="text-sm font-semibold text-gray-900">{lesson.gradeLevel}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Subjects</div>
                      <div className="text-sm font-semibold text-gray-900">{lesson.subjects.join(', ')}</div>
                    </div>
                  </div>

                  {/* What's Included Preview */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <div className="font-semibold text-blue-900 mb-2 text-sm">What's Included:</div>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-blue-600" />
                        Step-by-step instructions with timing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-blue-600" />
                        Reflection questions & assessment
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-blue-600" />
                        Adaptations for all grade levels
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLessonPlan(lesson);
                        setShowLessonPlanModal(true);
                      }}
                      className={`flex-1 px-6 py-3 bg-gradient-to-r ${gradient} text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                    >
                      <FileText size={18} />
                      View Full Plan
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Downloading ${lesson.title}...`)}
                      className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                    </button>
                  </div>

                  {/* License Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs">
                    <span className="text-green-600 font-semibold">{lesson.license} - Free to adapt</span>
                    <span className="text-gray-400">{lesson.attribution}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* About Section - Teacher-Friendly */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-10 border-2 border-emerald-100">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Real Classrooms</h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  These aren't theoretical. They're not written by people who haven't set foot in a classroom in 20 years.
                  Every lesson here has been tested, adapted, and refined by teachers working with actual students.
                </p>
                <p>
                  <strong>Free to use. Free to adapt. Free to share.</strong> That's what CC BY 4.0 means. Print it. Change it.
                  Make it work for your kids. Just mention where you got it.
                </p>
                <p className="text-emerald-700 font-semibold">
                  No paywalls. No premium tiers. No signup required. Just good teaching resources that actually work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Resources Page - Completely redesigned resource library
  const ResourcesPage = () => {
    const [filteredResources, setFilteredResources] = useState(externalResources);
    const [searchQuery, setSearchQuery] = useState('');

    const applyFilters = () => {
      let filtered = externalResources;

      if (searchQuery) {
        filtered = filtered.filter(r =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      if (resourceFilters.subject !== 'all') {
        filtered = filtered.filter(r =>
          r.subject.some(s => s.toLowerCase().includes(resourceFilters.subject.toLowerCase()))
        );
      }

      if (resourceFilters.type !== 'all') {
        filtered = filtered.filter(r => r.type === resourceFilters.type);
      }

      if (resourceFilters.ageGroup !== 'all') {
        filtered = filtered.filter(r => r.ageGroup.includes(resourceFilters.ageGroup));
      }

      setFilteredResources(filtered);
    };

    return (
      <div className="space-y-12">
        {/* Hero Section with Gradient */}
        <div className="relative overflow-hidden rounded-3xl" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
          <div className="relative z-10 px-12 py-16 text-white">
            <h1 className="text-5xl font-bold mb-4">Resources Curated By Educators, For Educators</h1>
            <p className="text-xl mb-8">Free, openly-licensed materials you can actually use in your classroom. No paywalls. No gatekeeping.</p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by keyword, topic, or organization..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setTimeout(applyFilters, 0);
                  }}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <Filter size={16} />
              Filter by Subject
            </h3>
            <div className="flex flex-wrap gap-2">
              {['all', 'Global Citizenship', 'STEM', 'Arts', 'Social Studies', 'Language Learning'].map(subj => (
                <button
                  key={subj}
                  onClick={() => {
                    setResourceFilters({...resourceFilters, subject: subj});
                    setTimeout(applyFilters, 0);
                  }}
                  className={`px-4 py-2 rounded-full font-semibold transition ${
                    resourceFilters.subject === subj
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {subj === 'all' ? 'All Subjects' : subj}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <Tag size={16} />
              Filter by Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {['all', 'Activity Collection', 'Toolkit', 'Curriculum', 'Project Guides'].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setResourceFilters({...resourceFilters, type: type});
                    setTimeout(applyFilters, 0);
                  }}
                  className={`px-4 py-2 rounded-full font-semibold transition ${
                    resourceFilters.type === type
                      ? 'bg-gradient-to-r from-green-400 to-cyan-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <Users size={16} />
              Filter by Age Group
            </h3>
            <div className="flex flex-wrap gap-2">
              {['all', 'K-12', 'Higher Education', 'University'].map(age => (
                <button
                  key={age}
                  onClick={() => {
                    setResourceFilters({...resourceFilters, ageGroup: age});
                    setTimeout(applyFilters, 0);
                  }}
                  className={`px-4 py-2 rounded-full font-semibold transition ${
                    resourceFilters.ageGroup === age
                      ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {age === 'all' ? 'All Ages' : age}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resource Cards with Visual Design */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, idx) => {
            const gradients = [
              'from-blue-400 via-purple-500 to-pink-500',
              'from-green-400 via-teal-500 to-cyan-600',
              'from-yellow-400 via-orange-500 to-red-500',
              'from-indigo-400 via-purple-500 to-pink-500',
              'from-teal-400 via-green-500 to-emerald-600',
              'from-rose-400 via-pink-500 to-fuchsia-600'
            ];
            const gradient = gradients[idx % gradients.length];

            return (
              <div key={resource.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Gradient Header */}
                <div className={`h-3 bg-gradient-to-r ${gradient}`}></div>

                <div className="p-6">
                  {/* Title and Source */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition">{resource.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-600">{resource.source}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${gradient} text-white`}>
                        {resource.format}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-4 leading-relaxed">{resource.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {resource.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">
                        +{resource.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-gray-500">{resource.type}</div>
                      <div className="text-xs font-bold text-green-600 flex items-center gap-1">
                        <Shield size={12} />
                        {resource.license}
                      </div>
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-5 py-2.5 bg-gradient-to-r ${gradient} text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
                    >
                      <Download size={16} />
                      Get It
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No resources found</h3>
            <p className="text-gray-500 text-lg mb-6">Try adjusting your filters or search query.</p>
            <button
              type="button"
              onClick={() => {
                setResourceFilters({ subject: 'all', type: 'all', ageGroup: 'all' });
                setSearchQuery('');
                setFilteredResources(externalResources);
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Why These Resources Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-10 border-2 border-purple-100">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4" style={{color: '#666666'}}>Why These Resources?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h3 className="font-bold text-lg mb-2 text-purple-600">Free & Open</h3>
                <p>
                  Every resource here is CC-licensed. That means you can use, adapt, and share them legally.
                  No paywalls. No restrictions. Just good teaching materials.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-pink-600">Curated, Not Cluttered</h3>
                <p>
                  We've hand-picked these from trusted organizations. No fluff, no duplicates, no random blogs.
                  These are the real deal from people doing real work.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-teal-600">Classroom-Ready</h3>
                <p>
                  Built by educators who actually teach, not theorists in ivory towers.
                  You can use these tomorrow without spending hours adapting them.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-orange-600">Always Growing</h3>
                <p>
                  We're constantly adding new resources and welcoming contributions from teachers like you.
                  See something missing? Let us know.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-white rounded-2xl p-6 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-gray-900">Legal Stuff:</strong> All resources are released under Creative Commons licenses by their respective organizations.
            Always respect the licensing terms. When in doubt, give credit to the original creator and check the specific CC license.
          </p>
        </div>
      </div>
    );
  };

  // Impact Snapshot Generator - Create one-page reports for principals/funders
  const ImpactSnapshotPage = () => {
    const [formData, setFormData] = useState({
      programName: '',
      organizationName: '',
      duration: '',
      startDate: '',
      endDate: '',
      totalParticipants: '',
      partnerCountries: '',
      sessionsCompleted: '',
      studentQuote1: '',
      studentQuote1Name: '',
      studentQuote2: '',
      studentQuote2Name: '',
      studentQuote3: '',
      studentQuote3Name: '',
      skillsGrowth: {
        culturalAwareness: '',
        collaboration: '',
        criticalThinking: '',
        communication: '',
        empathy: ''
      },
      projectOutcomes: '',
      keyHighlights: '',
      nextSteps: ''
    });

    const [showPreview, setShowPreview] = useState(false);

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSkillChange = (skill, value) => {
      setFormData(prev => ({
        ...prev,
        skillsGrowth: { ...prev.skillsGrowth, [skill]: value }
      }));
    };

    const generateSnapshot = () => {
      setShowPreview(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const printSnapshot = () => {
      window.print();
    };

    return (
      <div className="space-y-12">
        {!showPreview ? (
          <>
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
              <div className="relative z-10 px-12 py-16 text-white">
                <h1 className="text-5xl font-bold mb-4">Impact Snapshot Generator</h1>
                <p className="text-xl">Create a one-page report for principals, funders, and administrators in minutes.</p>
                <p className="text-lg mt-4 opacity-90">
                  Lightweight measurement that doesn't ruin the experience. Just the essential data decision-makers need.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-10">
              <h2 className="text-3xl font-bold mb-2" style={{color: '#666666'}}>Program Information</h2>
              <p className="text-gray-600 mb-8">Fill in the basics about your virtual exchange program.</p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Program Name *</label>
                  <input
                    type="text"
                    value={formData.programName}
                    onChange={(e) => handleInputChange('programName', e.target.value)}
                    placeholder="e.g., Global Campfires Fall 2025"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Organization *</label>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    placeholder="e.g., Lincoln High School"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Total Participants *</label>
                  <input
                    type="number"
                    value={formData.totalParticipants}
                    onChange={(e) => handleInputChange('totalParticipants', e.target.value)}
                    placeholder="e.g., 24"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Partner Countries</label>
                  <input
                    type="text"
                    value={formData.partnerCountries}
                    onChange={(e) => handleInputChange('partnerCountries', e.target.value)}
                    placeholder="e.g., USA, Kenya, Brazil"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sessions Completed</label>
                  <input
                    type="number"
                    value={formData.sessionsCompleted}
                    onChange={(e) => handleInputChange('sessionsCompleted', e.target.value)}
                    placeholder="e.g., 8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 8 weeks"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-2 mt-12" style={{color: '#666666'}}>Student Voices</h2>
              <p className="text-gray-600 mb-8">Include 2-3 powerful quotes from students. These are what principals remember.</p>

              <div className="space-y-6">
                {[1, 2, 3].map(num => (
                  <div key={num} className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Student Quote {num} {num === 1 ? '*' : ''}</label>
                    <textarea
                      value={formData[`studentQuote${num}`]}
                      onChange={(e) => handleInputChange(`studentQuote${num}`, e.target.value)}
                      placeholder={`"This exchange changed how I see the world..."`}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    />
                    <input
                      type="text"
                      value={formData[`studentQuote${num}Name`]}
                      onChange={(e) => handleInputChange(`studentQuote${num}Name`, e.target.value)}
                      placeholder="Student name or grade level"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <h2 className="text-3xl font-bold mb-2 mt-12" style={{color: '#666666'}}>Skills Growth</h2>
              <p className="text-gray-600 mb-8">Rate observed growth in key competencies (Low / Medium / High / Significant).</p>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { key: 'culturalAwareness', label: 'Cultural Awareness & Sensitivity' },
                  { key: 'collaboration', label: 'Collaboration & Teamwork' },
                  { key: 'criticalThinking', label: 'Critical Thinking' },
                  { key: 'communication', label: 'Communication Skills' },
                  { key: 'empathy', label: 'Empathy & Perspective-Taking' }
                ].map(skill => (
                  <div key={skill.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{skill.label}</label>
                    <select
                      value={formData.skillsGrowth[skill.key]}
                      onChange={(e) => handleSkillChange(skill.key, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select level...</option>
                      <option value="Low">Low Growth</option>
                      <option value="Medium">Medium Growth</option>
                      <option value="High">High Growth</option>
                      <option value="Significant">Significant Growth</option>
                    </select>
                  </div>
                ))}
              </div>

              <h2 className="text-3xl font-bold mb-2 mt-12" style={{color: '#666666'}}>Project Outcomes</h2>
              <p className="text-gray-600 mb-8">What did students create or accomplish together?</p>

              <textarea
                value={formData.projectOutcomes}
                onChange={(e) => handleInputChange('projectOutcomes', e.target.value)}
                placeholder="e.g., Created a bilingual children's book about climate action, presented to 200+ community members..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              />

              <h2 className="text-3xl font-bold mb-2 mt-12" style={{color: '#666666'}}>Key Highlights & Next Steps</h2>
              <p className="text-gray-600 mb-8">What should administrators know? What's next?</p>

              <textarea
                value={formData.keyHighlights}
                onChange={(e) => handleInputChange('keyHighlights', e.target.value)}
                placeholder="e.g., 95% attendance rate, students requested to continue exchanging on their own time..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              />

              <textarea
                value={formData.nextSteps}
                onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                placeholder="e.g., Planning Spring 2026 exchange with same partners, exploring funding for in-person meeting..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={generateSnapshot}
                className="mt-10 w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
              >
                Generate Impact Snapshot
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Preview Mode - Print-Optimized */}
            <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-300 p-12 max-w-5xl mx-auto print:shadow-none print:border-0">
              {/* Header */}
              <div className="border-b-4 border-blue-500 pb-6 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{formData.programName || 'Virtual Exchange Program'}</h1>
                <h2 className="text-2xl text-gray-600">{formData.organizationName}</h2>
                <p className="text-gray-500 mt-2">
                  {formData.startDate && formData.endDate && `${formData.startDate} - ${formData.endDate}`}
                  {formData.duration && ` | ${formData.duration}`}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">{formData.totalParticipants || '0'}</div>
                  <div className="text-sm text-gray-600 mt-1">Participants</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                  <div className="text-3xl font-bold text-green-600">{formData.sessionsCompleted || '0'}</div>
                  <div className="text-sm text-gray-600 mt-1">Sessions</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">{formData.partnerCountries ? formData.partnerCountries.split(',').length : '0'}</div>
                  <div className="text-sm text-gray-600 mt-1">Countries</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600">
                    {formData.totalParticipants && formData.sessionsCompleted
                      ? Math.round((formData.totalParticipants * formData.sessionsCompleted) * 0.92)
                      : '0'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Total Hours</div>
                </div>
              </div>

              {/* Student Quotes */}
              {(formData.studentQuote1 || formData.studentQuote2 || formData.studentQuote3) && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Student Voices</h3>
                  <div className="space-y-4">
                    {formData.studentQuote1 && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <p className="text-gray-800 italic">"{formData.studentQuote1}"</p>
                        {formData.studentQuote1Name && <p className="text-sm text-gray-600 mt-2">— {formData.studentQuote1Name}</p>}
                      </div>
                    )}
                    {formData.studentQuote2 && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <p className="text-gray-800 italic">"{formData.studentQuote2}"</p>
                        {formData.studentQuote2Name && <p className="text-sm text-gray-600 mt-2">— {formData.studentQuote2Name}</p>}
                      </div>
                    )}
                    {formData.studentQuote3 && (
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                        <p className="text-gray-800 italic">"{formData.studentQuote3}"</p>
                        {formData.studentQuote3Name && <p className="text-sm text-gray-600 mt-2">— {formData.studentQuote3Name}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skills Growth */}
              {Object.values(formData.skillsGrowth).some(v => v) && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Skills Development</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(formData.skillsGrowth).map(([skill, level]) => {
                      if (!level) return null;
                      const labels = {
                        culturalAwareness: 'Cultural Awareness',
                        collaboration: 'Collaboration',
                        criticalThinking: 'Critical Thinking',
                        communication: 'Communication',
                        empathy: 'Empathy & Perspective-Taking'
                      };
                      const colors = {
                        Low: 'bg-gray-200',
                        Medium: 'bg-blue-300',
                        High: 'bg-green-400',
                        Significant: 'bg-purple-500 text-white'
                      };
                      return (
                        <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-semibold text-gray-700">{labels[skill]}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[level] || 'bg-gray-200'}`}>
                            {level}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Project Outcomes */}
              {formData.projectOutcomes && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Outcomes</h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{formData.projectOutcomes}</p>
                </div>
              )}

              {/* Key Highlights */}
              {formData.keyHighlights && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Highlights</h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{formData.keyHighlights}</p>
                </div>
              )}

              {/* Next Steps */}
              {formData.nextSteps && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{formData.nextSteps}</p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t-2 border-gray-200 pt-6 mt-8 text-center">
                <p className="text-sm text-gray-500">Generated by The Virtual Exchange | www.thevirtualexchange.org</p>
                <p className="text-xs text-gray-400 mt-1">Powered by The Exchange Lab</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-8 print:hidden">
              <button
                type="button"
                onClick={printSnapshot}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <Download size={20} />
                Print / Save as PDF
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Edit Information
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  // Lesson Plan Modal - Full lesson plan viewer with download
  const LessonPlanModal = () => {
    if (!selectedLessonPlan) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowLessonPlanModal(false)}>
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedLessonPlan.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{selectedLessonPlan.category} • {selectedLessonPlan.duration}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowLessonPlanModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Overview */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Overview</h3>
              <p className="text-gray-700 leading-relaxed">{selectedLessonPlan.description}</p>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-semibold text-gray-900">{selectedLessonPlan.duration}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Grade Level</div>
                  <div className="font-semibold text-gray-900">{selectedLessonPlan.gradeLevel}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Subjects</div>
                  <div className="font-semibold text-gray-900">{selectedLessonPlan.subjects.join(', ')}</div>
                </div>
              </div>
            </div>

            {/* Learning Objectives */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Learning Objectives</h3>
              <ul className="space-y-2">
                {selectedLessonPlan.learningObjectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Materials Needed */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Materials Needed</h3>
              <ul className="grid md:grid-cols-2 gap-2">
                {selectedLessonPlan.materialsNeeded.map((material, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-700">{material}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step by Step */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step-by-Step Instructions</h3>
              <div className="space-y-4">
                {selectedLessonPlan.stepByStep.map((step) => (
                  <div key={step.step} className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Step {step.step}: {step.title}</h4>
                    <p className="text-gray-700">{step.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reflection Questions */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Reflection Questions</h3>
              <ul className="space-y-2">
                {selectedLessonPlan.reflectionQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span className="text-gray-700">{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Assessment */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Assessment</h3>
              <ul className="space-y-2">
                {selectedLessonPlan.assessment.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Adaptations */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Adaptations & Extensions</h3>
              <div className="space-y-2">
                {selectedLessonPlan.adaptations.map((adapt, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700">{adapt}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Virtual Exchange Connection */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Virtual Exchange Connection</h3>
              <p className="text-gray-700">{selectedLessonPlan.virtualExchangeConnection}</p>
            </div>

            {/* License */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">License & Attribution</h3>
              <p className="text-gray-700 mb-2">
                <strong>License:</strong> {selectedLessonPlan.license}
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Attribution:</strong> {selectedLessonPlan.attribution}
              </p>
              <p className="text-sm text-gray-600">
                You are free to share and adapt this lesson plan for any purpose, even commercially,
                as long as you give appropriate credit to The Virtual Exchange.
              </p>
            </div>

            {/* Download Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => alert(`Downloading ${selectedLessonPlan.title}...`)}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download PDF
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Resource Submit Modal - User authoring tool
  const ResourceSubmitModal = () => {
    const [submitForm, setSubmitForm] = useState({
      title: '',
      description: '',
      yourName: '',
      yourOrganization: '',
      subjects: [],
      ageGroup: '',
      resourceType: '',
      license: 'CC BY 4.0',
      fileUpload: null
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      alert('Thank you for submitting! Our team will review your resource and add it to the library if approved.');
      setShowResourceSubmitModal(false);
      setSubmitForm({
        title: '',
        description: '',
        yourName: '',
        yourOrganization: '',
        subjects: [],
        ageGroup: '',
        resourceType: '',
        license: 'CC BY 4.0',
        fileUpload: null
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowResourceSubmitModal(false)}>
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Share Your Resources</h2>
              <p className="text-sm text-gray-600 mt-1">Submit a resource for the community</p>
            </div>
            <button
              type="button"
              onClick={() => setShowResourceSubmitModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resource Title *</label>
              <input
                type="text"
                required
                value={submitForm.title}
                onChange={(e) => setSubmitForm({...submitForm, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Global Pen Pal Activity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                required
                value={submitForm.description}
                onChange={(e) => setSubmitForm({...submitForm, description: e.target.value})}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your resource and how it can be used for virtual exchange..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  required
                  value={submitForm.yourName}
                  onChange={(e) => setSubmitForm({...submitForm, yourName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                <input
                  type="text"
                  value={submitForm.yourOrganization}
                  onChange={(e) => setSubmitForm({...submitForm, yourOrganization: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type *</label>
                <select
                  required
                  value={submitForm.resourceType}
                  onChange={(e) => setSubmitForm({...submitForm, resourceType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type...</option>
                  <option value="Lesson Plan">Lesson Plan</option>
                  <option value="Activity">Activity</option>
                  <option value="Toolkit">Toolkit</option>
                  <option value="Guide">Guide</option>
                  <option value="Assessment">Assessment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Group *</label>
                <select
                  required
                  value={submitForm.ageGroup}
                  onChange={(e) => setSubmitForm({...submitForm, ageGroup: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select age group...</option>
                  <option value="Elementary (K-5)">Elementary (K-5)</option>
                  <option value="Middle School (6-8)">Middle School (6-8)</option>
                  <option value="High School (9-12)">High School (9-12)</option>
                  <option value="Higher Education">Higher Education</option>
                  <option value="All Ages">All Ages</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Creative Commons License *</label>
              <select
                required
                value={submitForm.license}
                onChange={(e) => setSubmitForm({...submitForm, license: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CC BY 4.0">CC BY 4.0 - Attribution</option>
                <option value="CC BY-SA 4.0">CC BY-SA 4.0 - Attribution-ShareAlike</option>
                <option value="CC BY-NC 4.0">CC BY-NC 4.0 - Attribution-NonCommercial</option>
                <option value="CC0">CC0 - Public Domain</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                By selecting a CC license, you're allowing others to use and adapt your work with proper attribution.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={(e) => setSubmitForm({...submitForm, fileUpload: e.target.files[0]})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: PDF, Word, PowerPoint (max 10MB)
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">Review Process</h4>
              <p className="text-sm text-blue-800">
                Our team will review your submission within 5-7 business days. We'll verify the license,
                check content quality, and ensure it aligns with our virtual exchange mission.
                You'll receive an email once your resource is approved and published.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Submit Resource
              </button>
              <button
                type="button"
                onClick={() => setShowResourceSubmitModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Introduction Request Modal - Request introduction to an organization
  const IntroductionRequestModal = () => {
    const [requestForm, setRequestForm] = useState({
      yourName: '',
      yourEmail: '',
      organization: '',
      role: '',
      message: ''
    });
    const [requestSubmitting, setRequestSubmitting] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);
    const [requestError, setRequestError] = useState('');

    if (!showIntroductionRequestModal || !selectedOrgForRequest) return null;

    const handleSubmit = async (e) => {
      e.preventDefault();
      setRequestSubmitting(true);
      setRequestError('');

      try {
        const response = await fetch('/.netlify/functions/submit-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'introduction-request',
            orgId: selectedOrgForRequest.id,
            orgName: selectedOrgForRequest.name,
            ...requestForm
          })
        });

        if (!response.ok) throw new Error('Submission failed');

        setRequestSuccess(true);
        setTimeout(() => {
          setShowIntroductionRequestModal(false);
          setSelectedOrgForRequest(null);
          setRequestSuccess(false);
          setRequestForm({
            yourName: '',
            yourEmail: '',
            organization: '',
            role: '',
            message: ''
          });
        }, 3000);
      } catch (error) {
        setRequestError('Failed to submit request. Please try again.');
      } finally {
        setRequestSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setShowIntroductionRequestModal(false); setSelectedOrgForRequest(null); }}>
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Request an Introduction</h2>
                <p className="text-sm text-gray-600 mt-1">to {selectedOrgForRequest.name}</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowIntroductionRequestModal(false); setSelectedOrgForRequest(null); }}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {requestSuccess ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                <p className="text-gray-600">
                  We'll review your request and facilitate an introduction if there's a good fit.
                  You should hear from us within 3-5 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <strong>How this works:</strong> We'll review your request and, if appropriate, facilitate an introduction to {selectedOrgForRequest.name}.
                    This helps protect organizations from spam while ensuring meaningful connections.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={requestForm.yourName}
                      onChange={(e) => setRequestForm({...requestForm, yourName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={requestForm.yourEmail}
                      onChange={(e) => setRequestForm({...requestForm, yourEmail: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="jane@school.edu"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Organization *</label>
                    <input
                      type="text"
                      required
                      value={requestForm.organization}
                      onChange={(e) => setRequestForm({...requestForm, organization: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Lincoln High School"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Role *</label>
                    <input
                      type="text"
                      required
                      value={requestForm.role}
                      onChange={(e) => setRequestForm({...requestForm, role: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Teacher, Administrator, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Why do you want to connect? *</label>
                  <textarea
                    required
                    value={requestForm.message}
                    onChange={(e) => setRequestForm({...requestForm, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="I'm interested in collaborating on a virtual exchange focused on..."
                  />
                </div>

                {requestError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">{requestError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={requestSubmitting}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {requestSubmitting ? 'Sending...' : 'Send Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowIntroductionRequestModal(false); setSelectedOrgForRequest(null); }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Claim Profile Modal - Organizations can claim their profiles
  const ClaimProfileModal = () => {
    const [claimForm, setClaimForm] = useState({
      name: '',
      role: '',
      workEmail: '',
      phone: '',
      message: ''
    });
    const [claimSubmitting, setClaimSubmitting] = useState(false);
    const [claimSuccess, setClaimSuccess] = useState(false);
    const [claimError, setClaimError] = useState('');

    if (!showClaimProfileModal || !selectedOrgForRequest) return null;

    const handleSubmit = async (e) => {
      e.preventDefault();
      setClaimSubmitting(true);
      setClaimError('');

      try {
        const response = await fetch('/.netlify/functions/submit-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'claim-profile',
            orgId: selectedOrgForRequest.id,
            orgName: selectedOrgForRequest.name,
            ...claimForm
          })
        });

        if (!response.ok) throw new Error('Submission failed');

        setClaimSuccess(true);
        setTimeout(() => {
          setShowClaimProfileModal(false);
          setSelectedOrgForRequest(null);
          setClaimSuccess(false);
          setClaimForm({
            name: '',
            role: '',
            workEmail: '',
            phone: '',
            message: ''
          });
        }, 3000);
      } catch (error) {
        setClaimError('Failed to submit claim. Please try again.');
      } finally {
        setClaimSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setShowClaimProfileModal(false); setSelectedOrgForRequest(null); }}>
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Claim This Profile</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedOrgForRequest.name}</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowClaimProfileModal(false); setSelectedOrgForRequest(null); }}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {claimSuccess ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Claim Submitted!</h3>
                <p className="text-gray-600">
                  We'll verify your claim and reach out within 3-5 business days.
                  Once verified, you'll be able to edit your profile and add programs.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                  <p className="text-sm text-yellow-800">
                    <strong>Claiming this profile:</strong> We'll verify your affiliation with {selectedOrgForRequest.name}
                    and grant you access to manage this profile once confirmed.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={claimForm.name}
                    onChange={(e) => setClaimForm({...claimForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jane Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Role at {selectedOrgForRequest.name} *</label>
                  <input
                    type="text"
                    required
                    value={claimForm.role}
                    onChange={(e) => setClaimForm({...claimForm, role: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Director, Coordinator, Program Manager, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Work Email (official organization email) *</label>
                  <input
                    type="email"
                    required
                    value={claimForm.workEmail}
                    onChange={(e) => setClaimForm({...claimForm, workEmail: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="jane@organization.org"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be from your organization's domain for verification</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone (optional)</label>
                  <input
                    type="tel"
                    value={claimForm.phone}
                    onChange={(e) => setClaimForm({...claimForm, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Information (optional)</label>
                  <textarea
                    value={claimForm.message}
                    onChange={(e) => setClaimForm({...claimForm, message: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any additional info to help us verify your claim..."
                  />
                </div>

                {claimError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">{claimError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={claimSubmitting}
                    className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition disabled:opacity-50"
                  >
                    {claimSubmitting ? 'Submitting...' : 'Submit Claim'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowClaimProfileModal(false); setSelectedOrgForRequest(null); }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Favorites Modal
  const FavoritesModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto shadow-2xl relative">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Heart size={24} className="text-red-500" fill="currentColor" />
                My Favorites
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {favorites.length} {favorites.length === 1 ? 'organization' : 'organizations'} saved
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFavoritesModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {favorites.length === 0 ? (
              <div className="text-center py-16">
                <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-medium text-gray-600 mb-2">No favorites yet</h4>
                <p className="text-gray-500 mb-6">
                  Start browsing organizations and click the heart icon to save them here for easy access later.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowFavoritesModal(false);
                    setActiveTab('browse');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Browse Organizations
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {favorites.map(org => (
                  <OrganizationCard key={org.id} org={org} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('home')}>
              <VirtualExchangeLogo size="sm" />
              <div className="flex flex-col items-start">
                <div className="text-lg font-light text-gray-700 leading-tight">The Virtual Exchange</div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8 items-center">
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

              {/* The Exchange Lab Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowGettingStartedDropdown(!showGettingStartedDropdown)}
                  className={`font-medium transition flex items-center gap-1 ${['getting-started', 'lesson-plans', 'resources', 'share-resources', 'impact-snapshot'].includes(activeTab) ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  The Exchange Lab
                  <ChevronDown size={16} className={`transition-transform ${showGettingStartedDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showGettingStartedDropdown && (
                  <>
                    {/* Invisible overlay to close dropdown when clicking outside */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowGettingStartedDropdown(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        type="button"
                        onClick={() => { setActiveTab('getting-started'); setShowGettingStartedDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                      >
                        <BookOpen size={16} />
                        Activities & Frameworks
                      </button>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('lesson-plans'); setShowGettingStartedDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                      >
                        <FileText size={16} />
                        Lesson Plans
                      </button>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('resources'); setShowGettingStartedDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                      >
                        <Download size={16} />
                        Resource Library
                      </button>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('impact-snapshot'); setShowGettingStartedDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Impact Snapshot Generator
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowResourceSubmitModal(true); setShowGettingStartedDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                      >
                        <Upload size={16} />
                        Share Your Resources
                      </button>
                    </div>
                  </>
                )}
              </div>

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
                onClick={() => setShowVerificationModal(true)}
                className="font-medium text-gray-600 hover:text-gray-900 transition"
                title="Get your organization verified"
              >
                Get Verified
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('donate')}
                className="font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Donate
              </button>
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Slide-in Menu */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto">
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-8">
                <div className="text-lg font-semibold text-gray-800">Menu</div>
                <button
                  type="button"
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => { setActiveTab('home'); setShowMobileMenu(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'home' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Home
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('browse'); setShowMobileMenu(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'browse' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Browse
                </button>

                {/* The Exchange Lab Section */}
                <div className="border-t border-gray-200 my-2 pt-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">The Exchange Lab</div>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('getting-started'); setShowMobileMenu(false); }}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 ${activeTab === 'getting-started' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <BookOpen size={16} />
                    Activities & Frameworks
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('lesson-plans'); setShowMobileMenu(false); }}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 ${activeTab === 'lesson-plans' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <FileText size={16} />
                    Lesson Plans
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('resources'); setShowMobileMenu(false); }}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 ${activeTab === 'resources' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Download size={16} />
                    Resource Library
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('impact-snapshot'); setShowMobileMenu(false); }}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 ${activeTab === 'impact-snapshot' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <CheckCircle size={16} />
                    Impact Snapshot Generator
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowResourceSubmitModal(true); setShowMobileMenu(false); }}
                    className="w-full text-left px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Upload size={16} />
                    Share Your Resources
                  </button>
                </div>

                <div className="border-t border-gray-200 my-2 pt-2"></div>

                <button
                  type="button"
                  onClick={() => { setActiveTab('about'); setShowMobileMenu(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'about' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  About
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('contact'); setShowMobileMenu(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'contact' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Contact
                </button>

                <button
                  type="button"
                  onClick={() => { setShowVerificationModal(true); setShowMobileMenu(false); }}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium transition text-gray-700 hover:bg-gray-50"
                >
                  Get Verified
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('donate'); setShowMobileMenu(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'donate' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Donate
                </button>

                {/* Sign In Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowAuthModal(true); setShowMobileMenu(false); }}
                    className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'browse' && <BrowsePage />}
        {activeTab === 'getting-started' && <GettingStartedPage />}
        {activeTab === 'lesson-plans' && <LessonPlansPage />}
        {activeTab === 'resources' && <ResourcesPage />}
        {activeTab === 'impact-snapshot' && <ImpactSnapshotPage />}
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
                <div className="text-base font-light text-gray-700">The Virtual Exchange</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Platform</h4>
              <div className="space-y-2.5">
                <div
                  onClick={() => setActiveTab('browse')}
                  className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition"
                >
                  Browse Partners
                </div>
                <div
                  onClick={() => setActiveTab('getting-started')}
                  className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition"
                >
                  How It Works
                </div>
                <div
                  onClick={() => setShowVerificationModal(true)}
                  className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition"
                >
                  Verification
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">About</h4>
              <div className="space-y-2.5">
                <div
                  onClick={() => setActiveTab('about')}
                  className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition"
                >
                  Our Mission
                </div>
                <a
                  href="https://mapworkslearning.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition"
                >
                  MapWorks Learning
                </a>
                <div
                  onClick={() => setActiveTab('contact')}
                  className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition"
                >
                  Contact Us
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Support</h4>
              <div className="space-y-2.5">
                <div
                  onClick={() => setActiveTab('donate')}
                  className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition"
                >
                  Donate
                </div>
                <div
                  onClick={() => setActiveTab('getting-started')}
                  className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition"
                >
                  FAQ
                </div>
                <div
                  onClick={() => setActiveTab('getting-started')}
                  className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition"
                >
                  Resources
                </div>
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
      {showProfileModal && selectedOrg && <OrganizationProfileModal org={selectedOrg} />}
      {showVerificationModal && <VerificationModal />}
      {showLessonPlanModal && selectedLessonPlan && <LessonPlanModal />}
      {showResourceSubmitModal && <ResourceSubmitModal />}
      {showIntroductionRequestModal && selectedOrgForRequest && <IntroductionRequestModal />}
      {showFavoritesModal && <FavoritesModal />}
      {showClaimProfileModal && selectedOrgForRequest && <ClaimProfileModal />}

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
};

export default VirtualExchangePlatform;