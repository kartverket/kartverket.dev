export const calculateDaysSince = (lastPublishedRisc: string): number => {
  const now = new Date();
  const rosDate = new Date(lastPublishedRisc);
  return Math.ceil((now.getTime() - rosDate.getTime()) / (1000 * 60 * 60 * 24));
};

export const plural = (n: number, one: string, many: string) =>
  n === 1 ? one : many;
