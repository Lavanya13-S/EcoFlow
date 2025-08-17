# EcoFlow: Smart Water Conservation Platform

EcoFlow is a modern web application designed to help users track, analyze, and reduce their water consumption using smart analytics, AI-powered predictions, leak detection, and community engagement. Built with React, TypeScript, Vite, and Tailwind CSS, EcoFlow provides a beautiful, responsive, and interactive user experience.

## Features

- **Smart Analytics:** Visualize your water usage trends and gain actionable insights.
- **AI Predictions:** Forecast future water consumption with advanced AI models.
- **Leak Detection:** Detect unusual patterns and potential leaks early.
- **Community Impact:** Join a community of eco-conscious users and see collective impact.
- **Personal Dashboard:** Track your progress, achievements, and goals.
- **Notifications:** Get real-time feedback and achievement unlocks.
- **Secure Login/Signup:** Manage your profile and data securely.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide-react
- **PDF Export:** jsPDF
- **Node.js:** Used only for frontend tooling (development server, build, and dependency management). No backend/server-side code is present; all logic and data are handled in the browser.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)

### Installation
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd project
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

```
project/
  src/
    components/         # React components (Dashboard, WelcomePage, etc.)
    utils/              # Utility functions (mockData, storage)
    index.css           # Tailwind and global styles
    App.tsx             # Main app logic and routing
    main.tsx            # App entry point
  index.html            # Main HTML file
  package.json          # Project dependencies and scripts
  tailwind.config.js    # Tailwind CSS configuration
  vite.config.ts        # Vite configuration
```

## Customization
- **Feature Images:** You can update the feature images in `src/components/WelcomePage.tsx` by changing the URLs in the `features` array.
- **Branding:** Update the logo, colors, and text in the navigation and hero sections.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is for educational/demo purposes. Please contact the author for licensing details if you wish to use it commercially.

---

**EcoFlow** — Making every drop count!
