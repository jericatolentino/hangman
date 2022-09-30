const readline = require("readline")

const generateMap = (input) => {
    return input.reduce((accum, curr, index) => {
        const getCurrentLetter = accum[curr]
        return {
            ...accum,
            [curr]: getCurrentLetter ? [...getCurrentLetter, index] : [index]
        }
    }, {})
}

const hangman = async () => {
    const wordLetters = ['h', 'a', 'n', 'g', 'm', 'a', 'n']

    const wordToGuess = generateMap(wordLetters) 

    const guessedLetters = new Set()

    let displayedLetters = Array(wordLetters.length).fill('_')

    const word = wordLetters.join('')
    
    let lives = 4
    let guessed = false

    const rl =
        readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })


    const guessLetterQuestion = () => {
        return new Promise((resolve, reject) => {
            rl.question('Please enter your guess: ', (guess) => {
                const guessFormatted = guess.toLowerCase()
                const letter = wordToGuess[guess]

                if (!guessFormatted.match(/[a-z]/ig)) {
                    return resolve('Please enter only letters within the alphabet')
                }

                const guessWord = () => {
                    if (guessFormatted === word) {
                        guessed = true
                        return resolve()
                    } else {
                        lives = lives - 1
                        return resolve(`The word was not ${guess}, you have ${lives} lives left.`)
                    }
                }

                const guessLetter = () => {
                    if (guessedLetters.has(guessFormatted)) {
                        return resolve(`You have already guessed letter ${guessFormatted}, [Word: ${displayedLetters.join('')}]`)
                    } else if (!letter) {
                        lives = lives - 1
                        guessedLetters.add(guessFormatted)
                        return resolve(`Letter ${guessFormatted} is not included, you have ${lives} lives left. [Word: ${displayedLetters.join('')}]`)
                    } else {
                        letter.forEach(index => {
                            wordLetters.splice(index, 1)
                            displayedLetters[index] = guessFormatted
                        })
                        guessedLetters.add(guessFormatted)
                        return resolve(`Letter ${guessFormatted} is included. [Word: ${displayedLetters.join('')}]`)
                    }
                }
        
                if (guessFormatted.length !== 1) {
                    guessWord()
                } else {
                    guessLetter()
                }
            })
        })
    }

    while (lives > 0 && !guessed) {
        const output = await guessLetterQuestion()
        if (output) console.log(output)
    }

    if (lives === 0) {
        console.log('Sorry you lost')
    } else {
        console.log(`You have guessed right! The word was ${word}`)
    }

}

hangman()