document.addEventListener('DOMContentLoaded', () => {
    const passwordModal = document.getElementById('passwordModal');
    const goalModal = document.getElementById('goalModal');
    const closePasswordModal = document.getElementById('closePasswordModal');
    const closeModal = document.getElementById('closeModal');
    const submitPassword = document.getElementById('submitPassword');
    const openModal = document.getElementById('openModal');
    const mainContainer = document.querySelector('.container');
    let goals = [];

    // Mostrar o modal de senha ao carregar a página
    passwordModal.style.display = 'flex';

    closePasswordModal.onclick = () => {
        passwordModal.style.display = 'none';
    };

    submitPassword.onclick = () => {
        const passwordInput = document.getElementById('passwordInput').value;
        if (passwordInput === '73883981') { // Substitua 'suaSenhaSegura' pela sua senha
            passwordModal.style.display = 'none';
            openModal.style.display = 'block'; // Mostra o botão de adicionar
            loadGoals();
        } else {
            alert('Senha incorreta!');
        }
    };

    openModal.onclick = () => {
        resetModal();
        goalModal.style.display = 'flex';
    };

    closeModal.onclick = () => {
        goalModal.style.display = 'none';
    };

    document.getElementById('goalForm').addEventListener('submit', function (e) {
        e.preventDefault();
        addOrUpdateGoal();
        goalModal.style.display = 'none'; // Fecha o modal após adicionar ou atualizar
    });

    function resetModal() {
        document.getElementById('goalInput').value = '';
        document.getElementById('dateInput').value = '';
        document.getElementById('noteInput').value = '';
        document.getElementById('editIndex').value = '-1';
        document.getElementById('modalTitle').innerText = 'Adicionar Nova Meta';
    }

    function addOrUpdateGoal() {
        const goalInput = document.getElementById('goalInput').value;
        const dateInput = document.getElementById('dateInput').value;
        const noteInput = document.getElementById('noteInput').value;
        const editIndex = document.getElementById('editIndex').value;

        if (editIndex === '-1') {
            goals.push({ goalInput, dateInput, noteInput, status: 'Pendente' });
        } else {
            goals[editIndex] = { goalInput, dateInput, noteInput, status: goals[editIndex].status };
        }

        saveGoals();
        loadGoals();
    }

    function loadGoals() {
        const goalList = document.getElementById('goalList');
        goalList.innerHTML = '';
        goals.forEach((goal, index) => {
            const li = document.createElement('li');
            li.setAttribute('draggable', true);
            li.setAttribute('data-index', index);
            li.innerHTML = `
                <div style="width:250px;">
                    <strong>${goal.goalInput}</strong> - <em>${goal.dateInput}</em><br>
                    <small>${goal.noteInput}</small>
                </div>
                <div style="width:100px;">
                    <button class="button3" onclick="toggleStatus(this)" style="background-color: ${goal.status === 'Feita' ? '#1acb14' : '#00c1e3'};">
                        ${goal.status}
                    </button>
                </div>
                <div style="width:70px;">
                    <button class="button1" onclick="editGoal(${index})"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="button2" onclick="removeGoal(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            
            goalList.appendChild(li);
        });
    
        attachDragEvents();
    }
    
    
    window.toggleStatus = function (button) {
        const li = button.closest('li');
        const index = li.getAttribute('data-index');
        const goal = goals[index];
    
        // Alterna o status
        goal.status = goal.status === 'Pendente' ? 'Feita' : 'Pendente';
    
        // Salva as metas
        saveGoals();
        loadGoals(); // Atualiza a lista
    };
    
    
    
    window.removeGoal = function (index) {
        goals.splice(index, 1);
        saveGoals();
        loadGoals();
    };

    window.editGoal = function (index) {
        const goal = goals[index];
        document.getElementById('goalInput').value = goal.goalInput;
        document.getElementById('dateInput').value = goal.dateInput;
        document.getElementById('noteInput').value = goal.noteInput;
        document.getElementById('editIndex').value = index;
        document.getElementById('modalTitle').innerText = 'Editar Meta';
        goalModal.style.display = 'flex';
    };

    function saveGoals() {
        localStorage.setItem('goals', JSON.stringify(goals));
    }

    function loadSavedGoals() {
        goals = JSON.parse(localStorage.getItem('goals')) || [];
    }

    function attachDragEvents() {
        const goalItems = document.querySelectorAll('#goalList li');

        goalItems.forEach(item => {
            item.addEventListener('dragstart', dragStart);
            item.addEventListener('dragover', dragOver);
            item.addEventListener('drop', drop);
        });
    }

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-index'));
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData('text/plain');
        const targetIndex = e.target.closest('li').getAttribute('data-index');

        if (draggedIndex !== targetIndex) {
            const draggedGoal = goals[draggedIndex];
            goals.splice(draggedIndex, 1);
            goals.splice(targetIndex, 0, draggedGoal);
            saveGoals();
            loadGoals();
        }
    }

    loadSavedGoals();
});

const dateInput = document.getElementById('dateInput');

dateInput.addEventListener('input', function () {
    // Remove qualquer caractere que não seja número
    this.value = this.value.replace(/\D/g, '');

    // Formata a entrada
    if (this.value.length >= 2) {
        this.value = this.value.replace(/(\d{2})(\d+)/, '$1/$2');
    }
    if (this.value.length >= 5) {
        this.value = this.value.replace(/(\d{2}\/\d{2})(\d+)/, '$1/$2');
    }
});