# Maya Pandya - Portfolio

A modern, responsive portfolio website built with React and TypeScript, featuring smooth animations and a professional design.

## Features

- **Modern Design** - Dark theme with glassmorphism effects
- **Smooth Animations** - Framer Motion powered animations
- **Responsive Layout** - Works on all devices
- **Interactive Elements** - Hover effects and scroll animations
- **Project Showcase** - Links to all portfolio projects

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd portfolio-react
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
portfolio-react/
├── public/
│   ├── images/           # Project images
│   ├── finance_tracker_with_backend.html  # Finance tracker app
│   ├── photo-app.html    # Photo storage app
│   ├── osm.html          # Navigation system
│   ├── FACE.html         # Computer vision project
│   └── finance-backend/  # Backend for finance tracker
├── src/
│   ├── components/       # React components
│   ├── App.tsx          # Main app component
│   └── App.css          # Styles
└── package.json
```

## Portfolio Projects

### 1. Finance Tracker App
- **Description**: Professional finance dashboard with SQLite backend
- **Technologies**: Node.js, Express, SQLite, React
- **Access**: Click "View Project" in portfolio or open `finance_tracker_with_backend.html`
- **Backend Setup**: See `public/finance-backend/SETUP.md`

### 2. Photos App
- **Description**: Cloud-based photo storage system
- **Technologies**: Cloud, MySQL, Web App
- **Access**: Click "View Project" in portfolio or open `photo-app.html`

### 3. OSM Navigation System
- **Description**: Campus navigation using OpenStreetMap
- **Technologies**: OpenStreetMap, Navigation, Routing
- **Access**: Click "View Project" in portfolio or open `osm.html`

### 4. FACE Project
- **Description**: Facial anonymization ethics research
- **Technologies**: Computer Vision, Ethics, ML
- **Access**: Click "View Project" in portfolio or open `FACE.html`

## Running Individual Projects

### Finance Tracker (with Backend)
1. Start the backend:
   ```bash
   cd public/finance-backend
   npm install
   npm run init-db
   npm start
   ```
2. Open `finance_tracker_with_backend.html` in your browser
3. Login with: `janedoe` / `password123`

### Other Projects
- Simply open the respective HTML files in your browser
- All projects are self-contained and don't require additional setup

## Technologies Used

- **Frontend**: React, TypeScript, Framer Motion
- **Styling**: CSS3 with modern features (Grid, Flexbox, Custom Properties)
- **Animations**: Framer Motion, CSS animations
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)

## Customization

### Colors
The color scheme can be modified in `src/App.css`:
- Primary: `#9caf88` (green)
- Secondary: `#7a8f6a` (darker green)
- Background: `#0a0a0a` (dark)

### Content
- Update project information in `src/components/Portfolio.tsx`
- Modify personal information in `src/components/About.tsx`
- Change contact details in `src/components/Contact.tsx`

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use `gh-pages` package
- **Firebase**: Use Firebase Hosting

## Contact

- **Email**: maya.pandya1114@gmail.com
- **Phone**: 815-505-0222
- **LinkedIn**: [Maya Pandya](https://www.linkedin.com/in/maya-pandya)
- **GitHub**: [Maya1114](https://github.com/Maya1114)

## License

This project is open source and available under the [MIT License](LICENSE).
