import React, {useState} from 'react';
import './App.scss';
import {Recorder} from "./recorder";
import {twisters as twistersList} from "./twisters";
import {Settings, SettingsProps} from "./Settings";
import {TwistersState, TwistersStateModifier} from "./twistersProvider";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faDice,
    faChevronRight,
    faChevronLeft,
    faMicrophone,
    faStop,
    faPlay,
    faPenToSquare
} from '@fortawesome/free-solid-svg-icons'
import {useHotkeys} from 'react-hotkeys-hook';

const renderTwisterPart = (part: string, isLast: boolean) => {
    if (!isLast) {
        return <React.Fragment key={part}><span>{part}</span><br/></React.Fragment>
    } else {
        return <span key={part}>{part}</span>
    }
}
const renderTwister: (text: string) => JSX.Element[] = (text: string) => {
    const parts = text.split('\n');
    return parts.map((part, index) =>
        renderTwisterPart(part, index === parts.length - 1)
    )
}

const twistersService = new TwistersStateModifier();

function App() {
    const [recording, setRecording] = useState<boolean>(false);
    const [recordingAvailable, setRecordingAvailable] = useState<boolean>(false);
    const [recorder] = useState<Recorder>(new Recorder());
    const [twisters, setTwisters] = useState<TwistersState>(twistersService.newState(twistersList));
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [settingsValues, setSettingsValues] = useState<SettingsProps>({randomize: false})

    const updateSettings = (newSettings: SettingsProps) => {
        setSettingsValues(newSettings);
    }

    const nextTwister = () => {
        interruptAudio();
        setTwisters(t => twistersService.next(t));
    }
    const previousTwister = () => {
        interruptAudio();
        setTwisters(t => twistersService.prev(t));
    }

    const startRecording = () => {
        setRecordingAvailable(false);
        recorder.startRecording();
    }

    const stopRecording = () => {
        recorder.stopRecording().then(() => {
            setRecording(false);
            playRec();
        });
    }

    const toggleRecording = () => {
        const prevRecording = recording;
        setRecording(!recording);
        if (!prevRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    }

    const closeSettings = () => {
        setSettingsVisible(false);
    }

    const twister = twistersService.current(twisters);

    const interruptAudio = () => {
        recorder.stopPlaying();
        setRecording(false);
        setRecordingAvailable(false);
        return recorder.stopRecording();
    }

    const randomizeTwister = () => {
        interruptAudio();
        setTwisters(t => twistersService.random(t));
    }

    const currentTwisterNumber = twistersService.currentTwisterNumber(twisters);
    const maxTwisterNumber = twistersService.numberOfTwisters(twisters);

    const goToTwister = () => {
        const currentTwisterNumber = twistersService.currentTwisterNumber(twisters);
        const maxTwisterNumber = twistersService.numberOfTwisters(twisters);

        const userInput = prompt(`Give number of twisters between 1 and ${maxTwisterNumber}`, currentTwisterNumber.toString());
        if (userInput) {
            const value = parseInt(userInput);
            if (value > 0 && value <= maxTwisterNumber) {
                interruptAudio();
                setTwisters(twistersService.setTwister(twisters, value))
                return;
            }
        }
    }

    const playRec = () => {
        recorder.playRecording(() => {
            setRecordingAvailable(false);
        }, () => {
            setRecordingAvailable(true);
        })
    }

    const showKeyboardShortcuts = () => {
        alert("You can use the following shortcuts\n\nspacebar - start/stop recording\n↓ - play again\n← - previous twister\n→ - next twister\n↑ - pick random twister\ng - go to twister");
    }

    useHotkeys('up', randomizeTwister, [twisters]);
    useHotkeys('down', () => {
        if (recordingAvailable) {
            playRec();
        }
    }, [recorder, recordingAvailable]);
    useHotkeys('left', () => {
        if (!twistersService.isFirst(twisters)) {
            previousTwister();
        }
    }, [twisters]);
    useHotkeys('right', () => {
        if (!twistersService.isLast(twisters)) {
            nextTwister();
        }
    }, [twisters]);
    useHotkeys('space', () => {
        toggleRecording()
    }, [recording, recorder, recordingAvailable]);
    useHotkeys('g', goToTwister
        , [twisters]);


    return (
        <div className="App">
            <div className="App-body">
                <div className="twisters">
                    <div className="twister">
                        {renderTwister(twister.text)}
                    </div>
                </div>
                <div className="stats clickable"
                     onClick={goToTwister} title="Go to twister [g]">{currentTwisterNumber}/{maxTwisterNumber}</div>
                <FontAwesomeIcon className="randomButton clickable" icon={faDice} title="Pick random twister [&uarr;]"
                                 onClick={randomizeTwister}/>

                <div className="recordingPart">
                    <div className={"twisterButton clickable" + (twistersService.isFirst(twisters) ? " disabled" : "")}
                         onClick={previousTwister}>
                        <FontAwesomeIcon icon={faChevronLeft} title="Go to previous twister [&larr;]"/>
                    </div>

                    <FontAwesomeIcon
                        icon={recording ? faStop : faMicrophone}
                        className="recordButton clickable"
                        onClick={toggleRecording}
                        title="Record [spacebar]"
                    />
                    <div className={"twisterButton clickable" + (twistersService.isLast(twisters) ? " disabled" : "")}
                         onClick={nextTwister}>
                        <FontAwesomeIcon icon={faChevronRight} title="Go to next twister [&rarr;]"/>
                    </div>

                </div>
                <FontAwesomeIcon
                    icon={faPlay}
                    className={"playButton clickable" + (!recordingAvailable ? " disabled" : "")}
                    onClick={playRec}
                    title="Play your recording [&darr;]"
                />
            </div>
            {settingsVisible ? <Settings settings={settingsValues} closeSettings={closeSettings}
                                         updateSettings={updateSettings}/> : undefined}
            {/*<FontAwesomeIcon className="editButton clickable" icon={faPenToSquare}*/}
            {/*                 onClick={() => setSettingsVisible(true)}/>*/}
            <footer>
                <span className="keyboardShortcutsWrapper"><span className="keyboardShortcuts clickable" onClick={showKeyboardShortcuts}>Show keyboard shortcuts</span> | </span>Created with ❤️ by <a href="https://owczarek.com" className="clickable">Artur Owczarek</a> | <a href="https://github.com/arturowczarek/tongue-twisters" className="clickable">GitHub</a>
            </footer>
        </div>
    );
}

export default App;
