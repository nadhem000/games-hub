# games-hub

A collection of fun and interactive browser games with multi-language support and progressive web app capabilities.

## Features

- 🎮 Multiple games (Color Match, Memory Challenge, and more)
- 🌐 Multi-language support (English, Arabic, French)
- 🌙 Dark/Light mode toggle
- 📱 Responsive design
- 🔔 Toast notifications
- ⚡ Progressive Web App (PWA) - Installable
- 💾 Local storage for settings persistence

## Games Included

### Color Match Challenge
Test your color perception skills by matching target colors against similar options.

### Memory Challenge
Train your memory by matching pairs of cards with various difficulty levels.

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Progressive Web App (PWA) features
- Local Storage for settings
- CSS Grid and Flexbox for layouts
- Custom CSS variables for theming

## Installation

### Option 1: Install as PWA
1. Visit the deployed site
2. Click the install button in the header
3. Follow your browser's prompts to install

### Option 2: Local Development
1. Clone the repository:
```bash
git clone https://github.com/nadhem000/gamehub.git
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

## Deployment

This project is configured for easy deployment on Netlify:

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Deploy automatically

## Project Structure

```
gamehub/
├── index.html              # Main landing page
├── GH-color-match.html     # Color Match game
├── GH-memory-challenge.html # Memory Challenge game
├── main.css               # Main stylesheet
├── main.js                # PWA and install functionality
├── global.js              # Global settings and utilities
├── translation.js         # Multi-language support
├── sw.js      # Service worker for PWA
├── manifest.json          # Web app manifest
├── assets/
│   └── icons/             # App icons for PWA
├── netlify.toml           # Netlify configuration
└── README.md              # This file
```

## Browser Support

- Chrome/Edge 79+
- Firefox 72+
- Safari 13+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the GNU License - see the [LICENSE](LICENSE) file for details.

## Developer

**Mejri Ziad**
- Version: v0.0.1

## Acknowledgments

- Icons from Twemoji
- Color palettes carefully selected for accessibility
- Inspired by classic browser games