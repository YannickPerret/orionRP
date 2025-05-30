export declare const IS_CLIENT: boolean;
export declare const IS_SERVER: boolean;
export declare const IS_PRODUCTION: boolean;
export declare const CORE_DIRNAME: string;
export declare let __dirname: string;
export declare let __filename: string;

if (IS_SERVER) {
    global.__dirname = process.cwd() + '/resources/[core]/orionCore/build';
    global.__filename = global.__dirname + '/server.js';

    if (!process.cwd().match(/orionCore/)) {
        process.chdir('resources/[core]/orionCore');
    }
}
