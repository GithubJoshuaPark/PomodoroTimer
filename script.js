document.addEventListener('DOMContentLoaded', () => {
    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }

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
    
    const pomodoroTimeDisplay = document.getElementById('pomodoroTime');
    const pomodoroProgress = document.getElementById('pomodoroProgress');
    const minuteNeedle = document.getElementById('minuteNeedle');
    const secondNeedle = document.getElementById('secondNeedle');
    const radius = pomodoroProgress.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    pomodoroProgress.style.strokeDasharray = circumference;
    pomodoroProgress.style.strokeDashoffset = circumference;
    const stopPomodoroBtn = document.getElementById('stopPomodoroBtn');
    const resetPomodoroBtn = document.getElementById('resetPomodoroBtn');
    const workDurationInput = document.getElementById('workDuration');
    const breakDurationInput = document.getElementById('breakDuration');

    // Custom Alert elements
    const customAlert = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    const alertOkBtn = document.getElementById('alertOkBtn');
    const alarmSound = document.getElementById('alarmSound');

    

    // Sound Selection elements
    const stopwatchManual = document.getElementById('stopwatchManualContent').closest('.accordion-item');
    const timerManual = document.getElementById('timerManualContent').closest('.accordion-item');
    const pomodoroManual = document.getElementById('pomodoroManualContent').closest('.accordion-item');
    const roosterSoundBtn = document.getElementById('roosterSoundBtn');

    let stopwatchState = { startTime: 0, elapsedTime: 0, timerInterval: null, laps: [] };
    let timerState = { duration: 0, remainingTime: 0, timerInterval: null, isRunning: false };
    let pomodoroState = { 
        workDuration: parseInt(workDurationInput.value) * 60, 
        breakDuration: parseInt(breakDurationInput.value) * 60, 
        remainingTime: 25 * 60, 
        lastTime: 0, // Add for requestAnimationFrame
        animationFrameId: null, // Add for requestAnimationFrame
        isWorkTime: true, 
        isRunning: false 
    };

    // --- Custom Alert Logic ---
    function showCustomAlert(message) {
        alertMessage.textContent = message;
        customAlert.style.display = 'flex';
        
        // Automatically hide the alert after 2 seconds
        setTimeout(() => {
            hideCustomAlert();
        }, 2000);
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


    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('active');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

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

        // Hide all manual sections and collapse them
        [stopwatchManual, timerManual, pomodoroManual].forEach(manual => {
            manual.style.display = 'none';
            manual.querySelector('.accordion-header').classList.remove('active');
            manual.querySelector('.accordion-content').style.maxHeight = null;
        });

        // Activate selected mode and show relevant manual
        if (mode === 'stopwatch') {
            stopwatchContainer.classList.add('active');
            stopwatchModeBtn.classList.add('active');
            stopwatchManual.style.display = 'block';
            
        } else if (mode === 'timer') {
            timerContainer.classList.add('active');
            timerModeBtn.classList.add('active');
            timerManual.style.display = 'block';
            
        } else if (mode === 'pomodoro') {
            pomodoroContainer.classList.add('active');
            pomodoroModeBtn.classList.add('active');
            pomodoroManual.style.display = 'block';
            
        }
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
    function formatPomodoroTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function updatePomodoroDisplay() {
        pomodoroTimeDisplay.textContent = formatPomodoroTime(pomodoroState.remainingTime);
        const totalDuration = pomodoroState.isWorkTime ? pomodoroState.workDuration : pomodoroState.breakDuration;
        const offset = circumference - (pomodoroState.remainingTime / totalDuration) * circumference;
        pomodoroProgress.style.strokeDashoffset = offset;

        // Change color based on work/break time and update title and time display
        const pomodoroTitle = document.getElementById('pomodoroTitle');
        const pomodoroTimeElement = document.getElementById('pomodoroTime');
        
        if (pomodoroState.isWorkTime) {
            // Working mode - yellow colors
            pomodoroProgress.style.stroke = 'orange';
            pomodoroTitle.textContent = 'Working Time';
            pomodoroTitle.className = 'working-mode';
            minuteNeedle.style.stroke = '#ffcc00'; // Yellow for minute needle
            secondNeedle.style.stroke = '#ffcc00'; // Yellow for second needle
            pomodoroTimeElement.className = 'pomodoro-time-display pomodoro-time-working'; // Yellow time text
        } else {
            // Breaking mode - green colors
            pomodoroProgress.style.stroke = 'green';
            pomodoroTitle.textContent = 'Breaking Time';
            pomodoroTitle.className = 'breaking-mode';
            minuteNeedle.style.stroke = '#28a745'; // Green for minute needle
            secondNeedle.style.stroke = '#28a745'; // Green for second needle
            pomodoroTimeElement.className = 'pomodoro-time-display pomodoro-time-breaking'; // Green time text
        }

        const minutes = Math.floor(pomodoroState.remainingTime / 60);
        const seconds = pomodoroState.remainingTime % 60;
        const minuteRotation = (minutes / 60) * 360 + (seconds / 60) * 6;
        const secondRotation = (seconds / 60) * 360;

        minuteNeedle.style.transform = `rotate(${minuteRotation}deg)`;
        secondNeedle.style.transform = `rotate(${secondRotation}deg)`;
    }

    function pomodoroLoop(timestamp) {
        if (!pomodoroState.isRunning) return;

        if (!pomodoroState.lastTime) {
            pomodoroState.lastTime = timestamp;
        }

        const elapsed = timestamp - pomodoroState.lastTime;

        if (elapsed >= 1000) {
            pomodoroState.remainingTime--;
            pomodoroState.lastTime = timestamp - (elapsed % 1000);
            updatePomodoroDisplay();

            if (pomodoroState.remainingTime < 0) { // Changed to < 0 to handle the final second correctly
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
                // No need to call startPomodoro() again, the loop continues
                updatePomodoroDisplay(); // Update display immediately for the new session
            }
        }

        pomodoroState.animationFrameId = requestAnimationFrame(pomodoroLoop);
    }

    function startPomodoro() {
        if (pomodoroState.isRunning) return;

        pomodoroState.isRunning = true;
        startPomodoroBtn.disabled = true;
        stopPomodoroBtn.disabled = false;
        resetPomodoroBtn.disabled = false;
        workDurationInput.disabled = true;
        breakDurationInput.disabled = true;

        pomodoroState.animationFrameId = requestAnimationFrame(pomodoroLoop);
    }

    function stopPomodoro() {
        if (pomodoroState.animationFrameId) {
            cancelAnimationFrame(pomodoroState.animationFrameId);
            pomodoroState.animationFrameId = null;
        }
        pomodoroState.isRunning = false;
        pomodoroState.lastTime = 0;
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
        
        // Set initial Pomodoro title and style
        const pomodoroTitle = document.getElementById('pomodoroTitle');
        pomodoroTitle.textContent = 'Working Time';
        pomodoroTitle.className = 'working-mode';
        
        updatePomodoroDisplay();

        // Set default mode
        switchMode('pomodoro');
        // Set initial alarm sound
        setAlarmSound('./rooster-crowing');

        // Hide all manual sections initially
        [stopwatchManual, timerManual, pomodoroManual].forEach(manual => {
            manual.style.display = 'none';
            manual.querySelector('.accordion-header').classList.remove('active');
            manual.querySelector('.accordion-content').style.maxHeight = null;
        });
    }

    initialize();
});