const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // Entry point of your application
  output: {
    filename: 'bundle.js', // Name of the output bundle
    path: path.resolve(__dirname, 'dist') // Directory to output the bundle
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'] // File extensions to resolve
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Apply this rule to TypeScript files
        exclude: /node_modules/, // Don't apply to files in node_modules
        use: 'ts-loader' // Use ts-loader for TypeScript files
      },
      {
        test: /\.css$/, // Apply this rule to CSS files
        use: ['style-loader', 'css-loader'] // Use these loaders for CSS files
      },
      {
        test: /\.(png|svg|jpg|gif)$/, // Apply this rule to image files
        use: ['file-loader'] // Use file-loader for image files
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // Clean the dist directory before each build
    new HtmlWebpackPlugin({ // Generate HTML file with script tag injected
      template: './public/index.html'
    })
  ]
};

