import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import DebugPanel from './DebugPanel';
import { CipherTraceStep } from '@enigmaciphy/engine';

const sampleTrace: CipherTraceStep[] = [
	{ component: 'plugboard', direction: 'in', input: 'N', output: 'N' },
	{ component: 'entry', direction: 'in', input: 'N', output: 'N' },
	{ component: 'reflector', input: 'N', output: 'P' },
];

// Must match DebugPanel.tsx's STEP_DELAY_MS constant.
const STEP_DELAY_MS = 400;

describe('DebugPanel', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	test('renders one row per trace step', () => {
		render(<DebugPanel trace={sampleTrace} />);

		expect(screen.getAllByTestId('trace-step')).toHaveLength(3);
	});

	test('renders nothing when there is no trace yet', () => {
		render(<DebugPanel trace={null} />);

		expect(screen.queryAllByTestId('trace-step')).toHaveLength(0);
	});

	test('plays back through the trace, calling onStepChange for each step in order', () => {
		vi.useFakeTimers();
		const onStepChange = vi.fn();

		render(<DebugPanel trace={sampleTrace} onStepChange={onStepChange} />);

		// The first step fires synchronously when the trace is set.
		expect(onStepChange).toHaveBeenCalledTimes(1);
		expect(onStepChange).toHaveBeenNthCalledWith(1, sampleTrace[0]);

		act(() => {
			vi.advanceTimersByTime(STEP_DELAY_MS);
		});
		expect(onStepChange).toHaveBeenCalledTimes(2);
		expect(onStepChange).toHaveBeenNthCalledWith(2, sampleTrace[1]);

		act(() => {
			vi.advanceTimersByTime(STEP_DELAY_MS);
		});
		expect(onStepChange).toHaveBeenCalledTimes(3);
		expect(onStepChange).toHaveBeenNthCalledWith(3, sampleTrace[2]);

		// No further steps to play; onStepChange should not be called again.
		act(() => {
			vi.advanceTimersByTime(STEP_DELAY_MS);
		});
		expect(onStepChange).toHaveBeenCalledTimes(3);
	});

	test('highlights the active step with the trace-step--active class as playback advances', () => {
		vi.useFakeTimers();

		render(<DebugPanel trace={sampleTrace} />);

		const steps = screen.getAllByTestId('trace-step');

		expect(steps[0]).toHaveClass('trace-step--active');
		expect(steps[1]).not.toHaveClass('trace-step--active');
		expect(steps[2]).not.toHaveClass('trace-step--active');

		act(() => {
			vi.advanceTimersByTime(STEP_DELAY_MS);
		});
		expect(steps[0]).not.toHaveClass('trace-step--active');
		expect(steps[1]).toHaveClass('trace-step--active');
		expect(steps[2]).not.toHaveClass('trace-step--active');

		act(() => {
			vi.advanceTimersByTime(STEP_DELAY_MS);
		});
		expect(steps[0]).not.toHaveClass('trace-step--active');
		expect(steps[1]).not.toHaveClass('trace-step--active');
		expect(steps[2]).toHaveClass('trace-step--active');
	});
});
