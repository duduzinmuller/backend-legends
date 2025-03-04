import { badRequest } from "./http";
import validator from "validator";

export const emailIsAlreadyInUseResponse = () =>
    badRequest({ message: "Email inválido" });

export const checkIfEmailIsValid = (email: string) => validator.isEmail(email);
