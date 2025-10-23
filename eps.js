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
        // FUNCIÓN 3: VALIDACIÓN DE DOCUMENTOS Y BLOQUEO CONDICIONAL ('No vive')
        // =================================================================
        function validarDocumento(idTipoDoc, idNumDoc) {
            var tipoDocSelect = document.getElementById(idTipoDoc);
            var numDocInput = document.getElementById(idNumDoc);

            // Si se selecciona "No vive"
            if (tipoDocSelect.value === "No vive") {
                numDocInput.value = "";
                numDocInput.readOnly = true;
                numDocInput.disabled = true;
                numDocInput.required = false;
                numDocInput.placeholder = "No aplica (No vive con el menor)";
                numDocInput.setCustomValidity(""); // Limpiar la validación
            } else {
                // Habilitar el campo de número
                numDocInput.readOnly = false;
                numDocInput.disabled = false;

                // Hacer el campo de número obligatorio si se eligió un tipo de doc
                if (tipoDocSelect.value !== "") {
                    numDocInput.required = true;
                    numDocInput.placeholder = "Ingrese el número";
                } else {
                    numDocInput.required = false;
                    numDocInput.placeholder = "Ingrese el número";
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