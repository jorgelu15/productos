import React, { useReducer } from 'react';
import api from "../../config/axios";

import InventarioFisicoContext from './InventarioFisicoContext';
import InventarioFisicoReducer from './InvetarioFisicoReducer';
import type { AxiosProgressEvent } from 'axios';
import type { ProductoRepository } from '../../models/Producto.repository';
import type { CategoriaDTO } from '../../models/dtos/categoria.dto';
import type { CategoriaRepository } from '../../models/Categoria.repository';



const ProductoProvider = ({ children }: { children: React.ReactNode }) => {

    const initialState = {
        producto: null,
        msg: null,
        cargando: true
    }

    const [state, dispatch] = useReducer(InventarioFisicoReducer, initialState);

    const updateProducto = async (producto: ProductoRepository) => {
        try {
            const res = await api.put(`/productos/${producto.id_producto}`, producto);
            return res;
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    const createProducto = async (producto: ProductoRepository) => {
        try {
            const res = await api.post(`/productos`, producto);

            return res;
        } catch (error) {
            throw error
        }
    }

    const deleteProducto = async (id_producto: number) => {
        try{
            const res = await api.delete(`/productos/${id_producto}`);
        return res.data;
        } catch (error) {
            throw error
        }
    };

    const createCategoria =  async (categoria: CategoriaRepository) => {
        try {
            const res = await api.post(`/productos/categorias`, categoria);
            return res;
        } catch (error) {
            throw error
        }
    }

    const updateCategoria = async (categoria: CategoriaRepository) => {
        try {
            const res = await api.put(`/productos/categorias/${categoria.id_categoria}`, categoria);
            return res;
        } catch (error) {
            throw error
        }
    }


    const deleteCategoria = async (id_categoria: number) => {
        try{
            const res = await api.delete(`/productos/categorias/${id_categoria}`);
        return res.data;
        } catch (error) {
            throw error
        }
    };



    return (
        <InventarioFisicoContext.Provider
            value={{
                producto: state.producto,
                msg: state.msg,
                cargando: state.cargando,
                updateProducto,
                createProducto,
                deleteProducto,
                createCategoria,
                deleteCategoria,
                updateCategoria
            }}
        >
            {children}
        </InventarioFisicoContext.Provider>
    )
}

export default ProductoProvider;