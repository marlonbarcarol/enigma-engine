import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Machine from './Machine';

describe('Machine', () => {
	test('renders every component of the machine', () => {
		render(<Machine rotorPositions={['A', 'B', 'C']} />);

		expect(screen.getByTestId('plugboard')).toBeInTheDocument();
		expect(screen.getByTestId('entry-wheel')).toBeInTheDocument();
		expect(screen.getByTestId('rotor-0')).toBeInTheDocument();
		expect(screen.getByTestId('rotor-1')).toBeInTheDocument();
		expect(screen.getByTestId('rotor-2')).toBeInTheDocument();
		expect(screen.getByTestId('reflector')).toBeInTheDocument();
	});

	test('highlights only the specified rotor', () => {
		render(
			<Machine
				rotorPositions={['A', 'B', 'C']}
				highlightedComponent={{ component: 'rotor', index: 1 }}
			/>,
		);

		expect(screen.getByTestId('rotor-1').getAttribute('class')).toContain('rotor--highlighted');
		expect(screen.getByTestId('rotor-0').getAttribute('class')).not.toContain(
			'rotor--highlighted',
		);
	});
});
