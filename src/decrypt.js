const { calcIoc } = require('./calc-ioc')

const IOC_DIFF_TOLERANCE = 0.008
const MAX_KEY_LENGTH = 20

const ENGLISH = {
    IOC: 0.066,
    MOST_FREQUENT_LETTER: 'e',
    TRY_SECOND_MOST_FREQUENT_LETTER: false,
}
const PORTUGUESE = {
    IOC: 0.074,
    MOST_FREQUENT_LETTER: 'a',
    TRY_SECOND_MOST_FREQUENT_LETTER: true,
}

function findKey(cypheredText) {
    let keyLength = -1
    let subdivisions
    let language

    // find key and language
    for (let keyLengthAttempt = 2; keyLengthAttempt <= MAX_KEY_LENGTH; keyLengthAttempt++) {
        subdivisions = []

        // initiate subdivisions array
        for (let i = 0; i < keyLengthAttempt; i++) {
            subdivisions.push({ string: "", ioc: 0 })
        }

        // split the text in subdivisions
        for (let i = 0; i < cypheredText.length; i++) {
            subdivisions[i % keyLengthAttempt].string = subdivisions[i % keyLengthAttempt].string.concat(cypheredText.charAt(i))
        }

        // calculates ioc for the subdivisions
        for (let i = 0; i < subdivisions.length; i++) {
            subdivisions[i].ioc = calcIoc(subdivisions[i].string)
        }

        // check if language is found
        const iocMatched = subdivisions.map(({ ioc }) => ioc).some(ioc => {
            if (Math.abs(ENGLISH.IOC - ioc) <= IOC_DIFF_TOLERANCE) {
                language = ENGLISH
                return true
            } else if (Math.abs(PORTUGUESE.IOC - ioc) <= IOC_DIFF_TOLERANCE) {
                language = PORTUGUESE
                return true
            }

            return false
        })

        if (iocMatched) {
            keyLength = keyLengthAttempt
            break
        }
    }

    if (!language || keyLength < 0) {
        throw new Error("Language not found!")
    }

    let key = ""

    // find key
    for (let i = 0; i < subdivisions.length; i++) {
        const letterFrequency = getFrequency(subdivisions[i].string)
        let mostFrequentLetter
        let secondMostFrequentLetter

        // find most frequent and second most frequent letter
        for (attr in letterFrequency) {
            if (!mostFrequentLetter || letterFrequency[attr] > letterFrequency[mostFrequentLetter]) {
                secondMostFrequentLetter = mostFrequentLetter
                mostFrequentLetter = attr
            } else if (!secondMostFrequentLetter || letterFrequency[attr] > letterFrequency[secondMostFrequentLetter]) {
                secondMostFrequentLetter = attr
            }
        }

        // find number of shifts (displacement)
        const displacement = Math.abs(alphabetIndex(mostFrequentLetter) - alphabetIndex(language.MOST_FREQUENT_LETTER))

        if (language.TRY_SECOND_MOST_FREQUENT_LETTER) {
            const displacementSecondMostFrequentLetter = Math.abs(alphabetIndex(secondMostFrequentLetter) - alphabetIndex(language.MOST_FREQUENT_LETTER))
            key = key.concat(letterFromAlphabetIndex(displacement <= displacementSecondMostFrequentLetter ? displacement : displacementSecondMostFrequentLetter))
        } else {
            key = key.concat(letterFromAlphabetIndex(displacement))
        }
    }

    return key
}

function letterFromAlphabetIndex(alphabetPosition) {
    return String.fromCharCode(alphabetPosition + 65).toLowerCase()
}

function alphabetIndex(letter) {
    return parseInt(letter, 36) - 10;
}

function getFrequency(str) {
    return str.split('').reduce((total, letter) => {
        total[letter] ? total[letter]++ : total[letter] = 1;
        return total
    }, {})
}

function decrypt(cypheredText) {
    const key = findKey(cypheredText)

    let decryptedText = `KEY: ${key}\n\nDecryptedText:\n\n`

    for (let i = 0; i < cypheredText.length; i++) {
        const cypheredCharAlphabetIndex = alphabetIndex(cypheredText.charAt(i))
        const keyCharAlphabetIndex = alphabetIndex(key.charAt(i % key.length))

        const decryptedIndex = (cypheredCharAlphabetIndex - keyCharAlphabetIndex) % 26
        const letter = letterFromAlphabetIndex(decryptedIndex < 0 ? decryptedIndex + 26 : decryptedIndex)

        decryptedText = decryptedText.concat(letter)
    }

    return decryptedText
}

module.exports = { decrypt }