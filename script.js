/* ----------------------------------------------------
   FitTrack AI - Core JavaScript Application Engine
   Author: FitTrack Development Team
   Architecture: Vanilla JS + LocalStorage + Chart.js
   ---------------------------------------------------- */

// --- GLOBAL DEFAULT STATE SCHEMA ---
const DEFAULT_STATE = {
    user: {
        name: "Skinny Explorer",
        age: 18,
        height: 175, // cm (5'9")
        weight: 52.0, // kg
        calGoal: 2400,
        protGoal: 150,
        waterGoal: 3.0,
        stepsGoal: 10000,
        sleepGoal: 8.0,
        theme: "dark"
    },
    today: {
        date: new Date().toISOString().split('T')[0],
        water: 0.0, // Liters
        steps: 0,
        sleepHours: 0.0,
        sleepQuality: "Good",
        workoutCompleted: false
    },
    nutritionLog: [
        // Array of food items { id, meal, name, cal, prot, carb, fat }
    ],
    workouts: {
        split: "Push",
        exercises: [
            {
                id: "ex_1",
                name: "Barbell Bench Press",
                group: "Chest",
                sets: [
                    { setNo: 1, weight: 40, reps: 12, completed: false },
                    { setNo: 2, weight: 45, reps: 10, completed: false },
                    { setNo: 3, weight: 50, reps: 8, completed: false }
                ]
            },
            {
                id: "ex_2",
                name: "Overhead Dumbbell Press",
                group: "Shoulders",
                sets: [
                    { setNo: 1, weight: 12, reps: 12, completed: false },
                    { setNo: 2, weight: 14, reps: 10, completed: false },
                    { setNo: 3, weight: 14, reps: 8, completed: false }
                ]
            },
            {
                id: "ex_3",
                name: "Tricep Rope Pushdowns",
                group: "Triceps",
                sets: [
                    { setNo: 1, weight: 20, reps: 15, completed: false },
                    { setNo: 2, weight: 25, reps: 12, completed: false },
                    { setNo: 3, weight: 25, reps: 12, completed: false }
                ]
            }
        ]
    },
    workoutHistory: [],
    routineAllocations: {
        warmup: 10,
        strength: 60,
        cardio: 20,
        core: 10,
        cooldown: 10,
        stretch: 10
    },
    supplements: [
        { id: "s1", name: "Whey Protein (1 Scoop)", dose: "30g", taken: false },
        { id: "s2", name: "Creatine Monohydrate", dose: "5g", taken: false },
        { id: "s3", name: "Multivitamin", dose: "1 Tablet", taken: false }
    ],
    bodyLogs: [
        { date: "2026-08-01", weight: 51.5, chest: 35.5, waist: 28.0, arms: 11.0, thighs: 19.0 },
        { date: "2026-08-15", weight: 52.0, chest: 36.0, waist: 28.0, arms: 11.2, thighs: 19.3 }
    ],
    dailyHabits: [
        { id: "h1", task: "Wake up & Drink 500ml Water", completed: false },
        { id: "h2", task: "Eat High-Protein Breakfast (30g+)", completed: false },
        { id: "h3", task: "Complete 2-Hour Gym Workout", completed: false },
        { id: "h4", task: "Drink 3.0 Liters Water Total", completed: false },
        { id: "h5", task: "Take Creatine & Whey Shake", completed: false },
        { id: "h6", task: "Sleep 8 Hours", completed: false }
    ],
    weeklyPlanner: {
        Monday: "Push (Chest, Shoulders, Triceps)",
        Tuesday: "Pull (Back, Biceps)",
        Wednesday: "Legs & Abs",
        Thursday: "Shoulders & Arms Focus",
        Friday: "Chest & Back Heavy",
        Saturday: "Cardio & Core Conditioning",
        Sunday: "Active Recovery / Rest Day"
    },
    streaks: {
        workout: 3,
        protein: 2,
        water: 5,
        steps: 1
    },
    badges: [
        { id: "b1", title: "First Workout", desc: "Completed your first logged gym session", icon: "🏋️", unlocked: true },
        { id: "b2", title: "Bulking Beast", desc: "Hit 2,400 kcal surplus goal", icon: "🔥", unlocked: false },
        { id: "b3", title: "Protein Master", desc: "Hit 150g protein target", icon: "🍗", unlocked: false },
        { id: "b4", title: "Hydration Champ", desc: "Drank 3.0L water in a single day", icon: "💧", unlocked: true },
        { id: "b5", title: "10K Walker", desc: "Reached 10,000 daily steps", icon: "👟", unlocked: false },
        { id: "b6", title: "7 Day Streak", desc: "Maintained a 7-day workout streak", icon: "⚡", unlocked: false },
        { id: "b7", title: "Creatine Consistent", desc: "Logged creatine supplement 5 days in a row", icon: "💊", unlocked: true },
        { id: "b8", title: "PR Breaker", desc: "Set a personal record in bench press", icon: "🏆", unlocked: true }
    ]
};

// Built-in Presets Database for High Protein Foods
const HIGH_PROTEIN_PRESETS = [
    { emoji: "🥚", name: "Whole Eggs (3 pcs)", cal: 210, prot: 18, carb: 1, fat: 15, cat: "breakfast" },
    { emoji: "🍗", name: "Chicken Breast (150g)", cal: 240, prot: 46, carb: 0, fat: 5, cat: "lunch" },
    { emoji: "🧀", name: "Paneer / Cottage Cheese (100g)", cal: 265, prot: 18, carb: 3, fat: 20, cat: "lunch" },
    { emoji: "🥛", name: "Whey Protein Shake (1 Scoop)", cal: 120, prot: 24, carb: 2, fat: 1.5, cat: "snacks" },
    { emoji: "🥣", name: "Greek Yogurt / Curd (200g)", cal: 130, prot: 15, carb: 8, fat: 4, cat: "breakfast" },
    { emoji: "🍲", name: "Yellow Dal / Lentils (1 Bowl)", cal: 180, prot: 12, carb: 30, fat: 2, cat: "dinner" },
    { emoji: "🧆", name: "Chickpeas / Chana (1 Bowl)", cal: 240, prot: 14, carb: 40, fat: 4, cat: "lunch" },
    { emoji: "🫘", name: "Rajma / Kidney Beans (1 Bowl)", cal: 220, prot: 13, carb: 38, fat: 2, cat: "dinner" },
    { emoji: "🌱", name: "Soy Chunks (50g dry)", cal: 170, prot: 26, carb: 16, fat: 0.5, cat: "lunch" },
    { emoji: "🧊", name: "Tofu (100g)", cal: 140, prot: 14, carb: 3, fat: 8, cat: "dinner" },
    { emoji: "🌾", name: "Oats with Milk (1 Bowl)", cal: 320, prot: 14, carb: 55, fat: 6, cat: "breakfast" },
    { emoji: "🥜", name: "Peanut Butter (2 tbsp / 32g)", cal: 190, prot: 8, carb: 7, fat: 16, cat: "snacks" },
    { emoji: "🐟", name: "Fish / Rohu (150g)", cal: 180, prot: 30, carb: 0, fat: 6, cat: "dinner" },
    { emoji: "🥛", name: "Whole Milk (250ml)", cal: 150, prot: 8, carb: 12, fat: 8, cat: "snacks" },
    { emoji: "🌰", name: "Almonds & Nuts (30g)", cal: 170, prot: 6, carb: 6, fat: 15, cat: "snacks" },
    { emoji: "🍚", name: "Cooked Basmati Rice (1 Bowl)", cal: 200, prot: 4, carb: 44, fat: 0.5, cat: "lunch" }
];

