import { Frame, MapPlayer, Trigger } from "w3ts";
import { ITalentSlot, TalentState } from "../Interfaces/ITalentSlot";
import { ITalentTreeView } from "../Interfaces/ITalentTreeView";
import { DependencyOrientation } from "../Interfaces/ITalentView";
import { Talent } from "../Models/Talent";
import { TalentTree } from "../Models/TalentTree";

export type ViewChanged = (ttvm: BasicTalentTreeViewModel, watcher: MapPlayer) => void;
export const TalentDependencyIndex: Record<DependencyOrientation, (index: number, cols: number) => number> = {
    left: (index: number, cols: number) => index - 1,
    up: (index: number, cols: number) => index + cols,
    right: (index: number, cols: number) => index + 1,
    down: (index: number, cols: number) => index - cols,
}

export class BasicTalentTreeViewModel {

    private _watcher: MapPlayer;
    private _watched = false;
    private _tree: TalentTree | null = null;

    private _view: ITalentTreeView;
    private _showHideFrame: Frame;
    
    private _slots: ITalentSlot[] = [];
    private _onViewChanged: ViewChanged;
    private _talentSlotFactory: (this: void, i: number) => ITalentSlot;
    
    private _frameClickTrigger: Trigger;
    private _frameEvent: Record<number, () => void> = {};

    constructor(
        private cfg: IBasicTalentTreeViewModelConfig,
        watcher: MapPlayer,
        view: ITalentTreeView,
        talentSlotFactory: (i: number) => ITalentSlot,
        onViewChanged: ViewChanged = (ttvm, watcher) => ttvm.ResetTalentViewModels()
    ) {
        this._watcher = watcher;
        this._view = view;
        this._showHideFrame = view.window;
        this._onViewChanged = onViewChanged;
        this._talentSlotFactory = talentSlotFactory;

        this._frameClickTrigger = new Trigger();
        this._frameClickTrigger.triggerRegisterFrameEvent(view.confirm.buttonMain, FRAMEEVENT_CONTROL_CLICK);
        this._frameClickTrigger.triggerRegisterFrameEvent(view.cancel.buttonMain, FRAMEEVENT_CONTROL_CLICK);
        this._frameClickTrigger.triggerRegisterFrameEvent(view.close.buttonMain, FRAMEEVENT_CONTROL_CLICK);

        this._frameEvent[view.confirm.buttonMain.id] = () => this._watcher.handle == GetTriggerPlayer() && this.OnConfirm();
        this._frameEvent[view.cancel.buttonMain.id] = () => this._watcher.handle == GetTriggerPlayer() && this.OnCancel();
        this._frameEvent[view.close.buttonMain.id] = () => this._watcher.handle == GetTriggerPlayer() && this.OnClose();

        this._frameClickTrigger.addAction(() => this.OnFrameButtonClicked());
    }

    OnTalentClicked(index: number) {

        if (!this._watched || !this._tree) return;

        let talent = this._tree.talents[index];
        let tempState = this._tree.tempRankState[index];
        if (this._tree.talentPoints >= talent.cost && tempState < talent.maxRank) {

            this._tree.ApplyTalentTemporary(index);
            
            // Check for link states
            this._tree.UpdateLinkStates();
            this._onViewChanged(this, this._watcher);
        }
    }

    OnConfirm() {

        if (!this._tree) return;
        this._tree.SaveTalentRankState();
        this._onViewChanged(this, this._watcher);
    }

    OnCancel() {

        if (!this._tree) return;
        this._tree.ResetTempRankState();
        this._tree.UpdateLinkStates();
        this._onViewChanged(this, this._watcher);
    }

    OnClose() {
        this.Hide();
    }

    UpdatePointsAndTitle() {
        if (GetLocalPlayer() != this._watcher.handle) return

        if (this._tree) {
            this._view.titleText.text = this._tree.title;
            this._view.backgroundArt.setTexture(this._tree.backgroundImage, 0, true);
        }
    }

    ResetTalentViewModels() {

        if (!this._tree) return;

        try {
            const talents = this._tree.talents;
            for (let i = 0; i < this._slots.length; i++) {

                let slot = this._slots[i];
                let talent = talents[i];

                if (talent) {
                    slot.talent = talents[i];
                    this.UpdateTalentSlot(slot, talent, this._tree, i);
                } else {
                    slot.state = TalentState.Empty;
                }
            }
            this.UpdatePointsAndTitle();
        } catch (ex) {
            print(ex);
        }
    }

    SetTree(tree: TalentTree) {
        this._tree = tree;
        this.ResetTalentViewModels();
    }

    IsWatched() {
        return this._watched;
    }

