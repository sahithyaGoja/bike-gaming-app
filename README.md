# 🚴 Bike Racing Game

A fun and interactive bike racing game built with vanilla JavaScript, HTML5 Canvas, and CSS3.

## Features

- **Dynamic Gameplay**: Speed up, brake, and steer your bike to avoid obstacles
- **Power-ups**: Collect golden power-ups to boost your speed and score
- **Real-time Statistics**: Track your speed, distance, and score
- **Smooth Animations**: Particle effects and smooth visual feedback
- **Responsive Design**: Works on desktop and mobile devices
- **Progressive Difficulty**: Game gets more challenging as you go faster

## How to Play

### Controls
- **Arrow Keys** or **A/D**: Steer left and right
- **Space Bar**: Accelerate
- **Shift Key**: Brake
- **Start Button**: Begin the game
- **Pause Button**: Pause/resume the game
- **Reset Button**: Restart the game

### Game Mechanics
1. Start the game by clicking the "Start Game" button
2. Use your keyboard to navigate your bike
3. **Avoid red obstacles** - hitting them will slow you down
4. **Collect gold power-ups** - they will increase your speed and score
5. Try to achieve the highest score possible!

### Scoring
- Points are awarded based on distance traveled
- Bonus points for collecting power-ups
- Base formula: `Score = Distance × 10`
- Power-up bonus: `+100 points`

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sahithyaGoja/bike-gaming-app.git
```

2. Navigate to the project directory:
```bash
cd bike-gaming-app
```

3. Open `index.html` in your web browser

Or use a local server:
```bash
python -m http.server 8000
# or
node -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Game Statistics

- **Speed**: Current bike speed (km/h), max 200 km/h
- **Distance**: Total distance traveled (km)
- **Score**: Overall game score

## Technical Details

### Technologies Used
- **HTML5**: Structure and Canvas API
- **CSS3**: Styling and animations
- **JavaScript (ES6)**: Game logic and mechanics
- **Canvas API**: Rendering graphics

### Game Objects
- **Bike**: Player-controlled vehicle
- **Obstacles**: Red squares to avoid
- **Power-ups**: Golden circles to collect
- **Particles**: Visual effects for collisions

### Key Features
- Collision detection
- Particle system for effects
- Speed and acceleration physics
- Input handling for smooth controls
- Real-time UI updates

## Browser Support

- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

## Future Enhancements

- [ ] Leaderboard system
- [ ] Different difficulty levels
- [ ] Multiple bike skins/customization
- [ ] Sound effects and background music
- [ ] Mobile touch controls
- [ ] Power-up variety (speed boost, shield, etc.)
- [ ] Multi-player mode
- [ ] Track variations and scenery
- [ ] Achievement system

## Author

**Sahithya Goja**

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

If you encounter any issues or have suggestions, please create an issue in the repository.

Have fun racing! 🏁