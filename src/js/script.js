document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const missionForm = document.getElementById('missionForm');
    const addAgentsBtn = document.getElementById('addAgentsBtn');
    const removeAgentsBtn = document.getElementById('removeAgentsBtn');
    const emergencyBtn = document.getElementById('emergencyBtn');
    const notifyAgentsBtn = document.getElementById('notifyAgentsBtn');
    const changeDetailsBtn = document.getElementById('changeDetailsBtn');
    const endMissionBtn = document.getElementById('endMissionBtn');
    const currentMissionDiv = document.getElementById('currentMission');
    const missionLogs = document.getElementById('missionLogs');
    const ongoingMissions = document.getElementById('ongoingMissions');
    const currentAgents = document.getElementById('currentAgents');

    let currentMission = JSON.parse(localStorage.getItem('currentMission'));

    function displayCurrentMission() {
        if (currentMission) {
            currentMissionDiv.innerHTML = `
                <p><strong>Mission Name:</strong> ${currentMission.missionName}</p>
                <p><strong>Description:</strong> ${currentMission.description}</p>
                <p><strong>Agents:</strong> ${currentMission.agents.join(', ')}</p>
                <p><strong>Status:</strong> ${currentMission.status}</p>
            `;
        }
    }

    displayCurrentMission();

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            if (users.some(user => user.username === username)) {
                alert('Username already exists. Please choose another one.');
            } else {
                users.push({ username, password, role: 'Agent', completedMissions: 0 });
                localStorage.setItem('users', JSON.stringify(users));
                alert('User Registration Successful.');
                window.location.href = 'src\\login.html';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('Login successful.');
                window.location.href = 'home.html';
            } else {
                alert('Invalid username or password.');
            }
        });
    }

    if (missionForm) {
        missionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const missionName = document.getElementById('missionName').value;
            const description = document.getElementById('description').value;
            const agents = document.getElementById('agents').value.split(',').map(agent => agent.trim());

            currentMission = { missionName, description, agents, status: 'Ongoing' };
            localStorage.setItem('currentMission', JSON.stringify(currentMission));

            alert('Mission started successfully.');
            displayCurrentMission();
        });
    }

    if (addAgentsBtn) {
        addAgentsBtn.addEventListener('click', () => {
            const agentsToAdd = document.getElementById('modifyAgents').value.split(',').map(agent => agent.trim());
            if (currentMission) {
                currentMission.agents = Array.from(new Set([...currentMission.agents, ...agentsToAdd]));
                localStorage.setItem('currentMission', JSON.stringify(currentMission));
                alert('Agents added successfully.');
                displayCurrentMission();
            } else {
                alert('No ongoing mission to add agents to.');
            }
        });
    }

    if (removeAgentsBtn) {
        removeAgentsBtn.addEventListener('click', () => {
            const agentsToRemove = document.getElementById('modifyAgents').value.split(',').map(agent => agent.trim());
            if (currentMission) {
                currentMission.agents = currentMission.agents.filter(agent => !agentsToRemove.includes(agent));
                localStorage.setItem('currentMission', JSON.stringify(currentMission));
                alert('Agents removed successfully.');
                displayCurrentMission();
            } else {
                alert('No ongoing mission to remove agents from.');
            }
        });
    }

    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            if (currentMission) {
                alert('Emergency imposed on the mission!');
            } else {
                alert('No ongoing mission to impose emergency on.');
            }
        });
    }

    if (notifyAgentsBtn) {
        notifyAgentsBtn.addEventListener('click', () => {
            if (currentMission) {
                alert(`Notifying agents: ${currentMission.agents.join(', ')}`);
            } else {
                alert('No ongoing mission to notify agents.');
            }
        });
    }

    if (changeDetailsBtn) {
        changeDetailsBtn.addEventListener('click', () => {
            if (currentMission) {
                const newMissionName = prompt('Enter new mission name:', currentMission.missionName);
                const newDescription = prompt('Enter new description:', currentMission.description);
                if (newMissionName && newDescription) {
                    currentMission.missionName = newMissionName;
                    currentMission.description = newDescription;
                    localStorage.setItem('currentMission', JSON.stringify(currentMission));
                    alert('Mission details changed successfully.');
                    displayCurrentMission();
                } else {
                    alert('Mission details not changed.');
                }
            } else {
                alert('No ongoing mission to change details of.');
            }
        });
    }

    if (endMissionBtn) {
        endMissionBtn.addEventListener('click', () => {
            const missions = JSON.parse(localStorage.getItem('missions') || '[]');
            if (currentMission) {
                currentMission.status = 'Completed';
                missions.push(currentMission);
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                currentMission.agents.forEach(agentUsername => {
                    const user = users.find(user => user.username === agentUsername);
                    if (user) {
                        user.completedMissions += 1;
                        if (user.completedMissions >= 5) {
                            user.role = 'Senior Agent';
                        } else if (user.completedMissions >= 10) {
                            user.role = 'Director General';
                        } else if (user.completedMissions >= 15) {
                            user.role = 'Secretary';
                        } else if (user.completedMissions >= 20) {
                            user.role = 'Head of Department';
                        }
                    }
                });
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('missions', JSON.stringify(missions));
                localStorage.removeItem('currentMission');
                currentMission = null;
                alert('Mission ended successfully.');
                displayCurrentMission();
                location.reload();
            } else {
                alert('No ongoing mission to end.');
            }
        });
    }
    

    // Display mission logs
    if (missionLogs) {
        const missions = JSON.parse(localStorage.getItem('missions') || '[]');
        missions.forEach(mission => {
            const li = document.createElement('li');
            li.textContent = `${mission.missionName}: ${mission.description} (Status: ${mission.status})`;
            const ul = document.createElement('ul');
            mission.agents.forEach(agent => {
                const agentLi = document.createElement('li');
                agentLi.textContent = agent;
                ul.appendChild(agentLi);
            });
            li.appendChild(ul);
            missionLogs.appendChild(li);
        });
    }

    if (ongoingMissions) {
        const missions = JSON.parse(localStorage.getItem('missions') || '[]');
        missions.filter(mission => mission.status === 'Ongoing').forEach(mission => {
            const li = document.createElement('li');
            li.textContent = `${mission.missionName}: ${mission.description}`;
            const ul = document.createElement('ul');
            mission.agents.forEach(agent => {
                const agentLi = document.createElement('li');
                agentLi.textContent = agent;
                ul.appendChild(agentLi);
            });
            li.appendChild(ul);
            ongoingMissions.appendChild(li);
        });
    }

    if (currentAgents) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.username} - ${user.role} (Completed Missions: ${user.completedMissions})`;
            currentAgents.appendChild(li);
        });
    }
});
