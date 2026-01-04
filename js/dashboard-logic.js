// Dashboard Logic for COMMOTION.APP
// Handles role-based content rendering with full interactivity

// Check authentication
const userRole = localStorage.getItem('userRole');
const userName = localStorage.getItem('userName');
const userId = localStorage.getItem('userId');
const clientId = localStorage.getItem('clientId');
const crewId = localStorage.getItem('crewId');

if (!userRole || !userName) {
    window.location.href = 'index.html';
}

document.getElementById('userName').textContent = userName;
document.getElementById('userRole').textContent = userRole;

// Calendar state
let currentCalendarDate = new Date(2025, 0, 5);
let calendarView = 'month';

// Global Firestore data storage
let FIRESTORE_DATA = {
    events: [],
    crew: [],
    gear: [],
    clients: [],
    tasks: []
};

// Load data from Firestore
async function loadFirestoreData() {
    try {
        const [events, crew, gear, clients, tasks] = await Promise.all([
            firestoreHelpers.getCollection('events'),
            firestoreHelpers.getCollection('crew'),
            firestoreHelpers.getCollection('gear'),
            firestoreHelpers.getCollection('clients'),
            firestoreHelpers.getCollection('tasks')
        ]);
        
        FIRESTORE_DATA.events = events;
        FIRESTORE_DATA.crew = crew;
        FIRESTORE_DATA.gear = gear;
        FIRESTORE_DATA.clients = clients;
        FIRESTORE_DATA.tasks = tasks;
        
        return true;
    } catch (error) {
        console.error('Error loading Firestore data:', error);
        return false;
    }
}

// Initialize dashboard
async function initDashboard() {
    const loaded = await loadFirestoreData();
    
    if (!loaded) {
        document.getElementById('dashboardContent').innerHTML = `
            <div class="max-w-2xl mx-auto px-4 py-16 text-center">
                <i class="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
                <p class="text-gray-600 mb-4">Could not load data from database.</p>
                <button onclick="window.location.reload()" class="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">Retry</button>
            </div>
        `;
        return;
    }
    
    // Load appropriate dashboard based on role
    if (userRole === 'admin') {
        loadAdminDashboard();
    } else if (userRole === 'client') {
        loadClientDashboard();
    } else if (userRole === 'crew') {
        loadCrewDashboard();
    }
}

// Start initialization
initDashboard();

function loadAdminDashboard() {
    const totalGearValue = FIRESTORE_DATA.gear.reduce((sum, g) => sum + g.value, 0);
    const activeEvents = FIRESTORE_DATA.events.filter(e => e.status !== 'completed' && e.status !== 'cancelled').length;
    const availableCrew = FIRESTORE_DATA.crew.filter(c => c.available).length;
    
    document.getElementById('dashboardContent').innerHTML = `
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
            
            <div class="mb-6 sm:mb-8">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p class="text-gray-600 mt-1 text-sm sm:text-base">Welcome back, ${userName}.</p>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                <div class="stat-card bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 cursor-pointer" onclick="showStatDetail('revenue')">
                    <div class="flex items-center justify-between">
                        <div class="min-w-0 flex-1">
                            <p class="text-xs sm:text-sm font-medium text-gray-600">Revenue</p>
                            <p class="text-lg sm:text-2xl font-bold text-gray-900 mt-1">$142,300</p>
                            <p class="text-xs text-green-600 mt-1 hidden sm:block"><i class="fas fa-arrow-up"></i> 12%</p>
                        </div>
                        <div class="bg-green-100 rounded-full p-2 sm:p-3 ml-2"><i class="fas fa-dollar-sign text-green-600 text-sm sm:text-xl"></i></div>
                    </div>
                </div>
                <div class="stat-card bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 cursor-pointer" onclick="showStatDetail('events')">
                    <div class="flex items-center justify-between">
                        <div class="min-w-0 flex-1">
                            <p class="text-xs sm:text-sm font-medium text-gray-600">Events</p>
                            <p class="text-lg sm:text-2xl font-bold text-gray-900 mt-1">${activeEvents}</p>
                            <p class="text-xs text-blue-600 mt-1 hidden sm:block"><i class="fas fa-calendar-check"></i> Active</p>
                        </div>
                        <div class="bg-blue-100 rounded-full p-2 sm:p-3 ml-2"><i class="fas fa-calendar-alt text-blue-600 text-sm sm:text-xl"></i></div>
                    </div>
                </div>
                <div class="stat-card bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 cursor-pointer" onclick="showStatDetail('crew')">
                    <div class="flex items-center justify-between">
                        <div class="min-w-0 flex-1">
                            <p class="text-xs sm:text-sm font-medium text-gray-600">Crew</p>
                            <p class="text-lg sm:text-2xl font-bold text-gray-900 mt-1">${FIRESTORE_DATA.crew.length}</p>
                            <p class="text-xs commotion-red mt-1 hidden sm:block"><i class="fas fa-user-check"></i> ${availableCrew} free</p>
                        </div>
                        <div class="bg-red-100 rounded-full p-2 sm:p-3 ml-2"><i class="fas fa-users commotion-red text-sm sm:text-xl"></i></div>
                    </div>
                </div>
                <div class="stat-card bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 cursor-pointer" onclick="showStatDetail('gear')">
                    <div class="flex items-center justify-between">
                        <div class="min-w-0 flex-1">
                            <p class="text-xs sm:text-sm font-medium text-gray-600">Gear</p>
                            <p class="text-lg sm:text-2xl font-bold text-gray-900 mt-1">$${totalGearValue.toLocaleString()}</p>
                            <p class="text-xs text-orange-600 mt-1 hidden sm:block"><i class="fas fa-shield-alt"></i> Insured</p>
                        </div>
                        <div class="bg-orange-100 rounded-full p-2 sm:p-3 ml-2"><i class="fas fa-camera text-orange-600 text-sm sm:text-xl"></i></div>
                    </div>
                </div>
            </div>

            <!-- Main Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                <div class="lg:col-span-2">
                    <!-- Calendar -->
                    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                            <h2 class="text-lg sm:text-xl font-bold text-gray-900"><i class="fas fa-calendar-alt mr-2 commotion-red"></i>Calendar</h2>
                            <div class="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                                <div class="flex bg-gray-100 rounded-lg p-1">
                                    <button onclick="setCalendarView('week')" id="weekViewBtn" class="px-2 py-1 text-xs rounded-md">Week</button>
                                    <button onclick="setCalendarView('month')" id="monthViewBtn" class="px-2 py-1 text-xs rounded-md bg-white shadow-sm font-semibold">Month</button>
                                </div>
                                <div class="flex items-center gap-1 ml-auto sm:ml-0">
                                    <button onclick="navigateCalendar(-1)" class="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"><i class="fas fa-chevron-left"></i></button>
                                    <span class="px-2 py-1 text-xs sm:text-sm font-semibold min-w-[90px] text-center" id="calendarTitle"></span>
                                    <button onclick="navigateCalendar(1)" class="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"><i class="fas fa-chevron-right"></i></button>
                                </div>
                            </div>
                        </div>
                        <div id="calendarContainer" class="overflow-x-auto"></div>
                    </div>

                    <!-- Events List -->
                    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mt-4">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                            <h2 class="text-lg sm:text-xl font-bold text-gray-900"><i class="fas fa-list mr-2 commotion-red"></i>All Events</h2>
                            <button onclick="window.location.href='gear.html'" class="w-full sm:w-auto px-4 py-2 bg-commotion-red hover-commotion-red text-white rounded-lg text-sm font-semibold"><i class="fas fa-camera mr-2"></i>View Gear</button>
                        </div>
                        <div id="allEvents" class="space-y-3 max-h-96 overflow-y-auto"></div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-4">
                    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                        <h2 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div class="space-y-2">
                            <button onclick="showModal('newEvent')" class="w-full bg-commotion-red hover-commotion-red text-white rounded-lg py-3 px-4 flex items-center justify-between text-sm"><span><i class="fas fa-plus mr-2"></i>New Event</span><i class="fas fa-arrow-right"></i></button>
                            <button onclick="showModal('manageCrew')" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-3 px-4 text-sm"><i class="fas fa-users mr-2"></i>Manage Crew</button>
                            <button onclick="window.location.href='gear.html'" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-3 px-4 text-sm"><i class="fas fa-camera mr-2"></i>Manage Gear</button>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                        <h2 class="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                        <div class="space-y-3">
                            <div class="flex items-start"><div class="bg-green-100 rounded-full p-2 mr-3"><i class="fas fa-check text-green-600 text-xs"></i></div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-gray-900">Payment received</p><p class="text-xs text-gray-500">Festival One - $9,800</p></div></div>
                            <div class="flex items-start"><div class="bg-blue-100 rounded-full p-2 mr-3"><i class="fas fa-user text-blue-600 text-xs"></i></div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-gray-900">Crew confirmed</p><p class="text-xs text-gray-500">Sam King - R&A</p></div></div>
                            <div class="flex items-start"><div class="bg-red-100 rounded-full p-2 mr-3"><i class="fas fa-calendar commotion-red text-xs"></i></div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-gray-900">New booking</p><p class="text-xs text-gray-500">Splore 2025</p></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="modalOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden items-center justify-center p-4" onclick="if(event.target===this)closeModal()">
            <div id="modalContent" class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"></div>
        </div>
    `;
    renderCalendar();
    renderAllEvents();
}

