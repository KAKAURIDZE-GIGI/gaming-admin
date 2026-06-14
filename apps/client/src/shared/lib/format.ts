export function formatCoins(amount: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(amount));
}

export function formatSigned(amount: number): string {
  const sign = amount > 0 ? "+" : "";
  return `${sign}${formatCoins(amount)}`;
}
