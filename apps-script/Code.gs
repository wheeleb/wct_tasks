/**
 * WCT Old Schoolhouse volunteer board: Google Sheet backend.
 *
 * Paste this whole file into Extensions > Apps Script of a Google Sheet,
 * then follow SHEET_SETUP.md. One row per task lives on the "Tasks" tab.
 * Volunteer email addresses and phone numbers are stored in the sheet but
 * are never sent to the website.
 */

const SHEET_NAME = 'Tasks';
const HEADERS = ['id', 'title', 'category', 'description', 'deliverable', 'targetDate', 'status', 'ownerName', 'ownerEmail', 'ownerPhone', 'helpers', 'updates'];
const STATUSES = ['Open', 'In Progress', 'Needs Help', 'Completed'];
const CATEGORIES = ['Fundraising', 'Communications', 'Website & Online', 'Architectural Review', 'Physical Work', 'Community Outreach', 'AI & Marketing'];

const SEED_TASKS = [
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

// Run this once from the editor to create the Tasks tab and fill it with the starter tasks.
function setup() {
  getSheet_();
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange(1, HEADERS.indexOf('targetDate') + 1, 1000, 1).setNumberFormat('@');
    const rows = SEED_TASKS.map(seedToRow_);
    sh.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
  }
  return sh;
}

function seedToRow_(t) {
  return [t.id, t.title, t.category, t.description, t.deliverable, t.targetDate || '', t.status || 'Open', '', '', '', '[]', '[]'];
}

function cell_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return v === null || v === undefined ? '' : String(v);
}

function parseJson_(v) {
  try {
    const a = JSON.parse(v);
    return Array.isArray(a) ? a : [];
  } catch (err) {
    return [];
  }
}

function readAll_(sh) {
  const values = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const v = values[i];
    if (!cell_(v[0])) continue;
    out.push({
      row: i + 1,
      id: cell_(v[0]),
      title: cell_(v[1]),
      category: cell_(v[2]),
      description: cell_(v[3]),
      deliverable: cell_(v[4]),
      targetDate: cell_(v[5]),
      status: cell_(v[6]) || 'Open',
      ownerName: cell_(v[7]),
      ownerEmail: cell_(v[8]),
      ownerPhone: cell_(v[9]),
      helpers: parseJson_(v[10]),
      updates: parseJson_(v[11])
    });
  }
  return out;
}

function rowValues_(r) {
  return [r.id, r.title, r.category, r.description, r.deliverable, r.targetDate, r.status, r.ownerName, r.ownerEmail, r.ownerPhone, JSON.stringify(r.helpers), JSON.stringify(r.updates)];
}

function saveRow_(sh, r) {
  sh.getRange(r.row, 1, 1, HEADERS.length).setValues([rowValues_(r)]);
}

// What the website is allowed to see: no emails, no phone numbers.
function publicTask_(r) {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    description: r.description,
    deliverable: r.deliverable,
    targetDate: r.targetDate || 'TBD',
    status: r.status,
    owner: r.ownerName ? { name: r.ownerName } : null,
    helpers: r.helpers.map(function (h) { return { name: h.name }; }),
    updates: r.updates.map(function (u) { return { id: u.id, author: u.author, text: u.text, date: u.date }; })
  };
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(s, max) {
  return String(s === null || s === undefined ? '' : s).trim().slice(0, max);
}

function today_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function addUpdate_(r, author, text) {
  r.updates.unshift({
    id: 'up-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    author: author,
    text: text,
    date: today_()
  });
  r.updates = r.updates.slice(0, 50);
}

