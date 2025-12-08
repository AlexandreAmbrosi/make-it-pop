import 'dotenv/config';

const url = process.env.POSTGRES_URL;
if (!url) {
    console.log('No URL');
} else {
    let clean = url.trim().replace(/^['"]|['"]$/g, '');
    const prefix = 'postgresql://';
    if (clean.startsWith(prefix)) {
        const withoutPrefix = clean.substring(prefix.length);
        const lastAt = withoutPrefix.lastIndexOf('@');
        if (lastAt !== -1) {
            const rest = withoutPrefix.substring(lastAt + 1);
            const firstSlash = rest.indexOf('/');
            const hostPort = firstSlash === -1 ? rest : rest.substring(0, firstSlash);
            let host = hostPort.split(':')[0];
            host = host.replace(/['"]/g, '');
            console.log('EXTRACTED HOSTNAME: >>>' + host + '<<<');
        } else {
            console.log('No @ found');
        }
    } else {
        console.log('No prefix match');
    }
}
