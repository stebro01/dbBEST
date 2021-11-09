const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')
const dbman = require('./dbman')


contextBridge.exposeInMainWorld(
  'electron',
  {
    doThing: () => {
        ipcRenderer.send('do-a-thing')
        console.log('hi')
    },
    readFile: fs.readFileSync,
    path: path,
    dbman: dbman
  }
)