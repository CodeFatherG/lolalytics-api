import { PatchChange } from '../entities/PatchChange.js';

/**
 * MetaTrendService - Domain service for analyzing patch-to-patch changes
 * Per DDD: Domain service for meta trend analysis
 */
export class MetaTrendService {
  /**
   * Analyze if a champion's meta presence is rising
   */
  public static isRising(patchChange: PatchChange): boolean {
    return (
      patchChange.getWinrateDelta().isBuff() &&
      patchChange.getPickrateDelta().isBuff()
    );
  }

  /**
   * Analyze if a champion's meta presence is falling
   */
  public static isFalling(patchChange: PatchChange): boolean {
    return (
      patchChange.getWinrateDelta().isNerf() &&
      patchChange.getPickrateDelta().isNerf()
    );
  }

  /**
   * Determine the overall trend direction
   */
  public static getTrend(
    patchChange: PatchChange
  ): 'rising' | 'falling' | 'stable' | 'mixed' {
    const wrBuff = patchChange.getWinrateDelta().isBuff();
    const prBuff = patchChange.getPickrateDelta().isBuff();
    const wrNerf = patchChange.getWinrateDelta().isNerf();
    const prNerf = patchChange.getPickrateDelta().isNerf();

    if (wrBuff && prBuff) {
      return 'rising';
    } else if (wrNerf && prNerf) {
      return 'falling';
    } else if (!wrBuff && !wrNerf && !prBuff && !prNerf) {
      return 'stable';
    } else {
      return 'mixed';
    }
  }

  /**
   * Compare magnitude of changes between two patch changes
   * @returns Positive if first has larger changes, negative if second is larger
   */
  public static compareChangeMagnitude(
    change1: PatchChange,
    change2: PatchChange
  ): number {
    const mag1 =
      Math.abs(change1.getWinrateDelta().toNumber()) +
      Math.abs(change1.getPickrateDelta().toNumber()) +
      Math.abs(change1.getBanrateDelta().toNumber());

    const mag2 =
      Math.abs(change2.getWinrateDelta().toNumber()) +
      Math.abs(change2.getPickrateDelta().toNumber()) +
      Math.abs(change2.getBanrateDelta().toNumber());

    return mag1 - mag2;
  }
}
