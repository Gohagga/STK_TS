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

    print("Generating view...")
    const treeUi = GenerateBasicTalentTreeView(config.talentTreeView, Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0));

    print("Creating viewmodels")
    const treeVm = new BasicTalentTreeViewModel(config.talentTreeViewModel, MapPlayer.fromIndex(0), treeUi,
        (i) => new BasicTalentViewModel(config.talentViewModel, GenerateBasicTalentView(config.talentView, treeUi.talentTreeContainer, i.toString())));

    print("Creating tree...")
    const tree = new DruidBalance(Unit.fromHandle(gg_unit_Hblm_0003));

    print("Setting tree...")
    treeVm.SetTree(tree);
    print("Showing ...")
    treeVm.Show();
}