function loadClientDashboard() {
    const clientEvents = FIRESTORE_DATA.events.filter(e => e.client_id === clientId);
    const mainEvent = clientEvents[0];
    
    if (!mainEvent) {
        document.getElementById('dashboardContent').innerHTML = `<div class="max-w-7xl mx-auto px-4 py-16 text-center"><i class="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i><h2 class="text-2xl font-bold text-gray-900">No Events Assigned</h2><p class="text-gray-600 mt-2">Contact Commotion Studio to book your event.</p></div>`;
        return;
    }

    document.getElementById('dashboardContent').innerHTML = `
        <div class="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
            <div class="mb-6"><h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Client Portal</h1><p class="text-gray-600 mt-1">Welcome back, ${userName}.</p></div>
            
            <!-- Event Overview -->
            <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-gray-100">
                <div class="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
                    <div>
                        <div class="flex flex-wrap items-center gap-2 mb-2">
                            <h2 class="text-xl sm:text-2xl font-bold text-gray-900">${mainEvent.name}</h2>
                            <span class="px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusBadgeClass(mainEvent.status)}">${getStatusLabel(mainEvent.status)}</span>
                        </div>
                        <div class="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span><i class="fas fa-map-marker-alt commotion-red mr-1"></i>${mainEvent.location}</span>
                            <span><i class="fas fa-calendar commotion-red mr-1"></i>${formatDateRange(mainEvent.startDate, mainEvent.endDate)}</span>
                        </div>
                    </div>
                    <button onclick="showModal('editSchedule', '${mainEvent.id}')" class="w-full sm:w-auto px-4 py-2 bg-commotion-red text-white rounded-lg text-sm font-semibold"><i class="fas fa-calendar-alt mr-2"></i>View Schedule</button>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <div class="text-center p-3 bg-gray-50 rounded-lg"><p class="text-lg sm:text-2xl font-bold text-gray-900">$${mainEvent.quoteAmount.toLocaleString()}</p><p class="text-xs text-gray-600">Quote</p></div>
                    <div class="text-center p-3 bg-gray-50 rounded-lg"><p class="text-lg sm:text-2xl font-bold text-green-600">$${mainEvent.paidAmount.toLocaleString()}</p><p class="text-xs text-gray-600">Paid</p></div>
                    <div class="text-center p-3 bg-gray-50 rounded-lg"><p class="text-lg sm:text-2xl font-bold text-gray-900">${mainEvent.crewCount}</p><p class="text-xs text-gray-600">Crew</p></div>
                    <div class="text-center p-3 bg-gray-50 rounded-lg"><p class="text-lg sm:text-2xl font-bold commotion-red">${Math.round(mainEvent.paidAmount / mainEvent.quoteAmount * 100)}%</p><p class="text-xs text-gray-600">Complete</p></div>
                </div>
            </div>

            <!-- Schedule Section -->
            <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-gray-100">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold text-gray-900"><i class="fas fa-clock mr-2 commotion-red"></i>Event Schedule</h3>
                    <button onclick="showModal('editSchedule', '${mainEvent.id}')" class="text-sm text-red-600 hover:text-red-700 font-semibold"><i class="fas fa-edit mr-1"></i>Edit</button>
                </div>
                ${renderEventSchedule(mainEvent)}
            </div>

            <!-- Deliverables -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <h3 class="text-lg font-bold text-gray-900 mb-4"><i class="fas fa-film mr-2 commotion-red"></i>Deliverables</h3>
                    <div class="space-y-3">
                        ${mainEvent.deliverables.map(d => `
                            <div class="p-3 bg-gray-50 rounded-lg">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-semibold text-gray-900 text-sm">${d.type}</h4>
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(d.status)}">${getStatusLabel(d.status)}</span>
                                </div>
                                <p class="text-xs text-gray-600">Due: ${new Date(d.dueDate).toLocaleDateString('en-NZ', {month: 'short', day: 'numeric'})}</p>
                                <div class="mt-2 bg-gray-200 rounded-full h-2"><div class="bg-commotion-red h-2 rounded-full" style="width: ${d.progress || 0}%"></div></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <h3 class="text-lg font-bold text-gray-900 mb-4"><i class="fas fa-dollar-sign mr-2 commotion-red"></i>Payment</h3>
                    <div class="mb-4">
                        <div class="flex justify-between text-sm mb-2"><span>Progress</span><span class="font-semibold">${Math.round(mainEvent.paidAmount / mainEvent.quoteAmount * 100)}%</span></div>
                        <div class="bg-gray-200 rounded-full h-3"><div class="bg-green-500 h-3 rounded-full" style="width: ${mainEvent.paidAmount / mainEvent.quoteAmount * 100}%"></div></div>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between"><span class="text-gray-600">Quote:</span><span class="font-semibold">$${mainEvent.quoteAmount.toLocaleString()}</span></div>
                        <div class="flex justify-between"><span class="text-gray-600">Paid:</span><span class="text-green-600 font-semibold">$${mainEvent.paidAmount.toLocaleString()}</span></div>
                        <div class="flex justify-between border-t pt-2"><span class="font-semibold">Remaining:</span><span class="font-bold commotion-red">$${(mainEvent.quoteAmount - mainEvent.paidAmount).toLocaleString()}</span></div>
                    </div>
                </div>
            </div>

            <!-- Crew Contact Info -->
            ${mainEvent.crewAssigned && mainEvent.crewAssigned.length > 0 ? `
                <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mt-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4"><i class="fas fa-users mr-2 commotion-red"></i>Your Crew</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        ${mainEvent.crewAssigned.map(cId => {
                            const crew = FIRESTORE_DATA.crew.find(c => c.id === cId);
                            if (!crew) return '';
                            return `
                                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <div class="w-10 h-10 rounded-full bg-commotion-red text-white flex items-center justify-center font-bold mr-3 flex-shrink-0">${crew.name.split(' ').map(n => n[0]).join('')}</div>
                                    <div class="min-w-0 flex-1">
                                        <h4 class="font-semibold text-gray-900 text-sm">${crew.name}</h4>
                                        <p class="text-xs text-gray-500">${crew.role}</p>
                                        <div class="flex flex-wrap gap-2 mt-1">
                                            <a href="tel:${crew.phone}" class="text-xs text-blue-600 hover:underline"><i class="fas fa-phone mr-1"></i>${crew.phone}</a>
                                            <a href="mailto:${crew.email}" class="text-xs text-blue-600 hover:underline"><i class="fas fa-envelope mr-1"></i>Email</a>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
        <div id="modalOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden items-center justify-center p-4" onclick="if(event.target===this)closeModal()">
            <div id="modalContent" class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"></div>
        </div>
    `;
}

function loadCrewDashboard() {
    const crewMember = FIRESTORE_DATA.crew.find(c => c.id === crewId) || { name: userName, role: 'Crew', rate: 350 };
    const assignedEvents = FIRESTORE_DATA.events.filter(e => e.crewAssigned && e.crewAssigned.includes(crewId));
    const assignedTasks = FIRESTORE_DATA.tasks.filter(t => t.assignedTo === crewId);
    const myGear = FIRESTORE_DATA.gear.filter(g => g.ownerId === crewId);
    const pendingTasks = assignedTasks.filter(t => t.status !== 'done').length;
    const upcomingEvents = assignedEvents.filter(e => new Date(e.startDate) > new Date('2025-01-03')).length;

    document.getElementById('dashboardContent').innerHTML = `
        <div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
            <div class="mb-6"><h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Crew Portal</h1><p class="text-gray-600 mt-1">Welcome back, ${userName}.</p></div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-3 sm:gap-6 mb-6">
                <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div><p class="text-xs sm:text-sm font-medium text-gray-600">Events</p><p class="text-lg sm:text-2xl font-bold text-gray-900 mt-1">${upcomingEvents}</p></div>
                        <div class="bg-blue-100 rounded-full p-2 sm:p-3"><i class="fas fa-calendar-check text-blue-600 text-sm sm:text-xl"></i></div>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div><p class="text-xs sm:text-sm font-medium text-gray-600">Tasks</p><p class="text-lg sm:text-2xl font-bold text-gray-900 mt-1">${pendingTasks}</p></div>
                        <div class="bg-orange-100 rounded-full p-2 sm:p-3"><i class="fas fa-tasks text-orange-600 text-sm sm:text-xl"></i></div>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div><p class="text-xs sm:text-sm font-medium text-gray-600">Rate</p><p class="text-lg sm:text-2xl font-bold text-gray-900 mt-1">$${crewMember.rate}</p></div>
                        <div class="bg-green-100 rounded-full p-2 sm:p-3"><i class="fas fa-dollar-sign text-green-600 text-sm sm:text-xl"></i></div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <!-- My Events -->
                <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <h2 class="text-lg font-bold text-gray-900 mb-4"><i class="fas fa-calendar-alt mr-2 commotion-red"></i>My Events</h2>
                    ${assignedEvents.length > 0 ? `
                        <div class="space-y-3">
                            ${assignedEvents.map(event => `
                                <div class="event-card bg-white rounded-lg p-4 border-l-4 cursor-pointer" style="border-left-color: ${event.color}" onclick="showModal('eventSchedule', '${event.id}')">
                                    <div class="flex justify-between items-start mb-2">
                                        <h3 class="font-semibold text-gray-900 text-sm">${event.name}</h3>
                                        <span class="px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(event.status)}">${getStatusLabel(event.status)}</span>
                                    </div>
                                    <div class="text-xs text-gray-600 space-y-1">
                                        <div><i class="fas fa-map-marker-alt text-gray-400 w-4"></i> ${event.location}</div>
                                        <div><i class="fas fa-calendar text-gray-400 w-4"></i> ${formatDateRange(event.startDate, event.endDate)}</div>
                                    </div>
                                    <div class="mt-2 pt-2 border-t flex justify-between text-xs">
                                        <span class="text-gray-500">${Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24)) + 1} days</span>
                                        <span class="font-semibold commotion-red">$${crewMember.rate * (Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24)) + 1)}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `<div class="text-center py-8 text-gray-500"><i class="fas fa-calendar-times text-4xl mb-3"></i><p>No events assigned</p></div>`}
                </div>

                <!-- My Tasks -->
                <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <h2 class="text-lg font-bold text-gray-900 mb-4"><i class="fas fa-tasks mr-2 commotion-red"></i>My Tasks</h2>
                    ${assignedTasks.length > 0 ? `
                        <div class="space-y-3">
                            ${assignedTasks.map(task => {
                                const event = FIRESTORE_DATA.events.find(e => e.id === task.eventId);
                                return `
                                    <div class="p-3 rounded-lg border ${task.status === 'done' ? 'bg-green-50 border-green-200' : task.status === 'in-progress' ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}">
                                        <div class="flex items-start justify-between mb-2">
                                            <div class="flex-1 min-w-0">
                                                <h4 class="font-semibold text-gray-900 text-sm ${task.status === 'done' ? 'line-through text-gray-500' : ''}">${task.title}</h4>
                                                <p class="text-xs text-gray-600 mt-1">${event ? event.name : 'Event'}</p>
                                            </div>
                                            <select onchange="updateTaskStatus('${task.id}', this.value)" class="ml-2 text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer ${task.status === 'done' ? 'bg-green-100 text-green-700' : task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}">
                                                <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>TODO</option>
                                                <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>IN PROGRESS</option>
                                                <option value="done" ${task.status === 'done' ? 'selected' : ''}>DONE</option>
                                            </select>
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            <i class="fas fa-calendar mr-1"></i> Due: ${new Date(task.dueDate).toLocaleDateString('en-NZ', {month: 'short', day: 'numeric'})}
                                            ${task.priority ? ` | <span class="${task.priority === 'urgent' ? 'text-red-600 font-semibold' : task.priority === 'high' ? 'commotion-red' : ''}">${task.priority}</span>` : ''}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : `<div class="text-center py-8 text-gray-500"><i class="fas fa-check-circle text-4xl mb-3"></i><p>No tasks assigned</p></div>`}
                </div>
            </div>

            <!-- My Gear -->
            <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mt-4">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold text-gray-900"><i class="fas fa-camera mr-2 commotion-red"></i>My Gear</h2>
                    <button onclick="showModal('addGear')" class="text-sm text-red-600 hover:text-red-700 font-semibold"><i class="fas fa-plus mr-1"></i>Add Gear</button>
                </div>
                ${myGear.length > 0 ? `
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        ${myGear.map(gear => `
                            <div class="p-3 bg-gray-50 rounded-lg">
                                <h4 class="font-semibold text-gray-900 text-sm">${gear.name}</h4>
                                <p class="text-xs text-gray-600">${gear.category}</p>
                                <div class="flex justify-between items-center mt-2">
                                    <span class="text-xs font-semibold">$${gear.value.toLocaleString()}</span>
                                    <span class="px-2 py-1 rounded-full text-xs ${gear.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${gear.status === 'available' ? 'Available' : 'In Use'}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `<div class="text-center py-6 text-gray-500"><p>No gear registered yet. Add your equipment to make it available for events.</p></div>`}
            </div>

            <!-- Profile -->
            <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mt-4">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold text-gray-900"><i class="fas fa-user mr-2 commotion-red"></i>My Profile</h2>
                    <button onclick="showModal('editProfile')" class="text-sm text-red-600 hover:text-red-700 font-semibold"><i class="fas fa-edit mr-1"></i>Edit</button>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div><p class="text-gray-600">Name</p><p class="font-semibold">${crewMember.name}</p></div>
                    <div><p class="text-gray-600">Role</p><p class="font-semibold">${crewMember.role}</p></div>
                    <div><p class="text-gray-600">Day Rate</p><p class="font-semibold">$${crewMember.rate}</p></div>
                    <div><p class="text-gray-600">Status</p><p class="font-semibold ${crewMember.available ? 'text-green-600' : 'commotion-red'}">${crewMember.available ? 'Available' : 'Busy'}</p></div>
                </div>
            </div>
        </div>
        <div id="modalOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden items-center justify-center p-4" onclick="if(event.target===this)closeModal()">
            <div id="modalContent" class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"></div>
        </div>
    `;
}

// Calendar Functions
function renderCalendar() {
    const container = document.getElementById('calendarContainer');
    if (!container) return;
    
    const title = document.getElementById('calendarTitle');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    if (calendarView === 'month') {
        title.textContent = `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`;
        renderMonthView(container);
    } else {
        const weekStart = getWeekStart(currentCalendarDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        title.textContent = `${weekStart.getDate()} ${monthNames[weekStart.getMonth()].slice(0,3)} - ${weekEnd.getDate()} ${monthNames[weekEnd.getMonth()].slice(0,3)}`;
        renderWeekView(container);
    }
    
    // Update view buttons
    document.getElementById('weekViewBtn')?.classList.toggle('bg-white', calendarView === 'week');
    document.getElementById('weekViewBtn')?.classList.toggle('shadow-sm', calendarView === 'week');
    document.getElementById('weekViewBtn')?.classList.toggle('font-semibold', calendarView === 'week');
    document.getElementById('monthViewBtn')?.classList.toggle('bg-white', calendarView === 'month');
    document.getElementById('monthViewBtn')?.classList.toggle('shadow-sm', calendarView === 'month');
    document.getElementById('monthViewBtn')?.classList.toggle('font-semibold', calendarView === 'month');
}

function renderMonthView(container) {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const isMobile = window.innerWidth < 640;
    
    // On mobile, show a list view instead of grid
    if (isMobile) {
        let html = '<div class="space-y-2">';
        const eventsThisMonth = FIRESTORE_DATA.events.filter(e => {
            const start = new Date(e.startDate);
            const end = new Date(e.endDate);
            return (start.getMonth() === month && start.getFullYear() === year) || 
                   (end.getMonth() === month && end.getFullYear() === year) ||
                   (start <= new Date(year, month, 1) && end >= new Date(year, month + 1, 0));
        });
        
        if (eventsThisMonth.length === 0) {
            html += '<div class="text-center py-8 text-gray-500">No events this month</div>';
        } else {
            eventsThisMonth.forEach(e => {
                html += `<div class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onclick="viewEvent('${e.id}')">
                    <div class="w-3 h-3 rounded-full mr-3 flex-shrink-0" style="background-color: ${e.color}"></div>
                    <div class="flex-1 min-w-0">
                        <p class="font-semibold text-sm text-gray-900 truncate">${e.name}</p>
                        <p class="text-xs text-gray-500">${formatDateRange(e.startDate, e.endDate)}</p>
                    </div>
                    <span class="px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(e.status)} ml-2">${getStatusLabel(e.status)}</span>
                </div>`;
            });
        }
        html += '</div>';
        container.innerHTML = html;
        return;
    }
    
    // Desktop grid view
    let html = `<div class="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-600 mb-2">
        <div class="py-2">S</div><div class="py-2">M</div><div class="py-2">T</div><div class="py-2">W</div><div class="py-2">T</div><div class="py-2">F</div><div class="py-2">S</div>
    </div><div class="grid grid-cols-7 gap-1">`;
    
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day bg-gray-50 min-h-[80px]"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const eventsOnDay = FIRESTORE_DATA.events.filter(e => dateStr >= e.startDate && dateStr <= e.endDate);
        const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
        
        html += `<div class="calendar-day ${isToday ? 'bg-red-50 border-red-200' : 'bg-white'} min-h-[80px] border border-gray-200 rounded">
            <div class="p-1">
                <div class="text-right text-xs font-semibold ${isToday ? 'text-red-600' : 'text-gray-700'}">${day}</div>
                <div class="mt-1 space-y-1">
                    ${eventsOnDay.slice(0, 2).map(e => `<div class="calendar-event text-white truncate text-xs p-1 rounded cursor-pointer" style="background-color: ${e.color}" onclick="viewEvent('${e.id}')">${e.name.split(' ')[0]}</div>`).join('')}
                    ${eventsOnDay.length > 2 ? `<div class="text-xs text-gray-500">+${eventsOnDay.length - 2}</div>` : ''}
                </div>
            </div>
        </div>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function renderWeekView(container) {
    const weekStart = getWeekStart(currentCalendarDate);
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const isMobile = window.innerWidth < 640;
    
    // Collect all schedule items for the week
    let weekSchedule = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        FIRESTORE_DATA.events.forEach(evt => {
            if (evt.schedule && dateStr >= evt.startDate && dateStr <= evt.endDate) {
                const daySchedule = evt.schedule.find(s => s.date === dateStr);
                if (daySchedule) {
                    daySchedule.items.forEach(item => {
                        weekSchedule.push({
                            ...item,
                            date: dateStr,
                            dayIndex: i,
                            eventName: evt.name,
                            eventId: evt.id,
                            eventColor: evt.color
                        });
                    });
                }
            }
        });
    }
    
    // Mobile: list view
    if (isMobile) {
        let html = '<div class="space-y-4">';
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = date.toDateString() === new Date().toDateString();
            const dayItems = weekSchedule.filter(s => s.dayIndex === i).sort((a,b) => a.time.localeCompare(b.time));
            const eventsOnDay = FIRESTORE_DATA.events.filter(e => dateStr >= e.startDate && dateStr <= e.endDate);
            
            if (eventsOnDay.length > 0 || dayItems.length > 0) {
                html += `<div class="border-l-4 ${isToday ? 'border-red-500 bg-red-50' : 'border-gray-300'} pl-3 py-2 rounded-r">
                    <div class="font-semibold text-sm ${isToday ? 'text-red-600' : 'text-gray-700'}">${dayNames[i]} ${date.getDate()}</div>`;
                
                if (dayItems.length > 0) {
                    html += '<div class="mt-2 space-y-1">';
                    dayItems.forEach(item => {
                        html += `<div class="flex items-start text-xs cursor-pointer hover:bg-white p-1 rounded" onclick="viewEvent('${item.eventId}')">
                            <span class="font-semibold commotion-red w-12 flex-shrink-0">${item.time}</span>
                            <div class="flex-1">
                                <span class="text-gray-900">${item.activity}</span>
                                <span class="text-gray-400 ml-1">(${item.eventName.split(' ')[0]})</span>
                            </div>
                        </div>`;
                    });
                    html += '</div>';
                } else {
                    eventsOnDay.forEach(e => {
                        html += `<div class="mt-1 text-xs text-gray-600 cursor-pointer" onclick="viewEvent('${e.id}')"><span class="inline-block w-2 h-2 rounded-full mr-1" style="background:${e.color}"></span>${e.name}</div>`;
                    });
                }
                html += '</div>';
            }
        }
        if (weekSchedule.length === 0 && FIRESTORE_DATA.events.filter(e => {
            for(let i=0;i<7;i++){const d=new Date(weekStart);d.setDate(d.getDate()+i);const ds=d.toISOString().split('T')[0];if(ds>=e.startDate&&ds<=e.endDate)return true;}return false;
        }).length === 0) {
            html += '<div class="text-center py-8 text-gray-500">No events this week</div>';
        }
        html += '</div>';
        container.innerHTML = html;
        return;
    }
    
    // Desktop: time grid with schedule items
    const hours = ['06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'];
    
    let html = `<div class="overflow-x-auto"><div class="min-w-[700px]">
        <div class="grid grid-cols-8 border-b">
            <div class="p-2 text-xs font-semibold text-gray-500"></div>`;
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const isToday = date.toDateString() === new Date().toDateString();
        html += `<div class="p-2 text-center border-l ${isToday ? 'bg-red-50' : ''}">
            <div class="text-xs text-gray-500">${dayNames[i]}</div>
            <div class="text-sm font-bold ${isToday ? 'text-red-600' : ''}">${date.getDate()}</div>
        </div>`;
    }
    html += '</div>';
    
    hours.forEach(hour => {
        const hourNum = parseInt(hour.split(':')[0]);
        html += `<div class="grid grid-cols-8 border-b"><div class="p-1 text-xs text-gray-400 text-right pr-2">${hour}</div>`;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Find schedule items for this hour
            const items = weekSchedule.filter(s => {
                const itemHour = parseInt(s.time.split(':')[0]);
                return s.dayIndex === i && itemHour >= hourNum && itemHour < hourNum + 2;
            });
            
            // Find events on this day
            const eventsOnDay = FIRESTORE_DATA.events.filter(e => dateStr >= e.startDate && dateStr <= e.endDate);
            
            html += `<div class="border-l min-h-[50px] p-1">`;
            if (items.length > 0) {
                items.forEach(item => {
                    html += `<div class="text-xs p-1 mb-1 rounded cursor-pointer text-white" style="background-color: ${item.eventColor}" onclick="viewEvent('${item.eventId}')">
                        <span class="font-semibold">${item.time}</span> ${item.activity.substring(0, 15)}${item.activity.length > 15 ? '...' : ''}
                    </div>`;
                });
            } else if (eventsOnDay.length > 0 && hour === '10:00') {
                eventsOnDay.forEach(e => {
                    html += `<div class="text-xs p-1 rounded text-white truncate cursor-pointer" style="background-color: ${e.color}" onclick="viewEvent('${e.id}')">${e.name.split(' ')[0]}</div>`;
                });
            }
            html += '</div>';
        }
        html += '</div>';
    });
    
    html += '</div></div>';
    container.innerHTML = html;
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
}

