import { CipherTraceStep } from '@enigmaciphy/engine';
import { useState } from 'react';
import DebugPanel from './components/DebugPanel';
import Explainer from './components/Explainer';
import LibraryGuide from './components/LibraryGuide';
import Machine, { HighlightedComponent } from './components/Machine';
import './components/Machine.css';
import Settings from './components/Settings';
import { useCipher } from './hooks/useCipher';

function App() {
	const {
		message,
		setMessage,
		pressKey,
		reset,
		ciphertext,
		skippedCount,
		rotorPositions,
		lastInput,
		lastOutput,
		lastTrace,
		debugMode,
		setDebugMode,
		settings,
		setSettings,
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
					Type on the right, or click the keys. The rotors step and a lamp lights for each letter.
				</p>
				<p className="app__byline">
					Powered by{' '}
					<a
						className="app__byline-link"
						data-testid="npm-link"
						href="https://www.npmjs.com/package/@enigmaciphy/engine"
						target="_blank"
						rel="noreferrer"
					>
						<code>@enigmaciphy/engine</code>
					</a>
					, an open-source TypeScript implementation of the Enigma cipher.
				</p>
				<nav className="app__nav">
					<a className="app__nav-link" href="#how-it-works">
						How it works
					</a>
					<a className="app__nav-link" href="#library">
						Using the library
					</a>
				</nav>
			</header>

			<div className="app__columns">
				<div className="app__machine">
					<Machine
						rotorPositions={rotorPositions}
						rotorIds={settings.rotorIds}
						highlightedComponent={highlightedComponent}
						litLetter={lastOutput}
						pressedLetter={lastInput}
						onKeyPress={pressKey}
						plugboardPairs={settings.plugboardPairs}
						onPlugboardChange={(plugboardPairs) => setSettings({ ...settings, plugboardPairs })}
					/>
				</div>

				<aside className="app__console">
					<section className="console__block">
						<div className="console__row">
							<label className="console__label" htmlFor="plaintext">
								Message
							</label>
							<button
								type="button"
								data-testid="reset"
								className="console__reset"
								onClick={reset}
								disabled={message.length === 0}
							>
								Reset
							</button>
						</div>
						<textarea
							id="plaintext"
							data-testid="plaintext-input"
							className="console__textarea"
							rows={3}
							placeholder="Type a message…"
							value={message}
							onChange={(event) => setMessage(event.target.value)}
						/>
					</section>

					<section className="console__block">
						<span className="console__label">Ciphertext</span>
						<output data-testid="ciphertext-output" className="console__ciphertext">
							{ciphertext}
						</output>
						<span className="console__skipped">
							Skipped characters: <span data-testid="skipped-count">{skippedCount}</span>
						</span>
					</section>

					<Settings settings={settings} onChange={setSettings} />

					<section className="console__block">
						<label className="console__toggle">
							<input
								type="checkbox"
								checked={debugMode}
								onChange={(event) => setDebugMode(event.target.checked)}
								data-testid="debug-toggle"
							/>
							Debug mode: trace the last keypress through the machine
						</label>

						{debugMode && <DebugPanel trace={lastTrace} onStepChange={handleStepChange} />}
					</section>
				</aside>
			</div>

			<Explainer />

			<LibraryGuide />

			<footer className="app__footer">
				<span>
					Built on <code>@enigmaciphy/engine</code>
				</span>
				<span className="app__footer-links">
					<a
						className="prose__link"
						href="https://github.com/marlonbarcarol/enigma-engine"
						target="_blank"
						rel="noreferrer"
					>
						GitHub
					</a>
					<a
						className="prose__link"
						href="https://www.npmjs.com/package/@enigmaciphy/engine"
						target="_blank"
						rel="noreferrer"
					>
						npm
					</a>
				</span>
			</footer>
		</main>
	);
}

export default App;
