const terminal = document.getElementById('terminal');
    const input = document.getElementById('commandInput');

    const users = {
      dalek: { password: '3006648', perm: 2 },
      user2: { password: '12345', perm: 1 },
      user3: { password: '12345', perm: 1 }
    };

    let loggedInUser = null;
    let loggedInPerm = null;
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
      user: () => `Logged in as: ${loggedInUser}`,
      enablesystem: (args) => {
  if (loggedInPerm < 2) {
    return "Permission denied: you do not have access to this command.";
  }
  return `Enabling System: ${args}`;
},
      login: () => {
        if (loggedInUser) return `Already logged in as ${loggedInUser}`;
        loginStep = 'username';
        return 'Enter username:';
      }
    };

    function runCommand(cmd) {
      cmd = cmd.trim();
      if (cmd === '') return;

      // Login flow
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
        if (cmd === users[tempUser].password) {
          loggedInUser = tempUser;
          loggedInPerm = users[tempUser].perm;
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

      // Block all commands except login if not logged in
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
