# ⚡ FitTrack AI - Personal AI Fitness & Health Tracker

> **"Train Smarter. Eat Better. Track Everything."**

FitTrack AI is a premium, privacy-first, mobile-responsive fitness application designed specifically to help you manage your daily workout routines, calories, protein surplus goals, body measurements, sleep, water, and streaks in one unified place.

---

## 📁 1. Project Folder Structure

Your project is structured cleanly so that HTML (structure), CSS (styling), and JavaScript (logic) are kept separate:

```
fitness-tracker/
│
├── index.html               # Main application HTML structure
├── style.css                # Premium Dark Glassmorphism design system & light theme
├── script.js                # Core app engine (LocalStorage, trackers, timers, charts, mock AI)
├── manifest.json            # PWA manifest for mobile installation
├── sw.js                    # Service worker for offline capability
│
├── assets/
│   ├── images/              # Media assets & demo graphics
│   └── icons/               # App icons & badges
│
└── README.md                # Complete beginner guide & documentation
```

---

## 🛠️ 2. How to Create and Open this Project in VS Code

Follow these exact beginner steps:

### Step 1: Open VS Code
Launch **Visual Studio Code** on your computer.

### Step 2: Open Folder
1. Click on **File** in the top menu bar.
2. Select **Open Folder...** (or press `Ctrl + K, Ctrl + O`).
3. Navigate to: `C:\Users\Lenovo\.gemini\antigravity\scratch\fitness-tracker`
4. Click **Select Folder**.

### Step 3: Verify Your Files
In the left sidebar (File Explorer), you will see:
* `index.html`
* `style.css`
* `script.js`
* `manifest.json`
* `sw.js`
* `README.md`
* `assets/` folder

---

## 🚀 3. How to Run the Application

### Method A: Using Live Server (Recommended)
1. Open VS Code.
2. Click on the **Extensions** icon on the left sidebar (or press `Ctrl + Shift + X`).
3. Search for **Live Server** (by Ritwick Dey) and click **Install**.
4. Right-click on `index.html` in VS Code and select **"Open with Live Server"**.
5. Your default browser will open automatically at `http://127.0.0.1:5500`.

### Method B: Double-Click File
Simply open the `fitness-tracker` folder in Windows File Explorer and double-click `index.html`. It will open instantly in Google Chrome or Microsoft Edge.

---

## 💡 4. Major Features & How They Work

### 🏠 Dashboard Overview
* Real-time progress bars for Calories consumed, Protein, Water, Daily Steps, Sleep, and Gym Workout completion.
* Dynamic calculation of remaining calories and protein required for lean weight gain (bulking from 52 kg).
* Quick action buttons for logging water (+250ml) and launching your workout.

### 🏋️ Workout Logger & Rest Timer
* Select workout focus (Push, Pull, Legs, Chest, Back, Shoulders, Arms, Full Body, Cardio, Custom).
* Track Exercise Name, Sets, Reps, and Weight lifted.
* Integrated **Rest Timer**: When you complete a set, a 60-second rest timer triggers automatically with visual indicators and alerts.
* Tracks personal records (PRs) and saves finished sessions to your Workout History log.

### ⏱️ 2-Hour Daily Gym Routine Engine
* Fully customizable breakdown of your 2-hour workout:
  * 10 min Warm-Up
  * 60 min Strength Training
  * 20 min Cardio / Conditioning
  * 10 min Core Workout
  * 10 min Cool Down
  * 10 min Stretching & Mobility
* Live interactive timer with Play, Pause, and Reset controls.

### 🍗 Nutrition Tracker & Built-In Protein Database
* Categorized meal logging: Breakfast, Lunch, Dinner, and Snacks.
* Built-in 1-click **High-Protein Preset Database** featuring: Whole Eggs, Chicken Breast, Paneer, Whey Protein, Greek Yogurt/Curd, Dal, Chickpeas, Rajma, Soy Chunks, Tofu, Oats, Peanut Butter, Fish, Milk, Nuts, and Rice.
* All values are editable to suit your exact portion sizes.

### 🧮 Calorie & Protein Calculators
* Uses the scientifically validated **Mifflin-St Jeor** equation customized for an 18-year-old male at 52 kg and 5'9" aiming for muscle building (+500 kcal surplus target = ~2,400 kcal/day).
* Custom protein target manager allowing choices between 1.6g, 2.0g, or 2.2g per kg of body weight (~104g – 150g/day).
* *Medical Disclaimer: Includes a clear warning that calculations are fitness estimates and not formal medical advice.*

### 💊 Supplement Tracker
* Daily checklist for Whey Protein, Creatine Monohydrate, and Multivitamin.
* Includes educational background on Creatine Monohydrate and a recommendation to consult a doctor if medical conditions exist.

### 👟 Steps, Water & Sleep Trackers
* Manual step entry with weekly averages.
* Quick-add water hydration buttons (+250ml, +500ml).
* Sleep duration calculator with bedtime/wake-time selection and quality rating.

### ⚖️ Body Measurement Tracker
* Log weekly entries for Body Weight, Chest, Waist, Arms/Biceps, and Thighs.
* History table with instant entry deletion support.

### 📊 Progress Charts (Chart.js)
* Visual interactive charts for Weight progression over time, Calorie intake vs goal, Daily protein consumption, and Daily step count trends.

