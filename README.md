# Sonny — Boss Tracker

A personal 90-day task & milestone tracker built for focused execution. Sonny lives on your machine, syncs to Firebase Firestore, and deploys to Vercel in minutes.

---

## Tech stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS v3** (always-dark)
- **Zustand** — state management
- **Firebase Firestore** — cloud sync (source of truth)
- **localStorage** — offline cache (instant loads, no flash)

---

## Local development

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/sonny-boss-tracker.git
cd sonny-boss-tracker
npm install
```

### 2. Add Firebase config (see Firebase setup below)

Create a `.env.local` file in the project root (a template is already there):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app works fully without Firebase — sync badge will show "Firebase not configured" until you add the config.

---

## Firebase setup

### Step 1 — Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → enter a name (e.g. `sonny-boss-tracker`) → Continue
3. Disable Google Analytics (not needed) → **Create project**

### Step 2 — Enable Firestore

1. In the left sidebar, click **Build → Firestore Database**
2. Click **Create database**
3. Choose **Native mode** (not Datastore)
4. Select region: **us-central1** → **Enable**

### Step 3 — Set Firestore rules (development)

In Firestore → **Rules** tab, replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Click **Publish**. (For production, lock this down with auth rules.)

### Step 4 — Get your config values

1. In Firebase console, click the gear icon → **Project settings**
2. Scroll to **Your apps** → click the `</>` (Web) icon
3. Register the app (any nickname) → you'll see a `firebaseConfig` object:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 5 — Fill in `.env.local`

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

Restart the dev server (`npm run dev`) — the sync badge in the sidebar should turn green.

---

## Push to GitHub

### First time

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit — Sonny boss tracker"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/sonny-boss-tracker.git
git branch -M main
git push -u origin main
```

### Subsequent pushes

```bash
git add .
git commit -m "Your commit message"
git push
```

> **Important:** `.env.local` is in `.gitignore` — your Firebase secrets will NOT be pushed to GitHub.

---

## Deploy to Vercel

### Step 1 — Import the repo

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **Add New → Project**
3. Select your GitHub repo (`sonny-boss-tracker`)
4. Framework preset will be detected as **Vite** automatically
5. Click **Deploy** — the first deploy may fail without env vars; that's expected

### Step 2 — Add environment variables

1. Go to your Vercel project → **Settings → Environment Variables**
2. Add each of the 6 Firebase variables:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | your API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | your auth domain |
| `VITE_FIREBASE_PROJECT_ID` | your project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | your storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | your sender ID |
| `VITE_FIREBASE_APP_ID` | your app ID |

3. Set **Environment** to **Production, Preview, Development** for all
4. Click **Save**

### Step 3 — Redeploy

Go to **Deployments** → click the three-dot menu on the latest → **Redeploy**. The app will be live at `https://your-project.vercel.app`.

### Step 4 — Auto-deploy on push

Vercel automatically redeploys every time you push to `main`. Just `git push` and changes are live in ~30 seconds.

---

## Firestore data structure

```
/tasks/{projectId}      → { items: Task[], updatedAt: string }
/settings/{projectId}   → { streakData: {...}, updatedAt: string }
/meta/projects          → { items: Project[], updatedAt: string }
```

---

## Sync behavior

- **On load:** localStorage is read instantly (no flash), then Firestore hydrates the stores async
- **On every change:** localStorage updates immediately, Firestore write is debounced 800ms
- **Offline:** writes queue locally, sync badge shows "Offline" — recovers automatically on reconnect
- **No Firebase config:** app runs fully on localStorage, sync badge shows "Firebase not configured"
