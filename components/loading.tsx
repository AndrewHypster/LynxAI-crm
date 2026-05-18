export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[10] flex flex-col items-center justify-center bg-gray-900/10 backdrop-blur-[2px] h-full">
      <div className="relative flex flex-col items-center gap-4 p-6">
        {/* SVG Спінер з анімацією довжини лінії */}
        <svg
          className="animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width="64"
          height="64"
        >
          {/* Статичне фонове кільце з прозорістю для глибини */}
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            style={{ stroke: "#7C1DF2" }}
            strokeWidth="2.5"
          />

          {/* Динамічна лінія, що обертається та змінює візуальну довжину */}
          <circle
            className="opacity-100"
            cx="12"
            cy="12"
            r="10"
            style={{ stroke: "#7C1DF2" }}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="42 18" // Задає співвідношення довжини дуги до пропуску
          />
        </svg>
      </div>
    </div>
  )
}
