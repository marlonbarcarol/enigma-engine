import { CipherTraceStep } from '@enigmaciphy/engine';
import { useState } from 'react';
import DebugPanel from './components/DebugPanel';
import Keyboard from './components/Keyboard';
import Machine, { HighlightedComponent } from './components/Machine';
import './components/Machine.css';
import { useCipher } from './hooks/useCipher';

function App() {
	const {
		ciphertext,
		skippedCount,
		rotorPositions,
		pressKey,
		debugMode,
		setDebugMode,
		lastTrace,
		lastInput,
		lastOutput,
	} = useCipher();
	const [highlightedComponent, setHighlightedComponent] = useState<HighlightedComponent | null>(
		null,
	);

	function handleStepChange(step: CipherTraceStep | null) {
		setHighlightedComponent(step ? { component: step.component, index: step.index } : null);
	}

	return (
		<main data-testid="app" className="app">
			<header className="app__header">
				<h1 className="app__title">Enigma Machine</h1>
				<p className="app__subtitle">
					Type below or click the keys — watch the rotors step and the lamp light up.
				</p>
			</header>

			<Machine
				rotorPositions={rotorPositions}
				highlightedComponent={highlightedComponent}
				litLetter={lastOutput}
				pressedLetter={lastInput}
				onKeyPress={pressKey}
			/>

			<section className="console">
				<div className="console__input">
					<label className="console__label" htmlFor="plaintext">
						Message
					</label>
					<Keyboard onKeyPress={pressKey} />
				</div>

				<div className="console__readout">
					<span className="console__label">Ciphertext</span>
					<output data-testid="ciphertext-output" className="console__ciphertext">
						{ciphertext}
					</output>
				</div>

				<div className="console__meta">
					<label className="console__toggle">
						<input
							type="checkbox"
							checked={debugMode}
							onChange={(event) => setDebugMode(event.target.checked)}
							data-testid="debug-toggle"
						/>
						Debug mode — trace each keypress through the machine
					</label>
					<span className="console__skipped">
						Skipped characters: <span data-testid="skipped-count">{skippedCount}</span>
					</span>
				</div>

				{debugMode && (
					<div className="console__trace">
						<span className="console__label">Signal path</span>
						<DebugPanel trace={lastTrace} onStepChange={handleStepChange} />
					</div>
				)}
			</section>
		</main>
	);
}

export default App;
