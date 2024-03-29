import { Alphabet } from './Configuration/Alphabet/Alphabet';
import { EnigmaConfiguration } from './Configuration/EnigmaConfiguration';
import { Plugboard } from './Configuration/Plugboard/Plugboard';
import { Reflector } from './Configuration/Reflector/Reflector';
import { Rotor } from './Configuration/Rotor/Rotor';
import { RotorRing } from './Configuration/Rotor/RotorRing';
import { RotorWiring } from './Configuration/Rotor/RotorWiring';
import { Wheel } from './Configuration/Wheel/Wheel';
import { Wiring } from './Configuration/Wiring/Wiring';
import { Cipher, CipherJSON, InvalidEnigmaAlphabetError } from './main';

describe('Cipher.ts', () => {
	describe('Can instantiate', () => {
		test('from JSON', () => {
			const cipher = Cipher.fromJSON({
				alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
				plugboard: { wiring: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
				entry: { wiring: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
				rotors: [
					{ wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notches: ['V'] },
					{ wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notches: ['E'] },
					{ wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notches: ['Q'] },
				],
				reflector: { wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT' },
				chargroup: 5,
			});

			expect(cipher).toBeInstanceOf(Cipher);

			const text = cipher.encrypt('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
			expect(text).toEqual('ILFDF ARUBD ONVIS RUKOZ QMNDI YCOUH RLAWB RMPYL AZNYN GR');
		});

		test('with common configuration', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')) }),
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')) }),
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')) }),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(alphabet));
			const entry = new Wheel(Wiring.withEnglish(alphabet));
			const reflector = new Reflector(Wiring.withEnglish(alphabet));

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			const cipher = new Cipher(configuration);

			expect(cipher).toBeInstanceOf(Cipher);
		});
	});

	describe('Cannot instantiate', () => {
		test('with plugboard alphabet not matching configuration alphabet', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')) }),
			];

			const plugboard = new Plugboard(
				Wiring.create(Alphabet.create('ÀÁABCDE'), Alphabet.create('ÀÁABCDE')),
			);
			const entry = new Wheel(Wiring.withEnglish(alphabet));
			const reflector = new Reflector(Wiring.withEnglish(alphabet));

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			expect(() => new Cipher(configuration)).toThrowError(InvalidEnigmaAlphabetError);
		});

		test('with entry alphabet not matching configuration alphabet', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')) }),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(alphabet));
			const entry = new Wheel(
				Wiring.create(Alphabet.create('ÀÁABCDE'), Alphabet.create('ÀÁABCDE')),
			);
			const reflector = new Reflector(Wiring.withEnglish(alphabet));

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			expect(() => new Cipher(configuration)).toThrowError(InvalidEnigmaAlphabetError);
		});

		test('with reflector alphabet not matching configuration alphabet', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')) }),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(alphabet));
			const entry = new Wheel(Wiring.withEnglish(alphabet));
			const reflector = new Reflector(
				Wiring.create(Alphabet.create('ÀÁABCDE'), Alphabet.create('ÀÁABCDE')),
			);

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			expect(() => new Cipher(configuration)).toThrowError(InvalidEnigmaAlphabetError);
		});

		test('with rotor alphabet not matching configuration alphabet', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')) }),
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')) }),
				new Rotor({
					wiring: RotorWiring.create(Alphabet.create('ÀÁABCDE'), Alphabet.create('ÀÁABCDE')),
				}),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(alphabet));
			const entry = new Wheel(Wiring.withEnglish(alphabet));
			const reflector = new Reflector(Wiring.withEnglish(alphabet));

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			expect(() => new Cipher(configuration)).toThrowError(InvalidEnigmaAlphabetError);
		});
	});

	describe('Can encrypt', () => {
		test('with simple text', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')) }),
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')) }),
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')) }),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(
				Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')),
			);

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			const cipher = new Cipher(configuration);

			expect(cipher.encrypt('AAAAA')).toEqual('BDZGO');
		});

		test('with lenghty text (1300 chars)', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')),
					notches: ['Q'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')),
					notches: ['E'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')),
					notches: ['V'],
				}),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(
				Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')),
			);

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			const cipher = new Cipher(configuration);

			// prettier-ignore
			expect(cipher.encrypt(
				// prettier-ignore
				'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
			)).toEqual(
				// prettier-ignore
				'BDZGOWCXLTKSBTMCDLPBMUQOFXYHCXTGYJFLINHNXSHIUNTHEORXPQPKOVHCBUBTZSZSOOSTGOTFSODBBZZLXLCYZXIFGWFDZEEQIBMGFJBWZFCKPFMGBXQCIVIBBRNCOCJUVYDKMVJPFMDRMTGLWFOZLXGJEYYQPVPBWNCKVKLZTCBDLDCTSNRCOOVPTGBVBBISGJSOYHDENCTNUUKCUGHREVWBDJCTQXXOGLEBZMDBRZOSXDTZSZBGDCFPRBZYQGSNCCHGYEWOHVJBYZGKDGYNNEUJIWCTYCYTUUMBOYVUNNQUKKSOBSCORSUOSCNVROQLHEUDSUKYMIGIBSXPIHNTUVGGHIFQTGZXLGYQCNVNSRCLVPYOSVRBKCEXRNLGDYWEBFXIVKKTUGKPVMZOTUOGMHHZDREKJHLEFKKPOXLWBWVBYUKDTQUHDQTREVRQJMQWNDOVWLJHCCXCFXRPPXMSJEZCJUFTBRZZMCSSNJNYLCGLOYCITVYQXPDIYFGEFYVXSXHKEGXKMMDSWBCYRKIZOCGMFDDTMWZTLSSFLJMOOLUUQJMIJSCIQVRUISTLTGNCLGKIKTZHRXENRXJHYZTLXICWWMYWXDYIBLERBFLWJQYWONGIQQCUUQTPPHBIEHTUVGCEGPEYMWICGKWJCUFKLUIDMJDIVPJDMPGQPWITKGVIBOOMTNDUHQPHGSQRJRNOOVPWMDNXLLVFIIMKIEYIZMQUWYDPOULTUWBUKVMMWRLQLQSQPEUGJRCXZWPFYIYYBWLOEWROUVKPOZTCEUWTFJZQWPBQLDTTSRMDFLGXBXZRYQKDGJRZEZMKHJNQYPDJWCJFJLFNTRSNCNLGSSGJCDLXUJBLTFGKHJGQUNCQDESTXZDTUWJBROVGJSFRMRWEXTVHIITRFYGPDUFBMHFGIICNXBKEFRQPGDTVHSWNBENJGRHQQQCVNIXXNVCOHXYGKPDZIJELWNSJISWIUIDNIGHVTGYEVPBMZXYWVDIKYVEFEKMCTMRUWOWUCJVFUGXLCTSIXTCJNXLKWVHDDDMVPIMEDXYZPCIQPQKLOVERJDUOWRWYCXYKMPPLZFEWPUNZQMOETYFOUXTWTHSYYREOMUQCMITURDSFMMSORLICQTPPRNWEUPJQEXBCZNJJWJCUFKOMQIBJLHHYNCVCQYGIBEZFYGTDSFGQYZUQXYVUDRYTKIXZLSKRVTEFLSNOIWPXTFQMVJMYWFUPTMYHCZCCXOFSHFFSLWRSNVMLFQIPBNXWMTRSVFQSPNZOSULTUNRVQBUEKDKPPNEYGNVM',
			);
		});

		test('with rotor position', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')),
					position: 'Z',
					notches: ['V'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')),
					position: 'M',
					notches: ['E'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')),
					position: 'A',
					notches: ['Q'],
				}),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(
				Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')),
			);

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			const cipher = new Cipher(configuration);

			// prettier-ignore
			expect(cipher.encrypt(
				// prettier-ignore
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et volutpat nibh. Mauris vel felis blandit, volutpat velit eget, porttitor magna. Cras eleifend quam ac sagittis ultrices. Ut id risus ex. Quisque id lorem odio. Nulla sed eros sollicitudin, varius diam quis, molestie leo. Curabitur luctus libero libero, at fringilla velit ornare consequat. Cras viverra luctus sapien in venenatis. Aenean consequat odio ut consequat aliquam. Cras erat quam, fermentum id vestibulum eu, pellentesque a nulla. Nullam auctor, orci a convallis interdum, est ex tincidunt quam, quis volutpat diam est in risus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam cursus arcu sit amet diam convallis, vel gravida sapien lacinia. Sed malesuada fringilla velit eu laoreet. Proin id metus velit. Phasellus interdum vulputate turpis eget faucibus. Nullam eleifend, sem laoreet dignissim malesuada, nisl arcu tristique odio, quis pellentesque sem nulla eget orci. Etiam facilisis eleifend nisi sit amet vehicula. Curabitur non dolor sed nulla rhoncus tempus in ut nisi. Fusce mauris mauris, placerat blandit erat blandit, fermentum facilisis ex. Aenean ut dui ac mauris tempor semper ut et enim. Donec pretium dolor et eros tempus fringilla. Mauris hendrerit finibus metus eu rutrum. Proin scelerisque ligula sit amet tempor auctor. Donec nulla enim, dictum non convallis sed, iaculis ut mi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam suscipit, tellus ac venenatis laoreet, augue urna rutrum ex, quis porttitor urna justo quis dui. Duis pellentesque ut nisl eget blandit. Aliquam sit amet purus sed lacus mollis egestas. Nam malesuada justo iaculis, malesuada lorem vitae, sollicitudin tortor. Duis dapibus finibus neque a congue. Aliquam ultricies cursus diam, vitae mattis diam fringilla ut. Praesent et libero lacinia, lobortis elit et, lobortis metus. Nullam nec purus risus. Ut fermentum tortor eget sagittis elementum. Quisque sollicitudin diam nibh, at bibendum nibh semper at. Vivamus eget ligula laoreet, faucibus nisl vel, pulvinar velit. Cras cursus maximus rhoncus. Integer euismod lobortis ligula, ac ultrices massa tincidunt at. In rhoncus elit quis dui aliquet, id lobortis tellus tempus. Aenean sollicitudin nunc lectus. In ut commodo erat. Fusce faucibus nisl sed magna posuere, ac lacinia magna finibus. Integer eget arcu non dolor malesuada hendrerit. Maecenas quis feugiat erat, quis vehicula est. Nullam quis iaculis ipsum. Aliquam accumsan scelerisque mi, in fermentum risus consequat id. Sed in tortor tempus, dictum urna sed, aliquet mi. Aenean rutrum purus ut ante facilisis consequat. Mauris non ultrices urna, eget sodales ante. Nulla fermentum orci a quam mattis tempor. Nullam in tortor vitae mauris sollicitudin ultrices nec id tellus. Duis eget laoreet nunc, non eleifend ex. Morbi a commodo lorem. Pellentesque ultrices quam eget pretium iaculis. Fusce purus mi, faucibus vel turpis et, vulputate ultrices turpis. Morbi non nisi porta felis vulputate viverra. Donec a convallis augue, id laoreet libero. Nam enim leo, faucibus ac nulla in, ultricies scelerisque ligula. Nam quam tellus, fermentum sit amet metus non, ullamcorper pellentesque nibh. Mauris at dolor a magna tincidunt lobortis. Integer quis ipsum vitae nisi commodo.',
			)).toEqual(
				// prettier-ignore
				'WKOSHLNEKFLIAXAWAPSLHBIIPGWKXOKJLZAGMUYGNDMBMVLEIZKICGAEDZMXSIYWKFPIBZZZTAGYWUYWTQPHHNQOUDJDYUQZWABBPIRSZIDTEXHRKMAYZCFHPQUYQVABNWSHHPZHKRWOFWORPPVYKXEIZDRQCJWFOLPONJXHXTALMIUIFQGGAFZPYSKGKNZYMOFDKNLEPKXUGJDLFTDDEQMYHGPKRNXAIHYIPQSEWGWLZAMYVIURTCKUAMYNSXQDAAJDNZMRCZBOBHXKWQWFTHAAYRWNQWZDUFEJNRZQSAJEZHSDKCJMUSASYUSSYOSNZLHRCRJLVDRBVGIKFAMVBQMDVWDUYPSGMZNUXAKROYTPGIRPHKULDILYQGWCDQTDFARWXWNMWHZYUGFBJOTPLQIIBYVCJSJZGXTIBFOPMMKQPUFDRKGPWSYDXYJOZLKDGIRUGOOYLYYHRONYUDQRRMUUWURHGRWNLXGFHPBJUZUZDEPPZOCLAEIJQPMENDLOYALRJDSKBTKWNUHBOHPYQYBNYVRVYHTTJEOFHCQIKKKRRBJXUYFXIHVAPXBYAINEKIBQADXLENLAGHGXJZODBRTPHIJAWUUKRFXOFMZIHMTQCQBWUDLUUEAVWGBSNDXPRXJFYMAYOCOSAYGNGCSLBRGMMWGHJNPDLJWRCYRBMZUSNDGKTFFCGCZSBPHHNZZBXGPPPLDMSJPVPYHCXGMCJLMDQYGCDYLQLAUJUAHKHLOYHMPQHGBDQNEHMJSXIQBFEPXUPUNUUAYMMCAAEWHDAEDWGPDIIVJDSQYKVODFMAEAVYAUDYDVOZGLTZWHJZTDVGQKECWWDMKMLHVNSXZLBAAVPLCXRAFOKOWHUCAHDHGVZHPIFGUDXRJZAPCAPNLYYUSOKUSZIQMKVZTFNYOEXVCMBXFLFWUJOMHXJWWAOCXUFWALGOZXGHAXQBYLTJTGLMMCZECJDCBBOIMXWDORPMANDMBUBANRGTNGOOALXZDYUDQFOQHLGRQDSZTQPKMUYNECCBYBDKBOCYNFZXSIWXMVGLJWJXVPSZHEPFNWKXFYZPBKNHHGHVKEXIYDCICJXFUBLYBLPSUFLCLFPHSRCVAHBAIKJEVBJHEMRFFTKJUWMTSHCUJUTETIWIGHAQCFELOZLNAQNEWNWXJOWJIZEIGBQNPBVUIRPHNUVIVOHQSQLRMYJLDIDZJAIQZUJOFPRCDDLMJKOJTJJZGVGCRHGCGYSOFHDWDBKYFTBQJNTZOFHSGECFVRYCWXIPWKTQNSTCJJKXMSNKBOHMDFLJMVPAMEITPHNNPRJKTSBQGMQEWMNRCIMLJUZDVMMEJEBGURDKFTYKZQGXRANGDSHLLUQXZRKWVEXLJKDXODTQPSJFCHYKXINDVVWMHOTMKIOZELQCQFQSVXKRONHZQWJRQFPXFPYRGHRSIPDFGLNWRGSJWUFHIIHLLLYVQMIDVCXWRCDKHXDOWXDJSYXCWUYITSXWISQFQDUIVXJVBHYSOZZWBURKSCGQGGYLIDFFTWUTQZMHKDOZWLFUKWTVHVSLHUVPXZJHGPQZQJUGVVIMMGSBFHWUPUYHUEZIVZDOTUGGDZFRPMMMIOTARJUYOQXUJEZGPAODCUCHQQEXNJSBGVDWWWACNPMNGYCDFZWECXYSTJBKTJEJLZWSTWJXAICOGCCHBUOOYHEJNWAFUCACEPCISIUVUKYABOYHMWXAZWRSLGGKVLOEJSCXXPQDRZXAQZPLZZFMXVOOSRCTBCLVRIWBIXASCBYYGPSPEFGFVDMPWUIWWORPSDSNMDGEALELMCNRWHKAWZGRRSVAMCLIICADJXTQCZTREBLIQIZXLKLFMZJUENLQURHZXVSZXDCDBQFECSCGTNANHVUFTKHSYIHTTRAYHZFKHHCBZAUUODROZATQZXZZUQPHUGZGONOMGMKEZXGRSKJHWJHKBPRUEPZJBREXTMVVJFMQGIDXEEBREJFWCBPSDXMYROKTTOITFIJZZDJDIUJSFNTDYFONSQUCMKEWAYZHWPIRMYLWORUKOIVURTXMZBEPXTFSXSGLRIWHYEFBUVVEYFOJRKAPOFZRKFAWHOYARCOJRTHMPEFVJQJUAXUIBWINKZKOGGHYFBKMQCOQJAOJHVTJLKZEFGHFQEAZSLCYDKGQSMLZZIBINWKINRRJSIZSEEVUOEJGGVPLSCKOAWQCJEJIXFSGUZLFGWEAVRFRZIRLCPIYCJEJBIVTRZVAFBMUQSJRQJQXICRKJSHORKSQJBXLMVEXEGUIHNHJGAEKESURDQOTIKEZXGFCYKFRUZBUCPARFEMFNIJOXFVKCNPCCCKEJJWGKBMURMZQGKCJAEGSSVHGJZQUYWSECOZIGIAMPBSRATRPMYWDLFRSNYXAICZGIINYHCFZACXGDVOAFCXIYSFBKEJEQLLBANNITUZUSVWVDSAEHICWRWCRLFYBBUDDUZTTYZZZOHYEGFFWAMZBOQXRHCONCXENXVNVEUWNSAEDUEYEPQFSPOYIZABSCRMQYQOORKUMRARRAVYRTOQQFXBRFTUHSSBYOUTTULSRHTOTRCRWGGUPOFLDTSWCNYZCZFRDTJZCMMIWKWQXCCNBVCKPNRBFNRYSYRSMDPSJTDPDSOZHHGQIIZDIUGUDYCSFHUQIZFUEVQFUKHGCOUZSJYVQQATKKVMHGNZUZFIFVMUBGUBVDAYWMRFAZEVOOSKNFQYDLNYUOTUW',
			);
		});

		// TODO
		xtest('with ring settings', () => {
			const alphabet = Alphabet.createEnglish();

			const ringA = new RotorRing(alphabet.positionOf('A'));
			const ringB = new RotorRing(alphabet.positionOf('B'));
			const ringC = new RotorRing(alphabet.positionOf('C'));
			const rotors: Rotor[] = [
				new Rotor({
					ring: ringA,
					wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')),
				}),
				new Rotor({
					ring: ringB,
					wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')),
				}),
				new Rotor({
					ring: ringC,
					wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')),
				}),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(
				Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')),
			);

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			const cipher = new Cipher(configuration);

			expect(cipher.encrypt('AAAAA')).toEqual('?????');
		});

		test('with locked rotors', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')),
					lock: true,
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')),
					lock: true,
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')),
					lock: true,
				}),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(
				Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')),
			);

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			const cipher = new Cipher(configuration);

			// prettier-ignore
			expect(cipher.encrypt(
				// prettier-ignore
				'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
			)).toEqual(
				// prettier-ignore
				'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU',
			);
		});

		test('with whitespace grouping characters every 5 positions.', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')),
					notches: ['V'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')),
					notches: ['E'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')),
					notches: ['Q'],
				}),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(
				Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')),
			);

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
				chargroup: 5,
			};

			const cipher = new Cipher(configuration);
			const text = cipher.encrypt('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
			expect(text).toEqual('ILFDF ARUBD ONVIS RUKOZ QMNDI YCOUH RLAWB RMPYL AZNYN GR');
		});

		test('with plaintext unsupported by alphabet — will remove unsupported text', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')) }),
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')) }),
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')) }),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(
				Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')),
			);

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			const cipher = new Cipher(configuration);

			expect(cipher.encrypt('ÆAAAA')).toEqual('BDZG');
		});

		test('with only rotors', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')) }),
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')) }),
				new Rotor({ wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')) }),
			];

			const configuration: EnigmaConfiguration = {
				alphabet,
				rotors,
			};

			const cipher = new Cipher(configuration);

			// prettier-ignore
			expect(cipher.encrypt(
				// prettier-ignore
				'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
			)).toEqual(
				// prettier-ignore
				'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
			);
		});

		test('with plugboard', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')),
					notches: ['Q'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')),
					notches: ['E'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')),
					notches: ['V'],
				}),
			];

			const plugboard = new Plugboard(
				Wiring.withEnglish(Alphabet.create('AQRIJFHGDEWLTNSXBCOMZVKPYU')),
			);
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(
				Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')),
			);

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
				chargroup: 5,
			};

			const cipher = new Cipher(configuration);

			// prettier-ignore
			expect(cipher.encrypt(
				// prettier-ignore
				'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
			)).toEqual(
				// prettier-ignore
				'QIUHS KRPLM WOQMT RILXQ TZBSF PYGRP MHYEF LDNGN POGDZ NMGJS CPXBX WSVGR QZQMU OUOSS OMHSM FOSIQ QUULP LRYUP DFHKF IUJJB DQTHF EQKUF RWXFT HQPBR DVDQQ CNRSR EZVYI WTVEX FTICT MHLKF SULPH EJYYB XVXQK NRWVW LUMRQ ILIRM ONCRS SVXMH QVQQD OHEOS YGIJN RMNZZ WRZHG CJVKQ IERMB PPSHL JQUTI QCUSO PIMUO UQHIR FXCQU YBHON RRGHY JKSGV EQYUH WIHYN NJZED KRMYR YMZZT QSYVZ NNBZW WOSQO RSCOZ SORNV CSBLG JZIOZ WYTDH DQOPX DGNMZ VHHGD FBMHU PLHYB RNVNO CRLVX YSOVC QWRJP CNLHI YKJQF PDVWW MZHWX VTUSM ZSHTG GUICJ WEGLJ FWWXS PLKQK VQYZW IMBZG IBMCJ VCBET BKNIS VKLEG RRPRF PCXXP TOEJU REZFM QCUUT ROONE NYLRH LSYRD MVYBP XIDYF HJFYV POPGW JHPWT TIOKQ RYCWD USRHT FIIMT KUMLO OFLET SSLZZ BETDE ORDBV CZDOM LMHNR LHWDW MUGCP JNCPE GYUML PDRKK TYKPI YDQLJ CQFLK EBYKS NHDBB RZZBM XXGQD JGMZV HRJHX JYTKD RHWKE RZFWL ZDITE IDVXE ITXHB XKDMW HVDQS STMNI ZGBXG HOBCE CNSSV XKTIN PLLVF DDTWD JYDUT BZKYI XSZLM ZKQZW VTTKC LBLBO BXJZH ECRPU KXFYD YYQKL SJKCS ZVWXS UMRJZ KMFEU BKXQB LIMMO CTIFL HPQPU CYBWI HECUJ UTWGE NBYXI EKREF ELFNM CONRN LHOOH ERILP ZEQLM FHWGE HBZNR BIJOM PUIMZ KEQCS VHEOF CTCKJ PMVGD DMCFY HXIZF QTGFH DDRNP QWJFC BXHIM VGOKN QJNEH CGBBB RVNDP PNVRS GPYHW XIUDE JLKNO EDOKD ZDIND HGVMH YJVXQ TUPYK VIDWY VJFJW TRMTC ZKSKZ REVFZ HPLRM ODPMR ENPLW KVGII ITVXD TJIPY UXRDB XBWLS VJCEI ZSKCK YRPYW TXXLU FJKXZ NUBTS JMYFS ZPMKM GOYYC JSTZB RTDMZ CIOFT TOSCL DRBMX XCNKJ ZXEBJ PQRUN EEKER ZFWST BDQEL GGYNR VRBYH DQJUF YHMIO FHBYU ZBPYV ZICYM WDPUL OWCVM JFLON SDKXP MFBTV ETYKF ZXMTY GRURR PSFOG FFOLK CONVT LFBDX QNPKT MCOVF BOXNU SOZLM ZNCVB QZJWI WXXNJ YHNVT',
			);
		});

		test('README.md example 0.0.4', () => {
			const alphabet = Alphabet.create('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

			const rotors: Rotor[] = [
				new Rotor({
					position: 'A',
					wiring: RotorWiring.create(
						Alphabet.create('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
						Alphabet.create('EKMFLGDQVZNTOWYHXUSPAIBRCJ'),
					),
					notches: ['Q'],
					lock: false,
				}),
				new Rotor({
					position: 'A',
					wiring: RotorWiring.create(
						Alphabet.create('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
						Alphabet.create('AJDKSIRUXBLHWTMCQGZNPYFVOE'),
					),
					notches: ['E'],
					lock: false,
				}),
				new Rotor({
					position: 'A',
					wiring: RotorWiring.create(
						Alphabet.create('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
						Alphabet.create('BDFHJLCPRTXVZNYEIWGAKMUSQO'),
					),
					notches: ['V'],
					lock: false,
				}),
			];

			const plugboard = new Plugboard(
				Wiring.create(
					Alphabet.create('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
					Alphabet.create('AQRIJFHGDEWLTNSXBCOMZVKPYU'),
				),
			);
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(
				Wiring.withEnglish(Alphabet.create('YRUHQSLDPXNGOKMIEBFZCWVJAT')),
			);

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
				chargroup: 5,
			};

			const cipher = new Cipher(configuration);

			expect(cipher.encrypt('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')).toEqual(
				'XPJUP VYBRA QAJNY VAIXO UUWXO VVPDM LKVEK BHQIL DMAKH YL',
			);
		});

		test('README.md example', () => {
			const configuration: CipherJSON = {
				alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
				plugboard: { wiring: 'AQRIJFHGDEWLTNSXBCOMZVKPYU' },
				entry: { wiring: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
				rotors: [
					{ wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notches: ['Q'] },
					{ wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notches: ['E'] },
					{ wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notches: ['V'] },
				],
				reflector: { wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT' },
				chargroup: 5,
			};
			const cipher = Cipher.fromJSON(configuration);

			// prettier-ignore
			expect(cipher.encrypt(
				// prettier-ignore
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
			)).toEqual(
				// prettier-ignore
				'XPJUP VYBRA QAJNY VAIXO UUWXO VVPDM LKVEK BHQIL DMAKH YL',
			);
		});
	});

	describe('Can decrypt', () => {
		test('with lenghty text(1300 chars)', () => {
			const alphabet = Alphabet.createEnglish();

			const rotors: Rotor[] = [
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')),
					notches: ['Q'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')),
					notches: ['E'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')),
					notches: ['V'],
				}),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(
				Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')),
			);

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			const cipher = new Cipher(configuration);

			// prettier-ignore
			expect(cipher.encrypt(
				// prettier-ignore
				'BDZGOWCXLTKSBTMCDLPBMUQOFXYHCXTGYJFLINHNXSHIUNTHEORXPQPKOVHCBUBTZSZSOOSTGOTFSODBBZZLXLCYZXIFGWFDZEEQIBMGFJBWZFCKPFMGBXQCIVIBBRNCOCJUVYDKMVJPFMDRMTGLWFOZLXGJEYYQPVPBWNCKVKLZTCBDLDCTSNRCOOVPTGBVBBISGJSOYHDENCTNUUKCUGHREVWBDJCTQXXOGLEBZMDBRZOSXDTZSZBGDCFPRBZYQGSNCCHGYEWOHVJBYZGKDGYNNEUJIWCTYCYTUUMBOYVUNNQUKKSOBSCORSUOSCNVROQLHEUDSUKYMIGIBSXPIHNTUVGGHIFQTGZXLGYQCNVNSRCLVPYOSVRBKCEXRNLGDYWEBFXIVKKTUGKPVMZOTUOGMHHZDREKJHLEFKKPOXLWBWVBYUKDTQUHDQTREVRQJMQWNDOVWLJHCCXCFXRPPXMSJEZCJUFTBRZZMCSSNJNYLCGLOYCITVYQXPDIYFGEFYVXSXHKEGXKMMDSWBCYRKIZOCGMFDDTMWZTLSSFLJMOOLUUQJMIJSCIQVRUISTLTGNCLGKIKTZHRXENRXJHYZTLXICWWMYWXDYIBLERBFLWJQYWONGIQQCUUQTPPHBIEHTUVGCEGPEYMWICGKWJCUFKLUIDMJDIVPJDMPGQPWITKGVIBOOMTNDUHQPHGSQRJRNOOVPWMDNXLLVFIIMKIEYIZMQUWYDPOULTUWBUKVMMWRLQLQSQPEUGJRCXZWPFYIYYBWLOEWROUVKPOZTCEUWTFJZQWPBQLDTTSRMDFLGXBXZRYQKDGJRZEZMKHJNQYPDJWCJFJLFNTRSNCNLGSSGJCDLXUJBLTFGKHJGQUNCQDESTXZDTUWJBROVGJSFRMRWEXTVHIITRFYGPDUFBMHFGIICNXBKEFRQPGDTVHSWNBENJGRHQQQCVNIXXNVCOHXYGKPDZIJELWNSJISWIUIDNIGHVTGYEVPBMZXYWVDIKYVEFEKMCTMRUWOWUCJVFUGXLCTSIXTCJNXLKWVHDDDMVPIMEDXYZPCIQPQKLOVERJDUOWRWYCXYKMPPLZFEWPUNZQMOETYFOUXTWTHSYYREOMUQCMITURDSFMMSORLICQTPPRNWEUPJQEXBCZNJJWJCUFKOMQIBJLHHYNCVCQYGIBEZFYGTDSFGQYZUQXYVUDRYTKIXZLSKRVTEFLSNOIWPXTFQMVJMYWFUPTMYHCZCCXOFSHFFSLWRSNVMLFQIPBNXWMTRSVFQSPNZOSULTUNRVQBUEKDKPPNEYGNVM',
			)).toEqual(
				// prettier-ignore
				'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
			);
		});

		test('README.md example', () => {
			const configuration: CipherJSON = {
				alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
				plugboard: { wiring: 'AQRIJFHGDEWLTNSXBCOMZVKPYU' },
				entry: { wiring: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
				rotors: [
					{ wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notches: ['Q'] },
					{ wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notches: ['E'] },
					{ wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notches: ['V'] },
				],
				reflector: { wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT' },
				chargroup: 5,
			};
			const cipher = Cipher.fromJSON(configuration);

			// prettier-ignore
			expect(cipher.encrypt(
				// prettier-ignore
				'XPJUP VYBRA QAJNY VAIXO UUWXO VVPDM LKVEK BHQIL DMAKH YL',
			)).toEqual(
				// prettier-ignore
				'LOREM IPSUM DOLOR SITAM ETCON SECTE TURAD IPISC INGEL IT',
			);
		});
	});
});
