import {BASIS} from "./transcoder/basis_transcoder.js"
import { BasisTranscoderModule } from "./typing/basis_universal";

export const importBasisTranscoder:()=>Promise<BasisTranscoderModule> = BASIS;

