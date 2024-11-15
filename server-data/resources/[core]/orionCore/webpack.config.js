const path = require('path');
const webpack = require('webpack');


const createConfig = (entry, outputPath, isProduction, variables = {}, port = undefined, target = undefined) => {
    const plugins = [
        new webpack.DefinePlugin({
            ...variables,
            IS_PRODUCTION: isProduction,
        }),
    ];

    return {
        target: target,
        entry,
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'build'),
        },
        resolve: {
            extensions: ['.ts', '.js', '.json'],
            fallback: {
                fs: false,
                path: 'path-browserify',
            },
        },
        plugins,
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'swc-loader',
                        options: {
                            jsc: {
                                parser: {
                                    syntax: 'typescript',
                                    tsx: false,
                                    decorators: true,
                                },
                                target: 'es2020',
                                transform: {
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
                                baseUrl: '.',
                                paths: {
                                    '@public/*': ['src/*'],
                                    '@core/*': ['src/core/*'],
                                }
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
    return [createConfig(
            { client: './src/client.ts' },
            path.resolve(__dirname, 'build/client'),
            isProduction,
            { IS_SERVER: 'false', IS_CLIENT: 'true' },
            undefined,
            'web'
        ),
        createConfig(
            { server: './src/server.ts' },
            path.resolve(__dirname, 'build/server'),
            isProduction,
            {
                IS_SERVER: 'true',
                IS_CLIENT: 'false',
                __dirname: '"' + path.resolve(__dirname, 'build') + '"',
            },
            undefined,
            'node'
        ),
    ];
};