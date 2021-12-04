import { Unit, MapPlayer } from "w3ts";
import { ITalentBuilder } from "../Interfaces/ITalentBuilder";
import { ITalentTreeBuilder } from "../Interfaces/ITalentTreeBuilder";
import { Talent, TalentData } from "./Talent";

export abstract class TalentTree {

    private _unit: Unit;

    private _talentPoints: number = 0;
    private _title: string = "";
    private _backgroundImage: string = "";
    private _icon : string | null = null;

    private _talents: Talent[] = [];
    private _rankState: number[] = [];
    private _tempRankState?: number[];
    private _linkTalentIndices: number[] = [];

    private _columns = 4;
    private _rows = 7;
    private _maxTalents = 0;

    public abstract Initialize(builder: ITalentTreeBuilder): void;

    abstract talentPoints: number;
    
    constructor(unit: Unit) {
        this._unit = unit;
        this.Initialize(new TalentTreeBuilder(this));
    }

    private AddTalentRaw(x: number, y: number, data: TalentData): Talent {
        let index = x + y * this._columns;
        let talent = new Talent(data);

        if (this._talents[index]) {

            let existing = this._talents[index];
            if (existing.maxRank > 1) {
                existing.RemoveTalentFinalDescription();
                existing.SetLastRank(talent);
                existing.SetTalentFinalDescription();
                existing.UpdateMaxRank();
            } else {
                existing.SetLastRank(talent);
                existing.SetTalentFinalDescription();
                existing.UpdateMaxRank();
            }
        } else {
            this._talents[index] = talent;
            this._rankState[index] = 0;
            this._talents[index].UpdateMaxRank();
            if (index > this._maxTalents) this._maxTalents = index;
        }

        if (talent.isLink)
            this._linkTalentIndices.push(index);

        if (data.StartingLevel)
            this.tempRankState[index] = data.StartingLevel;

        return talent;
    }

    // Api
    public AddTalent(x: number, y: number, talentData: TalentData): Talent {
        if (!talentData.Cost) talentData.Cost = 1;
        let talent = this.AddTalentRaw(x, y, talentData);
        return talent;
    }

    public SetTitle(title: string): void {
        this._title = title;
    }

    public SetColumnsRows(columns: number, rows: number): void {
        this._columns = columns;
        this._rows = rows;
    }

