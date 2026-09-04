import { QWERTZ_ROWS } from '../config';

interface LampboardProps {
	/** The enciphered letter currently lit, or null when nothing has been typed. */
	litLetter: string | null;
}

/**
 * The Glühlampenfeld: 26 bulbs behind lettered discs. Exactly one lights per
 * keypress, showing the enciphered letter.
 */
function Lampboard({ litLetter }: LampboardProps) {
	return (
		<section data-testid="lampboard" className="lampboard">
			<div className="lampboard__rows">
				{QWERTZ_ROWS.map((row, rowIndex) => (
					<div className="lampboard__row" key={rowIndex}>
						{row.map((letter) => (
							<span
								key={letter}
								data-testid={`lamp-${letter}`}
								className={letter === litLetter ? 'lamp lamp--lit' : 'lamp'}
							>
								{letter}
							</span>
						))}
					</div>
				))}
			</div>
		</section>
	);
}

export default Lampboard;