// App State Container
let state = {};

// Active Rest Timer Instance
let restInterval = null;
let restTimeRemaining = 0;

// Active 2-Hour Gym Routine Timer Instance
let routineInterval = null;
let routineTotalSeconds = 0;
let routineIsRunning = false;

// Chart Instances
let charts = {};

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    loadState();
    setupNavigation();
    setupTheme();
    renderAll();
    setupEventListeners();
});

// Load state from LocalStorage or initialize default
function loadState() {
    const saved = localStorage.getItem("fittrack_state");
    if (saved) {
        try {
            state = JSON.parse(saved);
            // Ensure new date resets daily transient metrics if day changed
            const todayStr = new Date().toISOString().split('T')[0];
            if (state.today.date !== todayStr) {
                state.today.date = todayStr;
                state.today.water = 0.0;
                state.today.steps = 0;
                state.today.sleepHours = 0.0;
                state.today.workoutCompleted = false;
                state.nutritionLog = [];
                if (state.supplements) {
                    state.supplements.forEach(s => s.taken = false);
                }
                if (state.dailyHabits) {
                    state.dailyHabits.forEach(h => h.completed = false);
                }
                saveState();
            }
        } catch (e) {
            console.error("Failed to parse local storage, loading default state", e);
            state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    } else {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        saveState();
    }
}

// Save state to LocalStorage
function saveState() {
    localStorage.setItem("fittrack_state", JSON.stringify(state));
}

// Setup Tab Navigation System
function setupNavigation() {
    const navButtons = document.querySelectorAll(".nav-item, .bottom-nav-item");
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");
            switchTab(targetTab);
        });
    });
}

function switchTab(tabId) {
    // Update active tab buttons
    document.querySelectorAll(".nav-item, .bottom-nav-item").forEach(b => {
        if (b.getAttribute("data-tab") === tabId) {
            b.classList.add("active");
        } else {
            b.classList.remove("active");
        }
    });

    // Update active section
    document.querySelectorAll(".tab-content").forEach(section => {
        if (section.id === `tab-${tabId}`) {
            section.classList.add("active");
        } else {
            section.classList.remove("active");
        }
    });

    // Update Page Header Titles
    const titleMap = {
        "dashboard": ["Dashboard Overview", "Track your bulking progress, daily macros, and workout intensity."],
        "workout": ["Gym Workout System", "Log exercises, track sets/reps, monitor rest timers, and hit PRs."],
        "routine": ["2-Hour Gym Routine Engine", "Customizable 2-hour workout structure with active stage countdowns."],
        "nutrition": ["Nutrition & Food Tracker", "Log your meals and access built-in high-protein food options."],
        "calculators": ["Calorie & Protein Calculators", "Calculate customized caloric surplus targets & protein goals for 52kg build."],
        "supplements": ["Supplement Tracker", "Daily health, whey protein, and creatine monohydrate checklist."],
        "trackers": ["Steps, Water & Sleep Trackers", "Monitor your hydration, manual step count, and sleep recovery."],
        "body": ["Body Tracker & Measurements", "Log your body weight trajectory, chest, waist, and arms."],
        "progress": ["Progress & Analytics Charts", "Visual trends for weight gain, calorie consistency, and steps."],
        "ai-assistant": ["AI Assistant & Vision Food Scanner", "Ask fitness advice or simulate multi-modal food recognition."],
        "planner": ["Weekly Planner & Daily Habits", "Schedule your workout split and manage daily fitness tasks."],
        "achievements": ["Streaks & Badges", "Earn neon fitness achievements as you build consistent habits."],
        "settings": ["Settings & Privacy Center", "Manage your profile, theme, local backup JSON, or data reset."]
    };

    if (titleMap[tabId]) {
        document.getElementById("page-title").textContent = titleMap[tabId][0];
        document.getElementById("page-subtitle").textContent = titleMap[tabId][1];
    }

    // Re-render charts when switching to progress tab
    if (tabId === "progress") {
        renderCharts();
    }
}

// Theme Handler
function setupTheme() {
    const themeBtn = document.getElementById("theme-toggle");
    document.documentElement.setAttribute("data-theme", state.user.theme || "dark");
    updateThemeLabel();

    themeBtn.addEventListener("click", () => {
        state.user.theme = (state.user.theme === "dark") ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", state.user.theme);
        updateThemeLabel();
        saveState();
        if (charts.weightChart) renderCharts(); // re-render charts for color theme adaptation
    });
}

function updateThemeLabel() {
    const label = document.querySelector(".theme-label");
    const icon = document.querySelector(".theme-icon");
    if (state.user.theme === "light") {
        label.textContent = "Light Theme";
        icon.textContent = "☀️";
    } else {
        label.textContent = "Dark Theme";
        icon.textContent = "🌙";
    }
}

// Master Render Function
function renderAll() {
    renderUserMiniCard();
    renderDashboard();
    renderWorkoutSystem();
    renderNutrition();
    renderSupplements();
    renderTrackers();
    renderBodyLogs();
    renderPlannerAndHabits();
    renderBadgesAndStreaks();
}

// User Profile Mini Card
function renderUserMiniCard() {
    document.getElementById("sidebar-user-name").textContent = state.user.name || "Skinny Explorer";
    document.getElementById("sidebar-user-meta").textContent = `${state.user.age} yrs • ${state.user.weight} kg • 5'9"`;
    document.getElementById("header-streak-count").textContent = state.streaks.workout || 0;
}

