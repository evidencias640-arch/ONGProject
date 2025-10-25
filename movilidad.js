function manejarMotivoIrse(valor) {
    const motivoIrseGrupo = document.getElementById('motivoIrseGrupo');
    const motivoIrseSelect = document.getElementById('motivoIrse');

    // Opciones que indican que SÍ planea irse (Probablemente o SI definitivo)
    const planeaIrse = ['SI', '3 Meses', '6 Meses', 'En 1 Año', 'Situacion', 'No se'];

    if (planeaIrse.includes(valor)) {
        // HABILITAR y MOSTRAR: Si el valor indica mudanza
        motivoIrseGrupo.style.display = 'block';
        motivoIrseSelect.removeAttribute('disabled');
    } else {
        // BLOQUEAR, LIMPIAR y OCULTAR: Si es 'NO' o no ha seleccionado nada
        motivoIrseGrupo.style.display = 'none';
        motivoIrseSelect.setAttribute('disabled', 'disabled');
        motivoIrseSelect.value = ''; // Limpia el valor antes de enviar
    }
}
