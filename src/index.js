const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let windows = new Set();

const createMainWindow = () => {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });
  windows.add(mainWindow);
  mainWindow.on("closed", () => {
	  windows.delete(mainWindow);
	  mainWindow = null;
		for (x in windows)
		{
			x.close(); //This doesn't seem to work?
		}
		app.quit();
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'mainWindow.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const createOverlay = (stream) => {
  // Create the browser window.
  let overlayWindow = new BrowserWindow({
    width: 800,
    height: 600,
	frame: false,
	transparent: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  windows.add(overlayWindow);
  overlayWindow.on("closed", () => {
	  windows.delete(overlayWindow);
	  overlayWindow = null;
  })
  
  overlayWindow.setIgnoreMouseEvents(true);
  overlayWindow.setAlwaysOnTop(true, "floating");

	//Send initialization data
	overlayWindow.webContents.send('stream', stream);

  // and load the overlay.html of the app.
  overlayWindow.loadFile(path.join(__dirname, 'overlay.html'));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('spawn-overlay', (stream) => createOverlay(stream));

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
