import { date } from 'quasar'

export function get_date_from_timeStamp(timeStamp) {
    return date.formatDate(timeStamp, 'YYYY-MM-DD')
}

export function prepareSQLSearch(payload) {
    let where_string = undefined
    Object.keys(payload).forEach(key => {
        if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
            let condition = make_condition(payload[key], key)
            if (where_string === undefined) where_string = condition
            else where_string += ` AND ${condition}`
        }
    })
    return where_string
}

function make_condition(val, key) {
    let condition = null

    if (typeof(val) === 'string') {
        const lc = val.charAt(val.length-1)
        if (lc === '*' || lc === '%') condition = `${key} LIKE '${val.slice(0, val.length-1)}%'`
        else condition = `${key}='${val}'`
    }
    else condition = `${key}=${val}`
    
    return condition
}