import React, { useState, useRef, useEffect } from 'react';
import { Globe, Users, School, MessageSquare, Search, Filter, CheckCircle, X, Heart, Building, GraduationCap, BookOpen, Sparkles, Shield, Mail, Lock, User, ChevronDown, Download, Upload, FileText, Tag, Menu } from 'lucide-react';
import { supabase } from './supabaseClient';
import imageCompression from 'browser-image-compression';
import { hardcodedOrganizations } from './data/organizations';

const VirtualExchangePlatform = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [registrationStep, setRegistrationStep] = useState(1);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [aiSearchQuery, setAiSearchQuery] = useState('');
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
  const [showEditOrgModal, setShowEditOrgModal] = useState(false);
  const [showNewUserWelcome, setShowNewUserWelcome] = useState(false);
  const [editOrgForm, setEditOrgForm] = useState({
    description: '', website: '', email: '', phone: '',
    capacity: '', languages: '', interests: '', partnershipGoals: ''
  });
  const [editOrgSubmitting, setEditOrgSubmitting] = useState(false);
  const [editOrgError, setEditOrgError] = useState('');
  const [selectedOrgForRequest, setSelectedOrgForRequest] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('userFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  // Sign in form state
  const [signinForm, setSigninForm] = useState({
    email: '',
    password: ''
  });
  const [signinSubmitting, setSigninSubmitting] = useState(false);
  const [signinError, setSigninError] = useState('');

  // Authentication & Database State
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [organizationsFromDB, setOrganizationsFromDB] = useState([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [snapshotPrefill, setSnapshotPrefill] = useState(null);
  const [funderToken, setFunderToken] = useState(null);

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

  const checkAdminStatus = async (userId) => {
    if (!userId) { setIsAdmin(false); return; }
    const { data } = await supabase.from('profiles').select('is_admin').eq('id', userId).single();
    setIsAdmin(!!data?.is_admin);
  };

  const refreshUnreadCount = async (userId) => {
    if (!userId) { setUnreadMessageCount(0); return; }
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .is('read_at', null);
    setUnreadMessageCount(count || 0);
  };

  // Load user session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const u = session?.user ?? null;
      setUser(u);
      setAvatarUrl(u?.user_metadata?.avatar_url ?? null);
      checkAdminStatus(u?.id ?? null);
      refreshUnreadCount(u?.id ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      const u = session?.user ?? null;
      setUser(u);
      setAvatarUrl(u?.user_metadata?.avatar_url ?? null);
      checkAdminStatus(u?.id ?? null);
      refreshUnreadCount(u?.id ?? null);
      // Show welcome prompt for first-time OAuth signups
      if (event === 'SIGNED_IN' && u?.app_metadata?.provider !== 'email') {
        const isNew = !localStorage.getItem(`welcomed_${u.id}`);
        if (isNew) {
          localStorage.setItem(`welcomed_${u.id}`, '1');
          setShowNewUserWelcome(true);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoadingOrganizations(true);
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('approval_status', 'approved')
        .order('name');

      if (error) throw error;

      const transformed = data.map(org => ({
        id: org.id,
        name: org.name,
        type: org.type,
        category: org.category,
        country: org.country,
        region: org.region,
        description: org.description,
        languages: org.languages || [],
        interests: org.interests || [],
        capacity: org.capacity,
        email: org.email,
        phone: org.phone,
        verified: org.verified || false,
        website: org.website,
        partnershipGoals: org.partnership_goals || [],
        programs: typeof org.programs === 'string' ? JSON.parse(org.programs) : org.programs,
        claimed: org.claimed || false,
        claimed_by: org.claimed_by || null
      }));

      setOrganizationsFromDB(transformed);
    } catch (error) {
      console.error('Error loading organizations:', error);
      setOrganizationsFromDB([]);
    } finally {
      setLoadingOrganizations(false);
    }
  };

  useEffect(() => { loadOrganizations(); }, []);
  useEffect(() => { if (activeTab === 'browse') loadOrganizations(); }, [activeTab]);

  // Detect funder token in URL on mount (?funder=TOKEN)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('funder');
    if (t) { setFunderToken(t); setActiveTab('funder-journey'); }
  }, []);


  // Organizations come from the DB. The hardcodedOrganizations module is now
  // only used to seed the DB on first deploy (see scripts/generate-seed-sql.js).
  const organizations = (!loadingOrganizations && organizationsFromDB.length > 0)
    ? organizationsFromDB
    : hardcodedOrganizations;

  // The current user's claimed org (if any)
  const myOrg = user ? organizations.find(o => o.claimed_by === user.id) : null;

  const openMyOrg = () => {
    if (!myOrg) return;
    setSelectedOrg(myOrg);
    setShowProfileModal(true);
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  // Search handler: word-by-word match across every org field
  const handleAISearch = () => {
    const query = aiSearchRef.current?.value || '';
    if (!query.trim()) return;

    // Split into meaningful words (skip short stop words)
    const stopWords = new Set(['the','and','for','with','that','this','from','have','are','was','were','they','their','what','when','where','who','will','can','not','but','has','had','been','would','could','should','into','onto','about','like','just','some','more','also','than','then','our','your','its','all','any','one','two','how','why','which']);
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));

    if (words.length === 0) return;

    const scoredResults = organizations
      .map(org => {
        // Build a flat searchable string from every field
        const haystack = [
          org.name,
          org.description,
          org.type,
          org.category,
          org.country,
          org.region,
          org.email,
          org.website,
          ...(org.languages || []),
          ...(org.interests || []),
          ...(org.partnershipGoals || []),
          ...(Array.isArray(org.programs)
            ? org.programs.flatMap(p => [p.name, p.description, p.subject, p.duration])
            : [])
        ].filter(Boolean).join(' ').toLowerCase();

        let score = 0;
        words.forEach(word => {
          // Exact word boundary match scores higher than substring
          const boundary = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
          if (boundary.test(haystack)) {
            score += 3;
          } else if (haystack.includes(word)) {
            score += 1;
          }
        });

        // Bonus: name match is most relevant
        const nameHaystack = org.name.toLowerCase();
        words.forEach(word => { if (nameHaystack.includes(word)) score += 4; });

        return { ...org, score };
      })
      .filter(org => org.score > 0)
      .sort((a, b) => b.score - a.score);

    setAiSearchQuery(query.trim());
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

    try {
      const response = await fetch('/api/auth-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setSignupError(data.error || 'Failed to create account');
        return;
      }

      // Sign in client-side so the session is persisted in the browser
      await supabase.auth.signInWithPassword({
        email: signupForm.email,
        password: signupForm.password
      });

      // Show success and reset form
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
        duration: [],
        exchanges: []
      });

      // Show success message for 3 seconds then close modal
      setTimeout(() => {
        setSignupSuccess(false);
        setShowAuthModal(false);
      }, 3000);
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError('Failed to create account. Please try again or contact us at hello@mapworkslearning.org');
    } finally {
      setSignupSubmitting(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setAvatarUploading(true)
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true
      })
      const path = `${user.id}/avatar.webp`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, compressed, { upsert: true, contentType: 'image/webp' })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = data.publicUrl
      await supabase.auth.updateUser({ data: { avatar_url: url } })
      setAvatarUrl(url)
    } catch (err) {
      console.error('Avatar upload failed:', err)
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setIsAdmin(false)
    setShowUserMenu(false)
  }

  // Handle sign in
  const handleSigninSubmit = async (e) => {
    e.preventDefault();
    setSigninSubmitting(true);
    setSigninError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signinForm.email,
        password: signinForm.password
      });

      if (error) {
        setSigninError(error.message.includes('Invalid login credentials') ? 'Invalid email or password' : error.message);
        return;
      }

      // onAuthStateChange will set user/session/avatar/admin
      setSigninForm({ email: '', password: '' });
      setShowAuthModal(false);
    } catch (error) {
      console.error('Login error:', error);
      setSigninError('Login failed. Please try again.');
    } finally {
      setSigninSubmitting(false);
    }
  };

  // Comprehensive Registration Modal - Minimal Elegant Design
  const AuthModal = () => {
    const handleSocialLogin = async (provider) => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase(),
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) console.error(`${provider} login error:`, error.message);
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
              New here?{' '}
              <button type="button" onClick={() => { setShowAuthModal(false); setShowVerificationModal(true); }} className="text-gray-800 font-medium hover:underline">
                Get Started
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

            {signinError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {signinError}
              </div>
            )}

            <form onSubmit={handleSigninSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={signinForm.email}
                  onChange={(e) => setSigninForm({...signinForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={signinForm.password}
                  onChange={(e) => setSigninForm({...signinForm, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={signinSubmitting}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signinSubmitting ? 'Signing In...' : 'Sign In'}
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
                  placeholder="Password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 text-sm"
                  required
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

  // ── JOURNEY TRACKER COMPONENTS ──────────────────────────────────────────

  const StatusPill = ({ status, currentWeek, totalWeeks }) => {
    if (status === 'live') {
      const wk = currentWeek && totalWeeks ? ` · week ${currentWeek} of ${totalWeeks}` : '';
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-100 px-2.5 py-1 rounded-md font-medium whitespace-nowrap">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
          Live{wk}
        </span>
      );
    }
    if (status === 'completed') return <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md font-medium">Completed</span>;
    return <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-medium">Planning</span>;
  };

  const screenText = (text) => {
    if (!text) return { ok: true, reasons: [] };
    const reasons = [];
    const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
    const PHONE_RE = /(\+?1[\s\-.]?)?\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4}/;
    const MINOR_RE = /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b.{0,50}\b(student|age\s+\d{1,2}|year[\s-]old|\d{1,2}[\s-]year)/i;
    const PROFANITY = ['fuck','shit','bitch','asshole','bastard','cunt','dick','nigger','nigga','spic','kike','faggot','fag','retard','slut','whore'];
    for (const w of PROFANITY) { if (new RegExp(`\\b${w}\\b`, 'i').test(text)) { reasons.push('profanity or slur'); break; } }
    if (EMAIL_RE.test(text)) reasons.push('email address');
    if (PHONE_RE.test(text)) reasons.push('phone number');
    if (MINOR_RE.test(text)) reasons.push('possible student full name');
    return { ok: reasons.length === 0, reasons };
  };

  const ExchangeJourneyView = ({ exchange: initialExchange, org, userRole, onBack, onRefresh }) => {
    const [exchange, setExchange] = React.useState(initialExchange);
    const [entries, setEntries] = React.useState([]);
    const [orgs, setOrgs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [expandOrgs, setExpandOrgs] = React.useState(false);
    const [showComposer, setShowComposer] = React.useState(false);
    const [showAddOrg, setShowAddOrg] = React.useState(false);
    const [showMetrics, setShowMetrics] = React.useState(false);
    const [showFunderDialog, setShowFunderDialog] = React.useState(false);
    const [funderLink, setFunderLink] = React.useState('');
    const [generatingToken, setGeneratingToken] = React.useState(false);
    const [editingEntry, setEditingEntry] = React.useState(null);
    const [composerTitle, setComposerTitle] = React.useState('');
    const [composerBody, setComposerBody] = React.useState('');
    const [composerLabel, setComposerLabel] = React.useState('');
    const [composerType, setComposerType] = React.useState('milestone');
    const [composerState, setComposerState] = React.useState('done');
    const [composerPublic, setComposerPublic] = React.useState(true);
    const [composerResUrl, setComposerResUrl] = React.useState('');
    const [composerResTitle, setComposerResTitle] = React.useState('');
    const [composerResType, setComposerResType] = React.useState('');
    const [composerResLicense, setComposerResLicense] = React.useState('');
    const [composerResGrade, setComposerResGrade] = React.useState('');
    const [composerFilter, setComposerFilter] = React.useState(null);
    const [composerPosting, setComposerPosting] = React.useState(false);
    const [composerError, setComposerError] = React.useState('');
    const [metricsForm, setMetricsForm] = React.useState({});
    const [metricsSaving, setMetricsSaving] = React.useState(false);
    const [addOrgSearch, setAddOrgSearch] = React.useState('');
    const [addOrgRole, setAddOrgRole] = React.useState('participant');
    const [addOrgResult, setAddOrgResult] = React.useState(null);
    const [addOrgSending, setAddOrgSending] = React.useState(false);
    const [addOrgError, setAddOrgError] = React.useState('');
    const [addOrgSuccess, setAddOrgSuccess] = React.useState('');

    const isCoOrganizer = userRole === 'co_organizer';
    const confirmedOrgs = orgs.filter(o => o.confirmed);
    const multiCoOrg = orgs.filter(o => o.role === 'co_organizer' && o.confirmed).length > 1;
    const CHIP_LIMIT = 4;

    const loadData = React.useCallback(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/journey?exchangeId=${exchange.id}`);
        const d = await r.json();
        if (d.exchange) {
          setExchange(d.exchange);
          setMetricsForm({
            studentsReached: d.exchange.students_reached || 0,
            teachersReached: d.exchange.teachers_reached || 0,
            schoolsCount: d.exchange.schools_count || 0,
            countriesCount: d.exchange.countries_count || 0,
            reuseCount: d.exchange.reuse_count || 0,
            facilitatorCount: d.exchange.facilitator_count || '',
            facilitatorOrg: d.exchange.facilitator_org || '',
            currentWeek: d.exchange.current_week || '',
            totalWeeks: d.exchange.total_weeks || ''
          });
        }
        setEntries(d.entries || []);
        setOrgs(d.orgs || []);
      } catch (e) { console.error('Journey load error:', e); }
      setLoading(false);
    }, [exchange.id]);

    React.useEffect(() => { loadData(); }, [loadData]);

    const postEntry = async (confirmed = false) => {
      setComposerError('');
      const check = screenText([composerTitle, composerBody].filter(Boolean).join(' '));
      if (!check.ok && !confirmed) { setComposerFilter(check); return; }
      setComposerPosting(true);
      const payload = {
        action: editingEntry ? 'edit-entry' : 'post-entry',
        userId: user?.id, orgId: org.id, exchangeId: exchange.id,
        type: composerType, label: composerLabel, title: composerTitle, body: composerBody,
        state: composerState, isPublic: composerPublic,
        resourceUrl: composerResUrl, resourceTitle: composerResTitle,
        resourceType: composerResType, resourceLicense: composerResLicense,
        resourceGradeRange: composerResGrade
      };
      if (editingEntry) payload.entryId = editingEntry.id;
      const r = await fetch('/api/journey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const d = await r.json();
      if (!r.ok) { setComposerError(d.error || 'Failed to post'); setComposerPosting(false); return; }
      resetComposer();
      await loadData();
      setComposerPosting(false);
    };

    const resetComposer = () => {
      setShowComposer(false); setEditingEntry(null);
      setComposerTitle(''); setComposerBody(''); setComposerLabel('');
      setComposerType('milestone'); setComposerState('done'); setComposerPublic(true);
      setComposerResUrl(''); setComposerResTitle(''); setComposerResType('');
      setComposerResLicense(''); setComposerResGrade(''); setComposerFilter(null); setComposerError('');
    };

    const openEdit = (entry) => {
      setEditingEntry(entry); setComposerType(entry.type); setComposerLabel(entry.label || '');
      setComposerTitle(entry.title); setComposerBody(entry.body || ''); setComposerState(entry.state);
      setComposerPublic(entry.is_public); setComposerResUrl(entry.resource_url || '');
      setComposerResTitle(entry.resource_title || ''); setComposerResType(entry.resource_type || '');
      setComposerResLicense(entry.resource_license || ''); setComposerResGrade(entry.resource_grade_range || '');
      setComposerFilter(null); setComposerError(''); setShowComposer(true);
    };

    const deleteEntry = async (entryId) => {
      if (!window.confirm('Delete this entry?')) return;
      await fetch('/api/journey', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-entry', userId: user?.id, orgId: org.id, exchangeId: exchange.id, entryId }) });
      await loadData();
    };

    const saveMetrics = async () => {
      setMetricsSaving(true);
      await fetch('/api/journey', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-metrics', userId: user?.id, orgId: org.id, exchangeId: exchange.id, metrics: metricsForm }) });
      await loadData(); setShowMetrics(false); setMetricsSaving(false);
    };

    const searchOrgForInvite = (name) => {
      if (!name.trim()) { setAddOrgResult(null); return; }
      const found = organizations.find(o => o.name.toLowerCase().includes(name.toLowerCase()) && o.id !== org.id);
      setAddOrgResult(found || false);
    };

    const sendInvite = async () => {
      if (!addOrgResult) { setAddOrgError('Please select a valid organization'); return; }
      setAddOrgSending(true); setAddOrgError('');
      const r = await fetch('/api/journey', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'invite-org', userId: user?.id, inviterOrgId: org.id, invitedOrgId: addOrgResult.id, exchangeId: exchange.id, role: addOrgRole }) });
      const d = await r.json();
      if (!r.ok) { setAddOrgError(d.error || 'Failed to send invite'); }
      else { setAddOrgSuccess(`Invite sent to ${addOrgResult.name}!`); setAddOrgSearch(''); setAddOrgResult(null); await loadData(); }
      setAddOrgSending(false);
    };

    const genFunderToken = async () => {
      setGeneratingToken(true);
      const r = await fetch('/api/journey', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'gen-funder-token', userId: user?.id, orgId: org.id, exchangeId: exchange.id }) });
      const d = await r.json();
      if (r.ok) setFunderLink(`${window.location.origin}/?funder=${d.token}`);
      setGeneratingToken(false);
    };

    const goToSnapshot = () => {
      const quotes = entries.filter(e => e.type === 'quote').slice(0, 3);
      setSnapshotPrefill({
        programName: exchange.name, organizationName: org.name,
        totalParticipants: String(exchange.students_reached || ''),
        partnerCountries: confirmedOrgs.filter(o => o.org?.id !== org.id).map(o => o.org?.country).filter(Boolean).join(', '),
        sessionsCompleted: String(entries.filter(e => e.type === 'milestone').length),
        studentQuote1: quotes[0]?.body || '', studentQuote2: quotes[1]?.body || '', studentQuote3: quotes[2]?.body || ''
      });
      setShowProfileModal(false); setSelectedOrg(null); setActiveTab('impact-snapshot');
    };

    if (loading) return <div className="flex items-center justify-center py-14"><div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

    const visibleOrgs = expandOrgs ? confirmedOrgs : confirmedOrgs.slice(0, CHIP_LIMIT);
    const hiddenCount = confirmedOrgs.length - CHIP_LIMIT;

    return (
      <div className="pb-6 space-y-5">
        {onBack && (
          <button type="button" onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 -mt-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
            All exchanges
          </button>
        )}

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{exchange.name}</h3>
            <StatusPill status={exchange.status} currentWeek={exchange.current_week} totalWeeks={exchange.total_weeks} />
          </div>
          {confirmedOrgs.filter(o => o.role === 'co_organizer').length > 1 && (
            <p className="text-sm text-gray-500">Organized by {confirmedOrgs.filter(o => o.role === 'co_organizer').map(o => o.org?.name).filter(Boolean).join(' & ')}</p>
          )}
          {exchange.summary && <p className="text-sm text-gray-600 mt-1">{exchange.summary}</p>}
        </div>

        {/* Participating orgs */}
        {confirmedOrgs.length > 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-2">Schools or orgs taking part</p>
            <div className="flex gap-2 flex-wrap">
              {visibleOrgs.map(eo => (
                <span key={eo.id} className="text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md">
                  {eo.org?.name}{eo.org?.country ? ` · ${eo.org.country}` : ''}
                </span>
              ))}
              {!expandOrgs && hiddenCount > 0 && (
                <button type="button" onClick={() => setExpandOrgs(true)} className="text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50">
                  +{hiddenCount} more
                </button>
              )}
            </div>
            {isCoOrganizer && orgs.filter(o => !o.confirmed).length > 0 && (
              <p className="text-xs text-gray-400 mt-2">{orgs.filter(o => !o.confirmed).length} invite(s) pending acceptance</p>
            )}
          </div>
        )}

        {/* Metric cards */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
            {[
              ['Students reached', exchange.students_reached],
              ['Teachers reached', exchange.teachers_reached],
              ['Schools · countries', (exchange.schools_count || exchange.countries_count) ? `${exchange.schools_count ?? '—'} · ${exchange.countries_count ?? '—'}` : '—'],
              ['Free resources made', entries.filter(e => e.type === 'resource').length],
              ['Times reused', exchange.reuse_count]
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-semibold mt-0.5">{value ?? '—'}</p>
              </div>
            ))}
            {isCoOrganizer && (
              <button type="button" onClick={() => setShowMetrics(!showMetrics)}
                className="bg-gray-50 rounded-lg p-3 text-left border-2 border-dashed border-gray-200 hover:bg-gray-100 transition">
                <p className="text-xs text-gray-500">Update metrics</p>
                <p className="text-lg font-semibold mt-0.5 text-blue-600">✎ Edit</p>
              </button>
            )}
          </div>
          {(exchange.facilitator_count > 0) && (
            <p className="text-sm text-gray-500">Facilitated by {exchange.facilitator_count} trained facilitators{exchange.facilitator_org ? ` from ${exchange.facilitator_org}` : ''}.</p>
          )}
        </div>

        {/* Metrics editor */}
        {showMetrics && isCoOrganizer && (
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
            <h4 className="font-medium text-gray-900 text-sm">Update metrics</h4>
            <div className="grid grid-cols-2 gap-3">
              {[['studentsReached','Students reached'],['teachersReached','Teachers reached'],['schoolsCount','Schools'],['countriesCount','Countries'],['reuseCount','Times reused']].map(([k, l]) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                  <input type="number" min="0" value={metricsForm[k] || ''} onChange={e => setMetricsForm(p => ({ ...p, [k]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Facilitator count</label>
                <input type="number" min="0" value={metricsForm.facilitatorCount || ''} onChange={e => setMetricsForm(p => ({ ...p, facilitatorCount: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Facilitator org</label>
                <input value={metricsForm.facilitatorOrg || ''} onChange={e => setMetricsForm(p => ({ ...p, facilitatorOrg: e.target.value }))} placeholder="e.g. MapWorks Learning" className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Current week</label>
                <input type="number" min="1" value={metricsForm.currentWeek || ''} onChange={e => setMetricsForm(p => ({ ...p, currentWeek: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Total weeks</label>
                <input type="number" min="1" value={metricsForm.totalWeeks || ''} onChange={e => setMetricsForm(p => ({ ...p, totalWeeks: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm" />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={saveMetrics} disabled={metricsSaving}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
                {metricsSaving ? 'Saving…' : 'Save metrics'}
              </button>
              <button type="button" onClick={() => setShowMetrics(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">Cancel</button>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">The journey so far</h4>
          {entries.length === 0 ? (
            <p className="text-sm text-gray-400 italic">{isCoOrganizer ? 'No entries yet — add the first update below.' : 'No entries yet.'}</p>
          ) : (
            <div className="relative pl-6">
              <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 bg-gray-200" />
              {entries.map((entry, idx) => {
                const isKickoff = idx === entries.length - 1;
                const nodeClass = isKickoff
                  ? 'w-3.5 h-3.5 rounded-full bg-gray-300 border-[2.5px] border-white'
                  : entry.state === 'in_progress'
                    ? 'w-3.5 h-3.5 rounded-full bg-green-100 ring-2 ring-green-500 border-[2.5px] border-white'
                    : 'w-3.5 h-3.5 rounded-full bg-blue-600 border-[2.5px] border-white';
                const postedOrg = multiCoOrg && orgs.find(o => o.org_id === entry.posted_by_org_id)?.org?.name;
                return (
                  <div key={entry.id} className="relative mb-5 group">
                    <div className={`absolute -left-6 top-0.5 ${nodeClass}`} />
                    <p className="text-xs text-gray-400 mb-0.5">
                      {entry.state === 'in_progress' ? 'Happening now' : (entry.label || '')}
                      {postedOrg ? ` · posted by ${postedOrg}` : ''}
                    </p>
                    {entry.type === 'resource' ? (
                      <div>
                        {entry.label && <p className="text-xs text-gray-400 mb-1">A free resource came out of this</p>}
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900">{entry.resource_title || entry.title}</p>
                              {(entry.resource_type || entry.resource_grade_range) && (
                                <p className="text-sm text-gray-500 mt-0.5 mb-1.5">
                                  {[entry.resource_type, entry.resource_grade_range ? `Grade / Year level ${entry.resource_grade_range}` : ''].filter(Boolean).join(' · ')}
                                </p>
                              )}
                              {entry.resource_license && (
                                <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-md">{entry.resource_license} · free to use &amp; adapt</span>
                              )}
                            </div>
                            {entry.resource_url && (
                              <a href={entry.resource_url} target="_blank" rel="noopener noreferrer"
                                className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>
                                Download
                              </a>
                            )}
                          </div>
                          {entry.body && <p className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-100 leading-snug">{entry.body}</p>}
                        </div>
                      </div>
                    ) : entry.type === 'quote' ? (
                      <div>
                        <p className="font-medium text-gray-900">{entry.title}</p>
                        {entry.body && <p className="text-sm text-gray-600 italic mt-0.5 leading-snug">"{entry.body}"</p>}
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900">{entry.title}</p>
                        {entry.body && <p className="text-sm text-gray-600 mt-0.5 leading-snug">{entry.body}</p>}
                      </div>
                    )}
                    {isCoOrganizer && (
                      <div className="hidden group-hover:flex gap-3 mt-1">
                        <button type="button" onClick={() => openEdit(entry)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                        <button type="button" onClick={() => deleteEntry(entry.id)} className="text-xs text-red-500 hover:text-red-600">Delete</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action row */}
        <div className="flex gap-3 flex-wrap pt-2 border-t border-gray-100">
          <div className="flex-1 min-w-[180px] bg-blue-50 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-blue-800 text-sm">Make a one-page snapshot</p>
              <p className="text-xs text-blue-600/80">Turns this journey into a printable report</p>
            </div>
            <button type="button" onClick={goToSnapshot}
              className="whitespace-nowrap text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg font-medium transition">
              Generate
            </button>
          </div>
          {isCoOrganizer && (
            <div className="flex-1 min-w-[180px] bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-gray-800 text-sm">Invite a funder to watch</p>
                <p className="text-xs text-gray-500">Private, read-only link to this journey</p>
              </div>
              <button type="button" onClick={() => setShowFunderDialog(!showFunderDialog)}
                className="whitespace-nowrap text-xs border border-gray-300 hover:bg-gray-100 px-3 py-1.5 rounded-lg font-medium transition">
                Invite
              </button>
            </div>
          )}
        </div>

        {/* Funder invite dialog */}
        {showFunderDialog && isCoOrganizer && (
          <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 text-sm">Funder invite — no account needed</h4>
              <button type="button" onClick={() => { setShowFunderDialog(false); setFunderLink(''); }} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
            </div>
            {funderLink ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input readOnly value={funderLink} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs bg-gray-50 font-mono min-w-0" />
                  <button type="button" onClick={() => navigator.clipboard.writeText(funderLink)}
                    className="flex-shrink-0 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition">Copy</button>
                </div>
                <p className="text-xs text-gray-500">Grants read-only access to this journey only — no login required.</p>
              </div>
            ) : (
              <button type="button" onClick={genFunderToken} disabled={generatingToken}
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
                {generatingToken ? 'Generating…' : 'Generate private link'}
              </button>
            )}
          </div>
        )}

        {/* Add update composer — co-org only */}
        {isCoOrganizer && (
          <div className="border-t border-gray-100 pt-5">
            {!showComposer ? (
              <button type="button" onClick={() => setShowComposer(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
                Add an update
              </button>
            ) : (
              <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 text-sm">{editingEntry ? 'Edit update' : 'Add an update'} <span className="text-xs font-normal text-gray-400">— org members only</span></h4>
                  <button type="button" onClick={resetComposer} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                </div>
                <div className="flex gap-2">
                  {[['milestone','Milestone'],['resource','Resource'],['quote','Quote']].map(([t, l]) => (
                    <button key={t} type="button" onClick={() => setComposerType(t)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${composerType === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {l}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Label <span className="font-normal text-gray-400">(e.g. Week 4, Kickoff)</span></label>
                    <input value={composerLabel} onChange={e => setComposerLabel(e.target.value)} placeholder="Week 4"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                    <select value={composerState} onChange={e => setComposerState(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option value="done">Done</option>
                      <option value="in_progress">Happening now</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {composerType === 'resource' ? 'Entry title' : composerType === 'quote' ? 'Attribution / heading' : 'What happened?'} <span className="text-red-500">*</span>
                  </label>
                  <input value={composerTitle} onChange={e => setComposerTitle(e.target.value)}
                    placeholder={composerType === 'quote' ? 'e.g. First live session — all five schools met' : composerType === 'resource' ? 'e.g. Cross-Cultural Dialogue Starters' : 'e.g. Students presented final projects'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {composerType === 'quote' ? 'The quote' : 'Details'} <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea value={composerBody} onChange={e => setComposerBody(e.target.value)} rows={2}
                    placeholder={composerType === 'quote' ? '"I never thought I\'d have a friend in Nairobi." — a student, age 14' : 'A sentence or two…'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                  {composerType === 'quote' && <p className="text-xs text-gray-400 mt-1">Attribute quotes generically — "a student, age 14" — never with a full name.</p>}
                </div>
                {composerType === 'resource' && (
                  <div className="space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs font-medium text-gray-700">Resource details</p>
                    <input value={composerResTitle} onChange={e => setComposerResTitle(e.target.value)} placeholder="Resource title"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <input value={composerResType} onChange={e => setComposerResType(e.target.value)} placeholder="Type (e.g. Lesson plan)"
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      <input value={composerResGrade} onChange={e => setComposerResGrade(e.target.value)} placeholder="Grade / Year level (e.g. 6–10)"
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <input value={composerResLicense} onChange={e => setComposerResLicense(e.target.value)} placeholder="License (e.g. CC BY 4.0)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    <input value={composerResUrl} onChange={e => setComposerResUrl(e.target.value)} placeholder="Download URL"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                )}
                {composerFilter && !composerFilter.ok && (
                  <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2.5">
                    <p className="font-medium mb-1">⚠ Looks like this may include {composerFilter.reasons.join(', ')} — please review before posting.</p>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => postEntry(true)} className="underline font-medium">Post anyway</button>
                      <button type="button" onClick={() => setComposerFilter(null)} className="underline text-yellow-600">Edit first</button>
                    </div>
                  </div>
                )}
                {composerError && <p className="text-xs text-red-600">{composerError}</p>}
                <div className="flex items-center justify-between pt-1">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                    <input type="checkbox" checked={composerPublic} onChange={e => setComposerPublic(e.target.checked)} className="rounded" />
                    Show on public journey
                  </label>
                  <button type="button" onClick={() => postEntry(false)} disabled={composerPosting || !composerTitle.trim()}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
                    {composerPosting ? 'Posting…' : editingEntry ? 'Save changes' : 'Post update'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add org panel — co-org only */}
        {isCoOrganizer && (
          <div>
            {!showAddOrg ? (
              <button type="button" onClick={() => setShowAddOrg(true)} className="text-sm text-gray-400 hover:text-gray-600 transition">
                + Add a school or org to this exchange
              </button>
            ) : (
              <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Add a school or org</h4>
                    <p className="text-xs text-gray-500 mt-0.5">They won't appear publicly until they accept in their Inbox.</p>
                  </div>
                  <button type="button" onClick={() => { setShowAddOrg(false); setAddOrgError(''); setAddOrgSuccess(''); setAddOrgSearch(''); setAddOrgResult(null); }} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex-1 min-w-[180px]">
                    <input value={addOrgSearch} onChange={e => { setAddOrgSearch(e.target.value); searchOrgForInvite(e.target.value); }}
                      placeholder="Start typing to search orgs…"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    {addOrgSearch.length > 1 && addOrgResult !== null && (
                      <p className={`text-xs mt-1 ${addOrgResult ? 'text-green-700' : 'text-gray-400'}`}>
                        {addOrgResult ? `✓ ${addOrgResult.name} · ${addOrgResult.country}` : 'No org found with that name'}
                      </p>
                    )}
                  </div>
                  <select value={addOrgRole} onChange={e => setAddOrgRole(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-shrink-0">
                    <option value="participant">Participant (taking part)</option>
                    <option value="co_organizer">Co-organizer (can edit)</option>
                  </select>
                </div>
                {addOrgError && <p className="text-xs text-red-600">{addOrgError}</p>}
                {addOrgSuccess && <p className="text-xs text-green-600">{addOrgSuccess}</p>}
                <button type="button" onClick={sendInvite} disabled={addOrgSending || !addOrgResult}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
                  {addOrgSending ? 'Sending…' : 'Send invite'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const JourneyContent = ({ org }) => {
    const [exchanges, setExchanges] = React.useState([]);
    const [userRoles, setUserRoles] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [selectedExchange, setSelectedExchange] = React.useState(null);
    const [showCreateForm, setShowCreateForm] = React.useState(false);
    const [createForm, setCreateForm] = React.useState({ name: '', summary: '', status: 'planning', currentWeek: '', totalWeeks: '' });
    const [creating, setCreating] = React.useState(false);
    const [createError, setCreateError] = React.useState('');

    const isOrgOwner = user?.id && org.claimed_by === user.id;

    const loadExchanges = React.useCallback(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/journey?orgId=${org.id}`);
        const d = await r.json();
        setExchanges(d.exchanges || []);
        setUserRoles(d.userRole || {});
        if ((d.exchanges || []).length === 1) setSelectedExchange(d.exchanges[0]);
      } catch (e) { console.error(e); }
      setLoading(false);
    }, [org.id]);

    React.useEffect(() => { loadExchanges(); }, [loadExchanges]);

    const createExchange = async () => {
      if (!createForm.name.trim()) { setCreateError('Exchange name is required'); return; }
      setCreating(true); setCreateError('');
      const r = await fetch('/api/journey', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-exchange', userId: user?.id, ...createForm,
          currentWeek: createForm.currentWeek || null, totalWeeks: createForm.totalWeeks || null })
      });
      const d = await r.json();
      if (!r.ok) { setCreateError(d.error || 'Failed to create'); setCreating(false); return; }
      setShowCreateForm(false);
      setCreateForm({ name: '', summary: '', status: 'planning', currentWeek: '', totalWeeks: '' });
      await loadExchanges();
      setCreating(false);
    };

    if (loading) return <div className="flex items-center justify-center py-14"><div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

    if (selectedExchange) return (
      <ExchangeJourneyView
        exchange={selectedExchange}
        org={org}
        userRole={userRoles[selectedExchange.id] || null}
        onBack={exchanges.length > 1 ? () => setSelectedExchange(null) : null}
        onRefresh={loadExchanges}
      />
    );

    return (
      <div className="pb-6">
        {exchanges.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.159.69.159 1.006 0Z"/>
              </svg>
            </div>
            <p className="text-gray-600 font-medium mb-1">No exchanges yet</p>
            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">Journey tracking lets you document exchanges in real time — timeline, metrics, and resources in one place.</p>
            {isOrgOwner && !showCreateForm && (
              <button type="button" onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
                Start an Exchange
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Exchanges</h3>
              {isOrgOwner && (
                <button type="button" onClick={() => setShowCreateForm(!showCreateForm)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  {showCreateForm ? 'Cancel' : '+ New exchange'}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {exchanges.map(ex => {
                const confirmed = ex.orgs?.filter(o => o.confirmed) || [];
                const others = confirmed.filter(o => o.org?.id !== org.id);
                return (
                  <button key={ex.id} type="button" onClick={() => setSelectedExchange(ex)}
                    className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 hover:border-gray-300 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{ex.name}</p>
                        {others.length > 0 && (
                          <p className="text-sm text-gray-500 mt-0.5 truncate">
                            with {others.slice(0, 2).map(o => o.org?.name).join(', ')}{others.length > 2 ? ` +${others.length - 2}` : ''}
                          </p>
                        )}
                      </div>
                      <StatusPill status={ex.status} currentWeek={ex.current_week} totalWeeks={ex.total_weeks} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showCreateForm && isOrgOwner && (
          <div className={`border border-gray-200 rounded-xl p-5 bg-gray-50 ${exchanges.length > 0 ? 'mt-4' : 'mt-0 max-w-lg mx-auto'}`}>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">Start an Exchange</h4>
            {createError && <p className="text-sm text-red-600 mb-3">{createError}</p>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Exchange name <span className="text-red-500">*</span></label>
                <input value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Global Campfires 2025"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">One-line description</label>
                <input value={createForm.summary} onChange={e => setCreateForm(p => ({ ...p, summary: e.target.value }))}
                  placeholder="What is this exchange about?"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select value={createForm.status} onChange={e => setCreateForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="planning">Planning</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Current week</label>
                  <input type="number" min="1" value={createForm.currentWeek} onChange={e => setCreateForm(p => ({ ...p, currentWeek: e.target.value }))}
                    placeholder="5" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Total weeks</label>
                  <input type="number" min="1" value={createForm.totalWeeks} onChange={e => setCreateForm(p => ({ ...p, totalWeeks: e.target.value }))}
                    placeholder="8" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={createExchange} disabled={creating}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm disabled:opacity-50">
                {creating ? 'Creating…' : 'Create Exchange'}
              </button>
              <button type="button" onClick={() => { setShowCreateForm(false); setCreateError(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Organization Profile Modal — pinned header + tab bar, scrollable body with fade masks
  const OrganizationProfileModal = ({ org }) => {
    if (!org) return null;
    const [profileTab, setProfileTab] = React.useState('about');
    const gradeLabel = getGradeLabel(org);
    const close = () => { setShowProfileModal(false); setSelectedOrg(null); };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={close}>
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>

          {/* PINNED: Header */}
          <div className="flex-shrink-0 px-6 pt-5 pb-3">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-xl font-bold text-gray-900">{org.name}</h2>
                  {org.verified && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0">
                      <CheckCircle size={11} /> Verified
                    </span>
                  )}
                  {org.claimed && (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0">
                      <CheckCircle size={11} /> Actively Managed
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1"><Globe size={13} />{org.country}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{gradeLabel}</span>
                  {org.students && <span>{org.students.toLocaleString()} students</span>}
                </div>
              </div>
              <button type="button" onClick={close} className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-full transition">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* PINNED: Tab bar */}
          <div className="flex-shrink-0 flex border-b border-gray-200 px-6 gap-0">
            {[['about','About'],['programs','Programs'],['journey','Journey']].map(([tab, label]) => (
              <button key={tab} type="button" onClick={() => setProfileTab(tab)}
                className={`py-3 mr-6 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  profileTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* SCROLLABLE: Body with top/bottom fade masks */}
          <div className="relative flex-1 min-h-0">
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none rounded-none" />
            <div
              className="org-modal-scroll h-full overflow-y-auto px-6 py-5"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(156,163,175,0.4) transparent', WebkitOverflowScrolling: 'touch' }}
            >
              <style>{`
                .org-modal-scroll::-webkit-scrollbar { width: 3px; }
                .org-modal-scroll::-webkit-scrollbar-track { background: transparent; }
                .org-modal-scroll::-webkit-scrollbar-thumb { background: rgba(156,163,175,0.35); border-radius: 99px; transition: background 0.2s; }
                .org-modal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(107,114,128,0.6); }
              `}</style>

              {profileTab === 'about' && (
                <div className="space-y-5 pb-6">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">About</h3>
                    <p className="text-gray-700 leading-relaxed">{org.description}</p>
                  </div>
                  {org.languages?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Languages</h3>
                      <div className="flex flex-wrap gap-2">{org.languages.map(l => <span key={l} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">{l}</span>)}</div>
                    </div>
                  )}
                  {org.interests?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Focus Areas</h3>
                      <div className="flex flex-wrap gap-2">{org.interests.map(i => <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm">{i}</span>)}</div>
                    </div>
                  )}
                  {org.partnershipGoals?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Partnership Goals</h3>
                      <ul className="space-y-1.5">
                        {org.partnershipGoals.map((g, i) => <li key={i} className="flex items-start gap-2 text-gray-700 text-sm"><span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>{g}</li>)}
                      </ul>
                    </div>
                  )}
                  {org.duration?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Preferred Duration</h3>
                      <div className="flex flex-wrap gap-2">{org.duration.map((d, i) => <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm">{d}</span>)}</div>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Technology</h3>
                    {org.techAvailable?.length > 0
                      ? <div className="flex flex-wrap gap-2">{org.techAvailable.map((t, i) => <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm">{t}</span>)}</div>
                      : <p className="text-gray-400 text-sm italic">To be added when profile is claimed</p>}
                  </div>
                  {org.verified && (org.website || org.email || org.phone) && (
                    <div className="border-t border-gray-100 pt-5">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Contact</h3>
                      <div className="space-y-2">
                        {org.website && <div className="flex items-center gap-2 text-sm"><Globe size={14} className="text-gray-400 flex-shrink-0" /><a href={`https://${org.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{org.website}</a></div>}
                        {org.email && <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-gray-400 flex-shrink-0" /><a href={`mailto:${org.email}`} className="text-gray-700 hover:text-blue-600">{org.email}</a></div>}
                        {org.phone && <div className="flex items-center gap-2 text-sm"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span className="text-gray-700">{org.phone}</span></div>}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {profileTab === 'programs' && (
                <div className="pb-6">
                  {org.programs?.length > 0 ? (
                    <div className="space-y-4">
                      {org.programs.map((program, idx) => (
                        <div key={idx} className={`rounded-xl p-4 border ${program.status === 'current' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{program.name}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${program.status === 'current' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                              {program.status === 'current' ? 'Open Now' : 'Upcoming'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{program.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {program.duration && <div><span className="font-medium text-gray-600">Duration:</span> {program.duration}</div>}
                            {program.participants && <div><span className="font-medium text-gray-600">Participants:</span> {program.participants}</div>}
                            {program.technology && <div><span className="font-medium text-gray-600">Tech:</span> {program.technology}</div>}
                            {program.cost && <div><span className="font-medium text-gray-600">Cost:</span> {program.cost}</div>}
                            {program.applicationDeadline && <div className="col-span-2"><span className="font-medium text-gray-600">Apply by:</span> {program.applicationDeadline}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-sm">No programs listed yet.</p>
                      {!org.claimed && <p className="text-xs mt-1">Claim this profile to add your programs.</p>}
                    </div>
                  )}
                </div>
              )}

              {profileTab === 'journey' && <JourneyContent org={org} />}

            </div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
          </div>

          {/* PINNED: Footer actions — hidden on Journey tab (has its own action row) */}
          {profileTab !== 'journey' && <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4 bg-gray-50 rounded-b-2xl space-y-2">
            <div className="flex gap-2">
              {user?.id !== org.claimed_by && (
                <button type="button" onClick={() => { setSelectedOrgForRequest(org); setShowIntroductionRequestModal(true); close(); }}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-sm">
                  Request an Introduction
                </button>
              )}
              <button type="button" onClick={e => { e.stopPropagation(); toggleFavorite(org); }}
                className={`px-4 py-2.5 border rounded-lg transition flex-shrink-0 ${isFavorited(org.id) ? 'border-red-400 bg-red-50 text-red-600' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                title={isFavorited(org.id) ? 'Remove from favorites' : 'Add to favorites'}>
                <Heart size={18} fill={isFavorited(org.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            {!org.claimed && (
              <button type="button" onClick={() => { setSelectedOrgForRequest(org); setShowClaimProfileModal(true); close(); }}
                className="w-full py-2.5 border border-yellow-400 bg-yellow-50 text-yellow-800 rounded-lg font-semibold hover:bg-yellow-100 transition text-sm">
                Claim this Profile
              </button>
            )}
            {user?.id && org.claimed_by === user.id && (
              <button type="button" onClick={() => { setEditOrgForm({ description: org.description || '', website: org.website || '', email: org.email || '', phone: org.phone || '', capacity: org.capacity || '', languages: (org.languages || []).join(', '), interests: (org.interests || []).join(', '), partnershipGoals: (org.partnershipGoals || []).join('\n') }); setEditOrgError(''); setShowEditOrgModal(true); }}
                className="w-full py-2.5 border border-blue-400 bg-blue-50 text-blue-800 rounded-lg font-semibold hover:bg-blue-100 transition text-sm">
                Edit Organization Profile
              </button>
            )}
          </div>}
        </div>
      </div>
    );
  };

  // Verification Modal - Automated verification system
  const VerificationModal = () => {
    const [verificationForm, setVerificationForm] = useState({
      firstName: '',
      lastName: '',
      password: '',
      name: '',
      type: '',
      category: '',
      country: '',
      region: '',
      website: '',
      email: '',
      phone: '',
      role: '',
      capacity: '',
      description: '',
      languages: '',
      interests: '',
      partnershipGoals: ''
    });
    const [verificationSubmitting, setVerificationSubmitting] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [verificationError, setVerificationError] = useState('');

    const handleVerificationSubmit = async (e) => {
      e.preventDefault();
      setVerificationSubmitting(true);
      setVerificationError('');

      try {
        // If user is not logged in, create their account first (signup + verify in one flow)
        let activeUser = user;
        if (!activeUser) {
          if (!verificationForm.firstName || !verificationForm.lastName || !verificationForm.password) {
            setVerificationError('Please provide your name and a password to create your account.');
            setVerificationSubmitting(false);
            return;
          }
          if (verificationForm.password.length < 8) {
            setVerificationError('Password must be at least 8 characters.');
            setVerificationSubmitting(false);
            return;
          }
          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: verificationForm.email,
            password: verificationForm.password,
            options: {
              data: {
                first_name: verificationForm.firstName,
                last_name: verificationForm.lastName,
                role: verificationForm.role,
                organization: verificationForm.name
              }
            }
          });
          if (signupError) {
            setVerificationError(signupError.message.includes('already registered')
              ? 'This email is already registered. Please sign in instead.'
              : signupError.message);
            setVerificationSubmitting(false);
            return;
          }
          activeUser = signupData.user;
        }

        const toArray = (s) => s ? s.split(',').map(x => x.trim()).filter(Boolean) : [];
        const toLines = (s) => s ? s.split('\n').map(x => x.trim()).filter(Boolean) : [];

        const response = await fetch('/api/submit-new-organization', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: verificationForm.name,
            type: verificationForm.type,
            category: verificationForm.category || verificationForm.type,
            country: verificationForm.country,
            region: verificationForm.region,
            website: verificationForm.website,
            email: verificationForm.email,
            phone: verificationForm.phone,
            description: verificationForm.description || 'Educational institution seeking verification',
            capacity: verificationForm.capacity || null,
            languages: toArray(verificationForm.languages),
            interests: toArray(verificationForm.interests),
            partnershipGoals: toLines(verificationForm.partnershipGoals),
            submitterName: verificationForm.firstName && verificationForm.lastName
              ? `${verificationForm.firstName} ${verificationForm.lastName}`
              : (activeUser?.user_metadata?.first_name && activeUser?.user_metadata?.last_name
                  ? `${activeUser.user_metadata.first_name} ${activeUser.user_metadata.last_name}`
                  : 'Organization Representative'),
            submitterEmail: verificationForm.email,
            submitterRole: verificationForm.role,
            userId: activeUser?.id
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setVerificationError((data.error || 'Failed to submit') + (data.detail ? `: ${data.detail}` : ''));
          return;
        }

        setVerificationSuccess(true);
      } catch (error) {
        console.error('Verification submission error:', error);
        setVerificationError('Failed to submit verification request. Please try again.');
      } finally {
        setVerificationSubmitting(false);
      }
    };

    return (
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

          {verificationSuccess ? (
            <div className="text-center py-10 px-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Submission Received!</h3>
              <p className="text-gray-600 mb-3">
                Your organization has been submitted for review. You'll receive a confirmation at <strong>{verificationForm.email || 'your email'}</strong>.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Our team will review your submission within 1–3 business days and notify you once it's approved and live.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowVerificationModal(false);
                  setVerificationSuccess(false);
                  setVerificationForm({ firstName:'', lastName:'', password:'', name:'', type:'', country:'', region:'', website:'', email:'', role:'', capacity:'', description:'' });
                }}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Done
              </button>
            </div>
          ) : (
            <>
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

              {verificationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {verificationError}
                </div>
              )}

              <form onSubmit={handleVerificationSubmit} className="space-y-6">
                {!user && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                    <h4 className="font-semibold text-gray-800 mb-4">Create Your Account</h4>
                    <button
                      type="button"
                      onClick={async () => {
                        const { error } = await supabase.auth.signInWithOAuth({
                          provider: 'google',
                          options: { redirectTo: window.location.origin }
                        });
                        if (error) console.error('Google login error:', error.message);
                      }}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-white transition text-sm font-medium mb-4 bg-white"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/></svg>
                      Continue with Google
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="text-xs text-gray-400">or fill in below</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          value={verificationForm.firstName}
                          onChange={(e) => setVerificationForm({...verificationForm, firstName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          value={verificationForm.lastName}
                          onChange={(e) => setVerificationForm({...verificationForm, lastName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                      <input
                        type="password"
                        placeholder="At least 8 characters"
                        value={verificationForm.password}
                        onChange={(e) => setVerificationForm({...verificationForm, password: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                        minLength={8}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-3">Already have an account? <button type="button" onClick={() => { setShowVerificationModal(false); setAuthMode('signin'); setShowAuthModal(true); }} className="text-green-700 font-medium hover:underline">Sign In</button></p>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Lincoln High School"
                      value={verificationForm.name}
                      onChange={(e) => setVerificationForm({...verificationForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type *</label>
                    <select
                      value={verificationForm.type}
                      onChange={(e) => setVerificationForm({...verificationForm, type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
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
                      value={verificationForm.country}
                      onChange={(e) => setVerificationForm({...verificationForm, country: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City/Region *</label>
                    <input
                      type="text"
                      placeholder="e.g., Boston, MA"
                      value={verificationForm.region}
                      onChange={(e) => setVerificationForm({...verificationForm, region: e.target.value})}
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
                    value={verificationForm.website}
                    onChange={(e) => setVerificationForm({...verificationForm, website: e.target.value})}
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
                    value={verificationForm.email}
                    onChange={(e) => setVerificationForm({...verificationForm, email: e.target.value})}
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
                    value={verificationForm.role}
                    onChange={(e) => setVerificationForm({...verificationForm, role: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g., +1 (202) 555-0100"
                    value={verificationForm.phone}
                    onChange={(e) => setVerificationForm({...verificationForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Students (Approximate)</label>
                  <input
                    type="text"
                    placeholder="e.g., 500 students annually"
                    value={verificationForm.capacity}
                    onChange={(e) => setVerificationForm({...verificationForm, capacity: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages Supported <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                  <input
                    type="text"
                    placeholder="e.g., English, Spanish, Arabic"
                    value={verificationForm.languages}
                    onChange={(e) => setVerificationForm({...verificationForm, languages: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Focus Areas <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                  <input
                    type="text"
                    placeholder="e.g., Youth Leadership, Climate Action, STEM"
                    value={verificationForm.interests}
                    onChange={(e) => setVerificationForm({...verificationForm, interests: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Goals <span className="text-gray-400 font-normal">(one per line)</span></label>
                  <textarea
                    placeholder={"e.g., Cross-cultural collaboration\nJoint curriculum projects\nStudent mentoring"}
                    value={verificationForm.partnershipGoals}
                    onChange={(e) => setVerificationForm({...verificationForm, partnershipGoals: e.target.value})}
                    rows={3}
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
                    disabled={verificationSubmitting}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Shield size={20} />
                    {verificationSubmitting ? 'Submitting...' : 'Submit for Verification'}
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
            </>
          )}
        </div>
      </div>
    );
  };

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
                <button type="button" onClick={() => { setActiveTab('privacy'); setShowCookieConsent(false); }} className="text-gray-800 underline hover:text-gray-900">
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
        {org.claimed ? (
          <div className="w-full py-2 flex items-center justify-center gap-1.5 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
            <CheckCircle size={14} />
            Actively Managed
          </div>
        ) : (
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
        )}
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
              onClick={() => setShowVerificationModal(true)}
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
        
        {aiSearchQuery && searchResults.length === 0 && (
          <div className="mt-8 max-w-6xl mx-auto text-center py-12">
            <p className="text-gray-500 text-lg mb-2">No organizations matched <strong>"{aiSearchQuery}"</strong></p>
            <p className="text-gray-400 text-sm">Try different keywords — for example, a subject area, grade level, country, or language.</p>
            <button type="button" onClick={() => { setAiSearchQuery(''); if (aiSearchRef.current) aiSearchRef.current.value = ''; }} className="mt-4 text-blue-600 hover:underline text-sm">Clear search</button>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Found {searchResults.length} matching {searchResults.length === 1 ? 'organization' : 'organizations'}
              </h3>
              <button
                type="button"
                onClick={() => { setSearchResults([]); setAiSearchQuery(''); if (aiSearchRef.current) aiSearchRef.current.value = ''; }}
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

    React.useEffect(() => {
      if (!snapshotPrefill) return;
      setFormData(prev => ({ ...prev, ...snapshotPrefill }));
      setSnapshotPrefill(null);
    }, [snapshotPrefill]);

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
        const response = await fetch('/api/connect', {
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

        // If logged in and target org has a claimed owner, also drop a message in their inbox
        if (user && selectedOrgForRequest.claimed_by) {
          await supabase.from('messages').insert({
            sender_id: user.id,
            recipient_id: selectedOrgForRequest.claimed_by,
            subject: `Introduction request from ${requestForm.organization || requestForm.yourName}`,
            body: requestForm.message || requestForm.partnershipInterest || '',
            org_context_name: selectedOrgForRequest.name
          });
        }

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

  // Edit Organization Modal - Org owners edit their profile
  const EditOrgModal = () => {
    if (!showEditOrgModal || !selectedOrg) return null;

    const handleSave = async (e) => {
      e.preventDefault();
      setEditOrgError('');
      setEditOrgSubmitting(true);
      try {
        const toArray = (s) => s.split(',').map(x => x.trim()).filter(Boolean);
        const toLines = (s) => s.split('\n').map(x => x.trim()).filter(Boolean);
        const { error } = await supabase.from('organizations').update({
          description: editOrgForm.description,
          website: editOrgForm.website,
          email: editOrgForm.email,
          phone: editOrgForm.phone,
          capacity: editOrgForm.capacity,
          languages: toArray(editOrgForm.languages),
          interests: toArray(editOrgForm.interests),
          partnership_goals: toLines(editOrgForm.partnershipGoals)
        }).eq('id', selectedOrg.id);
        if (error) throw error;
        await loadOrganizations();
        setShowEditOrgModal(false);
      } catch (err) {
        console.error('Edit org error:', err);
        setEditOrgError(err.message || 'Failed to save changes');
      } finally {
        setEditOrgSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowEditOrgModal(false)}>
        <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="border-b border-gray-200 p-6 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Edit {selectedOrg.name}</h3>
            <button type="button" onClick={() => setShowEditOrgModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-4">
            {editOrgError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{editOrgError}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editOrgForm.description}
                onChange={(e) => setEditOrgForm({ ...editOrgForm, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="text" value={editOrgForm.website} onChange={(e) => setEditOrgForm({ ...editOrgForm, website: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={editOrgForm.email} onChange={(e) => setEditOrgForm({ ...editOrgForm, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" value={editOrgForm.phone} onChange={(e) => setEditOrgForm({ ...editOrgForm, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input type="text" value={editOrgForm.capacity} onChange={(e) => setEditOrgForm({ ...editOrgForm, capacity: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Languages <span className="text-gray-400 font-normal">(comma-separated)</span></label>
              <input type="text" value={editOrgForm.languages} onChange={(e) => setEditOrgForm({ ...editOrgForm, languages: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="English, Spanish, Arabic" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Focus Areas <span className="text-gray-400 font-normal">(comma-separated)</span></label>
              <input type="text" value={editOrgForm.interests} onChange={(e) => setEditOrgForm({ ...editOrgForm, interests: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Youth Leadership, Climate Action" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partnership Goals <span className="text-gray-400 font-normal">(one per line)</span></label>
              <textarea
                value={editOrgForm.partnershipGoals}
                onChange={(e) => setEditOrgForm({ ...editOrgForm, partnershipGoals: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={editOrgSubmitting} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {editOrgSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setShowEditOrgModal(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </form>
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
        const response = await fetch('/api/claim-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationId: selectedOrgForRequest.id,
            organizationName: selectedOrgForRequest.name,
            name: claimForm.name,
            role: claimForm.role,
            email: claimForm.workEmail,
            phone: claimForm.phone,
            additionalInfo: claimForm.message,
            userId: user?.id
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setClaimError(data.error || 'Failed to submit claim');
          return;
        }

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
        console.error('Claim profile error:', error);
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

  // ── INBOX ────────────────────────────────────────────────────────────────
  // ── FUNDER JOURNEY PAGE ───────────────────────────────────────────────────
  const FunderJourneyPage = ({ token }) => {
    const [exchange, setExchange] = React.useState(null);
    const [entries, setEntries] = React.useState([]);
    const [orgs, setOrgs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      if (!token) return;
      fetch(`/api/journey?token=${encodeURIComponent(token)}`)
        .then(r => r.json())
        .then(d => {
          if (d.error) { setError(d.error); return; }
          setExchange(d.exchange);
          setEntries(d.entries || []);
          setOrgs(d.orgs || []);
        })
        .catch(() => setError('Failed to load journey'))
        .finally(() => setLoading(false));
    }, [token]);

    if (loading) return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

    if (error || !exchange) return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md">
          <p className="text-xl font-semibold text-gray-800 mb-2">Link Not Found</p>
          <p className="text-gray-500 text-sm">{error || 'This funder link may have expired or been revoked.'}</p>
        </div>
      </div>
    );

    const statusColor = exchange.status === 'live' ? 'bg-green-100 text-green-700' : exchange.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Funder notice banner */}
        <div className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">
          Private Funder View — Read Only
        </div>

        <div className="max-w-3xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{exchange.name}</h1>
              <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColor}`}>{exchange.status}</span>
            </div>
            {exchange.summary && <p className="text-gray-600 mb-5">{exchange.summary}</p>}

            {/* Participating orgs */}
            {orgs.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {orgs.map(o => (
                  <span key={o.id} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{o.name}</span>
                ))}
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Students Reached', value: exchange.students_reached },
                { label: 'Teachers Reached', value: exchange.teachers_reached },
                { label: 'Schools & Countries', value: exchange.schools_count ? `${exchange.schools_count} schools · ${exchange.countries_count || 0} countries` : null },
                { label: 'Free Resources', value: entries.filter(e => e.type === 'resource').length || null },
                { label: 'Times Reused', value: exchange.reuse_count },
              ].filter(m => m.value).map(m => (
                <div key={m.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">{m.label}</p>
                  <p className="font-bold text-gray-900">{m.value}</p>
                </div>
              ))}
            </div>

            {exchange.facilitator_org && (
              <p className="text-xs text-gray-400 mt-4">Facilitated by {exchange.facilitator_org}{exchange.facilitator_count ? ` (${exchange.facilitator_count} facilitators)` : ''}</p>
            )}
          </div>

          {/* Timeline */}
          {entries.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="font-semibold text-gray-800 mb-6">Journey Timeline</h2>
              <div className="space-y-6">
                {[...entries].sort((a, b) => new Date(b.occurred_at) - new Date(a.occurred_at)).map((entry, i) => {
                  const nodeColor = entry.type === 'milestone' ? 'bg-green-500' : entry.type === 'resource' ? 'bg-blue-500' : 'bg-purple-400';
                  return (
                    <div key={entry.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${nodeColor}`} />
                        {i < entries.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                      </div>
                      <div className="pb-4 flex-1 min-w-0">
                        {entry.label && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{entry.label}</p>}
                        <p className="font-semibold text-gray-900">{entry.title}</p>
                        {entry.body && <p className="text-sm text-gray-600 mt-1">{entry.body}</p>}
                        {entry.resource_url && (
                          <a href={entry.resource_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2">
                            {entry.resource_title || 'View Resource'} →
                          </a>
                        )}
                        <p className="text-xs text-gray-400 mt-2">{new Date(entry.occurred_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-8">
            Shared via The Virtual Exchange · <a href="/" className="hover:underline">thevirtualexchange.org</a>
          </p>
        </div>
      </div>
    );
  };

  const Inbox = () => {
    const [messages, setMessages] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [activeThreadUserId, setActiveThreadUserId] = React.useState(null);
    const [profilesById, setProfilesById] = React.useState({});
    const [reply, setReply] = React.useState('');
    const [sending, setSending] = React.useState(false);

    const loadAll = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: true });
      const list = data || [];
      setMessages(list);
      const otherIds = Array.from(new Set(list.flatMap(m => [m.sender_id, m.recipient_id]).filter(id => id !== user.id)));
      if (otherIds.length) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name')
          .in('id', otherIds);
        const byId = {};
        (profs || []).forEach(p => { byId[p.id] = p; });
        setProfilesById(byId);
      }
      setLoading(false);
    };

    React.useEffect(() => { loadAll(); }, []);

    const threads = React.useMemo(() => {
      const map = new Map();
      messages.forEach(m => {
        const other = m.sender_id === user.id ? m.recipient_id : m.sender_id;
        if (!map.has(other)) map.set(other, []);
        map.get(other).push(m);
      });
      return Array.from(map.entries()).map(([otherId, msgs]) => ({
        otherId,
        msgs,
        last: msgs[msgs.length - 1],
        unread: msgs.some(m => m.recipient_id === user.id && !m.read_at)
      })).sort((a, b) => new Date(b.last.created_at) - new Date(a.last.created_at));
    }, [messages]);

    const activeThread = threads.find(t => t.otherId === activeThreadUserId);

    React.useEffect(() => {
      if (!activeThread) return;
      const unreadIds = activeThread.msgs.filter(m => m.recipient_id === user.id && !m.read_at).map(m => m.id);
      if (!unreadIds.length) return;
      supabase.from('messages').update({ read_at: new Date().toISOString() }).in('id', unreadIds).then(() => {
        setMessages(prev => prev.map(m => unreadIds.includes(m.id) ? { ...m, read_at: new Date().toISOString() } : m));
        refreshUnreadCount(user.id);
      });
    }, [activeThreadUserId]);

    const sendReply = async () => {
      if (!reply.trim() || !activeThreadUserId) return;
      setSending(true);
      const { data } = await supabase.from('messages').insert({
        sender_id: user.id,
        recipient_id: activeThreadUserId,
        body: reply.trim()
      }).select().single();
      if (data) setMessages(prev => [...prev, data]);
      setReply('');
      setSending(false);
    };

    const nameOf = (id) => {
      const p = profilesById[id];
      if (!p) return 'User';
      return `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.email || 'User';
    };

    const fmt = (iso) => {
      const d = new Date(iso);
      const today = new Date();
      const same = d.toDateString() === today.toDateString();
      return same ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
            <p className="text-gray-500 mt-1">Conversations from connection requests</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
              Loading messages...
            </div>
          ) : threads.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <MessageSquare size={40} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No messages yet.</p>
              <p className="text-gray-400 text-sm mt-1">When someone requests an introduction to your organization, it will appear here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-[320px_1fr] gap-4 bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ minHeight: '600px' }}>
              {/* Thread list */}
              <div className="border-r border-gray-200 overflow-y-auto">
                {threads.map(t => (
                  <button
                    key={t.otherId}
                    type="button"
                    onClick={() => setActiveThreadUserId(t.otherId)}
                    className={`w-full text-left px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition ${activeThreadUserId === t.otherId ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium ${t.unread ? 'text-gray-900' : 'text-gray-700'}`}>{nameOf(t.otherId)}</span>
                      <span className="text-xs text-gray-400">{fmt(t.last.created_at)}</span>
                    </div>
                    <p className={`text-sm truncate ${t.unread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                      {t.last.sender_id === user.id ? 'You: ' : ''}{t.last.subject || t.last.body}
                    </p>
                    {t.unread && <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1" />}
                  </button>
                ))}
              </div>

              {/* Thread view */}
              <div className="flex flex-col">
                {!activeThread ? (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                    Select a conversation
                  </div>
                ) : (
                  <>
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="font-semibold text-gray-900">{nameOf(activeThread.otherId)}</h2>
                      {profilesById[activeThread.otherId]?.email && (
                        <p className="text-xs text-gray-500">{profilesById[activeThread.otherId].email}</p>
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                      {activeThread.msgs.map(m => {
                        const mine = m.sender_id === user.id;
                        // Try parsing structured invite messages
                        let invite = null;
                        try {
                          const parsed = JSON.parse(m.body);
                          if (parsed?.type === 'EXCHANGE_INVITE') invite = parsed;
                        } catch (_) {}

                        if (invite) {
                          return (
                            <div key={m.id} className="flex justify-start">
                              <div className="max-w-[85%] bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-4">
                                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">Exchange Invitation</p>
                                <p className="font-semibold text-gray-900 mb-1">{invite.exchangeName || 'Exchange'}</p>
                                {invite.role && <p className="text-sm text-gray-600 mb-3">Role: <span className="font-medium capitalize">{invite.role.replace('_', ' ')}</span></p>}
                                {!mine && (
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await fetch('/api/journey', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ action: 'respond-invite', exchangeId: invite.exchangeId, userId: user.id, accept: true })
                                        });
                                        loadAll();
                                      }}
                                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
                                    >Accept</button>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await fetch('/api/journey', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ action: 'respond-invite', exchangeId: invite.exchangeId, userId: user.id, accept: false })
                                        });
                                        loadAll();
                                      }}
                                      className="px-4 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium"
                                    >Decline</button>
                                  </div>
                                )}
                                <p className="text-xs text-indigo-400 mt-3">{fmt(m.created_at)}</p>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${mine ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                              {m.subject && <p className={`text-xs font-semibold mb-1 ${mine ? 'text-blue-100' : 'text-gray-500'}`}>{m.subject}</p>}
                              {m.org_context_name && <p className={`text-xs mb-1 ${mine ? 'text-blue-100' : 'text-gray-500'}`}>Re: {m.org_context_name}</p>}
                              <p className="whitespace-pre-wrap text-sm">{m.body}</p>
                              <p className={`text-xs mt-1 ${mine ? 'text-blue-100' : 'text-gray-400'}`}>{fmt(m.created_at)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-gray-200 p-4">
                      <div className="flex gap-2">
                        <textarea
                          value={reply}
                          onChange={e => setReply(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendReply(); }}
                          placeholder="Type a reply... (Cmd+Enter to send)"
                          rows={2}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 resize-none"
                        />
                        <button
                          type="button"
                          onClick={sendReply}
                          disabled={!reply.trim() || sending}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                          {sending ? '...' : 'Send'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── ADMIN PANEL ──────────────────────────────────────────────────────────
  const AdminPanel = () => {
    const [adminTab, setAdminTab] = React.useState('claims');
    const [claims, setClaims] = React.useState([]);
    const [pendingOrgs, setPendingOrgs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [rejectingId, setRejectingId] = React.useState(null);
    const [rejectReason, setRejectReason] = React.useState('');
    const [processing, setProcessing] = React.useState(null);
    const [toast, setToast] = React.useState(null);

    const showToast = (msg, type = 'success') => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3500);
    };

    React.useEffect(() => {
      fetch(`/api/admin?userId=${user.id}`)
        .then(r => r.json())
        .then(d => { setClaims(d.claims || []); setPendingOrgs(d.pendingOrgs || []); })
        .finally(() => setLoading(false));
    }, []);

    const reviewClaim = async (claimId, action) => {
      setProcessing(claimId + action);
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminUserId: user.id, action: 'review-claim', claimId, decision: action, rejectionReason: rejectReason })
      });
      if (res.ok) {
        setClaims(prev => prev.filter(c => c.id !== claimId));
        showToast(action === 'approve' ? 'Claim approved — org marked as claimed.' : 'Claim rejected.');
      } else {
        showToast('Something went wrong.', 'error');
      }
      setRejectingId(null);
      setRejectReason('');
      setProcessing(null);
    };

    const reviewOrg = async (orgId, action) => {
      setProcessing(orgId + action);
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminUserId: user.id, action: 'review-org', orgId, decision: action, rejectionReason: rejectReason })
      });
      if (res.ok) {
        setPendingOrgs(prev => prev.filter(o => o.id !== orgId));
        showToast(action === 'approve' ? 'Organization approved and now live.' : 'Organization rejected.');
        if (action === 'approve') loadOrganizations();
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast('Something went wrong: ' + (errData.detail || errData.error || 'unknown error'), 'error');
      }
      setRejectingId(null);
      setRejectReason('');
      setProcessing(null);
    };

    const fmt = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-800">
        {/* Header */}
        <div className="relative overflow-hidden px-6 py-16 text-center">
          <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 60% 0%, #7c3aed 0%, transparent 70%)' }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-1.5 text-purple-300 text-sm font-medium mb-4">
              <Shield size={14} /> Site Admin
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-slate-400">Review and approve pending requests</p>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
            {toast.msg}
          </div>
        )}

        <div className="max-w-5xl mx-auto px-6 pb-20">
          {/* Tabs */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-8 w-fit">
            <button
              type="button"
              onClick={() => setAdminTab('claims')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition ${adminTab === 'claims' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Profile Claims {claims.length > 0 && <span className="ml-1.5 bg-purple-600 text-white text-xs rounded-full px-1.5 py-0.5">{claims.length}</span>}
            </button>
            <button
              type="button"
              onClick={() => setAdminTab('orgs')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition ${adminTab === 'orgs' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              New Organizations {pendingOrgs.length > 0 && <span className="ml-1.5 bg-purple-600 text-white text-xs rounded-full px-1.5 py-0.5">{pendingOrgs.length}</span>}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-3" />
              Loading...
            </div>
          ) : adminTab === 'claims' ? (
            <div className="space-y-4">
              {claims.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <CheckCircle size={40} className="mx-auto mb-3 text-emerald-600/50" />
                  <p>No pending claim requests</p>
                </div>
              ) : claims.map(claim => (
                <div key={claim.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Building size={16} className="text-purple-400" />
                        <span className="font-semibold text-white">{claim.org_name || claim.organization_id}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-slate-400 mt-2">
                        <span><span className="text-slate-500">Name:</span> {claim.name}</span>
                        <span><span className="text-slate-500">Email:</span> {claim.email}</span>
                        <span><span className="text-slate-500">Role:</span> {claim.role}</span>
                        <span><span className="text-slate-500">Submitted:</span> {fmt(claim.created_at)}</span>
                      </div>
                      {claim.verification_doc && (
                        <p className="text-sm text-slate-400 mt-2"><span className="text-slate-500">Verification:</span> {claim.verification_doc}</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {rejectingId === claim.id ? (
                        <div className="flex flex-col gap-2 min-w-[220px]">
                          <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Rejection reason (optional)"
                            rows={2}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-purple-400"
                          />
                          <div className="flex gap-2">
                            <button type="button" onClick={() => reviewClaim(claim.id, 'reject')} disabled={!!processing} className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">
                              {processing === claim.id + 'reject' ? '...' : 'Confirm Reject'}
                            </button>
                            <button type="button" onClick={() => { setRejectingId(null); setRejectReason(''); }} className="px-3 py-1.5 bg-white/10 text-slate-300 rounded-lg text-sm transition hover:bg-white/20">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button type="button" onClick={() => reviewClaim(claim.id, 'approve')} disabled={!!processing} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">
                            {processing === claim.id + 'approve' ? '...' : 'Approve'}
                          </button>
                          <button type="button" onClick={() => setRejectingId(claim.id)} disabled={!!processing} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition disabled:opacity-50">
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {pendingOrgs.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <CheckCircle size={40} className="mx-auto mb-3 text-emerald-600/50" />
                  <p>No pending organization submissions</p>
                </div>
              ) : pendingOrgs.map(org => (
                <div key={org.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Globe size={16} className="text-purple-400" />
                        <span className="font-semibold text-white">{org.name}</span>
                        <span className="text-xs bg-white/10 text-slate-400 px-2 py-0.5 rounded-full">{org.type}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-slate-400 mt-2">
                        {org.country && <span><span className="text-slate-500">Country:</span> {org.country}</span>}
                        {org.submitter_name && <span><span className="text-slate-500">Submitted by:</span> {org.submitter_name}</span>}
                        {org.submitter_email && <span><span className="text-slate-500">Email:</span> {org.submitter_email}</span>}
                        {org.submitter_role && <span><span className="text-slate-500">Role:</span> {org.submitter_role}</span>}
                        <span><span className="text-slate-500">Date:</span> {fmt(org.created_at)}</span>
                      </div>
                      {org.description && <p className="text-sm text-slate-400 mt-2 line-clamp-2">{org.description}</p>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {rejectingId === org.id ? (
                        <div className="flex flex-col gap-2 min-w-[220px]">
                          <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Rejection reason (optional)"
                            rows={2}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-purple-400"
                          />
                          <div className="flex gap-2">
                            <button type="button" onClick={() => reviewOrg(org.id, 'reject')} disabled={!!processing} className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">
                              {processing === org.id + 'reject' ? '...' : 'Confirm Reject'}
                            </button>
                            <button type="button" onClick={() => { setRejectingId(null); setRejectReason(''); }} className="px-3 py-1.5 bg-white/10 text-slate-300 rounded-lg text-sm transition hover:bg-white/20">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button type="button" onClick={() => reviewOrg(org.id, 'approve')} disabled={!!processing} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">
                            {processing === org.id + 'approve' ? '...' : 'Approve'}
                          </button>
                          <button type="button" onClick={() => setRejectingId(org.id)} disabled={!!processing} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition disabled:opacity-50">
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── MY PROFILE PAGE ──────────────────────────────────────────────────────
  const MyProfilePage = () => {
    const [editMode, setEditMode] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [form, setForm] = React.useState({
      first_name: user?.user_metadata?.first_name || '',
      last_name: user?.user_metadata?.last_name || '',
      role: user?.user_metadata?.role || '',
      bio: user?.user_metadata?.bio || '',
      location: user?.user_metadata?.location || '',
      languages: user?.user_metadata?.languages || [],
      grade_levels: user?.user_metadata?.grade_levels || [],
      subjects: user?.user_metadata?.subjects || [],
      exchange_interests: user?.user_metadata?.exchange_interests || [],
    });

    const linkedOrg = organizations.find(o =>
      (user?.id && o.claimed_by === user.id) ||
      o.name?.toLowerCase() === (user?.user_metadata?.organization || '').toLowerCase()
    );

    const gradeOptions = ['K–2','3–5','6–8','9–12','Higher Ed','Adult'];
    const subjectOptions = ['English/Language Arts','Social Studies','History','Science','Math','Art','World Languages','PE/Health','Technology','Other'];
    const interestOptions = ['Pen-pal / Letter exchange','Live video exchange','Joint project','Cultural sharing','Debate / Discussion','Co-teaching','Research collaboration','Student mentoring'];

    const toggleArrayItem = (arr, item) =>
      arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

    const handleSave = async () => {
      setSaving(true);
      try {
        await supabase.auth.updateUser({ data: { ...user.user_metadata, ...form } });
        setUser(prev => ({ ...prev, user_metadata: { ...prev.user_metadata, ...form } }));
        setEditMode(false);
      } catch (err) {
        console.error('Profile save error:', err);
      } finally {
        setSaving(false);
      }
    };

    const initials = ((form.first_name?.[0] || '') + (form.last_name?.[0] || '')).toUpperCase() || (user?.email?.[0] || 'U').toUpperCase();

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 40%)' }}
          />
          <div className="relative max-w-5xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
              {/* Avatar with upload */}
              <div className="relative flex-shrink-0">
                <label className="cursor-pointer group block">
                  <div className="w-32 h-32 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-4xl font-bold overflow-hidden ring-4 ring-white/20 shadow-2xl">
                    {avatarUrl
                      ? <img src={avatarUrl} alt="profile" className="w-full h-full object-cover" />
                      : initials
                    }
                    <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      {avatarUploading
                        ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <div className="opacity-0 group-hover:opacity-100 transition text-white text-center">
                            <div className="text-2xl">📷</div>
                            <div className="text-xs mt-1">Change</div>
                          </div>
                      }
                    </div>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              </div>

              {/* Name / role / org */}
              <div className="flex-1">
                {editMode ? (
                  <div className="flex gap-3 mb-2">
                    <input value={form.first_name} onChange={e => setForm(f => ({...f, first_name: e.target.value}))}
                      className="bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-3 py-2 text-2xl font-light w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="First" />
                    <input value={form.last_name} onChange={e => setForm(f => ({...f, last_name: e.target.value}))}
                      className="bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-3 py-2 text-2xl font-light w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Last" />
                  </div>
                ) : (
                  <h1 className="text-4xl font-light text-white mb-1">{form.first_name} {form.last_name}</h1>
                )}
                {editMode ? (
                  <input value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))}
                    className="bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-3 py-1.5 text-sm w-64 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Your role (e.g. 8th Grade Social Studies Teacher)" />
                ) : (
                  <p className="text-blue-300 text-lg mb-3">{form.role || <span className="opacity-50 italic">Add your role</span>}</p>
                )}
                <div className="flex flex-wrap gap-3 items-center">
                  {linkedOrg && (
                    <button type="button" onClick={() => { setSelectedOrg(linkedOrg); setShowProfileModal(true); }}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-sm transition border border-white/20">
                      <Building size={14} />
                      {linkedOrg.name}
                      {linkedOrg.verified && <CheckCircle size={12} className="text-blue-300" />}
                    </button>
                  )}
                  {editMode ? (
                    <input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))}
                      className="bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="City, Country" />
                  ) : form.location ? (
                    <span className="flex items-center gap-1.5 text-white/70 text-sm"><Globe size={13} />{form.location}</span>
                  ) : null}
                  <span className="text-white/40 text-sm">Member since {new Date(user?.created_at || Date.now()).getFullYear()}</span>
                </div>
              </div>

              {/* Edit / Save buttons */}
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <button type="button" onClick={() => setEditMode(false)}
                      className="px-4 py-2 rounded-lg border border-white/30 text-white/80 text-sm hover:bg-white/10 transition">
                      Cancel
                    </button>
                    <button type="button" onClick={handleSave} disabled={saving}
                      className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium transition disabled:opacity-50">
                      {saving ? 'Saving…' : 'Save Profile'}
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setEditMode(true)}
                    className="px-5 py-2 rounded-lg border border-white/30 text-white text-sm hover:bg-white/10 transition">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left column — About + Languages */}
          <div className="md:col-span-2 space-y-8">
            {/* Bio */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">About</h2>
              {editMode ? (
                <textarea value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))}
                  rows={4} placeholder="Tell the community about yourself, your classroom, and why you're interested in virtual exchange…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
              ) : (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {form.bio || <span className="text-gray-400 italic">Click "Edit Profile" to add a bio.</span>}
                </p>
              )}
            </div>

            {/* Grade Levels */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Grade Levels</h2>
              {editMode ? (
                <div className="flex flex-wrap gap-2">
                  {gradeOptions.map(g => (
                    <button key={g} type="button"
                      onClick={() => setForm(f => ({...f, grade_levels: toggleArrayItem(f.grade_levels, g)}))}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${form.grade_levels.includes(g) ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              ) : form.grade_levels.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.grade_levels.map(g => <span key={g} className="px-3 py-1.5 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-100">{g}</span>)}
                </div>
              ) : (
                <p className="text-gray-400 italic text-sm">No grade levels added yet.</p>
              )}
            </div>

            {/* Subjects */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Subjects</h2>
              {editMode ? (
                <div className="flex flex-wrap gap-2">
                  {subjectOptions.map(s => (
                    <button key={s} type="button"
                      onClick={() => setForm(f => ({...f, subjects: toggleArrayItem(f.subjects, s)}))}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${form.subjects.includes(s) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              ) : form.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.subjects.map(s => <span key={s} className="px-3 py-1.5 rounded-full text-sm bg-indigo-50 text-indigo-700 border border-indigo-100">{s}</span>)}
                </div>
              ) : (
                <p className="text-gray-400 italic text-sm">No subjects added yet.</p>
              )}
            </div>

            {/* Exchange Interests */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Exchange Interests</h2>
              <p className="text-xs text-gray-400 mb-3">What kinds of exchanges are you looking for?</p>
              {editMode ? (
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map(i => (
                    <button key={i} type="button"
                      onClick={() => setForm(f => ({...f, exchange_interests: toggleArrayItem(f.exchange_interests, i)}))}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${form.exchange_interests.includes(i) ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
                      {i}
                    </button>
                  ))}
                </div>
              ) : form.exchange_interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.exchange_interests.map(i => <span key={i} className="px-3 py-1.5 rounded-full text-sm bg-emerald-50 text-emerald-700 border border-emerald-100">{i}</span>)}
                </div>
              ) : (
                <p className="text-gray-400 italic text-sm">No exchange interests added yet.</p>
              )}
            </div>
          </div>

          {/* Right column — Account + Org card */}
          <div className="space-y-6">
            {/* Account info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Account</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={15} className="text-gray-400" />
                  <span className="truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Shield size={15} className="text-gray-400" />
                  <span>Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Languages</h2>
              {editMode ? (
                <input
                  value={form.languages.join(', ')}
                  onChange={e => setForm(f => ({...f, languages: e.target.value.split(',').map(l => l.trim()).filter(Boolean)}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="English, Spanish, French…" />
              ) : form.languages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.languages.map(l => <span key={l} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600">{l}</span>)}
                </div>
              ) : (
                <p className="text-gray-400 italic text-sm">No languages added yet.</p>
              )}
            </div>

            {/* Linked org card */}
            {linkedOrg && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">My Organization</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Building size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-gray-800 text-sm">{linkedOrg.name}</h3>
                        {linkedOrg.verified && <CheckCircle size={13} className="text-blue-500" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{linkedOrg.type} · {linkedOrg.country}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{linkedOrg.description}</p>
                    </div>
                  </div>
                  <button type="button"
                    onClick={() => { setSelectedOrg(linkedOrg); setShowProfileModal(true); }}
                    className="mt-4 w-full px-4 py-2 rounded-lg border border-blue-200 text-blue-600 text-sm hover:bg-blue-50 transition">
                    View Full Profile →
                  </button>
                </div>
              </div>
            )}

            {!linkedOrg && (
              <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-6 text-center">
                <Building size={28} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">Not linked to an organization yet.</p>
                <button type="button" onClick={() => setActiveTab('browse')}
                  className="text-sm text-blue-600 hover:underline">Browse & Claim a Profile →</button>
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
                onClick={() => setActiveTab('donate')}
                className="font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Donate
              </button>
              {!user && (
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(true)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm"
                >
                  Get Started
                </button>
              )}
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold overflow-hidden">
                      {avatarUrl
                        ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        : (user.user_metadata?.first_name?.[0] || user.email?.[0] || 'U').toUpperCase()
                      }
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.user_metadata?.first_name || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <label className="flex items-center gap-3 cursor-pointer group" title="Click photo to change">
                            <div className="relative w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold overflow-hidden flex-shrink-0">
                              {avatarUrl
                                ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                : (user.user_metadata?.first_name?.[0] || user.email?.[0] || 'U').toUpperCase()
                              }
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                                {avatarUploading
                                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  : <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition">📷</span>
                                }
                              </div>
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                            <div>
                              <p className="text-sm font-medium text-gray-800">{user.user_metadata?.first_name} {user.user_metadata?.last_name}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</p>
                              <p className="text-xs text-blue-500 group-hover:underline">Change photo</p>
                            </div>
                          </label>
                        </div>
                        <button type="button" onClick={() => { setActiveTab('my-profile'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                          <User size={15} />
                          My Profile
                        </button>
                        <button type="button" onClick={() => { setActiveTab('inbox'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                          <MessageSquare size={15} />
                          Inbox
                          {unreadMessageCount > 0 && (
                            <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">{unreadMessageCount}</span>
                          )}
                        </button>
                        {myOrg ? (
                          <button type="button" onClick={openMyOrg} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                            <Building size={15} />
                            My Organization
                          </button>
                        ) : (
                          <button type="button" onClick={() => { setShowVerificationModal(true); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition flex items-center gap-2">
                            <Building size={15} />
                            Add Your Organization
                          </button>
                        )}
                        {isAdmin && (
                          <>
                            <div className="border-t border-gray-100 my-1" />
                            <button type="button" onClick={() => { setActiveTab('admin'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition flex items-center gap-2">
                              <Shield size={15} />
                              Admin Panel
                            </button>
                          </>
                        )}
                        <div className="border-t border-gray-100 my-1" />
                        <button type="button" onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2">
                          <Lock size={15} />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setShowAuthModal(true); }}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition"
                >
                  Sign In
                </button>
              )}
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

                {!user && (
                  <button
                    type="button"
                    onClick={() => { setShowVerificationModal(true); setShowMobileMenu(false); }}
                    className="w-full text-left px-4 py-3 rounded-lg font-medium transition text-gray-700 hover:bg-gray-50"
                  >
                    Get Started
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => { setActiveTab('donate'); setShowMobileMenu(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'donate' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Donate
                </button>

                {/* Auth Section */}
                <div className="pt-4 border-t border-gray-200">
                  {user ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold overflow-hidden">
                          {avatarUrl
                            ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                            : (user.user_metadata?.first_name?.[0] || user.email?.[0] || 'U').toUpperCase()
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{user.user_metadata?.first_name} {user.user_metadata?.last_name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setShowMobileMenu(false)} className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                        <User size={15} />
                        My Profile
                      </button>
                      {myOrg ? (
                        <button type="button" onClick={openMyOrg} className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                          <Building size={15} />
                          My Organization
                        </button>
                      ) : (
                        <button type="button" onClick={() => { setShowVerificationModal(true); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition flex items-center gap-2">
                          <Building size={15} />
                          Add Your Organization
                        </button>
                      )}
                      <button type="button" onClick={() => { handleSignOut(); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2">
                        <Lock size={15} />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signin'); setShowAuthModal(true); setShowMobileMenu(false); }}
                      className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Profile page — full width, outside main container */}
      {activeTab === 'my-profile' && user && <MyProfilePage />}

      {/* Admin panel — full width */}
      {activeTab === 'admin' && user && isAdmin && <AdminPanel />}

      {/* Inbox — full width */}
      {activeTab === 'inbox' && user && <Inbox />}

      {/* Privacy Policy */}
      {activeTab === 'privacy' && (
        <div className="max-w-3xl mx-auto px-6 py-12">
          <button type="button" onClick={() => setActiveTab('home')} className="text-sm text-blue-600 hover:underline mb-6 block">← Back to Home</button>
          <h1 className="text-3xl font-light text-gray-800 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Who We Are</h2>
              <p>The Virtual Exchange is a platform operated by MapWorks Learning, a nonprofit organization dedicated to connecting schools and organizations worldwide for virtual exchange programs. Our website is <strong>thevirtualexchange.org</strong>.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account information:</strong> name, email address, and password when you create an account</li>
                <li><strong>Organization information:</strong> details you provide when submitting or claiming an organization profile</li>
                <li><strong>Usage data:</strong> pages visited, searches performed, and connection requests sent</li>
                <li><strong>Profile data:</strong> bio, photo, grade levels, subjects, and exchange interests you add to your profile</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To operate and improve The Virtual Exchange platform</li>
                <li>To facilitate connection requests between organizations</li>
                <li>To verify organization profiles and process claim requests</li>
                <li>To send transactional emails (connection requests, verification, account notices)</li>
                <li>We do not sell your personal information to third parties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Third-Party Services</h2>
              <p>We use the following services to operate the platform:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Supabase</strong> — authentication and database hosting</li>
                <li><strong>Vercel</strong> — website hosting</li>
                <li><strong>Resend</strong> — transactional email delivery</li>
                <li><strong>Google OAuth</strong> — optional sign-in with Google (governed by Google's Privacy Policy)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Retention</h2>
              <p>We retain your account information for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <a href="mailto:hello@thevirtualexchange.org" className="text-blue-600 hover:underline">hello@thevirtualexchange.org</a>.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact</h2>
              <p>MapWorks Learning<br />
              hello@mapworkslearning.org<br />
              thevirtualexchange.org</p>
            </section>
          </div>
        </div>
      )}

      {/* Funder Journey — full page, no nav chrome */}
      {activeTab === 'funder-journey' && funderToken && <FunderJourneyPage token={funderToken} />}

      {/* Main Content */}
      {activeTab !== 'my-profile' && activeTab !== 'admin' && activeTab !== 'inbox' && activeTab !== 'privacy' && activeTab !== 'funder-journey' && (
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
      )}

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
      {showAuthModal && AuthModal()}
      {showConnectModal && selectedOrg && <ConnectModal org={selectedOrg} />}
      {showProfileModal && selectedOrg && <OrganizationProfileModal org={selectedOrg} />}
      {showVerificationModal && <VerificationModal />}
      {showLessonPlanModal && selectedLessonPlan && <LessonPlanModal />}
      {showResourceSubmitModal && <ResourceSubmitModal />}
      {showIntroductionRequestModal && selectedOrgForRequest && <IntroductionRequestModal />}
      {showFavoritesModal && <FavoritesModal />}
      {showClaimProfileModal && selectedOrgForRequest && <ClaimProfileModal />}
      {showEditOrgModal && selectedOrg && <EditOrgModal />}
      {showNewUserWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-light text-gray-800 mb-2">Welcome to The Virtual Exchange!</h3>
              <p className="text-gray-500 text-sm">You're signed in. Would you like to connect your organization?</p>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => { setShowNewUserWelcome(false); setShowVerificationModal(true); }}
                className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
              >
                Yes, get my organization verified
              </button>
              <button
                type="button"
                onClick={() => setShowNewUserWelcome(false)}
                className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                I'm just browsing for now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
};

export default VirtualExchangePlatform;