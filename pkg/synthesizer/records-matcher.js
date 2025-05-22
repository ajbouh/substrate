const sqliteLikeToRegExp = (likePattern, isCaseSensitive = false) => {
    const regexString = likePattern
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& inserts the matched character
        .replace(/%/g, '.*') // '%' becomes '.*' (match any character zero or more times)
        .replace(/_/g, '.'); // '_' becomes '.' (match any single character except newline)
    return new RegExp(`^${regexString}$`, isCaseSensitive ? '' : 'i');
}

const unknownCondition = condition => { throw new Error(`unknown condition: ${JSON.stringify(condition)}`) }
const conditions = {
    like: ({value}) => {
        const pattern = sqliteLikeToRegExp(value)
        return fieldval => fieldval !== undefined && pattern.test(fieldval)
    },
    "is not": ({value}) => fieldval => value !== fieldval,
    "=": ({value}) => fieldval => value === fieldval || (value === 1 && fieldval === true), // sqlite treats 1 as true
    ">": ({value}) => fieldval => value > fieldval,
    ">=": ({value}) => fieldval => value >= fieldval,
    "<": ({value}) => fieldval => value < fieldval,
    "<=": ({value}) => fieldval => value <= fieldval,
}
const conditionMatcher = condition => (conditions[condition.compare] ?? unknownCondition(condition))(condition)
const fieldConditionsMatcher = (key, conditions) => {
    const matchers = conditions.map(condition => conditionMatcher(condition))
    return record => {
        // NB(adamb) we are trying to recreate sqlite's json_extract path parsing.
        // but this is a very poor parsing strategy. for example, it can't handle a . in quotes.
        const parsedKey = key.includes('.')
            ? key.split('.').map(fragment => fragment[0] === '"' ? JSON.parse(fragment) : fragment)
            : [key]
        const value = parsedKey.reduce((acc, k) => acc?.[k], record.fields)
        return matchers.every(matcher => matcher(value))
    }
}
export const criteriaMatcher = criteria => {
    if (!criteria) {
        // if there is no criteria, then return something that won't match any records
        return undefined
    }
    const fieldMatchers = Object.entries(criteria || {}).map(([key, conditions]) => fieldConditionsMatcher(key, conditions))
    return Object.assign(record => fieldMatchers.every(matcher => matcher(record)), {criteria})
}
