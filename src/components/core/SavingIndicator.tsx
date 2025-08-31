import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function SaveIndicator({
  isSaving,
  lastSavedAt,
}: {
  isSaving: boolean;
  lastSavedAt: number | null;
}) {
  const [relative, setRelative] = useState("");

  useEffect(() => {
    if (lastSavedAt) {
      const update = () => setRelative(dayjs(lastSavedAt).fromNow());
      update(); // initial call
      const interval = setInterval(update, 60_000); // refresh every minute
      return () => clearInterval(interval);
    }
  }, [lastSavedAt]);

  if (isSaving) {
    return (
      <div className="flex items-center text-sm text-gray-500">
        <svg
          className="animate-spin h-4 w-4 mr-2 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        Saving...
      </div>
    );
  }

  if (lastSavedAt) {
    return <p className="text-sm text-gray-500">Last saved {relative}</p>;
  }

  return null;
}
