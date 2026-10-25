import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  Share2, 
  Printer, 
  LayoutGrid, 
  List, 
  Calendar, 
  CheckSquare, 
  Sparkles, 
  FileText, 
  Globe, 
  Wrench, 
  HeartHandshake, 
  Send, 
  MessageSquare, 
  X, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Edit3, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

// Google Sheet backend (see SHEET_SETUP.md). Without this address the page runs in preview mode.
const API_URL = import.meta.env.VITE_SHEET_API_URL;

async function callApi(body) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

// --- Default Preloaded WCT Schoolhouse Tasks ---
const INITIAL_TASKS = [
  {
    "id": "wct-task-1",
    "title": "Research Potential Donors & VT Grants",
    "category": "Fundraising",
    "description": "Research local businesses, alumni, historical organizations, and identify active Vermont preservation grants with upcoming application deadlines.",
    "deliverable": "Spreadsheet of 15+ potential donors & list of 3-5 open VT grants with application dates.",
    "targetDate": "2026-11-15",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  },
  {
    "id": "wct-task-2",
    "title": "Draft Donor Outreach Letters & Contact Lists",
    "category": "Fundraising",
    "description": "Help prepare clear, warm email, phone, and in-person outreach materials to invite community and donor support for the restoration.",
    "deliverable": "Draft outreach templates (email & letter) plus consolidated contact list.",
    "targetDate": "2026-11-30",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  },
  {
    "id": "wct-task-3",
    "title": "Fundraising Event Support & RSVP Lists",
    "category": "Fundraising",
    "description": "Assist with planning small community fundraising gatherings, welcome handouts, sign-in sheets, and following up with RSVPs.",
    "deliverable": "Event checklist, sign-in sheets, and volunteer schedule for our first gathering.",
    "targetDate": "2026-12-10",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  },
  {
    "id": "wct-task-4",
    "title": "Project Updates & Historical Photo Collection",
    "category": "Communications",
    "description": "Write short, engaging project updates for the community and gather archival photographs and stories of the schoolhouse from residents and alumni.",
    "deliverable": "Two short articles for town bulletin/press + digital folder of tagged historical photos.",
    "targetDate": "2026-11-20",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  },
  {
    "id": "wct-task-5",
    "title": "Flyers, Posters & Community Talking Points",
    "category": "Communications",
    "description": "Prepare printable flyers for town bulletin boards and simple talking points that WCT members and volunteers can use when talking to neighbors.",
    "deliverable": "Print-ready 1-page flyer + concise 5-point cheat sheet on project goals.",
    "targetDate": "2026-11-25",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  },
  {
    "id": "wct-task-6",
    "title": "Schoolhouse Restoration Webpage Hub",
    "category": "Website & Online",
    "description": "Review current wolcottcommunitytrust.com site and assist in laying out a dedicated Schoolhouse Restoration Hub page with timeline, photos, and donation link.",
    "deliverable": "Page wireframe, updated copy, and suggested media layout.",
    "targetDate": "2026-12-05",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  },
  {
    "id": "wct-task-7",
    "title": "Social Media & Email Newsletter Drafts",
    "category": "Website & Online",
    "description": "Prepare monthly updates for the WCT email list and craft 4-6 friendly social media posts announcing work sessions and volunteer shout-outs.",
    "deliverable": "4 ready-to-post social drafts + 1 monthly newsletter draft.",
    "targetDate": "2026-11-18",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  },
  {
    "id": "wct-task-8",
    "title": "Community-Friendly Architectural Summary",
    "category": "Architectural Review",
    "description": "Translate the architect’s technical plans and blueprints into everyday language and simple visuals that show what the renovated schoolhouse could become.",
    "deliverable": "1-page \"Before, After & Future Vision\" visual overview for town meetings.",
    "targetDate": "2026-12-01",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  },
  {
    "id": "wct-task-9",
    "title": "Independent Architectural Plan Review",
    "category": "Architectural Review",
    "description": "Review the architect plans critically with a neighbor architect or knowledgeable local builder and compile specific clarification questions.",
    "deliverable": "Written list of review notes, questions, and recommendations for the WCT board.",
    "targetDate": "2026-11-28",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  },
  {
    "id": "wct-task-10",
    "title": "Schoolhouse Clean-Out Crew Coordination",
    "category": "Physical Work",
    "description": "Break the interior clean-out project into small, manageable jobs and organize 2-3 volunteer work mornings rather than one overwhelming cleanup.",
    "deliverable": "Work crew plan, safety guidelines, and schedule for small team clean-out sessions.",
    "targetDate": "2026-11-10",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  },
  {
    "id": "wct-task-11",
    "title": "Historical Items Inventory & Photo Tagging",
    "category": "Physical Work",
    "description": "Carefully catalog, photograph, and label vintage fixtures, slate chalkboards, desks, and architectural salvage inside the building before work begins.",
    "deliverable": "Photo log and numbered inventory list with condition notes.",
    "targetDate": "2026-11-12",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  },
  {
    "id": "wct-task-12",
    "title": "Exterior Grounds & Brush Clearing",
    "category": "Physical Work",
    "description": "Trim encroaching brush, clear safety walkways around the perimeter, and prepare the exterior grounds for contractor and visitor access.",
    "deliverable": "Clean perimeter walkway and cleared brush piles prepped for chipping.",
    "targetDate": "2026-11-14",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  },
  {
    "id": "wct-task-13",
    "title": "Neighbor & Community Listening Sessions",
    "category": "Community Outreach",
    "description": "Meet with nearby neighbors and long-time residents to hear their thoughts, address questions, and gather local memories of the schoolhouse.",
    "deliverable": "Summary memo of 10 resident conversations with community feedback and interest.",
    "targetDate": "2026-12-15",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  },
  {
    "id": "wct-task-14",
    "title": "AI Media & Restoration Vision Renderings",
    "category": "AI & Marketing",
    "description": "Use AI tools to draft community flyers, generate conceptual visual renderings of the restored schoolhouse, and assemble a slideshow for meetings.",
    "deliverable": "3 visual vision concepts + draft slide presentation for the next public meeting.",
    "targetDate": "2026-11-22",
    "status": "Open",
    "owner": null,
    "helpers": [],
    "updates": []
  }
];

