const fs = require('fs');
const { decrypt } = require('./src/decrypt')

const fileNameList = process.argv.slice(2)
const cypheredFileName = fileNameList[0]

const cypheredTextPath = `./cyphered-texts/${cypheredFileName}`

fs.readFile(cypheredTextPath, 'utf8', (err, data) => {
    const decryptedText = decrypt(data)

    fs.writeFile(`./decrypted-texts/${cypheredFileName}`, decryptedText, (err) => {
        if (err) throw err;
        console.log('The file: ' + cypheredFileName + ' has been decoded and saved!');
    })
})