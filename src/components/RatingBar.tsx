interface Props {
  rating: number;
  color: string;
  className?: string;
}

/** Barra segmentada de 5 células. Decimais preenchem parcialmente a célula. */
export default function RatingBar({ rating, color, className = '' }: Props) {
  return (
    <div className={`grid grid-cols-5 gap-1 h-2 ${className}`} role="img" aria-label={`Nota ${rating.toFixed(1)} de 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <div key={i} className="bg-outline-variant/40 relative overflow-hidden">
            <div
              className="h-full"
              style={{
                width: `${fill * 100}%`,
                background: color,
                boxShadow: fill > 0 ? `0 0 6px ${color}` : undefined,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

