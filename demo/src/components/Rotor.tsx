interface RotorProps {
	index: number;
	/** The mounted rotor's designation, e.g. 'III'. */
	name: string;
	position: string; // current letter showing in the window, e.g. 'A'
	highlighted?: boolean;
}

/**
 * A rotor as the operator sees it: only the current letter shows through a
 * small window in the lid, with the ridged thumbwheel below it for setting the
 * position by hand.
 */
function Rotor({ index, name, position, highlighted }: RotorProps) {
	return (
		<div
			data-testid={`rotor-${index}`}
			className={highlighted ? 'rotor rotor--highlighted' : 'rotor'}
		>
			<span className="rotor__label">{name}</span>

			<div className="rotor__window">
				<span className="rotor__letter">{position}</span>
			</div>

			<div className="rotor__thumbwheel" aria-hidden="true">
				{Array.from({ length: 9 }, (_, ridge) => (
					<span key={ridge} className="rotor__ridge" />
				))}
			</div>
		</div>
	);
}

export default Rotor;
