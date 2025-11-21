/* ------------------------------------
   CONFIGURAÇÃO DA API
------------------------------------ */
const BASE_URL = 'http://localhost:8080';

/* ------------------------------------
   FUNÇÕES DA API
------------------------------------ */

// Criar produto
async function criarProduto(nome, descricao, imagens, preco) {
  try {
    const response = await fetch(`${BASE_URL}/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nome,
        description: descricao,
        images: imagens,
        price: preco
      })
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const resultado = await response.json();
    console.log('Produto criado:', resultado);
    return resultado;
  } catch (erro) {
    console.error('Erro ao criar produto:', erro);
    throw erro;
  }
}

// Listar todos os produtos
async function listarTodosProdutos() {
  try {
    const response = await fetch(`${BASE_URL}/product`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const produtos = await response.json();
    console.log('Produtos carregados:', produtos);
    return produtos;
  } catch (erro) {
    console.error('Erro ao listar produtos:', erro);
    throw erro;
  }
}

// Buscar produto por ID
async function buscarProdutoPorId(id) {
  try {
    const response = await fetch(`${BASE_URL}/product/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const produto = await response.json();
    return produto;
  } catch (erro) {
    console.error('Erro ao buscar produto:', erro);
    throw erro;
  }
}

// Atualizar produto
async function atualizarProduto(id, nome, descricao, imagens, preco) {
  try {
    const response = await fetch(`${BASE_URL}/product/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nome,
        description: descricao,
        images: imagens,
        price: preco
      })
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const resultado = await response.json();
    console.log('Produto atualizado:', resultado);
    return resultado;
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);
    throw erro;
  }
}

// Deletar produto
async function deletarProduto(id) {
  try {
    const response = await fetch(`${BASE_URL}/product/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    console.log('Produto deletado com sucesso');
    return true;
  } catch (erro) {
    console.error('Erro ao deletar produto:', erro);
    throw erro;
  }
}

/* ------------------------------------
   CADASTRO DE PRODUTO (cadastro.html)
------------------------------------ */
function inicializarCadastro() {
  const form = document.getElementById("formCadastroProduto");
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nome = document.getElementById("produtoNome").value;
      const descricao = document.getElementById("produtoDesc").value;
      const preco = parseFloat(document.getElementById("produtoPreco").value);
      const imagemUrl = document.getElementById("produtoImg").value;
      
      try {
        await criarProduto(nome, descricao, imagemUrl ? [imagemUrl] : [], preco);
        alert('✅ Produto cadastrado com sucesso!');
        form.reset();
        window.location.href = "produtos.html";
      } catch (erro) {
        alert('❌ Erro ao cadastrar produto! Verifique se o backend está rodando.');
        console.error(erro);
      }
    });
  }
}

