import 'dotenv/config'
import { BackendApp } from './BackendApp';

try {
    const backend = new BackendApp()
    void backend.start();
} catch (e) {
    console.log(e);
    process.exit(1);
}

process.on('uncaughtException', err => {
    console.log('uncaughtException', err);
    process.exit(1);
});
