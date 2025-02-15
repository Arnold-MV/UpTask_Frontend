import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/api/ProjectAPI";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";

const DashboardView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: user, isLoading: authLoading } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (isLoading && authLoading) {
    return "Cargando...";
  }

  //asi recomienda query para obtener contenido de una api
  if (data && user)
    return (
      <>
        <h1 className="text-5xl font-black">Mis Proyectos</h1>
        <p className="mt-5 text-2xl font-light text-gray-500">
          Maneja y administra tus proyectos
        </p>
        <nav className="my-5">
          <Link
            to="/projects/create"
            className="px-10 py-3 text-xl font-bold text-white transition-colors bg-purple-400 cursor-pointer hover:bg-purple-500"
          >
            Nuevo Proyecto
          </Link>
        </nav>
        {data.length ? (
          <ul
            role="list"
            className="mt-10 bg-white border border-gray-100 divide-y divide-gray-100 shadow-lg"
          >
            {data.map((project) => (
              <li
                key={project._id}
                className="flex justify-between px-5 py-10 gap-x-6"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="flex-auto min-w-0 space-y-2">
                    <div className="mb-2">
                      {isManager(project.manager, user._id) ? (
                        <p className="inline-block px-5 py-1 text-xs font-bold text-indigo-500 uppercase border-2 border-indigo-500 rounded-lg bg-indigo-50">
                          Manager
                        </p>
                      ) : (
                        <p className="inline-block px-5 py-1 text-xs font-bold text-green-500 uppercase border-2 border-green-500 rounded-lg bg-green-50">
                          Colaborador
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-3xl font-bold text-gray-600 cursor-pointer hover:underline"
                    >
                      {project.projectName}
                    </Link>
                    <p className="text-sm text-gray-400">
                      Cliente: {project.clientName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center shrink-0 gap-x-6">
                  <Menu as="div" className="relative flex-none">
                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                      <span className="sr-only">opciones</span>
                      <EllipsisVerticalIcon
                        className="h-9 w-9"
                        aria-hidden="true"
                      />
                    </MenuButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="absolute right-0 z-10 w-56 py-2 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <MenuItem>
                          <Link
                            to={`/projects/${project._id}`}
                            className="block px-3 py-1 text-sm leading-6 text-gray-900"
                          >
                            Ver Proyecto
                          </Link>
                        </MenuItem>
                        {isManager(project.manager, user._id) && (
                          <>
                            <MenuItem>
                              <Link
                                to={`/projects/${project._id}/edit`}
                                className="block px-3 py-1 text-sm leading-6 text-gray-900"
                              >
                                Editar Proyecto
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <button
                                type="button"
                                className="block px-3 py-1 text-sm leading-6 text-red-500"
                                onClick={() => {
                                  navigate(
                                    location.pathname +
                                      `?deleteProject=${project._id}`
                                  );
                                }}
                              >
                                Eliminar Proyecto
                              </button>
                            </MenuItem>
                          </>
                        )}
                      </MenuItems>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-20 text-center">
            No hay proyectos aún {""}
            <Link to="/projects/create" className="font-bold text-fuchsia-500">
              Crear Proyecto
            </Link>
          </p>
        )}
        <DeleteProjectModal />
      </>
    );
};

export default DashboardView;