    Show(): void {

        if (!this._tree) return;
        
        this._watched = true;
        
        // Reorganize the talents
        const tree = this._tree;
        const talents = tree.talents;
        const cols = tree.columns;
        const rows = tree.rows;
        
        let xIncrem = (this.cfg.boxWidth * (1 - this.cfg.sideMargin)) / (cols + 1);
        let yIncrem = (this.cfg.boxHeight * (1 - this.cfg.verticalMargin)) / (rows + 1);

        // Create additional talent views if not enough
        if (tree.maxTalents > this._slots.length) {
            for (let i = this._slots.length; i <= tree.maxTalents; i++) {
                // Create a new slot
                let index = i;
                let slot = this._talentSlotFactory(i);
                this._slots[i] = slot;
                // Set its watcher to this watcher
                slot.watcher = this._watcher;

                this._frameClickTrigger.triggerRegisterFrameEvent(slot.buttonFrame, FRAMEEVENT_CONTROL_CLICK);
                this._frameEvent[slot.buttonFrame.id] = () => this.OnTalentClicked(index);
            }
        }
        
        // Update slots with talent tree data
        this.ResetTalentViewModels();

        // Get max talent count
        let maxTalents = this._slots.length
        
        for (let i = 0; i < maxTalents; i++) {
            
            let slot = this._slots[i];
            
            const xPos = math.floor(math.fmod(i, cols));
            const yPos = math.floor((i) / cols);
            let x = xPos * xIncrem - ((cols - 1) * 0.5) * xIncrem;
            let y = yPos * yIncrem - ((rows - 1) * 0.5) * yIncrem;
            
            slot.moveTo(FramePoint.C, this._view.talentTreeContainer, FramePoint.C, x, y, xIncrem, yIncrem);
            
            let talent = talents[i];
            if (talent) {
                slot.visible = true;
            } else {
                slot.visible = false;
            }
        }

        if (GetLocalPlayer() != this._watcher.handle) return;
        
        this._view.window.visible = true;
        this._view.talentTreeContainer.visible = true;
    }

    Hide(): void {
        this._watched = false
    
        if (GetLocalPlayer() != this._watcher.handle) return

        this._view.window.visible = false;
    }

    UpdateTalentSlot(slot: ITalentSlot, talent: Talent, tree: TalentTree, index: number) {

        let tempState = tree.GetTalentTempState(index);

        let depLeft = tree.CheckDependencyKey(talent.dependency.left, index, index - 1);
        let depUp = tree.CheckDependencyKey(talent.dependency.up, index, index + tree.columns);
        let depRight = tree.CheckDependencyKey(talent.dependency.right, index, index + 1);
        let depDown = tree.CheckDependencyKey(talent.dependency.down, index, index - tree.columns);

        slot.rank = tempState;
        slot.RenderLinks(depLeft, depUp, depRight, depDown);

        if (talent.isLink) {
            slot.state = TalentState.Link;
            return;
        }

        slot.errorText = "";
        let depOk = true;

        let depError: string | undefined;

        if (depLeft.ok && depUp.ok && depRight.ok && depDown.ok) {
            depOk = true;
        } else {
            depOk = false;
            let concatErrs = (err1?: string, err2?: string): string | undefined => err1 && err2 ? err1 + ", " + err2 : (err1 ? err1 : err2 ? err2 : undefined);
            depError = concatErrs(concatErrs(concatErrs(depLeft && depLeft.error, depUp && depUp.error), depRight && depRight.error), depDown && depDown.error);
        }

        let [reqOk, reqError] = tree.CalculateTalentRequirements(index, talent);
        
        if (tempState == talent.maxRank) {
            slot.state = TalentState.Maxed;
        } else if (depOk && reqOk && talent.cost <= tree.talentPoints) {
            slot.state = TalentState.Available;
        } else {
            slot.errorText = depError || "" + reqError || "";

            slot.state = TalentState.RequireDisabled;
            if (reqOk)
                slot.state = TalentState.RequireDisabled;
            else if (depOk)
                slot.state = TalentState.DependDisabled;
        }
    }

    OnFrameButtonClicked() {

        let frameId = Frame.fromEvent().id;
        if (frameId in this._frameEvent) {
            this._frameEvent[frameId]();
        }
    }
}

export interface IBasicTalentTreeViewModelConfig {
    boxWidth: number;
    boxHeight: number;
    sideMargin: number;
    verticalMargin: number;
}

const FramePoint = {
    C: FRAMEPOINT_CENTER,
    T: FRAMEPOINT_TOP,
    B: FRAMEPOINT_BOTTOM,
    TL: FRAMEPOINT_TOPLEFT,
    TR: FRAMEPOINT_TOPRIGHT,
    BL: FRAMEPOINT_BOTTOMLEFT,
    BR: FRAMEPOINT_BOTTOMRIGHT,
    L: FRAMEPOINT_LEFT,
    R: FRAMEPOINT_RIGHT,
}