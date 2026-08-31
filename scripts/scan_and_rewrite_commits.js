const { execSync } = require('child_process');

const logOutput = execSync('git log --since=midnight --format="%H<SPLIT>%s"').toString().trim();
const commits = logOutput.split('\n').map(line => {
    const [hash, msg] = line.split('<SPLIT>');
    return { hash, msg };
});

console.log(`Total commits since midnight: ${commits.length}`);

commits.forEach((c, idx) => {
    if (/150|automatic|daemon|muluwengel|watcher|pipeline|milestone/i.test(c.msg)) {
        console.log(`[${idx}] ${c.hash.substring(0, 7)}: "${c.msg}"`);
    }
});
