import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { CheckPasswordForm } from "@/types/index";
import { checkPassword } from "@/api/AuthAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteProject } from "@/api/ProjectAPI";

const DeleteProjectModal = () => {
  const initialValues: CheckPasswordForm = {
    password: "",
  };
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const deleteProjectId = queryParams.get("deleteProject")!;
  const show = deleteProjectId ? true : false;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const checkPasswordMutation = useMutation({
    mutationFn: checkPassword,
    onError: (error) => toast.error(error.message),
  });

  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate(location.pathname, { replace: true });
      reset();
    },
  });

  const handleForm = async (formData: CheckPasswordForm) => {
    await checkPasswordMutation.mutateAsync(formData);
    await deleteProjectMutation.mutateAsync(deleteProjectId);
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => navigate(location.pathname, { replace: true })}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl p-16 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="my-5 text-4xl font-black">
                  Eliminar Proyecto{" "}
                </Dialog.Title>

                <p className="text-xl font-bold">
                  Confirma la eliminación del proyecto {""}
                  <span className="text-fuchsia-600">
                    colocando tu password
                  </span>
                </p>

                <form
                  className="mt-10 space-y-5"
                  onSubmit={handleSubmit(handleForm)}
                  noValidate
                >
                  <div className="flex flex-col gap-3">
                    <label className="text-2xl font-normal" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Password Inicio de Sesión"
                      className="w-full p-3 border border-gray-300"
                      {...register("password", {
                        required: "El password es obligatorio",
                      })}
                    />
                    {errors.password && (
                      <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                  </div>

                  <input
                    type="submit"
                    className="w-full p-3 text-xl font-black text-white cursor-pointer bg-fuchsia-600 hover:bg-fuchsia-700"
                    value="Eliminar Proyecto"
                  />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteProjectModal;
