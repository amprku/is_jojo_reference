module.exports = {
    entry: [
        './src/index.jsx'
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
                 {
                  test: /\.css$/,
                  use: [
                     { loader: 'style-loader' },
                     { loader: 'css-loader' }
                 ]
                     // , include: /flexboxgrid/
            }
        ]
    },
    output: {
        path: __dirname + '/static',
        filename: 'bundle.js'
    }
};
