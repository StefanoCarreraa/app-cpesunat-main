import {Component, ElementRef, ViewChild} from '@angular/core';
import {applyInputRestriction} from '../../utils/utilidades';
import {GuiaRemisionRemitenteItems} from '@/models/guia-remision-remitente-items.model';
import {ToastrService} from 'ngx-toastr';
import {GuiaRemisionRemitente} from '@/models/guia-remision-remitente.model';
import {GuiaRemisionRemitenteListar} from '@/models/guia-remision-remitente-listar.model';
import {FormsModule, FormControl, Validators} from '@angular/forms';
import {GuiaRemisionRemitenteService} from '../../services/guia-remision-remitente/guia-remision-remitente.service';
import {cambiarFormatoFecha} from '@/utils/utilidades';
import {FakeServicesService} from '@/services/fake-services.service';

@Component({
    selector: 'app-guia-remision-remitente-manual',
    templateUrl: './guia-remision-remitente-manual.component.html',
    styleUrls: ['./guia-remision-remitente-manual.component.scss']
})
export class GuiaRemisionRemitenteManualComponent {
    formulariovalidator = {
        NUMERO_DOCUMENTO_REMITENTE: '',
        NUMERO_DOCUMENTO_DESTINATARIO: '',
        PESO_BRUTO: null,
        INICIO_TRASLADO_ORIGEN: null,
        RUC_ORIGEN: '',
        RUC_DESTINO: ''
    };
    seHizoClicEnGuardar = false;

    constructor(
        private toastr: ToastrService,
        private grr_service: GuiaRemisionRemitenteService,
        private fake_service: FakeServicesService
    ) {}

    // Propiedad para controlar la visibilidad del modal
    modalVisible = false;
    modalUbigeoVisible = false;
    btnNuevaGRR: boolean = false;
    formulario: GuiaRemisionRemitente = new GuiaRemisionRemitente();
    elementos: GuiaRemisionRemitenteItems[] = [];
    guiaRemisiones: any[] = [];
    guiaRemisionesListar: any[] = [];
    listaUbigeos: any[] = [];
    listaUnidades: any[] = [];
    filteredUbigeos: any[] = [];
    filteredData: any[] = [];
    ubigeoDestinoSeleccionado: string = '';
    ubigeoOrigenSeleccionado: string = '';
    unidadSeleccionado: string = '';
    rucDestinatarioSeleccionado: string = '';
    searchTextUbigeo: string = '';
    public modalUbigeoSeleccionado: number;
    showModal: boolean = false;
    rucRemitente = '';
    fechaEmisionDocumento = '';
    rucBusqueda = '';
    tipoTrasladoPrivado: boolean = false;
    tipoTrasladoPublico: boolean = false;
    message_error: boolean = false;
    //Paginado Modal Ubigeo
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalItems: number = 0;
    //Paginado Guias Remision
    // Paginación
    currentPageGuia = 1;
    itemsPerPageGuia = 10;

    datosVehiculo = new FormControl('', Validators.required);

    opcionesSelect = [
        {value: '20502574109', text: 'Consorcio Dhmont & CG & M S.A.C.'},
        {value: '20108664640', text: 'HyM Inversionistas y asociados'},
        {value: '20337583751', text: 'Arquideas S.R.L.'}
    ];

    motivoTrasladoSelect = [
        {value: '02', text: 'Compra'},
        // {value: '01', text: 'Venta'},
        // {value: '03', text: 'Venta con entrega a terceros'},
        {value: '13', text: 'Otros'}
    ];

    unidadMedidaPesoSelect = [
        {value: 'KGM', text: 'Kilogramos'},
        {value: 'TNE', text: 'Toneladas'}
    ];

    modalidadTrasladoSelect = [
        {value: '01', text: 'Público'},
        {value: '02', text: 'Privado'}
    ];

    tipoDocumentoIdentidadSelect = [
        {value: '1', text: 'Documento Nacional de Identidad'},
        {value: '4', text: 'Carnet de extranjería'},
        {value: '6', text: 'Registro Unico de Contributentes'}
    ];

    isLoading: boolean = false;

    onRazonSocialBusquedaSelected(value: any, text: string): void {
        // this.formulario.RAZON_SOCIAL_REMITENTE = text;
        this.rucBusqueda = value;
        // console.log(this.rucBusqueda);
    }

