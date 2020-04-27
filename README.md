# Web-Audio-Editor-Test

![GitHub package.json version](https://img.shields.io/github/package-json/v/jamiegluk/Web-Audio-Editor-Test?color=blue)
![GitHub build Workflow Status](https://img.shields.io/github/workflow/status/jamiegluk/Web-Audio-Editor-Test/Node.js%20CI%20and%20Grunt)
![GitHub publish Workflow Status](https://img.shields.io/github/workflow/status/jamiegluk/Web-Audio-Editor-Test/Publish%20Website?label=publish)
![Website](https://img.shields.io/website?url=https%3A%2F%2Ftesting.jamiegl.com%2Faudioeditor%2F%23)

[Click to View App Online](https://testing.jamiegl.com/audioeditor/#).  
Test audio player. Demonstrates basic use of Web Audio API, Material Design and file drag-and-drop.

## IMPORTANT

**This project's code is old, from 2017; do not view this as an example of my current work.**

This is simply a proof-of-concept and, as such, many features could be improved.  
I only update this project to resolve a failing build or security flaws.

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

## Notable Dependencies

![David](https://img.shields.io/david/jamiegluk/Web-Audio-Editor-Test)

![grunt dependency version](https://img.shields.io/github/package-json/dependency-version/jamiegluk/Web-Audio-Editor-Test/dev/grunt?logo=npm&style=social)
![grunt-sass dependency version](https://img.shields.io/github/package-json/dependency-version/jamiegluk/Web-Audio-Editor-Test/dev/grunt-sass?logo=npm&style=social)
![material-components-web dependency version](https://img.shields.io/github/package-json/dependency-version/jamiegluk/Web-Audio-Editor-Test/material-components-web?logo=npm&style=social)
