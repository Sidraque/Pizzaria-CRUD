export function maskCpf(value) {
    return value
      .replace(/\D/g, '') // remove tudo 
      .slice(0, 11) // limita 11 dígitos
      .replace(/(\d{3})(\d)/, '$1.$2') // coloca um ponto entre o terceiro e o quarto dígitos
      .replace(/(\d{3})(\d)/, '$1.$2') // coloca um ponto entre o sexto e o sétimo dígitos
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // coloca um traço entre o nono e o décimo dígitos
  }
  
  export function maskCep(value) {
    return value
      .replace(/\D/g, '') 
      .slice(0, 8) 
      .replace(/(\d{5})(\d)/, '$1-$2'); // coloca um traço entre o quinto e o sexto dígitos
  }
  
  export function maskTelefone(value) {
    return value
      .replace(/\D/g, '') 
      .slice(0, 11) 
      .replace(/(\d{2})(\d)/, '($1) $2') // coloca parênteses em torno dos dois primeiros dígitos
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2'); // coloca um traço entre o quarto e o quinto dígitos
  }
  