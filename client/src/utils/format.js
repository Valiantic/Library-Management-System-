export function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString();
}
