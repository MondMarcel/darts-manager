const Save = {
  key(username) { return "dartsManagerSave_" + username.toLowerCase(); },
  usersKey() { return "dartsManagerUsers"; },
  getUsers() { return JSON.parse(localStorage.getItem(this.usersKey()) || "{}"); },
  setUsers(users) { localStorage.setItem(this.usersKey(), JSON.stringify(users)); },
  login() {
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value;
    const hint = document.getElementById("loginHint");
    if (!username || !password) { hint.textContent = "Bitte Benutzername und Passwort eingeben."; return; }

    const users = this.getUsers();
    if (users[username] && users[username] !== password) {
      hint.textContent = "Passwort falsch.";
      return;
    }
    if (!users[username]) {
      users[username] = password;
      this.setUsers(users);
      State.newGame(username);
      this.save();
    } else {
      const existing = localStorage.getItem(this.key(username));
      if (existing) {
        State.currentUser = username;
        State.game = JSON.parse(existing);
      } else {
        State.newGame(username);
        this.save();
      }
    }
    UI.showAppAfterLogin();
  },
  save() {
    if (!State.currentUser || !State.game) return;
    localStorage.setItem(this.key(State.currentUser), JSON.stringify(State.game));
  },
  logout() {
    State.currentUser = null;
    State.game = null;
    document.getElementById("login-screen").classList.remove("hidden");
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.add("hidden");
  }
};