function setCalendarView(view) {
    calendarView = view;
    renderCalendar();
}

function navigateCalendar(direction) {
    if (calendarView === 'month') {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
    } else {
        currentCalendarDate.setDate(currentCalendarDate.getDate() + (direction * 7));
    }
    renderCalendar();
}

function renderAllEvents() {
    const container = document.getElementById('allEvents');
    if (!container) return;

    const statusColors = {'confirmed': 'green', 'quote-sent': 'yellow', 'in-progress': 'blue', 'completed': 'gray', 'lead': 'gray'};
    
    container.innerHTML = FIRESTORE_DATA.events.map(event => `
        <div class="event-card bg-white rounded-lg p-3 sm:p-4 border border-gray-200" style="border-left: 4px solid ${event.color}" onclick="viewEvent('${event.id}')">
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-gray-900 text-sm">${event.name}</h3>
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(event.status)}">${getStatusLabel(event.status)}</span>
            </div>
            <div class="text-xs text-gray-600 space-y-1">
                <div><i class="fas fa-map-marker-alt text-gray-400 w-4"></i> ${event.location}</div>
                <div><i class="fas fa-calendar text-gray-400 w-4"></i> ${formatDateRange(event.startDate, event.endDate)}</div>
            </div>
            <div class="mt-2 flex items-center justify-between text-xs">
                <span class="text-gray-500">${event.crewCount} crew</span>
                <span class="font-semibold commotion-red">$${event.quoteAmount.toLocaleString()}</span>
            </div>
        </div>
    `).join('');
}

