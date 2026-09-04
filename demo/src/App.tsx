import Machine from './components/Machine';
import './components/Machine.css';
import Keyboard from './components/Keyboard';
import { useCipher } from './hooks/useCipher';

function App() {
	const { ciphertext, skippedCount, rotorPositions, pressKey, debugMode, setDebugMode } =
		useCipher();

	return (
		<main data-testid="app">
			<h1>Enigma Visualizer</h1>

			<Machine rotorPositions={rotorPositions} />

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
