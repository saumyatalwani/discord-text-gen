import React, { useState, useRef } from "react";
import { Button, Container, Text, Tooltip, Group } from "@mantine/core";
import "./ColoredTextGenerator.css";

const tooltipTexts = {
    "30": "Dark Gray",
    "31": "Red",
    "32": "Green",
    "33": "Gold",
    "34": "Blue",
    "35": "Pink",
    "36": "Teal",
    "37": "White",
};

const backgroundTooltipTexts = {
    "40": "Dark Gray",
    "41": "Red",
    "42": "Green",
    "43": "Gold",
    "44": "Blue",
    "45": "Pink",
    "46": "Teal",
    "47": "White",
};

const ansiStyles = {
    "1": { fontWeight: "bold" },
    "4": { textDecoration: "underline" },
    "30": { color: "#808080" },
    "31": { color: "#ff0000" },
    "32": { color: "#00ff00" },
    "33": { color: "#ffd700" },
    "34": { color: "#0000ff" },
    "35": { color: "#ff00ff" },
    "36": { color: "#00ffff" },
    "37": { color: "#ffffff" },

    // Background Colors
    "40": { backgroundColor: "#808080" },
    "41": { backgroundColor: "#ff0000" },
    "42": { backgroundColor: "#00ff00" },
    "43": { backgroundColor: "#ffd700" },
    "44": { backgroundColor: "#0000ff" },
    "45": { backgroundColor: "#ff00ff" },
    "46": { backgroundColor: "#00ffff" },
    "47": { backgroundColor: "#ffffff", color: "#000000" }, // Ensure contrast
};

// Function to Convert HTML Nodes to ANSI Format
const nodesToANSI = (nodes, states) => {
    let text = "";
    for (const node of nodes) {
        if (node.nodeType === 3) {
            text += node.textContent;
            continue;
        }
        if (node.nodeName === "BR") {
            text += "\n";
            continue;
        }
        const ansiCode = +(node.className.split("-")[1]);
        const newState = { ...states.at(-1) };

        if (ansiCode < 30) newState.st = ansiCode;
        if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
        if (ansiCode >= 40) newState.bg = ansiCode;

        states.push(newState);
        text += `\x1b[${newState.st};${(ansiCode >= 40) ? newState.bg : newState.fg}m`;
        text += nodesToANSI(node.childNodes, states);
        states.pop();
        text += `\x1b[0m`;

        if (states.at(-1).fg !== 2) text += `\x1b[${states.at(-1).st};${states.at(-1).fg}m`;
        if (states.at(-1).bg !== 2) text += `\x1b[${states.at(-1).st};${states.at(-1).bg}m`;
    }
    return text;
};

const ColoredTextGenerator = () => {
    const [text, setText] = useState("Welcome to Discord Colored Text Generator!");
    const contentRef = useRef(null);

    const handleStyleButtonClick = (ansiCode) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (!selectedText) return;

        const span = document.createElement("span");
        Object.assign(span.style, ansiStyles[ansiCode]);
        span.textContent = selectedText;
        span.className = `ansi-${ansiCode}`;

        range.deleteContents();
        range.insertNode(span);
    };

    const handleCopy = () => {
        if (!contentRef.current) return;

        const formattedText = nodesToANSI(contentRef.current.childNodes, [{ st: 0, fg: 37, bg: 2 }]);
        const discordFormattedText = `\`\`\`ansi\n${formattedText}\n\`\`\``;

        navigator.clipboard
            .writeText(discordFormattedText)
            .then(() => alert("Copied to clipboard!"))
            .catch(() => alert("Failed to copy."));
    };

    return (
        <Container>
            <Text align="center" size="xl" weight={700} style={{ fontSize: "3.75rem", fontWeight: 'bold' }}>
                Discord <span style={{ color: "#5865F2" }}>Colored</span> Text Generator
            </Text>

            

            <Text size="lg" align="center" weight={500}>Text Colors</Text>
            <Group position="center">
                {Object.keys(tooltipTexts).map((key) => (
                    <Tooltip label={tooltipTexts[key]} key={key}>
                        <Button onClick={() => handleStyleButtonClick(key)}>
                            {tooltipTexts[key]}
                        </Button>
                    </Tooltip>
                ))}
            </Group>

            <div style={{marginTop: '2em'}}>
                <Text size="lg" align="center" weight={500} mt="md" >Background Colors</Text>
                <Group position="center">
                    {Object.keys(backgroundTooltipTexts).map((key) => (
                        <Tooltip label={backgroundTooltipTexts[key]} key={key}>
                            <Button onClick={() => handleStyleButtonClick(key)}>
                                {backgroundTooltipTexts[key]}
                            </Button>
                        </Tooltip>
                    ))}
                </Group>
            </div>

            <div style={{marginTop: '2em'}}>
                <Button onClick={() => setText("")}>Reset All</Button>
                <Button onClick={() => handleStyleButtonClick("1")}>Bold</Button>
                <Button onClick={() => handleStyleButtonClick("4")}>Underline</Button>
            </div>

            <div
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning
                style={{
                    color: "white",
                    fontSize: "16px",
                    minHeight: "50px",
                    border: "1px solid gray",
                    padding: "10px",
                }}
                onChange={(e) => setText(e.target.innerText)}
                className="textarea"
            >
                {text}
            </div>

            <Button onClick={handleCopy}>Copy text as Discord formatted</Button>
        </Container>
    );
};

export default ColoredTextGenerator;