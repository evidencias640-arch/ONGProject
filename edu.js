// === CONTROL PRINCIPAL ===
// Muestra u oculta los campos según si estudia actualmente o no
function manejarEstudio(valor) {
    const cursoActualGrupo = document.getElementById("cursoActualGrupo");
    const seccionNoEstudia = document.getElementById("seccionNoEstudia");

    if (valor === "si") {
        cursoActualGrupo.style.display = "block";
        seccionNoEstudia.style.display = "none";

        // Limpia selección de la otra sección para evitar envío de datos incoherentes
        limpiarSeleccionNoEstudia();
    } else if (valor === "no") {
        cursoActualGrupo.style.display = "none";
        seccionNoEstudia.style.display = "block";

        // Limpia el curso actual (select) si el usuario dice que NO estudia
        document.getElementById("cursoActual").value = "";
    } else {
        // Estado inicial o sin seleccionar
        cursoActualGrupo.style.display = "none";
        seccionNoEstudia.style.display = "none";
    }
}

// -----------------------------------------------------------------------------

// === SUBCONTROL: MANEJO DE FUTURO ESTUDIO (Solo si NO estudia actualmente) ===
function manejarEstudioFuturo(valor) {
    const cursoFuturoGrupo = document.getElementById("cursoFuturoGrupo");
    const sinEstudiosGrupo = document.getElementById("sinEstudiosGrupo");

    if (valor === "si") {
        cursoFuturoGrupo.style.display = "block";
        sinEstudiosGrupo.style.display = "none";
        document.getElementById("sinEstudios").value = ""; // Limpia el valor oculto
    } else if (valor === "no") {
        cursoFuturoGrupo.style.display = "none";
        sinEstudiosGrupo.style.display = "block";
        document.getElementById("cursoFuturo").value = ""; // Limpia el select de curso
    } else {
        cursoFuturoGrupo.style.display = "none";
        sinEstudiosGrupo.style.display = "none";
    }
}

// -----------------------------------------------------------------------------

// === FUNCIONES DE LIMPIEZA ===
function limpiarSeleccionNoEstudia() {
    // 1. Limpia los radio buttons de "estudioFuturo"
    const radiosFuturo = document.getElementsByName("estudioFuturo");
    radiosFuturo.forEach(r => r.checked = false);

    // 2. Limpia los campos de selección y texto en la sección "no estudia"
    document.getElementById("ultimoAnio").value = "";
    document.getElementById("cursoFuturo").value = "";
    document.getElementById("sinEstudios").value = ""; // Por si acaso, aunque es readonly

    // 3. Oculta las subsecciones
    document.getElementById("cursoFuturoGrupo").style.display = "none";
    document.getElementById("sinEstudiosGrupo").style.display = "none";
}

// -----------------------------------------------------------------------------

// === FUNCIÓN PARA CARGAR EL ESTADO GUARDADO Y AJUSTAR LA INTERFAZ ===
/**
 * Inicializa el estado visual de la sección de educación basándose en los datos guardados.
 * @param {object} participanteGuardado - El objeto con los datos del participante (estudiaActual, cursoActual_ultimoAnio, etc.).
 */
function inicializarEstadoEducacion(participanteGuardado) {
    // Si no hay datos, salimos
    if (!participanteGuardado || !participanteGuardado.estudiaActual) {
        // Oculta todas las secciones si no hay datos guardados
        manejarEstudio('ninguno'); 
        return;
    }

    const estudiaActual = participanteGuardado.estudiaActual; // 'si' o 'no'

    // 1. Selecciona el radio button de Estudio Actual
    const radioEstudia = document.getElementById(`estudia-${estudiaActual}`);
    if (radioEstudia) {
        radioEstudia.checked = true;
        // Llama a manejarEstudio para mostrar/ocultar las secciones principales
        manejarEstudio(estudiaActual); 
    }

    const valorCursoUnificado = participanteGuardado.cursoActual_ultimoAnio;

    if (estudiaActual === 'si') {
        // Cargar el curso actual
        document.getElementById('cursoActual').value = valorCursoUnificado || "";
        
    } else if (estudiaActual === 'no') {
        // Cargar el último año cursado
        document.getElementById('ultimoAnio').value = valorCursoUnificado || "";

        // 2. Inicializar la pregunta de Estudio Futuro (dentro de la sección 'no')
        const estudioFuturo = participanteGuardado.estudioFuturo; 
        
        if (estudioFuturo) {
            // Selecciona el radio button de Estudio Futuro
            const radioFuturo = document.getElementById(`futuro-${estudioFuturo}`);
            if (radioFuturo) {
                radioFuturo.checked = true;
                // Llama a manejarEstudioFuturo para mostrar/ocultar los campos futuros
                manejarEstudioFuturo(estudioFuturo);
            }
        }
        
        // 3. Cargar el curso futuro (si aplica)
        const valorFuturoUnificado = participanteGuardado.cursoFuturo_sinEstudio;

        if (estudioFuturo === 'si') {
            document.getElementById('cursoFuturo').value = valorFuturoUnificado || "";
        }
    }
}

// -----------------------------------------------------------------------------

// === LISTENERS: REINICIO AUTOMÁTICO SI EL USUARIO CAMBIA RESPUESTAS ===
document.addEventListener("DOMContentLoaded", () => {
    // Asigna los listeners para el manejo de la interfaz al interactuar

    // Listeners para "¿Estudia actualmente?"
    const radiosEstudia = document.getElementsByName("estudiaActual");
    radiosEstudia.forEach(radio => {
        // Reemplazamos el onchange del HTML con un listener JS
        radio.addEventListener("change", (e) => manejarEstudio(e.target.value)); 
    });

    // Listeners para "¿Estudiará el próximo año?"
    const radiosFuturo = document.getElementsByName("estudioFuturo");
    radiosFuturo.forEach(radio => {
        // Reemplazamos el onchange del HTML con un listener JS
        radio.addEventListener("change", (e) => manejarEstudioFuturo(e.target.value));
    });

    
    // ******************************************************************************
    // ⚠️ PUNTO DE LLAMADA CLAVE PARA CARGAR DATOS ⚠️
    // Debes llamar a 'inicializarEstadoEducacion' AQUÍ o en tu función de carga de datos
    // una vez que 'participanteSeleccionado' esté disponible.

    /* Ejemplo de cómo podrías llamar a la función si tienes tus datos cargados:

    const participanteSeleccionado = {
        estudiaActual: 'no',
        cursoActual_ultimoAnio: '9',
        estudioFuturo: 'si',
        cursoFuturo_sinEstudio: '10' 
        // ... otros campos
    };
    inicializarEstadoEducacion(participanteSeleccionado);
    */
    
    // ******************************************************************************
});