    onRazonSocialRemitenteSelected(value: any, text: string): void {
        this.formulario.RAZON_SOCIAL_REMITENTE = text;
        this.formulario.NUMERO_DOCUMENTO_REMITENTE = value;
    }

    onRazonSocialDestinatarioSelected(value: any, text: string): void {
        this.formulario.RAZON_SOCIAL_DESTINATARIO = text;
        this.formulario.NUMERO_DOCUMENTO_DESTINATARIO = value;
    }

    onMotivoTrasladoSelected(value: any, text: string): void {
        this.formulario.MOTIVO_TRASLADO = value;
        this.formulario.DESCRIPCION_TRASLADO = text;
    }

    onUnidadMedidaPesoSelected(value: any, text: string): void {
        this.formulario.UNIDAD_MEDIDA = value;
    }

    onModalidadTrasladoSelected(value: any, text: string): void {
        this.formulario.MODALIDAD_TRASLADO = value;
        if (value == '01') {
            //PUBLICO
            this.tipoTrasladoPrivado = false;
            this.tipoTrasladoPublico = true;
            this.formulario.CP_APELLIDOS = '';
            this.formulario.CP_NOMBRES = '';
            this.formulario.CP_LICENCIA = '';
            this.formulario.CP_TIPO_DOCUMENTO = '';
            this.formulario.CP_RUC = '';
            this.formulario.CP_RAZON_SOCIAL = '';
            this.formulario.CP_NUMERO_DOCUMENTO = '';
            this.formulario.PLACA_VEHICULO = '';
        } else {
            //PRIVADO
            this.tipoTrasladoPrivado = true;
            this.tipoTrasladoPublico = false;
            this.formulario.CP_APELLIDOS = '';
            this.formulario.CP_NOMBRES = '';
            this.formulario.CP_LICENCIA = '';
            this.formulario.CP_TIPO_DOCUMENTO = '';
            this.formulario.CP_RUC = '';
            this.formulario.CP_RAZON_SOCIAL = '';
            this.formulario.CP_NUMERO_DOCUMENTO = '';
            this.formulario.PLACA_VEHICULO = '';
        }
    }

    onTipoDocumentoIdentidadSelected(value: any, text: string): void {
        this.formulario.CP_TIPO_DOCUMENTO = value;
    }

    onUnidadSelected(value: any, text: string): void {
        this.unidadSeleccionado = value;
    }

    openModal() {
        this.datosVehiculo.reset();
        this.limpiarModal();
        const fecha = new Date();
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const anio = fecha.getFullYear();
        this.fechaEmisionDocumento = `${dia.toString().padStart(2, '0')}/${mes
            .toString()
            .padStart(2, '0')}/${anio}`;
        const hora = fecha.getHours();
        const minutos = fecha.getMinutes();
        const segundos = fecha.getSeconds();
        this.formulario.HORA_EMISION = `${hora
            .toString()
            .padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos
            .toString()
            .padStart(2, '0')}`;
        this.formulario.INICIO_TRASLADO_ORIGEN = cambiarFormatoFecha(
            `${dia.toString().padStart(2, '0')}/${mes
                .toString()
                .padStart(2, '0')}/${anio}`
        );
        this.modalVisible = true;
    }

    abrirModalUbigeoDestino() {
        // console.log('modal ubigeo destino');
        this.searchTextUbigeo = '';
        this.modalUbigeoSeleccionado = 0;
        this.fake_service.cargarUbigeos().subscribe((response: any[]) => {
            this.listaUbigeos = response;
            this.filteredUbigeos = this.listaUbigeos;
            // console.log(this.listaUbigeos);
        });

        const filterUbigeossimulator = {
            target: {
                value: ' '
            }
        };
        this.filterUbigeos(filterUbigeossimulator);
    }

    @ViewChild('buscarubigeofilterElement', {static: false})
    buscarubigeofilterElementRef!: ElementRef;
    abrirModalUbigeoOrigen() {
        // console.log('modal ubigeo origen');
        this.searchTextUbigeo = '';
        this.modalUbigeoSeleccionado = 1;
        this.fake_service.cargarUbigeos().subscribe((response: any[]) => {
            this.listaUbigeos = response;
            this.filteredUbigeos = this.listaUbigeos;
            // console.log(this.listaUbigeos);
        });

        const filterUbigeossimulator = {
            target: {
                value: ''
            }
        };
        this.filterUbigeos(filterUbigeossimulator);
    }

