const shell = require('shelljs');

shell.rm('-rf', '.nyc_output');
shell.rm('-rf', 'typings');

// #Folders
shell.rm('-rf', 'appenv');
shell.rm('-rf', 'services');
shell.rm('-rf', 'util');
shell.rm('-rf', 'validation');

// #Files
shell.rm('-rf', 'index.js');
shell.rm('-rf', 'index.js.map');
shell.rm('-rf', 'bind.js');
shell.rm('-rf', 'bind.js.map');