// --- TAB 1: DASHBOARD RENDERER ---
function renderDashboard() {
    // 1. Calories Calculation
    const totalCal = state.nutritionLog.reduce((sum, item) => sum + (Number(item.cal) || 0), 0);
    const targetCal = state.user.calGoal || 2400;
    document.getElementById("dash-cal-consumed").textContent = totalCal.toLocaleString();
    document.getElementById("dash-cal-target").textContent = targetCal.toLocaleString();
    const calPct = Math.min(100, Math.round((totalCal / targetCal) * 100));
    document.getElementById("dash-cal-bar").style.width = `${calPct}%`;
    const calRem = Math.max(0, targetCal - totalCal);
    document.getElementById("dash-cal-remaining").textContent = `${calRem.toLocaleString()} kcal remaining`;

    // 2. Protein Calculation
    const totalProt = state.nutritionLog.reduce((sum, item) => sum + (Number(item.prot) || 0), 0);
    const targetProt = state.user.protGoal || 150;
    document.getElementById("dash-prot-consumed").textContent = Math.round(totalProt);
    document.getElementById("dash-prot-target").textContent = targetProt;
    const protPct = Math.min(100, Math.round((totalProt / targetProt) * 100));
    document.getElementById("dash-prot-bar").style.width = `${protPct}%`;
    const protRem = Math.max(0, targetProt - Math.round(totalProt));
    document.getElementById("dash-prot-remaining").textContent = `${protRem}g remaining for muscle gain`;

    // 3. Water Calculation
    const consumedWater = state.today.water || 0.0;
    const targetWater = state.user.waterGoal || 3.0;
    document.getElementById("dash-water-consumed").textContent = consumedWater.toFixed(1);
    document.getElementById("dash-water-target").textContent = targetWater.toFixed(1);
    const waterPct = Math.min(100, Math.round((consumedWater / targetWater) * 100));
    document.getElementById("dash-water-bar").style.width = `${waterPct}%`;

    // 4. Steps Calculation
    const currentSteps = state.today.steps || 0;
    const targetSteps = state.user.stepsGoal || 10000;
    document.getElementById("dash-steps-count").textContent = currentSteps.toLocaleString();
    document.getElementById("dash-steps-target").textContent = targetSteps.toLocaleString();
    const stepsPct = Math.min(100, Math.round((currentSteps / targetSteps) * 100));
    document.getElementById("dash-steps-bar").style.width = `${stepsPct}%`;
    const stepsRem = Math.max(0, targetSteps - currentSteps);
    document.getElementById("dash-steps-remaining").textContent = `${stepsRem.toLocaleString()} steps remaining`;

    // 5. Workout Progress
    let totalSets = 0;
    let completedSets = 0;
    if (state.workouts && state.workouts.exercises) {
        state.workouts.exercises.forEach(ex => {
            ex.sets.forEach(s => {
                totalSets++;
                if (s.completed) completedSets++;
            });
        });
    }
    const workoutPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
    document.getElementById("dash-workout-percent").textContent = `${workoutPct}%`;
    document.getElementById("dash-workout-bar").style.width = `${workoutPct}%`;
    document.getElementById("dash-workout-status").textContent = workoutPct === 100 ? "Completed ✓" : (workoutPct > 0 ? "In Progress" : "Not Started");

    // 6. Sleep Progress
    const sleepHours = state.today.sleepHours || 0.0;
    const sleepGoal = state.user.sleepGoal || 8.0;
    const sleepHrsInt = Math.floor(sleepHours);
    const sleepMins = Math.round((sleepHours - sleepHrsInt) * 60);
    document.getElementById("dash-sleep-hours").textContent = `${sleepHrsInt}h ${sleepMins}m`;
    document.getElementById("dash-sleep-target").textContent = `${sleepGoal}h`;
    const sleepPct = Math.min(100, Math.round((sleepHours / sleepGoal) * 100));
    document.getElementById("dash-sleep-bar").style.width = `${sleepPct}%`;
    document.getElementById("dash-sleep-quality").textContent = state.today.sleepQuality ? `Quality: ${state.today.sleepQuality}` : "No sleep logged today";

    // 7. Render Dashboard Habits Checklist
    renderDashboardChecklist();

    // 8. Render Quick Food Recommendations
    renderDashboardQuickFoods();
}

function renderDashboardChecklist() {
    const container = document.getElementById("dash-checklist");
    container.innerHTML = "";
    if (!state.dailyHabits || state.dailyHabits.length === 0) {
        container.innerHTML = "<p class='empty-text'>No habits configured.</p>";
        return;
    }
    state.dailyHabits.forEach(habit => {
        const div = document.createElement("div");
        div.className = `checklist-item ${habit.completed ? 'checked' : ''}`;
        div.innerHTML = `
            <input type="checkbox" ${habit.completed ? 'checked' : ''}>
            <span>${habit.task}</span>
        `;
        div.addEventListener("click", () => {
            habit.completed = !habit.completed;
            saveState();
            renderDashboard();
        });
        container.appendChild(div);
    });
}

function renderDashboardQuickFoods() {
    const container = document.getElementById("dash-quick-foods");
    container.innerHTML = "";
    HIGH_PROTEIN_PRESETS.slice(0, 6).forEach(food => {
        const div = document.createElement("div");
        div.className = "food-preset-card";
        div.innerHTML = `
            <span class="food-emoji">${food.emoji}</span>
            <span class="food-name">${food.name}</span>
            <span class="food-macros">${food.cal} kcal | ${food.prot}g P</span>
        `;
        div.addEventListener("click", () => {
            addPresetFoodToLog(food);
        });
        container.appendChild(div);
    });
}

// --- TAB 2: WORKOUT SYSTEM RENDERER ---
function renderWorkoutSystem() {
    const container = document.getElementById("exercises-list");
    container.innerHTML = "";

    const splitSelect = document.getElementById("workout-split-select");
    if (splitSelect) splitSelect.value = state.workouts.split || "Push";

    if (!state.workouts.exercises || state.workouts.exercises.length === 0) {
        container.innerHTML = "<div class='glass-card'><p class='empty-text'>No exercises added for this split yet. Click '+ Add Exercise' to begin.</p></div>";
        return;
    }

    state.workouts.exercises.forEach((ex, exIdx) => {
        const card = document.createElement("div");
        card.className = "glass-card exercise-card";

        let setsHTML = "";
        ex.sets.forEach((set, setIdx) => {
            setsHTML += `
                <tr>
                    <td>Set ${set.setNo}</td>
                    <td><input type="number" step="0.5" class="form-control btn-sm" value="${set.weight}" onchange="updateSetWeight('${ex.id}', ${setIdx}, this.value)" style="width: 70px;"> kg</td>
                    <td><input type="number" class="form-control btn-sm" value="${set.reps}" onchange="updateSetReps('${ex.id}', ${setIdx}, this.value)" style="width: 70px;"> reps</td>
                    <td>
                        <button class="set-check-btn ${set.completed ? 'completed' : ''}" onclick="toggleSetComplete('${ex.id}', ${setIdx})">
                            ✓
                        </button>
                    </td>
                </tr>
            `;
        });

        card.innerHTML = `
            <div class="exercise-card-header">
                <div class="exercise-title-group">
                    <h3>${ex.name}</h3>
                    <span class="muscle-tag">${ex.group}</span>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline" onclick="addSetToExercise('${ex.id}')">+ Set</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteExercise('${ex.id}')">Delete</button>
                </div>
            </div>
            <table class="sets-table">
                <thead>
                    <tr>
                        <th>Set</th>
                        <th>Weight</th>
                        <th>Reps</th>
                        <th>Done</th>
                    </tr>
                </thead>
                <tbody>
                    ${setsHTML}
                </tbody>
            </table>
        `;
        container.appendChild(card);
    });

    renderWorkoutHistory();
}

