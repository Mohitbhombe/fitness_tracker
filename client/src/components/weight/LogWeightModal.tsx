import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useFitnessData } from '../../context/FitnessDataContext';
import { useDate } from '../../context/DateContext';
import { Scale } from 'lucide-react';

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogWeightModal: React.FC<LogWeightModalProps> = ({ isOpen, onClose }) => {
  const { addWeightLog, profile } = useFitnessData();
  const { selectedDate } = useDate();

  const [weightKg, setWeightKg] = useState<number>(profile.currentWeightKg || 80);
  const [bodyFatPercentage, setBodyFatPercentage] = useState<string>('');
  const [waistMeasurementCm, setWaistMeasurementCm] = useState<string>('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightKg || weightKg <= 0) return;

    await addWeightLog({
      date: selectedDate,
      weightKg,
      bodyFatPercentage: bodyFatPercentage ? parseFloat(bodyFatPercentage) : undefined,
      waistMeasurementCm: waistMeasurementCm ? parseFloat(waistMeasurementCm) : undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Body Weight">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Weight ({profile.preferredWeightUnit})
          </label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="300"
            required
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base font-bold text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Body Fat % (Optional)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 22.5"
              value={bodyFatPercentage}
              onChange={(e) => setBodyFatPercentage(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Waist Size (cm) (Optional)
            </label>
            <input
              type="number"
              step="0.5"
              placeholder="e.g. 88"
              value={waistMeasurementCm}
              onChange={(e) => setWaistMeasurementCm(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Notes / Reflection (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Felt light, morning weigh-in after glass of water..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700"
          >
            <Scale className="h-4 w-4" /> Save Weight Entry
          </button>
        </div>
      </form>
    </Modal>
  );
};
