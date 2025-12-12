export interface ProductoRepository {
    id_producto: number;
    nombre: string;
    codigo: string; 
    descripcion: string;
    marca: string;
    categoria_id: number;
    precio: number;
    updatedAt: Date;
    createdAt: Date;
}