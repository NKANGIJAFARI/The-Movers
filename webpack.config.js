const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const webpack = require('webpack');


module.exports = {
    mode: 'development',
    
    entry: {
        main: ['@babel/polyfill','./src/scripts/main.js'],
        app: './src/scripts/index.js',
        forIndex: './src/scripts/forIndex.js',
        forListings: './src/scripts/propertyListings.js',
        forSignIn: './src/scripts/signInPage.js',
        forChatRoom: './src/scripts/chatScripts/chatFiles',
        postProperty: './src/scripts/postProperty.js',
        userProfile: './src/scripts/userProfile.js',
        authentication: './src/scripts/Auth.js',
        propertyDetails: './src/scripts/propertyDetails.js',
        editPost: './src/scripts/editPost.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename:'[name].bundle.js'
    },    

    devtool: 'eval-source-map',
    devServer: { 
        contentBase: path.join(__dirname, "/dist"),
        compress: true,
        port: 9000
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use:{
                    loader: "babel-loader",
                    query:{
                        "compact": false,
                        presets:["@babel/preset-env"]
                    }
                }
            },
            
            {
                test: /\.html$/,
                use:[{loader: "html-loader"}]
            },

            {
                test: /\.(png|jpe?g|svg|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                    options:{
                        name: '[name].[hash].[ext]',
                        outputPath: "images"
                    }
                  }      
                ]
            },


            {
                test: /\.scss$/i,
                exclude: /\.module.(scss)$/,
                // test: /\.css$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                  ],
            },
            {
                test: /\.css$/i,
                exclude: /\.module.(css)$/,
                // test: /\.css$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader'
                  ],
            },

            {
                test: /\.(svg|eot|woff|woff2|ttf)$/,
                use: ['file-loader']
            }
        ]
    },    

    plugins: [
        new CleanWebpackPlugin(),
        new MinifyPlugin({}, {
            comments: 'false'
        }),

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default']
          }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            chunks: ['main','forIndex', 'authentication']
        }),
        new HtmlWebpackPlugin({
            filename: 'propertyListing.html',
            template: './src/propertyListing.html',
            chunks: ['main','forListings','authentication']
        }),
        new HtmlWebpackPlugin({
            filename: 'signInPage.html',
            template: './src/signInPage.html',
            chunks: ['main','forSignIn']
        }),
        new HtmlWebpackPlugin({
            filename: 'chatroom.html',
            template: './src/chatroom.html',
            chunks: ['main', 'forChatRoom', 'authentication']
        }),
        new HtmlWebpackPlugin({
            filename: 'postProperty.html',
            template: './src/postProperty.html',
            chunks: ['main','postProperty', 'authentication']
        }),
        new HtmlWebpackPlugin({
            filename: 'userProfile.html',
            template: './src/userProfile.html',
            chunks: ['main','userProfile', 'authentication']
        }),
        new HtmlWebpackPlugin({
            filename: 'propertyDetails.html',
            template: './src/propertyDetails.html',
            chunks: ['main','authentication','forListings', 'propertyDetails']
        }),
        new HtmlWebpackPlugin({
            filename: 'editPost.html',
            template: './src/editPost.html',
            chunks: ['main','authentication', 'editPost']
        }),
    ],
}

