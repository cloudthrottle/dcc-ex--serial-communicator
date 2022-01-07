# DCC++EX Serial Communicator Library

A Javascript library to communicate with the DCC++ EX Command station.

This package relies on the [Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) which has some limitations.

## Usage/Examples

### Quick Start

```html
<button>Connect</button>

<script type="module">
    import * as DCCCommunicator from 'https://cdn.skypack.dev/@cloudthrottle/dcc-ex--serial-communicator';

    const readHandler = (message) => {
        console.log(message)
    }

    document.addEventListener("click", () => {
        DCCCommunicator.createSerialConnection({readHandler})
    })
</script>
```

### NPM Package

Install with npm

```bash
  npm install @cloudthrottle/dcc-ex--serial-communicator
```

```javascript
import {createSerialConnection} from "@cloudthrottle/dcc-ex--serial-communicator";

const readHandler = (message) => {
    console.log(message)
}

// Must be triggered by a User action like a button click
createSerialConnection({readHandler})
```

## Documentation

- [Wiki](https://github.com/cloudthrottle/dcc-ex--serial-communicator/wiki)

## Developing

Clone the project

```bash
  git clone https://github.com/cloudthrottle/dcc-ex--serial-communicator.git
```

Go to the project directory

```bash
  cd dcc-ex--serial-communicator
```

Install environment. This project requires Node v16.8 or above. If node is already installed this step can be skipped.
[`asdf`](https://github.com/asdf-vm/asdf) is recommended due to it's simplicity

```bash
  asdf install
```

Install dependencies

```bash
  npm install
```

Run the test suite

```bash
  npm test
```

## Related

Here are some related projects

- [DCC EX](https://github.com/DCC-EX)
- [DCC EX Command Reference](https://dcc-ex.com/reference/software/command-reference.html)
- [WebThrottle-EX](https://github.com/DCC-EX/WebThrottle-EX)

