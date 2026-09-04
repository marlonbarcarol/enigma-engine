interface RotorProps {
	index: number;
	position: string; // current letter, e.g. 'A'
	highlighted?: boolean;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function Rotor({ index, position, highlighted }: RotorProps) {
	const rotationDegrees = (ALPHABET.indexOf(position) / ALPHABET.length) * 360;

	return (
		<g
			data-testid={`rotor-${index}`}
			className={highlighted ? 'rotor rotor--highlighted' : 'rotor'}
			transform={`translate(${60 + index * 90}, 100)`}
		>
			<circle r="38" className="rotor__body" />
			<circle r="30" className="rotor__inner" />
			<g className="rotor__dial" style={{ transform: `rotate(${rotationDegrees}deg)` }}>
				{Array.from({ length: 26 }, (_, tick) => {
					const angle = (tick / 26) * 2 * Math.PI;
					const x1 = Math.sin(angle) * 30;
					const y1 = -Math.cos(angle) * 30;
					const x2 = Math.sin(angle) * 34;
					const y2 = -Math.cos(angle) * 34;
					return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} className="rotor__tick" />;
				})}
			</g>
			<text className="rotor__letter" textAnchor="middle" dy="6">
				{position}
			</text>
		</g>
	);
}

export default Rotor;