function updateSetWeight(exId, setIdx, val) {
    const ex = state.workouts.exercises.find(e => e.id === exId);
    if (ex && ex.sets[setIdx]) {
        ex.sets[setIdx].weight = Number(val);
        saveState();
    }
}

function updateSetReps(exId, setIdx, val) {
    const ex = state.workouts.exercises.find(e => e.id === exId);
    if (ex && ex.sets[setIdx]) {
        ex.sets[setIdx].reps = Number(val);
        saveState();
    }
}

function toggleSetComplete(exId, setIdx) {
    const ex = state.workouts.exercises.find(e => e.id === exId);
    if (ex && ex.sets[setIdx]) {
        ex.sets[setIdx].completed = !ex.sets[setIdx].completed;
        saveState();
        renderWorkoutSystem();
        renderDashboard();

        // If completed, launch 60s rest timer
        if (ex.sets[setIdx].completed) {
            startRestTimer(60, `${ex.name} - Set ${ex.sets[setIdx].setNo}`);
        }
    }
}

function addSetToExercise(exId) {
    const ex = state.workouts.exercises.find(e => e.id === exId);
    if (ex) {
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSetNo = ex.sets.length + 1;
        ex.sets.push({
            setNo: newSetNo,
            weight: lastSet ? lastSet.weight : 40,
            reps: lastSet ? lastSet.reps : 10,
            completed: false
        });
        saveState();
        renderWorkoutSystem();
        renderDashboard();
    }
}

function deleteExercise(exId) {
    state.workouts.exercises = state.workouts.exercises.filter(e => e.id !== exId);
    saveState();
    renderWorkoutSystem();
    renderDashboard();
}

// Rest Timer Functions
function startRestTimer(seconds, exerciseInfo) {
    clearInterval(restInterval);
    restTimeRemaining = seconds;
    const card = document.getElementById("rest-timer-card");
    const display = document.getElementById("rest-timer-display");
    const info = document.getElementById("rest-timer-exercise");

    card.classList.remove("hidden");
    info.textContent = `Resting after: ${exerciseInfo}`;
    updateRestTimerDisplay();

    restInterval = setInterval(() => {
        restTimeRemaining--;
        if (restTimeRemaining <= 0) {
            clearInterval(restInterval);
            card.classList.add("hidden");
            alert("⏰ Rest Time Over! Ready for your next set!");
        } else {
            updateRestTimerDisplay();
        }
    }, 1000);
}

