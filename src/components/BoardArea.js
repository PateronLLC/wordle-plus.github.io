import React, { useState, useEffect } from 'react';
import LetterBox from './LetterBox.js';

const BoardArea = (props) => {
	const [gameBoard, setGameBoard] = useState({
		squares: [
			Array(6).fill(''),
			Array(6).fill(''),
			Array(6).fill(''),
			Array(6).fill(''),
			Array(6).fill(''),
			Array(6).fill(''),
			Array(6).fill(''),
		],
		currentSquare: [0, 0],
		finalWord: props.finalWord,
	});

	console.log('finalword in boardarea ', props.finalWord);
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		console.log('finalword in useEffect ', gameBoard.finalWord);

		function handleKeyDown({ key }) {
			setGameBoard((state) => {
				let newSquares = state.squares.slice();
				let newCurrSquare = state.currentSquare.slice();
				let newFinalWord = state.finalWord;
				console.log(key);

				if (key.match(/^[A-Za-z]{1}$/g)) {
					if (newCurrSquare[1] < 6) {
						newSquares[newCurrSquare[0]][newCurrSquare[1]] = key;
						newCurrSquare[1]++;
					}
				} else if (key.match('Backspace' || 'Delete')) {
					if (newCurrSquare[1] !== 0) {
						newSquares[newCurrSquare[0]][newCurrSquare[1] - 1] = '';
						newCurrSquare[1]--;
					} else {
						console.log('hi, Cameron is right');
					}
				} else if (key.match('Enter' || 'Return') && newCurrSquare[1] === 6) {
					console.log(newCurrSquare[0]);
					//	TODO - TEST IF ENDERED WORD MATCHES THE MAGIC WORD
					const rowWord = newSquares[newCurrSquare[0]].join('');
					console.log(newFinalWord);
					if (rowWord === newFinalWord) {
						console.log(
							rowWord,
							'You are a wizard.  You are a winner.  Here is 1 buttcoin'
						);
					}
					if (newCurrSquare[0] >= 6) {
						console.log('loser LOSER loser');

						newSquares = [
							Array(6).fill(''),
							Array(6).fill(''),
							Array(6).fill(''),
							Array(6).fill(''),
							Array(6).fill(''),
							Array(6).fill(''),
							Array(6).fill(''),
						];
						newCurrSquare = [0, 0];
					} else {
						newCurrSquare[0]++;
						newCurrSquare[1] = 0;
					}
				}

				return {
					squares: newSquares,
					currentSquare: newCurrSquare,
				};
			});
		}
	}, [gameBoard.finalWord]);

	useEffect(() => {}, []);

	const renderSquare = (char, key) => {
		return <LetterBox key={key} char={char} />;
	};

	return (
		<div className="board-area">
			<div>{props.finalWord}</div>
			{gameBoard.squares.map((rowArray, rowIndex) => {
				return (
					<div className="word-row" key={rowIndex}>
						{gameBoard.squares[rowIndex].map((char, col) => {
							const key = rowIndex.toString() + col.toString();
							return renderSquare(char, key);
						})}
					</div>
				);
			})}
		</div>
	);
};

export default BoardArea;
