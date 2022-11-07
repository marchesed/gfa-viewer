export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function randNum () {
    return Math.floor(Math.random() * 12345);
}

export function padHour (num) {
    if (num < 10) {
        return "0" + num
    }
    return num
}