const alphabet = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
]

function calcIoc(text) {
    const ocurrences = []
    const textChars = text.split('')
    
    alphabet.forEach(letter => {
        let sum = 0

        textChars.forEach(char => {
            if (letter === char) sum++
        })

        ocurrences.push(sum)
    })

    let sum = 0

    ocurrences.forEach(fi => {
        sum += fi * (fi - 1)
    })

    const n = text.length
    const result = sum / (n * (n - 1))

    return result
}

module.exports = { calcIoc }