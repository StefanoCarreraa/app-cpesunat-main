export function applyInputRestriction(inputElement: HTMLInputElement, pattern: RegExp): void {
  inputElement.addEventListener('input', () => {
    const value = inputElement.value;
    inputElement.value = value.replace(pattern, '');
  });
}

export function cambiarFormatoFecha(fecha) {
  var partes = fecha.split('/');
  var dia = partes[0];
  var mes = partes[1];
  var anio = partes[2];
  return anio + '-' + mes + '-' + dia;
}
