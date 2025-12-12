import React, { useReducer } from 'react';
import api from "../../config/axios";

import InventarioFisicoContext from './InventarioFisicoContext';
import InventarioFisicoReducer from './InvetarioFisicoReducer';
import type { AxiosProgressEvent } from 'axios';
import type { ProductoRepository } from '../../models/Producto.repository';
import type { CategoriaDTO } from '../../models/dtos/categoria.dto';



const ProductoProvider = ({ children }: { children: React.ReactNode }) => {

    const initialState = {
        producto: null,
        msg: null,
        cargando: true
    }

    const [state, dispatch] = useReducer(InventarioFisicoReducer, initialState);

    const updateProducto = async (producto: ProductoRepository, setProgress: any) => {
        try {
            const res = await api.put(`/productos/${producto.id_producto}`, producto, {
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent?.total ? progressEvent?.total : 0));
                    setProgress(percentage);
                }
            });
            return res;
        } catch (error) {
            console.log(error)
        }
    }

    const createProducto = async (producto: ProductoRepository, setProgress: any) => {
        try {
            const res = await api.post(`/productos`, producto,
                {
                    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                        const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent?.total ? progressEvent?.total : 0));
                        setProgress(percentage);
                    }
                });

            return res;
        } catch (error) {
            console.log(error)
        }
    }
    const createCategoria = async (categoria: CategoriaDTO, setProgress: any) => {
        try {
            const res = await api.post(`/inventario-fisico/cliente/${categoria.id_cliente}/categorias`, categoria,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "Application/json",
                    },
                    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                        const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent?.total ? progressEvent?.total : 0));
                        setProgress(percentage);
                    }
                });

            return res;
        } catch (error) {
            console.log(error)
        }
    }

    const deleteProducto = async (id_producto: number) => {
        const res = await api.delete(`/productos/${id_producto}`);
        return res.data; // o return res;
    };




    return (
        <InventarioFisicoContext.Provider
            value={{
                producto: state.producto,
                msg: state.msg,
                cargando: state.cargando,
                updateProducto,
                createProducto,
                createCategoria,
                deleteProducto
            }}
        >
            {children}
        </InventarioFisicoContext.Provider>
    )
}

export default ProductoProvider;