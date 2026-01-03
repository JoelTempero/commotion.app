// Demo Data for EventCrew Pro
// Realistic New Zealand Festival Data

const DEMO_DATA = {
    events: [
        {
            id: 'evt-001',
            name: 'Hidden Lakes Festival 2025',
            client_id: 'client-001',
            clientName: 'Hidden Lakes Events Ltd',
            startDate: '2025-02-14',
            endDate: '2025-02-16',
            location: 'Cooks Beach, Coromandel',
            status: 'confirmed',
            type: 'festival',
            attendees: 5000,
            budget: 15000,
            quoteAmount: 12500,
            paidAmount: 6250,
            paymentStatus: 'deposit',
            crewCount: 4,
            gearValue: 45000,
            deliverables: [
                { type: 'Highlight Reel', duration: '3-5 min', dueDate: '2025-03-01', status: 'pending' },
                { type: 'Full Coverage', duration: '45 min', dueDate: '2025-03-15', status: 'pending' },
                { type: 'Social Media Clips', duration: '30-60 sec', dueDate: '2025-02-20', status: 'pending' }
            ],
            tasks: 12,
            completedTasks: 8,
            notes: 'Three-day boutique festival. Main stage coverage priority. VIP area requires special access passes.',
            color: '#10b981'
        },
        {
            id: 'evt-002',
            name: 'Festival One 2025',
            client_id: 'client-002',
            clientName: 'Festival One Productions',
            startDate: '2025-01-02',
            endDate: '2025-01-04',
            location: 'Tairua, Coromandel',
            status: 'completed',
            type: 'festival',
            attendees: 3500,
            budget: 10000,
            quoteAmount: 9800,
            paidAmount: 9800,
            paymentStatus: 'paid',
            crewCount: 3,
            gearValue: 32000,
            deliverables: [
                { type: 'Highlight Reel', duration: '4 min', dueDate: '2025-01-20', status: 'completed' },
                { type: 'Social Media Package', duration: 'Various', dueDate: '2025-01-10', status: 'completed' }
            ],
            tasks: 15,
            completedTasks: 15,
            notes: 'Beach location. Electronic music focus. Excellent sunset shots on Day 2.',
            color: '#6366f1'
        },
        {
            id: 'evt-003',
            name: 'Electric Avenue 2024',
            client_id: 'client-003',
            clientName: 'Electric Avenue Trust',
            startDate: '2024-12-28',
            endDate: '2024-12-30',
            location: 'Christchurch',
            status: 'in-progress',
            type: 'festival',
            attendees: 8000,
            budget: 18000,
            quoteAmount: 16500,
            paidAmount: 8250,
            paymentStatus: 'partial',
            crewCount: 5,
            gearValue: 52000,
            deliverables: [
                { type: 'Highlight Reel', duration: '5 min', dueDate: '2025-01-15', status: 'in-progress' },
                { type: 'Artist Spotlights', duration: '10x 2min', dueDate: '2025-01-20', status: 'in-progress' },
                { type: 'After Movie', duration: '8-10 min', dueDate: '2025-01-30', status: 'pending' }
            ],
            tasks: 18,
            completedTasks: 12,
            notes: 'Large urban festival. Multiple stages. Drone footage approved for aerial shots.',
            color: '#f59e0b'
        },
        {
            id: 'evt-004',
            name: 'Rhythm & Alps 2025',
            client_id: 'client-004',
            clientName: 'R&A Festival Ltd',
            startDate: '2024-12-29',
            endDate: '2025-01-01',
            location: 'Cardrona Valley, Wanaka',
            status: 'in-progress',
            type: 'festival',
            attendees: 10000,
            budget: 22000,
            quoteAmount: 20000,
            paidAmount: 10000,
            paymentStatus: 'partial',
            crewCount: 6,
            gearValue: 68000,
            deliverables: [
                { type: 'Official After Movie', duration: '8 min', dueDate: '2025-01-20', status: 'in-progress' },
                { type: 'Daily Highlights', duration: '4x 3min', dueDate: '2025-01-05', status: 'in-progress' },
                { type: 'Sponsor Content', duration: 'Various', dueDate: '2025-01-10', status: 'pending' }
            ],
            tasks: 24,
            completedTasks: 16,
            notes: 'Premium festival in stunning alpine location. Weather-dependent drone shots. Camping coverage required.',
            color: '#ec4899'
        },
        {
            id: 'evt-005',
            name: 'Splore 2025',
            client_id: 'client-005',
            clientName: 'Splore Festival Trust',
            startDate: '2025-02-21',
            endDate: '2025-02-23',
            location: 'Tapapakanga Regional Park, Auckland',
            status: 'quote-sent',
            type: 'festival',
            attendees: 6000,
            budget: 14000,
            quoteAmount: 13200,
            paidAmount: 0,
            paymentStatus: 'pending',
            crewCount: 4,
            gearValue: 48000,
            deliverables: [
                { type: 'Festival Documentary', duration: '12-15 min', dueDate: '2025-03-15', status: 'pending' },
                { type: 'Highlight Reel', duration: '4 min', dueDate: '2025-03-05', status: 'pending' },
                { type: 'Social Media Content', duration: 'Various', dueDate: '2025-02-25', status: 'pending' }
            ],
            tasks: 0,
            completedTasks: 0,
            notes: 'Arts & music festival with unique coastal setting. Focus on creative installations and beach activities.',
            color: '#8b5cf6'
        },
        {
            id: 'evt-006',
            name: 'Northern Bass 2025',
            client_id: 'client-006',
            clientName: 'ABA Events',
            startDate: '2024-12-29',
            endDate: '2025-01-01',
            location: 'Mangawhai',
            status: 'confirmed',
            type: 'festival',
            attendees: 7500,
            budget: 17000,
            quoteAmount: 15800,
            paidAmount: 7900,
            paymentStatus: 'deposit',
            crewCount: 5,
            gearValue: 55000,
            deliverables: [
                { type: 'After Movie', duration: '6-8 min', dueDate: '2025-01-25', status: 'pending' },
                { type: 'Stage Recaps', duration: '3x 4min', dueDate: '2025-01-15', status: 'pending' }
            ],
            tasks: 14,
            completedTasks: 10,
            notes: 'Bass music festival. Three stages plus art installations. Night shooting equipment essential.',
            color: '#06b6d4'
        },
        {
            id: 'evt-007',
            name: 'Bay Dreams Nelson 2025',
            client_id: 'client-007',
            clientName: 'Bay Dreams Ltd',
            startDate: '2025-01-03',
            endDate: '2025-01-04',
            location: 'Trafalgar Park, Nelson',
            status: 'lead',
            type: 'festival',
            attendees: 12000,
            budget: 25000,
            quoteAmount: 0,
            paidAmount: 0,
            paymentStatus: 'pending',
            crewCount: 0,
            gearValue: 0,
            deliverables: [],
            tasks: 0,
            completedTasks: 0,
            notes: 'Initial inquiry. Major festival with big-name artists. Requires full production crew if confirmed.',
            color: '#64748b'
        },
        {
            id: 'evt-008',
            name: 'Laneway Festival Auckland 2025',
            client_id: 'client-008',
            clientName: 'Laneway Productions NZ',
            startDate: '2025-01-27',
            endDate: '2025-01-27',
            location: 'Silo Park, Auckland',
            status: 'confirmed',
            type: 'festival',
            attendees: 9000,
            budget: 12000,
            quoteAmount: 11500,
            paidAmount: 5750,
            paymentStatus: 'deposit',
            crewCount: 4,
            gearValue: 42000,
            deliverables: [
                { type: 'Artist Performances', duration: '8x 3min', dueDate: '2025-02-05', status: 'pending' },
                { type: 'Festival Highlights', duration: '5 min', dueDate: '2025-02-10', status: 'pending' }
            ],
            tasks: 10,
            completedTasks: 6,
            notes: 'One-day urban festival. Multiple stages in compact venue. Crowd safety priority.',
            color: '#14b8a6'
        }
    ],

    clients: [
        { id: 'client-001', company: 'Hidden Lakes Events Ltd', contact: 'Sarah Johnson', email: 'sarah@hiddenlakes.co.nz', phone: '+64 21 987 6543' },
        { id: 'client-002', company: 'Festival One Productions', contact: 'Mark Williams', email: 'mark@festivalone.co.nz', phone: '+64 27 123 4567' },
        { id: 'client-003', company: 'Electric Avenue Trust', contact: 'Emma Davis', email: 'emma@electricavenue.co.nz', phone: '+64 21 456 7890' },
        { id: 'client-004', company: 'R&A Festival Ltd', contact: 'Tom Roberts', email: 'tom@rhythmandalps.co.nz', phone: '+64 27 789 0123' },
        { id: 'client-005', company: 'Splore Festival Trust', contact: 'Lisa Chen', email: 'lisa@splore.co.nz', phone: '+64 21 234 5678' },
        { id: 'client-006', company: 'ABA Events', contact: 'Jake Morrison', email: 'jake@northernbass.co.nz', phone: '+64 27 567 8901' },
        { id: 'client-007', company: 'Bay Dreams Ltd', contact: 'Rachel Green', email: 'rachel@baydreams.co.nz', phone: '+64 21 678 9012' },
        { id: 'client-008', company: 'Laneway Productions NZ', contact: 'David Kim', email: 'david@laneway.co.nz', phone: '+64 27 890 1234' }
    ],

    crew: [
        { id: 'crew-001', name: 'Mike Thompson', role: 'Lead Videographer', skills: ['Camera Op', 'Directing', 'Gimbal'], rate: 450, phone: '+64 21 111 2222', email: 'mike@example.com', available: true },
        { id: 'crew-002', name: 'Sarah Chen', role: 'Drone Operator', skills: ['Drone', 'Aerial', 'Part 102 Certified'], rate: 380, phone: '+64 27 222 3333', email: 'sarah@example.com', available: true },
        { id: 'crew-003', name: 'James Wilson', role: 'Camera Operator', skills: ['Camera Op', '4K', 'Multi-cam'], rate: 350, phone: '+64 21 333 4444', email: 'james@example.com', available: false },
        { id: 'crew-004', name: 'Emily Brown', role: 'Sound Recordist', skills: ['Audio', 'Field Recording', 'Mixing'], rate: 320, phone: '+64 27 444 5555', email: 'emily@example.com', available: true },
        { id: 'crew-005', name: 'Tom Anderson', role: 'Gimbal Operator', skills: ['Gimbal', 'Stabilization', 'Tracking'], rate: 340, phone: '+64 21 555 6666', email: 'tom@example.com', available: true },
        { id: 'crew-006', name: 'Lisa Martinez', role: 'Video Editor', skills: ['Premiere Pro', 'DaVinci', 'Color'], rate: 360, phone: '+64 27 666 7777', email: 'lisa@example.com', available: true },
        { id: 'crew-007', name: 'David Kim', role: 'Colorist', skills: ['Color Grading', 'DaVinci', 'LUTs'], rate: 370, phone: '+64 21 777 8888', email: 'davidk@example.com', available: false },
        { id: 'crew-008', name: 'Rachel Green', role: 'Production Assistant', skills: ['Logistics', 'Coordination', 'Admin'], rate: 280, phone: '+64 27 888 9999', email: 'rachel@example.com', available: true },
        { id: 'crew-009', name: 'Chris Lee', role: 'Lighting Tech', skills: ['Lighting', 'Aputure', 'Setup'], rate: 310, phone: '+64 21 999 0000', email: 'chris@example.com', available: true },
        { id: 'crew-010', name: 'Anna Taylor', role: 'Social Media Creator', skills: ['Content', 'Instagram', 'TikTok'], rate: 290, phone: '+64 27 000 1111', email: 'anna@example.com', available: true }
    ],

    gear: [
        { id: 'gear-001', name: 'Sony FX6 Camera #1', category: 'Camera', value: 8500, status: 'available', assignedTo: null },
        { id: 'gear-002', name: 'Sony FX6 Camera #2', category: 'Camera', value: 8500, status: 'available', assignedTo: null },
        { id: 'gear-003', name: 'Sony FX6 Camera #3', category: 'Camera', value: 8500, status: 'in-use', assignedTo: 'evt-003' },
        { id: 'gear-004', name: 'DJI Ronin RS3 Pro #1', category: 'Gimbal', value: 1200, status: 'available', assignedTo: null },
        { id: 'gear-005', name: 'DJI Ronin RS3 Pro #2', category: 'Gimbal', value: 1200, status: 'in-use', assignedTo: 'evt-004' },
        { id: 'gear-006', name: 'DJI Mavic 3 Cine #1', category: 'Drone', value: 6500, status: 'available', assignedTo: null },
        { id: 'gear-007', name: 'DJI Mavic 3 Cine #2', category: 'Drone', value: 6500, status: 'in-use', assignedTo: 'evt-003' },
        { id: 'gear-008', name: 'Sony 24-70mm GM II', category: 'Lens', value: 2800, status: 'available', assignedTo: null },
        { id: 'gear-009', name: 'Sony 70-200mm GM II', category: 'Lens', value: 3500, status: 'available', assignedTo: null },
        { id: 'gear-010', name: 'Rode NTG5 Shotgun Mic', category: 'Audio', value: 800, status: 'in-use', assignedTo: 'evt-004' },
        { id: 'gear-011', name: 'Zoom F6 Field Recorder', category: 'Audio', value: 900, status: 'available', assignedTo: null },
        { id: 'gear-012', name: 'Aputure 600d Pro', category: 'Lighting', value: 1800, status: 'available', assignedTo: null },
        { id: 'gear-013', name: 'Atomos Ninja V', category: 'Monitor', value: 900, status: 'available', assignedTo: null },
        { id: 'gear-014', name: 'Manfrotto Tripod Kit', category: 'Support', value: 450, status: 'available', assignedTo: null },
        { id: 'gear-015', name: 'CFexpress Card 256GB x5', category: 'Storage', value: 1500, status: 'available', assignedTo: null }
    ],

    tasks: [
        { id: 'task-001', eventId: 'evt-001', title: 'Site recce at Cooks Beach', assignedTo: 'crew-001', dueDate: '2025-02-10', status: 'done', priority: 'high' },
        { id: 'task-002', eventId: 'evt-001', title: 'Confirm stage access passes', assignedTo: 'crew-008', dueDate: '2025-02-12', status: 'done', priority: 'high' },
        { id: 'task-003', eventId: 'evt-001', title: 'Test drone flight permissions', assignedTo: 'crew-002', dueDate: '2025-02-13', status: 'in-progress', priority: 'medium' },
        { id: 'task-004', eventId: 'evt-001', title: 'Prepare camera packages', assignedTo: 'crew-001', dueDate: '2025-02-13', status: 'todo', priority: 'medium' },
        { id: 'task-005', eventId: 'evt-003', title: 'Review stage layouts', assignedTo: 'crew-001', dueDate: '2025-01-05', status: 'in-progress', priority: 'high' },
        { id: 'task-006', eventId: 'evt-003', title: 'Edit Day 1 highlights', assignedTo: 'crew-006', dueDate: '2025-01-08', status: 'in-progress', priority: 'urgent' },
        { id: 'task-007', eventId: 'evt-004', title: 'Color grade main footage', assignedTo: 'crew-007', dueDate: '2025-01-10', status: 'in-progress', priority: 'high' },
        { id: 'task-008', eventId: 'evt-004', title: 'Compile sponsor segments', assignedTo: 'crew-006', dueDate: '2025-01-09', status: 'todo', priority: 'medium' }
    ],

    stats: {
        totalRevenue: 142300,
        activeEvents: 8,
        completedEvents: 12,
        totalCrew: 10,
        gearValue: 85000,
        upcomingDeadlines: 6,
        monthlyBookings: [
            { month: 'Sep', bookings: 2 },
            { month: 'Oct', bookings: 3 },
            { month: 'Nov', bookings: 4 },
            { month: 'Dec', bookings: 6 },
            { month: 'Jan', bookings: 5 },
            { month: 'Feb', bookings: 4 }
        ]
    }
};

// Utility functions
function getEventById(id) {
    return DEMO_DATA.events.find(e => e.id === id);
}

function getClientById(id) {
    return DEMO_DATA.clients.find(c => c.id === id);
}

function getCrewById(id) {
    return DEMO_DATA.crew.find(c => c.id === id);
}

function getEventsByStatus(status) {
    return DEMO_DATA.events.filter(e => e.status === status);
}

function getUpcomingEvents() {
    const now = new Date();
    return DEMO_DATA.events.filter(e => new Date(e.startDate) > now).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
}

function getRecentEvents() {
    const now = new Date();
    return DEMO_DATA.events.filter(e => new Date(e.endDate) < now).sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
}
