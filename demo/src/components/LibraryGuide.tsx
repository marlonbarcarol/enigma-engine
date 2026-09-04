const PACKAGE = '@enigmaciphy/engine';
const REPO_URL = 'https://github.com/marlonbarcarol/enigma-engine';
const NPM_URL = 'https://www.npmjs.com/package/@enigmaciphy/engine';

const QUICKSTART = `import { Cipher, CipherOptions } from '${PACKAGE}';

const configuration: CipherOptions = {
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  plugboard: { wiring: 'AQRIJFHGDEWLTNSXBCOMZVKPYU' },
  entry: { wiring: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  rotors: [
    { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notches: ['Q'], ring: 'A' },
    { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notches: ['E'], ring: 'A' },
    { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notches: ['V'], ring: 'A' },
  ],
  reflector: { wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT' },
};

const cipher = Cipher.create(configuration);

cipher.encrypt('HELLO WORLD');`;

const TRACE_SNIPPET = `const cipher = Cipher.create(configuration);
const { output, trace } = cipher.encryptWithTrace('A');

// output -> the enciphered letter
// trace  -> every stage the signal passed through, in order:
//           plugboard, entry, rotors, reflector, rotors, entry, plugboard`;

/**
 * A short pointer to the library this page is built on. Deliberately a
 * quickstart rather than full API docs. The README is the canonical
 * reference, and duplicating the whole surface here would only drift.
 */
function LibraryGuide() {
	return (
		<section data-testid="library-guide" className="prose" id="library">
			<h2 className="prose__title">Using the library</h2>

			<p>
				This page is a demonstration of <code>{PACKAGE}</code>, an open-source TypeScript
				implementation of the Enigma cipher. Everything the machine above does is the library doing
				the work. There is no separate implementation behind the UI.
			</p>

			<h3 className="prose__subtitle">Install</h3>

			<pre className="prose__code">
				<code>npm install {PACKAGE}</code>
			</pre>

			<h3 className="prose__subtitle">Encrypting and decrypting</h3>

			<p>
				Configure a machine, then call <code>encrypt()</code>. Because the cipher is its own
				inverse, decrypting is the same call on a freshly-created machine with identical settings.
				There is no separate decrypt method.
			</p>

			<pre className="prose__code">
				<code>{QUICKSTART}</code>
			</pre>

			<p className="prose__note">
				Rotor position is stateful: each character advances the machine. Create a new{' '}
				<code>Cipher</code> when you want to start again from the configured position, exactly as an
				operator would wind the rotors back.
			</p>

			<h3 className="prose__subtitle">Tracing the signal path</h3>

			<p>
				<code>encryptWithTrace()</code> enciphers a single character and additionally returns every
				stage it passed through. It's what powers the debug mode above.
			</p>

			<pre className="prose__code">
				<code>{TRACE_SNIPPET}</code>
			</pre>

			<h3 className="prose__subtitle">Full documentation</h3>

			<p>
				The README covers the configuration options in full: rotor wirings and notches, ring
				settings, the reflector, the plugboard, character grouping, and the errors thrown for
				invalid configurations.
			</p>

			<p className="prose__links">
				<a className="prose__link" href={REPO_URL} target="_blank" rel="noreferrer">
					Documentation on GitHub
				</a>
				<a className="prose__link" href={NPM_URL} target="_blank" rel="noreferrer">
					Package on npm
				</a>
			</p>
		</section>
	);
}

export default LibraryGuide;