    filterUbigeos(event: any) {
        const query = event.target.value.toLowerCase();
        this.filteredUbigeos = this.listaUbigeos.filter((ubigeo: any) => {
            return ubigeo.descripcion.toLowerCase().includes(query);
        });

        this.totalItems = this.filteredUbigeos.length; // Actualizar la cantidad total de elementos
        this.currentPage = 1; // Reiniciar la página actual
    }

    paginate(): any[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredUbigeos.slice(startIndex, endIndex);
    }

    get TotalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    cerrarModalUbigeo() {
        // Obtener referencia al modal principal y al modal de Ubigeo
        const modalUbigeo = document.getElementById('modalUbigeo');

        // Ocultar el modal de Ubigeo y mostrar el modal principal
        modalUbigeo.style.display = 'none';
    }

    seleccionarUbigeo(ubigeo: any) {
        if (this.modalUbigeoSeleccionado === 0) {
            this.formulario.UBIGEO_DESTINO = ubigeo.ubigeo;
            this.ubigeoDestinoSeleccionado = ubigeo.descripcion;
        } else if (this.modalUbigeoSeleccionado === 1) {
            this.formulario.UBIGEO_ORIGEN = ubigeo.ubigeo;
            this.ubigeoOrigenSeleccionado = ubigeo.descripcion;
        }
    }

    abrirModalUnidad() {
        this.listaUnidades = [];
        this.unidadSeleccionado = '';
        this.fake_service.cargarUnidades().subscribe((response: any[]) => {
            this.listaUnidades = response;
        });
    }

