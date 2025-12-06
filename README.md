# Rehab Daily

A daily rehabilitation schedule management application designed to help therapists and staff organize patient appointments and treatments efficiently.

## Features

- **Daily Schedule View**: A clear, interactive grid to view and manage patient slots for the day.
- **Patient Management**:
    - Add, edit, and delete patient records.
    - Store contact information, treatment frequency, and other details.
    - Quick-access "Patient Palette" for easy scheduling.
- **Smart Scheduling Tools**:
    - **Copy Yesterday**: Quickly replicate the previous day's schedule to save time.
    - **Clear Day**: Reset the current day's schedule with a single click.
- **Data Portability**: Import and export patient data (JSON format) to share or backup.
- **Mobile-First Design**: Optimized for mobile devices with a clean, responsive interface using DaisyUI.

## Tech Stack

- **Frontend Framework**: [Svelte 5](https://svelte.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [DaisyUI 5](https://daisyui.com/) (Winter Theme)

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rehab-daily
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Usage

- **Navigation**: Use the header sidebar (hamburger menu) to access global actions like "Copy Yesterday" or "Clear Today".
- **Adding Patients**: Use the "+" button in the Patient Palette to register new patients.
- **Scheduling**: Assign patients to specific time slots in the grid.
- **Exporting/Importing**: Use the provided tools in the patient list to backup your patient list or migrate data.

## Project Structure

- `src/App.svelte`: Main application component and layout.
- `src/components/`: Reusable UI components (Header, ScheduleGrid, PatientPalette).
- `src/components/modals/`: Modal dialogs for forms and details.
- `src/lib/store.js`: State management, data persistence, and utility logic.
