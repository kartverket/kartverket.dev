import { SEVERITY_COLORS } from '../../colors';

interface LinearGradientProps {
  id: string;
}

export const LinearGradient = ({ id }: LinearGradientProps) => {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop
        offset="0%"
        stopColor={
          id === 'critical' ? SEVERITY_COLORS.CRITICAL : SEVERITY_COLORS.HIGH
        }
        stopOpacity={0.3}
      />
      <stop offset="60%" stopColor={SEVERITY_COLORS.HIGH} stopOpacity={0} />
    </linearGradient>
  );
};
