import { getAuth, UpdateRequest, UserRecord } from "firebase-admin/auth";
import { CreateProfessorData } from "@/schemas/professor-schema";

class AuthService {
    
    async create(professor: CreateProfessorData): Promise<UserRecord>{
        return getAuth().createUser({
            email: professor.email,
            displayName: professor.nome,
            password: professor.password,
        });
    }
}

export { AuthService };
