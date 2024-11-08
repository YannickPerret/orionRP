const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const createConfig = (entry, isProduction, variables = {}, port = 8080, target = undefined) => {
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

    if (!isProduction) {
        // Plugins utiles pour le mode développement
        plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    const buildPath = path.resolve(__dirname, 'build');

    return {
        mode: isProduction ? 'production' : 'development',
        target: target,
        entry,
        output: {
            filename: '[name].js',
            path: buildPath,
            sourceMapFilename: '[file].map', // Pour faciliter la lecture des sources dans le navigateur
            pathinfo: !isProduction, // Ajoute des commentaires dans la sortie pour identifier les modules
        },
        devtool: isProduction ? false : 'eval-source-map', // Utilisez 'cheap-module-source-map' si 'eval-source-map' est trop lent
        devServer: !isProduction
            ? {
                static: {
                    directory: path.join(__dirname, 'public'), // Répertoire des fichiers statiques
                },
                port: port, // Choisissez le port approprié pour votre projet
                hot: true, // Active le rechargement à chaud
                open: true, // Ouvre automatiquement le navigateur
                compress: true, // Active la compression gzip pour de meilleures performances
                historyApiFallback: true, // Pour supporter le routage côté client
            }
            : undefined,
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
                                        simplify: !isProduction,
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
    const buildPath = path.resolve(__dirname, 'build');
    const isProduction = argv.mode === 'production';

    const clientConfig = createConfig(
        { client: './src/client/main.ts' },
        isProduction,
        { IS_SERVER: 'false', IS_CLIENT: 'true' },
        8080,
        'web'
    );

    const serverConfig = createConfig(
        { server: './src/server/main.ts' },
        isProduction,
        { IS_SERVER: 'true', IS_CLIENT: 'false', __dirname: JSON.stringify(buildPath) },
        undefined,
        'node'
    );

    return [clientConfig, serverConfig];
};
