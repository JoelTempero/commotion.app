// Dashboard Logic for COMMOTION.APP
// Handles role-based content rendering

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

// Load appropriate dashboard based on role
if (userRole === 'admin') {
    loadAdminDashboard();
} else if (userRole === 'client') {
    loadClientDashboard();
} else if (userRole === 'crew') {
    loadCrewDashboard();
}

function loadAdminDashboard() {
    document.getElementById('dashboardContent').innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p class="text-gray-600 mt-1">Welcome back, ${userName}. Here's your business overview.</p>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p class="text-2xl font-bold text-gray-900 mt-2">$142,300</p>
                            <p class="text-xs text-green-600 mt-1">
                                <i class="fas fa-arrow-up"></i> 12% from last month
                            </p>
                        </div>
                        <div class="bg-green-100 rounded-full p-3">
                            <i class="fas fa-dollar-sign text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Active Events</p>
                            <p class="text-2xl font-bold text-gray-900 mt-2">${DEMO_DATA.events.filter(e => e.status !== 'completed' && e.status !== 'cancelled').length}</p>
                            <p class="text-xs text-blue-600 mt-1">
                                <i class="fas fa-calendar-check"></i> 3 this month
                            </p>
                        </div>
                        <div class="bg-blue-100 rounded-full p-3">
                            <i class="fas fa-calendar-alt text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Crew Members</p>
                            <p class="text-2xl font-bold text-gray-900 mt-2">${DEMO_DATA.crew.length}</p>
                            <p class="text-xs commotion-red mt-1">
                                <i class="fas fa-user-check"></i> ${DEMO_DATA.crew.filter(c => c.available).length} available
                            </p>
                        </div>
                        <div class="bg-red-100 rounded-full p-3">
                            <i class="fas fa-users commotion-red text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Gear Value</p>
                            <p class="text-2xl font-bold text-gray-900 mt-2">$85,000</p>
                            <p class="text-xs text-orange-600 mt-1">
                                <i class="fas fa-shield-alt"></i> Insured
                            </p>
                        </div>
                        <div class="bg-orange-100 rounded-full p-3">
                            <i class="fas fa-camera text-orange-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <!-- Event Calendar -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-bold text-gray-900">
                                <i class="fas fa-calendar-alt mr-2 commotion-red"></i>
                                Event Calendar
                            </h2>
                            <div class="flex space-x-2">
                                <button class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <span class="px-4 py-1 text-sm font-semibold">January 2025</span>
                                <button class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-600 mb-2">
                            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                        </div>
                        <div class="grid grid-cols-7 gap-1" id="calendarGrid"></div>
                    </div>

                    <!-- All Events List -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-6">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-bold text-gray-900">
                                <i class="fas fa-list mr-2 commotion-red"></i>
                                All Events
                            </h2>
                            <button onclick="window.location.href='gear.html'" class="px-4 py-2 bg-commotion-red hover-commotion-red text-white rounded-lg text-sm font-semibold">
                                <i class="fas fa-camera mr-2"></i>
                                View Gear List
                            </button>
                        </div>
                        <div id="allEvents" class="space-y-3"></div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    
                    <!-- Quick Actions -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div class="space-y-2">
                            <button onclick="showModal('newEvent')" class="w-full bg-commotion-red hover-commotion-red text-white rounded-lg py-3 px-4 transition flex items-center justify-between">
                                <span><i class="fas fa-plus mr-2"></i>New Event</span>
                                <i class="fas fa-arrow-right"></i>
                            </button>
                            <button onclick="window.location.href='crew-list.html'" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-3 px-4 transition">
                                <i class="fas fa-users mr-2"></i>Manage Crew
                            </button>
                            <button onclick="window.location.href='gear.html'" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-3 px-4 transition">
                                <i class="fas fa-camera mr-2"></i>Manage Gear
                            </button>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 class="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                        <div class="space-y-4">
                            <div class="flex items-start">
                                <div class="bg-green-100 rounded-full p-2 mr-3">
                                    <i class="fas fa-check text-green-600 text-xs"></i>
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-gray-900">Payment received</p>
                                    <p class="text-xs text-gray-500">Festival One - $9,800</p>
                                    <p class="text-xs text-gray-400">2 hours ago</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <div class="bg-blue-100 rounded-full p-2 mr-3">
                                    <i class="fas fa-user text-blue-600 text-xs"></i>
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-gray-900">Crew confirmed</p>
                                    <p class="text-xs text-gray-500">Sarah Chen - Rhythm & Alps</p>
                                    <p class="text-xs text-gray-400">5 hours ago</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <div class="bg-red-100 rounded-full p-2 mr-3">
                                    <i class="fas fa-calendar commotion-red text-xs"></i>
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-gray-900">New booking</p>
                                    <p class="text-xs text-gray-500">Splore 2025 - Quote sent</p>
                                    <p class="text-xs text-gray-400">1 day ago</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    `;
    renderAdminCalendar();
    renderAllEvents();
}

function loadClientDashboard() {
    // Get client's events
    const clientEvents = DEMO_DATA.events.filter(e => e.client_id === clientId);
    const mainEvent = clientEvents[0];
    
    if (!mainEvent) {
        document.getElementById('dashboardContent').innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <i class="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-900">No Events Assigned</h2>
                <p class="text-gray-600 mt-2">Contact Commotion Studio to book your event.</p>
            </div>
        `;
        return;
    }

    document.getElementById('dashboardContent').innerHTML = `
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Client Portal</h1>
                <p class="text-gray-600 mt-1">Welcome back, ${userName}.</p>
            </div>

            <!-- Event Overview -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <div class="flex items-center mb-2">
                            <h2 class="text-2xl font-bold text-gray-900">${mainEvent.name}</h2>
                            <span class="ml-4 px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(mainEvent.status)}">
                                ${getStatusLabel(mainEvent.status)}
                            </span>
                        </div>
                        <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span><i class="fas fa-map-marker-alt commotion-red mr-2"></i>${mainEvent.location}</span>
                            <span><i class="fas fa-calendar commotion-red mr-2"></i>${formatDateRange(mainEvent.startDate, mainEvent.endDate)}</span>
                            <span><i class="fas fa-users commotion-red mr-2"></i>${mainEvent.attendees.toLocaleString()} attendees</span>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <p class="text-2xl font-bold text-gray-900">$${mainEvent.quoteAmount.toLocaleString()}</p>
                        <p class="text-xs text-gray-600 mt-1">Quote Amount</p>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <p class="text-2xl font-bold text-green-600">$${mainEvent.paidAmount.toLocaleString()}</p>
                        <p class="text-xs text-gray-600 mt-1">Paid</p>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <p class="text-2xl font-bold text-gray-900">${mainEvent.crewCount}</p>
                        <p class="text-xs text-gray-600 mt-1">Crew Members</p>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <p class="text-2xl font-bold commotion-red">${Math.round(mainEvent.paidAmount / mainEvent.quoteAmount * 100)}%</p>
                        <p class="text-xs text-gray-600 mt-1">Paid</p>
                    </div>
                </div>
            </div>

            <!-- Deliverables & Timeline -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <!-- Deliverables -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">
                        <i class="fas fa-film mr-2 commotion-red"></i>
                        Deliverables
                    </h3>
                    <div class="space-y-3">
                        ${mainEvent.deliverables.map(d => `
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-semibold text-gray-900">${d.type}</h4>
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(d.status)}">
                                        ${getStatusLabel(d.status)}
                                    </span>
                                </div>
                                <p class="text-sm text-gray-600">Duration: ${d.duration}</p>
                                <p class="text-sm text-gray-600">Due: ${new Date(d.dueDate).toLocaleDateString('en-NZ', {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Payment Status -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">
                        <i class="fas fa-dollar-sign mr-2 commotion-red"></i>
                        Payment Status
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-gray-600">Payment Progress</span>
                                <span class="font-semibold">${Math.round(mainEvent.paidAmount / mainEvent.quoteAmount * 100)}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-commotion-red h-2 rounded-full" style="width: ${Math.round(mainEvent.paidAmount / mainEvent.quoteAmount * 100)}%"></div>
                            </div>
                        </div>
                        <div class="space-y-2 text-sm pt-4 border-t">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Quote Amount:</span>
                                <span class="font-semibold">$${mainEvent.quoteAmount.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Paid:</span>
                                <span class="text-green-600 font-semibold">$${mainEvent.paidAmount.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between border-t pt-2">
                                <span class="text-gray-900 font-semibold">Remaining:</span>
                                <span class="font-bold commotion-red">$${(mainEvent.quoteAmount - mainEvent.paidAmount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Notes -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                <h3 class="text-lg font-bold text-gray-900 mb-3">
                    <i class="fas fa-sticky-note text-blue-600 mr-2"></i>
                    Event Notes
                </h3>
                <p class="text-sm text-gray-700">${mainEvent.notes}</p>
            </div>

        </div>
    `;
}

function loadCrewDashboard() {
    // Get crew member's details
    const crewMember = DEMO_DATA.crew.find(c => c.id === crewId);
    
    // Get events assigned to this crew member
    const assignedEvents = DEMO_DATA.events.filter(e => 
        e.crewAssigned && e.crewAssigned.includes(crewId)
    );

    // Get tasks assigned to this crew member
    const assignedTasks = DEMO_DATA.tasks.filter(t => t.assignedTo === crewId);

    document.getElementById('dashboardContent').innerHTML = `
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Crew Portal</h1>
                <p class="text-gray-600 mt-1">Welcome back, ${userName}.</p>
            </div>

            <!-- Crew Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Upcoming Events</p>
                            <p class="text-2xl font-bold text-gray-900 mt-2">${assignedEvents.filter(e => new Date(e.startDate) > new Date('2025-01-03')).length}</p>
                        </div>
                        <div class="bg-blue-100 rounded-full p-3">
                            <i class="fas fa-calendar-check text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Pending Tasks</p>
                            <p class="text-2xl font-bold text-gray-900 mt-2">${assignedTasks.filter(t => t.status !== 'done').length}</p>
                        </div>
                        <div class="bg-orange-100 rounded-full p-3">
                            <i class="fas fa-tasks text-orange-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Your Rate</p>
                            <p class="text-2xl font-bold text-gray-900 mt-2">$${crewMember.rate}/day</p>
                        </div>
                        <div class="bg-green-100 rounded-full p-3">
                            <i class="fas fa-dollar-sign text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- My Events -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-calendar-alt mr-2 commotion-red"></i>
                    My Assigned Events
                </h2>
                ${assignedEvents.length > 0 ? `
                    <div class="space-y-3">
                        ${assignedEvents.map(event => `
                            <div class="event-card bg-white rounded-lg p-4 border-l-4" style="border-left-color: ${event.color}">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="font-semibold text-gray-900">${event.name}</h3>
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(event.status)}">
                                        ${getStatusLabel(event.status)}
                                    </span>
                                </div>
                                <div class="text-sm text-gray-600 space-y-1">
                                    <div><i class="fas fa-map-marker-alt text-gray-400 w-4"></i> ${event.location}</div>
                                    <div><i class="fas fa-calendar text-gray-400 w-4"></i> ${formatDateRange(event.startDate, event.endDate)}</div>
                                    <div><i class="fas fa-user text-gray-400 w-4"></i> ${crewMember.role}</div>
                                </div>
                                <div class="mt-3 pt-3 border-t flex justify-between text-sm">
                                    <span class="text-gray-500">${Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24)) + 1} days</span>
                                    <span class="font-semibold commotion-red">Earn: $${crewMember.rate * (Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24)) + 1)}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-calendar-times text-4xl mb-3"></i>
                        <p>No events assigned yet</p>
                    </div>
                `}
            </div>

            <!-- My Tasks -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 class="text-xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-tasks mr-2 commotion-red"></i>
                    My Tasks
                </h2>
                ${assignedTasks.length > 0 ? `
                    <div class="space-y-3">
                        ${assignedTasks.map(task => {
                            const event = DEMO_DATA.events.find(e => e.id === task.eventId);
                            return `
                                <div class="p-4 rounded-lg border ${task.status === 'done' ? 'bg-green-50 border-green-200' : task.status === 'in-progress' ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}">
                                    <div class="flex items-start justify-between mb-2">
                                        <div class="flex items-start">
                                            <input type="checkbox" ${task.status === 'done' ? 'checked' : ''} class="mr-3 mt-1 w-5 h-5" disabled>
                                            <div>
                                                <h4 class="font-semibold text-gray-900">${task.title}</h4>
                                                <p class="text-sm text-gray-600 mt-1">${event ? event.name : 'Event'}</p>
                                            </div>
                                        </div>
                                        <span class="px-2 py-1 rounded-full text-xs font-semibold ${getTaskStatusBadgeClass(task.status)}">
                                            ${task.status.toUpperCase().replace('-', ' ')}
                                        </span>
                                    </div>
                                    <div class="ml-8 text-xs text-gray-500">
                                        <i class="fas fa-calendar mr-1"></i> Due: ${new Date(task.dueDate).toLocaleDateString('en-NZ', {month: 'short', day: 'numeric'})}
                                        ${task.priority ? ` | <i class="fas fa-flag mr-1"></i> ${task.priority}` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-check-circle text-4xl mb-3"></i>
                        <p>No tasks assigned</p>
                    </div>
                `}
            </div>

        </div>
    `;
}

function renderAdminCalendar() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;

    const firstDay = new Date(2025, 0, 1).getDay();
    const daysInMonth = 31;
    
    let html = '';
    
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day bg-gray-50"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `2025-01-${String(day).padStart(2, '0')}`;
        const eventsOnDay = DEMO_DATA.events.filter(e => 
            dateStr >= e.startDate && dateStr <= e.endDate
        );
        
        let isToday = day === 4;
        
        html += `<div class="calendar-day ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-white'}">
            <div class="p-2">
                <div class="text-right text-xs font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}">
                    ${day}
                </div>
                <div class="mt-1 space-y-1">
                    ${eventsOnDay.slice(0, 2).map(e => `
                        <div class="calendar-event text-white truncate" style="background-color: ${e.color}" onclick="viewEvent('${e.id}')">
                            ${e.name.split(' ')[0]}
                        </div>
                    `).join('')}
                    ${eventsOnDay.length > 2 ? `<div class="text-xs text-gray-500">+${eventsOnDay.length - 2} more</div>` : ''}
                </div>
            </div>
        </div>`;
    }
    
    grid.innerHTML = html;
}

function renderAllEvents() {
    const container = document.getElementById('allEvents');
    if (!container) return;

    const statusColors = {
        'confirmed': 'green',
        'quote-sent': 'yellow',
        'in-progress': 'blue',
        'completed': 'gray',
        'lead': 'gray'
    };
    
    container.innerHTML = DEMO_DATA.events.map(event => {
        const color = statusColors[event.status] || 'gray';
        return `
            <div class="event-card bg-white rounded-lg p-4" 
                 style="border-left-color: ${event.color}"
                 onclick="viewEvent('${event.id}')">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-semibold text-gray-900">${event.name}</h3>
                    <span class="px-2 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700">
                        ${getStatusLabel(event.status)}
                    </span>
                </div>
                <div class="text-sm text-gray-600 space-y-1">
                    <div><i class="fas fa-map-marker-alt text-gray-400 w-4"></i> ${event.location}</div>
                    <div><i class="fas fa-calendar text-gray-400 w-4"></i> ${formatDateRange(event.startDate, event.endDate)}</div>
                    <div><i class="fas fa-users text-gray-400 w-4"></i> ${event.crewCount} crew | ${event.attendees.toLocaleString()} attendees</div>
                </div>
                <div class="mt-3 flex items-center justify-between text-xs">
                    <span class="text-gray-500">${event.clientName}</span>
                    <span class="font-semibold commotion-red">$${event.quoteAmount.toLocaleString()}</span>
                </div>
            </div>
        `;
    }).join('');
}

function viewEvent(eventId) {
    window.location.href = `event-detail.html?id=${eventId}`;
}

function getStatusLabel(status) {
    const labels = {
        'confirmed': 'Confirmed',
        'quote-sent': 'Quote Sent',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'lead': 'Lead',
        'pending': 'Pending'
    };
    return labels[status] || status;
}

function getStatusBadgeClass(status) {
    const classes = {
        'confirmed': 'bg-green-100 text-green-700',
        'quote-sent': 'bg-yellow-100 text-yellow-700',
        'in-progress': 'bg-blue-100 text-blue-700',
        'completed': 'bg-gray-100 text-gray-700',
        'lead': 'bg-gray-100 text-gray-700',
        'pending': 'bg-gray-100 text-gray-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
}

function getTaskStatusBadgeClass(status) {
    const classes = {
        'done': 'bg-green-100 text-green-700',
        'in-progress': 'bg-yellow-100 text-yellow-700',
        'todo': 'bg-gray-100 text-gray-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
}

function formatDateRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('en-NZ', {month: 'short', day: 'numeric'})} - ${endDate.toLocaleDateString('en-NZ', {month: 'short', day: 'numeric', year: 'numeric'})}`;
}

function showModal(type) {
    alert('Modal for ' + type + ' coming soon!');
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}
