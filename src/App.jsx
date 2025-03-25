import React from 'react';
import ColoredTextGenerator from './coloredTextGenerator';
import { MantineProvider } from '@mantine/core';

function App() {
    return (
      <MantineProvider>
        <div className="App">
            <ColoredTextGenerator />
        </div>
      </MantineProvider>
    );
}

export default App;