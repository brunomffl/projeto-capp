import { getAuth, UpdateRequest, UserRecord } from "firebase-admin/auth";
import { CreateProfessorData, UpdateProfessorData } from "@/schemas/professor-schema";

class AuthService {
    
    async create(professor: CreateProfessorData): Promise<UserRecord>{
        return getAuth().createUser({
            email: professor.email,
            displayName: professor.nome,
            password: professor.password,
        });
    }

    async update(id: string, professor: UpdateProfessorData){
        const props: UpdateRequest = {};

        if(professor.nome) {
            props.displayName = professor.nome;
        }
        
        if(professor.email) {
            props.email = professor.email;
        }

        if(professor.password) {
            props.password = professor.password;
        }

        await getAuth().updateUser(id, props);
    }

    async delete(id: string){
        await getAuth().deleteUser(id);
    }
}

export { AuthService };
