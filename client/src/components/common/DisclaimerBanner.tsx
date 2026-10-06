import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-900 dark:bg-amber-500/10 dark:text-amber-300">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
        <span>
          <strong>Disclaimer:</strong> Fitness and calorie values are estimates intended for general wellness tracking. They are not medical advice.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="ml-2 rounded p-1 hover:bg-amber-500/20"
        title="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
