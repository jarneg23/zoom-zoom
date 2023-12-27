import cron from 'node-cron';
export const registerCronSchedule = (expression: string, callback: () => void) => {
  cron.schedule(expression, async () => {
    await callback();
  });
}

