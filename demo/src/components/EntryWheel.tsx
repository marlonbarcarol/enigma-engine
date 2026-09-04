interface EntryWheelProps {
	highlighted?: boolean;
}

function EntryWheel({ highlighted }: EntryWheelProps) {
	return (
		<g
			data-testid="entry-wheel"
			className={highlighted ? 'entry-wheel entry-wheel--highlighted' : 'entry-wheel'}
			transform="translate(20, 100)"
		>
			<circle r="20" className="entry-wheel__body" />
		</g>
	);
}

export default EntryWheel;