function updateRestTimerDisplay() {
    const mins = Math.floor(restTimeRemaining / 60);
    const secs = restTimeRemaining % 60;
    document.getElementById("rest-timer-display").textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Workout History Render
function renderWorkoutHistory() {
    const container = document.getElementById("workout-history-list");
    container.innerHTML = "";
    if (!state.workoutHistory || state.workoutHistory.length === 0) {
        container.innerHTML = "<p class='empty-text'>No completed workouts logged yet.</p>";
        return;
    }
    state.workoutHistory.slice(-5).reverse().forEach(h => {
        const div = document.createElement("div");
        div.className = "checklist-item";
        div.innerHTML = `
            <div>
                <strong>🏋️ ${h.split} Workout Completed</strong>
                <span class="user-meta">${h.date} • ${h.exercisesCount} Exercises Logged</span>
            </div>
        `;
        container.appendChild(div);
    });
}

// --- TAB 3: 2-HOUR GYM ROUTINE ENGINE ---
function setup2HourRoutineEngine() {
    const configForm = document.getElementById("routine-config-form");
    configForm.addEventListener("submit", (e) => {
        e.preventDefault();
        state.routineAllocations.warmup = Number(document.getElementById("routine-warmup").value);
        state.routineAllocations.strength = Number(document.getElementById("routine-strength").value);
        state.routineAllocations.cardio = Number(document.getElementById("routine-cardio").value);
        state.routineAllocations.core = Number(document.getElementById("routine-core").value);
        state.routineAllocations.cooldown = Number(document.getElementById("routine-cooldown").value);
        state.routineAllocations.stretch = Number(document.getElementById("routine-stretch").value);
        saveState();
        alert("✓ 2-Hour Routine allocations updated!");
    });

    const startBtn = document.getElementById("start-routine-btn");
    const pauseBtn = document.getElementById("pause-routine-btn");
    const resetBtn = document.getElementById("reset-routine-btn");

    startBtn.addEventListener("click", () => {
        if (!routineIsRunning) {
            if (routineTotalSeconds === 0) {
                // Calculate total duration in seconds from allocations
                const alloc = state.routineAllocations;
                routineTotalSeconds = (alloc.warmup + alloc.strength + alloc.cardio + alloc.core + alloc.cooldown + alloc.stretch) * 60;
            }
            routineIsRunning = true;
            startBtn.disabled = true;
            pauseBtn.disabled = false;

            routineInterval = setInterval(() => {
                if (routineTotalSeconds > 0) {
                    routineTotalSeconds--;
                    updateRoutineTimerUI();
                } else {
                    clearInterval(routineInterval);
                    routineIsRunning = false;
                    startBtn.disabled = false;
                    pauseBtn.disabled = true;
                    alert("🎉 2-Hour Gym Routine Completed! Great work!");
                }
            }, 1000);
        }
    });

    pauseBtn.addEventListener("click", () => {
        clearInterval(routineInterval);
        routineIsRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    });

    resetBtn.addEventListener("click", () => {
        clearInterval(routineInterval);
        routineIsRunning = false;
        routineTotalSeconds = 0;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        updateRoutineTimerUI();
    });
}

function updateRoutineTimerUI() {
    const hrs = Math.floor(routineTotalSeconds / 3600);
    const mins = Math.floor((routineTotalSeconds % 3600) / 60);
    const secs = routineTotalSeconds % 60;

    document.getElementById("routine-time-display").textContent = 
        `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    // Compute active phase
    const alloc = state.routineAllocations;
    const totalAllocSecs = (alloc.warmup + alloc.strength + alloc.cardio + alloc.core + alloc.cooldown + alloc.stretch) * 60;
    const elapsedSecs = totalAllocSecs - routineTotalSeconds;
    const elapsedMins = elapsedSecs / 60;

    let phase = "Warm-Up";
    if (elapsedMins > alloc.warmup) phase = "Strength Training";
    if (elapsedMins > alloc.warmup + alloc.strength) phase = "Cardio & Conditioning";
    if (elapsedMins > alloc.warmup + alloc.strength + alloc.cardio) phase = "Core Workout";
    if (elapsedMins > alloc.warmup + alloc.strength + alloc.cardio + alloc.core) phase = "Cool Down";
    if (elapsedMins > alloc.warmup + alloc.strength + alloc.cardio + alloc.core + alloc.cooldown) phase = "Stretching & Mobility";

    document.getElementById("routine-current-phase-badge").textContent = `Active Phase: ${phase}`;
    document.getElementById("routine-phase-display").textContent = `${phase} underway...`;

    const pct = totalAllocSecs > 0 ? Math.round((elapsedSecs / totalAllocSecs) * 100) : 0;
    document.getElementById("routine-total-bar").style.width = `${pct}%`;
}

// --- TAB 4: NUTRITION TRACKER ---
function renderNutrition() {
    const meals = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    let totalCal = 0, totalProt = 0, totalCarb = 0, totalFat = 0;

    state.nutritionLog.forEach(item => {
        if (meals[item.meal]) {
            meals[item.meal].push(item);
        }
        totalCal += Number(item.cal) || 0;
        totalProt += Number(item.prot) || 0;
        totalCarb += Number(item.carb) || 0;
        totalFat += Number(item.fat) || 0;
    });

    document.getElementById("nutri-cal-summary").textContent = `${totalCal.toLocaleString()} / ${(state.user.calGoal || 2400).toLocaleString()} kcal`;
    document.getElementById("nutri-prot-summary").textContent = `${Math.round(totalProt)} / ${state.user.protGoal || 150} g`;
    document.getElementById("nutri-carb-summary").textContent = `${Math.round(totalCarb)} g`;
    document.getElementById("nutri-fat-summary").textContent = `${Math.round(totalFat)} g`;

    // Render individual meal cards
    ["breakfast", "lunch", "dinner", "snacks"].forEach(mealKey => {
        const listContainer = document.getElementById(`${mealKey}-food-list`);
        const totalsSpan = document.getElementById(`${mealKey}-totals`);
        listContainer.innerHTML = "";

        const items = meals[mealKey];
        let mealCal = 0, mealProt = 0;

        if (items.length === 0) {
            listContainer.innerHTML = `<p class="empty-text">No items logged for ${mealKey}.</p>`;
        } else {
            items.forEach(item => {
                mealCal += Number(item.cal) || 0;
                mealProt += Number(item.prot) || 0;
                const row = document.createElement("div");
                row.className = "food-item-row";
                row.innerHTML = `
                    <div>
                        <strong>${item.name}</strong>
                        <span class="user-meta">${item.cal} kcal • ${item.prot}g P</span>
                    </div>
                    <button class="btn btn-sm btn-ghost" onclick="removeFoodItem('${item.id}')">&times;</button>
                `;
                listContainer.appendChild(row);
            });
        }
        totalsSpan.textContent = `${mealCal} kcal • ${Math.round(mealProt)}g protein`;
    });

    renderPresetFoodsGrid();
}

function renderPresetFoodsGrid() {
    const container = document.getElementById("preset-foods-grid");
    container.innerHTML = "";
    HIGH_PROTEIN_PRESETS.forEach(food => {
        const div = document.createElement("div");
        div.className = "food-preset-card";
        div.innerHTML = `
            <span class="food-emoji">${food.emoji}</span>
            <span class="food-name">${food.name}</span>
            <span class="food-macros">${food.cal} kcal | ${food.prot}g Protein</span>
            <button class="btn btn-sm btn-outline margin-top-sm">+ Log Meal</button>
        `;
        div.querySelector("button").addEventListener("click", (e) => {
            e.stopPropagation();
            addPresetFoodToLog(food);
        });
        container.appendChild(div);
    });
}

function addPresetFoodToLog(preset) {
    const newItem = {
        id: "food_" + Date.now(),
        meal: preset.cat || "breakfast",
        name: preset.name,
        cal: preset.cal,
        prot: preset.prot,
        carb: preset.carb,
        fat: preset.fat
    };
    state.nutritionLog.push(newItem);
    saveState();
    renderNutrition();
    renderDashboard();
}

function removeFoodItem(id) {
    state.nutritionLog = state.nutritionLog.filter(f => f.id !== id);
    saveState();
    renderNutrition();
    renderDashboard();
}

// --- TAB 5: CALCULATORS ---
function setupCalculators() {
    const calForm = document.getElementById("calorie-calc-form");
    calForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const age = Number(document.getElementById("calc-age").value);
        const sex = document.getElementById("calc-sex").value;
        const height = Number(document.getElementById("calc-height").value);
        const weight = Number(document.getElementById("calc-weight").value);
        const activity = Number(document.getElementById("calc-activity").value);
        const goal = document.getElementById("calc-goal").value;

        // Mifflin-St Jeor Equation
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        if (sex === "male") {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        let tdee = bmr * activity;
        if (goal === "gain") tdee += 500; // Muscle Surplus
        else if (goal === "lose") tdee -= 400;

        const finalCal = Math.round(tdee);
        document.getElementById("calc-result-val").textContent = `${finalCal.toLocaleString()} kcal / day`;
    });

    document.getElementById("apply-calorie-goal-btn").addEventListener("click", () => {
        const valText = document.getElementById("calc-result-val").textContent;
        const calVal = parseInt(valText.replace(/[^0-9]/g, ''));
        if (calVal) {
            state.user.calGoal = calVal;
            saveState();
            renderDashboard();
            renderNutrition();
            alert(`✓ Daily Calorie Goal set to ${calVal} kcal!`);
        }
    });

    // Protein Target Customizer
    document.getElementById("protein-multiplier-select").addEventListener("change", (e) => {
        const customGroup = document.getElementById("custom-protein-group");
        if (e.target.value === "custom") {
            customGroup.style.display = "block";
        } else {
            customGroup.style.display = "none";
        }
    });

    document.getElementById("apply-protein-target-btn").addEventListener("click", () => {
        const selectVal = document.getElementById("protein-multiplier-select").value;
        const weight = state.user.weight || 52;
        let newTarget = 150;

        if (selectVal === "custom") {
            newTarget = Number(document.getElementById("custom-protein-target").value);
        } else {
            newTarget = Math.round(weight * Number(selectVal));
        }

        state.user.protGoal = newTarget;
        saveState();
        renderDashboard();
        renderNutrition();
        updateProteinCalcDisplay();
        alert(`✓ Daily Protein Target updated to ${newTarget}g!`);
    });

    updateProteinCalcDisplay();
}

function updateProteinCalcDisplay() {
    const target = state.user.protGoal || 150;
    const consumed = state.nutritionLog.reduce((sum, i) => sum + (Number(i.prot) || 0), 0);
    const rem = Math.max(0, target - Math.round(consumed));

    document.getElementById("prot-target-display").textContent = `${target}g`;
    document.getElementById("prot-consumed-display").textContent = `${Math.round(consumed)}g`;
    document.getElementById("prot-remaining-display").textContent = `${rem}g`;
}

// --- TAB 6: SUPPLEMENT TRACKER ---
function renderSupplements() {
    const container = document.getElementById("supplements-list");
    container.innerHTML = "";

    if (!state.supplements || state.supplements.length === 0) {
        container.innerHTML = "<p class='empty-text'>No supplements configured.</p>";
        return;
    }

    state.supplements.forEach((s, idx) => {
        const div = document.createElement("div");
        div.className = "supp-item";
        div.innerHTML = `
            <div>
                <strong>${s.name}</strong>
                <span class="user-meta">Dose: ${s.dose}</span>
            </div>
            <button class="btn btn-sm ${s.taken ? 'btn-success' : 'btn-outline'}" onclick="toggleSupplementTaken(${idx})">
                ${s.taken ? '✓ Taken' : 'Mark as Taken'}
            </button>
        `;
        container.appendChild(div);
    });
}

function toggleSupplementTaken(idx) {
    if (state.supplements[idx]) {
        state.supplements[idx].taken = !state.supplements[idx].taken;
        saveState();
        renderSupplements();
    }
}

// --- TAB 7: TRACKERS (STEPS, WATER, SLEEP) ---
function renderTrackers() {
    // Water
    const water = state.today.water || 0.0;
    const waterGoal = state.user.waterGoal || 3.0;
    document.getElementById("water-val-display").textContent = water.toFixed(1);
    document.getElementById("water-goal-display").textContent = waterGoal.toFixed(1);
    const waterPct = Math.min(100, Math.round((water / waterGoal) * 100));
    document.getElementById("water-page-bar").style.width = `${waterPct}%`;

    // Steps
    const steps = state.today.steps || 0;
    const stepsGoal = state.user.stepsGoal || 10000;
    document.getElementById("steps-val-display").textContent = steps.toLocaleString();
    document.getElementById("steps-goal-display").textContent = stepsGoal.toLocaleString();
    const stepsPct = Math.min(100, Math.round((steps / stepsGoal) * 100));
    document.getElementById("steps-page-bar").style.width = `${stepsPct}%`;

    // Sleep
    const sleepHrs = state.today.sleepHours || 0;
    const hrsInt = Math.floor(sleepHrs);
    const mins = Math.round((sleepHrs - hrsInt) * 60);
    document.getElementById("sleep-total-display").textContent = `${hrsInt}h ${mins}m`;
}

function quickAddWater(amount) {
    state.today.water = (state.today.water || 0.0) + amount;
    saveState();
    renderTrackers();
    renderDashboard();
}

function resetWaterToday() {
    state.today.water = 0.0;
    saveState();
    renderTrackers();
    renderDashboard();
}

function setupTrackersForms() {
    document.getElementById("step-log-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("step-input");
        const val = Number(input.value);
        if (val) {
            state.today.steps = (state.today.steps || 0) + val;
            input.value = "";
            saveState();
            renderTrackers();
            renderDashboard();
        }
    });

    document.getElementById("sleep-log-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const bedtime = document.getElementById("sleep-bedtime").value;
        const waketime = document.getElementById("sleep-waketime").value;
        const quality = document.getElementById("sleep-quality").value;

        // Calculate hours difference
        const bedDate = new Date(`2026-01-01T${bedtime}:00`);
        let wakeDate = new Date(`2026-01-01T${waketime}:00`);
        if (wakeDate < bedDate) {
            wakeDate = new Date(`2026-01-02T${waketime}:00`);
        }
        const diffMs = wakeDate - bedDate;
        const diffHrs = diffMs / (1000 * 60 * 60);

        state.today.sleepHours = diffHrs;
        state.today.sleepQuality = quality;
        saveState();
        renderTrackers();
        renderDashboard();
        alert(`✓ Logged ${diffHrs.toFixed(1)} hours of sleep!`);
    });
}

// --- TAB 8: BODY TRACKER ---
function renderBodyLogs() {
    const tbody = document.getElementById("body-history-tbody");
    tbody.innerHTML = "";

    if (!state.bodyLogs || state.bodyLogs.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' class='empty-text'>No measurements logged yet.</td></tr>";
        return;
    }

    state.bodyLogs.slice().reverse().forEach((b, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${b.date}</td>
            <td><strong>${b.weight} kg</strong></td>
            <td>${b.chest || '-'}</td>
            <td>${b.waist || '-'}</td>
            <td>${b.arms || '-'}</td>
            <td><button class="btn btn-sm btn-ghost" onclick="deleteBodyLog(${state.bodyLogs.length - 1 - idx})">&times;</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function setupBodyForm() {
    document.getElementById("body-log-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const weight = Number(document.getElementById("body-weight-input").value);
        const chest = Number(document.getElementById("body-chest-input").value);
        const waist = Number(document.getElementById("body-waist-input").value);
        const arms = Number(document.getElementById("body-arms-input").value);
        const thighs = Number(document.getElementById("body-thighs-input").value);

        if (weight) {
            state.user.weight = weight; // update current weight
            state.bodyLogs.push({
                date: new Date().toISOString().split('T')[0],
                weight, chest, waist, arms, thighs
            });
            saveState();
            renderUserMiniCard();
            renderBodyLogs();
            alert("✓ Body measurement logged!");
        }
    });
}

function deleteBodyLog(index) {
    state.bodyLogs.splice(index, 1);
    saveState();
    renderBodyLogs();
}

// --- TAB 9: PROGRESS CHARTS (CHART.JS) ---
function renderCharts() {
    const isDark = state.user.theme === "dark";
    const textColor = isDark ? "#94a3b8" : "#475569";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)";

    // 1. Weight Chart
    const weightCtx = document.getElementById("weightChart").getContext("2d");
    if (charts.weightChart) charts.weightChart.destroy();
    
    const weightLabels = state.bodyLogs.map(b => b.date);
    const weightData = state.bodyLogs.map(b => b.weight);

    charts.weightChart = new Chart(weightCtx, {
        type: 'line',
        data: {
            labels: weightLabels.length ? weightLabels : ["Aug 1", "Aug 15"],
            datasets: [{
                label: 'Weight (kg)',
                data: weightData.length ? weightData : [51.5, 52.0],
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
                y: { ticks: { color: textColor }, grid: { color: gridColor } }
            }
        }
    });

    // 2. Calorie Chart
    const calCtx = document.getElementById("calorieChart").getContext("2d");
    if (charts.calorieChart) charts.calorieChart.destroy();

    charts.calorieChart = new Chart(calCtx, {
        type: 'bar',
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: 'Calories Consumed',
                data: [2100, 2350, 2400, 1950, 2450, 2200, state.nutritionLog.reduce((s,i)=>s+(Number(i.cal)||0),0)],
                backgroundColor: '#f97316',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
                y: { ticks: { color: textColor }, grid: { color: gridColor } }
            }
        }
    });

    // 3. Protein Chart
    const protCtx = document.getElementById("proteinChart").getContext("2d");
    if (charts.proteinChart) charts.proteinChart.destroy();

    charts.proteinChart = new Chart(protCtx, {
        type: 'line',
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: 'Protein (g)',
                data: [130, 145, 150, 120, 155, 140, state.nutritionLog.reduce((s,i)=>s+(Number(i.prot)||0),0)],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
                y: { ticks: { color: textColor }, grid: { color: gridColor } }
            }
        }
    });

    // 4. Steps Chart
    const stepsCtx = document.getElementById("stepsChart").getContext("2d");
    if (charts.stepsChart) charts.stepsChart.destroy();

    charts.stepsChart = new Chart(stepsCtx, {
        type: 'bar',
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: 'Steps',
                data: [8500, 10200, 9400, 7800, 11000, 6500, state.today.steps || 0],
                backgroundColor: '#8b5cf6',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
                y: { ticks: { color: textColor }, grid: { color: gridColor } }
            }
        }
    });
}

// --- TAB 10: AI ASSISTANT & SCANNER ---
function switchAITub(mode) {
    const chatSection = document.getElementById("ai-chat-section");
    const scannerSection = document.getElementById("ai-scanner-section");
    const chatPill = document.getElementById("ai-chat-pill");
    const scannerPill = document.getElementById("ai-scanner-pill");

    if (mode === "chat") {
        chatSection.style.display = "block";
        scannerSection.style.display = "none";
        chatPill.classList.add("active");
        scannerPill.classList.remove("active");
    } else {
        chatSection.style.display = "none";
        scannerSection.style.display = "block";
        chatPill.classList.remove("active");
        scannerPill.classList.add("active");
    }
}

function setupAIAssistant() {
    const chatForm = document.getElementById("ai-chat-form");
    const chatInput = document.getElementById("chat-input");
    const messagesContainer = document.getElementById("chat-messages");

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = chatInput.value.trim();
        if (!query) return;

        // Render User Message
        appendChatMessage("user", query);
        chatInput.value = "";

        // Generate Mock AI Response
        setTimeout(() => {
            const aiReply = generateAIResponse(query);
            appendChatMessage("ai", aiReply);
        }, 500);
    });

    // Scanner Demo Setup
    const dropZone = document.getElementById("scanner-drop-zone");
    const fileInput = document.getElementById("scanner-file-input");
    const resultBox = document.getElementById("scanner-result-box");

    dropZone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", simulateAIScan);
}

function sendQuickPrompt(promptText) {
    document.getElementById("chat-input").value = promptText;
    document.getElementById("ai-chat-form").dispatchEvent(new Event("submit"));
}

function appendChatMessage(sender, text) {
    const container = document.getElementById("chat-messages");
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;
    bubble.textContent = text;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

function generateAIResponse(q) {
    const query = q.toLowerCase();
    const weight = state.user.weight || 52;
    const protTarget = state.user.protGoal || 150;

    if (query.includes("breakfast")) {
        return "🍳 High-Protein Breakfast Idea: 3 Whole Eggs + 1 Bowl of Oats cooked in milk with 2 tbsp Peanut Butter. This delivers ~650 kcal and 36g of protein!";
    }
    if (query.includes("protein")) {
        const totalProt = state.nutritionLog.reduce((s,i)=>s+(Number(i.prot)||0),0);
        const rem = Math.max(0, protTarget - Math.round(totalProt));
        return `🍗 You have consumed ${Math.round(totalProt)}g of protein today out of your ${protTarget}g target. You have ${rem}g remaining to reach optimal muscle surplus!`;
    }
    if (query.includes("post-workout") || query.includes("after workout")) {
        return "🏋️ Post-Workout Recommendation: Consume 1 scoop of Whey Protein Shake + 1 Banana within 45 mins. Follow up with a solid meal like 150g Chicken Breast or Paneer with Basmati Rice!";
    }
    if (query.includes("workout") || query.includes("beginner")) {
        return "💪 Recommended Split for Lean Mass (52kg build): Try Push (Chest/Shoulders/Triceps) → Pull (Back/Biceps) → Legs/Core → Rest. Focus on progressive overload on compound lifts (Bench Press, Lat Pulldowns, Squats)!";
    }
    if (query.includes("calorie") || query.includes("left")) {
        const totalCal = state.nutritionLog.reduce((s,i)=>s+(Number(i.cal)||0),0);
        const rem = Math.max(0, (state.user.calGoal || 2400) - totalCal);
        return `🔥 You have consumed ${totalCal} kcal today. You have ${rem} kcal left to reach your ${state.user.calGoal || 2400} kcal bulking surplus goal.`;
    }
    return "💡 Tip: Consistency with clean caloric surplus (+500 kcal over maintenance) and progressive overload in the gym is the secret to building solid muscle mass. Keep tracking your sets and meals daily!";
}

function simulateAIScan() {
    const resultBox = document.getElementById("scanner-result-box");
    resultBox.classList.remove("hidden");
    document.getElementById("scan-food-title").textContent = "Analyzing Meal Photo with Vision Model...";

    setTimeout(() => {
        document.getElementById("scan-food-title").textContent = "Grilled Chicken & Brown Rice Bowl";
        document.getElementById("scan-cal").textContent = "580 kcal";
        document.getElementById("scan-prot").textContent = "48 g";
        document.getElementById("scan-carbs").textContent = "62 g";
        document.getElementById("scan-fat").textContent = "10 g";
    }, 1200);

    document.getElementById("add-scanned-food-btn").onclick = () => {
        addPresetFoodToLog({
            emoji: "📸",
            name: "AI Scanned: Chicken & Brown Rice",
            cal: 580,
            prot: 48,
            carb: 62,
            fat: 10,
            cat: "lunch"
        });
        alert("✓ AI Scanned meal added to your Lunch nutrition log!");
    };
}

// --- TAB 11: PLANNER & HABITS ---
function renderPlannerAndHabits() {
    // 1. Weekly Planner
    const plannerContainer = document.getElementById("weekly-planner-list");
    plannerContainer.innerHTML = "";

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    days.forEach(day => {
        const div = document.createElement("div");
        div.className = "checklist-item";
        div.innerHTML = `
            <div style="flex:1;">
                <strong>${day}:</strong>
                <input type="text" class="form-control btn-sm margin-top-sm" value="${state.weeklyPlanner[day] || ''}" onchange="updateWeeklyPlan('${day}', this.value)">
            </div>
        `;
        plannerContainer.appendChild(div);
    });

    // 2. Habits Manager
    const habitsContainer = document.getElementById("habits-manager-list");
    habitsContainer.innerHTML = "";

    state.dailyHabits.forEach((h, idx) => {
        const div = document.createElement("div");
        div.className = "supp-item";
        div.innerHTML = `
            <span>${h.task}</span>
            <button class="btn btn-sm btn-danger" onclick="deleteHabit(${idx})">Remove</button>
        `;
        habitsContainer.appendChild(div);
    });
}

function updateWeeklyPlan(day, val) {
    state.weeklyPlanner[day] = val;
    saveState();
}

function deleteHabit(idx) {
    state.dailyHabits.splice(idx, 1);
    saveState();
    renderPlannerAndHabits();
    renderDashboard();
}

function setupHabitForm() {
    document.getElementById("add-habit-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("new-habit-input");
        const val = input.value.trim();
        if (val) {
            state.dailyHabits.push({
                id: "h_" + Date.now(),
                task: val,
                completed: false
            });
            input.value = "";
            saveState();
            renderPlannerAndHabits();
            renderDashboard();
        }
    });
}

// --- TAB 12: STREAKS & BADGES ---
function renderBadgesAndStreaks() {
    document.getElementById("streak-workout-val").textContent = `${state.streaks.workout || 0} Days`;
    document.getElementById("streak-protein-val").textContent = `${state.streaks.protein || 0} Days`;
    document.getElementById("streak-water-val").textContent = `${state.streaks.water || 0} Days`;
    document.getElementById("streak-steps-val").textContent = `${state.streaks.steps || 0} Days`;

    const container = document.getElementById("badges-grid");
    container.innerHTML = "";

    state.badges.forEach(badge => {
        const card = document.createElement("div");
        card.className = `badge-card ${badge.unlocked ? 'unlocked' : ''}`;
        card.innerHTML = `
            <span class="badge-icon">${badge.icon}</span>
            <span class="badge-title">${badge.title}</span>
            <span class="badge-desc">${badge.desc}</span>
        `;
        container.appendChild(card);
    });
}

// --- TAB 13: SETTINGS & DATA MANAGEMENT ---
function setupSettings() {
    // Save Profile
    document.getElementById("profile-form").addEventListener("submit", (e) => {
        e.preventDefault();
        state.user.name = document.getElementById("profile-name").value;
        state.user.age = Number(document.getElementById("profile-age").value);
        state.user.height = Number(document.getElementById("profile-height").value);
        state.user.weight = Number(document.getElementById("profile-weight").value);
        state.user.calGoal = Number(document.getElementById("profile-cal-goal").value);
        saveState();
        renderUserMiniCard();
        renderDashboard();
        alert("✓ Profile updated successfully!");
    });

    // Export Data JSON
    document.getElementById("export-data-btn").addEventListener("click", () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `FitTrack_Backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // Import Data JSON
    document.getElementById("import-file-input").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedState = JSON.parse(event.target.result);
                    state = importedState;
                    saveState();
                    renderAll();
                    alert("✓ Data successfully imported!");
                } catch (err) {
                    alert("❌ Error: Invalid JSON backup file!");
                }
            };
            reader.readAsText(file);
        }
    });

    // Reset All Data
    document.getElementById("reset-all-data-btn").addEventListener("click", () => {
        if (confirm("⚠️ Are you sure you want to delete all local fitness records and reset FitTrack AI?")) {
            localStorage.removeItem("fittrack_state");
            state = JSON.parse(JSON.stringify(DEFAULT_STATE));
            saveState();
            renderAll();
            alert("✓ All local data has been reset.");
        }
    });
}

