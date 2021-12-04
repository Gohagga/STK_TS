import { Frame, MapPlayer } from "w3ts";
import { Talent } from "../Models/Talent";

export type LinkInfo = { ok: boolean, error?: string, link: boolean }

export interface ITalentSlot {
    
    visible: boolean;
    
    watcher: MapPlayer;
    talent: Talent | null;
    rank: number;
    index: number;
    state: TalentState;
    errorText: string | null;

    moveTo(point: framepointtype, relative: Frame, relativePoint: framepointtype, x: number, y: number, linkWidth: number, linkHeight: number): void;
    RenderLinks(depLeft: LinkInfo, depUp: LinkInfo, depRight: LinkInfo, depDown: LinkInfo): void;

    readonly buttonFrame: Frame;
}

export const enum TalentState {
    /**Talent does not exist in this slot.*/
    Empty = 0,
    /**Talent in this slot cannot be taken due to missing requirements.*/
    RequireDisabled = 1,
    /**Talent in this slot requires certain level of another adjacent talent.*/
    DependDisabled = 2,
    /**Talent in this slot only acts as a link.*/
    Link = 3,
    /**Talent is available to take points in.*/
    Available = 4,
    /**Talent in this slot is disabled due to being maxed out in levels.*/
    Maxed = 5
}