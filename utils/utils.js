export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function randomNumber () {
    return Math.floor(Math.random() * 12345);
}

export function padHour (num) {
    if (num < 10) {
        return "0" + num
    }
    return num
}

export const regions = [
    {
        label: 'Pacific',
        value: 'gfacn31',
        airportCode: 'CYVR'
    },
    {
        label: 'Prairies',
        value: 'gfacn32',
        airportCode: 'CYYC'
    },
    {
        label: 'Ontario & Quebec',
        value: 'gfacn33',
        airportCode: 'CYTZ'
    },
    {
        label: 'Atlantic',
        value: 'gfacn34',
        airportCode: 'CYYG'
    },
    {
        label: 'Yukon & NWT',
        value: 'gfacn35',
        airportCode: 'CYXY'
    },
    {
        label: 'Nunavut',
        value: 'gfacn36',
        airportCode: 'CYFB'
    },
    {
        label: 'Arctic',
        value: 'gfacn37',
        airportCode: 'CYAB'
    }
];