// --- GLOBAL EVENT LISTENERS & MODALS ---
function setupEventListeners() {
    // Quick Topbar Buttons
    document.getElementById("quick-water-btn").addEventListener("click", () => quickAddWater(0.25));
    document.getElementById("quick-workout-btn").addEventListener("click", () => switchTab("workout"));

    // Add Exercise Modal
    document.getElementById("add-exercise-btn").addEventListener("click", () => {
        openModal("add-exercise-modal");
    });

    document.getElementById("add-exercise-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("ex-name-input").value;
        const group = document.getElementById("ex-group-select").value;
        const numSets = Number(document.getElementById("ex-sets-input").value);
        const reps = Number(document.getElementById("ex-reps-input").value);
        const weight = Number(document.getElementById("ex-weight-input").value);

        const setsArray = [];
        for (let i = 1; i <= numSets; i++) {
            setsArray.push({ setNo: i, weight, reps, completed: false });
        }

        state.workouts.exercises.push({
            id: "ex_" + Date.now(),
            name, group, sets: setsArray
        });

        saveState();
        renderWorkoutSystem();
        renderDashboard();
        closeModal("add-exercise-modal");
    });

    // Finish Workout Button
    document.getElementById("finish-workout-btn").addEventListener("click", () => {
        state.workoutHistory.push({
            date: new Date().toISOString().split('T')[0],
            split: state.workouts.split,
            exercisesCount: state.workouts.exercises.length
        });
        state.streaks.workout = (state.streaks.workout || 0) + 1;
        state.today.workoutCompleted = true;
        saveState();
        renderWorkoutSystem();
        renderBadgesAndStreaks();
        renderDashboard();
        alert("🎉 Congratulations! Workout session completed & logged!");
    });

    // Add Food Modal
    document.getElementById("open-add-food-modal").addEventListener("click", () => openModal("add-food-modal"));
    document.getElementById("add-food-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const meal = document.getElementById("food-meal-category").value;
        const name = document.getElementById("food-name-input").value;
        const cal = Number(document.getElementById("food-cal-input").value);
        const prot = Number(document.getElementById("food-prot-input").value);
        const carb = Number(document.getElementById("food-carb-input").value);
        const fat = Number(document.getElementById("food-fat-input").value);

        state.nutritionLog.push({
            id: "food_" + Date.now(),
            meal, name, cal, prot, carb, fat
        });

        saveState();
        renderNutrition();
        renderDashboard();
        closeModal("add-food-modal");
    });

    // Workout Split Dropdown
    document.getElementById("workout-split-select").addEventListener("change", (e) => {
        state.workouts.split = e.target.value;
        saveState();
    });

    // Setup Modular Subsystems
    setup2HourRoutineEngine();
    setupCalculators();
    setupTrackersForms();
    setupBodyForm();
    setupAIAssistant();
    setupHabitForm();
    setupSettings();
}

function openModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
}
