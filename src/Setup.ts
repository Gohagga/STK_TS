import { Config } from "Config/Config";
import { DruidBalance } from "TalentTrees/DruidBalance";
import { BasicTalentTreeViewModel } from "UI/STK/ViewModels/BasicTalentTreeViewModel";
import { BasicTalentViewModel } from "UI/STK/ViewModels/BasicTalentViewModel";
import { GenerateBasicTalentTreeView } from "UI/STK/Views/BasicTalentTreeView";
import { GenerateBasicTalentView } from "UI/STK/Views/BasicTalentView";
import { MapPlayer, Unit } from "w3ts";
import { Frame } from "w3ts/handles/frame";

export function Initialize() {

    const config = new Config();

    const treeUi = GenerateBasicTalentTreeView(config.talentTreeView, Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0));

    const treeVm = new BasicTalentTreeViewModel(config.talentTreeViewModel, MapPlayer.fromIndex(0), treeUi,
        (i) => new BasicTalentViewModel(config.talentViewModel, GenerateBasicTalentView(config.talentView, treeUi.talentTreeContainer, i.toString())));

    const tree = new DruidBalance(Unit.fromHandle(gg_unit_Hblm_0003));

    treeVm.SetTree(tree);
    treeVm.Show();
}