# ToonMate 🐾⏰

> **Your Cartoon Schedule Companion, Real Desktop Window Pet & Virtual Personal Assistant**

**ToonMate** is a modern, responsive personal schedule application where an animated cartoon character acts as your virtual assistant. Instead of boring static notifications, your companion interacts with you, vocalizes reminders, walks directly across your real desktop screen, reacts to completed/missed tasks, and makes daily planning fun.

---

## ✨ Key Features

- 🎭 **11 Fully Functional Cartoon Characters**:
  - **🐾 Original ToonMates**: Bambu (Panda) 🐼, Sparky (Robot) 🤖, Mochi (Cat) 🐱, Barkley (Dog) 🐶, Rusty (Fox) 🦊, Cosmo (Superhero) 🦸.
  - **🎌 Anime Legends**: Shinchan Nohara 👦, Doraemon 🐱, Pikachu ⚡, Monkey D. Luffy 🍖, Ninja Hattori 🥷.
- 🔑 **User Registration & Login Forms**:
  - Full registration with starter mascot selection.
  - Login with password peek/hide mascot reaction 🙈.
  - One-click demo login, session persistence, and topbar account management.
- 🪟 **Real Windows Desktop Window Walking Companion (Desktop Shimeji)**:
  - Transparent, frameless, always-on-top pet that walks directly on your real Windows screen over any application!
  - Disturb & nag system that reminds you when tasks are approaching.
  - Right-click context menu to switch between any of the 11 characters on the fly!
  - 🛑 Instant Stop controls: Red STOP button, <kbd>ESC</kbd>, <kbd>q</kbd>, or right-click menu.
- 🗣️ **Text-to-Speech & Voice**: Web Speech API integration speaks reminders, queries, and celebrations aloud.
- 💬 **Interactive AI Chat**: Ask *“What do I have today?”*, *“When is my next class?”*, *“What should I do next?”*, or ask for jokes and motivation.
- ⏰ **Smart Reminders**: Real-time ticker with tiered advance warnings (30m, 10m, start time) and floating alert toasts.
- 📅 **Today's Timeline & Calendar**: Connected chronological timeline plus Month, Week, and Day calendar views.
- 🏆 **Gamification**: Daily & weekly completion %, XP levels, streaks, and unlockable achievement badges with confetti.
- 👗 **Character Studio & Wardrobe**: Rename character, equip accessories (Glasses, Hat, Bowtie, Cape, Headset, Scarf), and choose habitats & personalities.
- 🌙 **Daily Summary**: Evening review with vocalized mascot commentary and performance stats.
- 📱 **Responsive Design**: Tailored for desktop, tablet, and mobile with bottom navigation.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Icons & Effects**: Lucide React + Canvas Confetti
- **Audio & Speech**: Web Audio API + Web Speech API (Synthesis)
- **Desktop Shimeji Pet**: Python Tkinter with chroma-key window transparency

---

## 🚀 Getting Started

### 1. Web Application

```bash
# Clone the repository
git clone https://github.com/chiddarth/toonmate.git

# Navigate to project folder
cd toonmate

# Install dependencies
npm install

# Start the web development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 2. Real Windows Desktop Companion (Desktop Pet)

```bash
# Launch default companion (Bambu the Panda)
npm run desktop

# Or launch any specific character:
python desktop-companion/desktop_pet.py Shinchan shinchan
python desktop-companion/desktop_pet.py Sparky robot
python desktop-companion/desktop_pet.py Pikachu pikachu
```

*To stop the desktop companion at any time, click the red **[🛑 STOP]** button above the pet, or press <kbd>ESC</kbd> / <kbd>q</kbd>.*

---

## 📦 Building for Production

```bash
npm run build
npm run preview
```

---

## 📄 License

MIT
