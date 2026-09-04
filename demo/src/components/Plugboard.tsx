import { useState } from 'react';
import { pluggedLetters, QWERTZ_ROWS } from '../config';

interface PlugboardProps {
	pairs: [string, string][];
	onChange: (pairs: [string, string][]) => void;
	highlighted?: boolean;
}

/**
 * The Steckerbrett on the front of the machine: a double socket per letter.
 * Click two letters to patch a cable between them, or click a patched letter to
 * pull its cable out.
 */
function Plugboard({ pairs, onChange, highlighted }: PlugboardProps) {
	const [pendingLetter, setPendingLetter] = useState<string | null>(null);
	const plugged = pluggedLetters(pairs);

	function handleSocketClick(letter: string) {
		// Clicking a cabled letter pulls that cable out.
		if (plugged.has(letter)) {
			onChange(pairs.filter(([from, to]) => from !== letter && to !== letter));
			setPendingLetter(null);
			return;
		}

		if (pendingLetter === null) {
			setPendingLetter(letter);
			return;
		}

		if (pendingLetter === letter) {
			setPendingLetter(null);
			return;
		}

		onChange([...pairs, [pendingLetter, letter]]);
		setPendingLetter(null);
	}

	return (
		<section
			data-testid="plugboard"
			className={highlighted ? 'plugboard plugboard--highlighted' : 'plugboard'}
		>
			<header className="panel__header">
				<h2 className="panel__title">Steckerbrett / Plugboard</h2>
				<p className="panel__hint">
					{pendingLetter
						? `Pick a second letter to pair with ${pendingLetter}`
						: 'Click two letters to patch a cable, or a cabled letter to remove it'}
				</p>
			</header>

			<div className="plugboard__sockets">
				{QWERTZ_ROWS.map((row, rowIndex) => (
					<div className="plugboard__row" key={rowIndex}>
						{row.map((letter) => {
							const classNames = ['plugboard__socket'];

							if (plugged.has(letter)) {
								classNames.push('plugboard__socket--plugged');
							}

							if (pendingLetter === letter) {
								classNames.push('plugboard__socket--pending');
							}

							return (
								<button
									type="button"
									className={classNames.join(' ')}
									key={letter}
									data-testid={`socket-${letter}`}
									onClick={() => handleSocketClick(letter)}
								>
									<span className="plugboard__letter">{letter}</span>
									<span className="plugboard__holes" aria-hidden="true">
										<span className="plugboard__hole" />
										<span className="plugboard__hole" />
									</span>
								</button>
							);
						})}
					</div>
				))}
			</div>

			<p className="plugboard__cables">
				<span className="plugboard__cables-label">Cables:</span>
				{pairs.length === 0 && <span className="plugboard__cable-empty">none</span>}
				{pairs.map(([from, to]) => (
					<span className="plugboard__cable" key={`${from}${to}`}>
						{from}&#8202;–&#8202;{to}
					</span>
				))}
			</p>
		</section>
	);
}

export default Plugboard;
