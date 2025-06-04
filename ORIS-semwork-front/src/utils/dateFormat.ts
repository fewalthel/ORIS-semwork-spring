export const dateFormat = (isoString: string): string => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-EN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Moscow'
    }).format(date);
};