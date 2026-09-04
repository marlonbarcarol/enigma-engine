interface ReflectorProps {
	highlighted?: boolean;
}

function Reflector({ highlighted }: ReflectorProps) {
	return (
		<g
			data-testid="reflector"
			className={highlighted ? 'reflector reflector--highlighted' : 'reflector'}
			transform="translate(330, 100)"
		>
			<circle r="34" className="reflector__body" />
			<path d="M -20 -10 Q 0 20 20 -10" className="reflector__wiring" />
			<path d="M -20 10 Q 0 -20 20 10" className="reflector__wiring" />
		</g>
	);
}

export default Reflector;
