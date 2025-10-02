const terminal = document.getElementById('terminal');
const input = document.getElementById('commandInput');

const users = {
  dalek: '3006648',
  user2: '12345',
  user3: '12345'
};

let loggedInUser = null;
let loginStep = null;
let tempUser = '';

const commands = {
  help: () => `Available commands:\nhelp - show this help\nclear - clear the terminal\necho [text] - repeat the text\ndate - show current date and time\nwhoami - show logged-in user`,
  clear: () => {
    terminal.innerHTML = '';
    return '';
  },
  echo: (args) => args.join(' '),
  date: () => new Date().toString(),
  whoami: () => `Logged in as: ${loggedInUser}`,
  login: () => {
    if (loggedInUser) return `Already logged in as ${loggedInUser}`;
    loginStep = 'username';
    return 'Enter username:';
  }
};

function runCommand(cmd) {
  cmd = cmd.trim();
  if (cmd === '') return;

  if (loginStep === 'username') {
    tempUser = cmd;
    if (users[tempUser]) {
      loginStep = 'password';
      terminal.innerHTML += `> ${cmd}\nEnter password:\n`;
    } else {
      terminal.innerHTML += `> ${cmd}\nUser not found.\n`;
      loginStep = null;
    }
    terminal.scrollTop = terminal.scrollHeight;
    return;
  }

  if (loginStep === 'password') {
    if (cmd === users[tempUser]) {
      loggedInUser = tempUser;
      terminal.innerHTML += `> ********\nLogin successful. Welcome, ${loggedInUser}!\n`;
    } else {
      terminal.innerHTML += `> ********\nIncorrect password.\n`;
    }
    loginStep = null;
    terminal.scrollTop = terminal.scrollHeight;
    return;
  }

  const parts = cmd.split(' ');
  const base = parts[0];
  const args = parts.slice(1);

  if (!loggedInUser && base !== 'login') {
    terminal.innerHTML += `> ${cmd}\nPlease login first using the 'login' command.\n`;
    terminal.scrollTop = terminal.scrollHeight;
    return;
  }

  let output;
  if (commands[base]) {
    output = commands[base](args);
  } else {
    output = `Command not found: ${base}`;
  }

  terminal.innerHTML += `> ${cmd}\n${output}\n`;
  terminal.scrollTop = terminal.scrollHeight;
}

input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    runCommand(input.value);
    input.value = '';
  }
});
