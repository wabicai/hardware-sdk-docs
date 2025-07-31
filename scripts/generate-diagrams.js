#!/usr/bin/env node

/**
 * Script to convert Mermaid diagrams to PNG images for GitBook
 * Usage: node scripts/generate-diagrams.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Mermaid diagrams configuration
const diagrams = [
  {
    name: "environment-selection",
    title: "OneKey SDK Environment Selection",
    mermaid: `
graph TD
    A[开始集成 OneKey SDK] --> B{你的开发环境是什么？}

    B -->|Node.js 应用| C[Node.js/Electron Main]
    B -->|Web 浏览器应用| D[Web Browser]
    B -->|移动应用| E[React Native]
    B -->|浏览器扩展| F[Browser Extension]

    C --> C1["@onekey/hardware-js-sdk"]
    D --> D1["@onekey/hardware-web-sdk"]
    E --> E1["@onekey/hardware-react-native-sdk"]
    F --> F1["@onekey/hardware-web-sdk"]

    style C1 fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style D1 fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    style E1 fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style F1 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
        `,
  },
  {
    name: "nodejs-architecture",
    title: "Node.js Architecture",
    mermaid: `
graph LR
    A[Your App] --> B["@onekey/hardware-js-sdk"]
    B --> C[Transport Layer]
    C --> D[OneKey Device]
    
    subgraph "Transport Options"
        E[USB/HID]
        F[Bluetooth]
        G[Bridge]
    end
    
    C --> E
    C --> F
    C --> G
    
    style A fill:#f9f9f9,stroke:#333,stroke-width:2px
    style B fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style D fill:#4caf50,stroke:#2e7d32,stroke-width:2px
    style E fill:#fff3e0,stroke:#ef6c00,stroke-width:1px
    style F fill:#fff3e0,stroke:#ef6c00,stroke-width:1px
    style G fill:#fff3e0,stroke:#ef6c00,stroke-width:1px
        `,
  },
  {
    name: "web-architecture",
    title: "Web Browser Architecture",
    mermaid: `
graph LR
    A[Web App] --> B["@onekey/hardware-web-sdk"]
    B --> C{Auto Detection}
    
    C -->|WebUSB Available| D[Direct WebUSB]
    C -->|Bridge Available| E[OneKey Bridge]
    C -->|Mobile Device| F[Deep Link]
    
    D --> G[OneKey Device]
    E --> G
    F --> H[OneKey Mobile App] --> G
    
    style A fill:#f9f9f9,stroke:#333,stroke-width:2px
    style B fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    style G fill:#4caf50,stroke:#2e7d32,stroke-width:2px
    style H fill:#ff9800,stroke:#e65100,stroke-width:2px
        `,
  },
  {
    name: "react-native-architecture",
    title: "React Native Architecture",
    mermaid: `
graph LR
    A[React Native App] --> B["@onekey/hardware-react-native-sdk"]
    B --> C[Bluetooth Transport]
    C --> D[OneKey Device]
    
    B --> E[Deep Link]
    E --> F[OneKey Mobile App]
    F --> D
    
    style A fill:#f9f9f9,stroke:#333,stroke-width:2px
    style B fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style D fill:#4caf50,stroke:#2e7d32,stroke-width:2px
    style F fill:#ff9800,stroke:#e65100,stroke-width:2px
        `,
  },
  {
    name: "sdk-overview",
    title: "OneKey SDK Overview",
    mermaid: `
graph TB
    subgraph "Developer Applications"
        A1[Web Apps]
        A2[Mobile Apps]
        A3[Desktop Apps]
        A4[CLI Tools]
    end
    
    subgraph "OneKey SDK Layer"
        B1["@onekey/hardware-web-sdk"]
        B2["@onekey/hardware-react-native-sdk"]
        B3["@onekey/hardware-js-sdk"]
    end
    
    subgraph "Transport Layer"
        C1[WebUSB]
        C2[Bluetooth]
        C3[USB/HID]
        C4[Bridge]
        C5[Deep Link]
    end
    
    subgraph "OneKey Ecosystem"
        D1[OneKey Hardware]
        D2[OneKey Mobile App]
        D3[OneKey Bridge]
    end
    
    A1 --> B1
    A2 --> B2
    A3 --> B3
    A4 --> B3
    
    B1 --> C1
    B1 --> C4
    B1 --> C5
    B2 --> C2
    B2 --> C5
    B3 --> C2
    B3 --> C3
    B3 --> C4
    
    C1 --> D1
    C2 --> D1
    C3 --> D1
    C4 --> D3
    C5 --> D2
    
    style A1 fill:#e3f2fd
    style A2 fill:#e3f2fd
    style A3 fill:#e3f2fd
    style A4 fill:#e3f2fd
    style B1 fill:#e8f5e8
    style B2 fill:#fff3e0
    style B3 fill:#e1f5fe
    style D1 fill:#4caf50
    style D2 fill:#ff9800
    style D3 fill:#9c27b0
        `,
  },
  {
    name: "integration-flow",
    title: "Integration Flow",
    mermaid: `
graph TD
    A[Start Integration] --> B[Choose Environment]
    B --> C{Environment Type}
    
    C -->|Web| D["Install @onekey/hardware-web-sdk"]
    C -->|Node.js| E["Install @onekey/hardware-js-sdk"]
    C -->|React Native| F["Install @onekey/hardware-react-native-sdk"]
    
    D --> G[Initialize SDK]
    E --> G
    F --> G
    
    G --> H[Connect Device]
    H --> I[Call API Methods]
    I --> J[Handle Responses]
    J --> K[Success!]
    
    style A fill:#e8f5e8
    style K fill:#4caf50
        `,
  },
];

// Create directories
const assetsDir = path.join(__dirname, "..", "assets");
const diagramsDir = path.join(assetsDir, "diagrams");

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

if (!fs.existsSync(diagramsDir)) {
  fs.mkdirSync(diagramsDir);
}

// Check if mermaid-cli is installed
function checkMermaidCli() {
  try {
    execSync("mmdc --version", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

// Install mermaid-cli if not present
function installMermaidCli() {
  console.log("Installing @mermaid-js/mermaid-cli...");
  try {
    execSync("npm install -g @mermaid-js/mermaid-cli", { stdio: "inherit" });
    console.log("✅ Mermaid CLI installed successfully");
  } catch (error) {
    console.error("❌ Failed to install Mermaid CLI:", error.message);
    process.exit(1);
  }
}

// Generate PNG from Mermaid
function generateDiagram(diagram) {
  const mmdFile = path.join(diagramsDir, `${diagram.name}.mmd`);
  const pngFile = path.join(diagramsDir, `${diagram.name}.png`);

  // Write mermaid file
  fs.writeFileSync(mmdFile, diagram.mermaid.trim());

  // Generate PNG
  try {
    const command = `mmdc -i "${mmdFile}" -o "${pngFile}" -t dark -b transparent --width 1200 --height 800`;
    execSync(command, { stdio: "inherit" });
    console.log(`✅ Generated: ${diagram.name}.png`);

    // Clean up mmd file
    fs.unlinkSync(mmdFile);
  } catch (error) {
    console.error(`❌ Failed to generate ${diagram.name}:`, error.message);
  }
}

// Main function
function main() {
  console.log("🎨 OneKey SDK Diagram Generator");
  console.log("================================");

  // Check and install mermaid-cli if needed
  if (!checkMermaidCli()) {
    console.log("Mermaid CLI not found, installing...");
    installMermaidCli();
  }

  // Generate all diagrams
  console.log("\n📊 Generating diagrams...");
  diagrams.forEach(generateDiagram);

  console.log("\n✨ All diagrams generated successfully!");
  console.log(`📁 Diagrams saved to: ${diagramsDir}`);

  // Generate index file for easy reference
  const indexContent = `# OneKey SDK Diagrams

This directory contains generated PNG diagrams for the OneKey SDK documentation.

## Available Diagrams

${diagrams.map((d) => `- **${d.title}**: \`${d.name}.png\``).join("\n")}

## Usage in GitBook

To use these diagrams in GitBook, reference them like this:

\`\`\`markdown
![${diagrams[0].title}](../assets/diagrams/${diagrams[0].name}.png)
\`\`\`

## Regenerating Diagrams

To regenerate all diagrams, run:

\`\`\`bash
node scripts/generate-diagrams.js
\`\`\`
`;

  fs.writeFileSync(path.join(diagramsDir, "README.md"), indexContent);
  console.log("📝 Generated diagrams index file");
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { diagrams, generateDiagram };
