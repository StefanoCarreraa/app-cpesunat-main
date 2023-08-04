import { GuiaRemisionRemitenteItems } from "./guia-remision-remitente-items.model";

export class GuiaRemisionRemitente {
  public ID_DOC_GUIA: string;
  public PROFILE_ID: string;
  public VERSION_UBL: string;
  public CUSTOMATIZACION: string;
  public SERIE_NUMERO: string;
  public FECHA_EMISION: string;
  public HORA_EMISION: string;
  public TIPO_DOCUMENTO: string;
  public TIPO_DOCUMENTO_REMITENTE: string;
  public NUMERO_DOCUMENTO_REMITENTE: string;
  public RAZON_SOCIAL_REMITENTE: string;
  public TIPO_DOCUMENTO_DESTINATARIO: string;
  public NUMERO_DOCUMENTO_DESTINATARIO: string;
  public RAZON_SOCIAL_DESTINATARIO: string;
  public IDENTIFICADOR_TRASLADO: string;
  public MOTIVO_TRASLADO: string;
  public DESCRIPCION_TRASLADO: string;
  public UNIDAD_MEDIDA: string;
  public PESO_BRUTO: string;
  public MODALIDAD_TRASLADO: string;
  // public DIRECCION_COMPLETA: string;
  public INICIO_TRASLADO_ORIGEN: string;
  public RUC_ORIGEN: string;
  public UBIGEO_ORIGEN: string;
  public DIRECCION_ORIGEN: string;
  public ESTABLECIMIENTO_ORIGEN: string;
  public RUC_DESTINO: string;
  public UBIGEO_DESTINO: string;
  public DIRECCION_DESTINO: string;
  public ESTABLECIMIENTO_DESTINO: string;
  public PLACA_VEHICULO: string;
  public CP_TIPO_DOCUMENTO: string;
  public CP_TIPO: string;
  public CP_NOMBRES: string;
  public CP_APELLIDOS: string;
  public CP_NUMERO_DOCUMENTO: string;
  public CP_LICENCIA: string;
  public CP_RUC: string;
  public CP_RAZON_SOCIAL: string;
  public TIPO_ORIGEN: number;
  public ID_DOC_ORIGEN: number;
  public ITEMS: GuiaRemisionRemitenteItems[];

  constructor() {
    this.ITEMS = [];
  }
}
