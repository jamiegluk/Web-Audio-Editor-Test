# Web-Audio-Editor-Test

[Click to View App Online](https://testing.jamiegl.com/audioeditor/#).
Test audio player. Demonstrates basic use of Web Audio API, Material Design and file drag-and-drop.

This is simply an alpha-stage test and as such, many features could be improved.

## Setting up Build

You need:

- [Node.js](https://nodejs.org) and NPM / `choco install nodejs`
- [Grunt](https://gruntjs.com/) / `npm install -g grunt-cli`
- [Python 2.7](https://www.python.org/downloads/release/python-2713/) / `choco install python2`

Initially build dependencies via this command in the project folder:

    npm install

## Building from Source

To just build the project:

    grunt build

To build the project, launch a live server on http://localhost:4000 and auto-build on further changes:

    grunt
