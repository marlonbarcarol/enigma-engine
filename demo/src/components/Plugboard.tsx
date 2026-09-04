import { PLUGBOARD_PAIRS, PLUGGED_LETTERS, QWERTZ_ROWS } from '../config';

interface PlugboardProps {
	highlighted?: boolean;
}

/**
 * The Steckerbrett on the front of the machine: a double socket per letter,
 * with patch cables swapping the pairs configured in the wiring.
 */
function Plugboard({ highlighted }: PlugboardProps) {
	return (
		<section
			data-testid="plugboard"
			className={highlighted ? 'plugboard plugboard--highlighted' : 'plugboard'}
		>
			<header className="panel__header">
				<h2 className="panel__title">Steckerbrett — Plugboard</h2>
				<p className="panel__hint">Swaps letter pairs before and after the rotors</p>
			</header>

			<div className="plugboard__sockets">
				{QWERTZ_ROWS.map((row, rowIndex) => (
					<div className="plugboard__row" key={rowIndex}>
						{row.map((letter) => (
							<div
								className={
									PLUGGED_LETTERS.has(letter)
										? 'plugboard__socket plugboard__socket--plugged'
										: 'plugboard__socket'
								}
								key={letter}
							>
								<span className="plugboard__letter">{letter}</span>
								<span className="plugboard__holes" aria-hidden="true">
									<span className="plugboard__hole" />
									<span className="plugboard__hole" />
								</span>
							</div>
						))}
					</div>
				))}
			</div>

			<p className="plugboard__cables">
				<span className="plugboard__cables-label">Cables:</span>
				{PLUGBOARD_PAIRS.map(([from, to]) => (
					<span className="plugboard__cable" key={`${from}${to}`}>
						{from}&#8202;–&#8202;{to}
					</span>
				))}
			</p>
		</section>
	);
}

export default Plugboard;
