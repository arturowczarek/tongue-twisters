export class Recorder {
    private recorder: MediaRecorder | undefined;
    private audioChunks: Blob[] = [];
    private audioBlob: Blob | undefined = undefined;
    private audio: HTMLAudioElement | undefined = undefined;

    startRecording = () => {
        if (!this.recorder) {
            navigator.mediaDevices
                .getUserMedia({audio: true})
                .then(stream => {
                    if (this.audio) {
                        this.audio.pause();
                        this.audio = undefined;
                    }
                    const recorder = new MediaRecorder(stream);
                    recorder.addEventListener("dataavailable", event => this.audioChunks.push(event.data));
                    this.audioBlob = undefined;
                    this.audioChunks = [];
                    recorder.start();
                    this.recorder = recorder;
                });
        }
    }

    stopRecording = () => {
        return new Promise<void>((resolve, reject) => {
            if (this.recorder) {
                this.recorder.addEventListener("stop", () => {
                    this.audioBlob = new Blob(this.audioChunks);
                    this.recorder = undefined;
                    resolve();
                });
                this.recorder.stop();
            } else {
                resolve();
            }
        })
    }

    playRecording = (onStart: () => void, onPaused: () => void) => {
        if (this.audioBlob) {
            const audioUrl = URL.createObjectURL(this.audioBlob);
            this.audio = new Audio(audioUrl);
            this.audio.addEventListener("pause", e => {
                onPaused();
            })
            this.audio.play().then(onStart);
        }
    }

    stopPlaying = () => {
        if (this.audio) {
            this.audio.pause()
        }
    }
}