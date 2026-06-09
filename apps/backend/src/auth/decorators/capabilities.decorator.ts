import { SetMetadata } from "@nestjs/common";
import { DinagatCapability } from "../contracts";

export const DINAGAT_REQUIRED_CAPABILITIES = "DINAGAT_REQUIRED_CAPABILITIES";

export function RequireCapabilities(...capabilities: DinagatCapability[]) {
  return SetMetadata(DINAGAT_REQUIRED_CAPABILITIES, capabilities);
}
