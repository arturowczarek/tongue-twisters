import React from "react";

export interface SettingsProps {
    randomize: boolean
}

interface Props {
    closeSettings: () => void
    settings: SettingsProps
    updateSettings: (newSettings: SettingsProps) => void
}

export const Settings: React.FunctionComponent<Props> = ({settings, updateSettings, closeSettings}) => {
    return (
        <div className="settings">
            <div className="panel">
                <div className="header">
                    <h2>Settings</h2>
                </div>
                <div className="settingsOptions">
                    <label><input type="checkbox" className="css-checkbox" checked={settings.randomize}
                                  onChange={e => updateSettings({...settings, randomize: !settings.randomize})
                                  }/> Randomize tongue twisters</label>
                </div>
                <div className="footer">
                    <button className="button" onClick={closeSettings}>Ok</button>
                </div>
            </div>
        </div>
    );
}
