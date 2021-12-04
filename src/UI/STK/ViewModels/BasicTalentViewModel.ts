import { Frame, MapPlayer } from "w3ts";
import { ITalentSlot, LinkInfo, TalentState } from "../Interfaces/ITalentSlot";
import { DependencyOrientation, ITalentView } from "../Interfaces/ITalentView";
import { Talent } from "../Models/Talent";

export class BasicTalentViewModel implements ITalentSlot {

    private _view: ITalentView;
    public watcher: MapPlayer = MapPlayer.fromIndex(12);
    
    private _state: TalentState = TalentState.Empty;
    private _rank: number = 0;
    private _talent: Talent | null = null;

    private _errorText: string | null = null;
    private _visible: boolean = true;
    private _isAvailable: boolean = false;
    public index: number = 0;
    
    private _linkVisibility = {
        left: false,
        up: false,
        right: false,
        down: false,
    }
    private _cfg: IBasicTalentViewModelConfig;

    /**Calls local blocks.*/
    RenderView() {


        let cost = (this._talent && this._talent.cost) || 0;
        switch (this._state) {
            case TalentState.Empty:
                this.visible = false;
                break;

            case TalentState.RequireDisabled:
                this.SetTooltip(this._errorText, cost);
                this.rank = this._rank;
                this.available = false;
                break;

            case TalentState.DependDisabled:
                this.SetTooltip(this._errorText, cost);
                this.rank = this._rank;
                this.available = false;
                break;

            case TalentState.Available:
                this.SetTooltip(this._errorText, cost);
                this.rank = this._rank;
                this.available = true;
                break;

            case TalentState.Maxed:
                this.SetTooltip(this._errorText, 0);
                this.rank = this._rank;
                this.SetMaxed();
                break;

            case TalentState.Link:
                this.SetAsLink();
                break;
        }
    }
    
    public SetTooltip(requirements: string | null, cost: number) {

        let description = "";
        let text = "";

        if (GetLocalPlayer() != this.watcher.handle || !this._talent) return;
        
        let t = this._talent;
        description = t.description;
        if (t.nextRank && t.prevRank)
            description = t.prevRank.description + "\n\nNext rank:\n" + description;

        text = t.name;
        if (cost > 0) {
            text += "\n\n|cffffc04d[Cost " + I2S(cost) + "]|r ";
        }
        try {
            
            if ((cost > 0) && requirements && (requirements != "")) {
                text += "|cffff6450Requires: " + requirements + "|r\n\n" + description;
            } else if (requirements && (requirements != "")) {
                text += "\n\n|cffff6450Requires: " + requirements + "|r\n\n" + description
            }
            else {
                text += "\n\n" + description;
            }
        } catch (ex) {
            print(ex);
        }

        this._view.tooltip.text.text = text;
    }

    public set available(v : boolean) {
        
        this._isAvailable = v;
        if (!this._talent) return;

        
        let texture = this._talent.iconDisabled;
        if (this._rank && this._rank > 0)
            texture = this._talent.iconEnabled;
        
        if (GetLocalPlayer() != this.watcher.handle) return;
        this._view.button.image.setTexture(texture, 0, true);
        this._view.button.main.enabled = v;
        this._view.highlight.visible = v;
    }


    public SetMaxed() {

        if (!this._talent) return;

        this._isAvailable = false;
        this.SetTooltip(null, 0);

        if (GetLocalPlayer() != this.watcher.handle) return;
        this._view.button.image.setTexture(this._talent.iconEnabled, 0, true);
        this._view.button.main.enabled = false;
        this._view.highlight.visible = false;
    }

    public get name() {
        return this._talent && this._talent.name || "";
    }
    
    constructor(cfg: IBasicTalentViewModelConfig, view: ITalentView) {
        this._view = view;
        this._cfg = cfg;
    }

    RenderLinks(depLeft: LinkInfo, depUp: LinkInfo, depRight: LinkInfo, depDown: LinkInfo): void {
        
        this._linkVisibility.left = depLeft.link;
        this._linkVisibility.up = depUp.link;
        this._linkVisibility.right = depRight.link;
        this._linkVisibility.down = depDown.link;

        if (GetLocalPlayer() != this.watcher.handle) return;

        this.UpdateLinkVisibility();

        if (depLeft.ok) this._view.links.left.setTexture(this._cfg.activeLinkTexture, 0, true);
        else this._view.links.left.setTexture(this._cfg.inactiveLinkTexture, 0, true);
        if (depUp.ok) this._view.links.up.setTexture(this._cfg.activeLinkTexture, 0, true);
        else this._view.links.up.setTexture(this._cfg.inactiveLinkTexture, 0, true);
        if (depRight.ok) this._view.links.right.setTexture(this._cfg.activeLinkTexture, 0, true);
        else this._view.links.right.setTexture(this._cfg.inactiveLinkTexture, 0, true);
        if (depDown.ok) this._view.links.down.setTexture(this._cfg.activeLinkTexture, 0, true);
        else this._view.links.down.setTexture(this._cfg.inactiveLinkTexture, 0, true);
    }

