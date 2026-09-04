import { useState } from 'react';
import { CipherTraceStep } from '@enigmaciphy/engine';
import Machine, { HighlightedComponent } from './components/Machine';
import './components/Machine.css';
import DebugPanel from './components/DebugPanel';
import Keyboard from './components/Keyboard';
import { useCipher } from './hooks/useCipher';

function App() {
	const { ciphertext, skippedCount, rotorPositions, pressKey, debugMode, setDebugMode, lastTrace } =
		useCipher();
	const [highlightedComponent, setHighlightedComponent] = useState<HighlightedComponent | null>(
		null,
	);

	function handleStepChange(step: CipherTraceStep | null) {
		setHighlightedComponent(step ? { component: step.component, index: step.index } : null);
	}

	return (
		<main data-testid="app">
			<h1>Enigma Visualizer</h1>

			<Machine rotorPositions={rotorPositions} highlightedComponent={highlightedComponent} />

			<label>
				<input
					type="checkbox"
					checked={debugMode}
					onChange={(event) => setDebugMode(event.target.checked)}
					data-testid="debug-toggle"
				/>
				Debug mode
			</label>

			<Keyboard onKeyPress={pressKey} />

			{debugMode && <DebugPanel trace={lastTrace} onStepChange={handleStepChange} />}

			<p>
				Ciphertext: <output data-testid="ciphertext-output">{ciphertext}</output>
			</p>
			<p>
				Skipped characters: <span data-testid="skipped-count">{skippedCount}</span>
			</p>
		</main>
	);
}

export default App;