/* ------------------------------------
   LISTAGEM DE PRODUTOS (produtos.html)
------------------------------------ */
async function carregarProdutos() {
  const lista = document.getElementById("listaProdutos");
  if (!lista) return;

  // Mostrar mensagem de carregamento
  lista.innerHTML = '<p style="text-align: center;">Carregando produtos...</p>';

  try {
    // Buscar produtos da API
    const produtos = await listarTodosProdutos();
    
    // Limpar container
    lista.innerHTML = '';

    // Se não houver produtos
    if (produtos.length === 0) {
      lista.innerHTML = '<p style="text-align: center;">Nenhum produto cadastrado ainda.</p>';
      return;
    }

    // Criar card para cada produto
    produtos.forEach((produto, index) => {
      const card = document.createElement("div");
      card.className = "produto-card";
      card.innerHTML = `
        ${produto.images && produto.images[0] ? 
          `<img src="${produto.images[0]}" alt="${produto.name}" onerror="this.src='https://via.placeholder.com/200x150?text=Sem+Imagem'" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px 8px 0 0;">` 
          : '<img src="https://via.placeholder.com/200x150?text=Sem+Imagem" alt="Sem imagem" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px 8px 0 0;">'}
        <div style="padding: 15px;">
          <h3 style="margin: 0 0 10px 0;">${produto.name}</h3>
          <p style="margin: 0 0 10px 0; color: #666;">${produto.description.substring(0, 60)}${produto.description.length > 60 ? '...' : ''}</p>
          <strong style="display: block; margin-bottom: 15px; font-size: 1.2em; color: #6a4c93;">R$ ${produto.price.toFixed(2)}</strong>
          
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button onclick="abrirModal(${produto.id}, ${index})" style="flex: 1; padding: 8px; background: #6a4c93; color: white; border: none; border-radius: 4px; cursor: pointer;">
              👁️ Ver Detalhes
            </button>
            <button onclick="editarProdutoModal(${produto.id})" style="flex: 1; padding: 8px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
              ✏️ Editar
            </button>
            <button onclick="confirmarExclusao(${produto.id}, '${produto.name.replace(/'/g, "\\'")}')" style="flex: 1; padding: 8px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
              🗑️ Excluir
            </button>
          </div>
        </div>
      `;
      lista.appendChild(card);
    });

    // Salvar produtos globalmente para usar no modal
    window.produtosAPI = produtos;

  } catch (erro) {
    lista.innerHTML = `
      <p style="color: red; text-align: center;">❌ Erro ao carregar produtos!</p>
      <p style="text-align: center;">Certifique-se que o backend está rodando em http://localhost:8080</p>
    `;
    console.error('Erro:', erro);
  }
}

/* ------------------------------------
   EXCLUIR PRODUTO
------------------------------------ */
async function confirmarExclusao(id, nome) {
  if (confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
    try {
      await deletarProduto(id);
      alert('✅ Produto excluído com sucesso!');
      // Recarregar lista de produtos
      carregarProdutos();
    } catch (erro) {
      alert('❌ Erro ao excluir produto!');
      console.error(erro);
    }
  }
}

/* ------------------------------------
   EDITAR PRODUTO
------------------------------------ */
async function editarProdutoModal(id) {
  try {
    const produto = await buscarProdutoPorId(id);
    
    // Criar formulário de edição no modal
    const modalBg = document.getElementById("modalBg");
    const modal = modalBg.querySelector(".modal");
    
    modal.innerHTML = `
      <span class="fechar" onclick="fecharModal()" style="cursor: pointer; float: right; font-size: 28px; font-weight: bold;">&times;</span>
      <h2>Editar Produto</h2>
      <form id="formEditarProduto" style="margin-top: 20px;">
        <input type="hidden" id="editId" value="${produto.id}">
        
        <label style="display: block; margin: 10px 0 5px;">Nome:</label>
        <input type="text" id="editNome" value="${produto.name}" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        
        <label style="display: block; margin: 10px 0 5px;">Descrição:</label>
        <textarea id="editDesc" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 80px;">${produto.description}</textarea>
        
        <label style="display: block; margin: 10px 0 5px;">Preço (R$):</label>
        <input type="number" id="editPreco" value="${produto.price}" step="0.01" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        
        <label style="display: block; margin: 10px 0 5px;">URL da Imagem:</label>
        <input type="url" id="editImg" value="${produto.images && produto.images[0] ? produto.images[0] : ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button type="submit" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
            💾 Salvar Alterações
          </button>
          <button type="button" onclick="fecharModal()" style="flex: 1; padding: 10px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Cancelar
          </button>
        </div>
      </form>
    `;
    
    modalBg.style.display = "flex";
    
    // Adicionar evento de submit no formulário de edição
    document.getElementById("formEditarProduto").addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const id = document.getElementById("editId").value;
      const nome = document.getElementById("editNome").value;
      const descricao = document.getElementById("editDesc").value;
      const preco = parseFloat(document.getElementById("editPreco").value);
      const imagemUrl = document.getElementById("editImg").value;
      
      try {
        await atualizarProduto(id, nome, descricao, imagemUrl ? [imagemUrl] : [], preco);
        alert('✅ Produto atualizado com sucesso!');
        fecharModal();
        carregarProdutos();
      } catch (erro) {
        alert('❌ Erro ao atualizar produto!');
        console.error(erro);
      }
    });
    
  } catch (erro) {
    alert('❌ Erro ao buscar dados do produto!');
    console.error(erro);
  }
}

/* ------------------------------------
   MODAL - Ver Detalhes do Produto
------------------------------------ */
function abrirModal(id, index) {
  const produtos = window.produtosAPI;
  if (!produtos) return;

  const produto = produtos[index];
  
  const modalBg = document.getElementById("modalBg");
  const modal = modalBg.querySelector(".modal");
  
  modal.innerHTML = `
    <span class="fechar" onclick="fecharModal()" style="cursor: pointer; float: right; font-size: 28px; font-weight: bold;">&times;</span>
    ${produto.images && produto.images[0] ? 
      `<img src="${produto.images[0]}" alt="${produto.name}" style="max-width: 100%; height: auto; margin-bottom: 15px; border-radius: 8px;" onerror="this.src='https://via.placeholder.com/400x300?text=Sem+Imagem'">` 
      : '<img src="https://via.placeholder.com/400x300?text=Sem+Imagem" alt="Sem imagem" style="max-width: 100%; height: auto; margin-bottom: 15px; border-radius: 8px;">'}
    <h2>${produto.name}</h2>
    <p>${produto.description}</p>
    <h3 style="color: #6a4c93; margin: 15px 0;">R$ ${produto.price.toFixed(2)}</h3>
    <button onclick="fecharModal()" style="margin-top: 15px; padding: 10px 20px; background: #6a4c93; color: white; border: none; border-radius: 4px; cursor: pointer;">Fechar</button>
  `;
  
  modalBg.style.display = "flex";
}

function fecharModal() {
  document.getElementById("modalBg").style.display = "none";
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
  const modal = document.getElementById("modalBg");
  if (event.target === modal) {
    fecharModal();
  }
}

/* ------------------------------------
   INICIALIZAÇÃO
------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  // Se estiver na página de cadastro
  inicializarCadastro();
  
  // Se estiver na página de produtos
  carregarProdutos();
});