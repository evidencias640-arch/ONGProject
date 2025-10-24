        // =================================================================
        // FUNCIÓN 1: MANEJAR EL REGIMEN DE SALUD (Bloqueo Condicional de EPS)
        // =================================================================
        function manejarRegimenSalud(valorSeleccionado) {
            var epsSelect = document.getElementById("epsActivo");
            var otraEpsInput = document.getElementById("otraEps");

            if (valorSeleccionado === "No Salud") {
                // Bloquear SELECT de EPS
                epsSelect.disabled = true;
                epsSelect.value = "";
                epsSelect.required = false;
                epsSelect.style.backgroundColor = "#e9ecef";

                // Bloquear INPUT de OTRA EPS
                otraEpsInput.style.display = "none";
                otraEpsInput.disabled = true;
                otraEpsInput.required = false;
                otraEpsInput.value = "";
                otraEpsInput.name = "otraEps";
            } else {
                // Habilitar SELECT de EPS
                epsSelect.disabled = false;
                epsSelect.required = true;
                epsSelect.style.backgroundColor = "white";

                // Reactivar el campo de texto si el valor actual es "OTRA"
                if (epsSelect.value === "OTRA") {
                    mostrarCampoOtraEPS("OTRA");
                } else {
                    // Si selecciona otro régimen y no tenía "OTRA" seleccionado, asegurar nombre correcto
                    epsSelect.name = "epsActivo";
                }
            }
        }

        // =================================================================
        // FUNCIÓN 2: MOSTRAR CAMPO OTRA EPS (CORREGIDA para permitir escritura)
        // =================================================================
        function mostrarCampoOtraEPS(valorSeleccionado) {
            var campoOtraEPS = document.getElementById("otraEps");
            var epsSelect = document.getElementById("epsActivo");

            // Si el select principal de EPS está deshabilitado por 'No Salud', salimos.
            if (epsSelect.disabled) {
                campoOtraEPS.style.display = "none";
                return;
            }

            if (valorSeleccionado === "OTRA") {
                campoOtraEPS.style.display = "block";
                campoOtraEPS.required = true;
                campoOtraEPS.disabled = false; // CLAVE: Habilitar para escribir

                campoOtraEPS.name = "epsActivo";
                epsSelect.name = "epsActivo_select";
            } else {
                campoOtraEPS.style.display = "none";
                campoOtraEPS.required = false;
                campoOtraEPS.disabled = true;
                campoOtraEPS.value = "";
                campoOtraEPS.name = "otraEps";
                epsSelect.name = "epsActivo";
            }
        }

// =================================================================
// FUNCIÓN DE CONTROL DE BLOQUEO (SI/NO) - Actualizada para poner "NO VIVE"
// =================================================================
function controlarBloqueo(idControl, idNombre, idTipoDoc, idNumDoc) {
    var controlSelect = document.getElementById(idControl);
    var nombreInput = document.getElementById(idNombre); 
    var tipoDocSelect = document.getElementById(idTipoDoc);
    var numDocInput = document.getElementById(idNumDoc);

    // Determina si el progenitor NO vive con el menor
    var debeBloquearse = controlSelect.value === "NO";

    // Función auxiliar para aplicar bloqueo/desbloqueo a un elemento
    function aplicarEstado(elemento, bloquear, valorBloqueado, placeholderBloqueado) {
        elemento.readOnly = bloquear;
        elemento.disabled = bloquear;
        elemento.required = !bloquear;
        
        if (bloquear) {
            // CAMBIO: Establecer el valor en "NO VIVE"
            elemento.value = valorBloqueado; 
            elemento.placeholder = placeholderBloqueado;
            elemento.setCustomValidity("");
        } else {
            elemento.value = ""; // Limpiar cualquier valor fijo
            // Restablecer placeholders y patrones
            if (elemento.id.includes('numDoc')) {
                elemento.placeholder = "Ingrese el número";
            } else if (elemento.id.includes('nombre')) {
                elemento.placeholder = "Ingrese el nombre completo";
            } else { // Para el select de tipo de documento
                elemento.placeholder = ""; 
                elemento.selectedIndex = 0; // Opcional: regresa al primer item del select
            }
        }
    }

    if (debeBloquearse) {
        // Bloquear todos los campos y establecer su valor en "NO VIVE"
        
        // Bloqueo del Nombre
        aplicarEstado(nombreInput, true, "NO VIVE", "Bloqueado");
        
        // Bloqueo del Tipo de Documento
        aplicarEstado(tipoDocSelect, true, "NO VIVE", "Bloqueado");
        
        // Bloqueo del Número de Documento
        aplicarEstado(numDocInput, true, "NO VIVE", "Bloqueado");
        
    } else {
        // Desbloquear y Reestablecer
        
        // Desbloquear todos los campos
        aplicarEstado(nombreInput, false);
        aplicarEstado(tipoDocSelect, false);
        aplicarEstado(numDocInput, false);
        
        // Asegurar que sean requeridos si selecciona "SI"
        if (controlSelect.value === "SI") {
            nombreInput.required = true;
            tipoDocSelect.required = true;
            numDocInput.required = true;
        } else {
            nombreInput.required = false;
            tipoDocSelect.required = false;
            numDocInput.required = false;
        }
    }
}

        // =================================================================
        // FUNCIÓN 4: PERSONALIZAR LOS MENSAJES DE ERROR
        // =================================================================
        function personalizarMensaje(elementoId, mensajeVacio) {
            const elemento = document.getElementById(elementoId);
            if (elemento) {
                elemento.addEventListener("invalid", function (event) {
                    event.preventDefault();

                    if (elemento.validity.valueMissing) {
                        elemento.setCustomValidity(mensajeVacio);
                    } else if (elemento.validity.patternMismatch) {
                        elemento.setCustomValidity(
                            "🚨 Solo se permiten números. Verifique."
                        );
                    }
                });

                // Limpiar el mensaje en input y change
                elemento.addEventListener("input", function () {
                    elemento.setCustomValidity("");
                });

                if (elemento.tagName === "SELECT") {
                    elemento.addEventListener("change", function () {
                        elemento.setCustomValidity("");
                    });
                }
            }
        }

        // =================================================================
        // APLICAR MENSAJES AL CARGAR LA PÁGINA
        // =================================================================
        document.addEventListener("DOMContentLoaded", function () {
            // Aplicar a los campos de la MADRE
            personalizarMensaje(
                "tipoDocMama",
                "⚠️ Debe seleccionar el tipo de documento de la Madre."
            );
            personalizarMensaje(
                "numDocMama",
                "⚠️ Debe ingresar el número de documento de la Madre."
            );

            // Aplicar a los campos del PADRE
            personalizarMensaje(
                "tipoDocPapa",
                "⚠️ Debe seleccionar el tipo de documento del Padre."
            );
            personalizarMensaje(
                "numDocPapa",
                "⚠️ Debe ingresar el número de documento del Padre."
            );

            // También aplicar a Régimen de Salud y EPS (asumiendo que están en la página)
            personalizarMensaje(
                "regimenSalud",
                "⚠️ Debe seleccionar el Régimen de Salud."
            );
            personalizarMensaje("epsActivo", "⚠️ Debe seleccionar la EPS activa.");
        });
