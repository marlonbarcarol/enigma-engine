import { QWERTZ_ROWS } from '../config';

interface KeysProps {
	onKeyPress: (letter: string) => void;
	/** The key most recently struck, shown depressed. */
	pressedLetter: string | null;
}

/**
 * The Tastatur: 26 mechanical keys. Clicking one enciphers that letter, exactly
 * as striking the key on the real machine does.
 */
function Keys({ onKeyPress, pressedLetter }: KeysProps) {
	return (
		<section data-testid="keyboard" className="keys">
			<div className="keys__rows">
				{QWERTZ_ROWS.map((row, rowIndex) => (
					<div className="keys__row" key={rowIndex}>
						{row.map((letter) => (
							<button
								key={letter}
								type="button"
								data-testid={`key-${letter}`}
								className={letter === pressedLetter ? 'key key--pressed' : 'key'}
								onClick={() => onKeyPress(letter)}
							>
								{letter}
							</button>
						))}
					</div>
				))}
			</div>
		</section>
	);
}

export default Keys;
