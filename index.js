class Funcionamento {
  constructor(save, modal) {
    // Seletores html
    this.selector = (item) => document.querySelector(item);
    this.modal = this.selector(modal);
    this.save = this.selector(save);
    this.tbody = this.selector('tbody');
    
    this.seletorId = (id) => document.getElementById(id);
    this.sNome = this.seletorId('$nome');
    this.sFuncao = this.seletorId('$funcao');
    this.sSalario = this.seletorId('$salario');

    // Geral
    this.ativo = 'active';
    this.itens = '';
    this.id = '';

    // BD LocalStorage
    this.getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
    this.setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(this.itens));
  }

  initialInfo(index) {
    this.i = index.path[3].querySelectorAll('td');
    this.j = document.querySelector('tbody');
    this.g = Array.from(this.j.querySelectorAll('tr'));

    this.number = this.g.map((v, n) => {
      let valor = v.querySelectorAll('td')[0].innerHTML == this.i[0].innerHTML;
      if (valor) {
        return n
      }
    })
  }

  openModal(edit, index) {
    this.modal.classList.add(this.ativo);
    this.modal.onclick = (e) => {
      if (e.target.className.indexOf('modal-container') !== -1) {
          this.modal.classList.remove(this.ativo);
      }
    }

    if (edit) {
      this.initialInfo(index)
      this.sNome.value = this.i[0].innerHTML;
      this.sFuncao.value = this.i[1].innerHTML;
      this.sSalario.value = parseInt(this.i[2].innerHTML.replace('R$', ''));
      this.id = index;
    } else {
      this.sNome.value = '';
      this.sFuncao.value = '';
      this.sSalario.value = '';
      this.id = undefined;
     }
  }

  addItem(index) {
    var edit = false
    this.openModal(edit, index)
  }
  
  editItem(index) {
    var edit = true
    this.openModal(edit, index)
  }
  
  deleteItem(index) {
    this.initialInfo(index)
    let posicaoRemove = this.number.map(x => {
      if (x !== undefined) {
        return x
      }
    })

    this.itens.splice(posicaoRemove.sort()[0], 1);
    this.setItensBD();
    this.loadItens();
    this.addEventsButtons()
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
  
  saveItem(e) {
    if (this.sNome.value == '' || this.sFuncao.value == '' || this.sSalario.value == '') {
      return
    };
    e.preventDefault();
    
    if (this.id !== undefined) {
      let posicao = this.number.map(x => {
        if (x !== undefined) {
          return x
        }
      })
      
      this.itens[posicao.sort()[0]].nome = this.sNome.value;
      this.itens[posicao.sort()[0]].funcao = this.sFuncao.value;
      this.itens[posicao.sort()[0]].salario = this.sSalario.value;
    } else {
      this.itens.push({'nome': this.sNome.value, 'funcao': this.sFuncao.value, 'salario': this.sSalario.value})
    };

    this.setItensBD();
    this.modal.classList.remove(this.ativo);
    this.loadItens();
    this.id = undefined;
    this.addEventsButtons()
  }
  
  addEventsButtons() {
    this.add = this.selector('#new');
    this.edit = document.querySelectorAll('.edit');
    this.remove = document.querySelectorAll('.remove');
    this.add.addEventListener('click', this.addItem);
    this.save.addEventListener('click', this.saveItem)

    if (this.remove !== null || this.edit !== null) {
      this.edit.forEach(i => i.addEventListener('click', this.editItem))
      this.remove.forEach(i => i.addEventListener('click', this.deleteItem))
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
    this.loadItens()
    this.bindEvents()
    this.addEventsButtons()
    return this
  }
}

const funcionamento = new Funcionamento('#btnSalvar', '.modal-container')
funcionamento.init()
