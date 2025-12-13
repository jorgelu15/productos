import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useContext } from "react";
import InventarioFisicoContext from "../context/InventarioFisico/InventarioFisicoContext";
import type { CategoriaRepository } from "../models/Categoria.repository";

export const useInventario = () => {
    const {
        updateProducto,
        createProducto,
        deleteProducto,
        createCategoria,
        deleteCategoria,
        updateCategoria
    }: any = useContext(InventarioFisicoContext);

    const queryClient = useQueryClient();

    /* =========================
       FETCHERS
    ========================== */

    const fetchProductos = async () => {
        const res = await api.get("/productos");
        return res.data; // <-- debe ser ARRAY
    };

    const fetchCategorias = async () => {
        const res = await api.get("/productos/categorias");
        return res.data;
    };

    /* =========================
       QUERIES
    ========================== */

    const productosQuery = useQuery({
        queryKey: ["productos"], // ✅ KEY ÚNICA
        queryFn: fetchProductos,
        refetchOnWindowFocus: true,
    });

    const categoriasQuery = useQuery({
        queryKey: ["categorias"],
        queryFn: fetchCategorias,
        refetchOnWindowFocus: true,
    });

    /* =========================
       MUTATIONS
    ========================== */

    

    const createProductoMutation = useMutation({
        mutationFn: (producto: any) => createProducto(producto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["productos"] });
        },
    });

    const updateProductoMutation = useMutation({
        mutationFn: (producto: any) => updateProducto(producto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["productos"] });
        },
    });

    const deleteProductoMutation = useMutation({
        mutationFn: (id_producto: number) => deleteProducto(id_producto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["productos"] });
        },
    });

    const createCategoriaMutation = useMutation({
        mutationFn: (categoria: CategoriaRepository) => createCategoria(categoria),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categorias"] });
        },
    });

    const updateCategoriaMutation = useMutation({
        mutationFn: (categoria: CategoriaRepository) => updateCategoria(categoria),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categorias"] });
        },
    });

    const deleteCategoriaMutation = useMutation({
        mutationFn: (id_categoria: number) => deleteCategoria(id_categoria),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categorias"] });
        },
    });

    /* =========================
       EXPORT
    ========================== */

    return {
        productosQuery,
        categoriasQuery,
        createProductoMutation,
        updateProductoMutation,
        deleteProductoMutation,
        createCategoriaMutation,
        updateCategoriaMutation,
        deleteCategoriaMutation
    };
};
