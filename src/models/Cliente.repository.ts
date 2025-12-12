export interface ClienteRepository {
    id_cliente: number;
    id_inst: string;
    cedula: string;
    nombre: string;
    telefono: string;
    direccion: string;
    email: string;
    estado: boolean;
    createdAt: Date;
    updatedAt: Date;
}