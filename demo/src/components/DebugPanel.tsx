import { useEffect, useState } from 'react';
import { CipherTraceStep } from '@enigmaciphy/engine';

interface DebugPanelProps {
	trace: CipherTraceStep[] | null;
	onStepChange?: (step: CipherTraceStep | null) => void;
}

const STEP_DELAY_MS = 400;

function DebugPanel({ trace, onStepChange }: DebugPanelProps) {
	const [activeIndex, setActiveIndex] = useState(-1);

	useEffect(() => {
		if (!trace) {
			setActiveIndex(-1);
			onStepChange?.(null);
			return;
		}

		let cancelled = false;
		let index = 0;

		function playNextStep() {
			if (cancelled || !trace || index >= trace.length) {
				return;
			}

			setActiveIndex(index);
			onStepChange?.(trace[index]);
			index += 1;
			setTimeout(playNextStep, STEP_DELAY_MS);
		}

		playNextStep();

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [trace]);

	if (!trace) {
		return null;
	}

	return (
		<ol className="debug-panel" data-testid="debug-panel">
			{trace.map((step, index) => (
				<li
					key={index}
					data-testid="trace-step"
					className={index === activeIndex ? 'trace-step trace-step--active' : 'trace-step'}
				>
					{step.component}
					{step.direction ? ` (${step.direction})` : ''}
					{step.index !== undefined ? ` #${step.index}` : ''}: {step.input} → {step.output}
					{step.rotorPosition ? ` [pos: ${step.rotorPosition}]` : ''}
				</li>
			))}
		</ol>
	);
}

export default DebugPanel;
