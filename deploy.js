import FtpDeploy from 'ftp-deploy';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ftpDeploy = new FtpDeploy();

const config = {
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    host: process.env.FTP_HOST,
    port: 21,
    localRoot: path.join(__dirname, 'dist'),
    remoteRoot: '/public_html/', // Change this if you deploy to a subdomain or subfolder
    include: ['*', '**/*'],      // this would upload everything except dot files
    exclude: [],
    deleteRemote: false,         // delete ALL existing files at remoteRoot before uploading
    forcePasv: true,             // Passive mode is usually required for shared hosting
    sftp: false                  // set to true to use sftp
};

console.log('🚀 Starting "Elite" Deployment to cPanel...');
console.log(`📡 Connecting to: ${config.host}`);

ftpDeploy
    .deploy(config)
    .then((res) => console.log('✅ DEPLOYMENT SUCCESSFUL! Bartr is now live 🚀'))
    .catch((err) => {
        console.log('❌ DEPLOYMENT FAILED!');
        console.error(err);
    });

ftpDeploy.on('uploading', function (data) {
    console.log(`📤 Uploading: ${data.transferredFileCount} / ${data.totalFilesCount} - ${data.filename}`);
});
