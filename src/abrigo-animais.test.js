import { AbrigoAnimais } from "./abrigo-animais";

describe('Abrigo de Animais', () => {

  test('Deve rejeitar animal inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu');
    expect(resultado.erro).toBe('Animal inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo');
      expect(resultado.lista[0]).toBe('Fofo - abrigo');
      expect(resultado.lista[1]).toBe('Rex - pessoa 1');
      expect(resultado.lista.length).toBe(2);
      expect(resultado.erro).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal intercalando brinquedos', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('BOLA,LASER',
      'BOLA,NOVELO,RATO,LASER', 'Mimi,Fofo,Rex,Bola');

      expect(resultado.lista[0]).toBe('Bola - abrigo');
      expect(resultado.lista[1]).toBe('Fofo - pessoa 2');
      expect(resultado.lista[2]).toBe('Mimi - abrigo');
      expect(resultado.lista[3]).toBe('Rex - abrigo');
      expect(resultado.lista.length).toBe(4);
      expect(resultado.erro).toBeFalsy();
  });

  test('Deve rejeitar brinquedo inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('BRINQUEDO_INEXISTENTE,BOLA', 'RATO,BOLA', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve rejeitar brinquedos duplicados', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,RATO,BOLA', 'LASER,BOLA', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve rejeitar animais duplicados', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'LASER,BOLA', 'Rex,Rex');
    expect(resultado.erro).toBe('Animal inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Gatos não devem dividir brinquedos (regra 3)', () => {
    // Se ambas pessoas podem adotar um gato, ele fica no abrigo (gatos não dividem)
    const resultado = new AbrigoAnimais().encontraPessoas('BOLA,LASER', 'BOLA,LASER', 'Mimi');
    expect(resultado.lista[0]).toBe('Mimi - abrigo'); // Ambas podem, então fica no abrigo
    expect(resultado.erro).toBeFalsy();
  });

  test('Ambas pessoas podem adotar - animal fica no abrigo (regra 4)', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'RATO,BOLA', 'Rex');
    expect(resultado.lista[0]).toBe('Rex - abrigo');
    expect(resultado.erro).toBeFalsy();
  });

  test('Pessoa não pode levar mais de 3 animais (regra 5)', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA,LASER,CAIXA,NOVELO,SKATE', 
      'BOLA', 
      'Rex,Mimi,Bebe,Bola'
    );
    // Pessoa 1 pode adotar Rex, Mimi e Bebe (3 animais), Bola vai para abrigo
    expect(resultado.lista).toContain('Bola - abrigo');
    expect(resultado.erro).toBeFalsy();
  });

  test('Loco não se importa com ordem se tiver companhia (regra 6)', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,SKATE,BOLA', 
      'BOLA', 
      'Rex,Loco'
    );
    // Rex vai para pessoa 1, então Loco tem companhia e pode ir para pessoa 1 também (mesmo com ordem errada)
    expect(resultado.lista[0]).toBe('Loco - pessoa 1');
    expect(resultado.lista[1]).toBe('Rex - pessoa 1');
    expect(resultado.erro).toBeFalsy();
  });

  test('Loco sem companhia deve seguir ordem normal', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,SKATE', 
      'SKATE,RATO', 
      'Loco'
    );
    // Sem companhia, Loco deve seguir a ordem: SKATE, RATO
    expect(resultado.lista[0]).toBe('Loco - pessoa 2');
    expect(resultado.erro).toBeFalsy();
  });

  test('Deve manter ordem alfabética na saída', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA,LASER,CAIXA,NOVELO', 
      'LASER,RATO,BOLA', 
      'Zero,Rex,Mimi,Bebe'
    );
    // Verificar se está em ordem alfabética
    const nomes = resultado.lista.map(item => item.split(' - ')[0]);
    const nomesOrdenados = [...nomes].sort();
    expect(nomes).toEqual(nomesOrdenados);
    expect(resultado.erro).toBeFalsy();
  });
});
