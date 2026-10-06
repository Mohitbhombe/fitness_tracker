import React, { useState } from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';
import { Settings as SettingsIcon, Download, Upload, Trash2, Sun, Moon, Check, AlertTriangle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile, restoreBackup, clearData } = useFitnessData();
  const { theme, toggleTheme } = useTheme();

  const [calorieTarget, setCalorieTarget] = useState(profile.calorieTarget);
  const [stepGoal, setStepGoal] = useState(profile.stepGoal);
  const [waterGoalMl, setWaterGoalMl] = useState(profile.waterGoalMl);
  const [proteinGoal, setProteinGoal] = useState(profile.proteinGoal);
  const [sleepGoalHours, setSleepGoalHours] = useState(profile.sleepGoalHours);

  const [saveMessage, setSaveMessage] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      ...profile,
      calorieTarget,
      stepGoal,
      waterGoalMl,
      proteinGoal,
      sleepGoalHours,
    });
    setSaveMessage('Settings updated successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleExportJSON = async () => {
    const jsonStr = await apiService.exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FitTrack_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleExportCSV = async () => {
    const csvStr = await apiService.exportDataCSV();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FitTrack_Data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      const success = await restoreBackup(text);
      if (success) {
        alert('Data restored successfully!');
      } else {
        alert('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-emerald-500" /> App Settings & Data Backup
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize targets, theme preferences, export tracking records & manage backup restore.
        </p>
      </div>

      {/* Target Customizations Form */}
      <form onSubmit={handleSaveSettings} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
          Custom Daily Fitness Targets
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Daily Calorie Target (kcal)
            </label>
            <input
              type="number"
              min="1000"
              max="10000"
              required
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(parseInt(e.target.value) || 2000)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Daily Step Goal
            </label>
            <input
              type="number"
              min="1000"
              step="500"
              required
              value={stepGoal}
              onChange={(e) => setStepGoal(parseInt(e.target.value) || 10000)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Daily Water Goal (ml)
            </label>
            <input
              type="number"
              min="500"
              step="250"
              required
              value={waterGoalMl}
              onChange={(e) => setWaterGoalMl(parseInt(e.target.value) || 2500)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Daily Protein Goal (g)
            </label>
            <input
              type="number"
              min="20"
              required
              value={proteinGoal}
              onChange={(e) => setProteinGoal(parseInt(e.target.value) || 120)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Daily Sleep Goal (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              min="4"
              max="14"
              required
              value={sleepGoalHours}
              onChange={(e) => setSleepGoalHours(parseFloat(e.target.value) || 8)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saveMessage && <span className="text-xs font-bold text-emerald-500">{saveMessage}</span>}
          <button
            type="submit"
            className="ml-auto rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:from-emerald-600 hover:to-teal-700"
          >
            Save Target Settings
          </button>
        </div>
      </form>

      {/* Theme Preference */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Appearance Theme</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-300">
            Active mode: <strong>{theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}</strong>
          </span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />} Toggle Theme
          </button>
        </div>
      </div>

      {/* Export & Import Data */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Data Backup & Export</h3>
        <p className="text-xs text-slate-500">Download your personal tracking entries or import a saved JSON backup.</p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <Download className="h-4 w-4 text-emerald-400" /> Export JSON Backup
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4 text-sky-500" /> Export CSV Spreadsheet
          </button>

          <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400">
            <Upload className="h-4 w-4" /> Restore JSON File
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Clear Data Danger Zone */}
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-6 dark:bg-slate-900">
        <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" /> Danger Zone
        </h3>
        <p className="mt-1 text-xs text-slate-500">Permanently erase all local fitness entries and reset data to defaults.</p>

        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="mt-4 flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
          >
            <Trash2 className="h-4 w-4" /> Clear All Data
          </button>
        ) : (
          <div className="mt-4 rounded-2xl bg-white p-4 border border-rose-500/30 dark:bg-slate-800 space-y-3">
            <p className="text-xs font-bold text-rose-600">Are you completely sure? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  clearData();
                  setShowClearConfirm(false);
                  alert('All fitness data cleared!');
                }}
                className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white"
              >
                Yes, Clear Everything
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-xl border border-slate-300 px-4 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
