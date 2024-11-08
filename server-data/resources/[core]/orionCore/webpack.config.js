const path = require('path');
const webpack = require('webpack');

const createConfig = (entry, isProduction, variables = {}, port = undefined, target = undefined) => {
    const plugins = [
        new webpack.DefinePlugin({
            ...variables,
            IS_PRODUCTION: JSON.stringify(isProduction),
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^mssql$|^mysql$|^mongodb$|^oracledb$|^sqlite3$|^pg-native$|^better-sqlite3$|^hdb-pool$|^@sap\/hana-client$|^typeorm-aurora-data-api-driver$|^redis$|^react-native-sqlite-storage$|^pg$|^pg-query-stream$|^@google-cloud\/spanner$|^sql\.js$/,
        }),
        new webpack.ContextReplacementPlugin(
            /typeorm$/,
            (data) => {
                if (Array.isArray(data.dependencies)) {
                    data.dependencies.forEach((dependency) => {
                        if (dependency.critical) {
                            delete dependency.critical;
                        }
                    });
                }
                return data;
            }
        ),
    ];

    return {
        target: target,
        entry,
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'build'),
            library: {
                type: 'commonjs2',
            },
        },
        resolve: {
            extensions: ['.ts', '.js', '.json'],
            fallback: {
                fs: false,
                path: require.resolve('path-browserify'),
            },
        },
        externals: [
            {
                typeorm: 'commonjs typeorm',
                pg: 'commonjs pg',
                'pg-query-stream': 'commonjs pg-query-stream',
                '@google-cloud/spanner': 'commonjs @google-cloud/spanner',
                'sql.js': 'commonjs sql.js',
            },
        ],
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
                                transform: {
                                    legacyDecorator: true,
                                    decoratorMetadata: true,
                                },
                                target: 'es2020',
                                keepClassNames: true,
                                baseUrl: path.resolve(__dirname),
                            },
                            sourceMaps: !isProduction,
                            minify: isProduction,
                        },
                    },
                },
            ],
        },
        optimization: {
            usedExports: true,
        },
    };
};

module.exports = (env, argv) => {
    const buildPath = path.resolve(__dirname, 'build');

    return [
        createConfig(
            { client: './src/client/main.ts' },
            argv.mode === 'production',
            { IS_SERVER: 'false', IS_CLIENT: 'true' },
            undefined,
            'node'
        ),
        createConfig(
            { server: './src/server/main.ts' },
            argv.mode === 'production',
            {
                IS_SERVER: 'true',
                IS_CLIENT: 'false',
                __dirname: '"' + buildPath + '"'
            },
            undefined,
            'node'
        ),
    ];
};