const CATEGORIES = [
  'All',
  'Fundraising',
  'Communications',
  'Website & Online',
  'Architectural Review',
  'Physical Work',
  'Community Outreach',
  'AI & Marketing'
];

const STATUS_OPTIONS = [
  'All',
  'Open',
  'In Progress',
  'Needs Help',
  'Completed'
];

export default function App() {
  const [tasks, setTasks] = useState(API_URL ? [] : INITIAL_TASKS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table', 'print'
  
  // Modals state
  const [signupModalTask, setSignupModalTask] = useState(null);
  const [statusModalTask, setStatusModalTask] = useState(null);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Expanded updates accordion state
  const [expandedCards, setExpandedCards] = useState({});

  const [loading, setLoading] = useState(!!API_URL);
  const [loadError, setLoadError] = useState('');

  // Show a momentary toast message
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load tasks from the Google Sheet, and refresh every minute
  useEffect(() => {
    if (!API_URL) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(API_URL + '?action=list');
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || 'Could not load tasks');
        if (!cancelled) {
          setTasks(data.tasks);
          setLoadError('');
        }
      } catch (e) {
        if (!cancelled) setLoadError('Could not load the latest tasks. Please refresh the page in a minute.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const timer = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  // Save a change. Returns null on success, or an error message to show in the form.
  const submitChange = async (action, payload, localTask, successMessage) => {
    if (!API_URL) {
      setTasks(prev => action === 'addTask' ? [localTask, ...prev] : prev.map(t => t.id === localTask.id ? localTask : t));
      triggerToast(successMessage);
      return null;
    }
    try {
      const data = await callApi({ action, ...payload });
      setTasks(data.tasks);
      triggerToast(successMessage);
      return null;
    } catch (e) {
      return e.message || 'Something went wrong. Please try again.';
    }
  };

  // Filter & Search Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesCategory = activeCategory === 'All' || task.category === activeCategory;
      const matchesStatus = activeStatus === 'All' || task.status === activeStatus;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        (task.deliverable && task.deliverable.toLowerCase().includes(query)) ||
        (task.owner && task.owner.name.toLowerCase().includes(query)) ||
        (task.helpers && task.helpers.some(h => h.name.toLowerCase().includes(query)));

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [tasks, activeCategory, activeStatus, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const open = tasks.filter(t => t.status === 'Open').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const needsHelp = tasks.filter(t => t.status === 'Needs Help').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    
    // Count unique volunteers
    const volunteerEmails = new Set();
    tasks.forEach(t => {
      if (t.owner?.email) volunteerEmails.add(t.owner.email);
      else if (t.owner?.name) volunteerEmails.add(t.owner.name);
      if (Array.isArray(t.helpers)) {
        t.helpers.forEach(h => {
          if (h.email) volunteerEmails.add(h.email);
          else if (h.name) volunteerEmails.add(h.name);
        });
      }
    });

    return { total, open, inProgress, needsHelp, completed, totalVolunteers: volunteerEmails.size };
  }, [tasks]);

  const toggleAccordion = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Needs Volunteer
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            In Progress
          </span>
        );
      case 'Needs Help':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-300 animate-pulse">
            <AlertCircle className="w-3 h-3 text-red-600" />
            Extra Help Needed
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  // Category badge colors
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Fundraising': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Communications': return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'Website & Online': return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'Architectural Review': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Physical Work': return 'bg-stone-200 text-stone-800 border-stone-400';
      case 'Community Outreach': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'AI & Marketing': return 'bg-pink-100 text-pink-900 border-pink-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 font-sans selection:bg-emerald-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-emerald-700 transition-all duration-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-emerald-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Trust Header */}
      <header className="bg-[#1b3d2f] text-white border-b-4 border-amber-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-[#275340] px-3 py-1 rounded-full text-xs font-semibold text-amber-200 tracking-wide uppercase">
                <Building2 className="w-3.5 h-3.5" />
                Wolcott Community Trust • Vermont
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-50 tracking-tight">
                Old Schoolhouse Project Volunteer Task Hub
              </h1>
              <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
                Breaking our larger restoration project into specific, bite-sized tasks that an individual volunteer or small team can take ownership of.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
              <button
                onClick={() => setEmbedModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#275340] hover:bg-[#326951] text-emerald-100 hover:text-white rounded-lg text-xs font-medium border border-emerald-700 transition-colors shadow-sm"
                title="Get WordPress iframe snippet"
              >
                <Share2 className="w-3.5 h-3.5" />
                WordPress Embed
              </button>

              <button
                onClick={() => setViewMode(viewMode === 'print' ? 'cards' : 'print')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors shadow-sm ${
                  viewMode === 'print' 
                    ? 'bg-amber-400 text-stone-900 font-semibold' 
                    : 'bg-[#275340] hover:bg-[#326951] text-emerald-100 hover:text-white border border-emerald-700'
                }`}
                title="Print friendly roster for committee meetings"
              >
                <Printer className="w-3.5 h-3.5" />
                {viewMode === 'print' ? 'Exit Print View' : 'Meeting / Print View'}
              </button>

              <button
                onClick={() => setNewTaskModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold rounded-lg text-xs shadow-md transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add New Task
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-emerald-800/80">
            <div className="bg-[#143025] p-3 rounded-lg border border-emerald-800/50">
              <span className="text-[11px] text-emerald-300 font-medium uppercase tracking-wider block">Total Tasks</span>
              <span className="text-xl font-bold text-white">{stats.total}</span>
            </div>
            <div className="bg-[#143025] p-3 rounded-lg border border-emerald-800/50">
              <span className="text-[11px] text-amber-300 font-medium uppercase tracking-wider block">Needs Lead</span>
              <span className="text-xl font-bold text-amber-300">{stats.open}</span>
            </div>
            <div className="bg-[#143025] p-3 rounded-lg border border-emerald-800/50">
              <span className="text-[11px] text-blue-300 font-medium uppercase tracking-wider block">In Progress</span>
              <span className="text-xl font-bold text-blue-200">{stats.inProgress}</span>
            </div>
            <div className="bg-[#143025] p-3 rounded-lg border border-emerald-800/50">
              <span className="text-[11px] text-red-300 font-medium uppercase tracking-wider block">Help Needed</span>
              <span className="text-xl font-bold text-rose-300">{stats.needsHelp}</span>
            </div>
            <div className="bg-[#143025] p-3 rounded-lg border border-emerald-800/50">
              <span className="text-[11px] text-emerald-300 font-medium uppercase tracking-wider block">Completed</span>
              <span className="text-xl font-bold text-emerald-300">{stats.completed}</span>
            </div>
            <div className="bg-[#143025] p-3 rounded-lg border border-emerald-800/50">
              <span className="text-[11px] text-amber-200 font-medium uppercase tracking-wider block">Active Volunteers</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="text-xl font-bold text-white">{stats.totalVolunteers}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {!API_URL && (
          <p className="mb-4 text-xs text-stone-500">Preview mode: sign-ups and updates are not being saved.</p>
        )}
        {loadError && (
          <p className="mb-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{loadError}</p>
        )}
        {loading && <p className="mb-4 text-sm text-stone-500">Loading tasks…</p>}

        {/* Core Philosophy Banner (From Meeting Document) */}
        <div className="mb-6 bg-amber-50/90 border border-amber-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-stone-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-200/80 rounded-lg text-amber-900 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider">The WCT Volunteer Principle</p>
              <p className="text-sm text-stone-700">
                Instead of asking <em>"Who wants to help with the schoolhouse?"</em>, we ask: 
                <strong className="text-stone-900 font-medium"> "What is one small project here you would be willing to own?"</strong> Each task has a clear deliverable and target date.
              </p>
            </div>
          </div>
          <a 
            href="https://www.wolcottcommunitytrust.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
          >
            Visit wolcottcommunitytrust.com
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Filter, Search & View Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search tasks, deliverables, or volunteer names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500 whitespace-nowrap">Status:</span>
              <select
                value={activeStatus}
                onChange={(e) => setActiveStatus(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2 font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Statuses' : status}
                  </option>
                ))}
              </select>
            </div>

            {/* View Switcher Buttons */}
            <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 shrink-0 self-start lg:self-auto">
              <button
                onClick={() => setViewMode('cards')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'cards' 
                    ? 'bg-white text-emerald-900 shadow-xs font-semibold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'table' 
                    ? 'bg-white text-emerald-900 shadow-xs font-semibold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Roster Table
              </button>
            </div>

          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-3 border-t border-stone-100 pb-1 scrollbar-thin">
            <span className="text-xs text-stone-500 font-medium mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" />
              Focus Area:
            </span>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border font-medium ${
                  activeCategory === category
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode 1: Cards View */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? null : filteredTasks.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl p-12 text-center border border-dashed border-stone-300">
                <HelpCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="text-base font-serif font-bold text-stone-700">No matching tasks found</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search query, or clear filters to see all Wolcott Community Trust restoration tasks.
                </p>
                <button
                  onClick={() => { setActiveCategory('All'); setActiveStatus('All'); setSearchQuery(''); }}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredTasks.map(task => {
                const isExpanded = !!expandedCards[task.id];
                const updateCount = task.updates ? task.updates.length : 0;

                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl border border-stone-200 hover:border-emerald-700/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Top Category & Status Header */}
                      <div className="p-4 pb-3 border-b border-stone-100 flex items-center justify-between gap-2">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(task.category)}`}>
                          {task.category}
                        </span>
                        {getStatusBadge(task.status)}
                      </div>

                      {/* Title & Description */}
                      <div className="p-4 space-y-3">
                        <h3 className="font-serif font-bold text-stone-900 text-base leading-snug hover:text-emerald-900 transition-colors">
                          {task.title}
                        </h3>
                        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Deliverable Box */}
                        <div className="bg-[#f7f5f0] border border-amber-200/80 rounded-lg p-2.5 text-xs text-stone-800">
                          <span className="font-semibold text-amber-900 block mb-0.5">🎯 Expected Deliverable:</span>
                          <span className="text-stone-700 font-medium">{task.deliverable}</span>
                        </div>

                        {/* Target Date */}
                        <div className="flex items-center gap-1.5 text-xs text-stone-500">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>Target Date: <strong className="text-stone-700 font-semibold">{task.targetDate || 'TBD'}</strong></span>
                        </div>

                        {/* Assigned Team & Helpers */}
                        <div className="pt-2 border-t border-stone-100 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-500 font-medium">Lead Owner:</span>
                            {task.owner ? (
                              <span className="font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                👤 {task.owner.name}
                              </span>
                            ) : (
                              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-200">
                                Position Open
                              </span>
                            )}
                          </div>

                          {task.helpers && task.helpers.length > 0 && (
                            <div className="flex items-start justify-between text-xs gap-2">
                              <span className="text-stone-500 font-medium shrink-0">Helpers ({task.helpers.length}):</span>
                              <div className="flex flex-wrap gap-1 justify-end">
                                {task.helpers.map((h, i) => (
                                  <span key={i} className="bg-stone-100 text-stone-700 text-[11px] px-1.5 py-0.5 rounded border border-stone-200">
                                    {h.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions & Updates Log */}
                    <div className="bg-stone-50/70 border-t border-stone-100 p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSignupModalTask(task)}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          {task.owner ? 'Join as Helper' : 'Take Ownership'}
                        </button>

                        <button
                          onClick={() => setStatusModalTask(task)}
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                          title="Post milestone or progress update"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                          <span>Update</span>
                        </button>
                      </div>

                      {/* Expandable Activity / Updates Accordion */}
                      {updateCount > 0 && (
                        <div className="pt-1">
                          <button
                            onClick={() => toggleAccordion(task.id)}
                            className="w-full flex items-center justify-between text-[11px] text-stone-500 hover:text-stone-700 font-medium py-1"
                          >
                            <span>{updateCount} progress note{updateCount > 1 ? 's' : ''}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-1 space-y-1.5 bg-white p-2.5 rounded-lg border border-stone-200 text-xs">
                              {task.updates.map((up) => (
                                <div key={up.id} className="border-b last:border-0 border-stone-100 pb-1.5 last:pb-0">
                                  <div className="flex items-center justify-between text-[10px] text-stone-400">
                                    <span className="font-semibold text-stone-700">{up.author}</span>
                                    <span>{up.date}</span>
                                  </div>
                                  <p className="text-stone-600 text-xs mt-0.5">{up.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* View Mode 2: Roster Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1b3d2f] text-stone-100 text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Task & Focus Area</th>
                    <th className="py-3.5 px-4">Deliverable</th>
                    <th className="py-3.5 px-3">Target Date</th>
                    <th className="py-3.5 px-3">Lead Owner</th>
                    <th className="py-3.5 px-3">Helpers</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-stone-400">
                        No tasks matching your current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map(task => (
                      <tr key={task.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-serif font-bold text-stone-900 text-sm mb-1">{task.title}</div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(task.category)}`}>
                            {task.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs text-stone-600 font-medium">
                          {task.deliverable}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap font-medium text-stone-800">
                          {task.targetDate || 'TBD'}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {task.owner ? (
                            <span className="font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {task.owner.name}
                            </span>
                          ) : (
                            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-200">
                              Needs Owner
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          {task.helpers && task.helpers.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {task.helpers.map((h, i) => (
                                <span key={i} className="bg-stone-100 text-stone-700 text-[10px] px-1.5 py-0.5 rounded">
                                  {h.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-stone-400 italic text-[11px]">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {getStatusBadge(task.status)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setSignupModalTask(task)}
                              className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold transition-colors"
                            >
                              Sign Up
                            </button>
                            <button
                              onClick={() => setStatusModalTask(task)}
                              className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs transition-colors"
                              title="Post update"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Mode 3: Print / Committee Meeting Layout */}
        {viewMode === 'print' && (
          <div className="bg-white rounded-xl shadow-lg border border-stone-300 p-8 print:p-0 print:border-none">
            <div className="flex items-center justify-between pb-6 border-b-2 border-stone-800 mb-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  Wolcott Community Trust — Old Schoolhouse Project
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  Volunteer Task Menu & Sign-up Roster • Meeting Handout
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="print:hidden inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>

            <p className="text-xs text-stone-700 mb-6 bg-stone-50 p-3 rounded-lg border border-stone-200">
              <strong>Meeting Goal:</strong> Each volunteer task below has a designated Deliverable and Target Date. We invite each attendee to choose <em>one specific small project</em> to lead or join as a helper.
            </p>

            <div className="space-y-6">
              {filteredTasks.map((task, idx) => (
                <div key={task.id} className="border border-stone-300 rounded-lg p-4 page-break-inside-avoid">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-500 text-sm">#{idx + 1}</span>
                        <h4 className="font-serif font-bold text-stone-900 text-base">{task.title}</h4>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-stone-100 border border-stone-300 rounded">
                          {task.category}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1.5">{task.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-stone-700 block">Target: {task.targetDate || 'TBD'}</span>
                      <span className="text-xs text-stone-500 font-medium">Status: {task.status}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-dashed border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-stone-800 block">Deliverable:</span>
                      <span className="text-stone-600">{task.deliverable}</span>
                    </div>
                    <div className="space-y-1">
                      <div>
                        <span className="font-semibold text-stone-800">Lead Owner: </span>
                        {task.owner ? (
                          <span className="font-medium text-emerald-900">{task.owner.name} ({task.owner.phone || task.owner.email})</span>
                        ) : (
                          <span className="inline-block border-b border-stone-400 w-48 text-transparent select-none">__________________</span>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-stone-800">Helpers: </span>
                        {task.helpers && task.helpers.length > 0 ? (
                          <span className="text-stone-700">{task.helpers.map(h => h.name).join(', ')}</span>
                        ) : (
                          <span className="inline-block border-b border-stone-400 w-48 text-transparent select-none">__________________</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-stone-300 text-center text-xs text-stone-500">
              Wolcott Community Trust • www.wolcottcommunitytrust.com • P.O. Box Wolcott, VT
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: Volunteer Sign-Up Modal */}
      {signupModalTask && (
        <SignupModal
          task={signupModalTask}
          onClose={() => setSignupModalTask(null)}
          onSuccess={async (updatedTask, payload) => {
            const err = await submitChange('signup', payload, updatedTask, `Thank you! You are now signed up for "${updatedTask.title}".`);
            if (!err) setSignupModalTask(null);
            return err;
          }}
        />
      )}

      {/* MODAL 2: Post Status & Note Update */}
      {statusModalTask && (
        <StatusModal
          task={statusModalTask}
          onClose={() => setStatusModalTask(null)}
          onSuccess={async (updatedTask, payload) => {
            const err = await submitChange('update', payload, updatedTask, `Status update logged for "${updatedTask.title}".`);
            if (!err) setStatusModalTask(null);
            return err;
          }}
        />
      )}

      {/* MODAL 3: Add New Task Modal */}
      {newTaskModalOpen && (
        <NewTaskModal
          onClose={() => setNewTaskModalOpen(false)}
          onSuccess={async (createdTask, payload) => {
            const err = await submitChange('addTask', payload, createdTask, `New task "${createdTask.title}" created successfully!`);
            if (!err) setNewTaskModalOpen(false);
            return err;
          }}
        />
      )}

      {/* MODAL 4: WordPress Embed Code Modal */}
      {embedModalOpen && (
        <WordPressEmbedModal onClose={() => setEmbedModalOpen(false)} />
      )}

      {/* Footer */}
      <footer className="mt-16 bg-[#143025] text-stone-300 text-xs py-8 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-serif font-bold text-stone-100 text-sm">Wolcott Community Trust — Old Schoolhouse Project</p>
          <p className="text-emerald-200/80">
            A Vermont non-profit community trust dedicated to preserving our town heritage and gathering spaces.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 text-stone-400">
            <a href="https://www.wolcottcommunitytrust.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">
              www.wolcottcommunitytrust.com
            </a>
            <span>•</span>
            <span>Volunteer Dashboard v2.0</span>
            <span>•</span>
            <button onClick={() => setEmbedModalOpen(true)} className="hover:text-amber-300 transition-colors">
              WordPress Embed Code
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS & MODALS
// ==========================================

// 1. Volunteer Sign-Up Modal
function SignupModal({ task, onClose, onSuccess }) {
  const [role, setRole] = useState(task.owner ? 'helper' : 'owner');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError('Please provide at least an email or phone number so we can reach you.');
      return;
    }

    const updatedTask = { ...task };

    if (role === 'owner') {
      updatedTask.owner = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        signedUpAt: new Date().toISOString()
      };
      if (updatedTask.status === 'Open') {
        updatedTask.status = 'In Progress';
      }
    } else {
      const currentHelpers = Array.isArray(updatedTask.helpers) ? [...updatedTask.helpers] : [];
      currentHelpers.push({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        note: note.trim(),
        joinedAt: new Date().toISOString()
      });
      updatedTask.helpers = currentHelpers;
    }

    // Add entry into update log
    const updates = Array.isArray(updatedTask.updates) ? [...updatedTask.updates] : [];
    updates.unshift({
      id: 'up-' + Date.now(),
      author: name.trim(),
      text: role === 'owner' 
        ? `Stepped up as Lead Task Owner. ${note ? `Note: "${note}"` : ''}` 
        : `Joined as helper. ${note ? `Note: "${note}"` : ''}`,
      date: new Date().toISOString().split('T')[0]
    });
    updatedTask.updates = updates;

    setBusy(true);
    const err = await onSuccess(updatedTask, { taskId: task.id, role, name: name.trim(), email: email.trim(), phone: phone.trim(), note: note.trim() });
    if (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#1b3d2f] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif font-bold text-lg">Volunteer Sign-Up</h3>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-50/80 p-3 rounded-lg border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider block">Selected Task:</span>
            <p className="font-serif font-bold text-stone-900 text-sm mt-0.5">{task.title}</p>
            <p className="text-xs text-stone-600 mt-1">🎯 <strong>Deliverable:</strong> {task.deliverable}</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Choice */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">How would you like to contribute?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  role === 'owner'
                    ? 'border-emerald-800 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-800/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white text-stone-600'
                }`}
              >
                <div className="font-bold text-xs">Lead Task Owner</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Take responsibility for getting the deliverable done.</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('helper')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  role === 'helper'
                    ? 'border-emerald-800 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-800/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white text-stone-600'
                }`}
              >
                <div className="font-bold text-xs">Helper / Contributor</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Assist the lead with research, hands, or ideas.</div>
              </button>
            </div>
          </div>

          {/* Personal Info */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
              <input
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                placeholder="802-555-0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Availability or Brief Note (Optional, visible to everyone)</label>
            <textarea
              rows="2"
              placeholder="e.g., Available weekends or Tuesday evenings; have experience with grant spreadsheets..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="disabled:opacity-60 px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors"
            >
              Confirm Volunteer Sign-Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. Post Status / Log Modal
function StatusModal({ task, onClose, onSuccess }) {
  const [newStatus, setNewStatus] = useState(task.status);
  const [authorName, setAuthorName] = useState(task.owner?.name || '');
  const [updateText, setUpdateText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!updateText.trim()) {
      setError('Please enter a note or progress update.');
      return;
    }

    const updatedTask = { ...task };
    updatedTask.status = newStatus;

    const currentUpdates = Array.isArray(updatedTask.updates) ? [...updatedTask.updates] : [];
    currentUpdates.unshift({
      id: 'up-' + Date.now(),
      author: authorName.trim() || 'Volunteer',
      text: updateText.trim(),
      date: new Date().toISOString().split('T')[0]
    });
    updatedTask.updates = currentUpdates;

    setBusy(true);
    const err = await onSuccess(updatedTask, { taskId: task.id, status: newStatus, author: authorName.trim(), text: updateText.trim() });
    if (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#1b3d2f] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif font-bold text-lg">Post Progress / Status</h3>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Task</span>
            <p className="font-serif font-bold text-stone-900 text-sm mt-0.5">{task.title}</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Update Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
            >
              <option value="Open">Needs Volunteer (Open)</option>
              <option value="In Progress">In Progress</option>
              <option value="Needs Help">Needs Help / Blocked</option>
              <option value="Completed">Completed / Deliverable Ready</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
            <input
              type="text"
              placeholder="e.g., Jane Smith"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Progress Note / Milestone *</label>
            <textarea
              rows="3"
              required
              placeholder="What did you accomplish, what questions arose, or what support is needed next?"
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="disabled:opacity-60 px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors"
            >
              Post Status Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. Add New Task Modal
function NewTaskModal({ onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fundraising');
  const [description, setDescription] = useState('');
  const [deliverable, setDeliverable] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !deliverable.trim()) {
      setError('Task Title and Concrete Deliverable are required.');
      return;
    }

    const newTask = {
      id: 'task-' + Date.now(),
      title: title.trim(),
      category,
      description: description.trim(),
      deliverable: deliverable.trim(),
      targetDate: targetDate || 'TBD',
      status: ownerName.trim() ? 'In Progress' : 'Open',
      owner: ownerName.trim() ? { name: ownerName.trim(), email: ownerEmail.trim() } : null,
      helpers: [],
      updates: [
        {
          id: 'up-' + Date.now(),
          author: 'WCT Organizer',
          text: 'Task added to community board.',
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };

    setBusy(true);
    const err = await onSuccess(newTask, { title: title.trim(), category, description: description.trim(), deliverable: deliverable.trim(), targetDate, ownerName: ownerName.trim(), ownerEmail: ownerEmail.trim(), key: passcode });
    if (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#1b3d2f] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif font-bold text-lg">Add New Volunteer Task</h3>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Paint window sills or Draft grant narrative"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Focus Area / Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Completion Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Concrete Deliverable *</label>
            <input
              type="text"
              required
              placeholder="What tangible output will they produce? (e.g., 2 drafts, list of 10 names)"
              value={deliverable}
              onChange={(e) => setDeliverable(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Task Description</label>
            <textarea
              rows="3"
              placeholder="Explain what needs to be done in simple, clear steps..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Organizer Passcode{API_URL ? ' *' : ''}</label>
            <input
              type="password"
              required={!!API_URL}
              placeholder="Only WCT organizers can add tasks"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
            />
          </div>

          <div className="pt-2 border-t border-stone-100">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">Pre-assign an Owner (Optional)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Owner Name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
              <input
                type="email"
                placeholder="Owner Email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="disabled:opacity-60 px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 4. WordPress Embed Code Modal
function WordPressEmbedModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://your-domain.com/wct-dashboard';

  const embedCode = `<!-- Wolcott Community Trust Volunteer Dashboard Embed -->
<div style="width: 100%; max-width: 1200px; margin: 0 auto; overflow: hidden; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
  <iframe 
    src="${currentUrl}" 
    width="100%" 
    height="900" 
    frameborder="0" 
    style="border: none; display: block;"
    allow="clipboard-write"
    title="WCT Old Schoolhouse Volunteer Task Dashboard"
  ></iframe>
</div>`;

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#1b3d2f] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif font-bold text-lg">Embed in WordPress Site</h3>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            You can embed this volunteer dashboard directly into your WordPress site at <strong>wolcottcommunitytrust.com</strong>.
          </p>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider">How to add in WordPress:</span>
            <ol className="text-xs text-stone-600 list-decimal list-inside space-y-1 bg-stone-50 p-3 rounded-lg border border-stone-200">
              <li>Log in to your WordPress dashboard.</li>
              <li>Go to <strong>Pages &gt; Add New</strong> (or edit your Schoolhouse page).</li>
              <li>Add a <strong>"Custom HTML"</strong> block.</li>
              <li>Paste the code snippet below and click <strong>Publish / Update</strong>.</li>
            </ol>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-stone-700">HTML Embed Code</span>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-stone-900 text-stone-100 p-3 rounded-lg text-[11px] font-mono overflow-x-auto select-all leading-normal">
              {embedCode}
            </pre>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}