function findRow_(rows, id) {
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].id === String(id)) return rows[i];
  }
  throw new Error('That task could not be found. Please refresh the page.');
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'list';
  if (action !== 'list') return json_({ ok: false, error: 'Unknown action' });
  return json_({ ok: true, tasks: readAll_(getSheet_()).map(publicTask_) });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const req = JSON.parse(e.postData.contents);
    const sh = getSheet_();
    const rows = readAll_(sh);
    if (req.action === 'signup') signup_(sh, rows, req);
    else if (req.action === 'update') update_(sh, rows, req);
    else if (req.action === 'addTask') addTask_(sh, req);
    else throw new Error('Unknown action');
    return json_({ ok: true, tasks: readAll_(sh).map(publicTask_) });
  } catch (err) {
    return json_({ ok: false, error: err.message });
  } finally {
    try { lock.releaseLock(); } catch (x) { /* not locked */ }
  }
}

function signup_(sh, rows, req) {
  const r = findRow_(rows, req.taskId);
  const name = clean_(req.name, 100);
  const email = clean_(req.email, 150);
  const phone = clean_(req.phone, 40);
  const note = clean_(req.note, 500);
  if (!name) throw new Error('Please provide your name.');
  if (!email && !phone) throw new Error('Please provide an email or phone number so we can reach you.');
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('That email address does not look right.');

  if (req.role === 'owner') {
    if (r.ownerName) throw new Error('Someone just signed up to lead this task. You can join as a helper instead.');
    r.ownerName = name;
    r.ownerEmail = email;
    r.ownerPhone = phone;
    if (r.status === 'Open') r.status = 'In Progress';
    addUpdate_(r, name, 'Stepped up as Lead Task Owner.' + (note ? ' Note: "' + note + '"' : ''));
  } else {
    if (r.helpers.length >= 20) throw new Error('This task already has plenty of helpers. Please pick another one.');
    r.helpers.push({ name: name, email: email, phone: phone, note: note, joinedAt: new Date().toISOString() });
    addUpdate_(r, name, 'Joined as helper.' + (note ? ' Note: "' + note + '"' : ''));
  }
  saveRow_(sh, r);
}

function update_(sh, rows, req) {
  const r = findRow_(rows, req.taskId);
  const status = String(req.status);
  const text = clean_(req.text, 1000);
  const author = clean_(req.author, 100) || 'Volunteer';
  if (STATUSES.indexOf(status) === -1) throw new Error('Please choose a valid status.');
  if (!text) throw new Error('Please enter a note or progress update.');
  r.status = status;
  addUpdate_(r, author, text);
  saveRow_(sh, r);
}

function addTask_(sh, req) {
  const adminKey = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
  if (!adminKey) throw new Error('Adding tasks from the website is turned off. Add a row in the Google Sheet instead.');
  if (req.key !== adminKey) throw new Error('That organizer passcode is not right.');

  const title = clean_(req.title, 150);
  const deliverable = clean_(req.deliverable, 300);
  const description = clean_(req.description, 1000);
  const category = String(req.category);
  const targetDate = clean_(req.targetDate, 10);
  const ownerName = clean_(req.ownerName, 100);
  const ownerEmail = clean_(req.ownerEmail, 150);
  if (!title || !deliverable) throw new Error('Task title and deliverable are required.');
  if (CATEGORIES.indexOf(category) === -1) throw new Error('Please choose a focus area from the list.');
  if (targetDate && !/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) throw new Error('Please use a valid target date.');

  const r = {
    id: 'task-' + Date.now(),
    title: title,
    category: category,
    description: description,
    deliverable: deliverable,
    targetDate: targetDate,
    status: ownerName ? 'In Progress' : 'Open',
    ownerName: ownerName,
    ownerEmail: ownerEmail,
    ownerPhone: '',
    helpers: [],
    updates: []
  };
  addUpdate_(r, 'WCT Organizer', 'Task added to community board.');
  const rowNum = sh.getLastRow() + 1;
  sh.getRange(rowNum, HEADERS.indexOf('targetDate') + 1).setNumberFormat('@');
  sh.getRange(rowNum, 1, 1, HEADERS.length).setValues([rowValues_(r)]);
}
