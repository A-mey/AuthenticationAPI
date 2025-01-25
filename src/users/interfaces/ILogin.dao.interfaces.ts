import { response } from "../../common/types/response.types";
import { CreateUserDTO } from "../dto/create.user.dto";
import { getUserDTO } from "../dto/get.user.dto";
import { validateUserDTO } from "../dto/validate.user.dto";
import { Pill } from "../types/pill.type";

export interface ILoginDaoInterface {
    storeUserData (CreateUser: CreateUserDTO): Promise<response>
    checkAuth (userAuth: validateUserDTO): Promise<response>
    getUserDetailsThroughEmailId (emailIdObject: getUserDTO): Promise<response>
    checkWhetherUserExistsThoughEmailId (emailIdObject: getUserDTO): Promise<response>
    createNewAuth (encryptedPill: Pill): Promise<response>   
}