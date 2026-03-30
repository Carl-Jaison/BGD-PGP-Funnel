# Client Funnel Tracker

A comprehensive lead management and sales funnel tracking application built for Takshashila Institution's PGP and BGD programmes.

## Features

### 1. Lead Management
- Complete lead information including organisation, stakeholder, designation, email, phone, location, industry, and more
- LinkedIn profile links
- Point of Contact tracking
- Meeting date scheduling
- Notes for each lead

### 2. Lead Stages
- **New Lead** - Fresh prospects ready for outreach
- **Email Sent** - Initial contact made
- **Meeting Scheduled** - Meeting confirmed
- **Proposal Sent** - Proposal delivered
- **Negotiation** - Active discussions
- **Converted** - Deal won
- **Lost** - Deal closed/lost

### 3. Dashboard Statistics
- Real-time counts for each stage
- "Contacted" metric includes all active pipeline stages (Email Sent, Meeting Scheduled, Proposal Sent, Negotiation, Converted)
- Click any stat card to scroll directly to that stage section

### 4. Programme Filtering
- **All** - View all leads
- **BGD** - Bangalore Global Dialogue leads only
- **PGP** - Post Graduate Programme leads only
- Separate stats for each view

### 5. Additional Features
- 🔍 Search across all lead fields
- ✏️ Add/Edit leads with full form
- 📥 Export to CSV
- 💾 Auto-saves to browser localStorage
- 📱 Responsive design for mobile/tablet

## Files

```
├── index.html    # Main HTML with styles
├── app.js        # React application code
├── data.js       # Initial leads data (144 leads from spreadsheet)
└── README.md     # This file
```

## Deployment to GitHub Pages

### Quick Setup

1. Create a new repository on GitHub (e.g., `funnel-tracker`)

2. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/funnel-tracker.git
   cd funnel-tracker
   ```

3. Copy all files (index.html, app.js, data.js) to the repository folder

4. Commit and push:
   ```bash
   git add .
   git commit -m "Initial funnel tracker deployment"
   git push origin main
   ```

5. Enable GitHub Pages:
   - Go to your repository Settings
   - Navigate to Pages (in the sidebar)
   - Under "Source", select "Deploy from a branch"
   - Select "main" branch and "/ (root)" folder
   - Click Save

6. Your tracker will be available at:
   ```
   https://YOUR_USERNAME.github.io/funnel-tracker/
   ```

### Alternative: Deploy to existing repository

If you want to add this to your existing `carl-jaison.github.io` repository:

1. Create a folder `funnel-tracker` in your repository
2. Copy all files into that folder
3. Access at: `https://carl-jaison.github.io/funnel-tracker/`

## Usage

### Changing Lead Stage
1. Find the lead card
2. Use the dropdown at the bottom to select a new stage
3. Changes are saved automatically

### Adding a New Lead
1. Click "+ Add Lead" button
2. Fill in the form (Organisation is required)
3. Select programme (BGD or PGP)
4. Click "Add Lead"

### Editing a Lead
1. Find the lead card
2. Click "✏️ Edit" button
3. Modify the information
4. Click "Update Lead"

### Exporting Data
1. Apply any filters/search as needed
2. Click "📥 Export CSV"
3. A CSV file will download with all visible leads

### Filtering by Programme
- Click "BGD" to see only Bangalore Global Dialogue leads
- Click "PGP" to see only Post Graduate Programme leads
- Click "All" to see everything

## Data Persistence

All data is saved to your browser's localStorage. This means:
- ✅ Data persists across browser sessions
- ✅ Changes are saved automatically
- ⚠️ Data is browser-specific (won't sync across devices)
- ⚠️ Clearing browser data will reset to initial leads

To share data across devices, use the Export CSV feature and re-import manually, or consider adding a backend database for multi-device sync.

## Initial Data

The tracker comes pre-loaded with 144 leads from the Bangalore Security Dialogue spreadsheet, all categorized as BGD leads and set to "New Lead" stage.

## Customization

### Adding New Stages
Edit `app.js` and modify the `STAGES` array:
```javascript
const STAGES = [
    { id: 'New Lead', label: 'New Lead', color: '#6366f1' },
    // Add your custom stage here
    { id: 'Custom Stage', label: 'Custom Stage', color: '#your-color' },
    ...
];
```

### Modifying Contacted Stages
The "Contacted" metric in the dashboard counts all stages in `CONTACTED_STAGES`:
```javascript
const CONTACTED_STAGES = ['Email Sent', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'Converted'];
```

## Tech Stack
- React 18 (via CDN)
- Vanilla CSS (no frameworks)
- LocalStorage for persistence
- No build tools required

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

---

Built for Takshashila Institution | BGD 2027 & PGP Pipeline Management
