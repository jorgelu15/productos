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

    if (!form.codigo || !form.nombre || !form.precioVenta || !form.categoriaId) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

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

    createProductoMutation.mutate(producto, {
      onSuccess: (response: any) => {
        toast.success(response?.message);
        closeModal();
      },
      onError: (err: any) => {
        console.log(err.response)
        toast.error(err.response.data.error);
      },
    })


  };

  return (
    <Modal
      title="Crear Producto"
      isOpen={isCreateProductModalOpen}
      onClose={closeModal}
      size="md"
      footer={
        <div className={style.modal_footer_actions}>
          <button className="btn btn_secondary" type="button" onClick={closeModal}>
            Cancelar
          </button>

          <button className="btn btn_primary" type="submit" form="create-product-form">
            Crear producto
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
          disabled={cfg?.loading || isEmpty}
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
