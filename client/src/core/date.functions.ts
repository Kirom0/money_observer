function formatNumber(num, size) {
    const str = '' + num;
    let zeros = '';
    for (let i = 0; i < size - str.length; i++) {
        zeros += '0';
    }
    return zeros + str;
}

export function formatDate_YYYY_MM_DD(mills) {
    const dt = new Date(mills);
    const date = formatNumber(dt.getDate(), 2);
    const month = formatNumber(dt.getMonth() + 1, 2);
    const year = dt.getFullYear();
    return `${year}-${month}-${date}`;
}
