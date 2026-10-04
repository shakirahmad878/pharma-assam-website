# RepPulse SFA - Firebase & Cloud Firestore Quick Setup Guide

RepPulse is now fully integrated with **Google Cloud Firestore** for real-time cloud data synchronization, offline persistence, and seamless manager approval workflows.

---

## 🚀 3-Step Setup (Takes 2 Minutes)

### Step 1: Create a Free Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** (or create a new project).
3. Name your project (e.g. `reppulse-pharma-sfa`) and complete the creation steps.

---

### Step 2: Enable Cloud Firestore
1. In the Firebase console sidebar, click **"Build"** -> **"Firestore Database"**.
2. Click **"Create database"**.
3. Choose your database location (e.g., `asia-south1` for Mumbai / India).
4. Select **"Start in test mode"** (or configure rules) and click **Enable**.

---

### Step 3: Copy Your Firebase Web App Config Keys
1. In the Firebase console, click the **Settings gear icon ⚙️** (Project settings) -> **General** tab.
2. Scroll down to **"Your apps"** and click the **Web (</>)** icon.
3. Register the app name (e.g., `RepPulse Mobile`).
4. Copy the `firebaseConfig` object and paste it into:
   📂 `mobile/src/config/firebase.ts`

```typescript
export const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};
```

---

## 🗄️ Firestore Collections Automatically Managed by RepPulse

| Collection Name | Description |
| :--- | :--- |
| `doctors` | Real-time synchronized Doctor directory for Barak Valley Division |
| `doctor_deletion_requests` | MR deletion requests requiring RSM (Bodrud Jaman Sadiol) approval |
| `firms` | Chemist and Stockist enterprise directory |
| `visits` | Daily Call Reports (DCR), GPS logs, POB details, timestamps |
| `attendance` | Daily duty start / end timestamps, geofence validations |
| `location_telemetry` | Live field breadcrumbs & anti-mock GPS tracking logs |
| `monthly_tour_programmes` | MTP schedules, deviation records, manager approvals |

---

## ⚡ Offline-First Architecture
RepPulse works **100% offline**:
- Field reps can add doctors, log visits, and record attendance even with zero connectivity in remote areas.
- When an internet connection is restored, all data automatically syncs to Cloud Firestore in the background.