    getCurrentDate(): string {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Función para cerrar el modal
    closeModal() {
        this.modalVisible = false;
    }

    // Función para guardar los datos del formulario
    guardarDatosPreview() {
        // this.formulario.ITEMS = this.elementos;
        this.formulario.ID_DOC_GUIA = '133';
        this.formulario.PROFILE_ID = '0101';
        this.formulario.VERSION_UBL = '2.1';
        this.formulario.CUSTOMATIZACION = '2.0';
        this.formulario.SERIE_NUMERO = '';
        this.formulario.TIPO_DOCUMENTO = '09';
        this.formulario.TIPO_DOCUMENTO_REMITENTE = '6';
        this.formulario.TIPO_DOCUMENTO_DESTINATARIO = '6';
        this.formulario.IDENTIFICADOR_TRASLADO = 'SUNAT_Envio';
        this.formulario.CP_TIPO = 'Principal';
        this.formulario.SERIE_NUMERO = 'T001-00000006';
        this.formulario.FECHA_EMISION = cambiarFormatoFecha(
            this.fechaEmisionDocumento
        );
        this.formulario.ITEMS = this.elementos;
        this.formulario.PESO_BRUTO = this.formulario.PESO_BRUTO.toString();
        this.btnNuevaGRR = true;
        // console.log(this.formulario);
        this.grr_service.guiaremisionremitente_envio(this.formulario).subscribe(
            (response) => {
                this.guiaRemisiones = response;
                this.btnNuevaGRR = false;
                this.toastr.success('Se registró la guía de remisión');
            },
            (error) => {
                this.btnNuevaGRR = false;
            }
        );

        this.closeModal();
    }
    validarLongitudCampo(campo: string, min: number, max: number): boolean {
        return campo && campo.length > 0 && campo.length <= max;
    }
    validateRucRemitente() {
        return this.validarLongitudCampo(
            this.formulario.NUMERO_DOCUMENTO_REMITENTE,
            1,
            11
        );
    }
    validateRucDestinatario() {
        return this.validarLongitudCampo(
            this.formulario.NUMERO_DOCUMENTO_DESTINATARIO,
            1,
            11
        );
    }
    @ViewChild('motivoTrasladoElement', {static: false})
    motivoTrasladoElementRef!: ElementRef;
    validatemotivoTraslado() {
        const selectElement = this.motivoTrasladoElementRef
            .nativeElement as HTMLSelectElement;
        if (selectElement.value !== '') {
            selectElement.classList.remove('border-rojo'); // Remueve el borde rojo si es válido
            return true;
        } else {
            selectElement.classList.add('border-rojo');
            return false;
        }
    }
    @ViewChild('unidadMedidaPesoBrutoElement', {static: false})
    unidadMedidaPesoBrutoElementRef!: ElementRef;
    validateunidadMedidaPesoBruto() {
        const selectElement = this.unidadMedidaPesoBrutoElementRef
            .nativeElement as HTMLSelectElement;
        if (selectElement.value !== '') {
            selectElement.classList.remove('border-rojo'); // Remueve el borde rojo si es válido
            return true;
        } else {
            selectElement.classList.add('border-rojo');
            return false;
        }
    }
    validatepesoBruto(): boolean {
        const pesoBruto = parseFloat(this.formulario.PESO_BRUTO);
        return !isNaN(pesoBruto) && pesoBruto >= 0 && pesoBruto <= 1000;
    }
    @ViewChild('modalidadTrasladoElement', {static: false})
    modalidadTrasladoElementRef!: ElementRef;
    validatemodalidadTraslado() {
        const selectElement = this.modalidadTrasladoElementRef
            .nativeElement as HTMLSelectElement;
        if (selectElement.value !== '') {
            selectElement.classList.remove('border-rojo'); // Remueve el borde rojo si es válido
            return true;
        } else {
            selectElement.classList.add('border-rojo');
            return false;
        }
    }
    validateinicioTraslado(): boolean {
        const fechaInicioTraslado = new Date(
            this.formulario.INICIO_TRASLADO_ORIGEN
        );
        const fechaActual = new Date();

        return (
            !isNaN(fechaInicioTraslado.getTime()) &&
            fechaInicioTraslado <= fechaActual
        );
    }
    validaterucOrigen() {
        return this.validarLongitudCampo(this.formulario.RUC_ORIGEN, 1, 11);
    }
    validaterucDestino() {
        return this.validarLongitudCampo(this.formulario.RUC_DESTINO, 1, 11);
    }
    @ViewChild('ubigeoOrigenElement', {static: false})
    ubigeoOrigenElementRef!: ElementRef;
    validateubigeoOrigen() {
        const selectElement = this.ubigeoOrigenElementRef
            .nativeElement as HTMLSelectElement;
        if (selectElement.value !== '') {
            selectElement.classList.remove('border-rojo'); // Remueve el borde rojo si es válido
            return true;
        } else {
            selectElement.classList.add('border-rojo');
            return false;
        }
    }
    @ViewChild('ubigeoDestinoElement', {static: false})
    ubigeoDestinoElementRef!: ElementRef;
    validateubigeoDestino() {
        const selectElement = this.ubigeoDestinoElementRef
            .nativeElement as HTMLSelectElement;
        if (selectElement.value !== '') {
            selectElement.classList.remove('border-rojo'); // Remueve el borde rojo si es válido
            return true;
        } else {
            selectElement.classList.add('border-rojo');
            return false;
        }
    }
    validatedatosVehiculo() {
        const datosVehiculo = this.formulario.PLACA_VEHICULO;
        const placaRegex = /^[A-Z]{2}-\d{4}$/;
        if (placaRegex.test(datosVehiculo)) {
            return true;
        } else {
            return false;
        }
    }
    validatedireccionOrigen() {
        return this.validarLongitudCampo(
            this.formulario.DIRECCION_ORIGEN,
            1,
            100
        );
    }
    validatedireccionDestino() {
        return this.validarLongitudCampo(
            this.formulario.DIRECCION_DESTINO,
            1,
            100
        );
    }
    validatedatosTransportistaNombres() {
        return this.validarLongitudCampo(this.formulario.CP_NOMBRES, 1, 50);
    }
    validatedatosTransportistaApellido() {
        return this.validarLongitudCampo(this.formulario.CP_APELLIDOS, 1, 50);
    }
    @ViewChild('tipoDocumentoIdentidadElement', {static: false})
    tipoDocumentoIdentidadElementRef!: ElementRef;
    validatetipoDocumentoIdentidad() {
      const selectElement = this.tipoDocumentoIdentidadElementRef
            .nativeElement as HTMLSelectElement;
        if (selectElement.value !== '') {
            selectElement.classList.remove('border-rojo'); // Remueve el borde rojo si es válido
            return true;
        } else {
            selectElement.classList.add('border-rojo');
            return false;
        }
    }
    validatenumeroDocumento() {
        return this.validarLongitudCampo(
            this.formulario.CP_NUMERO_DOCUMENTO,
            1,
            30
        );
    }
    validatenumeroLicencia() {
        return this.validarLongitudCampo(this.formulario.CP_LICENCIA, 1, 10);
    }
    validatedatosTransportistaRuc() {
        return this.validarLongitudCampo(this.formulario.CP_RUC, 1, 11);
    }
    validatedatosTransportistaRazonSocial() {
        return this.validarLongitudCampo(this.formulario.CP_RAZON_SOCIAL, 1, 100);
    }
    guardarGuiaRemitenteManual() {
        try {
            this.seHizoClicEnGuardar = true;
            if (
                this.validateRucRemitente() &&
                this.validateRucDestinatario() &&
                this.validatemotivoTraslado() &&
                this.validateunidadMedidaPesoBruto() &&
                this.validatemodalidadTraslado() &&
                this.validateinicioTraslado() &&
                this.validaterucOrigen() &&
                this.validaterucDestino() &&
                this.validateubigeoOrigen() &&
                this.validateubigeoDestino() &&
                this.validatedireccionOrigen() &&
                this.validatedireccionDestino() &&
                ((this.validatedatosTransportistaNombres() &&
                    this.validatedatosTransportistaApellido() &&
                    this.validatetipoDocumentoIdentidad() &&
                    this.validatenumeroDocumento() &&
                    this.validatenumeroLicencia()) ||
                    (this.validatedatosTransportistaRuc() &&
                        this.validatedatosTransportistaRazonSocial()))
            ) {
                this.message_error = false;
                this.isLoading = true;
                //
                this.formulario.ID_DOC_GUIA = '133';
                this.formulario.PROFILE_ID = '0101';
                this.formulario.VERSION_UBL = '2.1';
                this.formulario.CUSTOMATIZACION = '2.0';
                this.formulario.SERIE_NUMERO = '';
                this.formulario.TIPO_DOCUMENTO = '09';
                this.formulario.TIPO_DOCUMENTO_REMITENTE = '6';
                this.formulario.TIPO_DOCUMENTO_DESTINATARIO = '6';
                this.formulario.IDENTIFICADOR_TRASLADO = 'SUNAT_Envio';
                this.formulario.CP_TIPO = 'Principal';
                this.formulario.TIPO_ORIGEN = 0;
                this.formulario.ID_DOC_ORIGEN = 0;
                this.formulario.FECHA_EMISION = cambiarFormatoFecha(
                    this.fechaEmisionDocumento
                );

                this.formulario.ITEMS = this.elementos;
                this.formulario.PESO_BRUTO =
                    this.formulario.PESO_BRUTO.toString();

                this.grr_service
                    .guiaremisionremitentemanual_registrar(this.formulario)
                    .subscribe(
                        (response) => {
                            // console.log(response);
                            this.toastr.success(
                                'Se registró la guía de remisión ' +
                                    response.serie_numero
                            );
                            setTimeout(() => {
                                this.isLoading = false;
                            }, 1500);
                        },
                        (error) => {
                            // this.btnNuevaGRR = false;
                            this.toastr.error('Error');
                            // console.log(error);
                            setTimeout(() => {
                                this.isLoading = false;
                            }, 1500);
                        }
                    );
            } else {
                // Maneja el caso cuando la entrada es inválida (por ejemplo, muestra un mensaje de error)
                console.log('RUC Remitente inválido');
                this.message_error = true;
            }
            //
        } catch (error) {
            // Aquí puedes agregar el código para manejar cualquier error que ocurra en el bloque try
            console.error('Ocurrió un error:', error);
            setTimeout(() => {
                this.isLoading = false;
            }, 1500);
        }
    }

    guardarGuiaRemitenteManualNuevo() {
        this.formulario.ID_DOC_GUIA = '133';
        this.formulario.PROFILE_ID = '0101';
        this.formulario.VERSION_UBL = '2.1';
        this.formulario.CUSTOMATIZACION = '2.0';
        this.formulario.SERIE_NUMERO = '';
        this.formulario.TIPO_DOCUMENTO = '09';
        this.formulario.TIPO_DOCUMENTO_REMITENTE = '6';
        this.formulario.TIPO_DOCUMENTO_DESTINATARIO = '6';
        this.formulario.IDENTIFICADOR_TRASLADO = 'SUNAT_Envio';
        this.formulario.CP_TIPO = 'Principal';
        this.formulario.TIPO_ORIGEN = 0;
        this.formulario.ID_DOC_ORIGEN = 0;
        this.formulario.FECHA_EMISION = cambiarFormatoFecha(
            this.fechaEmisionDocumento
        );
        this.formulario.ITEMS = this.elementos;
        this.formulario.PESO_BRUTO = this.formulario.PESO_BRUTO.toString();

        console.log(this.formulario);

        this.closeModal();
    }

    guiaManualListar() {
        this.grr_service
            .guiaremisionremitentemanual_listar(this.rucBusqueda)
            .subscribe(
                (response) => {
                    if (Array.isArray(response.data)) {
                        this.guiaRemisionesListar = response.data;
                        this.filteredData = this.guiaRemisionesListar;
                        // console.log(this.guiaRemisionesListar);
                    } else {
                        // console.log('La respuesta no es un arreglo:', response);
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    filterData(event: any) {
        const query = event.target.value.toLowerCase();
        this.filteredData = this.guiaRemisionesListar.filter(
            (guiasremision: any) => {
                return guiasremision.seriE_NUMERO.toLowerCase().includes(query);
            }
        );
        this.currentPage = 1;
    }

    guardarElemento() {
        const codigo = '';

        // const unidad = (document.getElementById('unidad') as HTMLSelectElement)
        //     .value;

        const descripcion = (
            document.getElementById('descripcion') as HTMLInputElement
        ).value;
        const cantidad = (
            document.getElementById('cantidad') as HTMLInputElement
        ).value;

        const elemento = new GuiaRemisionRemitenteItems();

        if (descripcion == '') {
        }

        elemento.codigo = codigo;
        elemento.unidad = this.unidadSeleccionado;
        elemento.descripcion = descripcion;
        elemento.cantidad = cantidad;
        this.elementos.push(elemento);
        (document.getElementById('descripcion') as HTMLInputElement).value = '';
        (document.getElementById('cantidad') as HTMLInputElement).value = '';
        this.toastr.success('Elemento agregado');
    }

    eliminarFila(index: number): void {
        this.elementos.splice(index, 1); // Elimina el elemento del arreglo
        this.toastr.success('Elemento eliminado');
    }

    // Agrega el siguiente método para limpiar los elementos y restablecer los controles
    limpiarModal(): void {
        this.formulario = new GuiaRemisionRemitente();
        this.elementos = [];
    }
    //First Modal
    onModalFirstShow(): void {
        setTimeout(() => {
            const modalBackdrop = document.querySelector(
                '.modal-backdrop'
            ) as HTMLElement;
            modalBackdrop.classList.add('primermodal');
        }, 0);
    }
    //Second Modal
    onModalSecondShow(): void {
        setTimeout(() => {
            const modalBackdrops = document.querySelectorAll('.modal-backdrop');
            const lastModalBackdrop = modalBackdrops[
                modalBackdrops.length - 1
            ] as HTMLElement;
            lastModalBackdrop.classList.add('segundomodal');
            lastModalBackdrop.style.zIndex = '1050';

            const modalElements = document.querySelectorAll(
                '#modalUbigeo, #modalAgregarItem'
            );
            modalElements.forEach((modalElement) => {
                (modalElement as HTMLElement).style.zIndex = '1051';
            });
        }, 0);
    }
    toggleSpinner() {
        this.isLoading = !this.isLoading;
    }
    ValidateFormatNumeric(event) {
        let key;
        if (event.type === 'paste') {
            key = event.clipboardData.getData('text/plain');
        } else {
            key = event.keyCode;
            key = String.fromCharCode(key);
        }
        const regex = /[0-9]|\./;
        if (!regex.test(key)) {
            event.returnValue = false;
            if (event.preventDefault) {
                event.preventDefault();
            }
        }
    }
}
