#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

// Get version from package.json
const pkg = require('../package.json');

const banner = `
${cyan}   ██████╗ ███████╗██████╗
  ██╔════╝ ██╔════╝██╔══██╗
  ██║  ███╗███████╗██║  ██║
  ██║   ██║╚════██║██║  ██║
  ╚██████╔╝███████║██████╔╝
   ╚═════╝ ╚══════╝╚═════╝${reset}

  Get Shit Done ${cyan}ภาษาไทย${reset} ${dim}v${pkg.version}${reset}
  ระบบ meta-prompting, context engineering และ
  spec-driven development สำหรับ Claude Code
`;

// Parse args
const args = process.argv.slice(2);
const hasGlobal = args.includes('--global') || args.includes('-g');
const hasLocal = args.includes('--local') || args.includes('-l');

// Parse --config-dir argument
function parseConfigDirArg() {
    const configDirIndex = args.findIndex(arg => arg === '--config-dir' || arg === '-c');
    if (configDirIndex !== -1) {
        const nextArg = args[configDirIndex + 1];
        // Error if --config-dir is provided without a value or next arg is another flag
        if (!nextArg || nextArg.startsWith('-')) {
            console.error(`  ${yellow}--config-dir ต้องการ path argument${reset}`);
            process.exit(1);
        }
        return nextArg;
    }
    // Also handle --config-dir=value format
    const configDirArg = args.find(arg => arg.startsWith('--config-dir=') || arg.startsWith('-c='));
    if (configDirArg) {
        return configDirArg.split('=')[1];
    }
    return null;
}
const explicitConfigDir = parseConfigDirArg();
const hasHelp = args.includes('--help') || args.includes('-h');

console.log(banner);

// Show help if requested
if (hasHelp) {
    console.log(`  ${yellow}การใช้งาน:${reset} npx get-shit-done-th [options]

  ${yellow}Options:${reset}
    ${cyan}-g, --global${reset}              ติดตั้งแบบ global (ไปที่ Claude config directory)
    ${cyan}-l, --local${reset}               ติดตั้งแบบ local (ไปที่ ./.claude ใน directory ปัจจุบัน)
    ${cyan}-c, --config-dir <path>${reset}   ระบุ custom Claude config directory
    ${cyan}-h, --help${reset}                แสดงข้อความช่วยเหลือนี้

  ${yellow}ตัวอย่าง:${reset}
    ${dim}# ติดตั้งไปที่ ~/.claude directory (default)${reset}
    npx get-shit-done-th --global

    ${dim}# ติดตั้งไปที่ custom config directory (สำหรับหลาย Claude accounts)${reset}
    npx get-shit-done-th --global --config-dir ~/.claude-bc

    ${dim}# ใช้ environment variable${reset}
    CLAUDE_CONFIG_DIR=~/.claude-bc npx get-shit-done-th --global

    ${dim}# ติดตั้งเฉพาะโปรเจกต์ปัจจุบัน${reset}
    npx get-shit-done-th --local

  ${yellow}หมายเหตุ:${reset}
    --config-dir option มีประโยชน์เมื่อคุณมีหลาย Claude Code
    configurations (เช่น สำหรับ subscriptions ที่แตกต่างกัน)
    มันมีความสำคัญเหนือ CLAUDE_CONFIG_DIR environment variable
`);
    process.exit(0);
}

/**
 * Expand ~ to home directory (shell doesn't expand in env vars passed to node)
 */
function expandTilde(filePath) {
    if (filePath && filePath.startsWith('~/')) {
        return path.join(os.homedir(), filePath.slice(2));
    }
    return filePath;
}

/**
 * Recursively copy directory, replacing paths in .md files
 */
