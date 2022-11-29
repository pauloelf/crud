class Funcionamento {
  constructor(modal, tbody) {
    this.selector = (item) => document.querySelector(item);
    this.selectorId = (id) => document.getElementById(id);
    this.modal = this.selector(modal);
    this.tbody = this.selector(tbody);

    this.save = this.selectorId('$btnSalvar');
    this.add = this.selectorId('new');
    this.sNome = this.selectorId('$nome');
    this.sFuncao = this.selectorId('$funcao');
    this.sSalario = this.selectorId('$salario');

    this.getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
    this.setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(this.itens));
    this.ativo = 'active';
    this.itens = '';
  }

  addItem(index) {
    this.openModal(false, index);
  }
  
  editItem(index) {
    this.openModal(true, index);
  }
  
  deleteItem(index) {
    this.getItens(index);
    this.itens.splice(this.index, 1);
    this.setItensBD();
    this.loadItens();
    this.addEventsButtons();
  }

  openModal(edit, index) {
    this.modal.classList.add(this.ativo);
    this.modal.onclick = (e) => {
      if (e.target.className.indexOf('modal-container') !== -1) {
          this.modal.classList.remove(this.ativo);
      }
    }

    if (edit) {
      this.getItens(index);
      this.sNome.value = this.idx[0].innerHTML;
      this.sFuncao.value = this.idx[1].innerHTML;
      this.sSalario.value = parseInt(this.idx[2].innerHTML.replace('R$', ''));
      this.edit = edit;
    } else {
      this.sNome.value = '';
      this.sFuncao.value = '';
      this.sSalario.value = '';
      this.edit = edit;
     }
  }

  saveItem(e) {
    if (this.sNome.value == '' || this.sFuncao.value == '' || this.sSalario.value == '') {
      return
    };
    e.preventDefault();
    
    if (this.edit) {
      this.itens[this.index].nome = this.sNome.value;
      this.itens[this.index].funcao = this.sFuncao.value;
      this.itens[this.index].salario = this.sSalario.value;
    } else {
      this.itens.push({'nome': this.sNome.value, 'funcao': this.sFuncao.value, 'salario': this.sSalario.value});
    };

    this.setItensBD();
    this.modal.classList.remove(this.ativo);
    this.loadItens();
    this.addEventsButtons();
  }
  
  insertItem(item, index) {
    let tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.funcao}</td>
      <td>R$ ${item.salario}
      <td class="acao">
        <button class="edit"><i class="bx bx-edit"></i></button>
      </td>
      <td class="acao">
        <button class="remove"><i class='bx bx-trash'></i></button>
      </td>
    `;
    this.tbody.appendChild(tr);
  }

  getItens(index) {
    this.idx = index.path[3].querySelectorAll('td');
    if (this.idx.length > 5) {
      this.idx = index.path[2].querySelectorAll('td')
    }
    this.itens.forEach((item, index) => {
      if(item.nome == this.idx[0].innerHTML) {
        this.index = index;
        this.item = item;
      };
    });
  }
  
  addEventsButtons() {
    this.edit = document.querySelectorAll('.edit');
    this.remove = document.querySelectorAll('.remove');
    this.add.addEventListener('click', this.addItem);
    this.save.addEventListener('click', this.saveItem);

    if (this.remove !== null || this.edit !== null) {
      this.edit.forEach(i => i.addEventListener('click', this.editItem));
      this.remove.forEach(i => i.addEventListener('click', this.deleteItem));
    }
  }
  
  bindEvents() {
    this.openModal = this.openModal.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.addItem = this.addItem.bind(this);
  }
  
  loadItens() {
    this.itens = this.getItensBD();
    this.tbody.innerHTML = '';
    this.itens.forEach((item, index) => {
      this.insertItem(item, index);
    });
  }
  
  init() {
    this.loadItens();
    this.bindEvents();
    this.addEventsButtons();
    return this
  }
}

const funcionamento = new Funcionamento('.modal-container', 'tbody');
funcionamento.init();
