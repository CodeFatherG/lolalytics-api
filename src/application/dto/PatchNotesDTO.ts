/**
 * PatchChangeDTO - Data Transfer Object for a single patch change
 */
export interface PatchChangeDTO {
  championName: string;
  winrateDelta: string;
  pickrateDelta: string;
  banrateDelta: string;
}

/**
 * PatchNotesCategoryDTO - Patch notes for a single category
 */
export interface PatchNotesCategoryDTO {
  buffed?: PatchChangeDTO[];
  nerfed?: PatchChangeDTO[];
  adjusted?: PatchChangeDTO[];
}

/**
 * PatchNotesDTO - Data Transfer Object for patch notes response
 */
export type PatchNotesDTO = PatchNotesCategoryDTO;
