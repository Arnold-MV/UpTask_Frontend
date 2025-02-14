import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { RequestConfirmationCodeForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { requestConfirmationCode } from "@/api/AuthAPI";
import { toast } from "react-toastify";

const RequestNewCodeView = () => {
  const initialValues: RequestConfirmationCodeForm = {
    email: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: requestConfirmationCode,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
    },
  });

  const handleRequestCode = (formData: RequestConfirmationCodeForm) =>
    mutate(formData);

  return (
    <>
      <h1 className="text-5xl font-black text-white">
        Solicitar Código de Confirmación
      </h1>
      <p className="mt-5 text-2xl font-light text-white">
        Coloca tu e-mail para recibir {""}
        <span className="font-bold text-fuchsia-500"> un nuevo código</span>
      </p>

      <form
        onSubmit={handleSubmit(handleRequestCode)}
        className="p-10 mt-10 space-y-8 bg-white rounded-lg"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="text-2xl font-normal" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3 border border-gray-300 rounded-lg"
            {...register("email", {
              required: "El Email de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <input
          type="submit"
          value="Enviar Código"
          className="w-full p-3 text-xl font-black text-white rounded-lg cursor-pointer bg-fuchsia-600 hover:bg-fuchsia-700"
        />
      </form>

      <nav className="flex flex-col mt-10 space-y-4">
        <Link
          to="/auth/login"
          className="font-normal text-center text-gray-300"
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>
        <Link
          to="/auth/forgot-password"
          className="font-normal text-center text-gray-300"
        >
          ¿Olvidaste tu contraseña? Reestablecer
        </Link>
      </nav>
    </>
  );
};

export default RequestNewCodeView;