function copyWithPathReplacement(srcDir, destDir, pathPrefix) {
    fs.mkdirSync(destDir, { recursive: true });

    const entries = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);

        if (entry.isDirectory()) {
            copyWithPathReplacement(srcPath, destPath, pathPrefix);
        } else if (entry.name.endsWith('.md')) {
            // Replace ~/.claude/ with the appropriate prefix in markdown files
            let content = fs.readFileSync(srcPath, 'utf8');
            content = content.replace(/~\/\.claude\//g, pathPrefix);
            fs.writeFileSync(destPath, content);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

/**
 * Install to the specified directory
 */
function install(isGlobal) {
    const src = path.join(__dirname, '..');
    // Priority: explicit --config-dir arg > CLAUDE_CONFIG_DIR env var > default ~/.claude
    const configDir = expandTilde(explicitConfigDir) || expandTilde(process.env.CLAUDE_CONFIG_DIR);
    const defaultGlobalDir = configDir || path.join(os.homedir(), '.claude');
    const claudeDir = isGlobal
        ? defaultGlobalDir
        : path.join(process.cwd(), '.claude');

    const locationLabel = isGlobal
        ? claudeDir.replace(os.homedir(), '~')
        : claudeDir.replace(process.cwd(), '.');

    // Path prefix for file references
    // Use actual path when CLAUDE_CONFIG_DIR is set, otherwise use ~ shorthand
    const pathPrefix = isGlobal
        ? (configDir ? `${claudeDir}/` : '~/.claude/')
        : './.claude/';

    console.log(`  กำลังติดตั้งไปที่ ${cyan}${locationLabel}${reset}\n`);

    // Create commands directory
    const commandsDir = path.join(claudeDir, 'commands');
    fs.mkdirSync(commandsDir, { recursive: true });

    // Copy commands/gsd with path replacement
    const gsdSrc = path.join(src, 'commands', 'gsd');
    const gsdDest = path.join(commandsDir, 'gsd');
    copyWithPathReplacement(gsdSrc, gsdDest, pathPrefix);
    console.log(`  ${green}✓${reset} ติดตั้ง commands/gsd แล้ว`);

    // Copy get-shit-done skill with path replacement
    const skillSrc = path.join(src, 'get-shit-done');
    const skillDest = path.join(claudeDir, 'get-shit-done');
    copyWithPathReplacement(skillSrc, skillDest, pathPrefix);
    console.log(`  ${green}✓${reset} ติดตั้ง get-shit-done แล้ว`);

    console.log(`
  ${green}เสร็จสิ้น!${reset} รัน ${cyan}/gsd:help${reset} เพื่อเริ่มต้นใช้งาน
`);
}

/**
 * Prompt for install location
 */
function promptLocation() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const configDir = expandTilde(explicitConfigDir) || expandTilde(process.env.CLAUDE_CONFIG_DIR);
    const globalPath = configDir || path.join(os.homedir(), '.claude');
    const globalLabel = globalPath.replace(os.homedir(), '~');

    console.log(`  ${yellow}คุณต้องการติดตั้งที่ไหน?${reset}

  ${cyan}1${reset}) Global ${dim}(${globalLabel})${reset} - ใช้ได้ในทุกโปรเจกต์
  ${cyan}2${reset}) Local  ${dim}(./.claude)${reset} - เฉพาะโปรเจกต์นี้
`);

    rl.question(`  เลือก ${dim}[1]${reset}: `, (answer) => {
        rl.close();
        const choice = answer.trim() || '1';
        const isGlobal = choice !== '2';
        install(isGlobal);
    });
}

// Main
if (hasGlobal && hasLocal) {
    console.error(`  ${yellow}ไม่สามารถระบุทั้ง --global และ --local${reset}`);
    process.exit(1);
} else if (explicitConfigDir && hasLocal) {
    console.error(`  ${yellow}ไม่สามารถใช้ --config-dir กับ --local${reset}`);
    process.exit(1);
} else if (hasGlobal) {
    install(true);
} else if (hasLocal) {
    install(false);
} else {
    promptLocation();
}
