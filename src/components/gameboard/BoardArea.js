import React, { useState, useEffect } from 'react';
import { NUM_GUESSES, WORD_LENGTH } from '../../constants/settings';
import { WORDLIST } from '../../constants/wordlist';
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LetterBox from './LetterBox.js';
import { Keyboard } from '../keyboard/Keyboard';

const BoardArea = ({ setFinalWord, finalWord }) => {
  // TODO: What if we used a single matrix to track squares, and properties associated with each square?  I.e. combine squares array and colors array
  const [squares, setSquares] = useState(
    Array.from({ length: NUM_GUESSES }, (value, index) =>
      Array.from({ length: WORD_LENGTH }, (value1, index1) => ''),
    ),
  );
  const [squareColors, setSquareColors] = useState(
    Array.from({ length: NUM_GUESSES }, (value, index) =>
      Array.from({ length: WORD_LENGTH }, (value1, index1) => 'gray'),
    ),
  );
  const [currSquare, setCurrSquare] = useState([0, 0]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const resetBoard = () => {
    const newSquares = Array.from({ length: NUM_GUESSES }, (value, index) =>
      Array.from({ length: WORD_LENGTH }, (value1, index1) => ''),
    );
    const newSquareColors = Array.from({ length: NUM_GUESSES }, (value, index) =>
      Array.from({ length: WORD_LENGTH }, (value1, index1) => 'gray'),
    );
    const newCurrSquare = [0, 0];
    setSquares(() => newSquares);
    setSquareColors(() => newSquareColors);
    setCurrSquare(() => newCurrSquare);
    setFinalWord();
  };

  useEffect(() => {
    const deepClone = (items) =>
      items.map((item) => (Array.isArray(item) ? deepClone(item) : item));

    document.addEventListener('keydown', handleKeyDown);

    function handleKeyDown({ key }) {
      let newSquares = deepClone(squares);
      let newSquareColors = deepClone(squareColors);
      let newCurrSquare = deepClone(currSquare);
      let usedWord = false;
      console.log(key);

      switch (true) {
        case /^[A-Za-z]{1}$/g.test(key):
          key = key.toUpperCase();
          if (newCurrSquare[1] < squares[0].length) {
            newSquares[newCurrSquare[0]][newCurrSquare[1]] = key;
            newCurrSquare[1]++;
            setSquares(() => newSquares);
            setCurrSquare(() => newCurrSquare);
          }
          break;

        case key === 'Backspace' || key === 'Delete':
          if (newCurrSquare[1] === newSquares[0].length) {
            for (let idx in newSquareColors[newCurrSquare[0]]) {
              newSquareColors[newCurrSquare[0]][idx] = 'grey';
            }
            setSquareColors(() => newSquareColors);
          }
          if (newCurrSquare[1] !== 0) {
            newSquares[newCurrSquare[0]][newCurrSquare[1] - 1] = '';
            newCurrSquare[1]--;
            setSquares(() => newSquares);
            setCurrSquare(() => newCurrSquare);
          } else {
            console.log('hi, Cameron is right');
          }
          break;

        case (key === 'Enter' || key === 'Return') && currSquare[1] === squares[0].length:
          const currGuess = newSquares[newCurrSquare[0]].join('');

          //Check if guess has already been made
          for (let idx = 0; idx < currSquare[0]; idx++) {
            const wordJoin = newSquares[idx].join('');
            console.log(wordJoin, currGuess);
            if (wordJoin === currGuess) {
              usedWord = true;
            }
          }

          // Check word against WORDLIST, turn row red if not in list
          if (!WORDLIST.includes(currGuess.toLowerCase())) {
            console.error('That word is not in our word list');
            for (let idx in newSquareColors[newCurrSquare[0]]) {
              newSquareColors[newCurrSquare[0]][idx] = 'red';
            }
            setSquareColors(() => newSquareColors);
          } else if (usedWord) {
            console.log('You already guessed that word, dodo brain!');
            for (let idx in newSquareColors[newCurrSquare[0]]) {
              newSquareColors[newCurrSquare[0]][idx] = 'red';
            }
            setSquareColors(() => newSquareColors);
          } else {
            // Cache letter frequency in finalWord
            const finalWordLetterCache = {};
            finalWord.split('').forEach((value, index) => {
              if (!Object.prototype.hasOwnProperty.call(finalWordLetterCache, value))
                finalWordLetterCache[value] = 1;
              else {
                finalWordLetterCache[value]++;
              }
            });

            // Letter matches location, turn green
            newSquares[newCurrSquare[0]].forEach((square, squareIndex) => {
              if (
                Object.prototype.hasOwnProperty.call(finalWordLetterCache, square)
                && square === finalWord[squareIndex]
              ) {
                newSquareColors[newCurrSquare[0]][squareIndex] = 'green';
                finalWordLetterCache[square]--;
                // setSquareColors(() => newSquareColors);
              }
            });

            // Letter matches, but not location, turn yellow
            newSquares[newCurrSquare[0]].forEach((square, squareIndex) => {
              if (
                Object.prototype.hasOwnProperty.call(finalWordLetterCache, square)
                && finalWordLetterCache[square] > 0
                && newSquareColors[newCurrSquare[0]][squareIndex] !== 'green'
              ) {
                newSquareColors[newCurrSquare[0]][squareIndex] = 'yellow';
                finalWordLetterCache[square]--;
              }
            });

            setSquareColors(() => newSquareColors);

            //check to see if the row matches the final word
            if (currGuess === finalWord) {
              console.log(
                currGuess,
                '⭐You are a wizard.  You are a winner.  Here is 1 buttcoin⭐',
              );
              setWon(true);
              setGameOver(() => true);
            } else if (newCurrSquare[0] >= squares.length - 1) {
              console.log('This is what you are: loser LOSER loser');
              setWon(false);
              setGameOver(() => true);
            } else {
              newCurrSquare[0]++;
              newCurrSquare[1] = 0;
              setSquares(() => newSquares);
              setCurrSquare(() => newCurrSquare);
            }
          }
          break;
        default:
          console.log("Key down event didn't match");
      }
    }

    // clear event listener
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [finalWord, setFinalWord, currSquare, squares, squareColors]);

  const renderSquare = (char, key, color) => {
    return <LetterBox key={key} char={char} color={color} />;
  };

  return (
    <>
      <Dialog
        open={gameOver}
        onClose={() => {
          resetBoard();
          setGameOver(false);
        }}
      >
        <DialogTitle>{won ? 'You won! 🎈' : 'You lost! 🤢😔🤢'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {won
              ? `You guessed the word in ${currSquare[0] + 1} guess${
                  currSquare[0] === 0 ? '' : 'es'
                }!`
              : 'Your caboose is loose.'}
          </DialogContentText>
          <Button
            onClick={() => {
              resetBoard();
              setGameOver(false);
            }}
          >
            Start a new Game!
          </Button>
        </DialogContent>
      </Dialog>

      <div className="board-area">
        {/* <div>{finalWord}</div> */}
        {squares.map((rowArray, rowIndex) => {
          return (
            <div className="word-row" key={rowIndex}>
              {rowArray.map((char, colIndex) => {
                const key = rowIndex.toString() + colIndex.toString();
                return renderSquare(char, key, squareColors[rowIndex][colIndex]);
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BoardArea;