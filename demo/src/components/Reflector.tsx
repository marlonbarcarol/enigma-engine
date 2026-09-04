interface ReflectorProps {
	highlighted?: boolean;
}

/**
 * The reflector (Umkehrwalze) sits fixed at the left end of the rotor stack.
 * It never turns, so it shows a label rather than a position window.
 */
function Reflector({ highlighted }: ReflectorProps) {
	return (
		<div
			data-testid="reflector"
			className={highlighted ? 'reflector reflector--highlighted' : 'reflector'}
			title="Reflector (Umkehrwalze). Fixed, does not rotate"
		>
			<span className="fixed-wheel__abbr">UKW</span>
			<svg className="reflector__wiring" viewBox="0 0 40 28" aria-hidden="true">
				<path d="M 6 6 Q 20 20 34 8" />
				<path d="M 6 14 Q 20 2 34 20" />
				<path d="M 6 22 Q 20 12 34 14" />
			</svg>
			<span className="fixed-wheel__name">Reflector</span>
		</div>
	);
}

export default Reflector;
