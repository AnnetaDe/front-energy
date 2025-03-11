
interface Props {
    params: number;
}

export function convertToDate(params: number): string {
    const date = new Date(params);
    const dateString = date.toISOString().split("T")[0];
    const timeString = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    return `${dateString} ${timeString}`;
} 