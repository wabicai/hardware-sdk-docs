#!/usr/bin/env node

/**
 * Script to generate simple, clean architecture diagrams for OneKey SDK
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Simple and clean diagram definitions
const diagrams = [
    {
        name: 'quick-start-flow',
        title: 'OneKey SDK Quick Start',
        mermaid: `
flowchart TD
    A[Choose Platform] --> B{Platform Type}
    
    B -->|Web App| C[Web SDK]
    B -->|Node.js| D[Node.js SDK]
    B -->|Mobile| E[React Native SDK]
    
    C --> F[Install Package]
    D --> F
    E --> F
    
    F --> G[Initialize SDK]
    G --> H[Connect Device]
    H --> I[Call Methods]
    I --> J[Success!]
    
    style A fill:#e3f2fd
    style J fill:#4caf50,color:#fff
    style C fill:#e8f5e8
    style D fill:#e1f5fe
    style E fill:#fff3e0
        `
    },
    {
        name: 'simple-architecture',
        title: 'OneKey SDK Architecture',
        mermaid: `
flowchart LR
    A[Your App] --> B[OneKey SDK]
    B --> C[Transport Layer]
    C --> D[OneKey Device]
    
    subgraph "SDK Packages"
        E[Web SDK]
        F[Node.js SDK]
        G[React Native SDK]
    end
    
    subgraph "Transport Methods"
        H[USB]
        I[WebUSB]
        J[Bluetooth]
        K[Bridge]
    end
    
    B -.-> E
    B -.-> F
    B -.-> G
    
    C -.-> H
    C -.-> I
    C -.-> J
    C -.-> K
    
    style A fill:#f9f9f9
    style B fill:#2196f3,color:#fff
    style D fill:#4caf50,color:#fff
        `
    },
    {
        name: 'platform-comparison',
        title: 'Platform Comparison',
        mermaid: `
graph TB
    subgraph "Web Browser"
        A1[HTML/JS App]
        A2[WebUSB/Bridge]
        A3[OneKey Device]
        A1 --> A2 --> A3
    end
    
    subgraph "Node.js"
        B1[Node.js App]
        B2[USB/Bluetooth]
        B3[OneKey Device]
        B1 --> B2 --> B3
    end
    
    subgraph "React Native"
        C1[Mobile App]
        C2[Bluetooth/DeepLink]
        C3[OneKey Device]
        C1 --> C2 --> C3
    end
    
    style A1 fill:#e8f5e8
    style B1 fill:#e1f5fe
    style C1 fill:#fff3e0
        `
    },
    {
        name: 'integration-steps',
        title: 'Integration Steps',
        mermaid: `
flowchart TD
    A[1. Install SDK] --> B[2. Initialize]
    B --> C[3. Connect Device]
    C --> D[4. Get Address]
    D --> E[5. Sign Transaction]
    E --> F[6. Broadcast]
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#fce4ec
    style F fill:#4caf50,color:#fff
        `
    },
    {
        name: 'error-handling',
        title: 'Error Handling Flow',
        mermaid: `
flowchart TD
    A[SDK Method Call] --> B{Success?}
    
    B -->|Yes| C[Use Result]
    B -->|No| D{Error Type}
    
    D -->|Device Not Found| E[Connect Device]
    D -->|User Cancelled| F[Retry or Exit]
    D -->|Network Error| G[Check Connection]
    D -->|Unknown| H[Show Error Message]
    
    E --> A
    F --> A
    G --> A
    
    style A fill:#e3f2fd
    style C fill:#4caf50,color:#fff
    style E fill:#ff9800,color:#fff
    style F fill:#f44336,color:#fff
    style G fill:#ff9800,color:#fff
    style H fill:#9e9e9e,color:#fff
        `
    },
    {
        name: 'multi-chain-support',
        title: 'Multi-Chain Support',
        mermaid: `
graph TD
    A[OneKey SDK] --> B[Bitcoin Methods]
    A --> C[Ethereum Methods]
    A --> D[Solana Methods]
    A --> E[Other Chains]
    
    B --> B1[BTC Address]
    B --> B2[Sign Transaction]
    B --> B3[Sign Message]
    
    C --> C1[ETH Address]
    C --> C2[Sign Transaction]
    C --> C3[Sign Typed Data]
    
    D --> D1[SOL Address]
    D --> D2[Sign Transaction]
    
    E --> E1[Cardano]
    E --> E2[Polkadot]
    E --> E3[Cosmos]
    
    style A fill:#2196f3,color:#fff
    style B fill:#f7931a,color:#fff
    style C fill:#627eea,color:#fff
    style D fill:#9945ff,color:#fff
    style E fill:#9e9e9e,color:#fff
        `
    }
];

// Create directories
const assetsDir = path.join(__dirname, '..', 'assets');
const diagramsDir = path.join(assetsDir, 'diagrams');

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

if (!fs.existsSync(diagramsDir)) {
    fs.mkdirSync(diagramsDir);
}

// Check if mermaid-cli is installed
function checkMermaidCli() {
    try {
        execSync('mmdc --version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

// Install mermaid-cli if not present
function installMermaidCli() {
    console.log('Installing @mermaid-js/mermaid-cli...');
    try {
        execSync('npm install -g @mermaid-js/mermaid-cli', { stdio: 'inherit' });
        console.log('✅ Mermaid CLI installed successfully');
    } catch (error) {
        console.error('❌ Failed to install Mermaid CLI:', error.message);
        process.exit(1);
    }
}

// Generate PNG from Mermaid
function generateDiagram(diagram) {
    const mmdFile = path.join(diagramsDir, `${diagram.name}.mmd`);
    const pngFile = path.join(diagramsDir, `${diagram.name}.png`);
    
    // Write mermaid file
    fs.writeFileSync(mmdFile, diagram.mermaid.trim());
    
    // Generate PNG with clean styling
    try {
        const command = `mmdc -i "${mmdFile}" -o "${pngFile}" -t neutral -b white --width 1000 --height 600 --scale 2`;
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ Generated: ${diagram.name}.png`);
        
        // Clean up mmd file
        fs.unlinkSync(mmdFile);
        
    } catch (error) {
        console.error(`❌ Failed to generate ${diagram.name}:`, error.message);
    }
}

// Main function
function main() {
    console.log('🎨 OneKey SDK Simple Diagram Generator');
    console.log('=====================================');
    
    // Check and install mermaid-cli if needed
    if (!checkMermaidCli()) {
        console.log('Mermaid CLI not found, installing...');
        installMermaidCli();
    }
    
    // Generate all diagrams
    console.log('\n📊 Generating clean diagrams...');
    diagrams.forEach(generateDiagram);
    
    console.log('\n✨ All diagrams generated successfully!');
    console.log(`📁 Diagrams saved to: ${diagramsDir}`);
    
    // Generate index file
    const indexContent = `# OneKey SDK Diagrams

Clean and simple diagrams for OneKey SDK documentation.

## Available Diagrams

${diagrams.map(d => `- **${d.title}**: \`${d.name}.png\``).join('\n')}

## Usage in GitBook

\`\`\`markdown
![${diagrams[0].title}](../assets/diagrams/${diagrams[0].name}.png)
\`\`\`

## Regenerating Diagrams

\`\`\`bash
node scripts/generate-simple-diagrams.js
\`\`\`
`;
    
    fs.writeFileSync(path.join(diagramsDir, 'README.md'), indexContent);
    console.log('📝 Generated diagrams index file');
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { diagrams, generateDiagram };
