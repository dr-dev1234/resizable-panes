import { IPaneNumericKeys, IStorePaneModel, addAndRemoveType } from '../@types';
import { ResizeStorage } from '../utils/storage';
export declare class PaneModel {
    id: string;
    pane: any;
    size: number;
    defaultSize: number;
    minSize: number;
    defaultMinSize: number;
    maxSize: number;
    defaultMaxSize: number;
    storedSize: number;
    vertical: boolean;
    axisSize: number;
    visibility: boolean;
    oldVisibleSize: number;
    oldVisibility: boolean;
    constructor(paneProps: any, resizableProps: any, store: ResizeStorage);
    initializeSize(size: number): void;
    initializeSizes(size: number, minSize: number, maxSize: number, storedSize: number, visibility: boolean): void;
    getStoreObj(): IStorePaneModel;
    getSize(): number;
    setVisibilitySize(newSize: number): number;
    addVisibilitySize(sizeChange: number): number;
    removeVisibilitySize(sizeChange: number): number;
    changeSize(sizeChange: number, operation: addAndRemoveType): number;
    setFixSize(size: number): void;
    setUISize(): number;
    registerRef(pane: any): void;
    synPreservedSize(): void;
    synSizeToStored(): void;
    syncAxisSize(): void;
    restore(): void;
    restoreLimits(): void;
    resetMax(reduce?: number): number;
    resetMin(): number;
    synMaxToSize(): number;
    synMinToSize(): number;
    getMinDiff(): number;
    getMaxDiff(): number;
    synSizeToMinSize(): void;
    synSizeToMaxSize(): void;
    toRatioMode(containerSize: number, maxRatioValue: number): void;
    fixChange(key: IPaneNumericKeys, change: number): void;
    setVisibilityNew(visibility: boolean): void;
    setOldVisibilityModel(): void;
    syncToOldVisibilityModel(): void;
}