    moveTo(point: framepointtype, relative: Frame, relativePoint: framepointtype, x: number, y: number, linkWidth: number, linkHeight: number): void {

        let width = this._view.links.up.width;
        let height = this._view.links.left.height;

        if (GetLocalPlayer() != this.watcher.handle) return;

        this._view.button.main.setPoint(point, relative, relativePoint, x, y);

        this._view.links.left.clearPoints();
        this._view.links.left.setPoint(FramePoint.R, this._view.button.main, FramePoint.C, 0, 0);
        this._view.links.left.setSize(linkWidth, height);

        this._view.links.up.clearPoints();
        this._view.links.up.setPoint(FramePoint.B, this._view.button.main, FramePoint.C, 0, 0);
        this._view.links.up.setSize(width, linkHeight);

        this._view.links.right.clearPoints();
        this._view.links.right.setPoint(FramePoint.L, this._view.button.main, FramePoint.C, 0, 0);
        this._view.links.right.setSize(linkWidth, height);

        this._view.links.down.clearPoints();
        this._view.links.down.setPoint(FramePoint.T, this._view.button.main, FramePoint.C, 0, 0);
        this._view.links.down.setSize(width, linkHeight);
    }

    SetAsLink() {
        if (GetLocalPlayer() != this.watcher.handle) return;

        this._view.highlight.visible = false;
        
        if (this._talent && this._talent.iconEnabled && this._talent.iconEnabled != "") {
            this._view.button.main.visible = true;
            this._view.button.main.enabled = false;
            
            if (this._rank && this._rank > 0)
                this._view.button.image.setTexture(this._talent.iconEnabled, 0, true);
        } else {
            this._view.button.main.visible = false;
            this._view.linkIntersection.visible = true;
            if (this.rank > 0)
                this._view.linkIntersection.setTexture(this._cfg.activeLinkTexture, 0, true);
            else
                this._view.linkIntersection.setTexture(this._cfg.inactiveLinkTexture, 0, true);
        }

        this.UpdateLinkVisibility();
    }

    UpdateLinkVisibility() {
        if (GetLocalPlayer() != this.watcher.handle) return;

        this._view.links.down.visible = this._linkVisibility.down;
        this._view.links.right.visible = this._linkVisibility.right;
        this._view.links.up.visible = this._linkVisibility.up;
        this._view.links.left.visible = this._linkVisibility.left;
    }

    public get visible(): boolean {
        return this._visible;
    }

    /**Changes view. */
    public set visible(v: boolean) {
        
        this._visible = v;

        if (GetLocalPlayer() != this.watcher.handle) return;

        if (this.talent && this.talent.isLink) {
            this._view.linkIntersection.visible = v && this.talent.isLink;
            return;
        }

        this._view.linkIntersection.visible = false;
        this._view.button.main.visible = v;
        this._view.highlight.visible = v && this._isAvailable;

        this._view.links.down.visible = v && this._linkVisibility.down;
        this._view.links.right.visible = v && this._linkVisibility.right;
        this._view.links.up.visible = v && this._linkVisibility.up;
        this._view.links.left.visible = v && this._linkVisibility.left;
    }

    public get talent(): Talent | null {
        return this._talent;
    }
    /**Changes view. */
    public set talent(v: Talent | null) {
        this._talent = v;
        this.RenderView();
    }
    public get rank(): number {
        return this._rank;
    }
    /**Changes view. */
    public set rank(v: number) {
        
        this._rank = v;

        if (!this.talent) return;

        let rankText = v.toString() + "/" + this.talent.maxRank;
        let tooltip = "Rank " + rankText;

        if (GetLocalPlayer() != this.watcher.handle) return;
        if (this.talent.maxRank == 1) {
            this._view.rank.image.visible = false;
            this._view.rank.text.visible = false;
        } else {
            this._view.rank.image.visible = true;
            this._view.rank.text.visible = true;
            this._view.rank.text.text = rankText;
        }
        this._view.tooltip.rank.text = tooltip;
    }
    public get state() : TalentState {
        return this._state;
    }
    /**Changes view. */
    public set state(v : TalentState) {
        this._state = v;
        this.RenderView();
    }
    
    public set errorText(v: string | null) {
        this._errorText = v;
    }

    public get buttonFrame(): Frame {
        return this._view.button.main;
    }
}

export interface IBasicTalentViewModelConfig {
    activeLinkTexture: string;
    inactiveLinkTexture: string;
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