// Modal Functions
function showModal(type, id = null) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    
    switch(type) {
        case 'newEvent':
            content.innerHTML = renderNewEventModal();
            break;
        case 'manageCrew':
            content.innerHTML = renderManageCrewModal();
            break;
        case 'editProfile':
            content.innerHTML = renderEditProfileModal();
            break;
        case 'addGear':
            content.innerHTML = renderAddGearModal();
            break;
        case 'editSchedule':
        case 'eventSchedule':
            const event = FIRESTORE_DATA.events.find(e => e.id === id);
            content.innerHTML = renderScheduleModal(event);
            break;
        default:
            content.innerHTML = `<div class="p-6"><h2 class="text-xl font-bold mb-4">Coming Soon</h2><p class="text-gray-600">This feature is under development.</p><button onclick="closeModal()" class="mt-4 px-4 py-2 bg-gray-200 rounded-lg">Close</button></div>`;
    }
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
}

function renderNewEventModal() {
    return `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900"><i class="fas fa-plus mr-2 commotion-red"></i>New Event</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form onsubmit="event.preventDefault(); saveNewEvent();" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Event Name</label><input type="text" id="newEventName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Festival Name 2025" required></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Client</label><select id="newEventClient" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        ${FIRESTORE_DATA.clients.map(c => `<option value="${c.id}">${c.company}</option>`).join('')}
                        <option value="new">+ Add New Client</option>
                    </select></div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label><input type="date" id="newEventStart" class="w-full px-3 py-2 border border-gray-300 rounded-lg" required></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">End Date</label><input type="date" id="newEventEnd" class="w-full px-3 py-2 border border-gray-300 rounded-lg" required></div>
                </div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" id="newEventLocation" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Venue, City"></div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Expected Attendees</label><input type="number" id="newEventAttendees" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="5000"></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Quote Amount ($)</label><input type="number" id="newEventQuote" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="15000"></div>
                </div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea id="newEventNotes" class="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" placeholder="Special requirements, access notes..."></textarea></div>
                <div class="flex gap-3 pt-4">
                    <button type="submit" class="flex-1 px-4 py-3 bg-commotion-red hover-commotion-red text-white rounded-lg font-semibold">Create Event</button>
                    <button type="button" onclick="closeModal()" class="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold">Cancel</button>
                </div>
            </form>
        </div>
    `;
}