### 🤖 AI Fitness Assistant & Vision Food Scanner (Demo Engine)
* **Rule-Based Assistant**: Responds instantly to queries regarding high-protein breakfasts, post-workout meals, beginner routines, and remaining macros.
* **Vision Scanner Demo**: Upload or drop any meal image to simulate multi-modal AI nutrient recognition and automatically populate your meal log.

### 🗓️ Weekly Planner & Daily Habits Checklist
* Customize daily habits (e.g., morning water, protein shake, 8h sleep).
* Plan your workout focus for every day of the week (Mon–Sun).

### 🔥 Streaks & Badges Matrix
* Tracks consecutive active days for Workouts, Protein goals, Water intake, and Step targets.
* Unlocks 8 neon achievement medals as you hit milestones.

---

## 💾 5. How LocalStorage Works

FitTrack AI stores all data directly inside your web browser using **HTML5 LocalStorage**.

### What is LocalStorage?
LocalStorage is a built-in key-value database inside your browser that holds data permanently on your computer—even when you close the tab or turn off your computer.

### How it is used in `script.js`:
1. **Saving Data**: `localStorage.setItem("fittrack_state", JSON.stringify(state));` converts the JavaScript `state` object into a JSON string and saves it.
2. **Retrieving Data**: `JSON.parse(localStorage.getItem("fittrack_state"))` reads the stored string and turns it back into usable JavaScript data upon page launch.
3. **Data Security & Privacy**: No personal data is sent to external servers. Your data stays 100% private on your machine.
4. **Backup & Restore**: In Settings, click **"Export Data"** to download a `.json` backup file, or click **"Import Data"** to restore your data on any device.

---

## 🤖 6. How the AI Demo Works & How to Connect Real AI APIs

### How the Demo Works:
In Version 1, the AI Assistant uses standard JavaScript rule-based keyword matching. When you ask a question like *"What should I eat for breakfast?"*, it scans for the keyword *"breakfast"* and returns an optimized meal suggestion tailored for lean weight gain.

### How to Connect a Real AI API Later (OpenAI / Gemini / Claude):
To connect a live AI model in production:

> ⚠️ **CRITICAL SECURITY RULE**: Never put an API key directly inside `script.js`. Anyone who views your web page source code can steal your API key!

#### Recommended Secure Architecture:
```
[ Browser App (FitTrack UI) ] ──> [ Your Backend (Node.js/Express) ] ──> [ OpenAI / Gemini API ]
                                       (Holds API Key Safely)
```

1. Create a lightweight Node.js/Express backend server.
2. Store your API Key inside an environment file (`.env`) on the server.
3. Send user questions from the frontend (`script.js`) to your backend endpoint (e.g., `POST /api/chat`).
4. The backend calls the Gemini/OpenAI API using the secret key and returns the response back to your web app.

---

## 📱 7. How to Install as a PWA (Progressive Web App)

You can install FitTrack AI directly on your Android phone or iPhone without publishing to the Google Play Store or Apple App Store!

### On Android (Chrome Browser):
1. Host your `fitness-tracker` folder on GitHub Pages, Netlify, or Vercel (or access it over your local WiFi network).
2. Open Chrome on your Android phone and visit the site URL.
3. Tap the **3 vertical dots menu (⋮)** in the top-right corner.
4. Tap **"Add to Home Screen"** or **"Install App"**.
5. FitTrack AI will now appear on your phone home screen like a native mobile app!

### On iPhone / iOS (Safari Browser):
1. Open Safari on your iPhone and visit your site URL.
2. Tap the **Share button** (square with an up arrow at the bottom).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add**. FitTrack AI is now installed on your iOS device!

---

## 📲 8. How to Convert into an Android App using Capacitor

If you want to package this exact HTML/CSS/JS application into a real native Android `.apk` app, follow these steps using **Capacitor** by Ionic:

### Step 1: Install Node.js
Download and install [Node.js](https://nodejs.org/) on your computer.

### Step 2: Initialize NPM in your project folder
Open VS Code Terminal (`Ctrl + ~`) inside `fitness-tracker` and run:
```bash
npm init -y
```

### Step 3: Install Capacitor CLI and Core
Run the following commands:
```bash
npm install @capacitor/core @capacitor/cli
```

### Step 4: Initialize Capacitor Configuration
Run:
```bash
npx cap init "FitTrack AI" "com.fittrack.ai" --web-dir ./
```

### Step 5: Add Android Platform
Run:
```bash
npm install @capacitor/android
npx cap add android
```

### Step 6: Sync Assets
Run:
```bash
npx cap sync
```

### Step 7: Open in Android Studio & Build APK
Run:
```bash
npx cap open android
```
This will open your project automatically in **Android Studio**. From Android Studio, click **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate your native Android application file!

---

## 🔮 9. What to Learn Next for Version 2 (Full-Stack Roadmap)

To upgrade FitTrack AI into a full commercial SaaS product:

1. **Frontend Framework**: Learn **React** or **Next.js** for component-driven UI development.
2. **Backend Server**: Learn **Node.js** with **Express.js** to build RESTful APIs.
3. **Database**: Learn **PostgreSQL** or **MongoDB** to save user accounts, workouts, and nutrition logs in the cloud instead of LocalStorage.
4. **Authentication**: Learn **JWT (JSON Web Tokens)** or **NextAuth** for user signup and login.
5. **Native Fitness APIs**: Integrate Capacitor Healthkit / Google Fit plugins to auto-sync steps directly from phone hardware sensors.

---

## 🏷️ License & Author
Built for **Personal Fitness & Health Tracking**.  
*FitTrack AI — Train Smarter. Eat Better. Track Everything.*
