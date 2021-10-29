const idAlphabet = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116]

let generateRandomId = function (l) {
    let length = l || 16
    let string = ''
    while (string.length < (2 * length)) {
        string += Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString()
    }
    let id = ''
    while (id.length < length) {
        let seed = parseInt(string.substr(id.length * 2, 2)) % 50
        id += String.fromCharCode(idAlphabet[seed])
    }

    return id
}
exports.generateRandomId = generateRandomId