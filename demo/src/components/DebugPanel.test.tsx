import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import DebugPanel from './DebugPanel';
import { CipherTraceStep } from '@enigmaciphy/engine';

const sampleTrace: CipherTraceStep[] = [
	{ component: 'plugboard', direction: 'in', input: 'N', output: 'N' },
	{ component: 'entry', direction: 'in', input: 'N', output: 'N' },
	{ component: 'reflector', input: 'N', output: 'P' },
];

describe('DebugPanel', () => {
	test('renders one row per trace step', () => {
		render(<DebugPanel trace={sampleTrace} />);

		expect(screen.getAllByTestId('trace-step')).toHaveLength(3);
	});

	test('renders nothing when there is no trace yet', () => {
		render(<DebugPanel trace={null} />);

		expect(screen.queryAllByTestId('trace-step')).toHaveLength(0);
	});
});
