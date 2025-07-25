# Stopwatch, Timer, and Pomodoro App

This is a simple web application that combines 
- Stopwatch, 
- Timer, and 
- Pomodoro timer into a single, responsive page. 
It allows users to track time effectively for various tasks,
whether it's for personal productivity, work sessions, or just keeping track of time in a fun way.
The application features a user-friendly interface with clear buttons for each mode, making it easy to switch between functionalities. It also includes sound alerts for timer completion and supports Progressive Web App (PWA) features, allowing users to install it on their devices for offline use.

## Project Overview

It's built using HTML, CSS, and JavaScript, demonstrating basic web development concepts and interactive features.

## Features

*   **Stopwatch:**
    *   Start, Stop, and Reset functionality.
    *   Lap recording.
    *   Displays time in minutes, seconds, and milliseconds.

*   **Timer:**
    *   Set countdowns in hours, minutes, and seconds.
    *   Start, Stop, and Reset functionality.
    *   Plays an alarm sound when the timer finishes.
    *   Custom alert message for timer completion or invalid input.

*   **Pomodoro Timer:**
    *   Configurable work and break durations.
    *   Automatically switches between work and break sessions.
    *   Plays an alarm sound at the end of each session.
    *   Start, Stop, and Reset functionality for the Pomodoro cycle.
    *   Circular progress bar with animated minute and second needles to visually represent remaining time.

*   **User-Friendly Interface:**
    *   Intuitive mode switcher to toggle between Stopwatch, Timer, and Pomodoro.
    *   Enhanced button styles for better visual feedback.
    *   Responsive design for optimal viewing on both PC and mobile browsers.
    *   Tooltip messages on input fields for guidance.
    *   Custom alert box for a consistent user experience.
    *   Selectable alarm sounds (Rooster Crowing or Sci-Fi Alarm).
    *   Usage manual displayed dynamically based on the selected feature.
    *   Visual feedback with animated progress bar and needles for the Pomodoro timer.

*   **Progressive Web App (PWA):**
    *   **Installable:** Add the app to your home screen on mobile devices or desktop.
    *   **Offline Support:** Basic offline capabilities through a service worker, caching essential assets.
    *   **Rich Previews:** Configured with `manifest.json` and `images/thumbnail.png` to display a rich preview (thumbnail, title, description) when shared on social media or messaging apps (e.g., when sharing `https://pomodoroex.web.app/`).

*   **Project Information:**
    *   Includes a favicon for browser tabs.
    *   Copyright information in the footer.

## How to Use

1.  **Open `index.html`:** Simply open the `index.html` file in your web browser.
2.  **Switch Modes:** Use the "Stopwatch", "Timer", and "Pomodoro" buttons at the top to switch between the different functionalities.
3.  **View Usage Manuals:** The relevant usage manual for the selected mode will automatically appear below the mode switcher. Click on the manual's header to expand or collapse it.
4.  **Select Alarm Sound:** Choose your preferred alarm sound ("Rooster" or "Sci-Fi") using the buttons provided.

## Project Structure

```
.
├── index.html          # Main HTML file for the application
├── style.css           # Stylesheet for the application's appearance
├── script.js           # JavaScript for interactive functionalities
├── manifest.json       # Web App Manifest for PWA features
├── service-worker.js   # Service Worker for offline capabilities
├── favicon.ico         # Favicon for the browser tab
├── rooster-crowing.wav # Alarm sound file
├── sci-fi-alarm.wav    # Alarm sound file
└── images/
    └── thumbnail.png   # Thumbnail image for PWA rich previews
```

## Local Development

To run this project locally:

1.  **Clone the repository** (if applicable) or download the project files.
2.  Navigate to the project directory in your terminal.
3.  Open `index.html` in your preferred web browser.

## Deployment to Netlify (Free)

This project can be easily deployed to Netlify for free hosting.

### Method 1: Deploying from a Git Repository (Recommended for Continuous Deployment)

1.  **Sign Up/Log In to Netlify:** Go to [https://app.netlify.com/](https://app.netlify.com/) and log in or sign up for a new account.
2.  **Add New Site:** Click "Add new site" -> "Import an existing project".
3.  **Connect Git Provider:** Choose your Git provider (GitHub, GitLab, Bitbucket) and authorize Netlify.
4.  **Select Repository:** Choose the repository containing this project.
5.  **Configure Build Settings:**
    *   **Branch to deploy:** `main` (or `master`)
    *   **Build command:** Leave empty
    *   **Publish directory:** Leave empty (or `./`)
6.  Click **"Deploy site"**. Netlify will automatically build and deploy your site.

### Method 2: Manual Deploy (Drag and Drop)

1.  **Sign Up/Log In to Netlify:** Go to [https://app.netlify.com/](https://app.netlify.com/) and log in or sign up.
2.  **Add New Site:** Click "Add new site" -> "Deploy manually".
3.  **Drag and Drop:** Drag the entire project folder (e.g., `GeminiCliEx`) directly into the designated drag-and-drop area on the Netlify page.
4.  Netlify will automatically upload and deploy your site.

After deployment, Netlify will provide you with a unique URL to access your live application. You can also configure a custom domain if desired.

## Deployment to Firebase Hosting

This project can also be deployed to Firebase Hosting. Assuming you have a Firebase project named `RootBridge` and a hosting site named `pomodoroex`.

1.  **Install Firebase CLI:** If you haven't already, install the Firebase CLI globally:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Log in to Firebase:** Authenticate your Firebase CLI with your Google account. This command will open a browser window for you to log in.
    ```bash
    firebase login
    ```

3.  **Initialize Firebase Project:** Navigate to your project directory (`/Users/joshuapark/Desktop/DevAndStudy/GeminiCliEx/`) in your terminal and run the initialization command. This is an interactive process:
    ```bash
    firebase init
    ```
    *   When prompted, use the spacebar to select `Hosting: Configure files for Firebase Hosting...` and press Enter.
    *   Choose `Use an existing project` and select your Firebase project (`RootBridge`).
    *   For the public directory, type `.` (a single dot) and press Enter.
    *   For configuring as a single-page app, type `No` and press Enter.
    *   For setting up automatic deploys with GitHub, type `No` and press Enter.
    *   This will create `firebase.json` and `.firebaserc` files in your project directory.

4.  **Specify Hosting Site (for multiple sites):** If you have multiple hosting sites within your Firebase project (e.g., `pomodoroex` and `rootbriddge-9b225`), you need to explicitly tell Firebase which site to deploy to. Open your `firebase.json` file and add the `"site"` property within the `"hosting"` object, like so:

    ```json
    {
      "hosting": {
        "public": ".",
        "ignore": [
          "firebase.json",
          "**/.*",
          "**/node_modules/**"
        ],
        "site": "pomodoroex"  // Add this line with your desired hosting site ID
      }
    }
    ```

5.  **Deploy your Project:** Once the `firebase.json` and `.firebaserc` files are present (and `firebase.json` is configured for the correct site), you can deploy your project to Firebase Hosting:
    ```bash
    firebase deploy --only hosting
    ```

After successful deployment, Firebase will provide you with a Hosting URL where your application is live.