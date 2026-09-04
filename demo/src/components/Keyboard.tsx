import { useState } from 'react';

interface KeyboardProps {
	onKeyPress: (letter: string) => void;
}

function Keyboard({ onKeyPress }: KeyboardProps) {
	const [value, setValue] = useState('');

	return (
		<input
			data-testid="plaintext-input"
			type="text"
			value={value}
			placeholder="Type a message..."
			onChange={(event) => {
				const nextValue = event.target.value;
				const addedChars = nextValue.slice(value.length);

				setValue(nextValue);

				for (const char of addedChars) {
					onKeyPress(char);
				}
			}}
		/>
	);
}

export default Keyboard;
