interface AiSimIconProps {
  className?: string;
  isDarkMode?: boolean;
}

export function AiSimIcon({ className = "w-8 h-8", isDarkMode = true }: AiSimIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill={isDarkMode ? "#1E3A5F" : "#2563EB"}
        opacity="0.2"
      />
      
      {/* Graduation Cap Base */}
      <path
        d="M50 25L20 40L50 55L80 40L50 25Z"
        fill="#FCD34D"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      
      {/* Graduation Cap Top */}
      <path
        d="M50 55L35 47V60C35 65 40 70 50 72C60 70 65 65 65 60V47L50 55Z"
        fill={isDarkMode ? "#FFFFFF" : "#1F2937"}
        opacity={isDarkMode ? "0.9" : "1"}
      />
      
      {/* AI Circuit Lines */}
      <g opacity="0.8">
        {/* Left Circuit */}
        <path
          d="M25 50L25 60L20 60"
          stroke="#FCD34D"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="60" r="2" fill="#FCD34D" />
        <circle cx="25" cy="50" r="2" fill="#FCD34D" />
        
        {/* Right Circuit */}
        <path
          d="M75 50L75 60L80 60"
          stroke="#FCD34D"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="80" cy="60" r="2" fill="#FCD34D" />
        <circle cx="75" cy="50" r="2" fill="#FCD34D" />
        
        {/* Bottom Circuit */}
        <path
          d="M50 72L50 78"
          stroke="#FCD34D"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="50" cy="78" r="2" fill="#FCD34D" />
      </g>
      
      {/* AI Spark Effect */}
      <g opacity="0.6">
        <path
          d="M85 35L88 38L85 41"
          stroke="#FCD34D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 35L12 38L15 41"
          stroke="#FCD34D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
