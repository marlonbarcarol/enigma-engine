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
			<header className="panel__header">
				<h2 className="panel__title">Tastatur — Keyboard</h2>
				<p className="panel__hint">Click a key to encipher that letter</p>
			</header>

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
