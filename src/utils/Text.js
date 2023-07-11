export function getFirstLetter(text) {
    return text.split(' ')[0].substring(0, 1)
}

export function convertMiliToMinute(time) {
    const totalDetik = Math.round(time / 1000);
    let menit = Math.floor(totalDetik / 60);
    const detik = totalDetik % 60;
    detik >= 30 && menit++

    return `${menit}:${detik.toString().padStart(2, '0')}` ; 
}

export function limitString(str, limit) {
    if (str.length <= limit) return str 
    return str.substring(0, limit) + '...'; 
}