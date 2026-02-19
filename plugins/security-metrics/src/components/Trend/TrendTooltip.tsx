import { format } from 'date-fns';
import type { Payload } from 'recharts/types/component/DefaultTooltipContent';
import { BASIC_COLORS } from '../../colors';

type CustomTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: Payload<number, string>[];
  isDarkMode: boolean;
};

export const TrendTooltip = ({
  active,
  payload,
  label,
  isDarkMode,
}: CustomTooltipProps) => {
  if (!active || !payload?.length || label === null) return null;

  return (
    <div
      style={{
        background: isDarkMode ? BASIC_COLORS.BLACK : BASIC_COLORS.WHITE,
        border: `1px solid ${isDarkMode ? BASIC_COLORS.DARK_GREY : BASIC_COLORS.LIGHT_GREY}`,
        borderRadius: 10,
        padding: '10px 12px',
        color: isDarkMode ? BASIC_COLORS.WHITE : BASIC_COLORS.BLACK,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        {format(new Date(String(label)), 'dd-MM-yyyy')}
      </div>

      {payload.map((entry: Payload<number, string>) => (
        <div
          key={`${entry.name ?? entry.dataKey}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: (entry.color as string) ?? (entry.stroke as string),
              display: 'inline-block',
            }}
          />
          <span>{entry.name}:</span>
          <strong>{entry.value}</strong>
        </div>
      ))}
    </div>
  );
};
