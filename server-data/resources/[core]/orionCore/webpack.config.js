const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const createConfig = (entry, isProduction, variables = {}, target = undefined) => {
    const plugins = [
        new webpack.DefinePlugin({
            ...variables,
            IS_PRODUCTION: JSON.stringify(isProduction),
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^mssql$|^mysql$|^mongodb$|^oracledb$|^sqlite3$|^pg-native$|^better-sqlite3$|^hdb-pool$|^@sap\/hana-client$|^typeorm-aurora-data-api-driver$|^redis$|^react-native-sqlite-storage$/,
        }),
        new webpack.ContextReplacementPlugin(
            /typeorm$/,
            (data) => {
                delete data.dependencies[0].critical;
                return data;
            }
        ),
    ];

    const buildPath = path.resolve(__dirname, 'build');

    return {
        target: target,
        entry,
        output: {
            filename: '[name].js',
            path: buildPath,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
            alias: {
                // Ajoutez des alias ici si besoin
            },
        },
        plugins,
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'swc-loader',
                        options: {
                            jsc: {
                                parser: {
                                    syntax: 'typescript',
                                    tsx: true,
                                    decorators: true,
                                },
                                target: 'es2020',
                                transform: {
                                    react: {
                                        runtime: 'automatic',
                                        development: !isProduction,
                                    },
                                    optimizer: {
                                        simplify: true,
                                        globals: {
                                            vars: {
                                                ...variables,
                                                IS_PRODUCTION: JSON.stringify(isProduction),
                                            },
                                        },
                                    },
                                },
                                keepClassNames: true,
                            },
                            sourceMaps: !isProduction,
                            minify: isProduction,
                        },
                    },
                },
            ],
        },
    };
};

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    const clientConfig = createConfig(
        { client: './src/client/main.ts' },
        isProduction,
        { IS_SERVER: 'false', IS_CLIENT: 'true' },
        'node'
    );

    const serverConfig = createConfig(
        { server: './src/server/main.ts' },
        isProduction,
        { IS_SERVER: 'true', IS_CLIENT: 'false', __dirname: JSON.stringify(path.resolve(__dirname, 'build')) },
        'node'
    );

    return [clientConfig, serverConfig];
};
