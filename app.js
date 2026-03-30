const { useState, useEffect, useRef } = React;

// Lead stages configuration
const STAGES = [
    { id: 'New Lead', label: 'New Lead', color: '#6366f1' },
    { id: 'Email Sent', label: 'Email Sent', color: '#3b82f6' },
    { id: 'Meeting Scheduled', label: 'Meeting Scheduled', color: '#f59e0b' },
    { id: 'Proposal Sent', label: 'Proposal Sent', color: '#a855f7' },
    { id: 'Negotiation', label: 'Negotiation', color: '#ec4899' },
    { id: 'Converted', label: 'Converted', color: '#22c55e' },
    { id: 'Lost', label: 'Lost', color: '#ef4444' }
];

// Contacted stages (all stages except New Lead and Lost)
const CONTACTED_STAGES = ['Email Sent', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'Converted'];

// Icons
const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>
);

const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);

const IndustryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18"/>
        <path d="M5 21V7l8-4v18"/>
        <path d="M19 21V11l-6-4"/>
        <path d="M9 9v.01"/>
        <path d="M9 12v.01"/>
        <path d="M9 15v.01"/>
        <path d="M9 18v.01"/>
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);

// Main App Component
function App() {
    const [leads, setLeads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState('all'); // 'all', 'bgd', 'pgp'
    const [showModal, setShowModal] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const stageRefs = useRef({});

    // Initialize leads from localStorage or INITIAL_LEADS
    useEffect(() => {
        const savedLeads = localStorage.getItem('funnelTrackerLeads');
        if (savedLeads) {
            setLeads(JSON.parse(savedLeads));
        } else {
            setLeads(INITIAL_LEADS);
        }
    }, []);

    // Save to localStorage when leads change
    useEffect(() => {
        if (leads.length > 0) {
            localStorage.setItem('funnelTrackerLeads', JSON.stringify(leads));
        }
    }, [leads]);

    // Filter leads based on search and view
    const filteredLeads = leads.filter(lead => {
        const matchesSearch = 
            lead.organisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.stakeholder.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesView = 
            activeView === 'all' || 
            lead.programme.toLowerCase() === activeView;
        
        return matchesSearch && matchesView;
    });

    // Calculate stats
    const getStats = (filterProgramme = null) => {
        const filtered = filterProgramme 
            ? leads.filter(l => l.programme.toLowerCase() === filterProgramme)
            : leads;
        
        const stats = {
            total: filtered.length,
            contacted: filtered.filter(l => CONTACTED_STAGES.includes(l.stage)).length
        };
        
        STAGES.forEach(stage => {
            stats[stage.id] = filtered.filter(l => l.stage === stage.id).length;
        });
        
        return stats;
    };

    const currentStats = activeView === 'all' 
        ? getStats() 
        : getStats(activeView);

    // Scroll to stage section
    const scrollToStage = (stageId) => {
        if (stageRefs.current[stageId]) {
            stageRefs.current[stageId].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Update lead stage
    const updateLeadStage = (leadId, newStage) => {
        setLeads(prev => prev.map(lead => 
            lead.id === leadId ? { ...lead, stage: newStage } : lead
        ));
    };

    // Save lead (add or update)
    const saveLead = (leadData) => {
        if (editingLead) {
            setLeads(prev => prev.map(lead => 
                lead.id === editingLead.id ? { ...lead, ...leadData } : lead
            ));
        } else {
            const newLead = {
                ...leadData,
                id: Math.max(...leads.map(l => l.id), 0) + 1
            };
            setLeads(prev => [...prev, newLead]);
        }
        setShowModal(false);
        setEditingLead(null);
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Organisation', 'Stakeholder', 'Designation', 'Email', 'Phone', 'Location', 'Industry', 'Main Business', 'LinkedIn', 'Point of Contact', 'Stage', 'Programme', 'Meeting Date', 'Notes'];
        const rows = filteredLeads.map(lead => [
            lead.organisation,
            lead.stakeholder,
            lead.designation,
            lead.email,
            lead.phone,
            lead.location,
            lead.industry,
            lead.mainBusiness,
            lead.linkedin,
            lead.pointOfContact,
            lead.stage,
            lead.programme,
            lead.meetingDate,
            lead.notes
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `funnel-tracker-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    // Group leads by stage
    const groupedLeads = {};
    STAGES.forEach(stage => {
        groupedLeads[stage.id] = filteredLeads.filter(l => l.stage === stage.id);
    });

    return (
        <div className="app-container">
            {/* Header */}
            <header className="header">
                <h1>🎯 Client Funnel Tracker</h1>
                <div className="header-actions">
                    <input 
                        type="text"
                        className="search-box"
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="view-toggle">
                        <button 
                            className={`view-btn ${activeView === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveView('all')}
                        >
                            All ({getStats().total})
                        </button>
                        <button 
                            className={`view-btn bgd ${activeView === 'bgd' ? 'active' : ''}`}
                            onClick={() => setActiveView('bgd')}
                        >
                            BGD ({getStats('bgd').total})
                        </button>
                        <button 
                            className={`view-btn pgp ${activeView === 'pgp' ? 'active' : ''}`}
                            onClick={() => setActiveView('pgp')}
                        >
                            PGP ({getStats('pgp').total})
                        </button>
                    </div>
                    <button className="export-btn" onClick={exportToCSV}>
                        📥 Export CSV
                    </button>
                    <button className="add-btn" onClick={() => { setEditingLead(null); setShowModal(true); }}>
                        + Add Lead
                    </button>
                </div>
            </header>

            {/* Dashboard Stats */}
            <div className="dashboard">
                <div 
                    className="stat-card" 
                    style={{'--card-color': '#6366f1'}}
                    onClick={() => scrollToStage('New Lead')}
                >
                    <h3>New Leads</h3>
                    <div className="value">{currentStats['New Lead']}</div>
                    <div className="subtitle">Ready for outreach</div>
                </div>
                <div 
                    className="stat-card"
                    style={{'--card-color': '#3b82f6'}}
                    onClick={() => scrollToStage('Email Sent')}
                >
                    <h3>Contacted</h3>
                    <div className="value">{currentStats.contacted}</div>
                    <div className="subtitle">In pipeline</div>
                </div>
                <div 
                    className="stat-card"
                    style={{'--card-color': '#f59e0b'}}
                    onClick={() => scrollToStage('Meeting Scheduled')}
                >
                    <h3>Meetings</h3>
                    <div className="value">{currentStats['Meeting Scheduled']}</div>
                    <div className="subtitle">Scheduled</div>
                </div>
                <div 
                    className="stat-card"
                    style={{'--card-color': '#a855f7'}}
                    onClick={() => scrollToStage('Proposal Sent')}
                >
                    <h3>Proposals</h3>
                    <div className="value">{currentStats['Proposal Sent']}</div>
                    <div className="subtitle">Sent</div>
                </div>
                <div 
                    className="stat-card"
                    style={{'--card-color': '#ec4899'}}
                    onClick={() => scrollToStage('Negotiation')}
                >
                    <h3>Negotiation</h3>
                    <div className="value">{currentStats['Negotiation']}</div>
                    <div className="subtitle">In progress</div>
                </div>
                <div 
                    className="stat-card"
                    style={{'--card-color': '#22c55e'}}
                    onClick={() => scrollToStage('Converted')}
                >
                    <h3>Converted</h3>
                    <div className="value">{currentStats['Converted']}</div>
                    <div className="subtitle">Won deals</div>
                </div>
                <div 
                    className="stat-card"
                    style={{'--card-color': '#ef4444'}}
                    onClick={() => scrollToStage('Lost')}
                >
                    <h3>Lost</h3>
                    <div className="value">{currentStats['Lost']}</div>
                    <div className="subtitle">Closed</div>
                </div>
            </div>

            {/* Stage Sections */}
            {STAGES.map(stage => (
                <div 
                    key={stage.id} 
                    className="stage-section"
                    ref={el => stageRefs.current[stage.id] = el}
                >
                    <div className="stage-header">
                        <span 
                            className="stage-badge"
                            style={{ background: stage.color }}
                        >
                            {stage.label}
                        </span>
                        <h2>{stage.label}</h2>
                        <span className="stage-count">
                            {groupedLeads[stage.id].length} leads
                        </span>
                    </div>
                    
                    {groupedLeads[stage.id].length > 0 ? (
                        <div className="leads-grid">
                            {groupedLeads[stage.id].map(lead => (
                                <LeadCard 
                                    key={lead.id}
                                    lead={lead}
                                    onEdit={() => { setEditingLead(lead); setShowModal(true); }}
                                    onStageChange={(newStage) => updateLeadStage(lead.id, newStage)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            No leads in this stage
                        </div>
                    )}
                </div>
            ))}

            {/* Modal */}
            {showModal && (
                <LeadModal
                    lead={editingLead}
                    onSave={saveLead}
                    onClose={() => { setShowModal(false); setEditingLead(null); }}
                />
            )}
        </div>
    );
}

// Lead Card Component
function LeadCard({ lead, onEdit, onStageChange }) {
    return (
        <div className="lead-card">
            <div className="lead-card-header">
                <div>
                    <div className="lead-org">{lead.organisation}</div>
                    <div className="lead-stakeholder">{lead.stakeholder}</div>
                    {lead.designation && (
                        <div className="lead-designation">{lead.designation}</div>
                    )}
                </div>
                <span className={`programme-badge ${lead.programme.toLowerCase()}`}>
                    {lead.programme}
                </span>
            </div>
            
            <div className="lead-details">
                {lead.email && (
                    <div className="lead-detail">
                        <EmailIcon />
                        <a href={`mailto:${lead.email.split(',')[0].trim()}`}>
                            {lead.email.split(',')[0].trim()}
                        </a>
                    </div>
                )}
                {lead.phone && (
                    <div className="lead-detail">
                        <PhoneIcon />
                        <span>{lead.phone}</span>
                    </div>
                )}
                {lead.location && (
                    <div className="lead-detail">
                        <LocationIcon />
                        <span>{lead.location}</span>
                    </div>
                )}
                {lead.industry && (
                    <div className="lead-detail">
                        <IndustryIcon />
                        <span>{lead.industry}</span>
                    </div>
                )}
                {lead.pointOfContact && (
                    <div className="lead-detail">
                        <UserIcon />
                        <span>PoC: {lead.pointOfContact}</span>
                    </div>
                )}
                {lead.linkedin && lead.linkedin !== 'N.A' && lead.linkedin.includes('linkedin') && (
                    <div className="lead-detail">
                        <LinkedInIcon />
                        <a href={lead.linkedin.split(',')[0].trim()} target="_blank" rel="noopener noreferrer">
                            LinkedIn Profile
                        </a>
                    </div>
                )}
                {lead.meetingDate && (
                    <div className="meeting-date">
                        <CalendarIcon />
                        <span>Meeting: {lead.meetingDate}</span>
                    </div>
                )}
            </div>
            
            {lead.notes && (
                <div className="notes-preview">
                    {lead.notes.substring(0, 100)}{lead.notes.length > 100 ? '...' : ''}
                </div>
            )}
            
            <div className="lead-actions">
                <button className="lead-action-btn edit" onClick={onEdit}>
                    ✏️ Edit
                </button>
                <select 
                    className="stage-select"
                    value={lead.stage}
                    onChange={(e) => onStageChange(e.target.value)}
                >
                    {STAGES.map(stage => (
                        <option key={stage.id} value={stage.id}>
                            {stage.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

// Lead Modal Component
function LeadModal({ lead, onSave, onClose }) {
    const [formData, setFormData] = useState(lead || {
        organisation: '',
        stakeholder: '',
        designation: '',
        email: '',
        phone: '',
        location: '',
        industry: '',
        mainBusiness: '',
        linkedin: '',
        pointOfContact: '',
        stage: 'New Lead',
        programme: 'BGD',
        meetingDate: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Organisation *</label>
                                <input 
                                    type="text"
                                    name="organisation"
                                    value={formData.organisation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Stakeholder Name</label>
                                <input 
                                    type="text"
                                    name="stakeholder"
                                    value={formData.stakeholder}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Designation</label>
                                <input 
                                    type="text"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input 
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input 
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Industry</label>
                                <input 
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Main Business</label>
                                <input 
                                    type="text"
                                    name="mainBusiness"
                                    value={formData.mainBusiness}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>LinkedIn URL</label>
                                <input 
                                    type="text"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Point of Contact</label>
                                <input 
                                    type="text"
                                    name="pointOfContact"
                                    value={formData.pointOfContact}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Programme</label>
                                <select 
                                    name="programme"
                                    value={formData.programme}
                                    onChange={handleChange}
                                >
                                    <option value="BGD">BGD</option>
                                    <option value="PGP">PGP</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Stage</label>
                                <select 
                                    name="stage"
                                    value={formData.stage}
                                    onChange={handleChange}
                                >
                                    {STAGES.map(stage => (
                                        <option key={stage.id} value={stage.id}>
                                            {stage.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Meeting Date</label>
                                <input 
                                    type="date"
                                    name="meetingDate"
                                    value={formData.meetingDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Notes</label>
                                <textarea 
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Add any additional notes..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {lead ? 'Update Lead' : 'Add Lead'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
