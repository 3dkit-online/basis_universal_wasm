import {BASIS} from "./encoder/basis_encoder.js"
import { BasisEncoderModule } from "./typing/basis_universal";

export const importBasisEncoder:()=>Promise<BasisEncoderModule> = BASIS;

