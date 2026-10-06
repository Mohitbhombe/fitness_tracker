import React, { useState } from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import { useDate } from '../context/DateContext';
import { LogExerciseModal } from '../components/exercise/LogExerciseModal';
import { Dumbbell, Plus, Trash2, Flame, Clock, CheckCircle2 } from 'lucide-react';

export const ExercisePage: React.FC = () => {
  const { exercises, workouts, deleteExercise, addWorkout, dailySummary } = useFitnessData();
  const { formattedDateLabel, selectedDate } = useDate();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Multi-exercise Workout Builder state
  const [workoutTitle, setWorkoutTitle] = useState('Chest & Triceps Workout');
  const [workoutDuration, setWorkoutDuration] = useState<number>(45);
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState(false);

  const todayExercises = exercises.filter((e) => e.date === selectedDate);
  const todayWorkouts = workouts.filter((w) => w.date === selectedDate);

  const handleCreateSampleWorkout = async () => {
    await addWorkout({
      date: selectedDate,
      title: workoutTitle,
      exercises: [
        { exerciseName: 'Bench Press', sets: 3, reps: 10, weightKg: 60 },
        { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: 12, weightKg: 20 },
        { exerciseName: 'Push-ups', sets: 3, reps: 15, weightKg: 0 },
      ],
      durationMinutes: workoutDuration,
      caloriesBurned: 320,
      totalSets: 9,
      completed: true,
      notes: 'Completed all sets with good form!',
    });
    setIsWorkoutCompleted(true);
    setTimeout(() => setIsWorkoutCompleted(false), 4000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-purple-500" /> Exercise & Workout Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Record workouts, strength training, cardio, sets, reps & calories burned.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 hover:from-purple-700 hover:to-indigo-700"
        >
          <Plus className="h-4 w-4" /> Log Single Exercise
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase text-slate-400">Total Duration</div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" /> {dailySummary.exerciseMinutes} mins
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase text-slate-400">Workout Calories Burned</div>
          <div className="mt-1 text-2xl font-black text-purple-500 flex items-center gap-2">
            <Flame className="h-5 w-5 text-purple-500" /> {dailySummary.workoutCalories} kcal
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase text-slate-400">Total Exercises Logged</div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {todayExercises.length + todayWorkouts.length} Sessions
          </div>
        </div>
      </div>

      {/* Quick Workout Session Launcher */}
      <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-6 shadow-sm dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-purple-500" /> Quick Workout Builder
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Log structured multi-exercise workouts (Bench Press, Incline Press, Push-ups).
            </p>
          </div>

          <button
            onClick={handleCreateSampleWorkout}
            className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-700"
          >
            + Complete Chest Workout Routine
          </button>
        </div>

        {isWorkoutCompleted && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-500/20 p-3 text-xs font-bold text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Workout completed! ✅ 45 minutes • 320 estimated calories burned • 3 exercises logged.
          </div>
        )}
      </div>

      {/* Logged Exercises Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
          Activity & Exercises for {formattedDateLabel}
        </h3>

        {todayExercises.length === 0 && todayWorkouts.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No workouts logged for {formattedDateLabel}. Click above to record a workout!
          </div>
        ) : (
          <div className="space-y-3">
            {todayWorkouts.map((wk) => (
              <div
                key={wk.id}
                className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 dark:bg-purple-500/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="rounded-lg bg-purple-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                      Workout Routine
                    </span>
                    <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{wk.title}</h4>
                    <p className="text-xs text-slate-500">
                      {wk.durationMinutes} mins • {wk.caloriesBurned} kcal burned • {wk.exercises.length} Exercises
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-500">Completed ✅</span>
                </div>

                <div className="mt-3 divide-y divide-slate-200/40 text-xs dark:divide-slate-700/40">
                  {wk.exercises.map((ex, idx) => (
                    <div key={idx} className="flex justify-between py-1.5 text-slate-700 dark:text-slate-300">
                      <span>{ex.exerciseName}</span>
                      <span className="font-semibold">
                        {ex.sets} sets × {ex.reps} reps {ex.weightKg ? `@ ${ex.weightKg}kg` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {todayExercises.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ex.name}</h4>
                  <p className="text-xs text-slate-500">
                    {ex.category} • {ex.durationMinutes} mins {ex.sets ? `• ${ex.sets} sets × ${ex.reps} reps` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-purple-600 dark:text-purple-400">
                    {ex.caloriesBurned} kcal
                  </span>
                  <button
                    onClick={() => deleteExercise(ex.id)}
                    className="rounded p-1 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LogExerciseModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} />
    </div>
  );
};