function renderManageCrewModal() {
    return `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900"><i class="fas fa-users mr-2 commotion-red"></i>Crew Members</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div class="space-y-3 max-h-96 overflow-y-auto">
                ${FIRESTORE_DATA.crew.map(crew => `
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full bg-commotion-red text-white flex items-center justify-center font-bold mr-3">${crew.name.split(' ').map(n => n[0]).join('')}</div>
                            <div>
                                <h4 class="font-semibold text-gray-900">${crew.name}</h4>
                                <p class="text-sm text-gray-600">${crew.role} • $${crew.rate}/day</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-1 rounded-full text-xs font-semibold ${crew.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${crew.available ? 'Available' : 'Busy'}</span>
                            <button onclick="editCrew('${crew.id}')" class="p-2 text-gray-500 hover:text-gray-700"><i class="fas fa-edit"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="w-full mt-4 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-red-500 hover:text-red-600"><i class="fas fa-plus mr-2"></i>Add New Crew Member</button>
        </div>
    `;
}

function renderEditProfileModal() {
    const crew = FIRESTORE_DATA.crew.find(c => c.id === crewId) || { name: userName, role: 'Crew', rate: 350, phone: '', email: '' };
    return `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900"><i class="fas fa-user mr-2 commotion-red"></i>Edit Profile</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form onsubmit="event.preventDefault(); saveProfile();" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" id="profileName" value="${crew.name}" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Role</label><input type="text" id="profileRole" value="${crew.role}" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" id="profilePhone" value="${crew.phone || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" id="profileEmail" value="${crew.email || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></div>
                </div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Day Rate ($)</label><input type="number" id="profileRate" value="${crew.rate}" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></div>
                <div class="flex items-center"><input type="checkbox" id="profileAvailable" ${crew.available ? 'checked' : ''} class="mr-2"><label class="text-sm text-gray-700">Available for bookings</label></div>
                <div class="flex gap-3 pt-4">
                    <button type="submit" class="flex-1 px-4 py-3 bg-commotion-red hover-commotion-red text-white rounded-lg font-semibold">Save Changes</button>
                    <button type="button" onclick="closeModal()" class="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold">Cancel</button>
                </div>
            </form>
        </div>
    `;
}

function renderAddGearModal() {
    const crewMember = FIRESTORE_DATA.crew.find(c => c.id === crewId) || { name: userName };
    return `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900"><i class="fas fa-camera mr-2 commotion-red"></i>Add My Gear</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <p class="text-sm text-gray-600 mb-4">Add your personal equipment to make it available for event assignments. This will appear in the admin gear inventory.</p>
            <form onsubmit="event.preventDefault(); saveNewGear();" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Equipment Name</label>
                    <input type="text" id="newGearName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" placeholder="e.g. Sony A7S III" required>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select id="newGearCategory" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="Camera">Camera</option>
                            <option value="Lens">Lens</option>
                            <option value="Drone">Drone</option>
                            <option value="Gimbal">Gimbal</option>
                            <option value="Audio">Audio</option>
                            <option value="Lighting">Lighting</option>
                            <option value="Monitor">Monitor</option>
                            <option value="Support">Support</option>
                            <option value="Storage">Storage</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Insurance Value ($)</label>
                        <input type="number" id="newGearValue" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="5000" required>
                    </div>
                </div>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p class="text-xs text-blue-800"><i class="fas fa-info-circle mr-1"></i>Owner will be set to: <strong>${crewMember.name}</strong></p>
                </div>
                <div class="flex gap-3 pt-4">
                    <button type="submit" class="flex-1 px-4 py-3 bg-commotion-red hover-commotion-red text-white rounded-lg font-semibold">Add Gear</button>
                    <button type="button" onclick="closeModal()" class="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold">Cancel</button>
                </div>
            </form>
        </div>
    `;
}

function renderScheduleModal(event) {
    if (!event) return '<div class="p-6"><p>Event not found</p></div>';
    const isClient = userRole === 'client';
    
    return `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900"><i class="fas fa-calendar-alt mr-2 commotion-red"></i>${event.name} Schedule</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            ${event.schedule && event.schedule.length > 0 ? `
                <div class="space-y-6">
                    ${event.schedule.map(day => `
                        <div>
                            <h3 class="font-bold text-gray-900 mb-3 pb-2 border-b">${day.title} <span class="text-sm font-normal text-gray-500">${new Date(day.date).toLocaleDateString('en-NZ', {weekday: 'short', month: 'short', day: 'numeric'})}</span></h3>
                            <div class="space-y-2">
                                ${day.items.map(item => `
                                    <div class="flex items-start p-3 bg-gray-50 rounded-lg ${isClient ? 'cursor-pointer hover:bg-gray-100' : ''}" ${isClient ? `onclick="editScheduleItem('${event.id}', '${day.date}', '${item.time}')"` : ''}>
                                        <span class="text-sm font-semibold commotion-red w-14 flex-shrink-0">${item.time}</span>
                                        <div class="flex-1">
                                            <p class="text-sm font-medium text-gray-900">${item.activity}</p>
                                            ${item.crew && item.crew.length > 0 ? `<p class="text-xs text-gray-500 mt-1"><i class="fas fa-users mr-1"></i>${item.crew.map(c => FIRESTORE_DATA.crew.find(cr => cr.id === c)?.name || c).join(', ')}</p>` : ''}
                                        </div>
                                        ${isClient ? '<i class="fas fa-edit text-gray-400 ml-2"></i>' : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${isClient ? `<button class="w-full mt-6 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-red-500 hover:text-red-600"><i class="fas fa-plus mr-2"></i>Add Schedule Item</button>` : ''}
            ` : `<div class="text-center py-8 text-gray-500"><i class="fas fa-calendar-times text-4xl mb-3"></i><p>No schedule set up yet</p>${isClient ? `<button class="mt-4 px-4 py-2 bg-commotion-red text-white rounded-lg">Create Schedule</button>` : ''}</div>`}
        </div>
    `;
}

function renderEventSchedule(event) {
    if (!event.schedule || event.schedule.length === 0) {
        return `<div class="text-center py-6 text-gray-500"><p>No schedule available yet</p></div>`;
    }
    
    return `<div class="space-y-4">
        ${event.schedule.slice(0, 2).map(day => `
            <div class="border-l-2 border-red-200 pl-3">
                <h4 class="font-semibold text-sm text-gray-900">${day.title}</h4>
                <div class="mt-2 space-y-1">
                    ${day.items.slice(0, 3).map(item => `
                        <div class="flex items-center text-xs text-gray-600">
                            <span class="font-semibold w-12 commotion-red">${item.time}</span>
                            <span>${item.activity}</span>
                        </div>
                    `).join('')}
                    ${day.items.length > 3 ? `<p class="text-xs text-gray-400">+${day.items.length - 3} more</p>` : ''}
                </div>
            </div>
        `).join('')}
        ${event.schedule.length > 2 ? `<p class="text-xs text-gray-400">+${event.schedule.length - 2} more days</p>` : ''}
    </div>`;
}

// Stat Detail Modal
function showStatDetail(type) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    
    switch(type) {
        case 'revenue':
            content.innerHTML = renderRevenueDetail();
            break;
        case 'events':
            content.innerHTML = renderEventsDetail();
            break;
        case 'crew':
            content.innerHTML = renderCrewDetail();
            break;
        case 'gear':
            content.innerHTML = renderGearDetail();
            break;
    }
}

function renderRevenueDetail() {
    const paidEvents = FIRESTORE_DATA.events.filter(e => e.paidAmount > 0);
    const totalQuoted = FIRESTORE_DATA.events.reduce((sum, e) => sum + e.quoteAmount, 0);
    const totalPaid = FIRESTORE_DATA.events.reduce((sum, e) => sum + e.paidAmount, 0);
    
    return `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900"><i class="fas fa-dollar-sign mr-2 text-green-600"></i>Revenue Overview</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="text-center p-4 bg-green-50 rounded-lg"><p class="text-2xl font-bold text-green-600">$${totalPaid.toLocaleString()}</p><p class="text-xs text-gray-600">Collected</p></div>
                <div class="text-center p-4 bg-yellow-50 rounded-lg"><p class="text-2xl font-bold text-yellow-600">$${(totalQuoted - totalPaid).toLocaleString()}</p><p class="text-xs text-gray-600">Outstanding</p></div>
                <div class="text-center p-4 bg-blue-50 rounded-lg"><p class="text-2xl font-bold text-blue-600">$${totalQuoted.toLocaleString()}</p><p class="text-xs text-gray-600">Total Quoted</p></div>
            </div>
            <h3 class="font-semibold text-gray-900 mb-3">Payment Status by Event</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
                ${FIRESTORE_DATA.events.filter(e => e.quoteAmount > 0).map(e => `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div><p class="font-semibold text-sm">${e.name}</p><p class="text-xs text-gray-500">${e.paymentStatus}</p></div>
                        <div class="text-right"><p class="font-bold text-sm">$${e.paidAmount.toLocaleString()} <span class="text-gray-400">/ $${e.quoteAmount.toLocaleString()}</span></p>
                            <div class="w-24 bg-gray-200 rounded-full h-2 mt-1"><div class="bg-green-500 h-2 rounded-full" style="width: ${(e.paidAmount/e.quoteAmount)*100}%"></div></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderEventsDetail() {
    const byStatus = {confirmed: [], 'in-progress': [], 'quote-sent': [], lead: [], completed: []};
    FIRESTORE_DATA.events.forEach(e => { if(byStatus[e.status]) byStatus[e.status].push(e); });
    
    return `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900"><i class="fas fa-calendar-alt mr-2 text-blue-600"></i>Events Overview</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div class="grid grid-cols-5 gap-2 mb-6 text-center">
                <div class="p-3 bg-green-50 rounded-lg"><p class="text-xl font-bold text-green-600">${byStatus.confirmed.length}</p><p class="text-xs">Confirmed</p></div>
                <div class="p-3 bg-blue-50 rounded-lg"><p class="text-xl font-bold text-blue-600">${byStatus['in-progress'].length}</p><p class="text-xs">In Progress</p></div>
                <div class="p-3 bg-yellow-50 rounded-lg"><p class="text-xl font-bold text-yellow-600">${byStatus['quote-sent'].length}</p><p class="text-xs">Quoted</p></div>
                <div class="p-3 bg-gray-100 rounded-lg"><p class="text-xl font-bold text-gray-600">${byStatus.lead.length}</p><p class="text-xs">Leads</p></div>
                <div class="p-3 bg-gray-50 rounded-lg"><p class="text-xl font-bold text-gray-400">${byStatus.completed.length}</p><p class="text-xs">Done</p></div>
            </div>
            <div class="space-y-2 max-h-64 overflow-y-auto">
                ${FIRESTORE_DATA.events.map(e => `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onclick="closeModal(); viewEvent('${e.id}')">
                        <div class="flex items-center"><div class="w-2 h-2 rounded-full mr-3" style="background-color: ${e.color}"></div><div><p class="font-semibold text-sm">${e.name}</p><p class="text-xs text-gray-500">${formatDateRange(e.startDate, e.endDate)}</p></div></div>
                        <span class="px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(e.status)}">${getStatusLabel(e.status)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderCrewDetail() {
    const available = FIRESTORE_DATA.crew.filter(c => c.available);
    const busy = FIRESTORE_DATA.crew.filter(c => !c.available);
    
    return `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900"><i class="fas fa-users mr-2 commotion-red"></i>Crew Overview</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="text-center p-4 bg-green-50 rounded-lg"><p class="text-2xl font-bold text-green-600">${available.length}</p><p class="text-xs text-gray-600">Available</p></div>
                <div class="text-center p-4 bg-red-50 rounded-lg"><p class="text-2xl font-bold commotion-red">${busy.length}</p><p class="text-xs text-gray-600">Busy</p></div>
            </div>
            <div class="space-y-2 max-h-64 overflow-y-auto">
                ${FIRESTORE_DATA.crew.map(c => `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full bg-commotion-red text-white flex items-center justify-center text-xs font-bold mr-3">${c.name.split(' ').map(n => n[0]).join('')}</div>
                            <div><p class="font-semibold text-sm">${c.name}</p><p class="text-xs text-gray-500">${c.role} • $${c.rate}/day</p></div>
                        </div>
                        <span class="px-2 py-1 rounded-full text-xs font-semibold ${c.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${c.available ? 'Free' : 'Busy'}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderGearDetail() {
    const byOwner = {};
    FIRESTORE_DATA.gear.forEach(g => {
        if (!byOwner[g.owner]) byOwner[g.owner] = [];
        byOwner[g.owner].push(g);
    });
    const available = FIRESTORE_DATA.gear.filter(g => g.status === 'available').length;
    const inUse = FIRESTORE_DATA.gear.filter(g => g.status === 'in-use').length;
    
    return `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900"><i class="fas fa-camera mr-2 text-orange-600"></i>Gear Overview</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="text-center p-4 bg-orange-50 rounded-lg"><p class="text-2xl font-bold text-orange-600">$${FIRESTORE_DATA.gear.reduce((s,g) => s+g.value, 0).toLocaleString()}</p><p class="text-xs text-gray-600">Total Value</p></div>
                <div class="text-center p-4 bg-green-50 rounded-lg"><p class="text-2xl font-bold text-green-600">${available}</p><p class="text-xs text-gray-600">Available</p></div>
                <div class="text-center p-4 bg-red-50 rounded-lg"><p class="text-2xl font-bold commotion-red">${inUse}</p><p class="text-xs text-gray-600">In Use</p></div>
            </div>
            ${Object.entries(byOwner).map(([owner, items]) => `
                <div class="mb-4">
                    <h3 class="font-semibold text-sm text-gray-700 mb-2">${owner} <span class="text-gray-400">(${items.length} items • $${items.reduce((s,g)=>s+g.value,0).toLocaleString()})</span></h3>
                    <div class="grid grid-cols-2 gap-2">
                        ${items.slice(0,4).map(g => `
                            <div class="p-2 bg-gray-50 rounded text-xs">
                                <p class="font-semibold truncate">${g.name}</p>
                                <div class="flex justify-between mt-1"><span class="text-gray-500">${g.category}</span><span class="${g.status === 'available' ? 'text-green-600' : 'commotion-red'}">${g.status === 'available' ? '✓' : '⬤'}</span></div>
                            </div>
                        `).join('')}
                    </div>
                    ${items.length > 4 ? `<p class="text-xs text-gray-400 mt-1">+${items.length - 4} more</p>` : ''}
                </div>
            `).join('')}
            <button onclick="closeModal(); window.location.href='gear.html'" class="w-full mt-4 px-4 py-2 bg-commotion-red text-white rounded-lg font-semibold">View Full Inventory</button>
        </div>
    `;
}

// Action Functions
function viewEvent(eventId) {
    window.location.href = `event-detail.html?id=${eventId}`;
}

function toggleTaskStatus(taskId) {
    updateTaskStatus(taskId, null); // Toggle handled in updateTaskStatus
}

async function updateTaskStatus(taskId, newStatus) {
    const task = FIRESTORE_DATA.tasks.find(t => t.id === taskId);
    if (task) {
        // If no status provided, toggle between done and todo
        if (newStatus === null) {
            newStatus = task.status === 'done' ? 'todo' : 'done';
        }
        
        // Update in Firestore
        const result = await firestoreHelpers.updateDoc('tasks', taskId, { status: newStatus });
        
        if (result.success) {
            task.status = newStatus;
            if (userRole === 'crew') loadCrewDashboard();
        } else {
            alert('Error updating task: ' + result.error);
        }
    }
}

async function saveNewEvent() {
    const btn = document.querySelector('#modalContent button[type="submit"]');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Creating...';
    }
    
    const eventColors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];
    const randomColor = eventColors[Math.floor(Math.random() * eventColors.length)];
    
    const newEvent = {
        name: document.getElementById('newEventName').value,
        client_id: document.getElementById('newEventClient').value,
        clientName: FIRESTORE_DATA.clients.find(c => c.id === document.getElementById('newEventClient').value)?.company || 'Unknown',
        startDate: document.getElementById('newEventStart').value,
        endDate: document.getElementById('newEventEnd').value,
        location: document.getElementById('newEventLocation').value || '',
        attendees: parseInt(document.getElementById('newEventAttendees').value) || 0,
        quoteAmount: parseInt(document.getElementById('newEventQuote').value) || 0,
        paidAmount: 0,
        status: 'lead',
        color: randomColor,
        crewCount: 0,
        gearValue: 0,
        crewAssigned: [],
        deliverables: [],
        schedule: [],
        notes: document.getElementById('newEventNotes').value || ''
    };
    
    const result = await firestoreHelpers.addDoc('events', newEvent);
    
    if (result.success) {
        closeModal();
        // Reload data and dashboard
        await loadFirestoreData();
        loadAdminDashboard();
    } else {
        alert('Error creating event: ' + result.error);
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Create Event';
        }
    }
}

async function saveProfile() {
    const btn = document.querySelector('#modalContent button[type="submit"]');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Saving...';
    }
    
    const updates = {
        name: document.getElementById('profileName').value,
        role: document.getElementById('profileRole').value,
        phone: document.getElementById('profilePhone').value,
        email: document.getElementById('profileEmail').value,
        rate: parseInt(document.getElementById('profileRate').value),
        available: document.getElementById('profileAvailable').checked
    };
    
    const result = await firestoreHelpers.updateDoc('crew', crewId, updates);
    
    if (result.success) {
        closeModal();
        await loadFirestoreData();
        loadCrewDashboard();
    } else {
        alert('Error updating profile: ' + result.error);
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Save Changes';
        }
    }
}

async function saveNewGear() {
    const btn = document.querySelector('#modalContent button[type="submit"]');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Adding...';
    }
    
    const name = document.getElementById('newGearName').value;
    const category = document.getElementById('newGearCategory').value;
    const value = parseInt(document.getElementById('newGearValue').value);
    const crewMember = FIRESTORE_DATA.crew.find(c => c.id === crewId);
    
    const newGear = {
        name: name,
        category: category,
        value: value,
        status: 'available',
        assignedTo: null,
        owner: crewMember ? crewMember.name : userName,
        ownerId: crewId
    };
    
    const result = await firestoreHelpers.addDoc('gear', newGear);
    
    if (result.success) {
        closeModal();
        await loadFirestoreData();
        loadCrewDashboard();
    } else {
        alert('Error adding gear: ' + result.error);
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Add Gear';
        }
    }
}

function editCrew(crewId) {
    alert(`Editing crew member ${crewId} - Feature coming soon!`);
}

function editScheduleItem(eventId, date, time) {
    alert(`Editing schedule item for ${date} at ${time} - Feature coming soon!`);
}

// Utility Functions
function getStatusLabel(status) {
    const labels = {'confirmed': 'Confirmed', 'quote-sent': 'Quote Sent', 'in-progress': 'In Progress', 'completed': 'Completed', 'lead': 'Lead', 'pending': 'Pending'};
    return labels[status] || status;
}

function getStatusBadgeClass(status) {
    const classes = {'confirmed': 'bg-green-100 text-green-700', 'quote-sent': 'bg-yellow-100 text-yellow-700', 'in-progress': 'bg-blue-100 text-blue-700', 'completed': 'bg-gray-100 text-gray-700', 'lead': 'bg-gray-100 text-gray-700', 'pending': 'bg-gray-100 text-gray-700'};
    return classes[status] || 'bg-gray-100 text-gray-700';
}

function getTaskStatusBadgeClass(status) {
    const classes = {'done': 'bg-green-100 text-green-700', 'in-progress': 'bg-yellow-100 text-yellow-700', 'todo': 'bg-gray-100 text-gray-700'};
    return classes[status] || 'bg-gray-100 text-gray-700';
}

function formatDateRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (start === end) {
        return startDate.toLocaleDateString('en-NZ', {month: 'short', day: 'numeric', year: 'numeric'});
    }
    return `${startDate.toLocaleDateString('en-NZ', {month: 'short', day: 'numeric'})} - ${endDate.toLocaleDateString('en-NZ', {month: 'short', day: 'numeric', year: 'numeric'})}`;
}

function logout() {
    signOut().then(() => {
        localStorage.clear();
        window.location.href = 'index.html';
    });
}
