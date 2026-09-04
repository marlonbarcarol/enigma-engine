interface PlugboardProps {
	highlighted?: boolean;
}

function Plugboard({ highlighted }: PlugboardProps) {
	return (
		<g
			data-testid="plugboard"
			className={highlighted ? 'plugboard plugboard--highlighted' : 'plugboard'}
			transform="translate(60, 220)"
		>
			<rect x="-50" y="-20" width="220" height="40" rx="6" className="plugboard__body" />
			{Array.from({ length: 6 }, (_, socket) => (
				<circle key={socket} cx={-30 + socket * 40} cy="0" r="6" className="plugboard__socket" />
			))}
		</g>
	);
}

export default Plugboard;
