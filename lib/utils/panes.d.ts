import { ReactNode } from 'react';
import { IResizablePaneProviderProps, IResizablePanesProps, addAndRemoveType } from '../@types';
import { PaneModel } from '../models/pane-model';
import { ResizeStorage } from './storage';
import { ResizerModel } from '../models/resizer-model';
export declare const syncAxisSizesFn: (panesList: PaneModel[]) => void;
export declare const setUISizesFn: (modelList: PaneModel[] | ResizerModel[]) => void;
export declare const setUISizesOfAllElement: (panesList: PaneModel[], resizersList: ResizerModel[]) => void;
export declare function getSum<T>(list: T[], getNumber: (item: T) => number, start?: number, end?: number): number;
export declare const getSizeByIndexes: (panesList: PaneModel[], indexList: number[]) => number;
export declare const synPanesMaxToSize: (panesList: PaneModel[], start: number, end: number) => number;
export declare const synPanesMinToSize: (panesList: PaneModel[], start: number, end: number) => number;
export declare const getPanesSizeSum: (panesList: PaneModel[], start?: number, end?: number) => number;
export declare const getResizerSum: (resizersList: ResizerModel[], start: number, end: number) => number;
export declare const getMaxSizeSum: (panesList: PaneModel[], start: number, end: number) => number;
export declare const getMinSizeSum: (panesList: PaneModel[], start: number, end: number) => number;
export declare const setDownMaxLimits: (panesList: PaneModel[], index: number) => void;
export declare const setUpMaxLimits: (panesList: PaneModel[], index: number) => void;
export declare const findIndexInChildrenbyId: (children: any, _id: string) => any;
export declare const change1PixelToPanes: (panesList: PaneModel[], sizeChange: number, operation: addAndRemoveType) => void;
export declare const createPaneModelList: (children: ReactNode[], props: IResizablePanesProps, store: ResizeStorage) => PaneModel[];
export declare const createResizerModelList: (children: ReactNode[], resizerSize: IResizablePaneProviderProps, store: ResizeStorage) => ResizerModel[];
