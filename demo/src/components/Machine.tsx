import EntryWheel from './EntryWheel';
import Plugboard from './Plugboard';
import Reflector from './Reflector';
import Rotor from './Rotor';

export interface HighlightedComponent {
	component: 'plugboard' | 'entry' | 'rotor' | 'reflector';
	index?: number;
}

interface MachineProps {
	rotorPositions: string[];
	highlightedComponent?: HighlightedComponent | null;
}

function isHighlighted(
	highlighted: HighlightedComponent | null | undefined,
	component: HighlightedComponent['component'],
	index?: number,
): boolean {
	if (!highlighted || highlighted.component !== component) {
		return false;
	}

	return highlighted.index === undefined || highlighted.index === index;
}

function Machine({ rotorPositions, highlightedComponent }: MachineProps) {
	return (
		<svg data-testid="machine" viewBox="0 0 420 280" role="img" aria-label="Enigma machine">
			<EntryWheel highlighted={isHighlighted(highlightedComponent, 'entry')} />
			{rotorPositions.map((position, index) => (
				<Rotor
					key={index}
					index={index}
					position={position}
					highlighted={isHighlighted(highlightedComponent, 'rotor', index)}
				/>
			))}
			<Reflector highlighted={isHighlighted(highlightedComponent, 'reflector')} />
			<Plugboard highlighted={isHighlighted(highlightedComponent, 'plugboard')} />
		</svg>
	);
}

export default Machine;
