import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import stringSimilarity from "string-similarity";
import { routes } from "../../utils/routes";
import style from "./container.module.css";
import borrar from "../../assets/borrar.svg";
import volver from "../../assets/volver.svg";
import edit from "../../assets/edit.svg";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "../../hooks/useForm";
import Table from "../../components/tables/Table";
import Modal from "../../components/modales/Modal";
import { useShortcuts } from "../../hooks/useShortcodes";
import { useNavigate } from "react-router-dom";
import SkeletonTable from "../../components/skeleton/SkeletonTable";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useInventario } from "../../hooks/useInventario";
import type { CategoriaRepository } from "../../models/Categoria.repository";

const items = [
  { label: "Dashboard", href: routes.dashboard },
  { label: "Categorias", href: routes.InventarioFisico },
];

const menuItems = [
  { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
];

const initialCategoriaForm = {
  codigo: "",
  nombre: "",
  descripcion: "",
};

const Container = () => {
  const navigate = useNavigate();

  const {
    categoriasQuery,
    createCategoriaMutation,
    updateCategoriaMutation,
    deleteCategoriaMutation,
  } = useInventario();

  const categorias: CategoriaRepository[] = Array.isArray(categoriasQuery.data)
    ? categoriasQuery.data
    : [];

  const { form, onChangeGeneral, setState } = useForm({
    query: "",
    ...initialCategoriaForm,
  });

  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaRepository | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isCreating =
    (createCategoriaMutation as any)?.isPending ??
    (createCategoriaMutation as any)?.isLoading ??
    false;

  const isUpdating =
    (updateCategoriaMutation as any)?.isPending ??
    (updateCategoriaMutation as any)?.isLoading ??
    false;

  const isDeleting =
    (deleteCategoriaMutation as any)?.isPending ??
    (deleteCategoriaMutation as any)?.isLoading ??
    false;

  /* =========================
      SHORTCUTS
  ========================== */
  const shortcuts = menuItems.reduce((map, item) => {
    map[item.shortcode] = () => navigate(item.destiny);
    return map;
  }, {} as Record<string, () => void>);
  useShortcuts(shortcuts);

  /* =========================
      FILTER
  ========================== */
  const filteredRows = useMemo(() => {
    const query = String(form.query ?? "").toLowerCase();
    if (!query) return categorias;

    return categorias.filter((row) =>
      Object.values(row).some((value) => {
        const text = String(value ?? "").toLowerCase();
        if (text.includes(query)) return true;
        return stringSimilarity.compareTwoStrings(text, query) > 0.8;
      })
    );
  }, [form.query, categorias]);

  /* =========================
      CREATE
  ========================== */
  const openCreateModal = () => {
    setState((prev: any) => ({ ...prev, ...initialCategoriaForm }));
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.codigo || !form.nombre) {
      toast.error("Código y nombre son obligatorios");
      return;
    }

    createCategoriaMutation.mutate(
      {
        codigo: form.codigo.trim(),
        nombre: form.nombre.trim(),
        descripcion: form.descripcion?.trim(),
      },
      {
        onSuccess: (res: any) => {
          toast.success(res?.data?.message ?? "Categoría creada");
          closeCreateModal();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message ?? "Error creando categoría");
        },
      }
    );
  };

  /* =========================
      UPDATE
  ========================== */
  const openUpdateModal = (categoria: CategoriaRepository) => {
    setSelectedCategoria(categoria);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedCategoria(null);
    setIsUpdateModalOpen(false);
  };

  useEffect(() => {
    if (!isUpdateModalOpen || !selectedCategoria) return;

    setState((prev: any) => ({
      ...prev,
      codigo: selectedCategoria.codigo ?? "",
      nombre: selectedCategoria.nombre ?? "",
      descripcion: selectedCategoria.descripcion ?? "",
    }));
  }, [isUpdateModalOpen, selectedCategoria, setState]);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedCategoria) return;

    updateCategoriaMutation.mutate(
      {
        id_categoria: selectedCategoria.id_categoria,
        codigo: form.codigo.trim(),
        nombre: form.nombre.trim(),
        descripcion: form.descripcion?.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Categoría actualizada");
          closeUpdateModal();
        },
        onError: () => toast.error("Error actualizando categoría"),
      }
    );
  };

  /* =========================
      DELETE
  ========================== */
  const openDeleteModal = (categoria: CategoriaRepository) => {
    setSelectedCategoria(categoria);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedCategoria(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    if (!selectedCategoria) return;

    deleteCategoriaMutation.mutate(selectedCategoria.id_categoria, {
      onSuccess: () => {
        toast.success("Categoría eliminada");
        closeDeleteModal();
      },
      onError: () => toast.error("Error eliminando categoría"),
    });
  };

  /* =========================
      RENDER
  ========================== */
  return (
    <div className="container">
      <Breadcrumb items={items} />

      <div className={style.msg__welcome}>
        <h1>Categorías</h1>
      </div>

      <div className={style.content}>
        <div className={style.header__container}>
          <button className="btn btn_primary" onClick={openCreateModal}>
            Crear categoría
          </button>

          <div className={style.form_control}>
            <input
              type="search"
              placeholder="Buscar categoría"
              value={form.query}
              onChange={(e) => onChangeGeneral(e, "query")}
            />
          </div>
        </div>

        <div className={style.table_container}>
          {categoriasQuery.isLoading ? (
            <SkeletonTable cols={4} rows={5} />
          ) : (
            <Table
              headers={["Código", "Nombre", "Descripción", "Acciones"]}
              data={filteredRows}
              renderRow={(row: CategoriaRepository) => (
                <>
                  <td>{row.codigo}</td>
                  <td>{row.nombre}</td>
                  <td>{row.descripcion}</td>
                  <td style={{ display: "flex", gap: 10 }}>
                    <img src={edit} onClick={() => openUpdateModal(row)} />
                    <img src={borrar} onClick={() => openDeleteModal(row)} />
                  </td>
                </>
              )}
            />
          )}
        </div>
      </div>

      {/* CREATE */}
      {isCreateModalOpen && (
        <Modal title="Crear Categoría" isOpen onClose={closeCreateModal} size="md">
          <form onSubmit={handleCreate} className={style.create_product_form}>
            <input value={form.codigo} onChange={(e) => onChangeGeneral(e, "codigo")} placeholder="Código" />
            <input value={form.nombre} onChange={(e) => onChangeGeneral(e, "nombre")} placeholder="Nombre" />
            <input value={form.descripcion} onChange={(e) => onChangeGeneral(e, "descripcion")} placeholder="Descripción" />
            <button className="btn btn_primary" disabled={isCreating}>
              Crear
            </button>
          </form>
        </Modal>
      )}

      {/* UPDATE */}
      {isUpdateModalOpen && selectedCategoria && (
        <Modal title="Actualizar Categoría" isOpen onClose={closeUpdateModal} size="md">
          <form onSubmit={handleUpdate} className={style.create_product_form}>
            <input value={form.codigo} onChange={(e) => onChangeGeneral(e, "codigo")} />
            <input value={form.nombre} onChange={(e) => onChangeGeneral(e, "nombre")} />
            <input value={form.descripcion} onChange={(e) => onChangeGeneral(e, "descripcion")} />
            <button className="btn btn_primary" disabled={isUpdating}>
              Actualizar
            </button>
          </form>
        </Modal>
      )}

      {/* DELETE */}
      {isDeleteModalOpen && selectedCategoria && (
        <Modal title="Confirmar eliminación" isOpen onClose={closeDeleteModal} size="sm">
          <p>
            ¿Eliminar la categoría <b>{selectedCategoria.nombre}</b>?
          </p>
          <div className={style.modal_footer_actions}>
            <button className="btn btn_secondary" onClick={closeDeleteModal}>
              No
            </button>
            <button className="btn btn_primary" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Sí, eliminar"}
            </button>
          </div>
        </Modal>
      )}

      <ToastContainer position="bottom-right" transition={Bounce} />
    </div>
  );
};

export default Container;
