import { Alphabet } from '@/Configuration/Alphabet/Alphabet';
import { EnigmaConfiguration } from '@/Configuration/EnigmaConfiguration';
import { Plugboard } from '@/Configuration/Plugboard/Plugboard';
import { Reflector } from '@/Configuration/Reflector/Reflector';
import { Rotor } from '@/Configuration/Rotor/Rotor';
import { RotorRing } from '@/Configuration/Rotor/RotorRing';
import { RotorWiring } from '@/Configuration/Rotor/RotorWiring';
import { Wheel } from '@/Configuration/Wheel/Wheel';
import { Wiring } from '@/Configuration/Wiring/Wiring';
import { EnigmaCipher } from '@/EnigmaCipher';

describe('EnigmaCipher.ts', () => {
	test('Can instantiate', () => {
		const alphabet = Alphabet.createEnglish();

		const ring = new RotorRing(alphabet.positionOf('A'));
		const rotors: Rotor[] = [
			new Rotor(ring, RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')), 0),
			new Rotor(ring, RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')), 0),
			new Rotor(ring, RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')), 0),
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

		const cipher = new EnigmaCipher(configuration);

		expect(cipher).toBeInstanceOf(EnigmaCipher);
	});

	describe('Can encrypt', () => {
		test('simple text', () => {
			const alphabet = Alphabet.createEnglish();

			const ring = new RotorRing(alphabet.positionOf('A'));
			const rotors: Rotor[] = [
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')), 0),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')), 0),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')), 0),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')));

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			const cipher = new EnigmaCipher(configuration);

			expect(cipher.encrypt('AAAAA')).toEqual('BDZGO');
		});

		test('lenghty text (1300 chars)', () => {
			const alphabet = Alphabet.createEnglish();

			const ring = new RotorRing(alphabet.positionOf('A'));
			const rotors: Rotor[] = [
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')), 0, ['Q']),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')), 0, ['E']),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')), 0, ['V']),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')));

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			const cipher = new EnigmaCipher(configuration);

			expect(
				cipher.encrypt(
					'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
				),
			).toEqual(
				'BDZGOWCXLTKSBTMCDLPBMUQOFXYHCXTGYJFLINHNXSHIUNTHEORXPQPKOVHCBUBTZSZSOOSTGOTFSODBBZZLXLCYZXIFGWFDZEEQIBMGFJBWZFCKPFMGBXQCIVIBBRNCOCJUVYDKMVJPFMDRMTGLWFOZLXGJEYYQPVPBWNCKVKLZTCBDLDCTSNRCOOVPTGBVBBISGJSOYHDENCTNUUKCUGHREVWBDJCTQXXOGLEBZMDBRZOSXDTZSZBGDCFPRBZYQGSNCCHGYEWOHVJBYZGKDGYNNEUJIWCTYCYTUUMBOYVUNNQUKKSOBSCORSUOSCNVROQLHEUDSUKYMIGIBSXPIHNTUVGGHIFQTGZXLGYQCNVNSRCLVPYOSVRBKCEXRNLGDYWEBFXIVKKTUGKPVMZOTUOGMHHZDREKJHLEFKKPOXLWBWVBYUKDTQUHDQTREVRQJMQWNDOVWLJHCCXCFXRPPXMSJEZCJUFTBRZZMCSSNJNYLCGLOYCITVYQXPDIYFGEFYVXSXHKEGXKMMDSWBCYRKIZOCGMFDDTMWZTLSSFLJMOOLUUQJMIJSCIQVRUISTLTGNCLGKIKTZHRXENRXJHYZTLXICWWMYWXDYIBLERBFLWJQYWONGIQQCUUQTPPHBIEHTUVGCEGPEYMWICGKWJCUFKLUIDMJDIVPJDMPGQPWITKGVIBOOMTNDUHQPHGSQRJRNOOVPWMDNXLLVFIIMKIEYIZMQUWYDPOULTUWBUKVMMWRLQLQSQPEUGJRCXZWPFYIYYBWLOEWROUVKPOZTCEUWTFJZQWPBQLDTTSRMDFLGXBXZRYQKDGJRZEZMKHJNQYPDJWCJFJLFNTRSNCNLGSSGJCDLXUJBLTFGKHJGQUNCQDESTXZDTUWJBROVGJSFRMRWEXTVHIITRFYGPDUFBMHFGIICNXBKEFRQPGDTVHSWNBENJGRHQQQCVNIXXNVCOHXYGKPDZIJELWNSJISWIUIDNIGHVTGYEVPBMZXYWVDIKYVEFEKMCTMRUWOWUCJVFUGXLCTSIXTCJNXLKWVHDDDMVPIMEDXYZPCIQPQKLOVERJDUOWRWYCXYKMPPLZFEWPUNZQMOETYFOUXTWTHSYYREOMUQCMITURDSFMMSORLICQTPPRNWEUPJQEXBCZNJJWJCUFKOMQIBJLHHYNCVCQYGIBEZFYGTDSFGQYZUQXYVUDRYTKIXZLSKRVTEFLSNOIWPXTFQMVJMYWFUPTMYHCZCCXOFSHFFSLWRSNVMLFQIPBNXWMTRSVFQSPNZOSULTUNRVQBUEKDKPPNEYGNVM',
			);
		});

		test('with rotor position', () => {
			const alphabet = Alphabet.createEnglish();

			const ring = new RotorRing(alphabet.positionOf('A'));
			const rotors: Rotor[] = [
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')), alphabet.positionOf('Z'), [
					'V',
				]),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')), alphabet.positionOf('M'), [
					'E',
				]),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')), alphabet.positionOf('A'), [
					'Q',
				]),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')));

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			const cipher = new EnigmaCipher(configuration);

			expect(
				cipher.encrypt(
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et volutpat nibh. Mauris vel felis blandit, volutpat velit eget, porttitor magna. Cras eleifend quam ac sagittis ultrices. Ut id risus ex. Quisque id lorem odio. Nulla sed eros sollicitudin, varius diam quis, molestie leo. Curabitur luctus libero libero, at fringilla velit ornare consequat. Cras viverra luctus sapien in venenatis. Aenean consequat odio ut consequat aliquam. Cras erat quam, fermentum id vestibulum eu, pellentesque a nulla. Nullam auctor, orci a convallis interdum, est ex tincidunt quam, quis volutpat diam est in risus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam cursus arcu sit amet diam convallis, vel gravida sapien lacinia. Sed malesuada fringilla velit eu laoreet. Proin id metus velit. Phasellus interdum vulputate turpis eget faucibus. Nullam eleifend, sem laoreet dignissim malesuada, nisl arcu tristique odio, quis pellentesque sem nulla eget orci. Etiam facilisis eleifend nisi sit amet vehicula. Curabitur non dolor sed nulla rhoncus tempus in ut nisi. Fusce mauris mauris, placerat blandit erat blandit, fermentum facilisis ex. Aenean ut dui ac mauris tempor semper ut et enim. Donec pretium dolor et eros tempus fringilla. Mauris hendrerit finibus metus eu rutrum. Proin scelerisque ligula sit amet tempor auctor. Donec nulla enim, dictum non convallis sed, iaculis ut mi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam suscipit, tellus ac venenatis laoreet, augue urna rutrum ex, quis porttitor urna justo quis dui. Duis pellentesque ut nisl eget blandit. Aliquam sit amet purus sed lacus mollis egestas. Nam malesuada justo iaculis, malesuada lorem vitae, sollicitudin tortor. Duis dapibus finibus neque a congue. Aliquam ultricies cursus diam, vitae mattis diam fringilla ut. Praesent et libero lacinia, lobortis elit et, lobortis metus. Nullam nec purus risus. Ut fermentum tortor eget sagittis elementum. Quisque sollicitudin diam nibh, at bibendum nibh semper at. Vivamus eget ligula laoreet, faucibus nisl vel, pulvinar velit. Cras cursus maximus rhoncus. Integer euismod lobortis ligula, ac ultrices massa tincidunt at. In rhoncus elit quis dui aliquet, id lobortis tellus tempus. Aenean sollicitudin nunc lectus. In ut commodo erat. Fusce faucibus nisl sed magna posuere, ac lacinia magna finibus. Integer eget arcu non dolor malesuada hendrerit. Maecenas quis feugiat erat, quis vehicula est. Nullam quis iaculis ipsum. Aliquam accumsan scelerisque mi, in fermentum risus consequat id. Sed in tortor tempus, dictum urna sed, aliquet mi. Aenean rutrum purus ut ante facilisis consequat. Mauris non ultrices urna, eget sodales ante. Nulla fermentum orci a quam mattis tempor. Nullam in tortor vitae mauris sollicitudin ultrices nec id tellus. Duis eget laoreet nunc, non eleifend ex. Morbi a commodo lorem. Pellentesque ultrices quam eget pretium iaculis. Fusce purus mi, faucibus vel turpis et, vulputate ultrices turpis. Morbi non nisi porta felis vulputate viverra. Donec a convallis augue, id laoreet libero. Nam enim leo, faucibus ac nulla in, ultricies scelerisque ligula. Nam quam tellus, fermentum sit amet metus non, ullamcorper pellentesque nibh. Mauris at dolor a magna tincidunt lobortis. Integer quis ipsum vitae nisi commodo.',
				),
			).toEqual(
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
				new Rotor(ringA, RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')), 0),
				new Rotor(ringB, RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')), 0),
				new Rotor(ringC, RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')), 0),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')));

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			const cipher = new EnigmaCipher(configuration);

			expect(cipher.encrypt('AAAAA')).toEqual('?????');
		});
	});

	describe('Can decrypt', () => {
		test('lenghty text(1300 chars)', () => {
			const alphabet = Alphabet.createEnglish();

			const ring = new RotorRing(alphabet.positionOf('A'));
			const rotors: Rotor[] = [
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')), 0, ['Q']),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')), 0, ['E']),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')), 0, ['V']),
			];

			const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
			const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
			const reflector = new Reflector(Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')));

			const configuration: EnigmaConfiguration = {
				alphabet,
				plugboard,
				entry,
				rotors,
				reflector,
			};

			const cipher = new EnigmaCipher(configuration);

			expect(
				cipher.encrypt(
					'BDZGOWCXLTKSBTMCDLPBMUQOFXYHCXTGYJFLINHNXSHIUNTHEORXPQPKOVHCBUBTZSZSOOSTGOTFSODBBZZLXLCYZXIFGWFDZEEQIBMGFJBWZFCKPFMGBXQCIVIBBRNCOCJUVYDKMVJPFMDRMTGLWFOZLXGJEYYQPVPBWNCKVKLZTCBDLDCTSNRCOOVPTGBVBBISGJSOYHDENCTNUUKCUGHREVWBDJCTQXXOGLEBZMDBRZOSXDTZSZBGDCFPRBZYQGSNCCHGYEWOHVJBYZGKDGYNNEUJIWCTYCYTUUMBOYVUNNQUKKSOBSCORSUOSCNVROQLHEUDSUKYMIGIBSXPIHNTUVGGHIFQTGZXLGYQCNVNSRCLVPYOSVRBKCEXRNLGDYWEBFXIVKKTUGKPVMZOTUOGMHHZDREKJHLEFKKPOXLWBWVBYUKDTQUHDQTREVRQJMQWNDOVWLJHCCXCFXRPPXMSJEZCJUFTBRZZMCSSNJNYLCGLOYCITVYQXPDIYFGEFYVXSXHKEGXKMMDSWBCYRKIZOCGMFDDTMWZTLSSFLJMOOLUUQJMIJSCIQVRUISTLTGNCLGKIKTZHRXENRXJHYZTLXICWWMYWXDYIBLERBFLWJQYWONGIQQCUUQTPPHBIEHTUVGCEGPEYMWICGKWJCUFKLUIDMJDIVPJDMPGQPWITKGVIBOOMTNDUHQPHGSQRJRNOOVPWMDNXLLVFIIMKIEYIZMQUWYDPOULTUWBUKVMMWRLQLQSQPEUGJRCXZWPFYIYYBWLOEWROUVKPOZTCEUWTFJZQWPBQLDTTSRMDFLGXBXZRYQKDGJRZEZMKHJNQYPDJWCJFJLFNTRSNCNLGSSGJCDLXUJBLTFGKHJGQUNCQDESTXZDTUWJBROVGJSFRMRWEXTVHIITRFYGPDUFBMHFGIICNXBKEFRQPGDTVHSWNBENJGRHQQQCVNIXXNVCOHXYGKPDZIJELWNSJISWIUIDNIGHVTGYEVPBMZXYWVDIKYVEFEKMCTMRUWOWUCJVFUGXLCTSIXTCJNXLKWVHDDDMVPIMEDXYZPCIQPQKLOVERJDUOWRWYCXYKMPPLZFEWPUNZQMOETYFOUXTWTHSYYREOMUQCMITURDSFMMSORLICQTPPRNWEUPJQEXBCZNJJWJCUFKOMQIBJLHHYNCVCQYGIBEZFYGTDSFGQYZUQXYVUDRYTKIXZLSKRVTEFLSNOIWPXTFQMVJMYWFUPTMYHCZCCXOFSHFFSLWRSNVMLFQIPBNXWMTRSVFQSPNZOSULTUNRVQBUEKDKPPNEYGNVM',
				),
			).toEqual(
				'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
			);
		});
	});
});
