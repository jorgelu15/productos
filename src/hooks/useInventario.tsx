import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useContext } from "react";
import InventarioFisicoContext from "../context/InventarioFisico/InventarioFisicoContext";
import type { CategoriaDTO } from "../models/dtos/categoria.dto";

export const useInventario = () => {
    const { updateProducto, createProducto, createCategoria, deleteProducto }: any = useContext(InventarioFisicoContext);
    const queryClient = useQueryClient();


    const fetchProductos = async () => {
        const res = await api.get(`/productos`);
        return res.data;
    };


    const fetchGetAllCategoriasByCliente = async () => {
        const res = await api.get(`/productos/categorias`);
        return res.data;
    }

    const categoriasQuery = useQuery({
        queryKey: ["categorias"],
        queryFn: () => fetchGetAllCategoriasByCliente(), // Ya no recibe page
        refetchOnWindowFocus: true
    });

    const productosQuery = useQuery({
        queryKey: ["productos"],
        queryFn: () => fetchProductos(), // Ya no recibe page
        refetchOnWindowFocus: true
    });



    //mutarions
    const createCategoriaMutation = useMutation({
        mutationFn: (categoria: CategoriaDTO) => createCategoria(categoria),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categorias"] });
        }
    });

    const createProductoMutation = useMutation({
        mutationFn: (producto: any) => createProducto(producto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["productos"] });
        }
    });

    const updateProductoMutation = useMutation({
        mutationFn: (producto: any) => updateProducto(producto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["productos"] });
        }
    });

    const deleteProductoMutation = useMutation({
        mutationFn: (id_producto: any) => deleteProducto(id_producto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["productos"] });
        }
    });


    return {
        productosQuery,
        categoriasQuery,
        updateProductoMutation,
        createProductoMutation,
        createCategoriaMutation,
        deleteProductoMutation
    };
};