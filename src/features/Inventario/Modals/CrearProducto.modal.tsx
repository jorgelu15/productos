import { Bounce, toast, ToastContainer } from "react-toastify";
import Modal from "../../../components/modales/Modal";
import { useInventario } from "../../../hooks/useInventario";
import { useForm } from "../../../hooks/useForm";
import style from "../container.module.css";
import { useMemo } from "react";

interface CreateProductoModalProps {
  isCreateProductModalOpen: boolean;
  setIsCreateProductModalOpen: (isOpen: boolean) => void;
}

type Categoria = {
  id_categoria: number | string;
  nombre: string;
};

const initialFormState = {
  codigo: "",
  nombre: "",
  descripcion: "",
  categoriaId: "",
  marca: "",
  precioVenta: "",
};

const CreateProductoModal = ({
  isCreateProductModalOpen,
  setIsCreateProductModalOpen,
}: CreateProductoModalProps) => {
  const { createProductoMutation, categoriasQuery } = useInventario();
  const { form, onChangeGeneral, setState } = useForm(initialFormState);

  const isCreating =
    (createProductoMutation as any).isPending ?? (createProductoMutation as any).isLoading ?? false;

  const categorias: Categoria[] = (categoriasQuery.data || []) as Categoria[];

  const categoriaOptions = useMemo(
    () =>
      categorias.map((cat) => ({
        value: String(cat.id_categoria),
        label: cat.nombre,
      })),
    [categorias]
  );

  const closeModal = () => {
    setIsCreateProductModalOpen(false);
    setState(initialFormState);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const precio = Number(form.precioVenta);
    if (!Number.isFinite(precio) || precio <= 0) {
      toast.error("El precio debe ser un número válido mayor que 0");
      return;
    }

    if (!form.categoriaId) {
      toast.error("Debes seleccionar una categoría");
      return;
    }

    const categoria_id_num = Number(form.categoriaId);
    if (!Number.isFinite(categoria_id_num) || categoria_id_num <= 0) {
      toast.error("Categoría inválida");
      return;
    }

    const producto = {
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      categoria_id: categoria_id_num, // <- number (mejor para backend)
      marca: form.marca.trim(),
      precio,
    };

    try {
      const response: any = await createProductoMutation.mutateAsync(producto);
      toast.success(response?.data?.message ?? "Producto creado correctamente");
      closeModal();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.error ||
        err?.message ||
        "Error creando producto";
      toast.error(msg);
    }
  };

  return (
    <Modal
      title="Crear Producto"
      isOpen={isCreateProductModalOpen}
      onClose={closeModal}
      size="md"
      footer={
        <div className={style.modal_footer_actions}>
          <button className="btn btn_secondary" type="button" onClick={closeModal} disabled={isCreating}>
            Cancelar
          </button>

          <button className="btn btn_primary" type="submit" form="create-product-form" disabled={isCreating}>
            {isCreating ? "Creando Producto..." : "Crear Producto"}
          </button>
        </div>
      }
    >
      <form
        id="create-product-form"
        className={style.create_product_form}
        onSubmit={handleSubmit}
      >
        <div style={{ display: "flex", margin: "10px 0" }}>
          <div style={{ width: "100%" }}>
            {renderInput("Código", "codigo", "text", "Ej: PROD-001")}
            {renderInput("Nombre", "nombre", "text", "Ej: Producto 1")}
            {renderInput("Descripción", "descripcion", "text", "Ej: Producto 1")}
          </div>
        </div>

        {renderSelect("Marca", "marca", [
          { value: "Marca 1", label: "Marca 1" },
          { value: "Marca 2", label: "Marca 2" },
          { value: "Marca 3", label: "Marca 3" },
        ])}

        {renderSelect("Categoría", "categoriaId", categoriaOptions, {
          loading: categoriasQuery.isLoading,
          emptyText: categoriasQuery.isLoading ? "Cargando categorías..." : "No hay categorías",
        })}

        {renderInput("Precio", "precioVenta", "number", "Ej: 10000")}
      </form>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Modal>
  );

  function renderInput(
    label: string,
    name: keyof typeof initialFormState,
    type: string,
    placeholder: string
  ) {
    return (
      <div className={style.form_control}>
        <label>{label} *</label>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={form[name] as string}
          onChange={(e) => onChangeGeneral(e, name)}
          required
          disabled={isCreating}
        />
      </div>
    );
  }

  function renderSelect(
    label: string,
    name: keyof typeof initialFormState,
    options: { value: string; label: string }[],
    cfg?: { loading?: boolean; emptyText?: string }
  ) {
    const isEmpty = !cfg?.loading && options.length === 0;

    return (
      <div className={style.form_control}>
        <label>{label} *</label>
        <select
          name={name}
          value={form[name] as string}
          onChange={(e) => onChangeGeneral(e, name)}
          required
          disabled={isCreating || cfg?.loading || isEmpty}
        >
          <option value="" disabled>
            {cfg?.loading
              ? "Cargando..."
              : isEmpty
              ? cfg?.emptyText ?? "Sin opciones"
              : `Seleccionar ${label.toLowerCase()}`}
          </option>

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
};

export default CreateProductoModal;
