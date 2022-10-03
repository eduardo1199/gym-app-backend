

export function isActivePlanForUser(startDateForPlan: Date) {
  const date = new Date().toLocaleDateString('pt-BR', {
    second: 'numeric',
    day: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
  });

  return date;
}