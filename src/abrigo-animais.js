class AbrigoAnimais {

  constructor() {
    this.animais = {
      'Rex': { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
      'Mimi': { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
      'Fofo': { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
      'Zero': { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
      'Bola': { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
      'Bebe': { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
      'Loco': { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
    };

    this.brinquedosValidos = ['RATO', 'BOLA', 'LASER', 'CAIXA', 'NOVELO', 'SKATE'];
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    try {
      const pessoa1 = this.parsearBrinquedos(brinquedosPessoa1);
      const pessoa2 = this.parsearBrinquedos(brinquedosPessoa2);
      const animaisParaProcessar = this.parsearAnimais(ordemAnimais);

      const validacao = this.validarEntradas(pessoa1, pessoa2, animaisParaProcessar);
      if (validacao.erro) {
        return validacao;
      }

      const resultado = this.processarAnimais(animaisParaProcessar, pessoa1, pessoa2);
      
      const lista = this.formatarSaida(resultado);

      return { lista };

    } catch (error) {
      return { erro: error.message };
    }
  }

  parsearBrinquedos(brinquedosStr) {
    if (!brinquedosStr || brinquedosStr.trim() === '') {
      return [];
    }
    return brinquedosStr.split(',').map(b => b.trim());
  }

  parsearAnimais(animaisStr) {
    if (!animaisStr || animaisStr.trim() === '') {
      return [];
    }
    return animaisStr.split(',').map(a => a.trim());
  }

  validarEntradas(pessoa1, pessoa2, animaisParaProcessar) {
    // Primeiro validar animais válidos e duplicados
    const animaisUnicos = new Set();
    for (const animal of animaisParaProcessar) {
      if (!this.animais[animal]) {
        return { erro: 'Animal inválido' };
      }
      if (animaisUnicos.has(animal)) {
        return { erro: 'Animal inválido' };
      }
      animaisUnicos.add(animal);
    }

    // Validar brinquedos válidos e duplicados dentro de cada pessoa
    const validarBrinquedosPessoa = (brinquedos) => {
      const brinquedosUnicos = new Set();
      for (const brinquedo of brinquedos) {
        if (!this.brinquedosValidos.includes(brinquedo)) {
          return { erro: 'Brinquedo inválido' };
        }
        if (brinquedosUnicos.has(brinquedo)) {
          return { erro: 'Brinquedo inválido' };
        }
        brinquedosUnicos.add(brinquedo);
      }
      return { valido: true };
    };

    const validacaoPessoa1 = validarBrinquedosPessoa(pessoa1);
    if (validacaoPessoa1.erro) return validacaoPessoa1;

    const validacaoPessoa2 = validarBrinquedosPessoa(pessoa2);
    if (validacaoPessoa2.erro) return validacaoPessoa2;

    return { valido: true };
  }

  processarAnimais(animaisParaProcessar, pessoa1, pessoa2) {
    const resultado = {};
    const contadorAdocoes = { pessoa1: 0, pessoa2: 0 };
    
    // Criar cópias dos brinquedos para não modificar os originais
    const brinquedosPessoa1 = [...pessoa1];
    const brinquedosPessoa2 = [...pessoa2];

    // Verificar se há companhia para Loco (qualquer outro animal além dele)
    const temCompanhiaParaLoco = animaisParaProcessar.length > 1 && animaisParaProcessar.includes('Loco');

    for (const nomeAnimal of animaisParaProcessar) {
      const animal = this.animais[nomeAnimal];
      
      // Verificar quem pode adotar este animal
      const pessoa1Pode = this.podeAdotar(animal, brinquedosPessoa1, nomeAnimal, temCompanhiaParaLoco);
      const pessoa2Pode = this.podeAdotar(animal, brinquedosPessoa2, nomeAnimal, temCompanhiaParaLoco);

      let destino = 'abrigo';

      // Aplicar regras de adoção
      if (pessoa1Pode && pessoa2Pode) {
        // Regra 4: Se ambas podem adotar, ninguém fica com o animal
        destino = 'abrigo';
      } else if (pessoa1Pode && contadorAdocoes.pessoa1 < 3) {
        // Regra 5: Máximo 3 animais por pessoa
        destino = 'pessoa 1';
        contadorAdocoes.pessoa1++;
      } else if (pessoa2Pode && contadorAdocoes.pessoa2 < 3) {
        destino = 'pessoa 2';
        contadorAdocoes.pessoa2++;
      }

      // Regra 3: Gatos não dividem brinquedos
      if (animal.tipo === 'gato' && destino !== 'abrigo') {
        if (destino === 'pessoa 1') {
          this.removerBrinquedosGato(brinquedosPessoa1, animal.brinquedos);
        } else if (destino === 'pessoa 2') {
          this.removerBrinquedosGato(brinquedosPessoa2, animal.brinquedos);
        }
      }

      resultado[nomeAnimal] = destino;
    }

    return resultado;
  }

  podeAdotar(animal, brinquedosPessoa, nomeAnimal, temCompanhiaParaLoco) {
    if (nomeAnimal === 'Loco' && temCompanhiaParaLoco) {
      return this.temTodosBrinquedos(animal.brinquedos, brinquedosPessoa);
    }

    return this.temBrinquedosNaOrdem(animal.brinquedos, brinquedosPessoa);
  }

  temBrinquedosNaOrdem(brinquedosNecessarios, brinquedosPessoa) {
    let indice = 0;
    
    for (const brinquedo of brinquedosPessoa) {
      if (indice < brinquedosNecessarios.length && brinquedo === brinquedosNecessarios[indice]) {
        indice++;
      }
    }
    
    return indice === brinquedosNecessarios.length;
  }

  temTodosBrinquedos(brinquedosNecessarios, brinquedosPessoa) {
    return brinquedosNecessarios.every(brinquedo => brinquedosPessoa.includes(brinquedo));
  }

  removerBrinquedosGato(brinquedosPessoa, brinquedosGato) {
    for (let i = brinquedosPessoa.length - 1; i >= 0; i--) {
      if (brinquedosGato.includes(brinquedosPessoa[i])) {
        brinquedosPessoa.splice(i, 1);
      }
    }
  }

  formatarSaida(resultado) {
    const lista = [];
    
    const animaisOrdenados = Object.keys(resultado).sort();
    
    for (const animal of animaisOrdenados) {
      const destino = resultado[animal];
      lista.push(`${animal} - ${destino}`);
    }
    
    return lista;
  }
}

export { AbrigoAnimais as AbrigoAnimais };
