export type ReadHandler = (value: string) => void;

type CreateSerialConnection = ({readHandler}: { readHandler: ReadHandler }) => Promise<{ writer: WritableStreamDefaultWriter<string> }>;

class LineBreakTransformer implements Transformer {
    private chunks: string;

    constructor() {
        // A container for holding stream data until a new line.
        this.chunks = "";
    }

    transform(chunk: string, controller: TransformStreamDefaultController<string>): void {
        // Append new chunks to existing chunks.
        this.chunks = this.chunks + chunk;
        // For each line breaks in chunks, send the parsed lines out.
        const lines = this.chunks.split("\n");
        this.chunks = lines.pop() || "";
        lines.forEach((line) => controller.enqueue(line));
    }

    flush(controller: TransformStreamDefaultController<string>) {
        // When the stream is closed, flush any remaining chunks out.
        controller.enqueue(this.chunks);
    }
}

const selectPort: () => Promise<SerialPort> = async () => {
    return await navigator.serial.requestPort()
};

const openPort: (port: SerialPort) => Promise<SerialPort> = async (port) => {
    await port.open({baudRate: 115200})
    return port
}

const getReader = (port: SerialPort) => {
    const textDecoder = new TextDecoderStream();
    port.readable?.pipeTo(textDecoder.writable).then(() => {
    });
    return textDecoder.readable
        .pipeThrough(new TransformStream(new LineBreakTransformer()))
        .getReader();
};

const readFromPort: (port: SerialPort, readHandler: ReadHandler) => Promise<void> = async (port, readHandler) => {
    while (port.readable) {
        const reader = getReader(port);

        // try {
        while (true) {
            const {value, done} = await reader.read()
            if (done) {
                reader.releaseLock()
                break
            }
            if (value) {
                readHandler(value)
            }
        }

        // } catch (error) {
        //
        // }
    }
};

const getPortWriter: (openedPort: SerialPort) => Promise<WritableStreamDefaultWriter<string>> = async (openedPort: SerialPort) => {
    const textEncoder = new TextEncoderStream();
    textEncoder.readable.pipeTo(openedPort.writable as WritableStream<Uint8Array>).then(() => {
    });
    return textEncoder.writable.getWriter();
};

export const createSerialConnection: CreateSerialConnection = async ({readHandler}) => {
    const port = await selectPort()
    const openedPort = await openPort(port)

    readFromPort(openedPort, readHandler).then(() => {
    });

    return {writer: await getPortWriter(openedPort)};
};