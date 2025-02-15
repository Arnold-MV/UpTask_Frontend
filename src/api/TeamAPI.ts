import { isAxiosError } from "axios";
import api from "@/lib/axios";
import {
  Project,
  TeamMember,
  TeamMemberForm,
  teamMembersSchema,
} from "../types";

export async function findUserByEmail({
  projectId,
  formData,
}: {
  projectId: string;
  formData: TeamMemberForm;
}): Promise<TeamMember> {
  try {
    const url = `/projects/${projectId}/team/find`;

    const { data } = await api.post<TeamMember>(url, formData);

    return {
      _id: data._id, // Ajusta la clave para que coincida con lo que espera el frontend
      name: data.name,
      email: data.email,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Error desconocido al buscar el usuario");
  }
}

export async function addUserToProject({
  projectId,
  id,
}: {
  projectId: Project["_id"];
  id: TeamMember["_id"];
}) {
  try {
    const url = `/projects/${projectId}/team`;

    const { data } = await api.post<string>(url, { id });

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjectTeam(projectId: Project["_id"]) {
  try {
    const url = `/projects/${projectId}/team`;

    const { data } = await api(url);

    const response = teamMembersSchema.safeParse(data);

    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function removeUserFormProject({
  projectId,
  userId,
}: {
  projectId: Project["_id"];
  userId: TeamMember["_id"];
}) {
  try {
    const url = `/projects/${projectId}/team/${userId}`;

    const { data } = await api.delete<string>(url);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
