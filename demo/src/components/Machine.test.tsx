import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Machine from './Machine';

function renderMachine(overrides: Partial<Parameters<typeof Machine>[0]> = {}) {
	const onKeyPress = vi.fn();

	const onPlugboardChange = vi.fn();

	render(
		<Machine
			rotorPositions={['A', 'B', 'C']}
			rotorIds={['I', 'II', 'III']}
			litLetter={null}
			pressedLetter={null}
			onKeyPress={onKeyPress}
			plugboardPairs={[]}
			onPlugboardChange={onPlugboardChange}
			{...overrides}
		/>,
	);

	return { onKeyPress, onPlugboardChange };
}

describe('Machine', () => {
	test('renders every component of the machine', () => {
		renderMachine();

		expect(screen.getByTestId('plugboard')).toBeInTheDocument();
		expect(screen.getByTestId('entry-wheel')).toBeInTheDocument();
		expect(screen.getByTestId('rotor-0')).toBeInTheDocument();
		expect(screen.getByTestId('rotor-1')).toBeInTheDocument();
		expect(screen.getByTestId('rotor-2')).toBeInTheDocument();
		expect(screen.getByTestId('reflector')).toBeInTheDocument();
		expect(screen.getByTestId('lampboard')).toBeInTheDocument();
		expect(screen.getByTestId('keyboard')).toBeInTheDocument();
	});

	test('shows each rotor position in its window', () => {
		renderMachine({ rotorPositions: ['A', 'B', 'C'] });

		expect(screen.getByTestId('rotor-0')).toHaveTextContent('A');
		expect(screen.getByTestId('rotor-1')).toHaveTextContent('B');
		expect(screen.getByTestId('rotor-2')).toHaveTextContent('C');
	});

	test('highlights only the specified rotor', () => {
		renderMachine({ highlightedComponent: { component: 'rotor', index: 1 } });

		expect(screen.getByTestId('rotor-1').getAttribute('class')).toContain('rotor--highlighted');
		expect(screen.getByTestId('rotor-0').getAttribute('class')).not.toContain(
			'rotor--highlighted',
		);
	});

	test('lights exactly the lamp for the enciphered letter', () => {
		renderMachine({ litLetter: 'Q' });

		expect(screen.getByTestId('lamp-Q').getAttribute('class')).toContain('lamp--lit');
		expect(screen.getByTestId('lamp-A').getAttribute('class')).not.toContain('lamp--lit');
	});

	test('clicking a key enciphers that letter', () => {
		const { onKeyPress } = renderMachine();

		fireEvent.click(screen.getByTestId('key-G'));

		expect(onKeyPress).toHaveBeenCalledWith('G');
	});

	test('clicking two plugboard sockets patches a cable between them', () => {
		const { onPlugboardChange } = renderMachine();

		fireEvent.click(screen.getByTestId('socket-A'));
		fireEvent.click(screen.getByTestId('socket-B'));

		expect(onPlugboardChange).toHaveBeenCalledWith([['A', 'B']]);
	});

	test('clicking a cabled socket pulls that cable out', () => {
		const { onPlugboardChange } = renderMachine({ plugboardPairs: [['A', 'B']] });

		fireEvent.click(screen.getByTestId('socket-A'));

		expect(onPlugboardChange).toHaveBeenCalledWith([]);
	});
});
