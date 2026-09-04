import Keys from './Keys';
import Lampboard from './Lampboard';
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
	litLetter: string | null;
	pressedLetter: string | null;
	onKeyPress: (letter: string) => void;
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

/**
 * The machine in its case, laid out as the operator sees it with the lid open:
 * rotors at the top, then the lampboard, the keyboard, and the plugboard at the
 * front.
 */
function Machine({
	rotorPositions,
	highlightedComponent,
	litLetter,
	pressedLetter,
	onKeyPress,
}: MachineProps) {
	return (
		<div data-testid="machine" className="machine" role="img" aria-label="Enigma machine">
			<div className="machine__lid">
				<span className="machine__badge">Enigma</span>

				<div className="machine__rotors">
					<Reflector highlighted={isHighlighted(highlightedComponent, 'reflector')} />

					{rotorPositions.map((position, index) => (
						<Rotor
							key={index}
							index={index}
							position={position}
							highlighted={isHighlighted(highlightedComponent, 'rotor', index)}
						/>
					))}

					<div
						data-testid="entry-wheel"
						className={
							isHighlighted(highlightedComponent, 'entry')
								? 'entry-wheel entry-wheel--highlighted'
								: 'entry-wheel'
						}
						title="Entry wheel (Eintrittswalze) — connects the plugboard to the rotor stack"
					>
						<span className="entry-wheel__label">ETW</span>
					</div>
				</div>
			</div>

			<Lampboard litLetter={litLetter} />

			<Keys onKeyPress={onKeyPress} pressedLetter={pressedLetter} />

			<Plugboard highlighted={isHighlighted(highlightedComponent, 'plugboard')} />
		</div>
	);
}

export default Machine;