    public SetBackgroundImage(texturePath: string): void {
        this._backgroundImage = texturePath;
    }

    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }

    public get backgroundImage(): string {
        return this._backgroundImage;
    }
    public set backgroundImage(value: string) {
        this._backgroundImage = value;
    }
    
    // Events
    private ActivateTalent(index: number, talent: Talent, rank: number) {
        if (!talent.onActivate) return;
        talent.onActivate({
            unit: this._unit
        });
    }

    private DeactivateTalent(index: number, talent: Talent) {
        if (!talent.onDeactivate) return;
        talent.onDeactivate({
            unit: this._unit
        });
    }

    private AllocateTalent(index: number, talent: Talent): boolean {
        if (!talent.onAllocate) return true;
        talent.onAllocate({
            unit: this._unit
        });
        return true;
    }

    private DeallocateTalent(index: number, talent: Talent) {
        if (!talent.onDeallocate) return;
        talent.onDeallocate({
            unit: this._unit
        });
    }

    public CalculateTalentRequirements(index: number, talent: Talent): [boolean, string?] {
        if (!talent.requirements) return [true];
        let result = talent.requirements({
            unit: this._unit
        });
        return result;
    }

    private ActivateTalentRecursively(index: number, talent: Talent, count: number, rank: number) {
        if (talent.prevRank && count > 1) {
            this.ActivateTalentRecursively(index, talent.prevRank, count - 1, rank);
        }
        this.ActivateTalent(index, talent, rank - count);
    }

    // State changing
    public SaveTalentRankState() {

        if (!this._tempRankState) return;

        for (let i = 0; i <= this._maxTalents; i++) {
            const t = this._talents[i];
            
            if (t) {
                const state = this._rankState[i];
                const tempState = this._tempRankState[i];
                if (state && state != tempState) {

                    let prevRank = t.prevRank;
                    if (prevRank) {
                        this.ActivateTalentRecursively(i, prevRank, tempState - state, tempState + 1);
                    } else {
                        this.ActivateTalentRecursively(i, t, tempState - state, tempState + 1);
                    }
                    this._rankState[i] = tempState;
                }
            }
        }
        this._tempRankState = undefined;
    }

    public ResetTempRankState() {

        if (!this._tempRankState) return;
        try {
            for (let i = 0; i <= this._maxTalents; i++) {
    
                let talent = this._talents[i];
                let tempState = this._tempRankState[i];
    
                if (!talent) continue;

                // Deallocate the level difference
                if (talent && this._rankState[i] != this._tempRankState[i]) {
    
                    if (talent.maxRank == 1 && tempState > this._rankState[i]) {
                        this.DeallocateTalent(i, talent);
                        this.talentPoints += talent.cost;
                    } else {
                        let prevRank = talent.prevRank;
                        let j = tempState;
                        while (j > this._rankState[i] && prevRank) {
                            this.DeallocateTalent(i, prevRank);
                            this.talentPoints += prevRank.cost;
                            prevRank = prevRank.prevRank;
                            j--;
                        }
                    }
                }
    
                // Reset that slot's talent to the lowest one (0)
                tempState = this._tempRankState[i];
                while (--tempState >= 0 && talent.prevRank) {
                    talent = talent.prevRank;
                }
    
                // Level that slot back up to its current rankState
                let lvl = 0;
                while (++lvl < this._rankState[i] && talent.nextRank) {
                    talent = talent.nextRank;
                }
    
                // Save the calculated talent to the tree
                this._talents[i] = talent;
                // For now update tempState to rankState
                this._tempRankState[i] = this._rankState[i];
            }
        } catch (ex) {
        }
        this._tempRankState = undefined;
    }

    public ApplyTalentTemporary(index: number) {
        let talent: Talent = this._talents[index];
        let state = this.tempRankState;

        if (state[index] < talent.maxRank) {
            this.talentPoints -= talent.cost;
            state[index]++;

            // Fire talent allocate event
            if (this.AllocateTalent(index, talent)) {

                if (talent.nextRank) {
                    this._talents[index] = talent.nextRank;
                }
            } else {
                // Rollback
                this.talentPoints += talent.cost;
                state[index]--;
            }
        }
    }

    public CheckDependencyKey(requiredLevel: number | undefined, index: number, depIndex: number): { ok: boolean, error?: string, link: boolean } {

        if (!requiredLevel) return { ok: true, link: false };

        requiredLevel ||= 0;

        let talent = this._talents[index];
        let depTalent = this._talents[depIndex];

        if (!talent || !depTalent) return { ok: false, link: false, error: "ERROR Missing Talent" };

        let resultOk = true;
        let errorText: string = "";

        if (!requiredLevel || !talent) {
            resultOk = true;
            errorText = "";
        } else if (requiredLevel == -1) {
            resultOk = false;
            errorText = "";
        }

        // Get state of dependency talent, or temp state if it exists
        let depState = this._rankState[depIndex];
        if (this._tempRankState) // && depIndex in this._tempRankState)
            depState = this._tempRankState[depIndex];

        if (depState < requiredLevel) {
            resultOk = false;
            errorText = "";
            if (depTalent) {
                errorText = depTalent.name;
                if (depTalent.maxRank > 1) {
                    errorText += " (" + requiredLevel + ")";
                }
            }
        }

        return {
            ok: resultOk,
            error: errorText,
            link: true
        }
    }

    private UpdateLinkState(index: number): number {
        let talent = this._talents[index];
        let level = 0;

        if (talent && talent.isLink) {
            if (talent.dependency.left) {
                let depIndex = index - 1;
                let requiredLevel = talent.dependency.left;
                if (this._talents[depIndex] && this._talents[depIndex].isLink)
                    this.UpdateLinkState(depIndex);
                let depResult = this.CheckDependencyKey(requiredLevel, index, depIndex);
                if (depResult && depResult.ok)
                    level++;
            }
            if (talent.dependency.up) {
                let depIndex = index + this._columns;
                let requiredLevel = talent.dependency.up;
                if (this._talents[depIndex] && this._talents[depIndex].isLink)
                    this.UpdateLinkState(depIndex);
                let depResult = this.CheckDependencyKey(requiredLevel, index, depIndex);
                if (depResult && depResult.ok)
                    level++;
            }
            if (talent.dependency.right) {
                let depIndex = index + 1;
                let requiredLevel = talent.dependency.right;
                if (this._talents[depIndex] && this._talents[depIndex].isLink)
                    this.UpdateLinkState(depIndex);
                let depResult = this.CheckDependencyKey(requiredLevel, index, depIndex);
                if (depResult && depResult.ok)
                    level++;
            }
            if (talent.dependency.down) {
                let depIndex = index - this._columns;
                let requiredLevel = talent.dependency.down;
                if (this._talents[depIndex] && this._talents[depIndex].isLink)
                    this.UpdateLinkState(depIndex);
                let depResult = this.CheckDependencyKey(requiredLevel, index, depIndex);
                if (depResult && depResult.ok)
                    level++;
            }

            this._rankState[index] = level;
            if (this._tempRankState)
                this._tempRankState[index] = level;
        }

        return level;
    }

    public UpdateLinkStates() {
        
        for (let i of this._linkTalentIndices) {
            this.UpdateLinkState(i);
        }
    }

    public get isDirty(): boolean {
        return !this._tempRankState;
    }
    public get unit(): Unit {
        return this._unit;
    }
    public get ownerPlayer(): MapPlayer {
        return this._unit.owner;
    }
    public get talents() {
        return this._talents;
    }
    public get columns() {
        return this._columns;
    }
    public get rows() {
        return this._rows;
    }
    public get maxTalents() {
        return this._maxTalents;
    }

    public get tempRankState(): number[] {
        if (!this._tempRankState) {
            this._tempRankState = [];
            for (let i = 0; i <= this._maxTalents; i++) {
                this._tempRankState[i] = this._rankState[i];
            }
        }
        return this._tempRankState;
    }

    public GetTalentTempState(index: number) {
        if (!this._tempRankState)
            return this._rankState[index];
        return this._tempRankState[index];
    }
}

class TalentTreeBuilder implements ITalentTreeBuilder {
    
    constructor(private tree: TalentTree) {
        
    }

    get title() { return this.tree.title; }
    set title(v: string) { this.tree.title = v; }
    get talentPoints() { return this.tree.talentPoints; }
    set talentPoints(v: number) { this.tree.talentPoints = v; }
    get backgroundImage() { return this.tree.backgroundImage; }
    set backgroundImage(v: string) { this.tree.backgroundImage = v; }

    AddTalent(x: number, y: number, talentData: TalentData): ITalentBuilder {
        this.tree.AddTalent(x, y, talentData);
        return {
            NextRank: (next: TalentData) => this.AddTalent(x, y, next)
        }
    }

    SetColumnsRows(columns: number, rows: number): void {
        this.tree.SetColumnsRows(columns, rows);
    }

    AddMultirankTalent(x: number, y: number, maxRank: number, talentDataBuilder: (level: number) => TalentData): ITalentTreeBuilder {
        
        for (let i = 1; i <= maxRank; i++) {
            this.AddTalent(x, y, talentDataBuilder(i));
        }
        return this;
    }
}