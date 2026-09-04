/**
 * The written companion to the machine above: what the signal actually does,
 * why the cipher is its own inverse, and how much of it is configurable.
 */
function Explainer() {
	return (
		<section data-testid="explainer" className="prose" id="how-it-works">
			<h2 className="prose__title">How the Enigma works</h2>

			<p>
				The Enigma is a substitution cipher, but not a fixed one. Every key you press first
				sends the rotors forward a step, so the wiring the signal travels through is different
				for every single letter. Press <code>A</code> five times and you get five different
				letters out — that constantly-changing substitution is what made it far harder to
				break than a simple cipher alphabet.
			</p>

			<h3 className="prose__subtitle">The path of a single keypress</h3>

			<p>
				Pressing a key closes a circuit, and the current takes a there-and-back journey through
				the machine before lighting exactly one lamp:
			</p>

			<ol className="prose__path">
				<li>
					<strong>Plugboard</strong> (Steckerbrett) — if a cable connects that letter to
					another, they swap.
				</li>
				<li>
					<strong>Entry wheel</strong> (ETW) — the fixed doorway into the rotors. On the Army
					machine it's wired straight through, so the letter passes unchanged.
				</li>
				<li>
					<strong>The rotors</strong>, right to left — each one substitutes the letter again,
					offset by however far it has turned.
				</li>
				<li>
					<strong>Reflector</strong> (UKW) — pairs the letter with another and sends the
					current back.
				</li>
				<li>
					<strong>The rotors again</strong>, now left to right, through different wiring than
					on the way in.
				</li>
				<li>
					<strong>Entry wheel, then the plugboard once more</strong> — so a cabled letter is
					swapped a second time.
				</li>
				<li>
					A <strong>lamp</strong> lights. That's your enciphered letter.
				</li>
			</ol>

			<p>
				Turn on <em>Debug mode</em> above and press a key to watch this happen one stage at a
				time, with the matching part of the machine lighting up as the signal reaches it.
			</p>

			<h3 className="prose__subtitle">Why the same machine also decrypts</h3>

			<p>
				The reflector is what makes Enigma its own inverse. Because it always pairs letters
				both ways, the whole path is reciprocal: if <code>A</code> enciphers to{' '}
				<code>Q</code> at a given rotor position, then <code>Q</code> enciphers to{' '}
				<code>A</code> at that same position. An operator needed no separate decrypt setting —
				they set the machine to the day's key, typed the ciphertext, and the plaintext came
				back out.
			</p>

			<p>
				That convenience carried a fatal flaw. Since the reflector never pairs a letter with
				itself, <strong>no letter can ever encipher to itself</strong>. Codebreakers at
				Bletchley Park used exactly this: if you guessed a phrase was in a message, you could
				slide the guess along the ciphertext and instantly discard every position where a
				letter lined up with itself.
			</p>

			<h3 className="prose__subtitle">What the operator could configure</h3>

			<p>
				Every setting in the panel above is one an operator genuinely set by hand, from a
				printed key sheet that changed daily:
			</p>

			<ul className="prose__list">
				<li>
					<strong>Rotor choice and order</strong> (Walzenlage) — three rotors picked from a set
					of five and slotted in a chosen order.
				</li>
				<li>
					<strong>Ring setting</strong> (Ringstellung) — rotates the lettered ring relative to
					the internal wiring, shifting where the letters sit against the circuit.
				</li>
				<li>
					<strong>Start position</strong> (Grundstellung) — where each rotor is turned to
					before typing begins.
				</li>
				<li>
					<strong>Reflector</strong> — UKW-A, B or C, each with different pairings.
				</li>
				<li>
					<strong>Plugboard cables</strong> (Steckerverbindungen) — typically ten cables
					swapping ten pairs of letters.
				</li>
			</ul>

			<p>
				Together those give roughly{' '}
				<strong>158,962,555,217,826,360,000</strong> possible settings — about 1.6 × 10
				<sup>20</sup> — for a three-rotor Enigma with ten plugboard cables. The Germans
				considered it unbreakable. It was broken anyway: first by Polish cryptanalysts led by
				Marian Rejewski in the 1930s, then at scale at Bletchley Park, largely because
				operating habits (predictable message openings, repeated settings, that
				no-letter-maps-to-itself flaw) narrowed the search far below that number.
			</p>

			<h3 className="prose__subtitle">There wasn't one Enigma</h3>

			<p>
				&ldquo;Enigma&rdquo; names a family of machines, not a single design. The one modelled
				above is the <strong>Enigma I</strong>, used by the German Army and Air Force. Others
				differed in ways that mattered enormously to the people trying to break them:
			</p>

			<ul className="prose__list">
				<li>
					<strong>Enigma I</strong> — three rotors chosen from five, plugboard, fixed
					reflector. The most widely used military model.
				</li>
				<li>
					<strong>Naval M3</strong> — mechanically similar, but with three more rotors (VI–VIII)
					available, widening the rotor choice considerably.
				</li>
				<li>
					<strong>Naval M4</strong> — a fourth rotor, used on U-boats from 1942. To fit it in
					the same case, the reflector was made thinner and paired with a slim extra rotor
					(Beta or Gamma). Breaking traffic from it took Bletchley the best part of a year.
				</li>
				<li>
					<strong>Commercial and other variants</strong> — models such as the Enigma D and K
					had no plugboard at all, making them dramatically weaker; the Abwehr's version added
					a gear-driven stepping mechanism and a rotating reflector.
				</li>
			</ul>

			<p>
				The engine behind this page isn't hard-wired to any one of them. Rotor wirings, notch
				positions, the reflector, the plugboard and even the alphabet itself are all just
				configuration — so other models can be described rather than coded.
			</p>
		</section>
	);
}

export default Explainer;
