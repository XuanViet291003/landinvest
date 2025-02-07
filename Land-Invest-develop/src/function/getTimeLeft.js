import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const getTimeLeft = (futureDate) => {
    const now = dayjs();
    const target = dayjs(futureDate);
    const diff = dayjs.duration(target.diff(now));

    if (target.isBefore(now)) {
        return false;
    }
    return {
        days: diff.days(),
        hours: diff.hours(),
        minutes: diff.minutes(),
        seconds: diff.seconds(),
    };
};
