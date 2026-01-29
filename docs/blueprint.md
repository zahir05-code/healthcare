# **App Name**: CareConnect

## Core Features:

- User Authentication: Phone number-based authentication for seniors and guardians via Firebase Authentication.
- Senior Home Screen: Simple UI with large, clear buttons: 'Call', 'Medication Reminder', 'View Schedule', and 'SOS'.
- Automated Check-Log and Evidence Data: Automatically generate entries in the CheckLog and Evidence collections upon button interactions on the Senior's app.
- Guardian Dashboard: Displays a summary of the senior's status, check-log data, and weekly reports.
- Rule-Based Notifications: Cloud Functions trigger notifications to guardians based on rules (e.g., medication delay, inactivity).
- Data Storage: Utilize Firestore to efficiently store application and user data

## Style Guidelines:

- Primary color: Soft blue (#A0D2EB) to create a calming and trustworthy environment.
- Background color: Very light blue (#F0F8FF), nearly white, providing a clean and accessible backdrop.
- Accent color: Muted orange (#E59866) for key interactive elements to ensure visibility without overwhelming.
- Font: 'PT Sans' for body and headlines (sans-serif) ensures readability for all users. 
- Large, high-contrast buttons with clear icons on the Senior's home screen.
- Use simple, recognizable icons for each action (e.g., phone icon for 'Call', pill icon for 'Medication').
- Subtle animations for feedback on user interactions.