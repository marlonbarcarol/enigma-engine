import {
	ALPHABET,
	MachineSettings,
	REFLECTOR_CATALOG,
	ROTOR_CATALOG,
	ROTOR_COUNT,
} from '../config';

interface SettingsProps {
	settings: MachineSettings;
	onChange: (settings: MachineSettings) => void;
}

const SLOT_LABELS = ['Left', 'Middle', 'Right'];

/**
 * The operator's key sheet: which rotors are mounted, their ring settings and
 * start positions, and which reflector is fitted. Changing anything here
 * re-enciphers the message from scratch.
 */
function Settings({ settings, onChange }: SettingsProps) {
	function updateAt(key: 'rotorIds' | 'ringSettings' | 'positions', index: number, value: string) {
		const next = [...settings[key]];
		next[index] = value;
		onChange({ ...settings, [key]: next });
	}

	return (
		<section data-testid="settings" className="settings">
			<header className="panel__header">
				<h2 className="panel__title">Schlüssel / Settings</h2>
				<p className="panel__hint">The daily key: rotor order, rings, and start positions</p>
			</header>

			<div className="settings__grid">
				<span className="settings__corner" />
				{SLOT_LABELS.slice(0, ROTOR_COUNT).map((label) => (
					<span className="settings__slot" key={label}>
						{label}
					</span>
				))}

				<span className="settings__label">Rotor</span>
				{settings.rotorIds.map((rotorId, index) => (
					<select
						key={index}
						data-testid={`setting-rotor-${index}`}
						className="settings__select"
						value={rotorId}
						onChange={(event) => updateAt('rotorIds', index, event.target.value)}
					>
						{ROTOR_CATALOG.map((rotor) => (
							<option key={rotor.id} value={rotor.id}>
								{rotor.id}
							</option>
						))}
					</select>
				))}

				<span className="settings__label" title="Ringstellung">
					Ring
				</span>
				{settings.ringSettings.map((ring, index) => (
					<select
						key={index}
						data-testid={`setting-ring-${index}`}
						className="settings__select"
						value={ring}
						onChange={(event) => updateAt('ringSettings', index, event.target.value)}
					>
						{Array.from(ALPHABET).map((letter) => (
							<option key={letter} value={letter}>
								{letter}
							</option>
						))}
					</select>
				))}

				<span className="settings__label" title="Grundstellung">
					Start
				</span>
				{settings.positions.map((position, index) => (
					<select
						key={index}
						data-testid={`setting-position-${index}`}
						className="settings__select"
						value={position}
						onChange={(event) => updateAt('positions', index, event.target.value)}
					>
						{Array.from(ALPHABET).map((letter) => (
							<option key={letter} value={letter}>
								{letter}
							</option>
						))}
					</select>
				))}
			</div>

			<div className="settings__reflector">
				<span className="settings__label">Reflector (UKW)</span>
				<div className="settings__reflector-options">
					{REFLECTOR_CATALOG.map((reflector) => (
						<button
							key={reflector.id}
							type="button"
							data-testid={`setting-reflector-${reflector.id}`}
							className={
								reflector.id === settings.reflectorId
									? 'settings__chip settings__chip--active'
									: 'settings__chip'
							}
							onClick={() => onChange({ ...settings, reflectorId: reflector.id })}
						>
							{reflector.id}
						</button>
					))}
				</div>
			</div>
		</section>
	);
}

export default Settings;
