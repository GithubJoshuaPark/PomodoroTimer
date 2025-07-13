document.addEventListener('DOMContentLoaded', () => {
    // Mode switching elements
    const stopwatchModeBtn = document.getElementById('stopwatchModeBtn');
    const timerModeBtn = document.getElementById('timerModeBtn');
    const pomodoroModeBtn = document.getElementById('pomodoroModeBtn');
    const stopwatchContainer = document.getElementById('stopwatch');
    const timerContainer = document.getElementById('timer');
    const pomodoroContainer = document.getElementById('pomodoro');

    // Stopwatch elements
    const stopwatchDisplay = stopwatchContainer.querySelector('.stopwatch-display');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapBtn = document.getElementById('lapBtn');
    const lapsList = document.getElementById('lapsList');

    // Timer elements
    const timerDisplay = timerContainer.querySelector('.timer-display');
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const startTimerBtn = document.getElementById('startTimerBtn');
    const stopTimerBtn = document.getElementById('stopTimerBtn');
    const resetTimerBtn = document.getElementById('resetTimerBtn');

    // Pomodoro elements
    const pomodoroDisplay = pomodoroContainer.querySelector('.pomodoro-display');
    const startPomodoroBtn = document.getElementById('startPomodoroBtn');
    const stopPomodoroBtn = document.getElementById('stopPomodoroBtn');
    const resetPomodoroBtn = document.getElementById('resetPomodoroBtn');
    const workDurationInput = document.getElementById('workDuration');
    const breakDurationInput = document.getElementById('breakDuration');

    // Custom Alert elements
    const customAlert = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    const alertOkBtn = document.getElementById('alertOkBtn');
    const alarmSound = document.getElementById('alarmSound');

    // Usage Manual elements
    const usageManual = document.getElementById('usageManual');
    const manualList = document.getElementById('manualList');

    // Sound Selection elements
    const roosterSoundBtn = document.getElementById('roosterSoundBtn');
    const sciFiSoundBtn = document.getElementById('sciFiSoundBtn');

    let stopwatchState = { startTime: 0, elapsedTime: 0, timerInterval: null, laps: [] };
    let timerState = { duration: 0, remainingTime: 0, timerInterval: null, isRunning: false };
    let pomodoroState = { 
        workDuration: 25 * 60, 
        breakDuration: 5 * 60, 
        remainingTime: 25 * 60, 
        timerInterval: null, 
        isWorkTime: true, 
        isRunning: false 
    };

    // --- Custom Alert Logic ---
    function showCustomAlert(message) {
        alertMessage.textContent = message;
        customAlert.style.display = 'flex';
    }

    function hideCustomAlert() {
        customAlert.style.display = 'none';
    }

    alertOkBtn.addEventListener('click', hideCustomAlert);

    // --- Sound Selection Logic ---
    function setAlarmSound(soundName) {
        alarmSound.src = `${soundName}.wav`;
        // Update active class for buttons
        roosterSoundBtn.classList.remove('active');
        sciFiSoundBtn.classList.remove('active');
        if (soundName === './rooster-crowing') {
            roosterSoundBtn.classList.add('active');
        } else if (soundName === './sci-fi-alarm') {
            sciFiSoundBtn.classList.add('active');
        }
    }

    roosterSoundBtn.addEventListener('click', () => setAlarmSound('./rooster-crowing'));
    sciFiSoundBtn.addEventListener('click', () => setAlarmSound('./sci-fi-alarm'));


    // --- Mode Switcher Logic ---
    stopwatchModeBtn.addEventListener('click', () => switchMode('stopwatch'));
    timerModeBtn.addEventListener('click', () => switchMode('timer'));
    pomodoroModeBtn.addEventListener('click', () => switchMode('pomodoro'));

    function switchMode(mode) {
        // Deactivate all containers and buttons
        stopwatchContainer.classList.remove('active');
        timerContainer.classList.remove('active');
        pomodoroContainer.classList.remove('active');
        stopwatchModeBtn.classList.remove('active');
        timerModeBtn.classList.remove('active');
        pomodoroModeBtn.classList.remove('active');

        // Activate selected mode
        if (mode === 'stopwatch') {
            stopwatchContainer.classList.add('active');
            stopwatchModeBtn.classList.add('active');
            displayUsageManual('stopwatch');
        } else if (mode === 'timer') {
            timerContainer.classList.add('active');
            timerModeBtn.classList.add('active');
            displayUsageManual('timer');
        } else if (mode === 'pomodoro') {
            pomodoroContainer.classList.add('active');
            pomodoroModeBtn.classList.add('active');
            displayUsageManual('pomodoro');
        }
    }

    // --- Usage Manual Logic ---
    const usageManualContent = {
        stopwatch: [
            "Click 'Start' to begin timing.",
            "Click 'Stop' to pause the stopwatch.",
            "Click 'Reset' to clear the time and laps.",
            "Click 'Lap' to record the current time without stopping."
        ],
        timer: [
            "Enter hours, minutes, and seconds in the input fields.",
            "Click 'Start' to begin the countdown.",
            "Click 'Stop' to pause the timer.",
            "Click 'Reset' to clear the timer and inputs.",
            "An alarm will sound when the timer reaches zero."
        ],
        pomodoro: [
            "Set your desired work and break durations in minutes.",
            "Click 'Start' to begin the Pomodoro cycle (starts with work time).",
            "The timer will automatically switch between work and break sessions.",
            "Click 'Stop' to pause the current session.",
            "Click 'Reset' to return to the initial work session and clear progress.",
            "An alarm will sound when each session finishes."
        ]
    };

    function displayUsageManual(mode) {
        manualList.innerHTML = ''; // Clear previous manual
        usageManualContent[mode].forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            manualList.appendChild(li);
        });
        usageManual.style.display = 'flex'; // Show the manual
    }

    // --- Stopwatch Logic ---
    function formatStopwatchTime(ms) {
        const date = new Date(ms);
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');
        const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
        return `${minutes}:${seconds}.${milliseconds}`;
    }

    function updateStopwatchDisplay() {
        stopwatchDisplay.textContent = formatStopwatchTime(stopwatchState.elapsedTime);
    }

    function startStopwatch() {
        stopwatchState.startTime = Date.now() - stopwatchState.elapsedTime;
        stopwatchState.timerInterval = setInterval(() => {
            stopwatchState.elapsedTime = Date.now() - stopwatchState.startTime;
            updateStopwatchDisplay();
        }, 10);
        startBtn.disabled = true;
        stopBtn.disabled = false;
        lapBtn.disabled = false;
    }

    function stopStopwatch() {
        clearInterval(stopwatchState.timerInterval);
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }

    function resetStopwatch() {
        clearInterval(stopwatchState.timerInterval);
        stopwatchState.elapsedTime = 0;
        stopwatchState.laps = [];
        updateStopwatchDisplay();
        lapsList.innerHTML = '';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        lapBtn.disabled = true;
    }

    function lapStopwatch() {
        const lapTime = stopwatchState.elapsedTime;
        stopwatchState.laps.push(lapTime);
        const li = document.createElement('li');
        li.textContent = `Lap ${stopwatchState.laps.length}: ${formatStopwatchTime(lapTime)}`;
        lapsList.prepend(li);
    }

    startBtn.addEventListener('click', startStopwatch);
    stopBtn.addEventListener('click', stopStopwatch);
    resetBtn.addEventListener('click', resetStopwatch);
    lapBtn.addEventListener('click', lapStopwatch);

    // --- Timer Logic ---
    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    function updateTimerDisplay() {
        timerDisplay.textContent = formatTime(timerState.remainingTime);
    }

    function startTimer() {
        if (timerState.isRunning) return;

        if (timerState.remainingTime === 0) {
            const hours = parseInt(hoursInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 0;
            const seconds = parseInt(secondsInput.value) || 0;
            timerState.duration = (hours * 3600) + (minutes * 60) + seconds;
            timerState.remainingTime = timerState.duration;
        }

        if (timerState.remainingTime <= 0) return showCustomAlert('Please set a timer duration.');

        timerState.isRunning = true;
        startTimerBtn.disabled = true;
        stopTimerBtn.disabled = false;
        setInputDisabled(true);

        timerState.timerInterval = setInterval(() => {
            timerState.remainingTime--;
            updateTimerDisplay();
            if (timerState.remainingTime <= 0) {
                stopTimer();
                showCustomAlert('Timer finished!');
                alarmSound.play();
                resetTimer();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerState.timerInterval);
        timerState.isRunning = false;
        startTimerBtn.disabled = false;
        stopTimerBtn.disabled = true;
    }

    function resetTimer() {
        stopTimer();
        timerState.remainingTime = 0;
        timerState.duration = 0;
        updateTimerDisplay();
        setInputDisabled(false);
        clearInputs();
    }
    
    function setInputDisabled(disabled) {
        hoursInput.disabled = disabled;
        minutesInput.disabled = disabled;
        secondsInput.disabled = disabled;
    }

    function clearInputs() {
        hoursInput.value = '';
        minutesInput.value = '';
        secondsInput.value = '';
    }

    startTimerBtn.addEventListener('click', startTimer);
    stopTimerBtn.addEventListener('click', stopTimer);
    resetTimerBtn.addEventListener('click', resetTimer);

    // --- Pomodoro Logic ---
    function updatePomodoroDisplay() {
        pomodoroDisplay.textContent = formatTime(pomodoroState.remainingTime);
    }

    function startPomodoro() {
        if (pomodoroState.isRunning) return;

        pomodoroState.isRunning = true;
        startPomodoroBtn.disabled = true;
        stopPomodoroBtn.disabled = false;
        resetPomodoroBtn.disabled = false;
        workDurationInput.disabled = true;
        breakDurationInput.disabled = true;

        pomodoroState.timerInterval = setInterval(() => {
            pomodoroState.remainingTime--;
            updatePomodoroDisplay();

            if (pomodoroState.remainingTime <= 0) {
                clearInterval(pomodoroState.timerInterval);
                alarmSound.play();
                if (pomodoroState.isWorkTime) {
                    showCustomAlert('Work time finished! Starting break.');
                    pomodoroState.isWorkTime = false;
                    pomodoroState.remainingTime = parseInt(breakDurationInput.value) * 60;
                } else {
                    showCustomAlert('Break time finished! Starting work.');
                    pomodoroState.isWorkTime = true;
                    pomodoroState.remainingTime = parseInt(workDurationInput.value) * 60;
                }
                pomodoroState.isRunning = false;
                startPomodoro(); // Automatically start next phase
            }
        }, 1000);
    }

    function stopPomodoro() {
        clearInterval(pomodoroState.timerInterval);
        pomodoroState.isRunning = false;
        startPomodoroBtn.disabled = false;
        stopPomodoroBtn.disabled = true;
    }

    function resetPomodoro() {
        stopPomodoro();
        pomodoroState.isWorkTime = true;
        pomodoroState.remainingTime = parseInt(workDurationInput.value) * 60;
        updatePomodoroDisplay();
        startPomodoroBtn.disabled = false;
        stopPomodoroBtn.disabled = true;
        resetPomodoroBtn.disabled = true;
        workDurationInput.disabled = false;
        breakDurationInput.disabled = false;
    }

    workDurationInput.addEventListener('change', () => {
        if (!pomodoroState.isRunning && pomodoroState.isWorkTime) {
            pomodoroState.remainingTime = parseInt(workDurationInput.value) * 60;
            updatePomodoroDisplay();
        }
    });

    breakDurationInput.addEventListener('change', () => {
        if (!pomodoroState.isRunning && !pomodoroState.isWorkTime) {
            pomodoroState.remainingTime = parseInt(breakDurationInput.value) * 60;
            updatePomodoroDisplay();
        }
    });

    startPomodoroBtn.addEventListener('click', startPomodoro);
    stopPomodoroBtn.addEventListener('click', stopPomodoro);
    resetPomodoroBtn.addEventListener('click', resetPomodoro);

    // --- Initial State ---
    function initialize() {
        // Stopwatch
        stopBtn.disabled = true;
        lapBtn.disabled = true;
        updateStopwatchDisplay();

        // Timer
        stopTimerBtn.disabled = true;
        updateTimerDisplay();
        
        // Pomodoro
        stopPomodoroBtn.disabled = true;
        resetPomodoroBtn.disabled = true;
        updatePomodoroDisplay();

        // Set default mode
        switchMode('stopwatch');
        // Set initial alarm sound
        setAlarmSound('./rooster-crowing');
    }

    initialize();
});