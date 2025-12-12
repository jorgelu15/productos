import style from "./container.module.css";
import { routes } from "../../utils/routes";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { useMemo, useState } from "react";
import stringSimilarity from "string-similarity";
import { useForm } from "../../hooks/useForm";
import borrar from "../../assets/borrar.svg";
import editar from "../../assets/edit.svg";
import volver from "../../assets/volver.svg";
import Table from "../../components/tables/Table";
import { useShortcuts } from "../../hooks/useShortcodes";
import { useNavigate } from "react-router-dom";
import { useInventario } from "../../hooks/useInventario";
import type { ProductoRepository } from "../../models/Producto.repository";
import { useProductModals } from "../../hooks/useProductModals";
import CreateProductoModal from "./Modals/CrearProducto.modal";
import SkeletonTable from "../../components/skeleton/SkeletonTable";
import UpdateProductoModal from "./Modals/UpdateProducto.modal";
import Modal from "../../components/modales/Modal";
import { toast } from "react-toastify";

const items = [
  { label: "Dashboard", href: routes.dashboard },
  { label: "Productos", href: routes.InventarioFisico },
];

const menuItems = [
  { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
];

const Container = () => {
  const { productosQuery, deleteProductoMutation } = useInventario(); // <- asegúrate de tener esta mutation
  const productos: ProductoRepository[] = productosQuery?.data || [];

  const navigate = useNavigate();
  const { form, onChangeGeneral } = useForm({ query: "" });

  const {
    selectedProduct,
    setSelectedProduct,
    isCreateProductModalOpen,
    setIsCreateProductModalOpen,
    isUpdateProductModalOpen,
    setIsUpdateProductModalOpen,
  } = useProductModals();

  // ✅ Modal confirmar borrado
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isDeleting =
    (deleteProductoMutation as any)?.isPending ??
    (deleteProductoMutation as any)?.isLoading ??
    false;

  // Atajos
  const shortcuts = menuItems.reduce((map, item) => {
    map[item.shortcode] = () => navigate(item.destiny);
    return map;
  }, {} as Record<string, () => void>);
  useShortcuts(shortcuts);

  const openCreateProductModal = () => setIsCreateProductModalOpen(true);

  const openUpdateProductModal = (product: ProductoRepository) => {
    setSelectedProduct(product);
    setIsUpdateProductModalOpen(true);
  };

  // ✅ abrir confirmación de borrar
  const openDeleteConfirmModal = (product: ProductoRepository) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteConfirmModal = () => {
    setIsDeleteModalOpen(false);
    // opcional: setSelectedProduct(null as any);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) {
      toast.error("No hay producto seleccionado para eliminar");
      return;
    }

    // ⚠️ Ajusta el ID real según tu modelo
    const id_producto =
      (selectedProduct as any).id_producto ??
      (selectedProduct as any).id ??
      (selectedProduct as any).producto_id;

    if (!id_producto) {
      toast.error("No se encontró el ID del producto");
      return;
    }

    try {
      // ✅ aquí llamas tu mutation
      await deleteProductoMutation.mutateAsync(id_producto);

      toast.success("Producto eliminado correctamente");
      closeDeleteConfirmModal();

      // Si tu mutation no invalida queries internamente:
      // productosQuery.refetch?.();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.error ||
        err?.message ||
        "Error eliminando producto";
      toast.error(msg);
    }
  };

  const headers = ["Código", "Nombre", "Descripción", "Marca", "Categoría", "Precio", "Acciones"];

  const filteredRows = useMemo(() => {
    const query = form.query.toLowerCase();
    if (!query) return productos;

    return productos.filter((row: ProductoRepository) => {
      return Object.values(row).some((value) => {
        const text = String(value ?? "").toLowerCase();
        if (text.includes(query)) return true;
        const similarity = stringSimilarity.compareTwoStrings(text, query);
        return similarity > 0.8;
      });
    });
  }, [form.query, productos]);

  return (
    <div className="container">
      <Breadcrumb items={items} />

      <div className={style.msg__welcome}>
        <h1>Productos</h1>
      </div>

      <div className={style.content}>
        <div className={style.header__container}>
          <div style={{ display: "flex", gap: 20 }}>
            <button className="btn btn_primary" onClick={openCreateProductModal}>
              Crear producto
            </button>
          </div>

          <div className={style.form_control}>
            <input
              type="search"
              placeholder="Buscar un producto"
              value={form.query}
              onChange={(e) => onChangeGeneral(e, "query")}
            />
          </div>
        </div>

        <div className={style.table_container}>
          {productosQuery.isLoading ? (
            <SkeletonTable cols={9} rows={5} />
          ) : (
            <Table
              headers={headers}
              data={filteredRows}
              defaultRowsPerPage={5}
              rowsPerPageOptions={[5, 10, 20]}
              renderRow={(row) => {
                const rowValues = [
                  row.codigo,
                  row.nombre,
                  row.descripcion,
                  row.marca,
                  (row as any)?.categoria?.nombre ?? (row as any)?.categoria_nombre ?? row.categoria_id,
                  row.precio,
                ];

                return (
                  <>
                    {rowValues.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}

                    <td style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      {/* EDITAR */}
                      <img
                        src={editar}
                        title="Editar producto"
                        style={{ cursor: "pointer" }}
                        onClick={() => openUpdateProductModal(row)}
                      />

                      {/* ELIMINAR */}
                      <img
                        src={borrar}
                        title="Eliminar producto"
                        style={{ cursor: "pointer" }}
                        onClick={() => openDeleteConfirmModal(row)}
                      />
                    </td>
                  </>
                );
              }}
            />
          )}
        </div>

        {/* MODAL CREAR */}
        {isCreateProductModalOpen && (
          <CreateProductoModal
            isCreateProductModalOpen={isCreateProductModalOpen}
            setIsCreateProductModalOpen={setIsCreateProductModalOpen}
          />
        )}

        {/* MODAL ACTUALIZAR */}
        {isUpdateProductModalOpen && selectedProduct && (
          <UpdateProductoModal
            isUpdateProductModalOpen={isUpdateProductModalOpen}
            setIsUpdateProductModalOpen={setIsUpdateProductModalOpen}
            selectedProduct={selectedProduct}
          />
        )}

        {/*  MODAL CONFIRMAR BORRADO */}
        {isDeleteModalOpen && selectedProduct && (
          <Modal
            title="Confirmar eliminación"
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteConfirmModal}
            size="sm"
            footer={
              <div className={style.modal_footer_actions}>
                <button className="btn btn_secondary" onClick={closeDeleteConfirmModal} disabled={isDeleting}>
                  No
                </button>
                <button className="btn btn_primary" onClick={confirmDelete} disabled={isDeleting}>
                  {isDeleting ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </div>
            }
          >
            <div style={{ padding: 10 }}>
              <p style={{ marginBottom: 8 }}>
                ¿Seguro que deseas eliminar el producto{" "}
                <b>{selectedProduct.nombre}</b> ({selectedProduct.codigo})?
              </p>
              <p style={{ opacity: 0.8, fontSize: 13 }}>
                Esta acción no se puede deshacer.
              </p>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Container;
